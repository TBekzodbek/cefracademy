import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Clock, BrainCircuit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const OnboardingSurvey = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
            } else {
                setUserId(user.id);
            }
        };
        fetchUser();
    }, [navigate]);

    const t = {
        steps: [
            {
                id: 'current_level',
                icon: <BrainCircuit size={40} />,
                q: lang === 'en' ? 'What is your current English level?' : 'Hozirgi Ingliz tili darajangiz qanday?',
                opts: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper', 'C1 Advanced']
            },
            {
                id: 'target_level',
                icon: <Target size={40} />,
                q: lang === 'en' ? 'What is your target CEFR score?' : 'Maqsad qilgan CEFR darajangiz qanday?',
                opts: ['B1', 'B2', 'C1']
            },
            {
                id: 'time_left',
                icon: <Clock size={40} />,
                q: lang === 'en' ? 'How much time left until your exam?' : 'Imtihongacha qancha vaqt qoldi?',
                opts: [lang === 'en' ? 'Less than 1 month' : '1 oydan kam', lang === 'en' ? '1-3 months' : '1-3 oy', lang === 'en' ? 'More than 3 months' : '3 oydan ko\'p']
            }
        ],
        next: lang === 'en' ? 'Next' : 'Keyingi',
        generate: lang === 'en' ? 'Build My AI Plan' : 'AI Rejamni Tuzish',
        generating: lang === 'en' ? 'Analyzing your profile and generating your personalized study plan...' : 'Profilingiz tahlil qilinmoqda va shaxsiy o\'quv rejangiz yasalmoqda...'
    };

    const handleSelect = async (opt: string) => {
        const newSelections = [...selections, opt];
        setSelections(newSelections);

        if (step < 3) {
            setStep(step + 1);
        } else {
            setIsGenerating(true);

            // Save data to Supabase
            if (userId) {
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .upsert({
                            id: userId,
                            current_level: newSelections[0],
                            target_level: newSelections[1],
                            time_left: newSelections[2],
                            points: 0,
                            onboarding_completed: true
                        });

                    if (error) console.error('Error saving profile:', error);
                } catch (err) {
                    console.error('Unexpected error:', err);
                }
            }

            // Simulate AI loading logic
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        }
    };

    return (
        <div className="page-container container flex justify-center items-center" style={{ minHeight: '80vh' }}>
            <AnimatePresence mode="wait">
                {!isGenerating ? (
                    <motion.div
                        key={`step-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}
                    >
                        <div className="icon-wrapper color-primary" style={{ margin: '0 auto 2rem' }}>
                            {t.steps[step - 1].icon}
                        </div>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>{t.steps[step - 1].q}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                            {t.steps[step - 1].opts.map((opt, i) => (
                                <button
                                    key={i}
                                    className="btn btn-outline"
                                    style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem' }}
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {[1, 2, 3].map(s => (
                                <div key={s} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s === step ? 'var(--color-primary)' : 'var(--color-border)' }} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '600px', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <div className="icon-wrapper color-purple" style={{ margin: '0 auto 2rem', animation: 'pulse 2s infinite' }}>
                            <Sparkles size={40} />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.generate}</h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>{t.generating}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnboardingSurvey;
