export interface Quote {
    text: string;
    author: string;
    category?: 'language' | 'education' | 'perseverance' | 'growth' | 'success';
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
    { text: "The limits of my language are the limits of my world.", author: "Ludwig Wittgenstein", category: "language" },
    { text: "To have another language is to possess a second soul.", author: "Charlemagne", category: "language" },
    { text: "One language sets you in a corridor for life. Two languages open every door along the way.", author: "Frank Smith", category: "language" },
    { text: "If you talk to a man in a language he understands, that goes to his head. If you talk to him in his own language, that goes to his heart.", author: "Nelson Mandela", category: "language" },
    { text: "Learning another language is like becoming another person.", author: "Haruki Murakami", category: "language" },
    { text: "Language is the road map of a culture. It tells you where its people come from and where they are going.", author: "Rita Mae Brown", category: "language" },
    { text: "Language acquisition is not about accumulating vocabulary but about developing the courage to deploy it imperfectly.", author: "Stephen Krashen", category: "language" },
    { text: "Do you know what a foreign accent is? It's a sign of bravery.", author: "Amy Chua", category: "language" },
    { text: "The more you speak more languages, the more you understand about yourself.", author: "Sandra Cisneros", category: "language" },
    { text: "Give me the right word and the right context, I will move the whole world.", author: "Joseph Conrad", category: "language" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", category: "education" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", category: "education" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey", category: "education" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", category: "education" },
    { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford", category: "education" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: "education" },
    { text: "The function of education is to teach one to think intensively and to think critically.", author: "Martin Luther King Jr.", category: "education" },
    { text: "Knowledge is of no value unless you put it into practice.", author: "Anton Chekhov", category: "education" },
    { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X", category: "education" },
    { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo", category: "education" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", category: "perseverance" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "perseverance" },
    { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "perseverance" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "perseverance" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes", category: "perseverance" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "perseverance" },
    { text: "Striving for success without hard work is like trying to harvest when you haven't planted.", author: "David Bly", category: "perseverance" },
    { text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.", author: "Pelé", category: "perseverance" },
    { text: "I learned the value of hard work by working hard.", author: "Margaret Mead", category: "perseverance" },
    { text: "Whatever course you decide upon, there is always someone to tell you that you are wrong.", author: "Ralph Waldo Emerson", category: "perseverance" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "growth" },
    { text: "I've failed over and over and over again in my life. And that is why I succeed.", author: "Michael Jordan", category: "growth" },
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", category: "growth" },
    { text: "Failure is the opportunity to begin again more intelligently.", author: "Henry Ford", category: "growth" },
    { text: "I hope that in this year to come, you make mistakes. Because if you are making mistakes, then you are making new things.", author: "Neil Gaiman", category: "growth" },
    { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison", category: "growth" },
    { text: "Difficulties mastered are opportunities won.", author: "Winston Churchill", category: "growth" },
    { text: "The only real failure in life is one not learned from.", author: "Anthony J. D'Angelo", category: "growth" },
    { text: "Every strike brings me closer to the next home run.", author: "Babe Ruth", category: "growth" },
    { text: "And why do we fall, Bruce? So we can learn to pick ourselves up.", author: "Alfred Pennyworth", category: "growth" },
    { text: "If you dream it, you can do it.", author: "Walt Disney", category: "success" },
    { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar", category: "success" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "success" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "success" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "success" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "success" },
    { text: "If you're determined to learn, no one can stop you.", author: "Zig Ziglar", category: "success" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "success" },
    { text: "Do the best you can until you know better. Then when you know better, do better.", author: "Maya Angelou", category: "success" },
    { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear", category: "success" }
];

export const getRandomQuote = (): Quote => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
};
