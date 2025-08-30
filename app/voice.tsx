import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { startRecording, stopRecordingAndTranscribe } from "@/lib/voice";

export default function VoiceScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Play Mufasa welcome line on open
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/mufasa_welcome.mp3")
      );
      await sound.playAsync();
    })();
  }, []);

  const handlePress = async () => {
    if (!isRecording) {
      const ok = await startRecording();
      if (ok) setIsRecording(true);
    } else {
      setIsRecording(false);
      setLoading(true);
      const transcript = await stopRecordingAndTranscribe();
      setLoading(false);

      if (transcript) {
        // 🚀 Push transcript into Chat tab
        router.push({ pathname: "/(tabs)/chat", params: { input: transcript } });
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.micButton, isRecording && styles.micActive]}
        onPress={handlePress}
      >
        <Image
          source={require("../../assets/lion_imoji_512.png")}
          style={[styles.lionImage, isRecording && styles.glow]}
        />
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FFD700" />}
      <Text style={styles.text}>
        {isRecording ? "Listening..." : "Tap lion to talk with SimbaGlobal AI"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black" },
  micButton: { padding: 20 },
  micActive: { transform: [{ scale: 1.1 }] },
  lionImage: { width: 200, height: 200, borderRadius: 100 },
  glow: {
    shadowColor: "#FFD700",
    shadowOpacity: 0.9,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
  },
  text: { marginTop: 20, color: "white", fontSize: 16 },
});