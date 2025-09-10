import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'react-native-haptic-feedback';
import { playSimbaTTS, simbaTalk } from '../../lib/useSimbaVoice';
import { SimbaUtils, SIMBA_GPT5_CONFIG } from '../../lib';
import { simbaAutopilotHelper } from '../../lib/simbaAutopilotHelper';

export default function ProfileScreen() {
  const [gpt5Enabled, setGpt5Enabled] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [smartRoutingEnabled, setSmartRoutingEnabled] = useState(true);
  const [defaultSpecialist, setDefaultSpecialist] = useState('smart');
  const [preferredVoice, setPreferredVoice] = useState('alloy');
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    const isGPT5Ready = SimbaUtils.isGPT5Available();
    setGpt5Enabled(isGPT5Ready);
    
    if (isGPT5Ready) {
      await playSimbaTTS("Profile settings loaded. Customize your GPT-5 experience here.");
    } else {
      await playSimbaTTS("Profile demo mode. Configure your API key to access GPT-5 settings.");
    }
  };

  const handleToggle = async (setting: string, value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }

    switch (setting) {
      case 'tts':
        setTtsEnabled(value);
        await playSimbaTTS(value ? "Voice synthesis enabled" : "Voice synthesis disabled");
        break;
      case 'streaming':
        setStreamingEnabled(value);
        await playSimbaTTS(value ? "Real-time streaming enabled" : "Real-time streaming disabled");
        break;
      case 'smartRouting':
        setSmartRoutingEnabled(value);
        await playSimbaTTS(value ? "Smart routing enabled" : "Smart routing disabled");
        break;
    }
  };

  const selectSpecialist = async (specialist: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setDefaultSpecialist(specialist);
    const emoji = SIMBA_GPT5_CONFIG.SPECIALISTS[specialist];
    await playSimbaTTS(`Default specialist changed to ${emoji} ${specialist}`);
  };

  const selectVoice = async (voice: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setPreferredVoice(voice);
    await playSimbaTTS(`Voice changed to ${SIMBA_GPT5_CONFIG.VOICES[voice]}`, { voice: voice as any });
  };

  const testVoice = async () => {
    await simbaTalk("This is a test of your SimbaGlobal AI voice configuration. How does it sound?", {
      voice: preferredVoice as any,
      specialist: defaultSpecialist
    });
  };

  const handleHelp = async () => {
    if (!query.trim()) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    
    await playSimbaTTS("Let me help you with that.");
    const reply = await simbaAutopilotHelper(query);
    setResponse(reply);
    await playSimbaTTS(reply);
  };

  const aboutApp = () => {
    Alert.alert(
      '🦁 SimbaGlobal AI',
      `Powered by GPT-5 (o3-mini)\n\nVersion: 1.0.19\nBuild: ${Platform.OS === 'ios' ? '19' : '19'}\n\nAdvanced AI assistant with voice interaction, smart routing, and specialized expertise.\n\nDeveloped by Shambez`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🦁 Profile & Settings</Text>
          <Text style={styles.headerSubtitle}>
            {gpt5Enabled ? 'GPT-5 Powered Experience' : 'Demo Mode'}
          </Text>
        </View>

        {/* GPT-5 Status Card */}
        <View style={[styles.statusCard, gpt5Enabled ? styles.statusActive : styles.statusInactive]}>
          <View style={styles.statusIcon}>
            <Ionicons 
              name={gpt5Enabled ? "checkmark-circle" : "alert-circle"} 
              size={32} 
              color={gpt5Enabled ? "#10B981" : "#F59E0B"} 
            />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>
              {gpt5Enabled ? "GPT-5 Active" : "Demo Mode"}
            </Text>
            <Text style={styles.statusDescription}>
              {gpt5Enabled 
                ? "Full access to GPT-5 capabilities" 
                : "Configure API key for full features"}
            </Text>
          </View>
        </View>

        {/* Voice & TTS Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎤 Voice & Audio</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Text-to-Speech</Text>
            <Switch
              value={ttsEnabled}
              onValueChange={(value) => handleToggle('tts', value)}
              trackColor={{ false: '#d1d5db', true: '#34d399' }}
              thumbColor={ttsEnabled ? '#10b981' : '#9ca3af'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Preferred Voice</Text>
            <TouchableOpacity style={styles.valueButton} onPress={() => {}}>
              <Text style={styles.valueText}>{SIMBA_GPT5_CONFIG.VOICES[preferredVoice]}</Text>
            </TouchableOpacity>
          </View>

          {/* Voice Selection */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voiceRow}>
            {Object.entries(SIMBA_GPT5_CONFIG.VOICES).map(([voice, description]) => (
              <TouchableOpacity
                key={voice}
                style={[
                  styles.voiceButton,
                  preferredVoice === voice && styles.activeVoiceButton
                ]}
                onPress={() => selectVoice(voice)}
              >
                <Text style={[
                  styles.voiceButtonText,
                  preferredVoice === voice && styles.activeVoiceButtonText
                ]}>
                  {voice}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.testButton} onPress={testVoice}>
            <Ionicons name="volume-high" size={20} color="#fff" />
            <Text style={styles.testButtonText}>Test Voice</Text>
          </TouchableOpacity>
        </View>

        {/* GPT-5 Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 GPT-5 Intelligence</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Real-time Streaming</Text>
            <Switch
              value={streamingEnabled}
              onValueChange={(value) => handleToggle('streaming', value)}
              trackColor={{ false: '#d1d5db', true: '#34d399' }}
              thumbColor={streamingEnabled ? '#10b981' : '#9ca3af'}
              disabled={!gpt5Enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Smart Routing</Text>
            <Switch
              value={smartRoutingEnabled}
              onValueChange={(value) => handleToggle('smartRouting', value)}
              trackColor={{ false: '#d1d5db', true: '#34d399' }}
              thumbColor={smartRoutingEnabled ? '#10b981' : '#9ca3af'}
              disabled={!gpt5Enabled}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Default Specialist</Text>
            <TouchableOpacity style={styles.valueButton}>
              <Text style={styles.valueText}>
                {SIMBA_GPT5_CONFIG.SPECIALISTS[defaultSpecialist]} {defaultSpecialist}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Specialist Selection */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialistRow}>
            {Object.entries(SIMBA_GPT5_CONFIG.SPECIALISTS).map(([specialist, emoji]) => (
              <TouchableOpacity
                key={specialist}
                style={[
                  styles.specialistButton,
                  defaultSpecialist === specialist && styles.activeSpecialistButton
                ]}
                onPress={() => selectSpecialist(specialist)}
                disabled={!gpt5Enabled}
              >
                <Text style={styles.specialistEmoji}>{emoji}</Text>
                <Text style={[
                  styles.specialistLabel,
                  defaultSpecialist === specialist && styles.activeSpecialistLabel,
                  !gpt5Enabled && styles.disabledText
                ]}>
                  {specialist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Help & Support</Text>

          <TextInput
            style={styles.input}
            placeholder="Ask SimbaGlobal AI anything about your account..."
            value={query}
            onChangeText={setQuery}
            multiline
          />
          <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
            <Text style={styles.helpButtonText}>Ask for Help</Text>
          </TouchableOpacity>

          {response ? (
            <View style={styles.responseBox}>
              <Text style={styles.responseTitle}>SimbaGlobal AI:</Text>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          ) : null}
        </View>

        {/* Model Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 Model Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Current Model</Text>
            <Text style={styles.infoValue}>{SIMBA_GPT5_CONFIG.MODEL}</Text>
            
            <Text style={styles.infoTitle}>Max Tokens</Text>
            <Text style={styles.infoValue}>{SIMBA_GPT5_CONFIG.MAX_TOKENS.toLocaleString()}</Text>
            
            <Text style={styles.infoTitle}>Temperature</Text>
            <Text style={styles.infoValue}>{SIMBA_GPT5_CONFIG.DEFAULT_TEMPERATURE}</Text>
          </View>
        </View>

        {/* About */}
        <TouchableOpacity style={styles.aboutButton} onPress={aboutApp}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.aboutButtonText}>About SimbaGlobal AI</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🦁 SimbaGlobal AI - Your intelligent assistant powered by GPT-5
          </Text>
        </View>

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
    backgroundColor: '#fff',
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
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusActive: {
    backgroundColor: '#E6FFFA',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusInactive: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusIcon: {
    marginRight: 15,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  valueButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  voiceRow: {
    marginTop: 10,
  },
  voiceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeVoiceButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  voiceButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  activeVoiceButtonText: {
    color: '#fff',
  },
  specialistRow: {
    marginTop: 10,
  },
  specialistButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  activeSpecialistButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  specialistEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  specialistLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
  },
  activeSpecialistLabel: {
    color: '#fff',
  },
  disabledText: {
    color: '#ccc',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helpButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  helpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  responseBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  responseTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  responseText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aboutButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
