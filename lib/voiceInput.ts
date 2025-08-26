export async function startListening(onResult: (text: string) => void) {
  try {
    console.log("🎤 Listening started...");
    // Simulated result (replace with real voice input logic later)
    setTimeout(() => {
      const fakeTranscript = "What is SimbaGlobal AI?";
      onResult(fakeTranscript);
    }, 2000);
  } catch (error) {
    console.error("Voice input error:", error);
  }
}