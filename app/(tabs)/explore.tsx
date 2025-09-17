import { useEffect } from "react";
import { ScrollView, Text, StyleSheet, Pressable, Platform, Linking, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { playSimbaTTS, simbaTalk } from "../../lib/useSimbaVoice";
import { simbaAsk, SimbaClient } from "../../lib/simbaClient";
import { SimbaUtils } from "../../lib";

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
    const initializeExplore = async () => {
      const isGPT5Ready = SimbaUtils.isGPT5Available();
      
      if (isGPT5Ready) {
        await simbaTalk("Welcome to SimbaGlobal AI Explore. Discover powerful tools powered by GPT-5. Choose any tool to begin.", {
          specialist: 'default',
          voice: 'alloy',
          ttsEnabled: true,
          maxTokens: 100
        });
      } else {
        await playSimbaTTS("Welcome to SimbaGlobal AI Explore demo. Configure your API key for full GPT-5 tool access.");
      }
    };
    
    initializeExplore();
  }, []);

  const handlePress = async (tool: any) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();

    if (tool.comingSoon) {
      await playSimbaTTS(`${tool.title} is in development. We're using GPT-5 to build amazing new features. Stay tuned!`);
      return;
    }

    if (tool.external) {
      await playSimbaTTS(`Opening ${tool.title} in your browser.`);
      Linking.openURL(tool.external);
      return;
    }

    // Enhanced tool introduction with GPT-5
    const intro = `Welcome to ${tool.title}. I'm your GPT-5 powered assistant ready to help.`;
    await playSimbaTTS(intro);
    
    // Use smart routing to handle tool-specific queries
    await SimbaClient.smart(`User is accessing ${tool.title}. Provide a brief helpful introduction.`);

    if (tool.route) router.push(tool.route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✨ Explore AI Tools</Text>
          <Text style={styles.headerSubtitle}>Powered by GPT-5 Intelligence</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🏠 Personal Assistant</Text>
          {personalTools.map((tool, i) => (
            <Pressable key={i} style={styles.card} onPress={() => handlePress(tool)}>
              <Text style={styles.cardText}>{tool.title}</Text>
              {tool.comingSoon && <Text style={styles.comingSoonBadge}>Coming Soon</Text>}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>💼 Business Intelligence</Text>
          {businessTools.map((tool, i) => (
            <Pressable key={i} style={styles.card} onPress={() => handlePress(tool)}>
              <Text style={styles.cardText}>{tool.title}</Text>
              {tool.comingSoon && <Text style={styles.comingSoonBadge}>Coming Soon</Text>}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🔧 Creative & Custom</Text>
          <Pressable
            style={styles.card}
            onPress={() => handlePress({ title: "🧰 Creative Builder", route: "/builder" })}
          >
            <Text style={styles.cardText}>🧰 GPT-5 Creative Builder</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🤝 AI Support</Text>
          <Pressable
            style={styles.card}
            onPress={() => handlePress({ title: "❓ GPT-5 AI Assistant", route: "/helper" })}
          >
            <Text style={styles.cardText}>❓ Need Help? (GPT-5 Assistant)</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>🦁 All tools are enhanced with GPT-5 intelligence for superior performance and understanding.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  scrollView: {
    flex: 1,
  },
  header: { 
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef"
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#1a1a1a",
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6c757d",
    fontStyle: "italic"
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25
  },
  sectionHeader: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 15, 
    color: "#495057" 
  },
  card: {
    padding: 18,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardText: { 
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    flex: 1
  },
  comingSoonBadge: {
    backgroundColor: "#ffc107",
    color: "#212529",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600"
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center"
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic"
  }
});
