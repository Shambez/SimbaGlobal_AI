import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { speakAsMufasa } from "../lib/speech";
import { startListening } from "../lib/voiceInput";

export default function VoiceChatButton() {
  const handlePress = () => {
    speakAsMufasa("Let's talk.");
    startListening();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>🎤 Let's Talk</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }
});