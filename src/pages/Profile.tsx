import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Award, Target, Settings, Activity, Loader2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    email: string;
    current_level: string;
    target_level: string;
    time_left: string;
    points: number;
    plan_tier: 'free' | 'premium';
}

const Profile = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                setProfile({
                    email: user.email || '',
                    current_level: data?.current_level || 'N/A',
                    target_level: data?.target_level || 'N/A',
                    time_left: data?.time_left || 'N/A',
                    points: data?.points || 0,
                    plan_tier: data?.plan_tier || 'free'
                });
            } else {
                navigate('/login');
            }
            setLoading(false);
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="page-container container flex justify-center items-center" style={{ minHeight: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container"
            style={{ maxWidth: '900px' }}
        >
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--color-background-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--color-primary)' }}>
                    <User size={64} className="text-muted" />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{profile?.email.split('@')[0] || 'User'}</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18} /> {profile?.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: profile?.plan_tier === 'premium' ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                            <Award size={18} /> {profile?.plan_tier === 'premium' ? (lang === 'en' ? 'Premium Member' : 'Premium A\'zo') : (lang === 'en' ? 'Free Plan' : 'Bepul Tarif')}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" title={lang === 'en' ? 'Edit' : 'Tahrirlash'}><Settings size={18} /></button>
                    <button className="btn btn-outline" onClick={handleLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--color-error)' }}>
                        <LogOut size={18} /> {lang === 'en' ? 'Logout' : 'Chiqish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Target className="text-primary" /> {lang === 'en' ? 'Goals & Targets' : 'Maqsadlar'}
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <span>{lang === 'en' ? 'Current Level' : 'Hozirgi daraja'}</span> <strong>{profile?.current_level}</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <span>{lang === 'en' ? 'Target Score' : 'Maqsad qilgan ball'}</span> <strong>{profile?.target_level}</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{lang === 'en' ? 'Time Remaining' : 'Qolgan vaqt'}</span> <strong>{profile?.time_left}</strong>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Activity className="text-success" /> {lang === 'en' ? 'Recent Activity' : 'So\'nggi Faollik'}
                    </h3>
                    <div className="content-placeholder" style={{ minHeight: '120px', padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>{lang === 'en' ? 'No test attempts yet.' : 'Hali testlar topshirilmagan.'}</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>{profile?.points} {lang === 'en' ? 'Points' : 'Ballar'}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
