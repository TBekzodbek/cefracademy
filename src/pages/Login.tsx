import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import './PageLayout.css';

interface Props {
    lang: 'en' | 'uz';
}

const Login = ({ lang }: Props) => {
    const navigate = useNavigate();
    const t = {
        title: lang === 'en' ? 'Welcome Back' : 'Xush Kelibsiz',
        subtitle: lang === 'en' ? 'Login to continue your CEFR preparation journey.' : 'CEFR tayyorgarligingizni davom ettirish uchun tizimga kiring.',
        email: lang === 'en' ? 'Email Address' : 'Elektron pochta',
        password: lang === 'en' ? 'Password' : 'Parol',
        loginBtn: lang === 'en' ? 'Sign In' : 'Tizimga kirish',
        noAccount: lang === 'en' ? 'Don\'t have an account?' : 'Akkauntingiz yo\'qmi?',
        register: lang === 'en' ? 'Create an account' : 'Akkaunt yaratish'
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login and redirect to onboarding survey
        navigate('/onboarding');
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
                        <LogIn size={30} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t.title}</h2>
                    <p className="text-muted">{t.subtitle}</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.email}</label>
                        <input type="email" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} placeholder="user@example.com" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.password}</label>
                        <input type="password" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                        {t.loginBtn}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <span className="text-muted">{t.noAccount}</span>{' '}
                    <Link to="/onboarding" className="text-primary" style={{ fontWeight: 600 }}>{t.register}</Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
