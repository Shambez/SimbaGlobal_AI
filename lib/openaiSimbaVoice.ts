import Constants from "expo-constants";
import { sendMessageToGPT5, GPT5Specialists } from '../services/openai/openaiService';
import { quickChat, GPT5Utils, ConversationManager } from '../services/openai/gpt5Utils';

// Conversation manager for voice interactions
const voiceConversation = new ConversationManager('simba-voice', {
  personality: 'default',
  maxHistory: 20,
  autoSummarize: true
});

/**
 * Enhanced GPT-5 voice reply generation with smart routing
 */
export async function generateSimbaReply(
  prompt: string, 
  options: {
    useSmartRouting?: boolean;
    personality?: string;
    conversationId?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<{
  reply: string;
  specialist?: string;
  usage?: any;
  conversationId?: string;
}> {
  try {
    const {
      useSmartRouting = true,
      personality = 'default',
      conversationId = 'simba-voice',
      temperature,
      maxTokens = 500
    } = options;

    // Get GPT-5 configuration from app config
    const gpt5Config = Constants.expoConfig?.extra?.gpt5;
    const apiKey = Constants.expoConfig?.extra?.openAiKey || 
                   process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
                   Constants.manifest?.extra?.openAiKey;
    
    if (!apiKey || apiKey === 'demo-key') {
      return {
        reply: "🦁 SimbaGlobal AI is ready to assist you with GPT-5 capabilities! (Demo mode - please configure API key for full functionality)",
        specialist: 'demo'
      };
    }

    let result;
    let usedSpecialist = personality;

    if (useSmartRouting && gpt5Config?.enableSmartRouting) {
      // Use smart routing to automatically select best specialist
      result = await quickChat(prompt, 'smart');
      
      // Analyze which specialist was used
      const intent = await GPT5Utils.analyzeIntent(prompt);
      usedSpecialist = intent.specialist;
    } else if (personality !== 'default') {
      // Use specific specialist
      if (GPT5Specialists[personality]) {
        result = await GPT5Specialists[personality](prompt, {
          conversationId,
          temperature,
          maxTokens
        });
      } else {
        result = await sendMessageToGPT5(prompt, {
          conversationId,
          personality,
          temperature,
          maxTokens
        });
      }
    } else {
      // Use default GPT-5 with enhanced system prompt for voice
      const voiceSystemPrompt = `You are SimbaGlobal AI, powered by GPT-5 (o3-mini). You are a sophisticated, helpful, and intelligent assistant with advanced reasoning capabilities. 
      
      Key traits:
      - You have GPT-5's enhanced reasoning and creativity
      - You provide thoughtful, accurate, and engaging responses
      - You adapt your communication style for voice interactions
      - You are friendly but professional
      - You can handle complex queries with nuanced understanding
      - You remember conversation context and build upon previous exchanges
      
      Respond in a natural, conversational tone suitable for voice interaction. Keep responses concise but informative unless detailed explanation is requested.`;
      
      result = await sendMessageToGPT5(prompt, {
        conversationId,
        customSystemPrompt: voiceSystemPrompt,
        temperature: temperature || gpt5Config?.temperature || 0.7,
        maxTokens: maxTokens || gpt5Config?.maxTokens || 500
      });
    }

    const reply = result.response || result;
    
    // Log GPT-5 usage for debugging
    if (gpt5Config?.enableDevelopmentLogging) {
      console.log('🦁 SimbaGlobal AI GPT-5 Response:', {
        model: result.model || gpt5Config?.model || 'o3-mini',
        specialist: usedSpecialist,
        usage: result.usage,
        conversationId
      });
    }

    return {
      reply,
      specialist: usedSpecialist,
      usage: result.usage,
      conversationId
    };
    
  } catch (err) {
    console.error('🚨 SimbaGlobal AI GPT-5 error:', err);
    
    // Enhanced error handling
    if (err.response?.status === 401) {
      return {
        reply: "🔑 Authentication error - please check your OpenAI API key configuration.",
        specialist: 'error'
      };
    } else if (err.response?.status === 429) {
      return {
        reply: "⏳ I'm experiencing high demand right now. Please try again in a moment.",
        specialist: 'error'
      };
    } else if (err.response?.status === 400) {
      return {
        reply: "🤔 I didn't understand that request. Could you rephrase it?",
        specialist: 'error'
      };
    }
    
    return {
      reply: "🦁 SimbaGlobal AI encountered a technical issue, but I'm working to resolve it. Please try again.",
      specialist: 'error'
    };
  }
}

/**
 * Quick GPT-5 reply for simple queries (backward compatibility)
 */
export async function simbaQuickReply(prompt: string): Promise<string> {
  const result = await generateSimbaReply(prompt, {
    useSmartRouting: true,
    maxTokens: 300
  });
  return result.reply;
}

/**
 * Specialized GPT-5 functions for different use cases
 */
export const SimbaSpecialists = {
  /**
   * Creative assistant for brainstorming and creative writing
   */
  creative: async (prompt: string): Promise<string> => {
    const result = await generateSimbaReply(prompt, {
      personality: 'creative',
      temperature: 0.9,
      maxTokens: 600
    });
    return result.reply;
  },

  /**
   * Code assistant for programming and technical questions
   */
  coder: async (prompt: string): Promise<string> => {
    const result = await generateSimbaReply(prompt, {
      personality: 'coder',
      temperature: 0.3,
      maxTokens: 800
    });
    return result.reply;
  },

  /**
   * Business advisor for strategy and professional guidance
   */
  business: async (prompt: string): Promise<string> => {
    const result = await generateSimbaReply(prompt, {
      personality: 'business',
      temperature: 0.4,
      maxTokens: 600
    });
    return result.reply;
  },

  /**
   * Educational tutor for learning and explanations
   */
  tutor: async (prompt: string): Promise<string> => {
    const result = await generateSimbaReply(prompt, {
      personality: 'tutor',
      temperature: 0.6,
      maxTokens: 700
    });
    return result.reply;
  }
};

/**
 * Get conversation summary for voice interactions
 */
export async function getVoiceConversationSummary(): Promise<string> {
  try {
    return await voiceConversation.getSummary();
  } catch (error) {
    console.error('Error getting voice conversation summary:', error);
    return 'Unable to generate conversation summary.';
  }
}

/**
 * Clear voice conversation history
 */
export function clearVoiceConversation(): void {
  voiceConversation.clear();
}

/**
 * Get follow-up suggestions for voice interactions
 */
export async function getVoiceFollowUpSuggestions(): Promise<string[]> {
  try {
    return await voiceConversation.getFollowUpSuggestions();
  } catch (error) {
    console.error('Error getting voice follow-up suggestions:', error);
    return [
      "What would you like to know more about?",
      "Is there anything else I can help you with?",
      "Would you like me to explain that differently?"
    ];
  }
}
