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
                    "positives": ["3-5 positive points"],
                    "improvements": ["3-5 areas to improve"],
                    "grammar_fixes": ["3-5 specific grammar corrections"]
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
            alert("AI scoring failed. Please check your connection.");
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
            style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '3rem' }}
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
                <button
                    onClick={handleSubmit}
                    disabled={submitting || wordCount < 20}
                    className="btn btn-primary"
                    style={{ background: 'var(--gradient-primary)' }}
                >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {lang === 'en' ? 'Submit for AI Scoring' : 'AI baholashga yuborish'}
                </button>
            </header>

            <div className="grid grid-cols-2 gap-6" style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', background: 'var(--color-background-alt)' }}>
                        <button onClick={() => setTask(1)} className={`btn ${task === 1 ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>TASK 1: Letter/Email</button>
                        <button onClick={() => setTask(2)} className={`btn ${task === 2 ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}>TASK 2: Essay</button>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Edit3 size={20} />
                            {lang === 'en' ? `Prompt (Task ${task})` : `Mavzu (${task}-topshiriq)`}
                        </h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', padding: '1rem', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #9333ea' }}>
                            {task === 1 ? (
                                lang === 'en'
                                    ? 'Write a formal email to a university professor asking for information about a research project. Mention your interest and qualifications.'
                                    : 'Universitet professoriga tadqiqot loyihasi haqida ma\'lumot so\'rab rasmiy xat yozing. O\'z qiziqishingiz va ko\'nikmalaringizni aytib o\'ting.'
                            ) : (
                                lang === 'en'
                                    ? 'Some people believe that artificial intelligence will replace teachers in the future. To what extent do you agree or disagree?'
                                    : 'Ba\'zi odamlar sun\'iy intellekt kelajakda o\'qituvchilarning o\'rnini bosadi deb hisoblashadi. Bu fikrga qanchalik qo\'shilasiz yoki qo\'shilmaysiz?'
                            )}
                        </p>
                        <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            {lang === 'en'
                                ? `Write at least ${task === 1 ? '150' : '250'} words.`
                                : `Kamida ${task === 1 ? '150' : '250'} ta so'z yozing.`}
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', flexGrow: 1 }}>
                        <AnimatePresence mode="wait">
                            {feedback ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h4 style={{ margin: 0 }}>{lang === 'en' ? 'Analysis Result' : 'Tahlil natijasi'}</h4>
                                        <div className="badge-premium" style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}>
                                            Level: {feedback.score}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                                        <div style={{ padding: '1rem', background: 'rgba(22, 163, 74, 0.1)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #16a34a' }}>
                                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', marginBottom: '0.5rem' }}><CheckCircle size={16} /> Strengths</strong>
                                            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                                {feedback.positives.map((p, i) => <li key={i}>{p}</li>)}
                                            </ul>
                                        </div>
                                        <div style={{ padding: '1rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f97316' }}>
                                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f97316', marginBottom: '0.5rem' }}><AlertCircle size={16} /> Areas for Improvement</strong>
                                            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                                {feedback.improvements.map((p, i) => <li key={i}>{p}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center" style={{ padding: '2rem' }}>
                                    <Sparkles size={32} style={{ color: '#9333ea', margin: '0 auto 1rem' }} />
                                    <h4>{lang === 'en' ? 'AI Feedback Area' : 'AI Fikr-mulohaza maydoni'}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
                                        {lang === 'en'
                                            ? 'Submit your writing to get a detailed band score based on DTM assessment criteria.'
                                            : 'DTM baholash mezonlari asosida batafsil natija olish uchun inshoni yuboring.'}
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
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
                    <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {lang === 'en' ? 'Target: ' : 'Maqsad: '}
                            <strong>{task === 1 ? '150+' : '250+'}</strong> {lang === 'en' ? 'words' : 'ta so\'z'}
                        </span>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: wordCount < (task === 1 ? 150 : 250) ? 'var(--color-error)' : '#16a34a'
                        }}>
                            {lang === 'en' ? 'Words' : 'So\'zlar'}: {wordCount}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Writing;
