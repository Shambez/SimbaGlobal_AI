// lib/useMufasaVoice.ts
import { Audio } from "expo-av";

export async function playMufasa(file: string) {
  try {
    const { sound } = await Audio.Sound.createAsync(file);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (err) {
    console.warn("Mufasa voice error:", err);
  }
}