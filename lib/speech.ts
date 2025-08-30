import * as Speech from "expo-speech";
import { Image } from "react-native";

// If you want to use your image on screen, not in console.log
export const speakAsMufasa = (text: string) => {
  const voiceOptions: Speech.SpeechOptions = {
    language: "en-US",
    pitch: 0.4,   // lower pitch = deeper voice
    rate: 0.75,   // slower pace = more dramatic
    voice: undefined,
  };

  console.log("[lion.png] Mufasa Voice:", text); // Image can't be shown in terminal; this logs clearly

  Speech.speak(text, voiceOptions);

  return {
    role: "mufasa",
    content: text,
  };
};