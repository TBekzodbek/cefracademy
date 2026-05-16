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
        >
            <header className="page-header-flex">
                <div className="header-info">
                    <h1 className="category-title">
                        <BookOpen className="text-primary" size={28} />
                        <span>{lang === 'en' ? 'O\'qib tushunish (Reading)' : 'O\'qib tushunish (O\'qish)'}</span>
                    </h1>
                    <p className="text-muted subtitle">
                        {lang === 'en' ? '4 Parts • 70 Minutes • 35 Questions' : '4 qism • 70 daqiqa • 35 savol'}
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline">
                        <Highlighter size={18} />
                        <span>{lang === 'en' ? 'Mark Text (3/3)' : 'Belgilash (3/3)'}</span>
                    </button>
                    <button className="btn btn-primary">
                        <CheckCircle size={18} />
                        <span>{lang === 'en' ? 'Submit Answers' : 'Javoblarni yuborish'}</span>
                    </button>
                </div>
            </header>

            <div className="reading-content-grid">
                {/* Left Side: Mock Text */}
                <div className="text-panel-glass">
                    <div className="panel-header">
                        <h2 className="passage-title">{lang === 'en' ? 'The Impact of AI on Modern Education' : 'Sun\'iy intellektning zamonaviy ta\'limga ta\'siri'}</h2>
                        <p className="text-muted author">By CEFR Academy Research Team</p>
                    </div>

                    <div className="passage-content">
                        <p>
                            [Insert full multi-paragraph reading passage text here. The text should be formatted so users can select and highlight it.]
                        </p>
                        <div className="skeleton-line" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line half" />
                        <br />
                        <div className="skeleton-line" />
                        <div className="skeleton-line quarter" />
                    </div>
                </div>

                {/* Right Side: Questions & AI Analytics */}
                <div className="questions-side-stack">
                    <div className="questions-panel-glass">
                        <h3 className="questions-heading">
                            <PenTool className="text-primary" size={20} />
                            <span>{lang === 'en' ? 'Questions 1 - 35' : 'Savollar 1 - 35'}</span>
                        </h3>

                        <div className="parts-labels-stack">
                            <div className="part-label primary">
                                PART 1: {lang === 'en' ? 'Matching short texts (5 questions)' : 'Qisqa matnlarni moslashtirish (5 savol)'}
                            </div>
                            <div className="part-label secondary">
                                PART 2: {lang === 'en' ? 'Multiple choice (5 questions)' : 'Ko\'p variantli savollar (5 savol)'}
                            </div>
                            <div className="part-label purple">
                                PART 3: {lang === 'en' ? 'Matching headings (5 questions)' : 'Sarlavhalarni moslashtirish (5 savol)'}
                            </div>
                            <div className="part-label dark">
                                PART 4: {lang === 'en' ? 'Multiple choice (20 questions)' : 'Ko\'p variantli savollar (20 savol)'}
                            </div>
                        </div>

                        {/* Premium Analytics Placeholder */}
                        <div className="premium-analytics-card">
                            <h4 className="analytics-title">
                                <PieChart size={20} />
                                <span>{lang === 'en' ? 'AI Suggestion (Premium)' : 'AI Tavsiya (Premium)'}</span>
                            </h4>
                            <p className="text-muted analytics-desc">
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
