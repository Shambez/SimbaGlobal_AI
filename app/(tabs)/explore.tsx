import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

const personalTools = [
  { title: "📅 Calendar Assistant", route: "/calendar" },
  { title: "💬 Auto-Translator", route: "/translator" },
  { title: "🧠 Memory Recall", route: "/memory" },
  { title: "📂 Upload + Ask", route: "/upload" },
  { title: "📰 Global News Digest", route: "/news" },
  { title: "🛒 Smart Grocery Orders", route: "/groceries" },
  { title: "💡 Ask AI Anything", route: "/advice" },
];

const businessTools = [
  { title: "🛍️ Smartify Buy", route: "/smartify" },
  { title: "📱 Ad On Mute Mobile", route: "/ad-on-mute" },
  { title: "📤 Auto Social Uploads", route: "/social-upload" },
  { title: "📈 Easy Biz Marketing", route: "/marketing" },
  { title: "🌐 One-Tap Social Share", route: "/auto-share" },
];

export default function ExploreScreen() {
  const router = useRouter();

  const handlePress = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    router.push(route);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>✨ Explore SimbaGlobal AI Tools</Text>

      {/* Personal Tools */}
      <Text style={styles.sectionHeader}>🏠 Personal</Text>
      {personalTools.map((w, i) => (
        <Pressable
          key={i}
          style={({ pressed }) => [
            styles.card,
            pressed && { backgroundColor: "#e5e5e5" },
          ]}
          onPress={() => handlePress(w.route)}
        >
          <Text style={styles.cardText}>{w.title}</Text>
        </Pressable>
      ))}

      {/* Business Tools */}
      <Text style={styles.sectionHeader}>💼 Business</Text>
      {businessTools.map((w, i) => (
        <Pressable
          key={i}
          style={({ pressed }) => [
            styles.card,
            pressed && { backgroundColor: "#e5e5e5" },
          ]}
          onPress={() => handlePress(w.route)}
        >
          <Text style={styles.cardText}>{w.title}</Text>
        </Pressable>
      ))}

      {/* Creative / Builder */}
      <Text style={styles.sectionHeader}>🔧 Creative</Text>
      <Pressable
        style={({ pressed }) => [
          styles.createButton,
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => handlePress("/builder")}
      >
        <Text style={styles.createText}>🧰 Build Your Own Tool</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#444",
  },
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
  createButton: {
    marginTop: 15,
    padding: 18,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  createText: { color: "white", textAlign: "center", fontSize: 18 },
});