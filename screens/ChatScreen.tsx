import React from "react";
import { View, Text, StyleSheet } from "react-native";
import VoiceChatButton from "../components/VoiceChatButton";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SimbaGlobal AI Chat</Text>
      <VoiceChatButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center"
  }
});