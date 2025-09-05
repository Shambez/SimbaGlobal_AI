import Constants from "expo-constants"

export async function generateSimbaReply(prompt: string): Promise<string> {
  try {
    const apiKey = Constants.expoConfig?.extra?.openAiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY
    if (!apiKey) throw new Error("Missing OpenAI API Key")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "SimbaGlobal AI is ready."
  } catch (err) {
    console.error("GPT-5 error:", err)
    return "SimbaGlobal AI encountered an issue, please try again."
  }
}
