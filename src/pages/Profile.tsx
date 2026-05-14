import { motion } from 'framer-motion';
import { User, Mail, Award, Target, Settings, Activity } from 'lucide-react';

interface Props {
    lang: 'en' | 'uz';
}

const Profile = ({ lang }: Props) => {
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
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>[User Name]</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18} /> user@example.com</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)' }}><Award size={18} /> Premium Member</span>
                    </div>
                </div>
                <button className="btn btn-outline"><Settings size={18} /> {lang === 'en' ? 'Edit' : 'Tahrirlash'}</button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Target className="text-primary" /> {lang === 'en' ? 'Goals & Targets' : 'Maqsadlar'}
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <span>{lang === 'en' ? 'Target Level' : 'Maqsad qilingan daraja'}</span> <strong>C1</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <span>{lang === 'en' ? 'Exam Date' : 'Imtihon sanasi'}</span> <strong>[Date]</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{lang === 'en' ? 'Study Pace' : 'O\'qish jadalligi'}</span> <strong>[Pace]</strong>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Activity className="text-success" /> {lang === 'en' ? 'Recent Activity' : 'So\'nggi Faollik'}
                    </h3>
                    <div className="content-placeholder" style={{ minHeight: '120px', padding: '0' }}>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>[List of recent completed tests and scores will appear here]</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
