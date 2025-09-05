import { useEffect } from "react";
import { ScrollView, Text, StyleSheet, Pressable, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

const personalTools = [
  { title: "📅 Calendar Assistant", route: "/calendar" },
  { title: "💬 Auto-Translator", route: "/translator" },
  { title: "🧠 Memory Recall", route: "/memory" },
  { title: "📂 Upload + Ask", route: "/upload" },
  { title: "📰 Global News Digest", route: "/news" },
  { title: "🛒 Smart Grocer Orders", comingSoon: true },
  { title: "💡 Educational Assistant", route: "/education" },
  { title: "🛍️ ShopSmart", external: "https://www.smartifybuy.com" },
  { title: "🎨 Creative Builder", route: "/builder" },
];

const businessTools = [
  { title: "📱 Ad On Mute", comingSoon: true },
  { title: "📤 Personal Auto Social Uploads", comingSoon: true },
  { title: "📤 Business Auto Social Uploads", comingSoon: true },
  { title: "📈 Productivity Assistant", route: "/productivity" },
  { title: "🌐 EasyMarketing Assistant", route: "/marketing" },
];

export default function ExploreScreen() {
  const router = useRouter();

  useEffect(() => {
    playSimbaTTS("✨ Explore SimbaGlobal AI Tools. Choose a tool to get started.");
  }, []);

  const handlePress = async (tool: any) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();

    if (tool.comingSoon) {
      playSimbaTTS(`${tool.title} is coming soon. Stay tuned!`);
      return;
    }

    if (tool.external) {
      Linking.openURL(tool.external);
      return;
    }

    const intro = `Welcome to your ${tool.title}. Tell me what you'd like me to do.`;
    playSimbaTTS(intro);

    const gptReply = await generateSimbaReply(intro);
    playSimbaTTS(gptReply);

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  sectionHeader: { fontSize: 20, fontWeight: "600", marginTop: 20, marginBottom: 10, color: "#444" },
  card: { padding: 18, backgroundColor: "#f8f8f8", marginBottom: 12, borderRadius: 12 },
  cardText: { fontSize: 18 },
});