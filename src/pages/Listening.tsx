import { motion } from 'framer-motion';
import { Headphones, PlayCircle, FileText, CheckCircle, Volume2 } from 'lucide-react';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Listening = ({ lang }: Props) => {
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
                <button className="btn btn-primary">
                    <CheckCircle size={18} />
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
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: '45%' }}></div>
                        </div>
                        <div className="time-info">
                            <span>02:14</span>
                            <span>05:30</span>
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
                            <FileText size={20} className="text-primary" />
                            <span>{lang === 'en' ? 'Transcript (Premium)' : 'Transkript (Premium)'}</span>
                        </h4>
                        <div className="placeholder-box">
                            <p className="text-muted">{lang === 'en' ? 'Available after submission.' : 'Yuborilgandan so‘ng ochiladi.'}</p>
                        </div>
                    </div>
                </div>

                <div className="questions-panel-glass">
                    <h3 className="questions-heading">{lang === 'en' ? 'Answer the following:' : 'Savollarga javob bering:'}</h3>

                    <div className="parts-labels-stack">
                        <div className="part-label secondary">
                            PART 1: {lang === 'en' ? 'Short conversations (8 questions)' : 'Qisqa suhbatlar (8 savol)'}
                        </div>
                        <div className="part-label primary">
                            PART 2: {lang === 'en' ? 'Monologues (8 questions)' : 'Monologlar (8 savol)'}
                        </div>
                        <div className="part-label purple">
                            PART 3: {lang === 'en' ? 'Long monologues (9 questions)' : 'Uzun monologlar (9 savol)'}
                        </div>
                        <div className="part-label dark">
                            PART 4: {lang === 'en' ? 'Longer conversations (10 questions)' : 'Uzun suhbatlar (10 savol)'}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Listening;
