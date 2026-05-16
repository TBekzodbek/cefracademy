import { motion } from 'framer-motion';
import { Crown, CheckCircle } from 'lucide-react';
import './Pricing.css'; // I'll create this to handle styles properly

interface Props {
    lang: 'en' | 'uz';
}

const Pricing = ({ lang }: Props) => {
    const t = {
        freeBenefits: lang === 'en' ? [
            '3 mock reading texts',
            '3 writing prompt questions',
            '3 sample audios',
            'Basic speaking intro'
        ] : [
            '3 ta o\'qish testi',
            '3 ta yozish mavzusi',
            '3 ta audio namuna',
            'Boshlang\'ich gapirish tanishtiruvi'
        ],
        proBenefits: lang === 'en' ? [
            'Unlimited mock tests (All sections)',
            'AI scoring & detailed grammar feedback',
            'Live AI robot for speaking',
            'Transcripts for all audios',
            'AI dynamic study plan generation'
        ] : [
            'Cheksiz mock testlar (barcha bo\'limlar)',
            'AI baholash va batafsil grammatik tahlil',
            'Gapirish uchun jonli AI robot',
            'Barcha audiolar uchun transkriptlar',
            'AI orqali dinamik o\'quv rejasini yaratish'
        ]
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="pricing-page-master"
        >
            <div className="container pricing-inner">
                <header className="pricing-header text-center">
                    <h1 className="pricing-title">
                        {lang === 'en' ? 'Unlock Your Full Potential' : 'To\'liq imkoniyatlarni oching'}
                    </h1>
                    <p className="pricing-subtitle">
                        {lang === 'en' ? 'Choose the plan that fits your preparation speed.' : 'Sizning tayyorgarlik tezligingizga mos tarifni tanlang.'}
                    </p>
                </header>

                <div className="pricing-grid">
                    {/* Free Plan */}
                    <div className="pricing-card">
                        <div className="card-header">
                            <h2 className="card-plan-name">{lang === 'en' ? 'Free Basic' : 'Bepul Asosiy'}</h2>
                            <div className="card-price">
                                {lang === 'en' ? '$0' : '0 so\'m'}
                                <span className="price-period"> / {lang === 'en' ? 'forever' : 'doimiy'}</span>
                            </div>
                        </div>

                        <ul className="benefit-list">
                            {t.freeBenefits.map((feat, i) => (
                                <li key={i} className="benefit-item">
                                    <CheckCircle size={18} className="icon-muted" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="btn-pricing btn-outline-alt">
                            {lang === 'en' ? 'Current Plan' : 'Joriy Tarif'}
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="pricing-card featured">
                        <div className="popular-badge">
                            <Crown size={16} />
                            <span>{lang === 'en' ? 'Most Popular' : 'Eng Mashhur'}</span>
                        </div>

                        <div className="card-header">
                            <h2 className="card-plan-name featured-text">{lang === 'en' ? 'Pro CEFR' : 'Pro CEFR'}</h2>
                            <div className="card-price">
                                {lang === 'en' ? '$19' : '230,000 so\'m'}
                                <span className="price-period"> / {lang === 'en' ? 'month' : 'oy'}</span>
                            </div>
                        </div>

                        <ul className="benefit-list">
                            {t.proBenefits.map((feat, i) => (
                                <li key={i} className="benefit-item">
                                    <CheckCircle size={18} className="icon-primary" />
                                    <span className="bold-benefit">{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="btn-pricing btn-primary-alt">
                            {lang === 'en' ? 'Upgrade with Payme / Stripe' : 'Payme / Stripe orqali yangilash'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Pricing;
