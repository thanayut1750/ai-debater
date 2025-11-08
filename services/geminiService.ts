import { GoogleGenAI, Chat, Type } from '@google/genai';

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

export async function generateDebateSummary(transcript: string, nameA: string, nameB: string): Promise<{ A: string, B: string }> {
    const prompt = `
        You are a neutral debate analyst. Based on the following transcript, provide a concise summary of the key arguments for each debater.
        Do not declare a winner. Focus only on their main points.

        Debater A is named '${nameA}'.
        Debater B is named '${nameB}'.

        Transcript:
        ${transcript}

        Please provide the summary in the requested JSON format.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summaryA: {
                        type: Type.STRING,
                        description: `A summary of ${nameA}'s key arguments.`
                    },
                    summaryB: {
                        type: Type.STRING,
                        description: `A summary of ${nameB}'s key arguments.`
                    }
                },
                required: ['summaryA', 'summaryB']
            }
        }
    });
    
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    return {
        A: parsed.summaryA,
        B: parsed.summaryB
    };
}