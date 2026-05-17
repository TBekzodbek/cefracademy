import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowRight, Zap, Sparkles, Flame, Clock, Activity,
    Brain, BarChart2, Layers, Quote, CheckCircle2,
    BookOpen, Headphones, GraduationCap, Mic, Library, TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './OnboardingSurvey.css';

interface Props { lang: 'en' | 'uz'; }

const OnboardingSurvey = ({ lang }: Props) => {
    void lang;
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);

    useEffect(() => {
        supabase.auth.getUser();
    }, []);

    const surveyQuestions = [
        { id: 'current_level', q: 'What is your current level?', opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate', 'C1 Advanced'] },
        { id: 'target_level', q: 'What is your target score?', opts: ['B1 (38–50 pts)', 'B2 (51–64 pts)', 'C1 (65–75 pts)'] },
        { id: 'weakness', q: 'Which skill is your weakest?', opts: ['Speaking & Grammar', 'Academic Writing', 'Reading Speed', 'Listening Detail'] },
    ];

    const handleSelect = async (opt: string) => {
        const newSelections = [...selections, opt];
        setSelections(newSelections);
        if (step < surveyQuestions.length) {
            setStep(step + 1);
        } else {
            setIsGenerating(true);
            setTimeout(() => navigate('/dashboard'), 2200);
        }
    };

    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    // ── Feature cards (cefrai.uz style: top border + icon box + level chips)
    const features = [
        { title: 'Authentic Mock Tests', desc: '50+ full Reading & Listening papers from real DTM exams.', color: 'var(--color-primary)', bg: 'rgba(91,80,232,0.08)', icon: <BookOpen size={20} color="var(--color-primary)" />, chips: ['B1', 'B2', 'C1'] },
        { title: 'AI Essay Grading', desc: 'Instant C1-level feedback on every Writing task within 30s.', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)', icon: <GraduationCap size={20} color="var(--color-success)" />, chips: ['Essay', 'Letter', 'Report'] },
        { title: 'Vocabulary Lab', desc: 'Master the 1,500 most frequent academic words with spaced repetition.', color: 'var(--color-purple)', bg: 'rgba(139,92,246,0.08)', icon: <Library size={20} color="var(--color-purple)" />, chips: ['A2', 'B1', 'B2', 'C1'] },
        { title: 'Speaking Atlas', desc: 'AI fluency + pronunciation scoring on real speaking prompts.', color: 'var(--color-error)', bg: 'rgba(244,63,94,0.08)', icon: <Mic size={20} color="var(--color-error)" />, chips: ['Fluency', 'Pronunciation'] },
        { title: 'Level Progress Map', desc: 'Visualize your path from A1 to C1 with live XP tracking.', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.08)', icon: <TrendingUp size={20} color="var(--color-warning)" />, chips: ['A1→C1', 'XP System'] },
        { title: 'Grammar Guard', desc: 'Identify and fix recurring structural errors automatically.', color: 'var(--color-secondary)', bg: 'rgba(6,182,212,0.08)', icon: <CheckCircle2 size={20} color="var(--color-secondary)" />, chips: ['Grammar', 'Errors'] },
    ];

    // ── How it works steps
    const howSteps = [
        { num: '01', icon: <Brain size={20} color="var(--color-primary)" />, bg: 'rgba(91,80,232,0.1)', title: 'Tell Atlas your goal', desc: 'Answer 3 quick questions. Atlas builds a personalized study roadmap targeting your exact score gap.' },
        { num: '02', icon: <Layers size={20} color="var(--color-success)" />, bg: 'rgba(16,185,129,0.1)', title: 'Practice with real mocks', desc: 'Work through authentic past papers under timed conditions — all four skills covered.' },
        { num: '03', icon: <BarChart2 size={20} color="var(--color-warning)" />, bg: 'rgba(245,158,11,0.1)', title: 'Get instant AI feedback', desc: 'Every answer scored in real-time. Fix errors, track improvement, predict your official score.' },
    ];

    // ── Testimonials (ieltsnation.uz style)
    const testimonials = [
        { text: '"I improved from B1 to B2 in 6 weeks. The AI feedback on my essays was sharper than any tutor I\'d paid for."', name: 'Sardor M.', meta: 'Tashkent · B1 → B2', avatar: 'S', color: '#5B50E8', score: '+24 pts' },
        { text: '"The reading mocks are identical to the real exam. I went in confident and came out with a C1 certificate."', name: 'Dilnoza K.', meta: 'Samarkand · B2 → C1', avatar: 'D', color: '#10B981', score: '+18 pts' },
        { text: '"Atlas caught grammar patterns in my writing I\'d been repeating for years. Game-changer for speaking too."', name: 'Jasur A.', meta: 'Bukhara · A2 → B1', avatar: 'J', color: '#F59E0B', score: '+32 pts' },
    ];

    // ── Pricing tiers (cefrai.uz style)
    const plans = [
        { tier: 'Forever Free', price: 'Free', period: 'No card needed', features: ['3 AI Writing checks', '1 Speaking mock', 'Full Reading & Listening', 'All B1, B2, C1 levels', 'Platform tour'], cta: 'Start Free' },
        { tier: 'Pro', price: '29,000', period: 'UZS / month · Writing + Reading + Listening', features: ['Unlimited Writing checks', 'All essay types (letter, report)', 'Unlimited Reading tests', 'Unlimited Listening tests', 'Error tracking dashboard', 'Speaking — Premium required'], cta: 'Get Pro', featured: true },
        { tier: 'Premium', price: '49,000', period: 'UZS / month · Everything', features: ['Everything in Pro', 'Unlimited Speaking feedback', '1 Full CEFR Mock Exam', 'Real-time AI assessment', 'Pronunciation scoring', 'Priority support'], cta: 'Get Premium' },
    ];

    return (
        <div className="onboarding-master">

            {/* ── Nav ── */}
            <header className="onboarding-header">
                <div className="container header-inner">
                    <Link to="/" className="brand-wrapper">
                        <Sparkles className="sparkle-icon" size={20} />
                        CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span>
                    </Link>
                    <nav className="nav-links">
                        <button onClick={() => scrollTo('how')} className="nav-link">Methodology</button>
                        <button onClick={() => scrollTo('features')} className="nav-link">Features</button>
                        <button onClick={() => scrollTo('pricing')} className="nav-link">Pricing</button>
                    </nav>
                    <div className="header-right">
                        <div className="streak-pills"><Flame size={14} /><span>12 DAYS</span></div>
                        <button className="btn btn-primary" onClick={() => scrollTo('builder')} style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
                            <Sparkles size={14} /> Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* ── Hero ── */}
                <section className="hero-section" id="hero">
                    <div className="container hero-grid">
                        <motion.div className="hero-text" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <span className="eyebrow" style={{ color: 'var(--color-secondary)' }}>AI-POWERED · DTM CEFR PREP</span>
                            <h1 className="h1-hero">
                                Master your exam<br />
                                with <span className="gradient-text">Personalized AI.</span>
                            </h1>
                            <p className="hero-description">
                                Stop guessing. Atlas analyzes every sentence, identifies errors in real-time, and predicts your official CEFR score with 98% accuracy.
                            </p>
                            <div className="hero-btn-group">
                                <button className="btn btn-primary" style={{ padding: '0.9rem 2rem' }} onClick={() => scrollTo('builder')}>
                                    Start Free <ArrowRight size={16} />
                                </button>
                                <button className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }} onClick={() => scrollTo('how')}>
                                    How it Works
                                </button>
                            </div>
                            <div className="trust-bar">
                                <span>✓ Free to start</span><span className="dot">·</span>
                                <span>✓ No card required</span><span className="dot">·</span>
                                <span>✓ Official DTM Standards</span>
                            </div>
                        </motion.div>

                        <div className="ui-mockup-wrapper">
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="dark-ui-card">
                                <div className="notification-pill"><Sparkles size={12} /> AI Evaluation Ready · 2.4s</div>
                                <div className="mockup-header">
                                    <span className="eyebrow" style={{ marginBottom: 0, fontSize: '0.65rem' }}>WRITING · B1 ESSAY</span>
                                    <span className="badge badge-teal">B1 ➔ B2</span>
                                </div>
                                <div className="mockup-body">
                                    "The <span className="underline-error">globalization of technology</span> has changed how we communicate. Many people <span className="underline-success">remain hesitant to embrace</span> digital changes..."
                                </div>
                                <div className="score-display">
                                    <div className="score-circle">72</div>
                                    <div style={{ flex: 1 }}>
                                        {[['Coherence', 82], ['Vocabulary', 90], ['Grammar', 70]].map(([label, val]) => (
                                            <div key={label as string} style={{ marginBottom: '0.4rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginBottom: '3px' }}>
                                                    <span>{label}</span><span>{val}%</span>
                                                </div>
                                                <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                                                    <div style={{ width: `${val}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '4px' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                                    "Strong vocabulary. Focus on linking devices in Paragraph 2 to reach B2."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Ticker ── */}
                <div className="ticker-strip">
                    <div className="ticker-content">
                        🚀 2,400+ STUDENTS PASSED IN 2024 &nbsp;·&nbsp; ★★★★★ 4.9/5 RATING &nbsp;·&nbsp; REAL-TIME AI SCORING &nbsp;·&nbsp; DTM 2025 COMPLIANT &nbsp;·&nbsp; 98% SCORE ACCURACY &nbsp;·&nbsp; 🚀 2,400+ STUDENTS PASSED IN 2024 &nbsp;·&nbsp; ★★★★★ 4.9/5 RATING &nbsp;·&nbsp; REAL-TIME AI SCORING &nbsp;·&nbsp; DTM 2025 COMPLIANT &nbsp;·&nbsp; 98% SCORE ACCURACY
                    </div>
                </div>

                {/* ── Stats / Social Proof (ieltsnation.uz style) ── */}
                <div className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            {[
                                { num: '2,400+', label: 'Students Passed' },
                                { num: '4.9★', label: 'Average Rating' },
                                { num: '98%', label: 'Score Accuracy' },
                                { num: 'A1–C1', label: 'All CEFR Levels' },
                            ].map((s, i) => (
                                <motion.div key={i} className="stat-item" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                    <div className="stat-number">{s.num}</div>
                                    <div className="stat-label">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Problem Cards ── */}
                <section id="problems">
                    <div className="container text-center">
                        <span className="eyebrow" style={{ color: 'var(--color-error)' }}>THE CHALLENGE</span>
                        <h2>Still guessing your CEFR score?</h2>
                        <p className="text-muted" style={{ maxWidth: '540px', margin: '1rem auto 0' }}>
                            Most students fail because they practice without feedback. Doing tests isn't enough — you need to know exactly why you're missing points.
                        </p>
                        <div className="problem-grid">
                            <motion.div className="problem-card rose" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
                                <div className="problem-pill">Feedback yo'q</div>
                                <Zap size={26} className="text-error" style={{ marginBottom: '0.875rem' }} />
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.65rem' }}>"I don't know my level"</h3>
                                <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.65 }}>Practicing without a baseline is driving in the dark. You need instant, accurate scoring.</p>
                            </motion.div>
                            <motion.div className="problem-card amber" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                                <div className="problem-pill">Vaqt isrofiga</div>
                                <Clock size={26} className="text-warning" style={{ marginBottom: '0.875rem' }} />
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.65rem' }}>"Waiting days for feedback"</h3>
                                <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.65 }}>Don't wait 48h for a tutor. Get AI assessments in under 30 seconds, every time.</p>
                            </motion.div>
                            <motion.div className="problem-card indigo" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                                <div className="problem-pill">Yo'nalish yo'q</div>
                                <Activity size={26} className="text-primary" style={{ marginBottom: '0.875rem' }} />
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.65rem' }}>"Inconsistent results"</h3>
                                <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.65 }}>DTM criteria are complex. Atlas ensures you hit every marking point on every attempt.</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── How It Works (cefrai.uz style with connector) ── */}
                <section className="section-alt" id="how">
                    <div className="container text-center">
                        <span className="eyebrow">ODDIY JARAYON</span>
                        <h2>From zero to result in 3 steps</h2>
                        <p className="text-muted" style={{ maxWidth: '480px', margin: '1rem auto 0' }}>
                            Atlas AI adapts to your weaknesses and builds a structured path to your target score.
                        </p>
                        <div className="section-how">
                            {howSteps.map((s, i) => (
                                <motion.div key={i} className="how-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                                    <div className="how-step-number">{s.num}</div>
                                    <div className="how-step-icon" style={{ background: s.bg }}>{s.icon}</div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            className="btn btn-primary"
                            style={{ marginTop: '3rem', padding: '0.9rem 2.5rem' }}
                            onClick={() => scrollTo('builder')}
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        >
                            Start CEFR Practice <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </section>

                {/* ── Features (cefrai.uz style: colored top border + icon box + level chips) ── */}
                <section id="features">
                    <div className="container">
                        <div className="text-center">
                            <span className="eyebrow">KERAKLI BARCHA VOSITALAR</span>
                            <h2>Built for your CEFR result</h2>
                            <p className="text-muted" style={{ maxWidth: '500px', margin: '1rem auto 0' }}>
                                Six integrated tools. One platform. One mission: your official CEFR certificate.
                            </p>
                        </div>
                        <div className="features-grid">
                            {features.map((feat, i) => (
                                <motion.div key={i} className="feature-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                                    <div className="accent-line" style={{ background: feat.color }} />
                                    <div className="feature-icon-box" style={{ background: feat.bg }}>{feat.icon}</div>
                                    <h3>{feat.title}</h3>
                                    <p className="text-muted">{feat.desc}</p>
                                    <div className="feature-chips">
                                        {feat.chips.map(c => <span key={c} className="feature-chip">{c}</span>)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Testimonials (ieltsnation.uz style) ── */}
                <section className="section-alt">
                    <div className="container text-center">
                        <span className="eyebrow">REAL OUTCOMES</span>
                        <h2>Students who got their result</h2>
                        <p className="text-muted" style={{ maxWidth: '480px', margin: '1rem auto 0' }}>
                            From Tashkent to Bukhara — real CEFR students, real score gains.
                        </p>
                        <div className="testimonials-grid">
                            {testimonials.map((t, i) => (
                                <motion.div key={i} className="testimonial-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <Quote size={22} className="testimonial-quote-icon" />
                                    <p className="testimonial-text">{t.text}</p>
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                                        <div>
                                            <div className="testimonial-name">{t.name}</div>
                                            <div className="testimonial-meta">{t.meta}</div>
                                        </div>
                                        <div className="score-badge">+{t.score}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Pricing (cefrai.uz dark section style) ── */}
                <section className="pricing-section-wrap" id="pricing">
                    <div className="container text-center">
                        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>SHAFFOF NARXLAR</span>
                        <h2 style={{ color: 'white', marginBottom: '0.75rem' }}>Simple, honest pricing</h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '440px', margin: '0 auto' }}>
                            Start free. Upgrade when you're ready. No hidden fees, cancel anytime.
                        </p>
                        <div className="pricing-grid">
                            {plans.map((plan, i) => (
                                <div key={i} className={`price-card ${plan.featured ? 'featured' : ''}`}>
                                    {plan.featured && <div className="featured-badge">⭐ Most Popular</div>}
                                    <div className="price-tier">{plan.tier}</div>
                                    <div className="price-amount">{plan.price === 'Free' ? 'Free' : plan.price}</div>
                                    <div className="price-period">{plan.period}</div>
                                    <ul className="price-features">
                                        {plan.features.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                    <button className="btn-price" onClick={() => scrollTo('builder')}>{plan.cta}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Dark CTA ── */}
                <section className="cta-banner">
                    <div className="container">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', marginBottom: '1.75rem', color: 'rgba(255,255,255,0.6)' }}>
                            • READY TO RANK UP?
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.08 }}>
                            Stop guessing.<br />
                            <span style={{ color: 'var(--color-secondary)' }}>Get your result.</span>
                        </h2>
                        <div className="hero-btn-group" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => scrollTo('builder')} style={{ padding: '0.9rem 2.25rem' }}>Start Practicing Free</button>
                            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.15)', padding: '0.9rem 2.25rem' }}>Contact Support</button>
                        </div>
                    </div>
                </section>

                {/* ── Plan Builder Survey ── */}
                <section id="builder">
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: '3rem' }}>
                            <span className="eyebrow">PLAN BUILDER</span>
                            <h2>Build your personalized study plan</h2>
                            <p className="text-muted">Answer 3 quick questions. Atlas does the rest in seconds.</p>
                        </div>

                        <div className="survey-card">
                            <AnimatePresence mode="wait">
                                {!isGenerating ? (
                                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                                        {/* Step dots indicator */}
                                        <div className="survey-step-indicator">
                                            {surveyQuestions.map((_, i) => (
                                                <div key={i} className={`survey-dot ${i < step ? 'active' : ''}`} />
                                            ))}
                                        </div>
                                        <div style={{ marginBottom: '2rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.08em' }}>
                                                STEP {step} OF {surveyQuestions.length}
                                            </span>
                                            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, marginTop: '0.5rem', lineHeight: 1.2 }}>
                                                {surveyQuestions[step - 1].q}
                                            </h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {surveyQuestions[step - 1].opts.map(opt => (
                                                <button key={opt} className="btn-survey-option" onClick={() => handleSelect(opt)}>
                                                    <span>{opt}</span>
                                                    <ArrowRight size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div className="text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '4rem 0' }}>
                                        <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                            <Sparkles size={52} color="var(--color-primary)" />
                                        </motion.div>
                                        <h3 style={{ fontSize: '1.55rem', marginTop: '1.5rem', fontWeight: 800 }}>Building your roadmap...</h3>
                                        <p className="text-muted" style={{ marginTop: '0.5rem' }}>Atlas is personalizing your plan</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="onboarding-footer">
                <div className="container footer-grid">
                    <div className="footer-col">
                        <div className="brand-wrapper" style={{ color: 'white', marginBottom: '1.1rem' }}>
                            <Sparkles size={16} />
                            CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.86rem', lineHeight: 1.65, maxWidth: '220px' }}>
                            The AI-powered platform for national CEFR standards in Uzbekistan.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Practice</h4>
                        <Link to="#" className="footer-link">Reading Mock</Link>
                        <Link to="#" className="footer-link">Listening Mock</Link>
                        <Link to="#" className="footer-link">AI Writing</Link>
                        <Link to="#" className="footer-link">Speaking Lab</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Product</h4>
                        <Link to="#" className="footer-link">How it works</Link>
                        <Link to="#" className="footer-link">Pricing</Link>
                        <Link to="#" className="footer-link">Atlas AI</Link>
                        <Link to="#" className="footer-link">Vocabulary</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="#" className="footer-link">About us</Link>
                        <Link to="#" className="footer-link">Blog</Link>
                        <Link to="#" className="footer-link">Terms</Link>
                        <Link to="#" className="footer-link">Privacy</Link>
                    </div>
                </div>
                <div className="container" style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>© 2025 CEFR Academy. Powered by Atlas AI.</span>
                    <span>Made in 🇺🇿 Uzbekistan</span>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
