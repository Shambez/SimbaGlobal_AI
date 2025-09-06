// lib/simbaAutopilotHelper.ts
import { simbaAsk } from "./simbaClient";

type HelpCategory = "general" | "account" | "subscription" | "technical" | "safety" | "unknown";

function isUnsafeRequest(input: string): boolean {
  const lower = input.toLowerCase();
  const blocked = [
    "suicide",
    "kill",
    "terrorism",
    "bully",
    "abuse",
    "drugs",
    "weapons",
    "illegal"
  ];
  return blocked.some((word) => lower.includes(word));
}

export async function simbaAutopilotHelper(userQuery: string, userId?: string): Promise<string> {
  try {
    if (isUnsafeRequest(userQuery)) {
      return (
        "⚠️ SimbaGlobal AI cannot assist with this request.\n" +
        "If you are in danger or need urgent help, contact your local emergency services.\n" +
        "For emotional support, please reach out to a trusted friend, family member, or professional helpline."
      );
    }

    let category: HelpCategory = "general";
    if (userQuery.includes("login") || userQuery.includes("signup")) category = "account";
    if (userQuery.includes("payment") || userQuery.includes("subscription")) category = "subscription";
    if (userQuery.includes("error") || userQuery.includes("bug")) category = "technical";
    if (userQuery.includes("safety") || userQuery.includes("security")) category = "safety";

    const systemPrompt = `You are SimbaGlobal AI Autopilot Helper. 
Always respond with kindness, clarity, and professionalism. 
Focus on helping end users with ${category} issues inside the SimbaGlobal AI app. 
Keep answers short, direct, and user-friendly.`;

    const reply = await simbaAsk(systemPrompt + "\nUser: " + userQuery);

    return reply || "I’m here to assist you. Could you clarify your request?";
  } catch (err) {
    console.error("simbaAutopilotHelper error:", err);
    return "⚠️ Sorry, SimbaGlobal AI Helper ran into an issue. Please try again later.";
  }
}