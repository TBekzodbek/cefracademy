import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, PlayCircle, CheckCircle, Volume2, Loader2, Sparkles } from 'lucide-react';
import { getAIResponse } from '../lib/ai';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Listening = ({ lang }: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [insight, setInsight] = useState<string | null>(null);

    const handleSubmit = async () => {
        setSubmitting(true);
        setInsight(null);
        try {
            const prompt = `Analyze current CEFR Listening trends and give a specific tip for Part 4 (Long Conversations). Language: ${lang === 'en' ? 'English' : 'Uzbek (lotin)'}.`;
            const res = await getAIResponse(prompt);
            setInsight(res);
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
        >
            <header className="page-header-flex">
                <div className="header-info">
                    <h1 className="category-title">
                        <Headphones className="text-secondary" size={28} />
                        <span>{lang === 'en' ? 'Tinglab tushunish (Listening)' : 'Tinglab tushunish (Eshitish)'}</span>
                    </h1>
                    <p className="text-muted subtitle">
                        {lang === 'en' ? '4 Parts • 30-35 Minutes • 35 Questions' : '4 qism • 30-35 daqiqa • 35 savol'}
                    </p>
                </div>
                <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    <span>{lang === 'en' ? 'Submit Section' : 'Bo\'limni yakunlash'}</span>
                </button>
            </header>

            <div className="reading-content-grid">
                <div className="listening-audio-side">
                    {/* Audio Player */}
                    <div className="text-panel-glass audio-player-panel">
                        <div className="audio-visualizer-circle">
                            <Volume2 size={32} className="text-secondary" />
                        </div>
                        <div className="progress-track" style={{ margin: '1.5rem 0' }}>
                            <div className="progress-fill" style={{ width: '0%' }}></div>
                        </div>
                        <button className="btn-play-circle">
                            <PlayCircle size={32} />
                        </button>
                        <p className="text-muted source-info">
                            {lang === 'en' ? 'Official CEFR Mock Audio' : 'CEFR rasmiy Mock audiosi'}
                        </p>
                    </div>

                    <div className="text-panel-glass transcript-panel">
                        <h4 className="panel-subheading">
                            <Sparkles size={20} className="text-primary" />
                            <span>{lang === 'en' ? 'AI Insight' : 'AI Tahlili'}</span>
                        </h4>
                        <div className="placeholder-box" style={{ padding: '1rem', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', minHeight: '100px' }}>
                            <AnimatePresence mode="wait">
                                {insight ? (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '0.9rem' }}>{insight}</motion.p>
                                ) : (
                                    <p className="text-muted">{lang === 'en' ? 'Submit your answers to see AI feedback here.' : 'AI tahlilini ko‘rish uchun javoblarni yuboring.'}</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="questions-panel-glass">
                    <h3 className="questions-heading">{lang === 'en' ? 'Answer the following:' : 'Savollarga javob bering:'}</h3>

                    <div className="parts-labels-stack">
                        <div className="part-label secondary">PART 1: Short conversations</div>
                        <div className="part-label primary">PART 2: Monologues</div>
                        <div className="part-label purple">PART 3: Long monologues</div>
                        <div className="part-label dark">PART 4: Longer conversations</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Listening;
