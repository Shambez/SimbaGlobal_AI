import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

export default function TrialScreen() {
  const router = useRouter();

  const handleStartTrial = async () => {
    playSimbaTTS("Your 7 day free trial has started. Enjoy full access to SimbaGlobal AI KingDom.");
    const gptReply = await generateSimbaReply("User started free trial.");
    playSimbaTTS(gptReply);
    router.replace("/home");
  };

  const handleSubscribe = async () => {
    playSimbaTTS("Redirecting you to subscription checkout with Stripe.");
    // TODO: Connect to Stripe checkout session here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>7 Day Free Trial</Text>
      <Text style={styles.subHeader}>Explore all features before subscribing.</Text>
      <Pressable style={styles.trialButton} onPress={handleStartTrial}>
        <Text style={styles.trialButtonText}>Start Free Trial</Text>
      </Pressable>
      <Pressable style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subHeader: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  trialButton: { backgroundColor: "#007bff", padding: 14, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  trialButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subscribeButton: { backgroundColor: "#28a745", padding: 14, borderRadius: 8, alignItems: "center" },
  subscribeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});