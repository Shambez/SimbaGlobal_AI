import * as Speech from "expo-speech";

export const speakAsMufasa = (text: string) => {
  const voiceOptions = {
    language: "en-US",
    pitch: 0.8, // deeper tone for "Mufasa"
    rate: 0.9
  };
  Speech.speak(text, voiceOptions);
};