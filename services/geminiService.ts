import { GoogleGenAI } from "@google/genai";

// Standard implementation for Gemini API service following @google/genai guidelines.
export const generateVibeResponse = async (prompt: string): Promise<string> => {
  // Always initialize GoogleGenAI with a named parameter object and direct process.env reference.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI vibe check assistant for Priyanshu Das's portfolio. You respond in a cool, minimalist, tech-forward tone. You are witty, insightful, and knowledgeable about prompt engineering and coding vibes.",
        temperature: 0.8,
        topP: 0.9,
      }
    });

    // Directly access the .text property from GenerateContentResponse as per guidelines.
    return response.text || "I'm drawing a blank on that one. Maybe the vibe is too high!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI is currently recalibrating its vibes. Try again later.";
  }
};