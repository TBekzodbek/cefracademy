import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones, GraduationCap, Mic, CheckCircle } from 'lucide-react';
import './Home.css';

interface HomeProps {
    lang: 'en' | 'uz';
}

const Home = ({ lang }: HomeProps) => {
    const t = {
        heroTitle: lang === 'en' ? 'Master CEFR with AI-Powered Practice' : 'Sun\'iy Intellekt yordamida CEFRni mukammal o\'rganing',
        heroSubtitle: lang === 'en'
            ? 'The ultimate platform for Uzbek students to prepare for CEFR Reading, Listening, Writing, and Speaking.'
            : 'O\'zbek o\'quvchilari uchun CEFR bo\'yicha o\'qish, tinglash, yozish va gapirish ko\'nikmalarini tayyorlashning yagona platformasi.',
        getStarted: lang === 'en' ? 'Get Started' : 'Boshlash',
        login: lang === 'en' ? 'Login' : 'Tizimga kirish',
        sections: [
            {
                id: 'reading',
                color: 'blue',
                icon: <BookOpen size={40} />,
                title: lang === 'en' ? 'Reading Comprehension' : 'O\'qishni tushunish',
                tagline: lang === 'en' ? 'Read faster, understand better.' : 'Tezroq o\'qing, yaxshiroq tushuning.',
                benefits: lang === 'en' ? [
                    'Unlimited mock texts matching real CEFR exams',
                    'AI analysis of incorrect answers',
                    'Vocabulary highlighting and meaning extraction',
                    'Track your reading speed and comprehension score'
                ] : [
                    'Haqiqiy CEFR imtihonlariga mos keladigan cheksiz testlar',
                    'Noto\'g\'ri javoblarni AI tahlili',
                    'So\'zlarni ajratib ko\'rsatish va ma\'nosini topish',
                    'O\'qish tezligi va tushunish ballingizni kuzatish'
                ]
            },
            {
                id: 'listening',
                color: 'teal',
                icon: <Headphones size={40} />,
                title: lang === 'en' ? 'Listening Skills' : 'Eshitish ko\'nikmalari',
                tagline: lang === 'en' ? 'Catch every detail with precision.' : 'Har bir detalni aniqlik bilan tuting.',
                benefits: lang === 'en' ? [
                    'High-quality audio from native speakers',
                    'Full transcripts revealed after submission',
                    'Topic-based vocabulary training',
                    'Performance breakdown by accents'
                ] : [
                    'Ona tili egalari tomonidan yuqori sifatli audio',
                    'Javoblardan so\'ng to\'liq transkriptlar',
                    'Mavzularga oid so\'z boyligini mashq qilish',
                    'Aksentlar bo\'yicha natijalar tahlili'
                ]
            },
            {
                id: 'writing',
                color: 'purple',
                icon: <GraduationCap size={40} />,
                title: lang === 'en' ? 'Writing Mastery' : 'Yozish mahorati',
                tagline: lang === 'en' ? 'Express your thoughts flawlessly.' : 'O\'z fikringizni xatosiz ifoda eting.',
                benefits: lang === 'en' ? [
                    'Instant AI scoring on essay structures',
                    'Grammar and vocabulary coherence tips',
                    'Rewrite suggestions for advanced vocabulary',
                    'Compare your text with band C1 examples'
                ] : [
                    'Insho tuzilishini tezkor AI orqali baholash',
                    'Grammatika va so\'z boyligi bo\'yicha maslahatlar',
                    'Murakkab so\'zlardan foydalanish tavsiyalari',
                    'Matningizni C1 darajasidagi namunalar bilan solishtirish'
                ]
            },
            {
                id: 'speaking',
                color: 'orange',
                icon: <Mic size={40} />,
                title: lang === 'en' ? 'Speaking Confidence' : 'Gapirishda ishonch',
                tagline: lang === 'en' ? 'Speak naturally with our AI Robot.' : 'Bizning AI Robot bilan tabiiy gapiring.',
                benefits: lang === 'en' ? [
                    'Live conversational robot',
                    'Real-time pronunciation and intonation feedback',
                    'Hesitation and fluency analysis',
                    'Mock examiner interface for real pressure'
                ] : [
                    'Jonli suhbat quruvchi robot',
                    'Talaffuz va ohang bo\'yicha real vaqtda fikrlar',
                    'Tutilishlar va ravonlikni tahlil qilish',
                    'Haqiqiy imtihon bosimi uchun sun\'iy ekzaminator'
                ]
            }
        ]
    };

    return (
        <div className="home-page animate-fade-in">
            <header className="hero container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="hero-title">
                        {t.heroTitle.split(' ').map((word, index) => (
                            word.includes('AI') ? <span key={index} className="text-gradient">{word} </span> : <span key={index}>{word} </span>
                        ))}
                    </h1>
                    <p className="hero-subtitle text-muted">
                        {t.heroSubtitle}
                    </p>
                    <div className="hero-actions" style={{ gap: '1rem' }}>
                        <Link to="/login" className="btn btn-primary btn-cta">
                            {t.getStarted} <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-cta">
                            {t.login}
                        </Link>
                    </div>
                </motion.div>
            </header>

            <div className="details-sections container">
                {t.sections.map((sec) => (
                    <motion.div
                        key={sec.id}
                        className={`section-showcase showcase-${sec.color}`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="showcase-icon">
                            {sec.icon}
                        </div>
                        <div className="showcase-content">
                            <h2>{sec.title}</h2>
                            <h4 className="text-muted">{sec.tagline}</h4>
                            <ul className="benefits-list">
                                {sec.benefits.map((ben, j) => (
                                    <motion.li
                                        key={j}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (j * 0.1) }}
                                    >
                                        <CheckCircle size={18} className="text-success" />
                                        <span>{ben}</span>
                                    </motion.li>
                                ))}
                            </ul>
                            <Link to="/login" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                                {lang === 'en' ? 'Start Practicing' : 'Mashq qilishni boshlash'}
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
