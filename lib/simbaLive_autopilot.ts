import { simbaAsk } from "./simbaClient"
import { playSimbaTTS } from "./useSimbaVoice"

const SAFE_GUARDRAILS = [
  "suicide",
  "kill",
  "terrorism",
  "abuse",
  "bully",
  "violence",
  "self-harm"
]

export async function simbaAutopilot(userInput: string): Promise<string> {
  try {
    const lower = userInput.toLowerCase()
    if (SAFE_GUARDRAILS.some(word => lower.includes(word))) {
      const msg =
        "SimbaGlobal AI cannot help with this request. Please seek human help:\n" +
        "Emergency services (000/911/112)\n" +
        "Lifeline: 13 11 14 (Australia)\n" +
        "Visit: https://findahelpline.com"
      await playSimbaTTS(msg)
      return msg
    }

    const reply = await simbaAsk(userInput, {
      model: "gpt-5",
      systemPrompt:
        "You are SimbaGlobal AI Autopilot. Answer clearly, safely, and helpfully. Stay within general guidance, SimbaGlobal AI features, or normal everyday advice."
    })

    await playSimbaTTS(reply)
    return reply
  } catch (err) {
    console.error("SimbaLive Autopilot error:", err)
    const fallback = "Sorry, something went wrong. Please try again."
    await playSimbaTTS(fallback)
    return fallback
  }
}