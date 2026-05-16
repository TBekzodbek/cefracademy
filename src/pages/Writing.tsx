import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Edit3, Send, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { model } from '../lib/gemini';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

interface AIFeedback {
    score: string;
    positives: string[];
    improvements: string[];
    grammar_fixes: string[];
}

const Writing = ({ lang }: Props) => {
    const [text, setText] = useState('');
    const [task, setTask] = useState<1 | 2>(1);
    const [wordCount, setWordCount] = useState(0);
    const [feedback, setFeedback] = useState<AIFeedback | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
    }, [text]);

    const handleSubmit = async () => {
        if (wordCount < 10) return alert(lang === 'en' ? 'Please write a bit more first!' : 'Iltimos, avval bir oz ko\'proq yozing!');

        setSubmitting(true);
        setFeedback(null);

        try {
            const prompt = `
                Act as a professional CEFR Examiner for the Uzbekistan DTM National Exam. 
                Task Type: Task ${task} (${task === 1 ? 'Email/Letter' : 'Essay'})
                User Text: "${text}"

                Evaluate based on: Task Fulfillment, Coherence/Cohesion, Lexical Resource, Grammatical Range/Accuracy.
                Return ONLY a JSON object:
                {
                    "score": "B1/B2/C1",
                    "positives": ["3 points"],
                    "improvements": ["3 points"],
                    "grammar_fixes": ["3 points"]
                }
                Language for feedback: ${lang === 'en' ? 'English' : 'Uzbek (lotin)'}
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const resText = response.text().trim();
            const jsonStr = resText.startsWith('```') ? resText.split('```')[1].replace(/^json/, '').trim() : resText;
            setFeedback(JSON.parse(jsonStr));
        } catch (error) {
            console.error("Writing AI Error:", error);
            alert("AI scoring failed.");
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
                        <GraduationCap className="text-secondary" size={28} />
                        <span>{lang === 'en' ? 'Yozma nutq (Writing)' : 'Yozma nutq (Yozish)'}</span>
                    </h1>
                    <p className="text-muted subtitle">
                        {lang === 'en' ? '2 Tasks • 45-60 Minutes • 30 Points Total' : '2 ta topshiriq • 45-60 daqiqa • Umumiy 30 ball'}
                    </p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || wordCount < 20}
                    className="btn btn-primary"
                >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span>{lang === 'en' ? 'Submit for AI Scoring' : 'AI baholashga yuborish'}</span>
                </button>
            </header>

            <div className="writing-content-grid">
                <div className="writing-instructions-side">
                    <div className="task-selector-glass">
                        <button onClick={() => setTask(1)} className={`btn-tab ${task === 1 ? 'active' : ''}`}>TASK 1: Letter/Email</button>
                        <button onClick={() => setTask(2)} className={`btn-tab ${task === 2 ? 'active' : ''}`}>TASK 2: Essay</button>
                    </div>

                    <div className="prompt-panel-glass">
                        <h3 className="prompt-heading">
                            <Edit3 size={20} className="text-primary" />
                            <span>{lang === 'en' ? `Prompt (Task ${task})` : `Mavzu (${task}-topshiriq)`}</span>
                        </h3>
                        <div className="prompt-text-box">
                            {task === 1 ? (
                                lang === 'en'
                                    ? 'Write a formal email to a university professor asking for information about a research project.'
                                    : 'Universitet professoriga tadqiqot loyihasi haqida ma\'lumot so\'rab rasmiy xat yozing.'
                            ) : (
                                lang === 'en'
                                    ? 'Some people believe that artificial intelligence will replace teachers in the future. To what extent do you agree or disagree?'
                                    : 'Ba\'zi odamlar sun\'iy intellekt kelajakda o\'qituvchilarning o\'rnini bosadi deb hisoblashadi.'
                            )}
                        </div>
                    </div>

                    <div className="feedback-panel-glass">
                        <AnimatePresence mode="wait">
                            {feedback ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-content">
                                    <div className="feedback-header">
                                        <h4 className="feedback-title">{lang === 'en' ? 'Analysis Result' : 'Tahlil natijasi'}</h4>
                                        <div className="score-badge">{feedback.score}</div>
                                    </div>
                                    <div className="feedback-sections">
                                        <div className="feedback-box success">
                                            <strong className="label"><CheckCircle size={14} /> Strengths</strong>
                                            <ul>{feedback.positives.map((p, i) => <li key={i}>{p}</li>)}</ul>
                                        </div>
                                        <div className="feedback-box warning">
                                            <strong className="label"><AlertCircle size={14} /> Improvements</strong>
                                            <ul>{feedback.improvements.map((p, i) => <li key={i}>{p}</li>)}</ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="placeholder-content">
                                    <Sparkles size={32} className="icon-sparkles" />
                                    <h4>AI Feedback Area</h4>
                                    <p className="text-muted">Submit your text to get detailed DTM scoring.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="writing-editor-side">
                    <div className="editor-glass">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={lang === 'en' ? 'Start writing your essay here...' : 'Insho yozishni shu yerda boshlang...'}
                            className="editor-textarea"
                        />
                        <div className="editor-footer">
                            <span className="word-goal">
                                {lang === 'en' ? 'Target: ' : 'Maqsad: '}
                                <strong>{task === 1 ? '150+' : '250+'}</strong> {lang === 'en' ? 'words' : 'ta so\'z'}
                            </span>
                            <span className={`word-count ${wordCount < (task === 1 ? 150 : 250) ? 'danger' : 'success'}`}>
                                {lang === 'en' ? 'Words' : 'So\'zlar'}: {wordCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Writing;
