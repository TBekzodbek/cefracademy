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

/** Generates a code like CEFR-A3F2-9ZQ1 */
function makeCode(prefix = 'CEFR'): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I confusion
    const rand4 = () => Array.from(
        { length: 4 },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return `${prefix}-${rand4()}-${rand4()}`;
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

    try {
        const supabaseUrl    = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const anonKey        = Deno.env.get('SUPABASE_ANON_KEY')!;
        const adminEmail     = Deno.env.get('ADMIN_EMAIL') ?? '';

        /* ── 1. Auth — only the admin user may call this ── */
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return respond({ error: 'Unauthorized' }, 401);

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: userErr } = await userClient.auth.getUser();
        if (userErr || !user) return respond({ error: 'Unauthorized' }, 401);

        if (!adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
            console.warn('[admin-generate-promo] unauthorized attempt by:', user.email);
            return respond({ error: 'Forbidden' }, 403);
        }

        /* ── 2. Parse body ── */
        let body: { count?: number; prefix?: string; note?: string; expires_at?: string };
        try { body = await req.json(); }
        catch { return respond({ error: 'Invalid JSON body' }, 400); }

        const count     = Math.min(Math.max(Number(body.count ?? 1), 1), 100);
        const prefix    = String(body.prefix ?? 'CEFR').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CEFR';
        const note      = body.note ? String(body.note).slice(0, 120) : null;
        const expiresAt = body.expires_at ? new Date(body.expires_at).toISOString() : null;

        /* ── 3. Generate unique codes ── */
        const admin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // Fetch existing codes to avoid collisions
        const { data: existing } = await admin.from('promo_codes').select('code');
        const existingSet = new Set((existing ?? []).map((r: { code: string }) => r.code));

        const codes: string[] = [];
        let attempts = 0;
        while (codes.length < count && attempts < count * 20) {
            const c = makeCode(prefix);
            if (!existingSet.has(c) && !codes.includes(c)) codes.push(c);
            attempts++;
        }

        if (codes.length < count) {
            return respond({ error: 'Could not generate enough unique codes. Try a different prefix.' }, 500);
        }

        /* ── 4. Insert into DB ── */
        const rows = codes.map(code => ({
            code,
            note,
            expires_at: expiresAt,
            created_by: user.id,
        }));

        const { data: inserted, error: insertErr } = await admin
            .from('promo_codes')
            .insert(rows)
            .select('id, code, created_at, expires_at, note');

        if (insertErr) {
            console.error('[admin-generate-promo] insert error:', insertErr.message);
            return respond({ error: `DB insert failed: ${insertErr.message}` }, 500);
        }

        console.log(`[admin-generate-promo] generated ${codes.length} codes for admin ${user.email}`);
        return respond({ success: true, codes: inserted }, 200);

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Internal server error';
        console.error('[admin-generate-promo] unhandled:', msg);
        return respond({ error: msg }, 500);
    }
});
