import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GPT5Chat from '../components/GPT5Chat';
import { 
  sendMessageToGPT5,
  GPT5Specialists,
  clearConversation 
} from '../services/openai/openaiService';
import { 
  GPT5Utils,
  quickChat,
  quickCode,
  quickCreative,
  quickBusiness,
  quickTutor,
  ConversationManager 
} from '../services/openai/gpt5Utils';

export default function GPT5DemoScreen() {
  const [activeDemo, setActiveDemo] = useState<string>('chat');
  const [demoResults, setDemoResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const runQuickDemo = async (type: string) => {
    setIsLoading(true);
    setDemoResults([]);

    try {
      let results = [];

      switch (type) {
        case 'specialists':
          results = await demonstrateSpecialists();
          break;
        case 'smart-routing':
          results = await demonstrateSmartRouting();
          break;
        case 'conversation':
          results = await demonstrateConversationManagement();
          break;
        case 'batch':
          results = await demonstrateBatchProcessing();
          break;
        case 'custom':
          if (customPrompt.trim()) {
            results = await demonstrateCustomPrompt(customPrompt);
          }
          break;
        default:
          break;
      }

      setDemoResults(results);
    } catch (error) {
      console.error('Demo error:', error);
      Alert.alert('Demo Error', 'Failed to run demo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demonstrateSpecialists = async () => {
    const results = [];
    
    // Creative specialist
    const creativeResult = await quickCreative(
      \"Write a short poem about AI and the future\"
    );
    results.push({
      type: '🎨 Creative Specialist',
      prompt: 'Write a short poem about AI and the future',
      response: creativeResult.response || creativeResult
    });

    // Code specialist
    const codeResult = await quickCode(
      \"Write a React Native function to format currency\"
    );
    results.push({
      type: '💻 Code Specialist',
      prompt: 'Write a React Native function to format currency',
      response: codeResult.response || codeResult
    });

    // Business specialist
    const businessResult = await quickBusiness(
      \"What are the key trends in mobile AI applications for 2024?\"
    );
    results.push({
      type: '💼 Business Specialist',
      prompt: 'What are the key trends in mobile AI applications for 2024?',
      response: businessResult.response || businessResult
    });

    return results;
  };

  const demonstrateSmartRouting = async () => {
    const results = [];
    
    const testQueries = [
      \"Help me debug this JavaScript code\",
      \"Write a creative story about a lion\",
      \"What's the best business model for a SaaS startup?\",
      \"Explain quantum physics simply\"
    ];

    for (const query of testQueries) {
      const intent = await GPT5Utils.analyzeIntent(query);
      const response = await quickChat(query, 'smart');
      
      results.push({
        type: '🧠 Smart Routing',
        prompt: query,
        routed_to: intent.specialist,
        reason: intent.reason,
        response: response.response || response
      });
    }

    return results;
  };

  const demonstrateConversationManagement = async () => {
    const results = [];
    const conversation = new ConversationManager('demo-conversation');

    // Send a few messages to build context
    await conversation.sendMessage(\"I'm working on a React Native app\");
    const response1 = await conversation.sendMessage(\"How can I improve performance?\");
    
    // Get conversation summary
    const summary = await conversation.getSummary();
    
    // Get follow-up suggestions
    const suggestions = await conversation.getFollowUpSuggestions();

    results.push({
      type: '💬 Conversation Management',
      summary: summary,
      suggestions: suggestions,
      last_response: response1.response || response1,
      message_count: conversation.getMetadata().messageCount
    });

    // Clean up
    conversation.clear();

    return results;
  };

  const demonstrateBatchProcessing = async () => {
    const queries = [
      \"What is machine learning?\",
      \"How do neural networks work?\",
      \"Explain deep learning\"
    ];

    const results = await GPT5Utils.batchProcess(queries, {
      specialist: 'tutor',
      delay: 500
    });

    return results.map(result => ({
      type: '📚 Batch Processing',
      prompt: result.query,
      response: result.result,
      success: result.success
    }));
  };

  const demonstrateCustomPrompt = async (prompt: string) => {
    const response = await quickChat(prompt, 'smart');
    
    return [{
      type: '🔧 Custom Prompt',
      prompt: prompt,
      response: response.response || response
    }];
  };

  const renderDemo = () => {
    switch (activeDemo) {
      case 'chat':
        return (
          <GPT5Chat
            conversationId=\"demo-chat\"
            initialPersonality=\"smart\"
            showSpecialistSuggestions={true}
            enableStreaming={false}
            theme=\"light\"
          />
        );
      
      case 'examples':
        return (
          <ScrollView style={styles.examplesContainer}>
            <Text style={styles.sectionTitle}>Quick Demos</Text>
            
            <View style={styles.demoButtons}>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => runQuickDemo('specialists')}
                disabled={isLoading}
              >
                <Text style={styles.demoButtonText}>🎯 Test Specialists</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => runQuickDemo('smart-routing')}
                disabled={isLoading}
              >
                <Text style={styles.demoButtonText}>🧠 Smart Routing</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => runQuickDemo('conversation')}
                disabled={isLoading}
              >
                <Text style={styles.demoButtonText}>💬 Conversation Mgmt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => runQuickDemo('batch')}
                disabled={isLoading}
              >
                <Text style={styles.demoButtonText}>📚 Batch Processing</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customPromptContainer}>
              <Text style={styles.sectionTitle}>Custom Prompt Test</Text>
              <TextInput
                style={styles.customPromptInput}
                value={customPrompt}
                onChangeText={setCustomPrompt}
                placeholder=\"Enter your custom prompt here...\"
                multiline
              />
              <TouchableOpacity
                style={[styles.demoButton, styles.customPromptButton]}
                onPress={() => runQuickDemo('custom')}
                disabled={isLoading || !customPrompt.trim()}
              >
                <Text style={styles.demoButtonText}>🔧 Test Custom Prompt</Text>
              </TouchableOpacity>
            </View>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size=\"large\" color=\"#007AFF\" />
                <Text style={styles.loadingText}>Running GPT-5 Demo...</Text>
              </View>
            )}

            {demoResults.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.sectionTitle}>Demo Results</Text>
                {demoResults.map((result, index) => (
                  <View key={index} style={styles.resultCard}>
                    <Text style={styles.resultType}>{result.type}</Text>
                    <Text style={styles.resultPrompt}>Prompt: {result.prompt}</Text>
                    {result.routed_to && (
                      <Text style={styles.resultRouting}>
                        Routed to: {result.routed_to} ({result.reason})
                      </Text>
                    )}
                    {result.summary && (
                      <Text style={styles.resultSummary}>Summary: {result.summary}</Text>
                    )}
                    {result.suggestions && (
                      <Text style={styles.resultSuggestions}>
                        Suggestions: {result.suggestions.join(', ')}
                      </Text>
                    )}
                    <Text style={styles.resultResponse}>{result.response}</Text>
                    {result.success !== undefined && (
                      <Text style={[
                        styles.resultStatus,
                        { color: result.success ? 'green' : 'red' }
                      ]}>
                        Status: {result.success ? 'Success' : 'Failed'}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        );
      
      case 'features':
        return (
          <ScrollView style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>GPT-5 (o3-mini) Features</Text>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🚀 Advanced Capabilities</Text>
              <Text style={styles.featureText}>
                • Latest GPT-5 (o3-mini) model{'\n'}
                • 8192 token context window{'\n'}
                • Enhanced reasoning and creativity{'\n'}
                • Improved code generation{'\n'}
                • Better multilingual support
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🎯 Smart Specialists</Text>
              <Text style={styles.featureText}>
                • Creative Writing Assistant{'\n'}
                • Code Generation & Debugging{'\n'}
                • Business Strategy Advisor{'\n'}
                • Educational Tutor{'\n'}
                • Automatic Intent Recognition
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>💬 Conversation Management</Text>
              <Text style={styles.featureText}>
                • Persistent conversation history{'\n'}
                • Context-aware responses{'\n'}
                • Automatic conversation summaries{'\n'}
                • Follow-up question suggestions{'\n'}
                • Action item extraction
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>⚡ Performance Features</Text>
              <Text style={styles.featureText}>
                • Streaming responses (real-time){'\n'}
                • Batch processing capabilities{'\n'}
                • Smart caching and optimization{'\n'}
                • Rate limit handling{'\n'}
                • Offline fallback support
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🔧 Integration Features</Text>
              <Text style={styles.featureText}>
                • React Native optimized{'\n'}
                • TypeScript support{'\n'}
                • Expo compatibility{'\n'}
                • Easy-to-use API{'\n'}
                • Comprehensive error handling
              </Text>
            </View>
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GPT-5 Demo & Features</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeDemo === 'chat' && styles.activeTab]}
          onPress={() => setActiveDemo('chat')}
        >
          <Text style={[styles.tabText, activeDemo === 'chat' && styles.activeTabText]}>
            💬 Chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeDemo === 'examples' && styles.activeTab]}
          onPress={() => setActiveDemo('examples')}
        >
          <Text style={[styles.tabText, activeDemo === 'examples' && styles.activeTabText]}>
            🎯 Examples
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeDemo === 'features' && styles.activeTab]}
          onPress={() => setActiveDemo('features')}
        >
          <Text style={[styles.tabText, activeDemo === 'features' && styles.activeTabText]}>
            ⚡ Features
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderDemo()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  examplesContainer: {
    flex: 1,
    padding: 16,
  },
  featuresContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  demoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: '45%',
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customPromptContainer: {
    marginBottom: 20,
  },
  customPromptInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  customPromptButton: {
    backgroundColor: '#28a745',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  resultType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  resultPrompt: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultRouting: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#666',
  },
  resultSummary: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  resultSuggestions: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#666',
  },
  resultResponse: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
