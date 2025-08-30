// lib/voice.ts
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

// Track recording state
let recording: Audio.Recording | null = null;

export async function startRecording() {
  try {
    console.log("🎤 Requesting microphone permissions...");
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== "granted") {
      throw new Error("Microphone permission not granted");
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log("🎤 Starting recording...");
    const { recording: rec } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recording = rec;
    return true;
  } catch (err) {
    console.error("⚠️ Error starting recording:", err);
    return false;
  }
}

export async function stopRecordingAndTranscribe(): Promise<string> {
  if (!recording) return "";

  console.log("🛑 Stopping recording...");
  await recording.stopAndUnloadAsync();

  const uri = recording.getURI();
  if (!uri) return "";

  console.log("📂 Recorded file:", uri);

  const file = {
    uri,
    type: "audio/m4a",
    name: "speech.m4a",
  } as any;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    // ✅ Pull API key from env via app.config.js -> extra
    const OPENAI_KEY = Constants.expoConfig?.extra?.openaiApiKey;

    if (!OPENAI_KEY) {
      throw new Error("❌ Missing OpenAI API Key. Check .env.development");
    }

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("📝 Transcript:", data.text);
    return data.text || "";
  } catch (err) {
    console.error("⚠️ Error transcribing:", err);
    return "";
  } finally {
    recording = null;
  }
}