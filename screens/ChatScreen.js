import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import LiveLogoPopup from '../components/LiveLogoPopup';

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const [liveLogoVisible, setLiveLogoVisible] = useState(true);

  useEffect(() => {
    if (liveLogoVisible) {
      Speech.speak("Welcome to my Kingdom. How can I help?", { pitch: 0.6, rate: 0.9 });
    }
  }, [liveLogoVisible]);

  const handleDismissLogo = () => setLiveLogoVisible(false);

  const handleSend = () => {
    // Your message send logic here
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LiveLogoPopup visible={liveLogoVisible} onDismiss={handleDismissLogo} />
      <View style={styles.chatArea}>
        <Text>SimbaGlobal AI Chat</Text>
        {/* Messages list here */}
      </View>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Text or talk to SimbaGlobal AI"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.micButton} onPress={() => {/* Voice input logic here */}}>
          <Text style={styles.micText}>🎤</Text>
        </TouchableOpacity>
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatArea: { flex: 1, padding: 20 },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  micButton: {
    marginLeft: 10,
    padding: 10,
  },
  micText: {
    fontSize: 24,
  },
});

export default ChatScreen;