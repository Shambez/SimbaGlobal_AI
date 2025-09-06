// lib/simbaClient.ts
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export async function simbaAsk(prompt: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5",  // Always use GPT-5
      messages: [
        { role: "system", content: "You are SimbaGlobal AI, a powerful assistant that manages the app and supports users with strong, kind authority." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || "I didn’t catch that.";
  } catch (err) {
    console.error("SimbaGlobal AI error:", err);
    return "I encountered an issue, but I’m working to fix it.";
  }
}