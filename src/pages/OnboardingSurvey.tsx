import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowRight, Zap,
    Sparkles, Flame,
    Clock, Activity
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './OnboardingSurvey.css';

interface Props {
    lang: 'en' | 'uz';
}

const OnboardingSurvey = ({ lang }: Props) => {
    console.log('Survey active for lang:', lang);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) console.log('User ID:', user.id);
        };
        fetchUser();
    }, []);

    const surveyQuestions = [
        { id: 'current_level', q: 'What is your current level?', opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper', 'C1 Advanced'] },
        { id: 'target_level', q: 'What is your target score?', opts: ['B1 (38-50 pts)', 'B2 (51-64 pts)', 'C1 (65-75 pts)'] },
        { id: 'weakness', q: 'Which area is your weakest?', opts: ['Speaking & Grammar', 'Academic Writing', 'Reading Speed', 'Listening Detail'] }
    ];

    const handleSelect = async (opt: string) => {
        const newSelections = [...selections, opt];
        setSelections(newSelections);
        if (step < surveyQuestions.length) {
            setStep(step + 1);
        } else {
            setIsGenerating(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    };

    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="onboarding-master">
            {/* Style #5 NAVIGATION BAR */}
            <header className="onboarding-header">
                <div className="container header-inner">
                    <Link to="/" className="brand-wrapper">
                        <Sparkles className="sparkle-icon" size={24} />
                        CEFR<span style={{ color: 'var(--color-primary)' }}>ACADEMY</span>
                    </Link>

                    <nav className="nav-links">
                        <button onClick={() => scrollTo('hero')} className="nav-link">Practice</button>
                        <button onClick={() => scrollTo('how')} className="nav-link">Methodology</button>
                        <button onClick={() => scrollTo('pricing')} className="nav-link">Pricing</button>
                    </nav>

                    <div className="header-right">
                        <div className="streak-pills">
                            <Flame size={16} />
                            <span>12 DAYS</span>
                        </div>
                        <button className="btn btn-primary" onClick={() => scrollTo('builder')}>
                            <Sparkles size={16} /> Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Style #6 HERO SECTION */}
                <section className="hero-section" id="hero">
                    <div className="container hero-grid">
                        <div className="hero-text">
                            <span className="eyebrow" style={{ color: 'var(--color-secondary)' }}>AI-POWERED CEFR PREP</span>
                            <h1 className="h1-hero">
                                Master your exam with <br />
                                <span className="gradient-text">Personalized AI Feedback.</span>
                            </h1>
                            <p className="hero-description">
                                Stop guessing. Atlas analyzes your Every sentence, identifies errors in real-time, and predicts your official CEFR score with 98% accuracy.
                            </p>
                            <div className="hero-btn-group">
                                <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem' }}>Start Free Practice</button>
                                <button className="btn btn-secondary" style={{ padding: '1.25rem 2.5rem' }}>View Demo</button>
                            </div>
                            <div className="trust-bar">
                                <span>✓ Free to start</span> <span className="dot">·</span>
                                <span>✓ No card required</span> <span className="dot">·</span>
                                <span>✓ Official DTM Standards</span>
                            </div>
                        </div>

                        <div className="ui-mockup-wrapper">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="dark-ui-card"
                            >
                                <div className="notification-pill">
                                    <Sparkles size={14} /> AI Evaluation Ready • 2.4s
                                </div>
                                <div className="mockup-header">
                                    <span className="eyebrow">WRITING • B1 ESSAY</span>
                                    <span className="badge badge-teal">B1 ➔ B2</span>
                                </div>
                                <div className="mockup-body">
                                    "The <span className="underline-error">globalization of technology</span> has changed how we communicate. However, many people <span className="underline-success">remain hesitant to embrace</span> digital changes in their daily routine..."
                                </div>
                                <div className="score-display">
                                    <div className="score-circle">72</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                            <span>Coherence</span>
                                            <span>82%</span>
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                                            <div style={{ width: '82%', height: '100%', background: 'var(--color-primary)' }} />
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.6 }}>
                                    "Your lexical resource is strong, but focus on linking devices in Paragraph 2."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Style #7 TICKER */}
                <div className="ticker-strip">
                    <div className="ticker-content">
                        🚀 2.4k+ STUDENTS PASSED IN 2024 • ★★★★★ 4.9/5 RATING • REAL-TIME AI SCORING • DTM 2025 COMPLIANT • 🚀 2.4k+ STUDENTS PASSED IN 2024 • ★★★★★ 4.9/5 RATING • REAL-TIME AI SCORING • DTM 2025 COMPLIANT
                    </div>
                </div>

                {/* Style #8 PROBLEM SECTION */}
                <section id="problems">
                    <div className="container text-center">
                        <span className="eyebrow" style={{ color: 'var(--color-error)' }}>THE CHALLENGE</span>
                        <h2>Still guessing your CEFR score?</h2>
                        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
                            Most students fail because they practice without feedback. Doing tests isn't enough—you need to know exactly why you're missing points.
                        </p>
                        <div className="problem-grid">
                            <div className="problem-card rose">
                                <Zap className="text-error" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>"I don't know my level"</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Practicing without a target score is driving in the dark. You need a baseline.</p>
                            </div>
                            <div className="problem-card amber">
                                <Clock className="text-warning" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>"Waiting for tutors"</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Don't wait 48 hours for feedback. Get instant AI assessments and corrections.</p>
                            </div>
                            <div className="problem-card indigo">
                                <Activity className="text-primary" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>"Inconsistent Results"</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Official DTM criteria are complex. Atlas ensures you hit every marking point.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Style #11 FEATURES GRID */}
                <section className="section-alt">
                    <div className="container">
                        <div className="text-center">
                            <span className="eyebrow">FEATURES</span>
                            <h2 style={{ marginBottom: '4rem' }}>Everything you need for your result</h2>
                        </div>
                        <div className="features-grid">
                            {[
                                { title: 'Authentic Mocks', desc: '50+ full-length Reading & Listening papers from past exams.', color: 'var(--color-primary)' },
                                { title: 'AI Essay Grading', desc: 'Instant C1-level feedback on every Writing task.', color: 'var(--color-success)' },
                                { title: 'Vocab Lab', desc: 'Master the 1,500 most frequent academic words.', color: 'var(--color-purple)' },
                                { title: 'Speaking Atlas', desc: 'Practice prompts with real-time fluency scoring.', color: 'var(--color-error)' },
                                { title: 'Level Map', desc: 'Visualize your path from A1 to C1 in real-time.', color: 'var(--color-warning)' },
                                { title: 'Grammar Guard', desc: 'Identify recurring structural errors in your writing.', color: 'var(--color-secondary)' }
                            ].map((feat, i) => (
                                <div key={i} className="feature-card">
                                    <div className="accent-line" style={{ background: feat.color }} />
                                    <h3 style={{ marginBottom: '1rem' }}>{feat.title}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Style #15 DARK CTA BANNER */}
                <section className="cta-banner">
                    <div className="container">
                        <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', fontSize: '0.75rem', marginBottom: '2rem' }}>
                            READY TO RANK UP?
                        </div>
                        <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            Stop Guessing. <br />
                            <span style={{ color: 'var(--color-secondary)' }}>Get Your Result.</span>
                        </h2>
                        <div className="hero-btn-group" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-primary">Start Practicing Free</button>
                            <button className="btn btn-secondary" style={{ background: 'transparent', color: '#fff' }}>Contact Support</button>
                        </div>
                    </div>
                </section>

                {/* PLAN BUILDER (SURVEY) */}
                <section id="builder">
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: '4rem' }}>
                            <span className="eyebrow">PLAN BUILDER</span>
                            <h2>Build your study plan</h2>
                            <p className="text-muted">Tell Atlas about your current goals and level.</p>
                        </div>

                        <div className="survey-card">
                            <AnimatePresence mode="wait">
                                {!isGenerating ? (
                                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <div style={{ marginBottom: '3rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>STEP {step} OF 3</span>
                                            <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>{surveyQuestions[step - 1].q}</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {surveyQuestions[step - 1].opts.map(opt => (
                                                <button key={opt} className="btn-survey-option" onClick={() => handleSelect(opt)}>
                                                    <span>{opt}</span>
                                                    <ArrowRight size={18} />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center" style={{ padding: '4rem 0' }}>
                                        <Sparkles className="animate-pulse" size={64} color="var(--color-primary)" />
                                        <h2 style={{ marginTop: '2rem' }}>Building Roadmap...</h2>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </main>

            {/* Style #17 FOOTER */}
            <footer className="onboarding-footer">
                <div className="container footer-grid">
                    <div className="footer-col">
                        <div className="brand-wrapper" style={{ color: 'white', marginBottom: '1.5rem' }}>
                            <Sparkles size={20} /> CEFR ACADEMY
                        </div>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                            The AI-powered platform for national CEFR standards in Uzbekistan.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Practice</h4>
                        <Link to="#" className="footer-link">Reading Mock</Link>
                        <Link to="#" className="footer-link">Listening Mock</Link>
                        <Link to="#" className="footer-link">AI Writing</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Product</h4>
                        <Link to="#" className="footer-link">How it works</Link>
                        <Link to="#" className="footer-link">Pricing</Link>
                        <Link to="#" className="footer-link">AI Atlas</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="#" className="footer-link">About us</Link>
                        <Link to="#" className="footer-link">Terms</Link>
                        <Link to="#" className="footer-link">Privacy</Link>
                    </div>
                </div>
                <div className="container" style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-text-light)', fontSize: '0.8rem' }}>
                    © 2025 CEFR Academy. Powered by Atlas AI.
                </div>
            </footer>
        </div>
    );
};

export default OnboardingSurvey;
