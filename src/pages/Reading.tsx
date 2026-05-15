import { motion } from 'framer-motion';
import { BookOpen, Highlighter, PenTool, CheckCircle, PieChart } from 'lucide-react';
import { MotivationalQuote } from '../components/MotivationalQuote';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Reading = ({ lang }: Props) => {
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
                        <BookOpen className="text-primary" size={28} />
                        {lang === 'en' ? 'O\'qib tushunish (Reading)' : 'O\'qib tushunish (O\'qish)'}
                    </h1>
                    <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>
                        {lang === 'en' ? '4 Parts • 70 Minutes • 35 Questions' : '4 qism • 70 daqiqa • 35 savol'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                        <Highlighter size={18} /> {lang === 'en' ? 'Mark Text (3/3)' : 'Belgilash (3/3)'}
                    </button>
                    <button className="btn btn-primary">
                        <CheckCircle size={18} /> {lang === 'en' ? 'Submit Answers' : 'Javoblarni yuborish'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-6" style={{ flexGrow: 1, height: '600px' }}>
                {/* Left Side: Mock Text */}
                <div className="glass-panel" style={{ padding: '2rem', overflowY: 'auto' }}>
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
                        <h2>{lang === 'en' ? 'The Impact of AI on Modern Education' : 'Sun\'iy intellektning zamonaviy ta\'limga ta\'siri'}</h2>
                        <p className="text-muted">By CEFR Academy Research Team</p>
                    </div>

                    <div className="content-placeholder" style={{ minHeight: 'auto', padding: '1rem' }}>
                        <p style={{ fontSize: '1rem', textAlign: 'left', lineHeight: '1.8' }}>
                            [Insert full multi-paragraph reading passage text here. The text should be formatted so users can select and highlight it.]
                        </p>
                        <div className="skeleton-line w-full" style={{ width: '100%', height: '1rem', background: 'var(--color-background-alt)', borderRadius: '4px', margin: '1rem 0' }}></div>
                        <div className="skeleton-line w-full" style={{ width: '100%', height: '1rem', background: 'var(--color-background-alt)', borderRadius: '4px', margin: '1rem 0' }}></div>
                        <div className="skeleton-line w-3/4" style={{ width: '75%', height: '1rem', background: 'var(--color-background-alt)', borderRadius: '4px', margin: '1rem 0' }}></div>
                        <br />
                        <div className="skeleton-line w-full" style={{ width: '100%', height: '1rem', background: 'var(--color-background-alt)', borderRadius: '4px', margin: '1rem 0' }}></div>
                        <div className="skeleton-line w-1/2" style={{ width: '50%', height: '1rem', background: 'var(--color-background-alt)', borderRadius: '4px', margin: '1rem 0' }}></div>
                    </div>
                </div>

                {/* Right Side: Questions & AI Analytics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', flexGrow: 1, overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PenTool className="text-primary" size={20} />
                            {lang === 'en' ? 'Questions 1 - 35' : 'Savollar 1 - 35'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="section-part-label" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                                PART 1: {lang === 'en' ? 'Matching short texts (5 questions)' : 'Qisqa matnlarni moslashtirish (5 savol)'}
                            </div>

                            <div className="section-part-label" style={{ padding: '0.5rem 1rem', background: 'var(--color-secondary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                                PART 2: {lang === 'en' ? 'Multiple choice (5 questions)' : 'Ko\'p variantli savollar (5 savol)'}
                            </div>

                            <div className="section-part-label" style={{ padding: '0.5rem 1rem', background: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                                PART 3: {lang === 'en' ? 'Matching headings (5 questions)' : 'Sarlavhalarni moslashtirish (5 savol)'}
                            </div>

                            <div className="section-part-label" style={{ padding: '0.5rem 1rem', background: '#334155', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                                PART 4: {lang === 'en' ? 'Multiple choice (20 questions)' : 'Ko\'p variantli savollar (20 savol)'}
                            </div>
                        </div>

                        {/* Premium Analytics Placeholder */}
                        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
                                <PieChart size={20} />
                                {lang === 'en' ? 'AI Suggestion (Premium)' : 'AI Tavsiya (Premium)'}
                            </h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                [AI will highlight why your selected answer was wrong and show vocabulary meaning context from the text here once submitted.]
                            </p>
                        </div>

                        <MotivationalQuote />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Reading;
