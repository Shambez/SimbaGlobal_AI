// components/VoiceChatButton.tsx
import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { speakAsMufasa } from "../lib/speech";
import { startListening } from "../lib/voiceInput";

export default function VoiceChatButton() {
  const handlePress = () => {
    speakAsMufasa("Let's talk.");
    startListening();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Image source={require("../assets/images/lion.png")} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 90,
    alignSelf: "center",
    marginTop: 20,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});