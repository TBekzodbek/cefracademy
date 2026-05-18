// Post-login pricing upsell modal
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Crown, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PricingModal.css';

interface Props {
    open: boolean;
    onClose: () => void;
    lang: 'en' | 'uz';
}

const plans = [
    {
        id: 'free',
        tier:    { en: 'Forever Free',  uz: 'Bepul' },
        price:   { en: 'Free',          uz: 'Bepul' },
        period:  { en: 'No card needed',uz: "Karta shart emas" },
        icon:    <Zap  size={20} />,
        color:   'var(--color-text-muted)',
        features: {
            en: ['3 AI Writing checks / month', '1 Speaking mock', 'Full Reading & Listening', 'All CEFR levels (A1–C1)'],
            uz: ['Oyiga 3 ta AI yozuv tekshiruvi', '1 ta Speaking mock', "To'liq Reading & Listening", "Barcha darajalar (A1–C1)"],
        },
        cta: { en: 'Continue Free', uz: 'Bepul davom etish' },
        featured: false,
    },
    {
        id: 'pro',
        tier:   { en: 'Pro',            uz: 'Pro' },
        price:  { en: '29,000',         uz: "29 000" },
        period: { en: 'UZS / month',    uz: 'UZS / oy' },
        icon:   <Crown size={20} />,
        color:  '#7C6FFF',
        features: {
            en: ['Unlimited Writing checks', 'All essay types (letter, report)', 'Unlimited Reading & Listening', 'Error tracking dashboard'],
            uz: ["Cheksiz yozuv tekshiruvi", 'Barcha vazifa turlari', "Cheksiz Reading & Listening", "Xato statistikasi"],
        },
        cta: { en: 'Get Pro', uz: 'Pro olish' },
        featured: false,
        badge: { en: 'Popular', uz: 'Mashhur' },
    },
    {
        id: 'premium',
        tier:   { en: 'Premium',        uz: 'Premium' },
        price:  { en: '49,000',         uz: "49 000" },
        period: { en: 'UZS / month',    uz: 'UZS / oy' },
        icon:   <Sparkles size={20} />,
        color:  'white',
        features: {
            en: ['Everything in Pro', 'Unlimited Speaking feedback', '1 Full Mock Exam / month', 'Pronunciation AI scoring', '14-day money-back guarantee'],
            uz: ["Pro'dagi hamma narsa", "Cheksiz Speaking baholash", 'Oyiga 1 to\'liq mock imtihon', "AI talaffuz baholash", "14 kunlik kafolat"],
        },
        cta: { en: 'Get Premium', uz: 'Premium olish' },
        featured: true,
        badge: { en: 'Best Value', uz: 'Eng foydali' },
    },
];

const PricingModal = ({ open, onClose, lang }: Props) => {
    const navigate = useNavigate();
    const uz = lang === 'uz';

    const handlePlan = (planId: string) => {
        onClose();
        if (planId !== 'free') {
            navigate('/dashboard/pricing');
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="pm-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        className="pm-sheet"
                        initial={{ opacity: 0, y: 48, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0,  scale: 1 }}
                        exit={{ opacity: 0, y: 32, scale: 0.97 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Close button */}
                        <button className="pm-close" onClick={onClose} aria-label="Close">
                            <X size={18} />
                        </button>

                        {/* Header */}
                        <div className="pm-header">
                            <div className="pm-header-badge">
                                <Sparkles size={14} />
                                {uz ? "CEFR Academy'ga xush kelibsiz 🎉" : "Welcome to CEFR Academy 🎉"}
                            </div>
                            <h2 className="pm-title">
                                {uz ? "O'z darajangizga mos reja tanlang" : 'Choose the plan that fits your goal'}
                            </h2>
                            <p className="pm-subtitle">
                                {uz
                                    ? "Bepul boshlang yoki hoziroq to'liq imkoniyatlarni oching."
                                    : "Start free or unlock everything you need to pass right now."}
                            </p>
                            <div className="pm-trust">
                                <span><Shield size={13} /> {uz ? "14 kunlik kafolat" : "14-day money-back"}</span>
                                <span className="pm-trust-dot">·</span>
                                <span>{uz ? "Karta shart emas" : "No card for free plan"}</span>
                                <span className="pm-trust-dot">·</span>
                                <span>{uz ? "Istalgan vaqt bekor qilish" : "Cancel anytime"}</span>
                            </div>
                        </div>

                        {/* Plans grid */}
                        <div className="pm-grid">
                            {plans.map((plan) => (
                                <div key={plan.id} className={`pm-card ${plan.featured ? 'pm-card-featured' : ''}`}>
                                    {plan.badge && (
                                        <div className={`pm-badge ${plan.featured ? 'pm-badge-white' : 'pm-badge-dim'}`}>
                                            {plan.featured ? '⭐ ' : ''}{uz ? plan.badge.uz : plan.badge.en}
                                        </div>
                                    )}

                                    <div className="pm-plan-icon" style={{ color: plan.featured ? 'white' : plan.color }}>
                                        {plan.icon}
                                    </div>

                                    <div className="pm-tier">{uz ? plan.tier.uz : plan.tier.en}</div>

                                    <div className="pm-price">
                                        {(uz ? plan.price.uz : plan.price.en) === 'Free' || (uz ? plan.price.uz : plan.price.en) === 'Bepul'
                                            ? <span className="pm-price-free">{uz ? 'Bepul' : 'Free'}</span>
                                            : <>
                                                <span className="pm-price-num">{uz ? plan.price.uz : plan.price.en}</span>
                                                <span className="pm-price-currency">UZS</span>
                                            </>
                                        }
                                    </div>
                                    <div className="pm-period">{uz ? plan.period.uz : plan.period.en}</div>

                                    <ul className="pm-features">
                                        {(uz ? plan.features.uz : plan.features.en).map((f) => (
                                            <li key={f}>
                                                <Check size={13} className="pm-check" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`pm-cta ${plan.featured ? 'pm-cta-featured' : plan.id === 'free' ? 'pm-cta-ghost' : 'pm-cta-outline'}`}
                                        onClick={() => handlePlan(plan.id)}
                                    >
                                        {uz ? plan.cta.uz : plan.cta.en}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <p className="pm-footer-note">
                            {uz
                                ? "Hozir bepul boshlashingiz mumkin. Keyinchalik istalgan vaqt upgrade qilasiz."
                                : "You can start free today and upgrade whenever you're ready."}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;
