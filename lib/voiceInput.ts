// lib/voiceInput.ts
import { Platform } from "react-native";
import * as Speech from "expo-speech";
import * as Audio from "expo-av";

// NOTE: Expo does not yet have built-in SpeechRecognition.
// This is still a stub until we hook up a real speech-to-text library.

let isListening = false;

export const startListening = async () => {
  if (isListening) return;
  isListening = true;

  // Ask mic permission using expo-av (replaces expo-permissions)
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Microphone permission not granted");
    isListening = false;
    return;
  }

  console.log("🎤 Listening... (stubbed)");

  // ---- STUB IMPLEMENTATION ----
  setTimeout(() => {
    const fakeTranscript = "Hello SimbaGlobal AI";
    console.log("📝 Transcribed:", fakeTranscript);

    // Echo back in Mufasa’s voice
    Speech.speak(`You said: ${fakeTranscript}`, {
      language: "en-US",
      pitch: 0.7,
      rate: 0.9,
    });

    isListening = false;
  }, 3000);
};

export const stopListening = () => {
  if (!isListening) return;
  console.log("🛑 Stopped listening");
  isListening = false;
};