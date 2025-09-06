import { useEffect } from "react";
import { ScrollView, Text, StyleSheet, Pressable, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { simbaAsk } from "@/lib/simbaClient";

const personalTools = [
  { title: "📅 Calendar Assistant", route: "/calendar" },
  { title: "💬 Auto-Translator", route: "/translator" },
  { title: "🧠 Memory Recall", route: "/memory" },
  { title: "📂 Upload + Ask", route: "/upload" },
  { title: "📰 Global News Digest", route: "/news" },
  { title: "🛒 Smart Grocer Orders", comingSoon: true },
  { title: "💡 Educational Assistant", route: "/education" },
  { title: "🛍️ ShopSmart", external: "https://www.smartifybuy.com" },
  { title: "📤 Personal Auto Social Uploads", comingSoon: true },
];

const businessTools = [
  { title: "📱 Ad On Mute", comingSoon: true },
  { title: "📤 Business Auto Social Uploads", comingSoon: true },
  { title: "📈 Productivity Assistant", route: "/productivity" },
  { title: "🌐 EasyMarketing Assistant", route: "/marketing" },
];

export default function ExploreScreen() {
  const router = useRouter();

  useEffect(() => {
    playSimbaTTS("Welcome to SimbaGlobal AI Explore. Choose a tool to begin.");
  }, []);

  const handlePress = async (tool: any) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();

    if (tool.comingSoon) {
      await playSimbaTTS(`${tool.title} is coming soon. Stay tuned!`);
      return;
    }

    if (tool.external) {
      Linking.openURL(tool.external);
      return;
    }

    const intro = `Welcome to your ${tool.title}. Tell me what you'd like me to do.`;
    await playSimbaTTS(intro);
    await simbaAsk(intro);

    if (tool.route) router.push(tool.route);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>✨ Explore SimbaGlobal AI Tools</Text>

      <Text style={styles.sectionHeader}>🏠 Personal Assistant Tools</Text>
      {personalTools.map((tool, i) => (
        <Pressable key={i} style={styles.card} onPress={() => handlePress(tool)}>
          <Text style={styles.cardText}>{tool.title}</Text>
        </Pressable>
      ))}

      <Text style={styles.sectionHeader}>💼 Business Assistant Tools</Text>
      {businessTools.map((tool, i) => (
        <Pressable key={i} style={styles.card} onPress={() => handlePress(tool)}>
          <Text style={styles.cardText}>{tool.title}</Text>
        </Pressable>
      ))}

      <Text style={styles.sectionHeader}>🔧 Creative</Text>
      <Pressable
        style={styles.card}
        onPress={() => handlePress({ title: "🧰 Creative Builder", route: "/builder" })}
      >
        <Text style={styles.cardText}>🧰 Build Your Own Tool</Text>
      </Pressable>

      <Text style={styles.sectionHeader}>🤝 Support</Text>
      <Pressable
        style={styles.card}
        onPress={() => handlePress({ title: "❓ Need Help? (AI Assistant)", route: "/helper" })}
      >
        <Text style={styles.cardText}>❓ Need Help? (AI Assistant)</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  sectionHeader: { fontSize: 20, fontWeight: "600", marginTop: 20, marginBottom: 10, color: "#444" },
  card: {
    padding: 18,
    backgroundColor: "#f8f8f8",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { fontSize: 18 },
});