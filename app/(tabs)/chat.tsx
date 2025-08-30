
import { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, Pressable, Keyboard } from 'react-native';
import * as Speech from 'expo-speech';
import LottieView from 'lottie-react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([{ id: '1', text: 'Hello there. I\'m here to assist you, talk to me or text me, my name is Simba, SimbaGlobal AI. Hyena Free Chat ?' }]);
  const [input, setInput] = useState('');
  const lionRef = useRef(null);

  useEffect(() => {
    Speech.speak('Hello Babu. Ready to talk?', {
      voice: 'com.apple.ttsbundle.MufasaVoice', // Example only — must map correctly in real
    });
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input.trim() };
    const aiMsg = { id: (Date.now() + 1).toString(), text: `You said: ${input.trim()}` };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    Speech.speak(aiMsg.text);
    setInput('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={lionRef}
        source={require('../../assets/lion-glow-mouth.json')}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Talk to SimbaGlobal..."
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: 'white' }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: { fontSize: 16, marginVertical: 5 },
  inputArea: { flexDirection: 'row', marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10 },
  sendButton: { backgroundColor: '#333', padding: 10, marginLeft: 10, borderRadius: 10 },
});
