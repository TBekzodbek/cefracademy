import { getGroqResponse, getGroqChatResponse, transcribeAudio } from "./groq";
import { getAIResponse as getGeminiResponse } from "./gemini";

export { transcribeAudio };

/**
 * Unified AI Response handler.
 * Defaults to Groq since Gemini has been experiencing blocks.
 */
export const getAIResponse = async (prompt: string, options?: { provider?: 'groq' | 'gemini' }) => {
    const provider = options?.provider || 'groq';

    if (provider === 'groq') {
        return await getGroqResponse(prompt);
    } else {
        return await getGeminiResponse(prompt);
    }
};

/**
 * Unified Chat handler for multi-turn conversations.
 */
export const getAIChatResponse = async (messages: { role: string; text: string }[], options?: { provider?: 'groq' | 'gemini' }) => {
    const provider = options?.provider || 'groq';

    if (provider === 'groq') {
        const groqMessages = messages.map(m => ({
            role: m.role === 'model' ? 'assistant' : m.role,
            content: m.text
        }));
        return await getGroqChatResponse(groqMessages);
    } else {
        // Gemini specific stateful logic would go here if we wanted to support both seamlessly
        // For now, we mainly steer everything to Groq for reliability.
        return "Gemini chat fallback not implemented in unified lib yet. Please use Groq.";
    }
};
