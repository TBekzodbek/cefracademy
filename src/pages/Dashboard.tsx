import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, GraduationCap, ArrowRight, MessageSquare, Flame, Trophy, Mic, Headphones, Library, CheckCircle, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GamificationService } from '../lib/gamification';
import './PageLayout.css';

interface Props { lang: 'en' | 'uz'; theme: 'light' | 'dark'; }

const Dashboard = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({ xp: 0, streak: 0, level: 1 });

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

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

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '70vh' }}>
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const categories = [
        { to: '/dashboard/reading', label: lang === 'en' ? 'Reading' : 'O\'qib tushunish', sub: 'Mocks 1-50', icon: <BookOpen />, color: '#4F46E5' },
        { to: '/dashboard/listening', label: lang === 'en' ? 'Listening' : 'Tinglab tushunish', sub: 'Mocks 1-50', icon: <Headphones />, color: '#0EA5E9' },
        { to: '/dashboard/vocabulary', label: lang === 'en' ? 'Vocabulary' : 'Lug\'at boyligi', sub: '600+ Words', icon: <Library />, color: '#10B981' },
        { to: '/dashboard/writing', label: lang === 'en' ? 'Writing' : 'Yozma nutq', sub: 'AI Feedback', icon: <GraduationCap />, color: '#7C3AED' },
        { to: '/dashboard/speaking', label: lang === 'en' ? 'Speaking' : 'Og\'zaki nutq', sub: 'Atlas AI', icon: <Mic />, color: '#F59E0B' },
        { to: '/dashboard/ai-chat', label: 'Atlas AI Chat', sub: 'Smart Tutor', icon: <MessageSquare />, color: '#6366f1' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
            {/* Hero Section */}
            <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem', background: 'var(--gradient-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-2xl)' }}>
                <div style={{ maxWidth: '600px' }}>
                    <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem' }}>
                        {lang === 'en' ? 'In Progress' : 'Jarayonda'}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>
                        {lang === 'en' ? `Welcome back, ${profile?.username || 'Learner'}!` : `Xush kelibsiz, ${profile?.username || 'O\'quvchi'}!`}
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '2rem' }}>
                        {lang === 'en' ? 'You are doing great! Keep your streak alive and master your CEFR goals.' : 'Juda yaxshi natija! O\'z maqsadingiz sari intilishda davom eting.'}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/dashboard/reading" className="btn" style={{ background: 'white', color: 'var(--color-primary)' }}>
                            {lang === 'en' ? 'Continue Practice' : 'Amaliyotni davom ettirish'} <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex" style={{ marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--color-primary-soft)', padding: '0.5rem', borderRadius: '12px' }}><Trophy size={20} className="text-primary" /></div>
                        <span className="text-muted">{lang === 'en' ? 'Current Level' : 'Joriy daraja'}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.75rem' }}>Level {stats.level}</h3>
                    <div className="mini-progress-track" style={{ marginTop: '1rem' }}>
                        <div className="mini-progress-bar" style={{ width: `${GamificationService.calculateProgress(stats.xp)}%` }}></div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex" style={{ marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', padding: '0.5rem', borderRadius: '12px' }}><Flame size={20} style={{ color: '#F59E0B' }} /></div>
                        <span className="text-muted">{lang === 'en' ? 'Day Streak' : 'Kunlik streak'}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{stats.streak} {lang === 'en' ? 'Days' : 'Kun'}</h3>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex" style={{ marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '12px' }}><Target size={20} className="text-success" /></div>
                        <span className="text-muted">{lang === 'en' ? 'Goals Met' : 'Maqsadlar'}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{Math.floor(stats.xp / 100)} / {stats.level * 10}</h3>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex" style={{ marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--color-primary-soft)', padding: '0.5rem', borderRadius: '12px' }}><CheckCircle size={20} className="text-primary" /></div>
                        <span className="text-muted">{lang === 'en' ? 'Tests Done' : 'Testlar'}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{profile?.tests_completed || 0}</h3>
                </div>
            </div>

            {/* Main Categories Grid */}
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>
                {lang === 'en' ? 'Learning Categories' : 'O\'quv bo\'limlari'}
            </h2>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {categories.map((cat, i) => (
                    <Link key={i} to={cat.to} style={{ textDecoration: 'none' }}>
                        <motion.div
                            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                            className="glass-panel"
                            style={{ padding: '2rem', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                        >
                            <div style={{ background: `${cat.color}15`, color: cat.color, width: '4rem', height: '4rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                {cat.icon}
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700 }}>{cat.label}</h4>
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>{cat.sub}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

export default Dashboard;
