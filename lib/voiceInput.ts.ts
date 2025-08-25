import * as Speech from "expo-speech";
import * as Permissions from "expo-permissions";
import * as SpeechRecognizer from "expo-speech-recognition";

export const startListening = async () => {
  const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  if (status !== "granted") {
    Speech.speak("Microphone permission is required.");
    return;
  }

  try {
    const transcript = await SpeechRecognizer.startAsync();
    Speech.speak(`You said: ${transcript}`);
  } catch (err) {
    Speech.speak("I didn't catch that. Please try again.");
  }
};