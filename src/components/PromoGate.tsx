// PromoGate — blocks the dashboard until a valid promo code is entered
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, CheckCircle, Loader2, ArrowRight, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PromoGate.css';

interface Props {
    onVerified: () => void;
    lang: 'en' | 'uz';
}

const PromoGate = ({ onVerified, lang }: Props) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const uz = lang === 'uz';

    useEffect(() => {
        // auto-focus input
        setTimeout(() => inputRef.current?.focus(), 300);
    }, []);

    const handleInput = (v: string) => {
        // Format as user types: auto-uppercase, allow letters/digits/hyphens only
        const clean = v.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        setCode(clean);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = code.trim();
        if (!trimmed) return;

        setLoading(true);
        setError(null);

        try {
            // Get current session for the Authorization header
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error(uz ? 'Sessiya topilmadi.' : 'No session found.');

            const { data, error: fnErr } = await supabase.functions.invoke('validate-promo', {
                body: { code: trimmed },
            });

            if (fnErr) throw new Error(fnErr.message || 'Function error');
            if (!data?.success) throw new Error(data?.error || (uz ? 'Noto\'g\'ri kod.' : 'Invalid code.'));

            // Success!
            setSuccess(true);
            setTimeout(() => onVerified(), 1400);

        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : (uz ? 'Xatolik yuz berdi.' : 'Something went wrong.');
            setError(msg);
            setLoading(false);
        }
    };

    const t = {
        badge:      uz ? 'Faqat taklif bo\'yicha kirish' : 'Invite-only access',
        heading:    uz ? 'Kirish kodingizni kiriting' : 'Enter your access code',
        sub:        uz ? 'Bu platforma hozircha faqat promo kod egalariga ochiq. Kodni CEFR Academy adminidan oling.' : 'This platform is currently invite-only. Enter the promo code you received from the CEFR Academy admin.',
        placeholder: uz ? 'Masalan: CEFR-A3F2-9ZQ1' : 'e.g. CEFR-A3F2-9ZQ1',
        btn:        uz ? 'Tasdiqlash' : 'Verify Code',
        successMsg: uz ? 'Kod tasdiqlandi! Xush kelibsiz 🎉' : 'Code verified! Welcome 🎉',
        hint:       uz ? "Kodingiz yo'qmi? Admin bilan bog'laning." : "Don't have a code? Contact the admin.",
    };

    return (
        <div className="pg-overlay">
            {/* Background decoration */}
            <div className="pg-blob pg-blob-1" />
            <div className="pg-blob pg-blob-2" />

            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div key="success" className="pg-success"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                        <CheckCircle size={56} color="#10B981" strokeWidth={1.5} />
                        <h2>{t.successMsg}</h2>
                    </motion.div>
                ) : (
                    <motion.div key="form" className="pg-card"
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

                        {/* Brand */}
                        <div className="pg-brand">
                            <Sparkles size={18} color="var(--color-primary)" />
                            <span>CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span></span>
                        </div>

                        {/* Lock icon */}
                        <div className="pg-lock-wrap">
                            <Lock size={28} strokeWidth={1.5} color="var(--color-primary)" />
                        </div>

                        {/* Badge */}
                        <div className="pg-badge">
                            <Shield size={12} /> {t.badge}
                        </div>

                        <h2 className="pg-heading">{t.heading}</h2>
                        <p className="pg-sub">{t.sub}</p>

                        {/* Form */}
                        <form className="pg-form" onSubmit={handleSubmit}>
                            <div className={`pg-input-wrap ${error ? 'has-error' : ''}`}>
                                <input
                                    ref={inputRef}
                                    className="pg-input"
                                    type="text"
                                    value={code}
                                    onChange={(e) => handleInput(e.target.value)}
                                    placeholder={t.placeholder}
                                    disabled={loading}
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
                                disabled={loading || !code.trim()}
                                whileTap={{ scale: 0.98 }}>
                                {loading
                                    ? <Loader2 size={18} className="spin" />
                                    : <ArrowRight size={18} />
                                }
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
