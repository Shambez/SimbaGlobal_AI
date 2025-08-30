import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { playMufasa } from "@/lib/useMufasaVoice";
import { generateMufasaReply } from "@/lib/openaiVoice"; // 👈🏾 New helper we’ll create

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ id: string; text: string; from: "user" | "ai" }[]>([]);
  const [input, setInput] = useState("");

  // 🔊 Play intro when chat opens
  useEffect(() => {
    playMufasa(require("../../assets/audio/mufasa_chat_open.mp3"));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      // 👉🏾 Call OpenAI for reply + voice
      const aiText = await generateMufasaReply(input);

      const aiReply = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        from: "ai" as const,
      };

      setMessages((prev) => [...prev, aiReply]);

      // 🎤 Play back Mufasa’s generated voice
      playMufasa(undefined, aiText); // undefined = no static file, pass text to TTS
    } catch (err) {
      console.error("AI reply failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.from === "user" ? styles.user : styles.ai}>
            {item.text}
          </Text>
        )}
        style={styles.chat}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          value={input}
          onChangeText={setInput}
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  chat: { flex: 1 },
  user: { alignSelf: "flex-end", backgroundColor: "#d1e7ff", padding: 8, borderRadius: 6, marginVertical: 4 },
  ai: { alignSelf: "flex-start", backgroundColor: "#f4f4f4", padding: 8, borderRadius: 6, marginVertical: 4 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 6 },
  sendButton: { marginLeft: 8, backgroundColor: "#333", padding: 10, borderRadius: 6 },
  sendText: { color: "#fff" },
});