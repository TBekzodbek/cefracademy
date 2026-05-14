import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Star, Target, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

interface UserProfile {
    current_level: string;
    target_level: string;
    points: number;
    tests_completed: number;
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
                    .select('current_level, target_level, points, tests_completed')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                } else if (error && error.code === 'PGRST116') {
                    // Profile doesn't exist yet, use defaults
                    setProfile({
                        current_level: 'N/A',
                        target_level: 'N/A',
                        points: 0,
                        tests_completed: 0
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="page-container container flex justify-center items-center" style={{ minHeight: '60vh' }}>
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <motion.div
            className="page-container container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="page-header" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LayoutDashboard className="text-primary" size={32} />
                    {lang === 'en' ? 'Your Dashboard' : 'Sizning kabinetingiz'}
                </h1>
                <p className="text-muted" style={{ margin: '0' }}>
                    {lang === 'en'
                        ? 'Track your CEFR preparation progress and performance.'
                        : 'CEFR tayyorgarligi bo\'yicha yutuqlaringizni va natijalaringizni kuzating.'}
                </p>
            </header>

            <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                        <Target size={24} />
                        <h3 style={{ fontSize: '1.125rem' }}>{lang === 'en' ? 'Current Level' : 'Joriy daraja'}</h3>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile?.current_level || 'N/A'}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-warning)' }}>
                        <Star size={24} />
                        <h3 style={{ fontSize: '1.125rem' }}>{lang === 'en' ? 'Total Points' : 'Umumiy ballar'}</h3>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile?.points || 0}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-success)' }}>
                        <Zap size={24} />
                        <h3 style={{ fontSize: '1.125rem' }}>{lang === 'en' ? 'Tests Completed' : 'Tugallangan testlar'}</h3>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile?.tests_completed || 0}</div>
                </div>
            </div>

            <div className="content-placeholder glass-panel" style={{ minHeight: '300px' }}>
                <div className="placeholder-text">
                    <p>{lang === 'en' ? 'Detailed performance analytics will appear here as you take tests.' : 'Test topshirganingiz sari batafsil tahlillar shu yerda ko\'rinadi.'}</p>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line w-3/4"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
