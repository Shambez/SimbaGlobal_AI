// lib/simbaClient.ts
import { OpenAI } from "openai";
import Constants from "expo-constants";

const getApiKey = () => {
  return Constants.expoConfig?.extra?.openAiKey || 
         process.env.EXPO_PUBLIC_OPENAI_API_KEY || 
         Constants.manifest?.extra?.openAiKey || 
         'demo-key';
};

let client: OpenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = getApiKey();
    if (apiKey && apiKey !== 'demo-key') {
      client = new OpenAI({ apiKey });
    }
  }
  return client;
};

export async function simbaAsk(prompt: string): Promise<string> {
  try {
    const openaiClient = getClient();
    if (!openaiClient) {
      return "SimbaGlobal AI is currently in demo mode. Please configure your OpenAI API key to enable full functionality.";
    }
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",  // Using GPT-4o (most advanced available model)
      messages: [
        { role: "system", content: "You are SimbaGlobal AI, a powerful GPT-5 level assistant that manages the app and supports users with strong, kind authority. You are the most advanced AI available, intelligent, helpful, and always provide accurate responses." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content?.trim() || "I didn't catch that.";
  } catch (err) {
    console.error("SimbaGlobal AI error:", err);
    return "I encountered an issue, but I'm working to fix it.";
  }
}
