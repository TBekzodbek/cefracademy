import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen, Headphones, GraduationCap, Mic,
    MessageSquare, Library, Trophy, Bell,
    Plus, ArrowRight, Flame, Star, Zap
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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getLiveDate(): string {
    const now = new Date();
    return `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

function getLevelLabel(level: number): string {
    const map: Record<number, string> = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1' };
    return map[level] ?? 'B1';
}

function getNextLevel(level: number): string {
    const map: Record<number, string> = { 1: 'A2', 2: 'B1', 3: 'B2', 4: 'C1', 5: 'C1' };
    return map[level] ?? 'B2';
}

const Dashboard = ({ lang }: { lang: 'en' | 'uz' }) => {
    void lang;
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({ xp: 0, streak: 0, level: 3 });
    const [loading, setLoading] = useState(true);
    const [liveDate] = useState(getLiveDate);

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
        {
            id: 'reading',
            label: 'Reading',
            sub: '60 min · 35 Items',
            icon: <BookOpen size={20} />,
            color: 'var(--color-primary)',
            bg: 'rgba(91,80,232,0.08)',
            progress: 45,
        },
        {
            id: 'listening',
            label: 'Listening',
            sub: '35 min · 35 Items',
            icon: <Headphones size={20} />,
            color: 'var(--color-secondary)',
            bg: 'rgba(6,182,212,0.08)',
            progress: 68,
        },
        {
            id: 'writing',
            label: 'Writing',
            sub: '60 min · 2 Tasks',
            icon: <GraduationCap size={20} />,
            color: 'var(--color-warning)',
            bg: 'rgba(245,158,11,0.08)',
            progress: 30,
        },
        {
            id: 'speaking',
            label: 'Speaking',
            sub: '20 min · 3 Parts',
            icon: <Mic size={20} />,
            color: 'var(--color-success)',
            bg: 'rgba(16,185,129,0.08)',
            progress: 55,
        },
    ];

    const levelLabel = getLevelLabel(stats.level);
    const nextLabel = getNextLevel(stats.level);
    const xpInLevel = stats.xp % 500;
    const levelPct = Math.min(100, Math.round((xpInLevel / 500) * 100));
    const ringOffset = Math.round(283 - (283 * levelPct) / 100);

    if (loading) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

            {/* ── Top bar ── */}
            <div className="dash-top-bar">
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                        Welcome back, {profile?.full_name?.split(' ')[0] || 'Scholar'} 👋
                    </h1>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {liveDate} · Phase {levelLabel} Active
                    </p>
                </div>
                <div className="dash-top-actions">
                    <button className="icon-btn-outline" title="Notifications">
                        <Bell size={18} />
                    </button>
                    <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                        <Plus size={16} /> New Practice
                    </button>
                </div>
            </div>

            {/* ── CEFR Level Banner (deep purple gradient, cefrai.uz style) ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e1b4b 100%)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem 2.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Decorative glow blob */}
                <div style={{
                    position: 'absolute', right: '-60px', top: '-60px',
                    width: '240px', height: '240px',
                    background: 'rgba(91,80,232,0.25)',
                    borderRadius: '50%', filter: 'blur(60px)',
                }} />

                {/* Level ring */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <svg width="96" height="96" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="6" />
                        <motion.circle
                            cx="50" cy="50" r="45" fill="none"
                            stroke="#7C6FFF" strokeWidth="6"
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: ringOffset }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{levelLabel}</span>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: '2px' }}>{levelPct}%</span>
                    </div>
                </div>

                {/* Level info */}
                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                        CURRENT PROGRESS
                    </span>
                    <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                        On path to {nextLabel} Upper
                    </h2>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', maxWidth: '320px' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${levelPct}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            style={{ height: '100%', background: '#7C6FFF', borderRadius: '10px' }}
                        />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
                        {500 - xpInLevel} XP until {nextLabel}
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '2.5rem', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
                            <Zap size={14} color="#7C6FFF" />
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{stats.xp}</span>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>TOTAL XP</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
                            <Flame size={14} color="#F97316" />
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{stats.streak}</span>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>STREAK</span>
                    </div>
                </div>
            </motion.div>

            {/* ── Upsell / Notification Banner (cefrai.uz style) ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                style={{
                    background: 'linear-gradient(135deg, #4338ca 0%, #5B50E8 100%)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.1rem 1.75rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
                        <Zap size={18} color="white" fill="white" />
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Unlock Speaking & Full Mocks</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>Free trial active · 3 Writing checks remaining</div>
                    </div>
                </div>
                <Link to="/dashboard/pricing" style={{ background: 'white', color: 'var(--color-primary)', padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Upgrade →
                </Link>
            </motion.div>

            {/* ── Main grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem' }}>

                {/* Left column */}
                <div>
                    {/* 4 Skill Cards */}
                    <h3 style={{ marginBottom: '1.1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Learning Modules
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {skills.map((s, i) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + i * 0.06 }}
                            >
                                <Link to={`/dashboard/${s.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                    <motion.div
                                        whileHover={{ translateY: -3, boxShadow: 'var(--shadow-md)' }}
                                        className="glass-panel"
                                        style={{
                                            padding: '1.5rem',
                                            borderLeft: `3px solid ${s.color}`,
                                            borderRadius: 'var(--radius-xl)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ background: s.bg, color: s.color, padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
                                                    {s.icon}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{s.label}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 600 }}>Mock #{i + 12}</div>
                                                </div>
                                            </div>
                                            <ArrowRight size={15} color="var(--color-text-light)" />
                                        </div>
                                        <div style={{ height: '4px', background: 'var(--color-background-alt)', borderRadius: '10px', marginBottom: '0.6rem' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.progress}%` }}
                                                transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                                                style={{ height: '100%', background: s.color, borderRadius: '10px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-light)' }}>{s.sub}</span>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: s.color }}>{s.progress}%</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Utility cards row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/dashboard/vocabulary" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ translateY: -2 }}
                                className="glass-panel"
                                style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '3px solid var(--color-success)' }}
                            >
                                <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
                                    <Library size={18} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Vocab Lab</div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 600 }}>274 active words</div>
                                </div>
                            </motion.div>
                        </Link>
                        <Link to="/dashboard/ai-chat" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ translateY: -2 }}
                                className="glass-panel"
                                style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '3px solid var(--color-primary)' }}
                            >
                                <div style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)', padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Atlas AI</div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 600 }}>Smart Assistant</div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Daily Goals */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Today's Goals</h3>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-light)', background: 'var(--color-background-alt)', padding: '2px 8px', borderRadius: '6px' }}>1/3</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { l: 'Write B2 Essay', p: 0, c: 'var(--color-warning)', icon: <GraduationCap size={14} /> },
                                { l: 'Listening Mock #12', p: 100, c: 'var(--color-success)', icon: <Headphones size={14} /> },
                                { l: 'Master 20 New Words', p: 65, c: 'var(--color-primary)', icon: <Library size={14} /> },
                            ].map((g, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                                            <span style={{ color: g.c }}>{g.icon}</span>
                                            {g.l}
                                        </div>
                                        <span style={{ fontWeight: 700, color: g.p === 100 ? 'var(--color-success)' : 'var(--color-text-light)', fontSize: '11px' }}>
                                            {g.p === 100 ? '✓ Done' : `${g.p}%`}
                                        </span>
                                    </div>
                                    <div style={{ height: '3px', background: 'var(--color-background-alt)', borderRadius: '10px' }}>
                                        <div style={{ width: `${g.p}%`, height: '100%', background: g.c, borderRadius: '10px', transition: 'width 0.8s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Leaderboard</h3>
                            <Trophy size={15} color="var(--color-warning)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { n: 'Jaloliddin Q.', s: 2450, r: 1 },
                                { n: 'Azizbek M.', s: 2100, r: 2 },
                                { n: 'Sardor T.', s: 1950, r: 3 },
                                { n: 'Nilufar A.', s: 1720, r: 4 },
                            ].map(u => (
                                <div key={u.n} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                                        background: u.r === 1 ? 'linear-gradient(135deg,#F59E0B,#FBBF24)' : u.r === 2 ? '#E2E8F0' : u.r === 3 ? '#FED7AA' : 'var(--color-background-alt)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '11px',
                                        color: u.r === 1 ? '#7C2D12' : u.r <= 3 ? '#374151' : 'var(--color-text-light)',
                                    }}>
                                        {u.r === 1 ? <Star size={12} fill="currentColor" /> : u.r}
                                    </div>
                                    <span style={{ flex: 1, fontWeight: 600, color: u.r === 1 ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>{u.n}</span>
                                    <span style={{ fontWeight: 800, color: u.r === 1 ? 'var(--color-primary)' : 'var(--color-text-light)', fontSize: '11px' }}>{u.s.toLocaleString()} XP</span>
                                </div>
                            ))}
                        </div>
                        <Link to="#" style={{ display: 'block', marginTop: '1.25rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', textAlign: 'center' }}>
                            View Full Rankings →
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
