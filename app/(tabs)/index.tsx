import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY, // stored in .env / app.config.js
});

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", from: "ai", text: "Hello 👋🏾 I’m SimbaGlobal AI, Hyena-Free and here to assist you!" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const replyText = `You said: ${input}. Here’s my wisdom as Mufasa 🦁`; // later replace with real OpenAI text reply
    const aiMsg = { id: (Date.now() + 1).toString(), from: "ai", text: replyText };
    setMessages((prev) => [...prev, aiMsg]);
    setInput("");

    try {
      // 🔊 Stream reply audio
      const response = await client.audio.speech.withStreamingResponse.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy", // deep male-like base tone
        input: `Hyena Free. ${replyText}`,
      });

      // Temp file in app storage
      const tmpPath = `${FileSystem.documentDirectory}mufasa_live.mp3`;
      const fileStream = FileSystem.createWriteStreamAsync(tmpPath);

      // Pipe chunks as they arrive
      await response.stream.pipeTo(await fileStream);

      // Play as soon as audio is written
      const { sound } = await Audio.Sound.createAsync({ uri: tmpPath });
      await sound.playAsync();

    } catch (err) {
      console.error("❌ Streaming voice failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.from === "user" ? styles.userMsg : styles.aiMsg}>
            {item.text}
          </Text>
        )}
        style={styles.messages}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
        />
        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  messages: { flex: 1, marginBottom: 10 },
  userMsg: { alignSelf: "flex-end", backgroundColor: "#ddd", padding: 8, borderRadius: 6, marginVertical: 4 },
  aiMsg: { alignSelf: "flex-start", backgroundColor: "#f0f0f0", padding: 8, borderRadius: 6, marginVertical: 4 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  sendBtn: { backgroundColor: "#333", padding: 10, borderRadius: 8, marginLeft: 8 },
});