import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Headphones, GraduationCap, Mic, ArrowRight, Zap, Star, Layout, ShieldCheck, Activity, PieChart, Globe } from 'lucide-react';
import './OnboardingSurvey.css';

// Asset imports
import atlasWolfImg from '../assets/images/atlas-wolf.png';

interface Props {
    lang: 'en' | 'uz';
    toggleLang: () => void;
}

const OnboardingSurvey = ({ lang, toggleLang }: Props) => {
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
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'auto'
            });
        }
    };

    return (
        <div className="onboarding-master">
            {/* Top Navigation Bar */}
            <header className="onboarding-header">
                <div className="container nav-strip">
                    <Link to="/" className="brand-mini">
                        <span className="text-primary" style={{ fontWeight: 800 }}>CEFR</span>ACADEMY
                    </Link>
                    <div className="cat-btns-web">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => scrollToSection(cat.id)}
                                className="cat-nav-btn"
                                style={{ borderColor: cat.color }}
                            >
                                {cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-ghost" onClick={toggleLang} style={{ color: '#64748b' }}>
                            <Globe size={20} /> <span>{lang.toUpperCase()}</span>
                        </button>
                        <Link to="/login" className="btn btn-primary">{lang === 'en' ? 'Sign In' : 'Kirish'}</Link>
                    </div>
                </div>
            </header>

            <main className="onboarding-sections">
                {/* HERO SECTION - REPLACING THE PREVIOUS INTRO */}
                <section className="hero-onboarding-wrapper" id="home">
                    <div className="container hero-grid">
                        <motion.div
                            className="hero-text"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="badge-premium">75-POINT SCALE ALIGNED</span>
                            <h1 className="hero-title">
                                {lang === 'en' ? 'The fastest path to your CEFR score.' : 'CEFR natijangizga eng tezkor yo\'l.'}
                            </h1>
                            <p className="hero-subtitle">
                                {lang === 'en'
                                    ? 'Meet Atlas, your AI robot coach. Bridge the gap between B1 and C1 with national exam standards.'
                                    : 'Atlas bilan tanishing - sizning AI robot ustozingiz. B1 dan C1 gacha bo\'lgan masofani milliy standartlarda bosib o\'ting.'}
                            </p>
                            <div className="hero-cta-group">
                                <button onClick={() => scrollToSection('reading')} className="btn btn-primary btn-xl btn-glow">
                                    {lang === 'en' ? 'Start Free Diagnostic' : 'Diagnostikani boshlash'}
                                </button>
                                <div className="trust-badges">
                                    <ShieldCheck size={20} /> <span>Official DTM Methodology</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="hero-visual"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <img src={atlasWolfImg} alt="Atlas" className="mascot-img-onboarding" />
                        </motion.div>
                    </div>
                </section>

                {/* RESULTS BAR STATS */}
                <div className="onboarding-stats-strip">
                    <div className="container stats-flex">
                        <div className="stat-pill"><Activity size={24} /> <span>+12 Avg Point Increase</span></div>
                        <div className="stat-pill"><PieChart size={24} /> <span>98% Score Accuracy</span></div>
                        <div className="stat-pill"><Star size={24} /> <span>2.4k Successful Students</span></div>
                    </div>
                </div>

                {/* CATEGORY SECTIONS */}
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
                                        {lang === 'en' ? 'Open' : 'Ochish'} {cat.title} <ArrowRight size={20} />
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
                                    <div className="inner-icon" style={{ opacity: 0.25 }}>{cat.icon}</div>
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
                        <Zap size={64} className="text-warning" />
                        <h2>{lang === 'en' ? 'Your AI Roadmap is Ready' : 'AI Yo\'l xaritangiz tayyor'}</h2>
                        <p>{lang === 'en' ? 'Analyze your weaknesses in each module to generate a custom 30-day plan.' : 'Shaxsiy 30 kunlik reja tuzish uchun har bir modulda kamchiliklaringizni tahlil qiling.'}</p>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-xl btn-glow">
                            {lang === 'en' ? 'Go to Command Center' : 'Boshqaruv markaziga o\'tish'}
                        </button>
                    </motion.div>
                    <div className="brand-footer">
                        <p>© 2025 CEFRACADEMY.uz. Built for Uzbekistan.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
