import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Share, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

export default function HomeTab() {
  const router = useRouter();

  useEffect(() => {
    playSimbaTTS("Welcome to SimbaGlobal AI KinDom. I'm your Personal and Business Assistant. How can I guide you today?");
  }, []);

  const speak = (text: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    playSimbaTTS(text);
  };

  const go = (path: string, announce: string) => {
    speak(announce);
    router.push(path);
  };

  const onShare = async () => {
    try {
      const message =
        "SimbaGlobal AI — My Personal and Business Powered Assistant. Try it: AppStore and Google PlayStore";
      await Share.share({ message, url: "https://www.shambez.com", title: "SimbaGlobal AI" });
      speak("Thanks for sharing SimbaGlobal AI.");
    } catch (e) {
      speak("Hmm, I couldn't open the share sheet.");
    }
  };

  const askGpt5 = async (prompt: string) => {
    try {
      const reply = await generateSimbaReply(prompt);
      if (reply) playSimbaTTS(reply);
    } catch {
      // ignore silently; TTS already welcomed
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SimbaGlobal AI</Text>
      <Text style={styles.subtitle}>Your personal and business copilot — powered by GPT-5</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroText}>
          Ask anything. Automate tasks. Create content. Translate. Plan. Market. All in one place.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          onPress={() => askGpt5("Introduce yourself to the user in one friendly sentence.")}
        >
          <Text style={styles.primaryBtnText}>Say Hello</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>Get Started</Text>

      <View style={styles.ctaRow}>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]}
          onPress={() => go("/auth/login", "Opening login.")}
        >
          <Text style={styles.ctaText}>Log in</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]}
          onPress={() => go("/auth/signup", "Opening sign up.")}
        >
          <Text style={styles.ctaText}>Sign up</Text>
        </Pressable>
      </View>

      <View style={styles.ctaRow}>
        <Pressable
          style={({ pressed }) => [styles.trialBtn, pressed && styles.pressed]}
          onPress={() => go("/trial", "Starting your free seven day trial.")}
        >
          <Text style={styles.trialText}>Free 7 Day Trial</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.shareBtn, pressed && styles.pressed]}
          onPress={onShare}
        >
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        Owner/testing mode can access all features without purchase while we finish wiring billing.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 28,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
  },
  heroCard: {
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 14,
  },
  heroText: {
    color: "white",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
  },
  ctaBtn: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingVertical: 12,
  },
  ctaText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  trialBtn: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 12,
  },
  trialText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
  shareBtn: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
  },
  shareText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  pressed: {
    opacity: 0.85,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});