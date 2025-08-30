
import { View, Text, StyleSheet, Switch, Pressable, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function HomeScreen() {
  const [mode, setMode] = useState('personal');
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}, Babu Shambe 🦁</Text>
      <LottieView
        source={require('../../assets/lion_animation.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Switch
        value={mode === 'business'}
        onValueChange={() => setMode(mode === 'personal' ? 'business' : 'personal')}
      />
      <Text style={styles.modeText}>{mode === 'personal' ? '🎓 Personal Mode' : '💼 Business Mode'}</Text>
      <Pressable style={styles.button} onPress={() => router.push('/chat')}>
        <Text style={styles.buttonText}>Let’s Talk</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: 22, marginBottom: 20 },
  modeText: { fontSize: 16, marginVertical: 10 },
  button: { backgroundColor: '#333', padding: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18 },
});
