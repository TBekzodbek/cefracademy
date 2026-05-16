import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Highlighter, PenTool, CheckCircle, PieChart, Loader2 } from 'lucide-react';
import { MotivationalQuote } from '../components/MotivationalQuote';
import { getAIResponse } from '../lib/ai';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Reading = ({ lang }: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);

    const handleSubmit = async () => {
        setSubmitting(true);
        setExplanation(null);
        try {
            const prompt = `Analyze this CEFR Reading passage context and provide a learning tip for Part 1 matching tasks. Passage title: "The Impact of AI on Modern Education". Language: ${lang === 'en' ? 'English' : 'Uzbek (lotin)'}.`;
            const res = await getAIResponse(prompt);
            setExplanation(res);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

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
                    <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary">
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
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
                            Artificial Intelligence (AI) has become a cornerstone of technological advancement in the 21st century. In the realm of education, its impact is profound, shifting how students learn and how teachers facilitate knowledge. Automated grading systems and personalized learning platforms allow for a more tailored educational experience, accommodating individual student needs that were previously difficult to address in traditional classrooms. However, concerns regarding data privacy and the reduction of human interaction remain significant topics of debate among educational theorists.
                        </p>
                        <div className="skeleton-line" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line half" />
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
                            <div className="part-label primary">PART 1: Matching short texts</div>
                            <div className="part-label secondary">PART 2: Multiple choice</div>
                            <div className="part-label purple">PART 3: Matching headings</div>
                            <div className="part-label dark">PART 4: Multiple choice</div>
                        </div>

                        {/* Premium Analytics Placeholder */}
                        <div className="premium-analytics-card">
                            <h4 className="analytics-title">
                                <PieChart size={20} />
                                <span>{lang === 'en' ? 'AI Suggestion (Premium)' : 'AI Tavsiya (Premium)'}</span>
                            </h4>
                            <p className="text-muted analytics-desc">
                                <AnimatePresence mode="wait">
                                    {explanation ? (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{explanation}</motion.span>
                                    ) : (
                                        <span>{lang === 'en' ? 'Submit your answers to get AI-powered insights on your mistakes.' : 'Xatolaringiz haqida AI tahlilini olish uchun javoblarni yuboring.'}</span>
                                    )}
                                </AnimatePresence>
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
