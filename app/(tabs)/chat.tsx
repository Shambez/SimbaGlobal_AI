import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import * as Speech from "expo-speech";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import VoiceChatButton from "../../components/VoiceChatButton";

export default function ChatScreen() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Manage speaking state
  useEffect(() => {
    const subscription = Speech.addListener({
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    return () => subscription.remove();
  }, []);

  // Trigger SimbaGlobal intro every time screen opens
  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        Speech.speak(
          "Hi, I am SimbaGlobal — your AI. How can I assist you today?",
          {
            language: "en-US",
            pitch: 0.4,   // deeper like Mufasa
            rate: 0.75,   // slower, dramatic
          }
        );
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SimbaGlobal AI Chat</Text>

      {isSpeaking ? (
        <LottieView
          source={require("../../assets/animations/lion-glow-mouth.json")}
          autoPlay
          loop
          style={styles.lion}
        />
      ) : (
        <Image
          source={require("../../assets/images/lion.png")}
          style={styles.lion}
        />
      )}

      <VoiceChatButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  lion: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: "contain",
  },
});
