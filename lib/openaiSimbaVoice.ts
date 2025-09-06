import Constants from "expo-constants"

export async function generateSimbaReply(prompt: string): Promise<string> {
  try {
    const apiKey = Constants.expoConfig?.extra?.openAiKey || 
                   process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
                   Constants.manifest?.extra?.openAiKey
    
    if (!apiKey || apiKey === 'demo-key') {
      return "SimbaGlobal AI is ready to assist you. (Demo mode - please configure API key for full functionality)";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are SimbaGlobal AI, a helpful and intelligent GPT-5 level assistant with the most advanced capabilities." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "SimbaGlobal AI is ready."
  } catch (err) {
    console.error("SimbaGlobal AI GPT-5 error:", err)
    return "SimbaGlobal AI encountered an issue, please try again."
  }
}
