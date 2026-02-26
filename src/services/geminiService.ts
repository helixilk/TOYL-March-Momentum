
import { GoogleGenAI } from "@google/genai";

export async function generateYogaIntention(): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a powerful, single-sentence daily yoga intention for someone in a 4-week mobility challenge. Keep it focused on consistency, self-care, or mental clarity. No hashtags, no quotes around it.",
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "Today, I honor my body by showing up with consistency and grace.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Commitment is the bridge between goals and accomplishment.";
  }
}
