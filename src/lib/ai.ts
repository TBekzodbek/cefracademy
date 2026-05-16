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

/**
 * Helper to safely extract JSON from AI responses that might contain markdown or extra text.
 */
export const extractJSON = (text: string) => {
    try {
        // Try direct parse first
        return JSON.parse(text);
    } catch (e) {
        // Find content between ```json and ``` or just ```
        const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            try {
                return JSON.parse(match[1]);
            } catch (e2) {
                console.error("Failed to parse extracted JSON block", e2);
            }
        }

        // If that fails, try finding the first [ or { and the last ] or }
        const startBracket = Math.min(
            text.indexOf('{') === -1 ? Infinity : text.indexOf('{'),
            text.indexOf('[') === -1 ? Infinity : text.indexOf('[')
        );
        const endBracket = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));

        if (startBracket !== Infinity && endBracket !== -1) {
            try {
                return JSON.parse(text.substring(startBracket, endBracket + 1));
            } catch (e3) {
                console.error("Failed to parse bracketed content", e3);
            }
        }

        throw new Error("Could not find valid JSON in AI response");
    }
};
