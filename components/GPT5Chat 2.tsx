import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  sendMessageToGPT5, 
  streamMessageToGPT5,
  clearConversation,
  getConversationHistory,
  GPT5Specialists 
} from '../services/openai/openaiService';
import { 
  GPT5Utils, 
  ConversationManager,
  quickChat 
} from '../services/openai/gpt5Utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  specialist?: string;
  metadata?: any;
}

interface GPT5ChatProps {
  conversationId?: string;
  initialPersonality?: string;
  showSpecialistSuggestions?: boolean;
  enableStreaming?: boolean;
  theme?: 'light' | 'dark';
  onMessageSent?: (message: Message) => void;
  onResponseReceived?: (message: Message) => void;
}

export const GPT5Chat: React.FC<GPT5ChatProps> = ({
  conversationId = 'default',
  initialPersonality = 'default',
  showSpecialistSuggestions = true,
  enableStreaming = false,
  theme = 'light',
  onMessageSent,
  onResponseReceived
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSpecialist, setCurrentSpecialist] = useState(initialPersonality);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [conversation] = useState(() => new ConversationManager(conversationId));
  const scrollViewRef = useRef<ScrollView>(null);

  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  // Load conversation history on mount
  useEffect(() => {
    loadConversationHistory();
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadConversationHistory = () => {
    try {
      const history = getConversationHistory(conversationId);
      const loadedMessages: Message[] = history.map((msg, index) => ({
        id: `loaded-${index}`,
        text: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(),
      }));
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const addMessage = (text: string, isUser: boolean, metadata?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      specialist: !isUser ? currentSpecialist : undefined,
      metadata
    };

    setMessages(prev => [...prev, newMessage]);

    if (isUser) {
      onMessageSent?.(newMessage);
    } else {
      onResponseReceived?.(newMessage);
    }

    return newMessage;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Add user message
    addMessage(userMessage, true);

    try {
      if (enableStreaming) {
        await handleStreamingResponse(userMessage);
      } else {
        await handleRegularResponse(userMessage);
      }

      // Generate follow-up suggestions
      if (showSpecialistSuggestions) {
        await generateFollowUpSuggestions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, there was an error processing your message. Please try again.', false);
      Alert.alert('Error', 'Failed to get response from Simba AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegularResponse = async (userMessage: string) => {
    let result;

    if (currentSpecialist === 'smart') {
      result = await GPT5Utils.smartChat(userMessage, { conversationId });
    } else if (GPT5Specialists[currentSpecialist]) {
      result = await GPT5Specialists[currentSpecialist](userMessage, { conversationId });
    } else {
      result = await sendMessageToGPT5(userMessage, { 
        conversationId,
        personality: currentSpecialist 
      });
    }

    const responseText = result.response || result;
    addMessage(responseText, false, result.usage);
  };

  const handleStreamingResponse = async (userMessage: string) => {
    let streamingMessage = addMessage('', false);
    let fullResponse = '';

    await streamMessageToGPT5(
      userMessage,
      (chunk: string, fullText: string) => {
        fullResponse = fullText;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, text: fullText }
              : msg
          )
        );
      },
      { conversationId, personality: currentSpecialist }
    );
  };

  const generateFollowUpSuggestions = async () => {
    try {
      const suggestions = await conversation.getFollowUpSuggestions();
      setFollowUpSuggestions(suggestions.slice(0, 3));
    } catch (error) {
      console.error('Error generating follow-up suggestions:', error);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    setFollowUpSuggestions([]);
  };

  const switchSpecialist = (specialist: string) => {
    setCurrentSpecialist(specialist);
    setFollowUpSuggestions([]);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearConversation(conversationId);
            setMessages([]);
            setFollowUpSuggestions([]);
          }
        }
      ]
    );
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
      {!message.isUser && message.specialist && (
        <Text style={styles.specialistLabel}>
          {message.specialist === 'smart' ? '🧠 Smart Mode' : 
           message.specialist === 'creative' ? '🎨 Creative' :
           message.specialist === 'coder' ? '💻 Coder' :
           message.specialist === 'business' ? '💼 Business' :
           message.specialist === 'tutor' ? '🎓 Tutor' : '🤖 Simba AI'}
        </Text>
      )}
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderSpecialistButton = (specialist: string, icon: string, label: string) => (
    <TouchableOpacity
      key={specialist}
      style={[
        styles.specialistButton,
        currentSpecialist === specialist && styles.activeSpecialistButton
      ]}
      onPress={() => switchSpecialist(specialist)}
    >
      <Text style={styles.specialistButtonText}>{icon}</Text>
      <Text style={[
        styles.specialistButtonLabel,
        currentSpecialist === specialist && styles.activeSpecialistButtonLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simba AI (GPT-5)</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Specialist Selection */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialistRow}>
        {renderSpecialistButton('smart', '🧠', 'Smart')}
        {renderSpecialistButton('default', '🤖', 'General')}
        {renderSpecialistButton('creative', '🎨', 'Creative')}
        {renderSpecialistButton('coder', '💻', 'Coder')}
        {renderSpecialistButton('business', '💼', 'Business')}
        {renderSpecialistButton('tutor', '🎓', 'Tutor')}
      </ScrollView>

      {/* Messages */}
      <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome to Simba AI powered by GPT-5! 🦁
            </Text>
            <Text style={styles.welcomeSubtext}>
              I can help with coding, creative writing, business advice, tutoring, and more.
            </Text>
          </View>
        )}
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Simba AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Follow-up Suggestions */}
      {followUpSuggestions.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {followUpSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask Simba AI anything..."
          placeholderTextColor={isDark ? '#888' : '#666'}
          multiline
          maxLength={4000}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons 
            name={isLoading ? "hourglass-outline" : "send"} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
  },
  clearButton: {
    padding: 8,
  },
  specialistRow: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#e0e0e0',
  },
  specialistButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: isDark ? '#333' : '#f0f0f0',
  },
  activeSpecialistButton: {
    backgroundColor: '#007AFF',
  },
  specialistButtonText: {
    fontSize: 20,
    marginBottom: 2,
  },
  specialistButtonLabel: {
    fontSize: 10,
    color: isDark ? '#ccc' : '#666',
    fontWeight: '500',
  },
  activeSpecialistButtonLabel: {
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: isDark ? '#ccc' : '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  messageContainer: {
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: isDark ? '#333' : '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: isDark ? '#fff' : '#000',
  },
  specialistLabel: {
    fontSize: 12,
    color: isDark ? '#aaa' : '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: isDark ? '#888' : '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: isDark ? '#ccc' : '#666',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    maxHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333' : '#e0e0e0',
  },
  suggestionButton: {
    backgroundColor: isDark ? '#333' : '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: isDark ? '#555' : '#e0e0e0',
  },
  suggestionText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#333' : '#e0e0e0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: isDark ? '#555' : '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: isDark ? '#fff' : '#000',
    backgroundColor: isDark ? '#333' : '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default GPT5Chat;
