// app/helper.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { playSimbaTTS, simbaTalk } from "../lib/useSimbaVoice";
import { simbaAsk, SimbaClient } from "../lib/simbaClient";
import { generateSimbaReply } from "../lib/openaiSimbaVoice";
import { SimbaUtils } from "../lib";

export default function HelperScreen() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [specialist, setSpecialist] = useState('smart');
  const [isGPT5Ready, setIsGPT5Ready] = useState(SimbaUtils.isGPT5Available());

  const handleAsk = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      let reply = "";
      
      if (specialist === 'smart') {
        // Use smart routing with GPT-5
        const result = await generateSimbaReply(input, {
          useSmartRouting: true,
          maxTokens: 500
        });
        reply = result.reply;
        console.log(`🦁 GPT-5 Helper routed to: ${result.specialist}`);
      } else {
        // Use specific specialist
        reply = await SimbaClient[specialist](input);
      }

      // Update screen text
      setAnswer(reply);

      // Speak the reply with appropriate voice
      if (Platform.OS !== 'web') {
        await simbaTalk(reply, {
          specialist,
          ttsEnabled: true,
          useSmartRouting: false
        });
      }
    } catch (err) {
      console.error("🚨 Helper error:", err);
      const errorMsg = "Sorry, I encountered an issue. Please try again or rephrase your question.";
      setAnswer(errorMsg);
      if (Platform.OS !== 'web') {
        await playSimbaTTS(errorMsg);
      }
    } finally {
      setIsLoading(false);
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