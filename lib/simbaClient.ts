// lib/simbaClient.ts
import { OpenAI } from "openai";
import Constants from "expo-constants";
import { sendMessageToGPT5, GPT5Specialists } from '../services/openai/openaiService';
import { quickChat, ConversationManager } from '../services/openai/gpt5Utils';

// Main conversation manager for client interactions
const clientConversation = new ConversationManager('simba-client', {
  personality: 'default',
  maxHistory: 30,
  autoSummarize: true
});

const getApiKey = () => {
  return Constants.expoConfig?.extra?.openAiKey || 
         process.env.EXPO_PUBLIC_OPENAI_API_KEY || 
         Constants.manifest?.extra?.openAiKey || 
         'demo-key';
};

const getGPT5Config = () => {
  return Constants.expoConfig?.extra?.gpt5 || {
    model: 'o3-mini',
    maxTokens: 8192,
    temperature: 0.7,
    enableStreaming: true,
    enableSmartRouting: true
  };
};

// Legacy OpenAI client for fallback
let client: OpenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = getApiKey();
    if (apiKey && apiKey !== 'demo-key') {
      client = new OpenAI({ apiKey });
    }
  }
  return client;
};

/**
 * Enhanced GPT-5 powered Simba client with smart routing
 */
export async function simbaAsk(
  prompt: string, 
  options: {
    useGPT5?: boolean;
    specialist?: string;
    conversationId?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  try {
    const {
      useGPT5 = true,
      specialist,
      conversationId = 'simba-client',
      temperature,
      maxTokens
    } = options;

    const apiKey = getApiKey();
    const gpt5Config = getGPT5Config();
    
    if (!apiKey || apiKey === 'demo-key') {
      return "🦁 SimbaGlobal AI is currently in demo mode. Please configure your OpenAI API key to enable full GPT-5 functionality.";
    }

    // Use GPT-5 services by default
    if (useGPT5) {
      let result;

      if (specialist === 'smart' || (gpt5Config.enableSmartRouting && !specialist)) {
        // Use smart routing
        result = await quickChat(prompt, 'smart');
      } else if (specialist && GPT5Specialists[specialist]) {
        // Use specific specialist
        result = await GPT5Specialists[specialist](prompt, {
          conversationId,
          temperature,
          maxTokens
        });
      } else {
        // Use standard GPT-5
        const systemPrompt = `You are SimbaGlobal AI, powered by GPT-5 (o3-mini). You are the most advanced AI assistant available with exceptional reasoning capabilities.
        
        Core characteristics:
        - You have GPT-5's enhanced intelligence and creativity
        - You provide authoritative yet kind support
        - You manage app functionality with expertise
        - You offer accurate, thoughtful responses
        - You maintain context across conversations
        - You adapt your responses based on user needs
        
        You are helpful, intelligent, and always strive to provide the most valuable assistance possible.`;
        
        result = await sendMessageToGPT5(prompt, {
          conversationId,
          customSystemPrompt: systemPrompt,
          temperature: temperature || gpt5Config.temperature,
          maxTokens: maxTokens || 500
        });
      }

      const response = result.response || result;
      
      // Log GPT-5 usage
      if (Constants.expoConfig?.extra?.enableDevelopmentLogging) {
        console.log('🦁 SimbaClient GPT-5:', {
          model: gpt5Config.model,
          specialist,
          usage: result.usage,
          conversationId
        });
      }

      return response;
    }

    // Fallback to legacy OpenAI client (GPT-4o)
    const openaiClient = getClient();
    if (!openaiClient) {
      return "SimbaGlobal AI service is currently unavailable.";
    }
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are SimbaGlobal AI, a powerful assistant that manages the app and supports users with strong, kind authority. You are intelligent, helpful, and always provide accurate responses." },
        { role: "user", content: prompt },
      ],
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 500,
    });

    return response.choices[0]?.message?.content?.trim() || "I didn't catch that.";
    
  } catch (err) {
    console.error("🚨 SimbaGlobal AI error:", err);
    
    // Enhanced error handling
    if (err.response?.status === 401) {
      return "🔑 Authentication error - please verify your OpenAI API key.";
    } else if (err.response?.status === 429) {
      return "⏳ I'm experiencing high demand. Please try again shortly.";
    } else if (err.response?.status === 400) {
      return "🤔 I need you to rephrase that request.";
    }
    
    return "🦁 I encountered a technical issue, but I'm working to resolve it. Please try again.";
  }
}

/**
 * GPT-5 Specialist functions for specific use cases
 */
export const SimbaClient = {
  /**
   * Smart assistant with automatic specialist routing
   */
  smart: async (prompt: string): Promise<string> => {
    return await simbaAsk(prompt, { specialist: 'smart' });
  },

  /**
   * Creative assistant for brainstorming and creative tasks
   */
  creative: async (prompt: string): Promise<string> => {
    return await simbaAsk(prompt, { specialist: 'creative' });
  },

  /**
   * Code assistant for programming and technical questions
   */
  coder: async (prompt: string): Promise<string> => {
    return await simbaAsk(prompt, { specialist: 'coder' });
  },

  /**
   * Business advisor for strategy and professional guidance
   */
  business: async (prompt: string): Promise<string> => {
    return await simbaAsk(prompt, { specialist: 'business' });
  },

  /**
   * Educational tutor for learning and explanations
   */
  tutor: async (prompt: string): Promise<string> => {
    return await simbaAsk(prompt, { specialist: 'tutor' });
  },

  /**
   * Get conversation summary
   */
  getSummary: async (): Promise<string> => {
    try {
      return await clientConversation.getSummary();
    } catch (error) {
      console.error('Error getting conversation summary:', error);
      return 'Unable to generate conversation summary.';
    }
  },

  /**
   * Clear conversation history
   */
  clearHistory: (): void => {
    clientConversation.clear();
  },

  /**
   * Get follow-up suggestions
   */
  getFollowUpSuggestions: async (): Promise<string[]> => {
    try {
      return await clientConversation.getFollowUpSuggestions();
    } catch (error) {
      console.error('Error getting follow-up suggestions:', error);
      return [
        "What else can I help you with?",
        "Would you like me to elaborate on that?",
        "Is there another topic you'd like to explore?"
      ];
    }
  }
};

/**
 * Quick GPT-5 query (backward compatibility)
 */
export async function quickSimbaQuery(prompt: string): Promise<string> {
  return await simbaAsk(prompt, { useGPT5: true, specialist: 'smart' });
}

/**
 * Legacy function name for compatibility
 */
export const simbaQuickAsk = simbaAsk;
