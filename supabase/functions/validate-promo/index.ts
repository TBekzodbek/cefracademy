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

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

    try {
        const supabaseUrl    = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const anonKey        = Deno.env.get('SUPABASE_ANON_KEY')!;

        /* ── 1. Authenticate the calling user ── */
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return respond({ error: 'Unauthorized' }, 401);

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: userErr } = await userClient.auth.getUser();
        if (userErr || !user) return respond({ error: 'Unauthorized' }, 401);

        console.log('[validate-promo] user:', user.id);

        /* ── 2. Parse body ── */
        let body: { code?: string };
        try { body = await req.json(); }
        catch { return respond({ error: 'Invalid JSON body' }, 400); }

        const code = String(body.code ?? '').trim().toUpperCase();
        if (!code) return respond({ error: 'Promo code is required.' }, 400);

        /* ── 3. Admin client for all DB ops ── */
        const admin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        /* ── 4. Short-circuit if already verified ── */
        const { data: profile } = await admin
            .from('profiles')
            .select('promo_verified')
            .eq('id', user.id)
            .single();

        if (profile?.promo_verified) {
            console.log('[validate-promo] already verified:', user.id);
            return respond({ success: true, already: true }, 200);
        }

        /* ── 5. Atomically claim the code ── */
        // Only succeeds if the row exists, is_used = false, and not expired.
        const now = new Date().toISOString();
        const { data: claimed, error: claimErr } = await admin
            .from('promo_codes')
            .update({
                is_used: true,
                used_by: user.id,
                used_at: now,
            })
            .eq('code', code)
            .eq('is_used', false)
            .or(`expires_at.is.null,expires_at.gt.${now}`)
            .select('id')
            .maybeSingle();

        console.log('[validate-promo] claim result:', claimed?.id ?? 'not found', claimErr?.message ?? 'ok');

        if (!claimed) {
            return respond({ error: 'Invalid or already-used promo code. Please check and try again.' }, 400);
        }

        /* ── 6. Mark the user as verified ── */
        const { error: profErr } = await admin
            .from('profiles')
            .update({ promo_verified: true })
            .eq('id', user.id);

        if (profErr) {
            console.error('[validate-promo] profile update failed:', profErr.message);
            return respond({ error: 'Verification failed — please try again.' }, 500);
        }

        console.log('[validate-promo] success for user:', user.id);
        return respond({ success: true }, 200);

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Internal server error';
        console.error('[validate-promo] unhandled:', msg);
        return respond({ error: msg }, 500);
    }
});
