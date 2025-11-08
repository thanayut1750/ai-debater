
import { GoogleGenAI, Chat } from '@google/genai';

// Assume process.env.API_KEY is available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export function createDebaterChat(persona: string): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: persona,
      temperature: 0.8,
    },
  });
}
