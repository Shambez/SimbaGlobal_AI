import { OpenAI } from "openai";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

/**
 * Generate an AI reply + voice for Mufasa
 */
export async function generateMufasaReply(userInput: string): Promise<string> {
  try {
    // 1. Get AI text reply
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Fast + cheap for conversation
      messages: [
        { role: "system", content: "You are Mufasa, the wise Lion King. Speak with authority, wisdom, and care." },
        { role: "user", content: userInput },
      ],
    });

    const aiText = completion.choices[0]?.message?.content ?? "…";

    // 2. Generate TTS voice (Mufasa style)
    const ttsResponse = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // deep male-like voice, we can fine-tune tone later
      input: aiText,
    });

    // Save temporary mp3 file
    const fileUri = FileSystem.documentDirectory + "mufasa_reply.mp3";
    const buffer = Buffer.from(await ttsResponse.arrayBuffer());
    await FileSystem.writeAsStringAsync(fileUri, buffer.toString("base64"), {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Play back
    const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
    await sound.playAsync();

    return aiText;
  } catch (err) {
    console.error("❌ Error generating Mufasa reply:", err);
    return "I sense darkness in the winds. Try again, my friend.";
  }
}