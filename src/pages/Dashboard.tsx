import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen, Headphones, GraduationCap, Mic,
    MessageSquare, Library, Trophy, Bell,
    ArrowRight, Flame, Star, Zap, TrendingUp,
    CheckCircle2, Clock, Target,
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

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function getLiveDate() {
    const n = new Date();
    return `${DAYS[n.getDay()]}, ${MONTHS[n.getMonth()]} ${n.getDate()}`;
}
function getLevelLabel(l: number) { return ({1:'A1',2:'A2',3:'B1',4:'B2',5:'C1'} as Record<number,string>)[l] ?? 'B1'; }
function getNextLevel(l: number) { return ({1:'A2',2:'B1',3:'B2',4:'C1',5:'C1'} as Record<number,string>)[l] ?? 'B2'; }

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
});

const Dashboard = ({ lang }: { lang: 'en' | 'uz' }) => {
    void lang;
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({ xp: 0, streak: 0, level: 3 });
    const [loading, setLoading] = useState(true);
    const [liveDate] = useState(getLiveDate);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate('/login'); return; }
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                setProfile(data);
                setStats({ xp: data.xp || 0, streak: data.streak || 0, level: GamificationService.calculateLevel(data.xp || 0) });
            }
            setLoading(false);
        })();
    }, [navigate]);

    const skills = [
        { id:'reading',   label:'Reading',   sub:'60 min · 35 items', icon:<BookOpen size={22}/>,    color:'#5B50E8', bg:'rgba(91,80,232,0.1)',  progress:45, new:2 },
        { id:'listening', label:'Listening', sub:'35 min · 35 items', icon:<Headphones size={22}/>,  color:'#06B6D4', bg:'rgba(6,182,212,0.1)',  progress:68, new:0 },
        { id:'writing',   label:'Writing',   sub:'60 min · 2 tasks',  icon:<GraduationCap size={22}/>,color:'#F59E0B', bg:'rgba(245,158,11,0.1)', progress:30, new:1 },
        { id:'speaking',  label:'Speaking',  sub:'20 min · 3 parts',  icon:<Mic size={22}/>,          color:'#10B981', bg:'rgba(16,185,129,0.1)', progress:55, new:0 },
    ];

    const levelLabel   = getLevelLabel(stats.level);
    const nextLabel    = getNextLevel(stats.level);
    const xpInLevel    = stats.xp % 500;
    const levelPct     = Math.min(100, Math.round((xpInLevel / 500) * 100));
    const ringOffset   = Math.round(283 - (283 * levelPct) / 100);
    const firstName    = profile?.full_name?.split(' ')[0] || 'Scholar';

    if (loading) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

            {/* ── Welcome bar ─────────────────────────────────── */}
            <div className="dash-top-bar">
                <div>
                    <h1 style={{ fontSize: '1.55rem', fontWeight: 900, marginBottom: '0.15rem', letterSpacing: '-0.025em' }}>
                        Welcome back, {firstName} 👋
                    </h1>
                    <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                        {liveDate} · <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{levelLabel} Active</span>
                    </p>
                </div>
                <div className="dash-top-actions">
                    <button className="icon-btn-outline" title="Notifications" style={{ position: 'relative' }}>
                        <Bell size={17} />
                        <span className="badge-float">2</span>
                    </button>
                    <Link to="/dashboard/reading" className="btn btn-primary" style={{ gap: '0.5rem', textDecoration: 'none' }}>
                        <Target size={15} /> Start Practice
                    </Link>
                </div>
            </div>

            {/* ── Quick stats chips ────────────────────────────── */}
            <motion.div {...fadeUp(0.05)} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                {[
                    { icon: <Flame size={14} fill="currentColor" />, color: '#F97316', bg: 'rgba(249,115,22,0.1)', val: `${stats.streak} day streak` },
                    { icon: <Zap size={14} fill="currentColor" />,   color: '#5B50E8',  bg: 'var(--color-primary-soft)', val: `${stats.xp.toLocaleString()} XP` },
                    { icon: <TrendingUp size={14} />,               color: '#10B981',  bg: 'rgba(16,185,129,0.1)', val: `Level ${levelLabel}` },
                    { icon: <Trophy size={14} />,                   color: '#D97706',  bg: 'rgba(245,158,11,0.1)', val: 'Rank #1 today' },
                ].map(chip => (
                    <div key={chip.val} style={{
                        display: 'flex', alignItems: 'center', gap: '0.45rem',
                        padding: '0.4rem 0.9rem', borderRadius: '999px',
                        background: chip.bg, color: chip.color,
                        fontSize: '0.78rem', fontWeight: 700,
                    }}>
                        {chip.icon} {chip.val}
                    </div>
                ))}
            </motion.div>

            {/* ── Progress banner ──────────────────────────────── */}
            <motion.div
                {...fadeUp(0.1)}
                style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem 2.5rem',
                    marginBottom: '1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div style={{ position:'absolute', right:'-60px', top:'-60px', width:'240px', height:'240px', background:'rgba(91,80,232,0.25)', borderRadius:'50%', filter:'blur(60px)' }} />
                <div style={{ position:'absolute', left:'30%', bottom:'-80px', width:'200px', height:'200px', background:'rgba(6,182,212,0.12)', borderRadius:'50%', filter:'blur(50px)' }} />

                {/* SVG ring */}
                <div style={{ position:'relative', flexShrink:0 }}>
                    <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform:'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="7" />
                        <motion.circle cx="50" cy="50" r="45" fill="none" stroke="#7C6FFF" strokeWidth="7"
                            strokeDasharray="283" initial={{ strokeDashoffset:283 }}
                            animate={{ strokeDashoffset:ringOffset }}
                            transition={{ duration:1.2, ease:'easeOut' }} strokeLinecap="round" />
                    </svg>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                        <span style={{ fontSize:'1.3rem', fontWeight:900, color:'white', lineHeight:1 }}>{levelLabel}</span>
                        <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.45)', fontWeight:600, marginTop:'2px' }}>{levelPct}%</span>
                    </div>
                </div>

                <div style={{ flex:1, position:'relative', zIndex:1 }}>
                    <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', display:'block', marginBottom:'0.35rem' }}>
                        CURRENT PROGRESS
                    </span>
                    <h2 style={{ color:'white', fontSize:'1.3rem', fontWeight:800, marginBottom:'0.9rem' }}>
                        On path to {nextLabel} Upper
                    </h2>
                    <div style={{ height:'5px', background:'rgba(255,255,255,0.1)', borderRadius:'10px', maxWidth:'300px' }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${levelPct}%` }} transition={{ duration:1.2, ease:'easeOut' }}
                            style={{ height:'100%', background:'#7C6FFF', borderRadius:'10px' }} />
                    </div>
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem', marginTop:'0.4rem' }}>
                        {500 - xpInLevel} XP needed · keep your streak going!
                    </p>
                </div>

                <div style={{ display:'flex', gap:'2rem', flexShrink:0, position:'relative', zIndex:1 }}>
                    {[
                        { icon:<Zap size={13} color="#7C6FFF"/>, val:stats.xp, label:'TOTAL XP' },
                        { icon:<Flame size={13} color="#F97316"/>, val:stats.streak, label:'STREAK' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign:'center' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', justifyContent:'center', marginBottom:'0.2rem' }}>
                                {s.icon}
                                <span style={{ fontSize:'1.4rem', fontWeight:900, color:'white' }}>{s.val}</span>
                            </div>
                            <span style={{ fontSize:'9px', fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Upsell banner ────────────────────────────────── */}
            <motion.div {...fadeUp(0.16)} style={{
                background: 'linear-gradient(135deg,#4338ca,#5B50E8)',
                borderRadius: 'var(--radius-xl)',
                padding: '1rem 1.5rem',
                marginBottom: '1.75rem',
                display: 'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem',
            }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'0.5rem', display:'flex' }}>
                        <Zap size={16} color="white" fill="white" />
                    </div>
                    <div>
                        <div style={{ color:'white', fontWeight:700, fontSize:'0.88rem' }}>Unlock Speaking &amp; Full Mocks</div>
                        <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.75rem' }}>Free trial active · 3 Writing checks remaining</div>
                    </div>
                </div>
                <Link to="/dashboard/pricing" style={{
                    background:'white', color:'var(--color-primary)',
                    padding:'0.45rem 1.1rem', borderRadius:'var(--radius-lg)',
                    fontWeight:700, fontSize:'0.8rem', textDecoration:'none', whiteSpace:'nowrap', flexShrink:0,
                }}>
                    Upgrade →
                </Link>
            </motion.div>

            {/* ── Main grid: 2 cols ────────────────────────────── */}
            <div style={{ display:'grid', gridTemplateColumns:'1.45fr 1fr', gap:'1.5rem', alignItems:'start' }}>

                {/* LEFT */}
                <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                    {/* Section title */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <h3 style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>
                            Learning Modules
                        </h3>
                        <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--color-primary)', cursor:'pointer' }}>
                            View all →
                        </span>
                    </div>

                    {/* 2×2 skill cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
                        {skills.map((s, i) => (
                            <motion.div key={s.id} {...fadeUp(0.2 + i * 0.06)}>
                                <Link to={`/dashboard/${s.id}`} style={{ textDecoration:'none', display:'block' }}>
                                    <motion.div
                                        whileHover={{ y:-4, boxShadow:'var(--shadow-md)' }}
                                        className="glass-panel"
                                        style={{ padding:'1.5rem', cursor:'pointer', position:'relative', overflow:'hidden' }}
                                    >
                                        {s.new > 0 && (
                                            <div style={{
                                                position:'absolute', top:'10px', right:'10px',
                                                background:s.color, color:'white',
                                                fontSize:'0.6rem', fontWeight:800,
                                                padding:'1px 7px', borderRadius:'999px',
                                            }}>
                                                {s.new} new
                                            </div>
                                        )}
                                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.1rem' }}>
                                            <div style={{ background:s.bg, color:s.color, padding:'0.65rem', borderRadius:'12px', display:'flex' }}>
                                                {s.icon}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight:800, fontSize:'0.95rem', color:'var(--color-text-main)' }}>{s.label}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--color-text-light)', fontWeight:600 }}>{s.sub}</div>
                                            </div>
                                        </div>
                                        <div style={{ height:'4px', background:'var(--color-background-alt)', borderRadius:'10px', marginBottom:'0.5rem' }}>
                                            <motion.div
                                                initial={{ width:0 }}
                                                animate={{ width:`${s.progress}%` }}
                                                transition={{ duration:1, delay:0.3 + i*0.08 }}
                                                style={{ height:'100%', background:s.color, borderRadius:'10px' }}
                                            />
                                        </div>
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                            <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--color-text-light)' }}>
                                                {s.progress}% complete
                                            </span>
                                            <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', color:s.color, fontSize:'0.75rem', fontWeight:700 }}>
                                                Practice <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Utility cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
                        {[
                            { to:'/dashboard/vocabulary', icon:<Library size={18}/>, label:'Vocab Lab', sub:'274 active words', color:'var(--color-success)', bg:'rgba(16,185,129,0.1)' },
                            { to:'/dashboard/ai-chat',    icon:<MessageSquare size={18}/>, label:'Atlas AI', sub:'Ask anything', color:'var(--color-primary)', bg:'var(--color-primary-soft)' },
                        ].map(u => (
                            <Link key={u.to} to={u.to} style={{ textDecoration:'none' }}>
                                <motion.div whileHover={{ y:-2 }} className="glass-panel"
                                    style={{ padding:'1.1rem 1.25rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
                                    <div style={{ background:u.bg, color:u.color, padding:'0.55rem', borderRadius:'10px', display:'flex' }}>
                                        {u.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--color-text-main)' }}>{u.label}</div>
                                        <div style={{ fontSize:'0.7rem', color:'var(--color-text-light)', fontWeight:600 }}>{u.sub}</div>
                                    </div>
                                    <ArrowRight size={14} color="var(--color-text-light)" style={{ marginLeft:'auto' }} />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                    {/* Today's Goals */}
                    <motion.div {...fadeUp(0.22)} className="glass-panel" style={{ padding:'1.5rem' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem' }}>
                            <h3 style={{ fontSize:'0.9rem', fontWeight:800 }}>Today's Goals</h3>
                            <span style={{ background:'var(--color-background-alt)', padding:'2px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:700, color:'var(--color-text-muted)' }}>1/3</span>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                            {[
                                { label:'Write B2 Essay', p:0,   color:'var(--color-warning)', icon:<GraduationCap size={13}/>, note:'Not started' },
                                { label:'Listening Mock', p:100, color:'var(--color-success)', icon:<Headphones size={13}/>,   note:'Done!' },
                                { label:'Master 20 Words', p:65, color:'var(--color-primary)', icon:<Library size={13}/>,      note:'65%' },
                            ].map(g => (
                                <div key={g.label}>
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.35rem' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', fontSize:'0.82rem', fontWeight:600, color:'var(--color-text-main)' }}>
                                            <span style={{ color:g.color }}>{g.icon}</span>
                                            {g.label}
                                        </div>
                                        <span style={{ fontSize:'10px', fontWeight:800, color: g.p === 100 ? 'var(--color-success)' : 'var(--color-text-light)' }}>
                                            {g.p === 100 ? <CheckCircle2 size={13} /> : g.note}
                                        </span>
                                    </div>
                                    <div style={{ height:'3px', background:'var(--color-background-alt)', borderRadius:'10px' }}>
                                        <div style={{ width:`${g.p}%`, height:'100%', background:g.color, borderRadius:'10px', transition:'width 0.8s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div {...fadeUp(0.28)} className="glass-panel" style={{ padding:'1.5rem' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem' }}>
                            <h3 style={{ fontSize:'0.9rem', fontWeight:800 }}>Recent Activity</h3>
                            <Clock size={15} color="var(--color-text-muted)" />
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                            {[
                                { icon:<BookOpen size={14}/>,    color:'#5B50E8', bg:'rgba(91,80,232,0.1)',  title:'Reading Mock #22', meta:'30 min · Score 26/35',   time:'2h ago' },
                                { icon:<Headphones size={14}/>,  color:'#06B6D4', bg:'rgba(6,182,212,0.1)',  title:'Listening Mock #14', meta:'35 min · Score 29/35', time:'Yesterday' },
                                { icon:<GraduationCap size={14}/>, color:'#F59E0B', bg:'rgba(245,158,11,0.1)', title:'Writing Task 2', meta:'B2 · AI rated 64/75', time:'2 days ago' },
                            ].map(a => (
                                <div key={a.title} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                                    <div style={{ background:a.bg, color:a.color, padding:'0.55rem', borderRadius:'10px', display:'flex', flexShrink:0 }}>
                                        {a.icon}
                                    </div>
                                    <div style={{ flex:1, minWidth:0 }}>
                                        <div style={{ fontWeight:700, fontSize:'0.82rem', color:'var(--color-text-main)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.title}</div>
                                        <div style={{ fontSize:'0.7rem', color:'var(--color-text-muted)', fontWeight:500 }}>{a.meta}</div>
                                    </div>
                                    <span style={{ fontSize:'0.65rem', color:'var(--color-text-light)', fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>{a.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Leaderboard */}
                    <motion.div {...fadeUp(0.34)} className="glass-panel" style={{ padding:'1.5rem' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem' }}>
                            <h3 style={{ fontSize:'0.9rem', fontWeight:800 }}>Leaderboard</h3>
                            <Trophy size={15} color="var(--color-warning)" />
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                            {[
                                { n:'Jaloliddin Q.', s:2450, r:1 },
                                { n:'Azizbek M.',    s:2100, r:2 },
                                { n:'Sardor T.',     s:1950, r:3 },
                                { n:'Nilufar A.',    s:1720, r:4 },
                            ].map(u => (
                                <div key={u.n} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.5rem 0.6rem', borderRadius:'10px', background: u.r === 1 ? 'var(--color-primary-soft)' : 'transparent' }}>
                                    <div style={{
                                        width:'26px', height:'26px', borderRadius:'50%', flexShrink:0,
                                        background: u.r===1 ? 'linear-gradient(135deg,#F59E0B,#FBBF24)' : u.r===2 ? '#E2E8F0' : u.r===3 ? '#FED7AA' : 'var(--color-background-alt)',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontWeight:800, fontSize:'11px',
                                        color: u.r===1 ? '#7C2D12' : u.r<=3 ? '#374151' : 'var(--color-text-light)',
                                    }}>
                                        {u.r===1 ? <Star size={12} fill="currentColor"/> : u.r}
                                    </div>
                                    <span style={{ flex:1, fontWeight: u.r===1 ? 700 : 600, fontSize:'0.82rem', color: u.r===1 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{u.n}</span>
                                    <span style={{ fontWeight:800, color: u.r===1 ? 'var(--color-primary)' : 'var(--color-text-light)', fontSize:'0.75rem' }}>{u.s.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="#" style={{ display:'block', marginTop:'1rem', fontSize:'0.75rem', fontWeight:700, color:'var(--color-primary)', textDecoration:'none', textAlign:'center' }}>
                            View Full Rankings →
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
