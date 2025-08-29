import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import ChatScreen from "../screens/ChatScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatScreen />
    </SafeAreaView>
  );
}