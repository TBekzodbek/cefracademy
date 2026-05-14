import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, GraduationCap, BarChart, TrendingUp, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './PageLayout.css';
import atlasWolfSmall from '../assets/images/atlas-wolf.png';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    current_level: string;
    target_level: string;
    points: number;
    tests_completed: number;
    avg_score?: number; // Score out of 75
    weakness?: string;
    frequency?: string;
}

const Dashboard = ({ lang }: Props) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('current_level, target_level, points, tests_completed, avg_score, weakness, frequency')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                } else if (error && error.code === 'PGRST116') {
                    setProfile({
                        current_level: 'N/A',
                        target_level: 'N/A',
                        points: 0,
                        tests_completed: 0,
                        avg_score: 0
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const getScoreBoundary = (level: string) => {
        if (level.includes('C1')) return 64;
        if (level.includes('B2')) return 49;
        if (level.includes('B1')) return 34;
        return 0;
    };

    const targetBoundary = getScoreBoundary(profile?.target_level || 'B2');
    const progressPercent = profile?.avg_score ? Math.min((profile.avg_score / 75) * 100, 100) : 0;
    const targetPercent = (targetBoundary / 75) * 100;

    // Generated Plan Logic (Mocked based on profile)
    const dailyPlan = [
        { id: 1, task: lang === 'en' ? 'Complete 1 Reading Mock' : '1 ta Reading Mock testi', done: true, time: '30m' },
        { id: 2, task: lang === 'en' ? 'Writing Task 1 (Letter)' : 'Writing Task 1 (Xat)', done: false, time: '20m', priority: profile?.weakness?.includes('Writing') },
        { id: 3, task: lang === 'en' ? 'Listening Dictation' : 'Listening diktanti', done: false, time: '15m' },
    ];

    if (loading) {
        return (
            <div className="page-container container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <header className="page-header" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="avatar-placeholder-large" style={{ background: '#f8fafc', borderRadius: '1rem', padding: '0.5rem' }}>
                        <img src={atlasWolfSmall} alt="Atlas" style={{ width: '80px' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{lang === 'en' ? 'Learning Dash' : 'O\'quv paneli'}</h1>
                        <p style={{ opacity: 0.7 }}>{lang === 'en' ? `Atlas personalized your plan for ${profile?.target_level}.` : `Atlas siz uchun ${profile?.target_level} rejasini tuzdi.`}</p>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid-modern" style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '2rem', marginTop: '2rem' }}>

                {/* Left: Study Plan & Daily Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar size={20} /> {lang === 'en' ? 'My 30-Day Plan' : '30 kunlik rejam'}</h3>
                            <div className="progress-badge">Day 4 of 30</div>
                        </div>

                        <div className="daily-tasks-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {dailyPlan.map(item => (
                                <div key={item.id} className={`task-item ${item.done ? 'task-done' : ''}`}>
                                    <div className="task-checkbox">
                                        {item.done ? <CheckCircle2 className="text-secondary" /> : <div className="empty-check" />}
                                    </div>
                                    <div className="task-info">
                                        <span className="task-name">{item.task}</span>
                                        <span className="task-meta">{item.time} • {item.priority ? '🔥 Priority' : 'Routine'}</span>
                                    </div>
                                    {!item.done && <button className="btn-start-task">{lang === 'en' ? 'Start' : 'Boshlash'}</button>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h3 style={{ marginBottom: '2rem' }}><BarChart size={20} /> {lang === 'en' ? 'Weekly Activity' : 'Haftalik faollik'}</h3>
                        <div className="score-viz-container" style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '1.25rem' }}>
                            {[0.3, 0.5, 0.45, 0.6, 0.75, 0.65, 0.82].map((v, i) => (
                                <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--color-primary)' : '#e2e8f0', height: `${v * 100}%`, borderRadius: '4px' }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Metrics & Levels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stat-card-modern color-primary-dark">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Latest CEFR Score</p>
                                <h4 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{profile?.avg_score || 0}<span style={{ fontSize: '1rem' }}>/75</span></h4>
                            </div>
                            <TrendingUp className="stat-icon-fade" />
                        </div>
                        <div className="mini-progress-track">
                            <div className="mini-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                            <div className="target-marker-line" style={{ left: `${targetPercent}%` }}></div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8 }}>
                            <span>Target: {profile?.target_level}</span>
                            <span>{Math.round(progressPercent)}% achieved</span>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{lang === 'en' ? 'Focus Area' : 'Asosiy e\'tibor'}</h4>
                        <div className="weakness-tag" style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
                            ⚠️ {profile?.weakness || (lang === 'en' ? 'Analyze required' : 'Tahlil zarur')}
                        </div>
                    </div>

                    <div className="stat-card-modern color-white">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Streak</p>
                                <h4 style={{ fontSize: '1.5rem', margin: '0', color: '#0f172a' }}>12 Days</h4>
                            </div>
                            <div className="streak-icon">🔥</div>
                        </div>
                    </div>
                </div>
            </div>

            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{lang === 'en' ? 'Mock Exams' : 'Mock imtihonlar'}</h2>
                <div className="grid grid-cols-2">
                    <Link to="/dashboard/reading" className="training-card-modern">
                        <div className="training-icon-circle" style={{ background: '#eff6ff', color: '#3b82f6' }}><BookOpen /></div>
                        <div className="training-info"><h5>Reading</h5><p>National Exam Prep</p></div>
                        <ArrowRight size={18} className="arrow-fade" />
                    </Link>
                    <Link to="/dashboard/writing" className="training-card-modern">
                        <div className="training-icon-circle" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><GraduationCap /></div>
                        <div className="training-info"><h5>Writing</h5><p>AI Evaluated Tasks</p></div>
                        <ArrowRight size={18} className="arrow-fade" />
                    </Link>
                </div>
            </section>
        </motion.div>
    );
};

export default Dashboard;
