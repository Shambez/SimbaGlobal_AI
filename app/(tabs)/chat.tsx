import React from 'react';
import { View, StyleSheet } from 'react-native';
import GPT5Chat from '../../components/GPT5Chat';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GPT5Chat
          conversationId="main-chat"
          initialPersonality="smart"
          showSpecialistSuggestions={true}
          enableStreaming={false}
          theme="light"
          onMessageSent={(message) => {
            console.log('🦁 User message:', message.text);
          }}
          onResponseReceived={(message) => {
            console.log('🤖 GPT-5 response:', message.text);
            console.log('🎯 Specialist used:', message.specialist);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
