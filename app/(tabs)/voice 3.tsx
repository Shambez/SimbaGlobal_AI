import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { 
  simbaTalk, 
  SimbaVoiceSpecialists, 
  TTS_VOICES, 
  getOptimalVoiceForSpecialist,
  playSimbaTTS 
} from '../../lib/useSimbaVoice';
import { SimbaUtils } from '../../lib';

interface VoiceResponse {
  text: string;
  specialist: string;
  timestamp: Date;
}

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSpecialist, setCurrentSpecialist] = useState('smart');
  const [currentVoice, setCurrentVoice] = useState('alloy');
  const [responses, setResponses] = useState<VoiceResponse[]>([]);
  const [isGPT5Ready, setIsGPT5Ready] = useState(false);

  useEffect(() => {
    checkGPT5Status();
    initializeVoiceScreen();
  }, []);

  const checkGPT5Status = () => {
    const ready = SimbaUtils.isGPT5Available();
    setIsGPT5Ready(ready);
  };

  const initializeVoiceScreen = async () => {
    try {
      if (isGPT5Ready) {
        await playSimbaTTS("Voice interface ready. Choose a specialist and start talking to SimbaGlobal AI.");
      } else {
        await playSimbaTTS("Voice demo mode. Configure your API key for full GPT-5 voice features.");
      }
    } catch (error) {
      console.error('Voice screen initialization error:', error);
    }
  };

  const handleVoiceQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const voice = getOptimalVoiceForSpecialist(currentSpecialist);
      
      const result = await simbaTalk(query, {
        specialist: currentSpecialist,
        voice: voice as any,
        ttsEnabled: true,
        useSmartRouting: currentSpecialist === 'smart'
      });

      const newResponse: VoiceResponse = {
        text: result.reply,
        specialist: result.specialist || currentSpecialist,
        timestamp: new Date()
      };

      setResponses(prev => [newResponse, ...prev]);

    } catch (error) {
      console.error('Voice query error:', error);
      Alert.alert(
        'Voice Error', 
        'Sorry, there was an issue processing your request. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    await handleVoiceQuery(prompt);
  };

  const switchSpecialist = (specialist: string) => {
    setCurrentSpecialist(specialist);
    const voice = getOptimalVoiceForSpecialist(specialist);
    setCurrentVoice(voice);
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const clearResponses = () => {
    setResponses([]);
    playSimbaTTS("Voice history cleared.");
  };

  const quickPrompts = [
    { text: "How can you help me today?", icon: "❓" },
    { text: "Tell me about the weather", icon: "🌤️" },
    { text: "Help me write a creative story", icon: "📖" },
    { text: "Explain quantum computing simply", icon: "🔬" },
    { text: "Give me business advice", icon: "💼" },
    { text: "Help me learn something new", icon: "🎓" }
  ];

  const specialists = [
    { key: 'smart', name: 'Smart', icon: '🧠', color: '#3B82F6' },
    { key: 'creative', name: 'Creative', icon: '🎨', color: '#EF4444' },
    { key: 'coder', name: 'Coder', icon: '💻', color: '#10B981' },
    { key: 'business', name: 'Business', icon: '💼', color: '#F59E0B' },
    { key: 'tutor', name: 'Tutor', icon: '🎓', color: '#8B5CF6' }
  ];

  const getSpecialistEmoji = (specialist: string) => {
    const spec = specialists.find(s => s.key === specialist);
    return spec?.icon || '🤖';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎤 Voice Assistant</Text>
          <Text style={styles.headerSubtitle}>
            {isGPT5Ready ? 'Powered by GPT-5' : 'Demo Mode'}
          </Text>
        </View>

        {/* Status Indicator */}
        <View style={[styles.statusCard, isGPT5Ready ? styles.statusReady : styles.statusDemo]}>
          <Ionicons 
            name={isGPT5Ready ? "checkmark-circle" : "information-circle"} 
            size={24} 
            color={isGPT5Ready ? "#10B981" : "#F59E0B"} 
          />
          <Text style={styles.statusText}>
            {isGPT5Ready 
              ? "GPT-5 Voice Ready" 
              : "Demo Mode - Configure API Key"}
          </Text>
        </View>

        {/* Specialist Selection */}
        <View style={styles.specialistSection}>
          <Text style={styles.sectionTitle}>Choose AI Specialist</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialistRow}>
            {specialists.map((specialist) => (
              <TouchableOpacity
                key={specialist.key}
                style={[
                  styles.specialistButton,
                  currentSpecialist === specialist.key && styles.activeSpecialist,
                  { borderColor: specialist.color }
                ]}
                onPress={() => switchSpecialist(specialist.key)}
              >
                <Text style={styles.specialistIcon}>{specialist.icon}</Text>
                <Text style={[
                  styles.specialistName,
                  currentSpecialist === specialist.key && styles.activeSpecialistName
                ]}>
                  {specialist.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Voice Control */}
        <View style={styles.voiceSection}>
          <Text style={styles.sectionTitle}>Voice Commands</Text>
          
          {/* Main Voice Button */}
          <TouchableOpacity
            style={[
              styles.voiceButton,
              (isListening || isProcessing) && styles.voiceButtonActive
            ]}
            onPress={() => handleVoiceQuery("Hello, how can you help me today?")}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons 
                name={isListening ? "mic" : "mic-outline"} 
                size={48} 
                color="#fff" 
              />
            )}
            <Text style={styles.voiceButtonText}>
              {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Tap to Speak'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.voiceInfo}>
            Current Voice: {TTS_VOICES[currentVoice as keyof typeof TTS_VOICES]}
          </Text>
        </View>

        {/* Quick Prompts */}
        <View style={styles.quickPromptsSection}>
          <Text style={styles.sectionTitle}>Quick Commands</Text>
          <View style={styles.promptsGrid}>
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptButton}
                onPress={() => handleQuickPrompt(prompt.text)}
                disabled={isProcessing}
              >
                <Text style={styles.promptIcon}>{prompt.icon}</Text>
                <Text style={styles.promptText}>{prompt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Response History */}
        {responses.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Recent Responses</Text>
              <TouchableOpacity onPress={clearResponses} style={styles.clearButton}>
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {responses.slice(0, 3).map((response, index) => (
              <View key={index} style={styles.responseCard}>
                <View style={styles.responseHeader}>
                  <Text style={styles.responseSpecialist}>
                    {getSpecialistEmoji(response.specialist)} {response.specialist}
                  </Text>
                  <Text style={styles.responseTime}>
                    {response.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.responseText}>{response.text}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusReady: {
    backgroundColor: '#E6FFFA',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusDemo: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  specialistSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  specialistRow: {
    paddingHorizontal: 15,
  },
  specialistButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeSpecialist: {
    backgroundColor: '#f0f9ff',
  },
  specialistIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  specialistName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeSpecialistName: {
    color: '#1a1a1a',
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  voiceInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  quickPromptsSection: {
    marginBottom: 25,
  },
  promptsGrid: {
    paddingHorizontal: 20,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  promptIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  promptText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  historySection: {
    paddingBottom: 30,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  clearButton: {
    padding: 5,
  },
  responseCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  responseSpecialist: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  responseTime: {
    fontSize: 12,
    color: '#666',
  },
  responseText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
});
