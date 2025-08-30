
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const widgets = [
  { title: '📅 Calendar Assistant', route: '/calendar' },
  { title: '🛍️ Smartify Buy', route: '/smartify' },
  { title: '💬 Auto-Translator', route: '/translator' },
  { title: '🧠 Memory Recall', route: '/memory' },
  { title: '📂 Upload + Ask', route: '/upload' },
  { title: '📰 Global News Digest', route: '/news' },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Explore AI Tools</Text>
      {widgets.map((w, i) => (
        <Pressable key={i} style={styles.card} onPress={() => router.push(w.route)}>
          <Text style={styles.cardText}>{w.title}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.createButton} onPress={() => router.push('/builder')}>
        <Text style={styles.createText}>🧰 Build Your Own Tool</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 10 },
  cardText: { fontSize: 18 },
  createButton: { marginTop: 20, padding: 15, backgroundColor: '#333', borderRadius: 10 },
  createText: { color: 'white', textAlign: 'center', fontSize: 18 },
});
