import { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Crown, CreditCard, BookOpen, Headphones, GraduationCap, Mic, LogOut, CheckCircle, Globe, Sun, Moon, Sparkles, Flame, Trophy, Library } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GamificationService } from '../lib/gamification';
import PricingModal from '../components/PricingModal';
import PromoGate from '../components/PromoGate';
import './DashboardLayout.css';

interface Props {
    lang: 'en' | 'uz';
    toggleLang: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const DashboardLayout = ({ lang, toggleLang, theme, toggleTheme }: Props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ xp: 0, streak: 0, level: 1 });
    const [showPricing, setShowPricing] = useState(false);
    // null = still checking, false = no gate needed, true = gate required
    const [promoStatus, setPromoStatus] = useState<'checking' | 'required' | 'ok'>('checking');

    const closePricing = () => {
        localStorage.setItem('pricing_seen', '1');
        setShowPricing(false);
    };

    // Called by PromoGate after a code is verified — re-run the check so we get fresh DB data
    const onPromoVerified = () => {
        setPromoStatus('ok');
        if (!localStorage.getItem('pricing_seen')) {
            setTimeout(() => setShowPricing(true), 800);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setPromoStatus('checking');

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Fetch profile — use maybeSingle so missing row doesn't throw
            const { data: profile } = await supabase
                .from('profiles')
                .select('xp, streak, promo_verified')
                .eq('id', user.id)
                .maybeSingle();

            // promo_verified must be explicitly true — undefined/null/false all trigger gate
            const isVerified = profile?.promo_verified === true;

            if (!isVerified) {
                setPromoStatus('required');
            } else {
                setPromoStatus('ok');
                if (!localStorage.getItem('pricing_seen')) {
                    setTimeout(() => setShowPricing(true), 600);
                }
            }

            if (profile) {
                setStats({
                    xp: profile.xp || 0,
                    streak: profile.streak || 0,
                    level: GamificationService.calculateLevel(profile.xp || 0),
                });
            }
        };
        fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, location.pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const menuItems = [
        { section: lang === 'en' ? 'Main' : 'Asosiy' },
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: lang === 'en' ? 'Overview' : 'Umumiy' },
        { to: '/dashboard/profile', icon: <User size={20} />, label: lang === 'en' ? 'My Profile' : 'Mening Profilim' },
        { to: '/dashboard/plan', icon: <CheckCircle size={20} />, label: lang === 'en' ? 'My AI Plan' : 'AI Rejam' },
        { to: '/dashboard/ai-chat', icon: <Sparkles size={20} />, label: lang === 'en' ? 'Atlas AI Chat' : 'Atlas AI Suhbat' },

        { section: lang === 'en' ? 'Practice Categories' : 'Amaliyot bo\'limlari' },
        { to: '/dashboard/reading', icon: <BookOpen size={20} />, label: lang === 'en' ? 'Reading' : 'O\'qib tushunish' },
        { to: '/dashboard/listening', icon: <Headphones size={20} />, label: lang === 'en' ? 'Listening' : 'Tinglab tushunish' },
        { to: '/dashboard/vocabulary', icon: <Library size={20} />, label: lang === 'en' ? 'Vocabulary' : 'Lug\'at boyligi' },
        { to: '/dashboard/writing', icon: <GraduationCap size={20} />, label: lang === 'en' ? 'Writing' : 'Yozma nutq' },
        { to: '/dashboard/speaking', icon: <Mic size={20} />, label: lang === 'en' ? 'Speaking' : 'Og\'zaki nutq' },

        { section: lang === 'en' ? 'Account' : 'Hisob' },
        { to: '/dashboard/pricing', icon: <CreditCard size={20} />, label: lang === 'en' ? 'Pricing & Plans' : 'Ta\'riflar' },
    ];

    const xpProgress = GamificationService.calculateProgress(stats.xp);

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar glass-panel">
                <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" className="brand allow-select">
                            <span className="brand-logo">CEFR</span>
                            <span className="brand-text">ACADEMY</span>
                        </Link>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn btn-ghost theme-toggle-sidebar" onClick={toggleTheme} title="Toggle Theme" style={{ padding: '0.4rem' }}>
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                            <button className="btn btn-ghost lang-toggle-sidebar" onClick={toggleLang} style={{ padding: '0.4rem' }}>
                                <Globe size={18} />
                                <span style={{ fontSize: '0.8rem' }}>{lang.toUpperCase()}</span>
                            </button>
                        </div>
                    </div>

                    {/* User Mini Stats */}
                    <div className="sidebar-stats-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0,
                            }}>
                                {(stats.level <= 2 ? 'A' : stats.level <= 4 ? 'B' : 'C')}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FBBF24' }}>
                                        <Flame size={13} fill="currentColor" />
                                        <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white' }}>{stats.streak}d</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#7C6FFF' }}>
                                        <Trophy size={13} />
                                        <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white' }}>Lvl {stats.level}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mini-progress-track">
                            <div className="mini-progress-bar" style={{ width: `${xpProgress}%` }}></div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => {
                        if (item.section) {
                            return <div key={index} className="sidebar-section-title">{item.section}</div>;
                        }
                        return (
                            <Link
                                key={item.to}
                                to={item.to!}
                                className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-premium-card">
                    <Crown size={20} style={{ color: '#FBBF24', marginBottom: '0.4rem' }} />
                    <h4>{lang === 'en' ? 'Go Premium' : 'Premium qiling'}</h4>
                    <p>{lang === 'en' ? 'Unlock speaking, full mocks & AI writing.' : 'Speaking, to\'liq testlar va AI yozuv.'}</p>
                    <Link to="/dashboard/pricing" className="btn-premium">
                        {lang === 'en' ? 'Upgrade Now' : 'Hozir o\'tish'}
                    </Link>
                </div>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-link text-error" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut size={20} />
                        <span>{lang === 'en' ? 'Log Out' : 'Chiqish'}</span>
                    </button>
                </div>
            </aside>

            <main className="dashboard-main-content">
                <Outlet />
            </main>

            {/* Promo gate — full-screen blocker, shown while checking OR when required */}
            {(promoStatus === 'checking' || promoStatus === 'required') && (
                <PromoGate
                    onVerified={onPromoVerified}
                    lang={lang}
                    loading={promoStatus === 'checking'}
                />
            )}

            {/* Post-login pricing upsell — only after gate clears */}
            {promoStatus === 'ok' && (
                <PricingModal open={showPricing} onClose={closePricing} lang={lang} />
            )}
        </div>
    );
};

export default DashboardLayout;
