// lib/speech.ts
import * as Speech from "expo-speech";

export const speakAsMufasa = (text: string) => {
  const voiceOptions = {
    language: "en-US",
    pitch: 0.7,  // deeper
    rate: 0.9,   // slower
  };

  Speech.speak(text, voiceOptions);

  return {
    role: "mufasa",
    content: text,
  };
};