// app/helper.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { simbaAsk } from "@/lib/simbaClient";

export default function HelperScreen() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!input.trim()) return;

    try {
      // Send question to GPT-5 (SimbaGlobal AI brain)
      const reply = await simbaAsk(input);

      // Update screen text
      setAnswer(reply);

      // Speak the reply
      await playSimbaTTS(reply);
    } catch (err) {
      console.error("Helper error:", err);
      setAnswer("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🦁 SimbaGlobal AI Helper</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask SimbaGlobal AI anything..."
        value={input}
        onChangeText={setInput}
      />

      <Button title="Ask" onPress={handleAsk} />

      {answer ? (
        <View style={styles.answerBox}>
          <Text style={styles.answerHeader}>SimbaGlobal AI says:</Text>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
  answerBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    width: "100%",
  },
  answerHeader: { fontWeight: "600", marginBottom: 5 },
  answer: { fontSize: 16 },
});