// lib/useSimbaVoice.ts
import { Audio } from "expo-audio";
import * as FileSystem from "expo-file-system";
import { simbaAsk } from "./simbaClient";

export async function playSimbaTTS(text: string) {
  try {
    console.log("🔊 SimbaGlobal AI TTS for:", text);
    
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'demo-key') {
      console.log("TTS in demo mode:", text);
      return; // Skip TTS in demo mode
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "alloy",
        input: text,
      }),
    });

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64Audio = btoa(binaryString);

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