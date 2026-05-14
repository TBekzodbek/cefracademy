import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Login = ({ lang }: Props) => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = {
        title: isSignUp
            ? (lang === 'en' ? 'Create Account' : 'Akkaunt yaratish')
            : (lang === 'en' ? 'Welcome Back' : 'Xush Kelibsiz'),
        subtitle: isSignUp
            ? (lang === 'en' ? 'Join thousands of students preparing for CEFR.' : 'CEFRga tayyorlanayotgan minglab talabalarga qo\'shiling.')
            : (lang === 'en' ? 'Login to continue your CEFR preparation journey.' : 'CEFR tayyorgarligingizni davom ettirish uchun tizimga kiring.'),
        emailLabel: lang === 'en' ? 'Email Address' : 'Elektron pochta',
        passwordLabel: lang === 'en' ? 'Password' : 'Parol',
        loginBtn: lang === 'en' ? 'Sign In' : 'Tizimga kirish',
        signUpBtn: lang === 'en' ? 'Sign Up' : 'Ro\'yxatdan o\'tish',
        noAccount: lang === 'en' ? "Don't have an account?" : "Akkauntingiz yo'qmi?",
        haveAccount: lang === 'en' ? "Already have an account?" : "Akkauntingiz bormi?",
        switchLogin: lang === 'en' ? 'Sign In' : 'Tizimga kirish',
        switchSignUp: lang === 'en' ? 'Create an account' : 'Akkaunt yaratish',
        errorGeneric: lang === 'en' ? 'An error occurred. Please try again.' : 'Xatolik yuz berdi. Qayta urinib ko\'ring.'
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) navigate('/dashboard');
        };
        checkUser();
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                if (data.user) {
                    // Redirect to onboarding after sign up
                    navigate('/onboarding');
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="page-container container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
        >
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="icon-wrapper color-primary" style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px' }}>
                        {isSignUp ? <UserPlus size={30} /> : <LogIn size={30} />}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t.title}</h2>
                    <p className="text-muted">{t.subtitle}</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.emailLabel}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.passwordLabel}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? t.signUpBtn : t.loginBtn)}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <span className="text-muted">{isSignUp ? t.haveAccount : t.noAccount}</span>{' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary"
                        style={{ fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {isSignUp ? t.switchLogin : t.switchSignUp}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
