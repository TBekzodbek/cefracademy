# CEFR Academy (cefracademy)

A high-end, AI-powered platform for CEFR and DTM preparation in Uzbekistan.

## 🚀 Features

- **Live Speaking Assessment**: Real-time voice recording, transcription (Whisper-v3), and CEFR scoring (Llama 3 70B).
- **AI Writing Examiner**: Automated feedback and scoring for DTM Task 1 and Task 2 essays.
- **Smart Study Plans**: Dynamic 7-day roadmaps generated based on user levels and weaknesses.
- **AI Tutor (Atlas)**: Integrated chat assistant for grammar and exam strategies.
- **Reading & Listening Analytics**: AI-driven insights on mock exam results.

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS + Framer Motion
- **AI Engine**: Groq SDK (Llama 3 & Whisper)
- **Database**: Supabase
- **Hosting**: Vercel

## 📦 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/TBekzodbek/cefracademy.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   VITE_GROQ_API_KEY=your_groq_key
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

The project is configured for Vercel. Pushing to the `main` branch will trigger a production build automatically. You can also use the included PowerShell script:

```powershell
./deploy.ps1 "Your commit message"
```
