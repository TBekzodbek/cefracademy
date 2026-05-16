import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

// Using Llama 3.1 70B for higher stability and rate limits
export const GROQ_MODEL = "llama-3.1-70b-versatile";

export const getGroqResponse = async (prompt: string) => {
    if (!API_KEY) {
        return "Groq API Key is missing. Please add VITE_GROQ_API_KEY to environment variables.";
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: GROQ_MODEL,
        });

        return chatCompletion.choices[0]?.message?.content || "No response from AI";
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return `AI Error: ${error.message || "Could not connect to Groq AI"}`;
    }
};

export const getGroqChatResponse = async (messages: { role: string; content: string }[]) => {
    if (!API_KEY) {
        return "Groq API Key is missing.";
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages as any,
            model: GROQ_MODEL,
        });

        return chatCompletion.choices[0]?.message?.content || "No response from AI";
    } catch (error: any) {
        console.error("Groq Chat Error:", error);
        return `AI Error: ${error.message || "Could not connect to Groq AI"}`;
    }
};

/**
 * Transcribe audio file using Whisper-large-v3 on Groq
 */
export const transcribeAudio = async (file: File) => {
    if (!API_KEY) {
        throw new Error("Groq API Key is missing.");
    }

    try {
        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3",
            prompt: "Please transcribe this CEFR English speaking practice accurately.",
            response_format: "json",
            language: "en",
            temperature: 0.0,
        });

        return transcription.text;
    } catch (error: any) {
        console.error("Groq Transcription Error:", error);
        throw error;
    }
};
