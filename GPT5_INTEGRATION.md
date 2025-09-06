# GPT-5 Integration for SimbaGlobal AI

This document outlines the complete GPT-5 (o3-mini) integration implemented in your SimbaGlobal AI application.

## 🚀 Overview

Your app now features a comprehensive GPT-5 integration with advanced capabilities including:
- Smart AI specialists for different use cases
- Conversation memory and context management
- Streaming responses for real-time chat
- Intelligent routing based on user intent
- Batch processing capabilities

## 📁 File Structure

```
services/openai/
├── openaiService.js      # Main GPT-5 service with specialists
└── gpt5Utils.js          # Advanced utilities and conversation management

components/
└── GPT5Chat.tsx          # React Native chat component

screens/
└── GPT5DemoScreen.tsx    # Demo and examples screen
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# OpenAI API Configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# GPT-5 Configuration
EXPO_PUBLIC_GPT5_MODEL=o3-mini
EXPO_PUBLIC_GPT5_MAX_TOKENS=8192
EXPO_PUBLIC_GPT5_TEMPERATURE=0.7
EXPO_PUBLIC_ENABLE_STREAMING=true
EXPO_PUBLIC_ENABLE_SMART_ROUTING=true

# Conversation Settings
EXPO_PUBLIC_MAX_CONVERSATION_HISTORY=50
EXPO_PUBLIC_AUTO_SUGGESTIONS=true
EXPO_PUBLIC_DEFAULT_PERSONALITY=smart
```

## 🎯 AI Specialists

### Available Specialists

1. **🧠 Smart Mode** - Automatically routes to the best specialist
2. **🤖 General** - Default conversational AI
3. **🎨 Creative** - Creative writing and brainstorming
4. **💻 Coder** - Programming and debugging assistance
5. **💼 Business** - Strategy and business advice
6. **🎓 Tutor** - Educational and learning support

### Usage Examples

```javascript
import { GPT5Specialists, quickCode, quickCreative } from '../services/openai/gpt5Utils';

// Code specialist
const codeHelp = await quickCode("Write a React Native function to format currency");

// Creative specialist
const poem = await quickCreative("Write a poem about AI and the future");

// Business specialist
const businessAdvice = await GPT5Specialists.business(
  "What are the key trends in mobile AI applications?",
  { conversationId: 'business-chat' }
);
```

## 💬 Conversation Management

### ConversationManager Class

```javascript
import { ConversationManager } from '../services/openai/gpt5Utils';

// Create a conversation
const conversation = new ConversationManager('my-conversation', {
  personality: 'smart',
  maxHistory: 50
});

// Send messages
const response = await conversation.sendMessage("Hello GPT-5!");

// Get conversation summary
const summary = await conversation.getSummary();

// Get follow-up suggestions
const suggestions = await conversation.getFollowUpSuggestions();

// Clear conversation
conversation.clear();
```

## 🔄 Streaming Responses

For real-time chat experiences:

```javascript
import { streamMessageToGPT5 } from '../services/openai/openaiService';

await streamMessageToGPT5(
  "Tell me about quantum computing",
  (chunk, fullText) => {
    // Update UI with each chunk
    console.log('New chunk:', chunk);
    console.log('Full text so far:', fullText);
  },
  { conversationId: 'stream-chat', personality: 'tutor' }
);
```

## 🚀 Advanced Features

### Smart Routing

```javascript
import { GPT5Utils } from '../services/openai/gpt5Utils';

// Automatically route to best specialist
const response = await GPT5Utils.smartChat(
  "Help me debug this JavaScript code",
  { conversationId: 'debug-session' }
);
```

### Batch Processing

```javascript
const queries = [
  "What is machine learning?",
  "How do neural networks work?",
  "Explain deep learning"
];

const results = await GPT5Utils.batchProcess(queries, {
  specialist: 'tutor',
  delay: 1000 // 1 second between requests
});
```

### Context-Aware Responses

```javascript
const context = {
  userProfile: { role: 'developer', experience: 'intermediate' },
  previousTopics: ['React Native', 'TypeScript'],
  currentTask: 'Building a mobile app',
  preferences: { codeStyle: 'functional', verbosity: 'detailed' }
};

const response = await GPT5Utils.contextAwareResponse(
  "How should I structure my components?",
  context
);
```

