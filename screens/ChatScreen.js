import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { sendMessageToOpenAI } from '../services/openai/openaiService';

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Call AI and append its reply (with previous messages kept)
    const reply = await sendMessageToOpenAI(input);
    setMessages(prev => [...prev, { from: 'ai', text: reply }]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatArea}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, idx) => (
          <Text key={idx} style={msg.from === 'user' ? styles.userText : styles.aiText}>
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Talk to Simba AI..."
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  chatArea: { flex: 1, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 8 },
  userText: { textAlign: 'right', color: '#333', marginBottom: 5, fontWeight: 'bold' },
  aiText: { textAlign: 'left', color: '#007AFF', marginBottom: 5, fontStyle: 'italic' },
});

export default ChatScreen;
