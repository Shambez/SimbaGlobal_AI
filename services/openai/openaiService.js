import axios from 'axios';
import Constants from 'expo-constants';

// Get API key from environment
const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

// GPT-5 (o3-mini) Configuration
const GPT5_CONFIG = {
  model: 'o3-mini',
  max_tokens: 8192,
  temperature: 0.7,
  top_p: 0.95,
  frequency_penalty: 0.1,
  presence_penalty: 0.1
};

// System prompts for different AI personalities
const SYSTEM_PROMPTS = {
  default: "You are Simba AI, a highly intelligent and helpful AI assistant. You provide accurate, thoughtful, and engaging responses while maintaining a friendly and professional tone.",
  creative: "You are Simba AI in creative mode. You think outside the box, provide innovative solutions, and help users explore creative possibilities with enthusiasm and imagination.",
  analytical: "You are Simba AI in analytical mode. You provide detailed, logical analysis, break down complex problems step-by-step, and offer data-driven insights.",
  casual: "You are Simba AI in casual mode. You're friendly, conversational, and approachable while still being helpful and informative.",
  expert: "You are Simba AI in expert mode. You provide highly detailed, technical responses with deep expertise across various domains."
};

// Conversation memory storage (in production, use proper storage)
let conversationHistory = new Map();

// Enhanced GPT-5 service with conversation history
export const sendMessageToGPT5 = async (
  userMessage, 
  options = {}
) => {
  const {
    conversationId = 'default',
    personality = 'default',
    includeHistory = true,
    maxHistoryLength = 10,
    customSystemPrompt,
    temperature,
    maxTokens
  } = options;

  try {
    // Get or create conversation history
    if (!conversationHistory.has(conversationId)) {
      conversationHistory.set(conversationId, []);
    }
    
    const history = conversationHistory.get(conversationId);
    
    // Build messages array
    const messages = [];
    
    // Add system prompt
    const systemPrompt = customSystemPrompt || SYSTEM_PROMPTS[personality] || SYSTEM_PROMPTS.default;
    messages.push({ role: 'system', content: systemPrompt });
    
    // Add conversation history if requested
    if (includeHistory && history.length > 0) {
      const recentHistory = history.slice(-maxHistoryLength * 2); // *2 because each exchange is 2 messages
      messages.push(...recentHistory);
    }
    
    // Add current user message
    messages.push({ role: 'user', content: userMessage });
    
    // Prepare request configuration
    const requestConfig = {
      ...GPT5_CONFIG,
      messages,
      ...(temperature !== undefined && { temperature }),
      ...(maxTokens !== undefined && { max_tokens: maxTokens })
    };
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestConfig,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000 // 60 second timeout
      }
    );
    
    const aiResponse = response.data.choices[0].message.content.trim();
    
    // Update conversation history
    history.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );
    
    // Keep history manageable
    if (history.length > maxHistoryLength * 4) {
      history.splice(0, history.length - maxHistoryLength * 4);
    }
    
    return {
      response: aiResponse,
      usage: response.data.usage,
      model: response.data.model,
      conversationId
    };
    
  } catch (error) {
    console.error('GPT-5 API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      conversationId
    });
    
    // Handle specific error types
    if (error.response?.status === 401) {
      return {
        response: 'Authentication error. Please check your OpenAI API key.',
        error: true
      };
    } else if (error.response?.status === 429) {
      return {
        response: 'Rate limit exceeded. Please try again in a moment.',
        error: true
      };
    } else if (error.response?.status === 400) {
      return {
        response: 'Invalid request. Please try rephrasing your message.',
        error: true
      };
    }
    
    return {
      response: 'Sorry, Simba AI is experiencing technical difficulties. Please try again later.',
      error: true
    };
  }
};

// Backward compatibility function (updates existing function to use GPT-5)
export const sendMessageToOpenAI = async (userMessage) => {
  const result = await sendMessageToGPT5(userMessage, { personality: 'default' });
  return result.response;
};

// Streaming GPT-5 response (for real-time chat)
export const streamMessageToGPT5 = async (
  userMessage,
  onChunk,
  options = {}
) => {
  const {
    conversationId = 'default',
    personality = 'default',
    customSystemPrompt
  } = options;
  
  try {
    // Get conversation history
    if (!conversationHistory.has(conversationId)) {
      conversationHistory.set(conversationId, []);
    }
    
    const history = conversationHistory.get(conversationId);
    const messages = [];
    
    // Add system prompt
    const systemPrompt = customSystemPrompt || SYSTEM_PROMPTS[personality] || SYSTEM_PROMPTS.default;
    messages.push({ role: 'system', content: systemPrompt });
    
    // Add recent history
    if (history.length > 0) {
      messages.push(...history.slice(-20));
    }
    
    messages.push({ role: 'user', content: userMessage });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...GPT5_CONFIG,
        messages,
        stream: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              onChunk(content, fullResponse);
            }
          } catch (e) {
            // Skip parsing errors for malformed JSON
          }
        }
      }
    }
    
    // Update conversation history
    history.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: fullResponse }
    );
    
    return fullResponse;
    
  } catch (error) {
    console.error('GPT-5 Streaming Error:', error);
    throw error;
  }
};

// Clear conversation history
export const clearConversation = (conversationId = 'default') => {
  conversationHistory.set(conversationId, []);
};

// Get conversation history
export const getConversationHistory = (conversationId = 'default') => {
  return conversationHistory.get(conversationId) || [];
};

// Specialized GPT-5 functions
export const GPT5Specialists = {
  // Creative writing assistant
  creative: async (prompt, options = {}) => {
    return await sendMessageToGPT5(prompt, {
      ...options,
      personality: 'creative',
      temperature: 0.9
    });
  },
  
  // Code analysis and generation
  coder: async (codePrompt, options = {}) => {
    const systemPrompt = "You are Simba AI's coding specialist. You provide clean, efficient, and well-documented code solutions. Always explain your code and suggest best practices.";
    return await sendMessageToGPT5(codePrompt, {
      ...options,
      customSystemPrompt: systemPrompt,
      temperature: 0.3
    });
  },
  
  // Business and strategy advisor
  business: async (businessQuery, options = {}) => {
    const systemPrompt = "You are Simba AI's business strategist. You provide actionable business insights, market analysis, and strategic recommendations based on industry best practices.";
    return await sendMessageToGPT5(businessQuery, {
      ...options,
      customSystemPrompt: systemPrompt,
      temperature: 0.4
    });
  },
  
  // Learning and education tutor
  tutor: async (learningQuery, options = {}) => {
    const systemPrompt = "You are Simba AI's educational tutor. You break down complex concepts into easy-to-understand explanations, provide examples, and adapt your teaching style to help users learn effectively.";
    return await sendMessageToGPT5(learningQuery, {
      ...options,
      customSystemPrompt: systemPrompt,
      temperature: 0.6
    });
  }
};
