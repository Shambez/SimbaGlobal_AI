import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { SimbaUtils } from "../lib";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tabs after a brief delay
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>🦁 SimbaGlobal AI</Text>
        <Text style={styles.subheader}>Powered by GPT-5</Text>
        
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
        <Text style={styles.loadingText}>Initializing your AI assistant...</Text>
        
        <Text style={styles.status}>
          {SimbaUtils.isGPT5Available() 
            ? '✅ GPT-5 Ready' 
            : '⚠️ Demo Mode - Configure API Key'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subheader: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#6c757d",
    fontStyle: "italic",
  },
  loading: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 30,
    textAlign: "center",
  },
  status: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
});
