import { motion } from 'framer-motion';
import { Crown, CheckCircle } from 'lucide-react';

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
            className="container flex-col items-center"
            style={{ maxWidth: '1000px', display: 'flex' }}
        >
            <header className="text-center" style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {lang === 'en' ? 'Unlock Your Full Potential' : 'To\'liq imkoniyatlarni oching'}
                </h1>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                    {lang === 'en' ? 'Choose the plan that fits your preparation speed.' : 'Sizning tayyorgarlik tezligingizga mos tarifni tanlang.'}
                </p>
            </header>

            <div className="grid grid-cols-2 gap-8" style={{ width: '100%' }}>

                {/* Free Plan */}
                <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{lang === 'en' ? 'Free Basic' : 'Bepul Asosiy'}</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                        {lang === 'en' ? '$0' : '0 so\'m'}<span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}> / {lang === 'en' ? 'forever' : 'doimiy'}</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, marginBottom: '3rem' }}>
                        {t.freeBenefits.map((feat, i) => (
                            <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <CheckCircle size={18} className="text-muted" /> {feat}
                            </li>
                        ))}
                    </ul>

                    <button className="btn btn-outline" style={{ width: '100%', padding: '1rem' }}>
                        {lang === 'en' ? 'Current Plan' : 'Joriy Tarif'}
                    </button>
                </div>

                {/* Premium Plan */}
                <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', border: '2px solid var(--color-primary)', position: 'relative', transform: 'scale(1.05)' }}>
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--gradient-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 'bold', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Crown size={18} /> {lang === 'en' ? 'Most Popular' : 'Eng Mashhur'}
                    </div>

                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{lang === 'en' ? 'Pro CEFR' : 'Pro CEFR'}</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                        {lang === 'en' ? '$19' : '230,000 so\'m'}<span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}> / {lang === 'en' ? 'month' : 'oy'}</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, marginBottom: '3rem' }}>
                        {t.proBenefits.map((feat, i) => (
                            <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 500 }}>
                                <CheckCircle size={18} className="text-primary" /> {feat}
                            </li>
                        ))}
                    </ul>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                        {lang === 'en' ? 'Upgrade with Payme / Stripe' : 'Payme / Stripe orqali yangilash'}
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

export default Pricing;
