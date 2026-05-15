import { motion } from 'framer-motion';
import { GraduationCap, Edit3, Send, Sparkles } from 'lucide-react';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Writing = ({ lang }: Props) => {
    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                        <GraduationCap className="text-purple" style={{ color: '#9333ea' }} size={28} />
                        {lang === 'en' ? 'Yozma nutq (Writing)' : 'Yozma nutq (Yozish)'}
                    </h1>
                    <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>
                        {lang === 'en' ? '2 Tasks • 45-60 Minutes • 30 Points Total' : '2 ta topshiriq • 45-60 daqiqa • Umumiy 30 ball'}
                    </p>
                </div>
                <button className="btn btn-primary" style={{ background: 'var(--gradient-primary)' }}>
                    <Send size={18} /> {lang === 'en' ? 'Submit for AI Scoring' : 'AI baholashga yuborish'}
                </button>
            </header>

            <div className="grid grid-cols-2 gap-6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', background: 'var(--color-background-alt)' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>TASK 1: Letter/Email</button>
                        <button className="btn btn-ghost" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>TASK 2: Essay</button>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Edit3 size={20} />
                            {lang === 'en' ? 'Prompt (Task 1)' : 'Mavzu (1-topshiriq)'}
                        </h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', padding: '1rem', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #9333ea' }}>
                            {lang === 'en'
                                ? 'Write a formal email to a university professor asking for information about a research project. Mention your interest and qualifications.'
                                : 'Universitet professoriga tadqiqot loyihasi haqida ma\'lumot so\'rab rasmiy xat yozing. O\'z qiziqishingiz va ko\'nikmalaringizni aytib o\'ting.'}
                        </p>
                        <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            {lang === 'en' ? 'Write at least 150 words.' : 'Kamida 150 ta so\'z yozing.'}
                        </p>
                    </div>

                    <div className="glass-panel text-center" style={{ padding: '3rem 2rem', border: '1px dashed var(--color-border)' }}>
                        <Sparkles size={32} style={{ color: '#9333ea', margin: '0 auto 1rem' }} />
                        <h4>{lang === 'en' ? 'AI Feedback Area' : 'AI Fikr-mulohaza maydoni'}</h4>
                        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
                            {lang === 'en'
                                ? 'Submit your writing to get a detailed band score (C1, B2, B1) based on DTM assessment criteria.'
                                : 'DTM baholash mezonlari asosida batafsil natija (C1, B2, B1) olish uchun inshoni yuboring.'}
                        </p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
                    <textarea
                        placeholder={lang === 'en' ? 'Start writing your essay here...' : 'Insho yozishni shu yerda boshlang...'}
                        style={{
                            width: '100%',
                            flexGrow: 1,
                            border: 'none',
                            background: 'transparent',
                            resize: 'none',
                            padding: '1rem',
                            fontSize: '1rem',
                            color: 'var(--color-text-main)',
                            outline: 'none',
                            lineHeight: '1.6'
                        }}
                    ></textarea>
                    <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Words: 0 / 250</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Writing;
