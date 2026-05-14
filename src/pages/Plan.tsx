import { motion } from 'framer-motion';
import { Zap, Calendar, ArrowRight } from 'lucide-react';

interface Props {
    lang: 'en' | 'uz';
}

const Plan = ({ lang }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
            style={{ maxWidth: '900px' }}
        >
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Zap className="text-primary" size={32} />
                    {lang === 'en' ? 'Your AI Study Plan' : 'Sizning AI O\'quv Rejangiz'}
                </h1>
                <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    {lang === 'en' ? 'Generated perfectly for your schedule and targets.' : 'Sizning jadvalingiz va maqsadlaringiz asosida yaratilgan.'}
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Day Item */}
                {[1, 2, 3, 4, 5].map(day => (
                    <div key={day} className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--color-background-alt)', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', minWidth: '70px' }}>
                                <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>{lang === 'en' ? 'Day' : 'Kun'}</span>
                                <strong style={{ fontSize: '1.5rem' }}>{day}</strong>
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '0.25rem' }}>[Task Type: e.g. Reading Practice Test 1]</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> 45 {lang === 'en' ? 'mins' : 'daqiqa'}</span>
                                    <span style={{ color: 'var(--color-primary)' }}>• AI Focus: [Skill target]</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                            {lang === 'en' ? 'Start' : 'Boshlash'} <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Plan;
