import { useEffect, useState } from 'react';
import { Quote, getRandomQuote } from '../lib/quotes';
import { Quote as QuoteIcon } from 'lucide-react';

export const MotivationalQuote = () => {
    const [quote, setQuote] = useState<Quote | null>(null);

    useEffect(() => {
        setQuote(getRandomQuote());
    }, []);

    if (!quote) return null;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', borderLeft: '4px solid var(--color-primary)', background: 'var(--color-background-alt)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <QuoteIcon size={24} className="text-primary" style={{ opacity: 0.5, flexShrink: 0 }} />
                <div>
                    <p style={{ fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>"{quote.text}"</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, textAlign: 'right', color: 'var(--color-primary)' }}>— {quote.author}</p>
                </div>
            </div>
        </div>
    );
};
