// lib/simbaAutopilotHelper.ts
import { simbaAsk } from "./simbaClient";
import { playSimbaTTS } from "./useSimbaVoice";

const SAFE_TOPICS = [
  "calendar", "translator", "memory", "upload", "news",
  "shop", "productivity", "marketing", "builder", "profile",
  "plans", "subscription", "general help", "simba ai"
];

const DANGEROUS_KEYWORDS = [
  "suicide", "kill", "terrorism", "violence", "abuse",
  "drugs", "weapon", "hate", "mislead", "harm"
];

export async function simbaHelper(userQuery: string): Promise<string> {
  try {
    const lowered = userQuery.toLowerCase();

    if (DANGEROUS_KEYWORDS.some(k => lowered.includes(k))) {
      const safeResponse = 
        "⚠️ I cannot assist with that. If you are in danger or struggling, please seek immediate help through professional channels or local emergency numbers.";
      playSimbaTTS(safeResponse);
      return safeResponse;
    }

    if (!SAFE_TOPICS.some(t => lowered.includes(t))) {
      const redirectResponse = 
        "🤝 I can only help with SimbaGlobal AI features and general safe topics. Please ask about your tools, plans, or how to use the app.";
      playSimbaTTS(redirectResponse);
      return redirectResponse;
    }

    const reply = await simbaAsk(userQuery);
    playSimbaTTS(reply);
    return reply;
  } catch (err) {
    console.error("Simba Helper error:", err);
    const fallback = "Sorry, something went wrong. Please try again.";
    playSimbaTTS(fallback);
    return fallback;
  }
}