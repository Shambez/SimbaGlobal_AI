import * as Speech from "expo-speech";
import * as Audio from "expo-av";

let isListening = false;

export const startListening = async () => {
  if (isListening) return;
  isListening = true;

  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Microphone permission not granted");
    isListening = false;
    return;
  }

  console.log("🎤 Listening... (stubbed)");

  setTimeout(() => {
    const fakeTranscript = "Hello SimbaGlobal AI";
    console.log("📝 Transcribed:", fakeTranscript);

    Speech.speak(`You said: ${fakeTranscript}`, {
      language: "en-US",
      pitch: 0.7,
      rate: 0.9
    });

    isListening = false;
  }, 3000);
};

export const stopListening = () => {
  if (!isListening) return;
  console.log("🛑 Stopped listening");
  isListening = false;
};