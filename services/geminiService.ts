
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const suggestReply = async (messages: Message[]): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Sorry, AI features are currently unavailable.";
    }

  if (messages.length === 0) {
    return "Hello! How can I help you today?";
  }

  const lastMessage = messages[messages.length - 1];
  const prompt = `
    You are in a text message conversation. The last message received was: "${lastMessage.content}".
    Suggest a short, casual, and friendly reply. The reply should not be more than 15 words.
    Do not add any quotation marks around your suggested reply.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating reply with Gemini:", error);
    return "Could not generate a suggestion.";
  }
};
