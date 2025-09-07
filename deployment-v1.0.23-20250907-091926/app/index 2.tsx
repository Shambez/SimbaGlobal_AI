import { ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

export default function Home() {
  const router = useRouter();

  const handlePress = async (action: string, route?: string) => {
    if (route) router.push(route);

    const intro = `You selected ${action}. How can I assist you?`;
    playSimbaTTS(intro);

    const gptReply = await generateSimbaReply(intro);
    playSimbaTTS(gptReply);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏠 Welcome to SimbaGlobal AI KingDom</Text>
      <Text style={styles.subHeader}>Powered by GPT-5</Text>

      <Pressable style={styles.card} onPress={() => handlePress("Log in", "/login")}>
        <Text style={styles.cardText}>🔑 Log In</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => handlePress("Sign up", "/signup")}>
        <Text style={styles.cardText}>📝 Sign Up</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => handlePress("Free Trial", "/trial")}>
        <Text style={styles.cardText}>🎁 Free 7-Day Trial</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => handlePress("Share", "/share")}>
        <Text style={styles.cardText}>🔗 Share SimbaGlobal AI KingDom</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subHeader: { fontSize: 18, color: "#555", marginBottom: 20, textAlign: "center" },
  card: { padding: 16, marginBottom: 12, backgroundColor: "#f4f4f4", borderRadius: 12 },
  cardText: { fontSize: 18, fontWeight: "600" },
});