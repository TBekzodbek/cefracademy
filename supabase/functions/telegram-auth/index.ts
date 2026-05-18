import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function respond(body: object, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function sha256(msg: string): Promise<ArrayBuffer> {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
}
async function hmac256(key: ArrayBuffer, msg: string): Promise<ArrayBuffer> {
    const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg));
}
function hex(buf: ArrayBuffer) {
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        /* ── 1. env vars ─────────────────────────────── */
        const botToken        = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const supabaseUrl     = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        if (!botToken) {
            console.error('[tg-auth] TELEGRAM_BOT_TOKEN not set');
            return respond({ error: 'Server misconfiguration: TELEGRAM_BOT_TOKEN not set' }, 500);
        }
        console.log('[tg-auth] bot token prefix:', botToken.split(':')[0]);

        /* ── 2. parse body ────────────────────────────── */
        let body: Record<string, string | number>;
        try { body = await req.json(); }
        catch { return respond({ error: 'Invalid JSON body' }, 400); }

        const { hash, ...userData } = body;
        if (!hash || !userData.id || !userData.auth_date) {
            return respond({ error: `Missing fields. Received: ${Object.keys(body).join(', ')}` }, 400);
        }

        /* ── 3. check freshness (<1 h) ────────────────── */
        const age = Math.floor(Date.now() / 1000) - Number(userData.auth_date);
        console.log('[tg-auth] auth_date age:', age, 's');
        if (age > 3600) return respond({ error: `Auth data expired (${age}s). Please try again.` }, 401);

        /* ── 4. verify HMAC-SHA256 ────────────────────── */
        const checkStr = Object.entries(userData)
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([k, v]) => `${k}=${v}`)
            .join('\n');
        const secret      = await sha256(botToken);
        const computed    = hex(await hmac256(secret, checkStr));
        const hashMatches = computed === String(hash);
        console.log('[tg-auth] fields:', Object.keys(userData).join(','), '| match:', hashMatches);

        if (!hashMatches) {
            return respond({
                error: `Hash mismatch. Bot ID in token: ${botToken.split(':')[0]}. ` +
                       `Make sure data-telegram-login uses this same bot.`,
            }, 401);
        }

        /* ── 5. derive stable credentials ────────────── */
        const telegramId = Number(userData.id);
        const email      = `tg_${telegramId}@cefracademy.uz`;

        // password = HMAC(botToken, telegramId) — deterministic, server-only
        const pwKey = await crypto.subtle.importKey(
            'raw', new TextEncoder().encode(botToken),
            { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        );
        const password = hex(await crypto.subtle.sign(
            'HMAC', pwKey, new TextEncoder().encode(telegramId.toString())
        ));

        const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(' ');
        console.log('[tg-auth] email:', email);

        /* ── 6. admin client (single client for everything) ── */
        const admin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        /* ── 7. upsert user via admin ─────────────────── */
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name:         fullName,
                telegram_id:       telegramId,
                telegram_username: userData.username  ?? null,
                avatar_url:        userData.photo_url ?? null,
            },
        });
        console.log('[tg-auth] createUser:', created?.user?.id ?? 'exists', createErr?.message ?? 'ok');

        if (createErr && !createErr.message.includes('already been registered')) {
            return respond({ error: `createUser failed: ${createErr.message}` }, 500);
        }

        // seed profile row for brand-new users
        if (created?.user) {
            await admin.from('profiles').upsert(
                { id: created.user.id, full_name: fullName, xp: 0, streak: 0, cefr_level: 'A2' },
                { onConflict: 'id', ignoreDuplicates: true }
            );
        }

        /* ── 8. sign in → get session ─────────────────── */
        // Use the admin (service-role) client's signInWithPassword —
        // avoids the extra round-trip overhead of a separate anon client.
        const { data: signIn, error: signInErr } = await admin.auth.signInWithPassword({ email, password });
        console.log('[tg-auth] signIn:', signIn?.session ? 'session ok' : 'no session', signInErr?.message ?? '');

        if (signInErr || !signIn?.session) {
            const msg = signInErr?.message || 'No session returned';
            return respond({ error: `signIn failed: ${msg}` }, 500);
        }

        console.log('[tg-auth] success for tg id', telegramId);
        return respond({ session: signIn.session, user: signIn.user }, 200);

    } catch (err: unknown) {
        const msg = (err instanceof Error && err.message) ? err.message : 'Internal server error';
        console.error('[tg-auth] unhandled:', msg);
        return respond({ error: msg }, 500);
    }
});
