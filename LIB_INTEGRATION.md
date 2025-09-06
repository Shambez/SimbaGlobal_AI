# GPT-5 Library Integration Guide

## ✅ Updated Library Files

### 1. `lib/openaiSimbaVoice.ts` - Enhanced Voice GPT-5 Integration
- **GPT-5 Model**: Explicitly uses `o3-mini` model
- **Smart Routing**: Automatic specialist selection based on user intent
- **Conversation Management**: Persistent voice conversation history
- **Enhanced Error Handling**: Comprehensive error responses
- **Multiple Specialists**: Creative, Coder, Business, Tutor modes

### 2. `lib/simbaClient.ts` - Core GPT-5 Client
- **GPT-5 Services**: Direct integration with our GPT-5 service layer
- **Configuration Access**: Uses app config for GPT-5 settings
- **Smart Routing**: Intelligent specialist selection
- **Legacy Compatibility**: Fallback to GPT-4o when needed

### 3. `lib/useSimbaVoice.ts` - Voice & TTS Integration
- **Enhanced TTS**: HD voice models with multiple voice options
- **GPT-5 Voice Responses**: Optimized for voice interactions
- **Voice Specialists**: Different voices for different AI personalities
- **Audio Management**: Improved playback and cleanup

### 4. `lib/index.ts` - Centralized Library Exports
- **Unified Imports**: Single import location for all GPT-5 functions
- **Type Definitions**: Comprehensive TypeScript interfaces
- **Utility Functions**: Helper functions and configurations
- **Quick Access**: Simplified API for common operations

## 🚀 Usage Examples

### Basic GPT-5 Usage

```typescript
import { Simba, generateSimbaReply, simbaAsk } from '../lib';

// Simple GPT-5 query
const response = await Simba.ask("What's the weather like?");

// Enhanced voice reply with specialist detection
const voiceReply = await generateSimbaReply("Help me code a React component", {
  useSmartRouting: true,
  maxTokens: 800
});

console.log(voiceReply.specialist); // 'coder'
console.log(voiceReply.reply); // GPT-5 response
```

### Smart Routing with Specialists

```typescript
import { Simba, quickChat, GPT5Specialists } from '../lib';

// Automatic specialist routing
const smartResponse = await Simba.quick("Write a poem about AI", 'smart');

// Direct specialist access
const creativeResponse = await GPT5Specialists.creative("Create a story about lions");
const codeResponse = await GPT5Specialists.coder("Debug this JavaScript function");
const businessResponse = await GPT5Specialists.business("Market analysis for AI apps");
```

### Voice & TTS Integration

```typescript
import { simbaTalk, SimbaVoiceSpecialists, TTS_VOICES } from '../lib';

// Voice interaction with TTS
const voiceResult = await simbaTalk("Explain quantum computing", {
  specialist: 'tutor',
  voice: 'shimmer',
  ttsEnabled: true
});

// Specialized voice assistants
const creativeVoice = await SimbaVoiceSpecialists.creative(
  "Write a creative story", 
  'nova' // Bright and energetic voice
);

const businessVoice = await SimbaVoiceSpecialists.business(
  "Analyze this market trend",
  'onyx' // Deep and authoritative voice
);
```

### Conversation Management

```typescript
import { ConversationManager, GPT5Utils } from '../lib';

// Create managed conversation
const conversation = new ConversationManager('user-session', {
  personality: 'smart',
  maxHistory: 50
});

// Send messages with context
const response1 = await conversation.sendMessage("I'm building a mobile app");
const response2 = await conversation.sendMessage("How do I add authentication?");

// Get conversation insights
const summary = await conversation.getSummary();
const followUps = await conversation.getFollowUpSuggestions();
const actionItems = await conversation.getActionItems();
```

### Configuration & Utilities

```typescript
import { SimbaUtils, SIMBA_GPT5_CONFIG } from '../lib';

// Check GPT-5 availability
if (SimbaUtils.isGPT5Available()) {
  console.log('GPT-5 is ready! 🚀');
}

// Get optimal settings for specialist
const coderConfig = SimbaUtils.getSpecialistConfig('coder');
// { temperature: 0.3, maxTokens: 1200, voice: 'echo' }

// Format responses with emojis
const formatted = SimbaUtils.formatResponse({
  reply: "Here's your code solution",
  specialist: 'coder'
});
// "💻 Here's your code solution"
```

## 📱 React Native Component Integration

### Basic Chat Integration

```tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Simba } from '../lib';

export function GPT5ChatDemo() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      // Use smart routing for best results
      const reply = await Simba.quick(input, 'smart');
      setResponse(reply);
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Ask SimbaGlobal AI (GPT-5)..."
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity onPress={handleSubmit} disabled={loading}>
        <Text>{loading ? 'Thinking...' : 'Send to GPT-5'}</Text>
      </TouchableOpacity>
      {response ? <Text style={{ marginTop: 20 }}>{response}</Text> : null}
    </View>
  );
}
```

### Voice Integration

```tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { simbaTalk, getOptimalVoiceForSpecialist } from '../lib';

export function VoiceGPT5Demo() {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceQuery = async (query: string, specialist = 'smart') => {
    const voice = getOptimalVoiceForSpecialist(specialist);
    
    const result = await simbaTalk(query, {
      specialist,
      voice,
      ttsEnabled: true,
      useSmartRouting: specialist === 'smart'
    });

    console.log(`${result.specialist} specialist used: ${result.reply}`);
  };

  return (
    <TouchableOpacity 
      onPress={() => handleVoiceQuery("Tell me about React Native")}
    >
      <Text>🎤 Ask GPT-5 with Voice</Text>
    </TouchableOpacity>
  );
}
```

