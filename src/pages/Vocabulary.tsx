import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, CheckCircle, Trophy, ArrowRight, RefreshCw, XCircle } from 'lucide-react';
import vocabData from '../data/vocabulary.json';
import { GamificationService } from '../lib/gamification';
import { supabase } from '../lib/supabase';
import './PageLayout.css';

interface Word { en: string; uz: string; }

const Vocabulary = () => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<{ word: Word, options: string[] }[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [finished, setFinished] = useState(false);

    const startQuiz = () => {
        // Generate 10 random questions
        const shuffled = [...vocabData as Word[]].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        const generated = selected.map(word => {
            const others = (vocabData as Word[])
                .filter(w => w.uz !== word.uz)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(w => w.uz);
            return {
                word,
                options: [word.uz, ...others].sort(() => 0.5 - Math.random())
            };
        });

        setQuestions(generated);
        setCurrentQuestion(0);
        setScore(0);
        setQuizStarted(true);
        setFinished(false);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleOptionSelect = (option: string) => {
        if (selectedOption) return;
        setSelectedOption(option);
        const correct = option === questions[currentQuestion].word.uz;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);
    };

    const nextQuestion = () => {
        if (currentQuestion < 9) {
            setCurrentQuestion(c => c + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        setFinished(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await GamificationService.updateActivity(user.id, score * 5); // 5 XP per correct answer
        }
    };

    if (!quizStarted) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
                <header className="page-header text-center" style={{ marginBottom: '4rem' }}>
                    <Library size={64} className="text-primary" style={{ marginBottom: '1.5rem' }} />
                    <h1>Vocabulary Mastery</h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>
                        Master 600+ essential CEFR words. Take a quick 10-question quiz to earn XP and boost your streak.
                    </p>
                    <button onClick={startQuiz} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', marginTop: '2rem' }}>
                        Start Quiz
                    </button>
                </header>

                <div className="dashboard-grid">
                    <div className="stat-card glass-panel text-center">
                        <h3>{vocabData.length}</h3>
                        <p className="text-muted">Words in Library</p>
                    </div>
                    <div className="stat-card glass-panel text-center">
                        <h3>5 XP</h3>
                        <p className="text-muted">Per Correct Answer</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (finished) {
        return (
            <div className="page-container flex-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel text-center" style={{ padding: '4rem', maxWidth: '500px', width: '100%' }}>
                    <Trophy size={80} className="text-warning" style={{ marginBottom: '2rem' }} />
                    <h1 style={{ fontSize: '3rem' }}>{score} / 10</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '2rem' }}>
                        +{score * 5} XP Earned!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={startQuiz} className="btn btn-outline" style={{ flex: 1 }}>
                            <RefreshCw size={18} /> Retry
                        </button>
                        <button onClick={() => setQuizStarted(false)} className="btn btn-primary" style={{ flex: 1 }}>
                            Finish
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="page-container flex-center">
            <div className="quiz-container" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span className="badge primary">Question {currentQuestion + 1} / 10</span>
                    <span className="badge secondary">Score: {score}</span>
                </div>

                <motion.div
                    key={currentQuestion}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass-panel"
                    style={{ padding: '3rem', textAlign: 'center' }}
                >
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                        {q.word.en}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        {q.options.map((opt, i) => {
                            let statusClass = '';
                            if (selectedOption === opt) {
                                statusClass = isCorrect ? 'success' : 'error';
                            } else if (selectedOption && opt === q.word.uz) {
                                statusClass = 'success';
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(opt)}
                                    disabled={!!selectedOption}
                                    className={`btn btn-outline ${statusClass}`}
                                    style={{
                                        padding: '1.2rem',
                                        fontSize: '1.1rem',
                                        justifyContent: 'center',
                                        background: statusClass === 'success' ? 'rgba(16,185,129,0.1)' : (statusClass === 'error' ? 'rgba(244,63,94,0.1)' : 'transparent'),
                                        borderColor: statusClass === 'success' ? 'var(--color-success)' : (statusClass === 'error' ? 'var(--color-error)' : 'var(--color-border)')
                                    }}
                                >
                                    {opt}
                                    {statusClass === 'success' && <CheckCircle size={18} style={{ marginLeft: '1rem' }} />}
                                    {statusClass === 'error' && <XCircle size={18} style={{ marginLeft: '1rem' }} />}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {selectedOption && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={nextQuestion}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '3rem', padding: '1rem' }}
                            >
                                {currentQuestion === 9 ? 'Finish' : 'Next Question'} <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Vocabulary;