## 📱 React Native Components

### GPT5Chat Component

A full-featured chat interface with specialist selection:

```jsx
import GPT5Chat from '../components/GPT5Chat';

<GPT5Chat
  conversationId="main-chat"
  initialPersonality="smart"
  showSpecialistSuggestions={true}
  enableStreaming={false}
  theme="light"
  onMessageSent={(message) => console.log('User:', message)}
  onResponseReceived={(message) => console.log('AI:', message)}
/>
```

### Props

- `conversationId`: Unique ID for conversation persistence
- `initialPersonality`: Starting AI personality/specialist
- `showSpecialistSuggestions`: Enable follow-up suggestions
- `enableStreaming`: Use streaming responses
- `theme`: 'light' or 'dark' theme
- `onMessageSent`: Callback when user sends message
- `onResponseReceived`: Callback when AI responds

## 🛠 Integration Steps

### 1. Install Dependencies

Ensure you have the required packages:

```bash
npm install axios openai @expo/vector-icons
```

### 2. Configure Environment

Update your `.env` file with your OpenAI API key and configuration.

### 3. Import Services

```javascript
// Main service
import { 
  sendMessageToGPT5, 
  GPT5Specialists,
  streamMessageToGPT5 
} from '../services/openai/openaiService';

// Utilities
import { 
  GPT5Utils,
  ConversationManager,
  quickChat,
  quickCode
} from '../services/openai/gpt5Utils';
```

### 4. Update Expo Configuration

Add to your `app.json`:

```json
{
  "expo": {
    "extra": {
      "OPENAI_API_KEY": process.env.EXPO_PUBLIC_OPENAI_API_KEY
    }
  }
}
```

## 🔐 Security Best Practices

1. **API Key Protection**: Never expose your API key in client code
2. **Rate Limiting**: Implement proper rate limiting to avoid API abuse
3. **Input Validation**: Always validate user inputs before sending to API
4. **Error Handling**: Implement comprehensive error handling
5. **Content Filtering**: Consider implementing content filters for user safety

## 📊 Usage Analytics

Track GPT-5 usage with these built-in metrics:

```javascript
// Get conversation metadata
const metadata = conversation.getMetadata();
console.log('Messages sent:', metadata.messageCount);
console.log('Last updated:', metadata.lastUpdated);

// Track API usage from responses
const response = await sendMessageToGPT5("Hello", { conversationId: 'test' });
console.log('Tokens used:', response.usage);
console.log('Model used:', response.model);
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your API key is valid and has GPT-5 access
   - Check that the key is properly loaded from environment variables

2. **Model Availability**
   - GPT-5 (o3-mini) may not be available in all regions
   - Fallback to GPT-4 if needed by updating the model config

3. **Rate Limiting**
   - Implement delays between requests
   - Use the batch processing utilities with proper delays

4. **Streaming Issues**
   - Ensure your network supports streaming
   - Implement proper error handling for stream interruptions

### Error Handling

The services include comprehensive error handling:

```javascript
try {
  const response = await sendMessageToGPT5("Hello");
  console.log(response.response);
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limit exceeded
    console.log('Please wait before making another request');
  } else if (error.response?.status === 401) {
    // Authentication error
    console.log('Check your API key');
  }
}
```

## 🚀 Next Steps

1. **Customize Specialists**: Modify system prompts in `openaiService.js`
2. **Add Persistence**: Implement database storage for conversations
3. **Add Voice**: Integrate with speech-to-text/text-to-speech
4. **Analytics**: Add usage tracking and analytics
5. **Testing**: Add comprehensive tests for all functions

## 📞 Support

For issues or questions about the GPT-5 integration:

1. Check the error logs in your console
2. Verify your API key and configuration
3. Test with the demo screen (`GPT5DemoScreen.tsx`)
4. Review the OpenAI API documentation

---

**Note**: This integration uses GPT-5 (o3-mini) which provides the latest AI capabilities with improved reasoning, creativity, and efficiency. Make sure your OpenAI account has access to this model.
