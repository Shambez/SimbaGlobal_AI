import { Audio } from "expo-av";
import { OpenAI } from "openai";
import * as FileSystem from "expo-file-system";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

/**
 * Plays Mufasa’s voice.
 * @param file Optional local mp3 (e.g. require("../assets/audio/mufasa_intro.mp3"))
 * @param text Optional text → will generate TTS if no file is given
 */
export async function playMufasa(
  file?: number,
  text?: string
): Promise<void> {
  try {
    // Case 1: Play static mp3 file
    if (file) {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      return;
    }

    // Case 2: Generate TTS if text is provided
    if (text) {
      const ttsResponse = await client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy", // closest deep male-like voice for Mufasa
        input: text,
      });

      // Save to temp file
      const fileUri = FileSystem.documentDirectory + "mufasa_dynamic.mp3";
      const buffer = Buffer.from(await ttsResponse.arrayBuffer());
      await FileSystem.writeAsStringAsync(fileUri, buffer.toString("base64"), {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Play the generated file
      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      await sound.playAsync();
      return;
    }

    console.warn("⚠️ playMufasa called without file or text.");
  } catch (err) {
    console.error("❌ playMufasa error:", err);
  }
}