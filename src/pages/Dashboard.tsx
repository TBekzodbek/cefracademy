import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen, Headphones, GraduationCap, Mic,
    MessageSquare, Library, Trophy, Bell, Notebook,
    Plus, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GamificationService } from '../lib/gamification';
import './PageLayout.css';

interface Profile {
    full_name: string;
    xp: number;
    streak: number;
    target_level?: string;
}

const Dashboard = ({ lang }: { lang: 'en' | 'uz' }) => {
    console.log('Lang set to:', lang); // Use lang to avoid unused error
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({ xp: 0, streak: 0, level: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate('/login'); return; }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setStats({
                    xp: profileData.xp || 0,
                    streak: profileData.streak || 0,
                    level: GamificationService.calculateLevel(profileData.xp || 0)
                });
            }
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    const skills = [
        { id: 'reading', label: 'Reading', sub: '60 min | 35 Items', icon: <BookOpen />, color: 'var(--color-purple)' },
        { id: 'listening', label: 'Listening', sub: '35 min | 35 Items', icon: <Headphones />, color: 'var(--color-secondary)' },
        { id: 'writing', label: 'Writing', sub: '60 min | 2 Tasks', icon: <GraduationCap />, color: 'var(--color-warning)' },
        { id: 'speaking', label: 'Speaking', sub: '20 min | 3 Parts', icon: <Mic />, color: 'var(--color-success)' },
    ];

    if (loading) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Style #18 TOP BAR */}
            <div className="dash-top-bar">
                <div>
                    <h1 style={{ fontSize: '28px' }}>👋 Welcome back, {profile?.full_name?.split(' ')[0] || 'Scholar'}</h1>
                    <p className="text-muted">Sunday, May 17 • Phase B1 Active</p>
                </div>
                <div className="dash-top-actions">
                    <button className="icon-btn-outline"><Bell size={20} /></button>
                    <button className="icon-btn-outline">
                        <Notebook size={20} />
                        <span className="badge-float">3</span>
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={18} /> New Practice
                    </button>
                </div>
            </div>

            {/* STYLE #18 CEFR LEVEL BANNER */}
            <div className="level-banner-card">
                <div className="level-ring-wrapper">
                    <svg className="level-progress-ring" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                        <motion.circle
                            cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)"
                            strokeWidth="6" strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * 0.72) }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </svg>
                    <div className="level-text-overlay">B1</div>
                </div>
                <div>
                    <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>CURRENT PROGRESS</span>
                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>On path to B2 Upper</h2>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', width: '300px' }}>
                        <div style={{ width: '72%', height: '100%', background: 'var(--color-primary)', borderRadius: '10px' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div className="text-center">
                        <div style={{ fontSize: '24px', fontWeight: 800 }}>{stats.xp}</div>
                        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>TOTAL XP</div>
                    </div>
                    <div className="text-center">
                        <div style={{ fontSize: '24px', fontWeight: 800 }}>{stats.streak}</div>
                        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>STREAK</div>
                    </div>
                </div>
            </div>

            {/* MAIN DASHBOARD GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* 4 Skill Cards Grid */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Learning Modules</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        {skills.map(s => (
                            <Link key={s.id} to={`/dashboard/${s.id}`} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ translateY: -3, boxShadow: 'var(--shadow-indigo)' }}
                                    className="glass-panel"
                                    style={{ padding: '2rem', border: '1px solid rgba(0,0,0,0.05)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ background: `${s.color}15`, color: s.color, padding: '0.75rem', borderRadius: '12px' }}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{s.label}</h4>
                                            <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Active Mock: #12</p>
                                        </div>
                                    </div>
                                    <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '10px', marginBottom: '0.75rem' }}>
                                        <div style={{ width: '45%', height: '100%', background: s.color, borderRadius: '10px' }} />
                                    </div>
                                    <div className="flex-between">
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-light)' }}>{s.sub}</span>
                                        <ArrowRight size={14} className="text-light" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Secondary Utilities */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <Link to="/dashboard/vocabulary" style={{ textDecoration: 'none' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Library className="text-success" />
                                <div>
                                    <h4 style={{ margin: 0 }}>Vocab Lab</h4>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>274 Active words</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/dashboard/ai-chat" style={{ textDecoration: 'none' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MessageSquare className="text-primary" />
                                <div>
                                    <h4 style={{ margin: 0 }}>Atlas AI</h4>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Smart Assistant</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Sidebar Cards: Goals & Leaderboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Daily Goals</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[
                                { l: 'Write B2 Essay', p: 0, c: 'var(--color-warning)' },
                                { l: 'Listening Mock #12', p: 100, c: 'var(--color-success)' },
                                { l: 'Master 20 New Words', p: 65, c: 'var(--color-primary)' }
                            ].map((g, i) => (
                                <div key={i}>
                                    <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '13px' }}>
                                        <span style={{ fontWeight: 600 }}>{g.l}</span>
                                        <span className="text-muted">{g.p === 100 ? '✓' : `${g.p}%`}</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '10px' }}>
                                        <div style={{ width: `${g.p}%`, height: '100%', background: g.c, borderRadius: '10px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Leaderboard</h3>
                            <Trophy size={16} className="text-warning" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { n: 'Jaloliddin Q.', s: 2450, r: 1 },
                                { n: 'Azizbek M.', s: 2100, r: 2 },
                                { n: 'Sardor T.', s: 1950, r: 3 }
                            ].map(u => (
                                <div key={u.n} className="flex-between" style={{ fontSize: '14px' }}>
                                    <div className="flex" style={{ gap: '0.75rem' }}>
                                        <span style={{ fontWeight: 800, color: u.r === 1 ? 'var(--color-warning)' : 'var(--color-text-light)' }}>{u.r}</span>
                                        <span style={{ fontWeight: 600 }}>{u.n}</span>
                                    </div>
                                    <span style={{ fontWeight: 700 }}>{u.s} XP</span>
                                </div>
                            ))}
                        </div>
                        <Link to="#" style={{ display: 'block', marginTop: '1.5rem', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none' }}>
                            View All Rankings →
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
