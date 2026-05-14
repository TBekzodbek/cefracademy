import { motion } from 'framer-motion';
import { LayoutDashboard, Star, Target, Zap } from 'lucide-react';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Dashboard = ({ lang }: Props) => {
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
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>B1+</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-warning)' }}>
                        <Star size={24} />
                        <h3 style={{ fontSize: '1.125rem' }}>{lang === 'en' ? 'Total Score' : 'Umumiy ball'}</h3>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>68 / 100</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-success)' }}>
                        <Zap size={24} />
                        <h3 style={{ fontSize: '1.125rem' }}>{lang === 'en' ? 'Tests Completed' : 'Tugallangan testlar'}</h3>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</div>
                </div>
            </div>

            <div className="content-placeholder glass-panel" style={{ minHeight: '300px' }}>
                <div className="placeholder-text">
                    <p>{lang === 'en' ? 'Dashboard statistics coming soon...' : 'Tez orada kabinet statistikasi yuklanadi...'}</p>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line w-3/4"></div>
                    <div className="skeleton-line w-1/2"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
