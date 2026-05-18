// PromoGate — blocks the dashboard until a valid promo code is entered
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, CheckCircle, Loader2, ArrowRight, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PromoGate.css';

interface Props {
    onVerified: () => void;
    lang: 'en' | 'uz';
    loading?: boolean;  // true while DashboardLayout is still doing its DB check
}

const PromoGate = ({ onVerified, lang, loading = false }: Props) => {
    const [code, setCode]         = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]       = useState<string | null>(null);
    const [success, setSuccess]   = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const uz = lang === 'uz';

    useEffect(() => {
        if (!loading) setTimeout(() => inputRef.current?.focus(), 300);
    }, [loading]);

    const handleInput = (v: string) => {
        setCode(v.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = code.trim();
        if (!trimmed) return;

        setSubmitting(true);
        setError(null);

        try {
            const { data, error: fnErr } = await supabase.functions.invoke('validate-promo', {
                body: { code: trimmed },
            });

            if (fnErr) {
                // If the function doesn't exist yet (404/500) give a clear message
                const isSetupError = fnErr.message?.includes('404') ||
                    fnErr.message?.toLowerCase().includes('not found') ||
                    fnErr.message?.toLowerCase().includes('failed to fetch');
                throw new Error(
                    isSetupError
                        ? (uz
                            ? 'Tizim sozlanmoqda. Keyinroq urinib ko\'ring yoki admin bilan bog\'laning.'
                            : 'System is being set up. Please try again shortly or contact the admin.')
                        : (fnErr.message || 'Function error')
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.error ||
                    (uz ? 'Noto\'g\'ri kod. Iltimos qayta tekshiring.' : 'Invalid or already-used code. Please check and try again.')
                );
            }

            setSuccess(true);
            setTimeout(() => onVerified(), 1400);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : (uz ? 'Xatolik yuz berdi.' : 'Something went wrong.'));
            setSubmitting(false);
        }
    };

    const t = {
        badge:       uz ? 'Faqat taklif bo\'yicha kirish'    : 'Invite-only access',
        heading:     uz ? 'Kirish kodingizni kiriting'        : 'Enter your access code',
        sub:         uz ? 'Bu platforma hozircha faqat promo kod egalariga ochiq. Kodni CEFR Academy adminidan oling.'
                        : 'This platform is currently invite-only. Enter the promo code you received from CEFR Academy.',
        placeholder: uz ? 'Masalan: CEFR-A3F2-9ZQ1'          : 'e.g. CEFR-A3F2-9ZQ1',
        btn:         uz ? 'Tasdiqlash'                        : 'Verify Code',
        successMsg:  uz ? 'Kod tasdiqlandi! Xush kelibsiz 🎉' : 'Code verified! Welcome 🎉',
        hint:        uz ? "Kodingiz yo'qmi? Admin bilan bog'laning."
                        : "Don't have a code? Contact the admin.",
        checking:    uz ? 'Tekshirilmoqda…'                  : 'Checking your access…',
    };

    return (
        <div className="pg-overlay">
            <div className="pg-blob pg-blob-1" />
            <div className="pg-blob pg-blob-2" />

            <AnimatePresence mode="wait">

                {/* ── DB check in progress ── */}
                {loading && !success && (
                    <motion.div key="loading" className="pg-success"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 size={40} className="spin" color="var(--color-primary)" />
                        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>{t.checking}</p>
                    </motion.div>
                )}

                {/* ── Success state ── */}
                {success && (
                    <motion.div key="success" className="pg-success"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                        <CheckCircle size={56} color="#10B981" strokeWidth={1.5} />
                        <h2>{t.successMsg}</h2>
                    </motion.div>
                )}

                {/* ── Enter code form ── */}
                {!loading && !success && (
                    <motion.div key="form" className="pg-card"
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

                        <div className="pg-brand">
                            <Sparkles size={18} color="var(--color-primary)" />
                            <span>CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span></span>
                        </div>

                        <div className="pg-lock-wrap">
                            <Lock size={28} strokeWidth={1.5} color="var(--color-primary)" />
                        </div>

                        <div className="pg-badge">
                            <Shield size={12} /> {t.badge}
                        </div>

                        <h2 className="pg-heading">{t.heading}</h2>
                        <p className="pg-sub">{t.sub}</p>

                        <form className="pg-form" onSubmit={handleSubmit}>
                            <div className={`pg-input-wrap ${error ? 'has-error' : ''}`}>
                                <input
                                    ref={inputRef}
                                    className="pg-input"
                                    type="text"
                                    value={code}
                                    onChange={(e) => handleInput(e.target.value)}
                                    placeholder={t.placeholder}
                                    disabled={submitting}
                                    autoComplete="off"
                                    spellCheck={false}
                                    maxLength={20}
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.p className="pg-error"
                                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <motion.button
                                type="submit"
                                className="pg-btn"
                                disabled={submitting || !code.trim()}
                                whileTap={{ scale: 0.98 }}>
                                {submitting
                                    ? <Loader2 size={18} className="spin" />
                                    : <ArrowRight size={18} />}
                                {t.btn}
                            </motion.button>
                        </form>

                        <p className="pg-hint">{t.hint}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PromoGate;
