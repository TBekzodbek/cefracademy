import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, GraduationCap, Mic, ArrowRight, Zap, Star, Layout } from 'lucide-react';
import './OnboardingSurvey.css';

interface Props {
    lang: 'en' | 'uz';
}

const OnboardingSurvey = ({ lang }: Props) => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'reading',
            icon: <BookOpen size={48} />,
            title: lang === 'en' ? 'Reading Strategy' : 'O\'qish strategiyasi',
            desc: lang === 'en'
                ? 'Master the national CEFR reading format with 3 adaptive levels.'
                : 'Miliiy CEFR o\'qish formatini 3 ta adaptiv darajada o\'rganing.',
            color: '#3b82f6',
            action: '/dashboard/reading',
            features: [
                lang === 'en' ? 'Rasch text complexity' : 'Rasch bo\'yicha matn murakkabligi',
                lang === 'en' ? '60-minute mock trials' : '60 daqiqalik mock testlar',
                lang === 'en' ? 'Scanning speed drills' : 'Tez o\'qish mashqlari'
            ]
        },
        {
            id: 'listening',
            icon: <Headphones size={48} />,
            title: lang === 'en' ? 'Listening Lab' : 'Eshitish laboratoriyasi',
            desc: lang === 'en'
                ? 'High-fidelity audio recorded based on official state exam standards.'
                : 'Rasmiy davlat imtihon standartlari asosida yozilgan yuqori sifatli audiolar.',
            color: '#10b981',
            action: '/dashboard/listening',
            features: [
                lang === 'en' ? 'Natural accents (UZB/ENG)' : 'Tabiiy aksentlar',
                lang === 'en' ? 'Detail-oriented questions' : 'Detallashgan savollar',
                lang === 'en' ? 'Acoustic simulation' : 'Akustik simulyatsiya'
            ]
        },
        {
            id: 'writing',
            icon: <GraduationCap size={48} />,
            title: lang === 'en' ? 'Writing AI Mentor' : 'Yozish bo\'yicha AI mentor',
            desc: lang === 'en'
                ? 'Submit Task 1 & 2 for instant AI evaluation on the 75-point scale.'
                : 'Task 1 va 2 ni yuboring va 75 ballik tizimda AI tahlilini oling.',
            color: '#8b5cf6',
            action: '/dashboard/writing',
            features: [
                lang === 'en' ? 'DTM-based criteria' : 'DTM mezonlari',
                lang === 'en' ? 'Cohesion feedback' : 'Mantiqiy bog\'liqlik tahlili',
                lang === 'en' ? 'Vocabulary suggestions' : 'Lug\'at boyligi bo\'yicha maslahatlar'
            ]
        },
        {
            id: 'speaking',
            icon: <Mic size={48} />,
            title: lang === 'en' ? 'Speaking Simulator' : 'Gapirish simulyatori',
            desc: lang === 'en'
                ? 'Talk to Atlas about topical cards and receive a point prediction.'
                : 'Atlas bilan mavzuli kartochkalar orqali gapiring va bashorat qilingan ballni oling.',
            color: '#f59e0b',
            action: '/dashboard/speaking',
            features: [
                lang === 'en' ? 'Real-time conversation' : 'Jonli muloqot',
                lang === 'en' ? 'Pronunciation analysis' : 'Talaffuz tahlili',
                lang === 'en' ? 'Topic-specific cards' : 'Maxsus mavzuli kartochkalar'
            ]
        }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // "without any animation" as requested: instant scroll
            window.scrollTo({
                top: element.offsetTop - 80, // Adjust for sticky nav
                behavior: 'auto'
            });
        }
    };

    return (
        <div className="onboarding-master">
            {/* Top Navigation Bar */}
            <header className="onboarding-header">
                <div className="container nav-strip">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => scrollToSection(cat.id)}
                            className="cat-nav-btn"
                            style={{ borderColor: cat.color }}
                        >
                            {cat.icon}
                            <span>{cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
                        </button>
                    ))}
                </div>
            </header>

            <main className="onboarding-sections">
                {categories.map((cat, i) => (
                    <section key={cat.id} id={cat.id} className="category-section" style={{ borderLeft: `8px solid ${cat.color}` }}>
                        <div className="container section-inner">
                            <motion.div
                                className="section-content"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ margin: "-100px" }}
                            >
                                <div className="section-badge" style={{ background: `${cat.color}20`, color: cat.color }}>
                                    PHASE 0{i + 1}
                                </div>
                                <h2 className="section-title">{cat.title}</h2>
                                <p className="section-desc">{cat.desc}</p>

                                <ul className="section-features">
                                    {cat.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <Star size={16} style={{ color: cat.color }} /> {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="section-actions">
                                    <button onClick={() => navigate(cat.action)} className="btn btn-primary btn-lg" style={{ background: cat.color }}>
                                        {lang === 'en' ? 'Start Journey' : 'Sayohatni boshlash'} <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                className="section-visual-container"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="premium-shape" style={{ background: `linear-gradient(135deg, ${cat.color} 0%, #1e293b 100%)` }}>
                                    <div className="inner-icon">{cat.icon}</div>
                                </div>
                                <div className="floating-ui-card">
                                    <div className="card-header"><Layout size={14} /> Module Ready</div>
                                    <div className="card-line short" />
                                    <div className="card-line long" />
                                </div>
                            </motion.div>
                        </div>
                    </section>
                ))}
            </main>

            <footer className="onboarding-footer">
                <div className="container">
                    <motion.div
                        className="final-cta-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <Zap size={48} className="text-warning" />
                        <h2>{lang === 'en' ? 'Plan Developed' : 'Reja tayyorlandi'}</h2>
                        <p>{lang === 'en' ? 'Atlas AI has analyzed these modules. Ready to start your 30-day roadmap?' : 'Atlas AI ushbu modullarni tahlil qildi. 30 kunlik rejangizni boshlashga tayyormisiz?'}</p>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-xl">
                            {lang === 'en' ? 'Open Dashboard' : 'Dashboardni ochish'}
                        </button>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
