import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { simbaAutopilotHelper } from "@/lib/simbaAutopilotHelper";

export default function ProfileScreen() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleHelp = async () => {
    if (!query.trim()) return;
    Haptics.selectionAsync();
    playSimbaTTS("I’m here to assist.");
    const reply = await simbaAutopilotHelper(query);
    setResponse(reply);
    playSimbaTTS(reply);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👤 Profile & Settings</Text>

      <Text style={styles.sectionHeader}>✨ Help & Support</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask SimbaGlobal AI anything about your account..."
        value={query}
        onChangeText={setQuery}
      />
      <Pressable style={styles.button} onPress={handleHelp}>
        <Text style={styles.buttonText}>Ask for Help</Text>
      </Pressable>

      {response ? (
        <View style={styles.responseBox}>
          <Text style={styles.responseTitle}>SimbaGlobal AI:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  sectionHeader: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#0066cc", padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  responseBox: { marginTop: 20, padding: 15, backgroundColor: "#f9f9f9", borderRadius: 10 },
  responseTitle: { fontWeight: "bold", marginBottom: 5 },
  responseText: { fontSize: 16 },
});