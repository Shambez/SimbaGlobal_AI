import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Share, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { playSimbaTTS, simbaTalk } from "../../lib/useSimbaVoice";
import { generateSimbaReply } from "../../lib/openaiSimbaVoice";
import { SimbaUtils, Simba } from "../../lib";

export default function HomeTab() {
  const router = useRouter();

  useEffect(() => {
    const initializeHome = async () => {
      const isGPT5Ready = SimbaUtils.isGPT5Available();
      
      if (isGPT5Ready) {
        await simbaTalk("Welcome to SimbaGlobal AI powered by GPT-5. I'm your intelligent personal and business assistant. How can I help you today?", {
          specialist: 'default',
          voice: 'alloy',
          ttsEnabled: true
        });
      } else {
        await playSimbaTTS("Welcome to SimbaGlobal AI demo mode. Configure your API key to unlock full GPT-5 capabilities.");
      }
    };
    
    initializeHome();
  }, []);

  const speak = async (text: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    await playSimbaTTS(text);
  };

  const go = (path: string, announce: string) => {
    speak(announce);
    router.push(path);
  };

  const onShare = async () => {
    try {
      const message =
        "SimbaGlobal AI — Powered by GPT-5 for Personal and Business Intelligence. Download from App Store and Google Play Store";
      await Share.share({ 
        message, 
        url: "https://www.shambez.com", 
        title: "SimbaGlobal AI - GPT-5 Powered" 
      });
      await speak("Thank you for sharing SimbaGlobal AI with others!");
    } catch (e) {
      await speak("Sorry, I couldn't open the share options right now.");
    }
  };

  const askGPT5 = async (prompt: string) => {
    try {
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Use enhanced GPT-5 with smart routing
      const result = await generateSimbaReply(prompt, {
        useSmartRouting: true,
        maxTokens: 200
      });
      
      if (result.reply) {
        await playSimbaTTS(result.reply);
        console.log(`🦁 GPT-5 Response from ${result.specialist} specialist:`, result.reply);
      }
    } catch (error) {
      console.error('GPT-5 interaction error:', error);
      await speak("I'm having a small technical issue. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🦁 SimbaGlobal AI</Text>
        <Text style={styles.subtitle}>Your intelligent assistant powered by GPT-5</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroText}>
            Experience the power of GPT-5 with smart routing, voice interactions, and specialized AI assistants.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            onPress={() => askGPT5("Introduce yourself and explain your GPT-5 capabilities in a friendly way.")}
          >
            <Text style={styles.primaryBtnText}>🤖 Meet Your AI Assistant</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>🚀 Quick Access</Text>

        <View style={styles.ctaRow}>
          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]}
            onPress={() => go("/login", "Opening login screen.")}
          >
            <Text style={styles.ctaText}>📝 Log in</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]}
            onPress={() => go("/signup", "Opening account creation.")}
          >
            <Text style={styles.ctaText}>✨ Sign up</Text>
          </Pressable>
        </View>

        <View style={styles.ctaRow}>
          <Pressable
            style={({ pressed }) => [styles.trialBtn, pressed && styles.pressed]}
            onPress={() => go("/trial", "Starting your free seven day trial with full GPT-5 access.")}
          >
            <Text style={styles.trialText}>🎁 Free 7 Day Trial</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.shareBtn, pressed && styles.pressed]}
            onPress={onShare}
          >
            <Text style={styles.shareText}>📤 Share App</Text>
          </Pressable>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>✨ GPT-5 Features</Text>
          <Text style={styles.featuresText}>
            • 🧠 Smart routing to best specialist{"\n"}
            • 🎤 Advanced voice interactions{"\n"}
            • 💬 Persistent conversation memory{"\n"}
            • 🎨 Creative, coding, business & tutoring modes{"\n"}
            • ⚡ Real-time streaming responses
          </Text>
        </View>

        <Text style={styles.note}>
          🦁 Experience the future of AI assistance with GPT-5 powered intelligence.
        </Text>
      </ScrollView>
    </SafeAreaView>
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
  featuresCard: {
    backgroundColor: "#f8f9fa",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#495057",
    marginBottom: 12,
    textAlign: "center",
  },
  featuresText: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 22,
  },
  note: {
    marginTop: 16,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});
