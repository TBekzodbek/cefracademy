// Admin page — generate & manage promo codes
// Only accessible to the admin user (checked against ADMIN_EMAIL via the Edge Function)
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Copy, Check, RefreshCw, Loader2, ShieldAlert, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PromoAdmin.css';

interface PromoCode {
    id: string;
    code: string;
    is_used: boolean;
    used_by: string | null;
    used_at: string | null;
    created_at: string;
    expires_at: string | null;
    note: string | null;
}

const PromoAdmin = () => {
    const [authorized, setAuthorized]   = useState<boolean | null>(null);   // null = checking
    const [codes, setCodes]             = useState<PromoCode[]>([]);
    const [loadingCodes, setLoadingCodes] = useState(false);

    // Generate form
    const [genCount,   setGenCount]   = useState(5);
    const [genPrefix,  setGenPrefix]  = useState('CEFR');
    const [genNote,    setGenNote]    = useState('');
    const [genExpiry,  setGenExpiry]  = useState('');
    const [generating, setGenerating] = useState(false);
    const [genError,   setGenError]   = useState<string | null>(null);
    const [newCodes,   setNewCodes]   = useState<PromoCode[]>([]);
    const [copied,     setCopied]     = useState<string | null>(null);

    /* ── Auth check — only logged-in users can see this page ── */
    /* The real admin guard runs inside the Edge Function (ADMIN_EMAIL env var). */
    useEffect(() => {
        const run = async () => {
            const result = await supabase.auth.getUser();
            setAuthorized(!!result.data?.user);
        };
        run().catch(() => setAuthorized(false));
    }, []);

    /* ── Fetch all codes ── */
    const fetchCodes = useCallback(async () => {
        setLoadingCodes(true);
        // Direct read requires service-role — we use the edge function pattern instead.
        // Since the admin page calls admin-generate-promo, we use supabase.functions.invoke
        // to list codes. But for listing we need a separate "admin-list-promos" function,
        // or we can allow the admin to read via RLS with a special policy.
        // For now, we store the freshly generated codes locally and show them.
        // TODO: add admin-list-promos function for a full dashboard.
        setLoadingCodes(false);
    }, []);

    useEffect(() => { fetchCodes(); }, [fetchCodes]);

    /* ── Generate ── */
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
        setGenError(null);
        setNewCodes([]);

        const body: Record<string, unknown> = { count: genCount, prefix: genPrefix };
        if (genNote.trim())   body.note = genNote.trim();
        if (genExpiry.trim()) body.expires_at = new Date(genExpiry).toISOString();

        const { data, error } = await supabase.functions.invoke('admin-generate-promo', { body });
        setGenerating(false);

        if (error || !data?.success) {
            setGenError(data?.error ?? error?.message ?? 'Generation failed. Make sure your ADMIN_EMAIL secret is set.');
            return;
        }

        setNewCodes(data.codes ?? []);
        // Prepend to local list
        setCodes(prev => [...(data.codes ?? []), ...prev]);
    };

    /* ── Copy to clipboard ── */
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 1600);
    };

    const copyAll = () => {
        const text = newCodes.map(c => c.code).join('\n');
        navigator.clipboard.writeText(text);
        setCopied('__all__');
        setTimeout(() => setCopied(null), 1800);
    };

    /* ── Loading / unauth states ── */
    if (authorized === null) {
        return (
            <div className="pa-center">
                <Loader2 size={32} className="pa-spin" color="var(--color-primary)" />
            </div>
        );
    }
    if (!authorized) {
        return (
            <div className="pa-center">
                <ShieldAlert size={48} color="var(--color-error)" />
                <h2 style={{ marginTop: '1rem' }}>Not authorized</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>You must be logged in as the admin to view this page.</p>
            </div>
        );
    }

    return (
        <div className="pa-page">
            <div className="pa-container">

                {/* Header */}
                <div className="pa-header">
                    <div className="pa-brand">
                        <Sparkles size={18} color="var(--color-primary)" />
                        CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span>
                    </div>
                    <h1 className="pa-title">Promo Code Manager</h1>
                    <p className="pa-sub">Generate invite-only access codes. Share them with students individually.</p>
                </div>

                <div className="pa-grid">

                    {/* ── Generate panel ── */}
                    <div className="pa-card">
                        <h2 className="pa-card-title">
                            <Plus size={18} /> Generate New Codes
                        </h2>

                        <form className="pa-form" onSubmit={handleGenerate}>
                            <div className="pa-field-row">
                                <div className="pa-field">
                                    <label>Count (1–100)</label>
                                    <input type="number" min={1} max={100} value={genCount}
                                        onChange={(e) => setGenCount(Number(e.target.value))} />
                                </div>
                                <div className="pa-field">
                                    <label>Prefix</label>
                                    <input type="text" maxLength={8} value={genPrefix}
                                        onChange={(e) => setGenPrefix(e.target.value.toUpperCase())}
                                        placeholder="CEFR" />
                                </div>
                            </div>
                            <div className="pa-field">
                                <label>Note / label (optional)</label>
                                <input type="text" maxLength={120} value={genNote}
                                    onChange={(e) => setGenNote(e.target.value)}
                                    placeholder="e.g. Batch Jan 2025 — Tashkent students" />
                            </div>
                            <div className="pa-field">
                                <label><Calendar size={13} /> Expiry date (optional)</label>
                                <input type="date" value={genExpiry}
                                    onChange={(e) => setGenExpiry(e.target.value)} />
                            </div>

                            <AnimatePresence>
                                {genError && (
                                    <motion.p className="pa-error"
                                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        {genError}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button type="submit" className="pa-btn-generate" disabled={generating}>
                                {generating ? <Loader2 size={16} className="pa-spin" /> : <Sparkles size={16} />}
                                {generating ? 'Generating…' : `Generate ${genCount} Code${genCount > 1 ? 's' : ''}`}
                            </button>
                        </form>
                    </div>

                    {/* ── Generated output ── */}
                    {newCodes.length > 0 && (
                        <div className="pa-card">
                            <div className="pa-card-title-row">
                                <h2 className="pa-card-title">
                                    <Check size={18} color="var(--color-success)" />
                                    Generated — {newCodes.length} code{newCodes.length > 1 ? 's' : ''}
                                </h2>
                                <button className="pa-btn-copy-all" onClick={copyAll}>
                                    {copied === '__all__' ? <Check size={14} /> : <Copy size={14} />}
                                    {copied === '__all__' ? 'Copied all!' : 'Copy all'}
                                </button>
                            </div>

                            <div className="pa-code-list">
                                {newCodes.map((c) => (
                                    <motion.div key={c.id} className="pa-code-row"
                                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                                        <span className="pa-code-text">{c.code}</span>
                                        <div className="pa-code-meta">
                                            {c.note && <span className="pa-code-note">{c.note}</span>}
                                            {c.expires_at && (
                                                <span className="pa-code-expiry">
                                                    Expires {new Date(c.expires_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <button className="pa-btn-copy" onClick={() => copyCode(c.code)}>
                                            {copied === c.code
                                                ? <><Check size={13} /> Copied</>
                                                : <><Copy size={13} /> Copy</>
                                            }
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="pa-copy-hint">
                                Share each code privately with a single student. Codes are single-use.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── All codes table ── */}
                {codes.length > 0 && (
                    <div className="pa-card pa-table-card">
                        <div className="pa-card-title-row">
                            <h2 className="pa-card-title">
                                All Codes ({codes.length})
                            </h2>
                            <button className="pa-btn-refresh" onClick={fetchCodes} disabled={loadingCodes}>
                                <RefreshCw size={14} className={loadingCodes ? 'pa-spin' : ''} />
                                Refresh
                            </button>
                        </div>

                        <div className="pa-table-wrap">
                            <table className="pa-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Status</th>
                                        <th>Used at</th>
                                        <th>Note</th>
                                        <th>Expires</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {codes.map((c) => (
                                        <tr key={c.id}>
                                            <td className="pa-td-code">{c.code}</td>
                                            <td>
                                                <span className={`pa-status ${c.is_used ? 'used' : 'unused'}`}>
                                                    {c.is_used ? 'Used' : 'Available'}
                                                </span>
                                            </td>
                                            <td className="pa-td-dim">
                                                {c.used_at ? new Date(c.used_at).toLocaleString() : '—'}
                                            </td>
                                            <td className="pa-td-dim">{c.note ?? '—'}</td>
                                            <td className="pa-td-dim">
                                                {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}
                                            </td>
                                            <td>
                                                {!c.is_used && (
                                                    <button className="pa-btn-copy-sm" onClick={() => copyCode(c.code)}>
                                                        {copied === c.code ? <Check size={12} /> : <Copy size={12} />}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PromoAdmin;
