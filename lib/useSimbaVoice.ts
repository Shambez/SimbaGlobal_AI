// lib/useSimbaVoice.ts
import { Audio } from "expo-audio";
import * as FileSystem from "expo-file-system";
import { simbaAsk } from "./simbaClient";

export async function playSimbaTTS(text: string) {
  try {
    console.log("🔊 SimbaGlobal AI TTS for:", text);

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
      }),
    });

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(new Uint8Array(arrayBuffer)).toString("base64");

    const fileUri = FileSystem.cacheDirectory + "simbaglobal_ai_voice.mp3";
    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: fileUri });
    await sound.playAsync();
  } catch (err) {
    console.error("SimbaGlobal AI voice error:", err);
  }
}

export async function simbaTalk(prompt: string) {
  const reply = await simbaAsk(prompt);
  await playSimbaTTS(reply);
  return reply;
}