## 🔧 Configuration Access

### Runtime Configuration

```typescript
import Constants from 'expo-constants';

// Access GPT-5 configuration
const gpt5Config = Constants.expoConfig?.extra?.gpt5;
console.log('GPT-5 Model:', gpt5Config?.model); // 'o3-mini'
console.log('Max Tokens:', gpt5Config?.maxTokens); // 8192
console.log('Smart Routing:', gpt5Config?.enableSmartRouting); // true

// Access API key safely
const apiKey = Constants.expoConfig?.extra?.openAiKey;
console.log('API Key configured:', !!apiKey && apiKey !== 'demo-key');
```

### Environment-Based Behavior

```typescript
import { SimbaUtils } from '../lib';

// Development vs Production behavior
const config = SimbaUtils.getGPT5Config();
const isDevelopment = Constants.expoConfig?.extra?.enableDevelopmentLogging;

if (isDevelopment) {
  console.log('GPT-5 Debug Mode Active');
  console.log('Model:', config.model);
  console.log('Features:', config);
}
```

## 📊 Performance & Monitoring

### Usage Tracking

```typescript
import { sendMessageToGPT5 } from '../lib';

const response = await sendMessageToGPT5("Hello GPT-5", {
  conversationId: 'session-123'
});

// Track usage
console.log('Tokens used:', response.usage);
console.log('Model:', response.model);
console.log('Response time:', Date.now() - startTime);
```

### Error Handling

```typescript
import { generateSimbaReply } from '../lib';

try {
  const result = await generateSimbaReply("Complex query", {
    useSmartRouting: true,
    maxTokens: 1000
  });
  
  if (result.specialist === 'error') {
    // Handle API errors gracefully
    console.log('API Error:', result.reply);
    // Show user-friendly message
  } else {
    // Normal response
    console.log(`${result.specialist}: ${result.reply}`);
  }
} catch (error) {
  console.error('GPT-5 Error:', error);
  // Fallback behavior
}
```

## 🎯 Best Practices

### 1. Use Smart Routing by Default
```typescript
// Good: Let GPT-5 choose the best specialist
const response = await Simba.quick("Help me with this problem", 'smart');

// Also good: Direct specialist when you know the category
const codeHelp = await Simba.code("Fix this bug");
```

### 2. Optimize for Voice vs Text
```typescript
// Voice interactions - shorter, conversational
const voiceResponse = await simbaTalk(query, {
  maxTokens: 300,
  ttsEnabled: true
});

// Text interactions - more detailed
const textResponse = await simbaAsk(query, {
  maxTokens: 800,
  useGPT5: true
});
```

### 3. Manage Conversations Efficiently
```typescript
// Use conversation managers for complex interactions
const conversation = new ConversationManager('user-id', {
  maxHistory: 20, // Limit history for performance
  personality: 'smart'
});

// Clear when switching contexts
if (newTopic) {
  conversation.clear();
}
```

### 4. Handle Rate Limits
```typescript
const makeRequest = async (prompt: string, retries = 3) => {
  try {
    return await Simba.ask(prompt);
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return makeRequest(prompt, retries - 1);
    }
    throw error;
  }
};
```

## 🔄 Migration from Old Code

### Updating Existing Functions

```typescript
// Old code
import { generateSimbaReply } from './lib/openaiSimbaVoice';
const response = await generateSimbaReply(prompt);

// New code - same function, enhanced capabilities
import { generateSimbaReply } from './lib';
const response = await generateSimbaReply(prompt, {
  useSmartRouting: true,
  specialist: 'smart' // or let smart routing decide
});
```

### Updating Voice Functions

```typescript
// Old code
import { simbaTalk } from './lib/useSimbaVoice';
const response = await simbaTalk(prompt);

// New code - enhanced voice with specialists
import { simbaTalk } from './lib';
const response = await simbaTalk(prompt, {
  specialist: 'tutor',
  voice: 'shimmer',
  useSmartRouting: false
});
```

## 🚨 Important Notes

1. **Model Availability**: GPT-5 (o3-mini) may have limited availability
2. **API Costs**: GPT-5 may have different pricing than GPT-4
3. **Rate Limits**: Monitor API usage and implement proper rate limiting
4. **Fallback Strategy**: Library includes GPT-4o fallback for reliability
5. **Configuration**: Ensure all environment variables are properly set

## 📞 Troubleshooting

### Common Issues

1. **"GPT-5 model not found"**
   ```typescript
   // Check model availability in your OpenAI account
   const config = SimbaUtils.getGPT5Config();
   console.log('Configured model:', config.model);
   ```

2. **Voice not playing**
   ```typescript
   // Check TTS configuration
   import { TTS_VOICES } from '../lib';
   console.log('Available voices:', TTS_VOICES);
   ```

3. **Smart routing not working**
   ```typescript
   // Check smart routing configuration
   const config = Constants.expoConfig?.extra?.gpt5;
   console.log('Smart routing enabled:', config?.enableSmartRouting);
   ```

---

Your SimbaGlobal AI library is now fully integrated with GPT-5 capabilities! 🦁🚀
