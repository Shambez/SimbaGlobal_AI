import { sendMessageToGPT5, GPT5Specialists } from './openaiService';

// Advanced GPT-5 utility functions
export class GPT5Utils {
  
  // Analyze user intent and suggest appropriate specialist
  static async analyzeIntent(userMessage) {
    const intentPrompt = `
    Analyze the following user message and determine which type of AI specialist would be most helpful:
    
    Message: "${userMessage}"
    
    Available specialists:
    - creative: For creative writing, brainstorming, artistic projects
    - coder: For programming, debugging, technical solutions
    - business: For business strategy, market analysis, professional advice
    - tutor: For learning, explanations, educational content
    - default: For general questions and conversations
    
    Respond with just the specialist name and a brief reason (max 20 words).
    Format: specialist_name: reason
    `;
    
    try {
      const result = await sendMessageToGPT5(intentPrompt, {
        personality: 'analytical',
        temperature: 0.3,
        includeHistory: false
      });
      
      const response = result.response.toLowerCase();
      const specialists = ['creative', 'coder', 'business', 'tutor'];
      
      for (const specialist of specialists) {
        if (response.includes(specialist)) {
          return {
            specialist,
            reason: result.response.split(':')[1]?.trim() || 'Best match for your query'
          };
        }
      }
      
      return { specialist: 'default', reason: 'General conversation' };
    } catch (error) {
      console.error('Intent analysis error:', error);
      return { specialist: 'default', reason: 'Fallback to general conversation' };
    }
  }
  
  // Smart routing - automatically route to best specialist
  static async smartChat(userMessage, options = {}) {
    const { forceSpecialist, conversationId, ...otherOptions } = options;
    
    if (forceSpecialist) {
      // Use specified specialist
      if (GPT5Specialists[forceSpecialist]) {
        return await GPT5Specialists[forceSpecialist](userMessage, {
          conversationId,
          ...otherOptions
        });
      }
    }
    
    // Analyze intent and route automatically
    const { specialist } = await this.analyzeIntent(userMessage);
    
    if (specialist === 'default') {
      return await sendMessageToGPT5(userMessage, {
        conversationId,
        ...otherOptions
      });
    }
    
    return await GPT5Specialists[specialist](userMessage, {
      conversationId,
      ...otherOptions
    });
  }
  
  // Generate follow-up questions
  static async generateFollowUp(conversation, context = '') {
    const followUpPrompt = `
    Based on this conversation, generate 3 thoughtful follow-up questions that would help continue the discussion naturally.
    
    Context: ${context}
    Recent conversation: ${JSON.stringify(conversation.slice(-4))}
    
    Return as a JSON array of strings. Each question should be engaging and relevant.
    `;
    
    try {
      const result = await sendMessageToGPT5(followUpPrompt, {
        personality: 'analytical',
        temperature: 0.6,
        includeHistory: false
      });
      
      // Try to parse as JSON, fallback to text processing
      try {
        return JSON.parse(result.response);
      } catch {
        // Extract questions from text response
        const questions = result.response
          .split('\n')
          .filter(line => line.includes('?'))
          .slice(0, 3)
          .map(q => q.replace(/^\d+\.?\s*/, '').trim());
        return questions;
      }
    } catch (error) {
      console.error('Follow-up generation error:', error);
      return [
        "Can you tell me more about that?",
        "What would you like to explore next?",
        "Is there anything specific you'd like help with?"
      ];
    }
  }
  
  // Summarize long conversations
  static async summarizeConversation(messages, options = {}) {
    const { maxLength = 200, includeKeyPoints = true } = options;
    
    const summaryPrompt = `
    Summarize this conversation in ${maxLength} words or less.
    ${includeKeyPoints ? 'Include key points and decisions made.' : ''}
    
    Conversation:
    ${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    `;
    
    try {
      const result = await sendMessageToGPT5(summaryPrompt, {
        personality: 'analytical',
        temperature: 0.4,
        includeHistory: false
      });
      
      return result.response;
    } catch (error) {
      console.error('Conversation summary error:', error);
      return 'Unable to generate conversation summary.';
    }
  }
  
  // Extract actionable items from conversation
  static async extractActionItems(messages) {
    const actionPrompt = `
    Review this conversation and extract any actionable items, tasks, or next steps mentioned.
    
    Conversation:
    ${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    Return as a JSON array of objects with: { task: string, priority: 'high'|'medium'|'low', mentioned_by: 'user'|'assistant' }
    If no action items found, return empty array.
    `;
    
    try {
      const result = await sendMessageToGPT5(actionPrompt, {
        personality: 'analytical',
        temperature: 0.3,
        includeHistory: false
      });
      
      try {
        return JSON.parse(result.response);
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Action item extraction error:', error);
      return [];
    }
  }
  
  // Context-aware response generation
  static async contextAwareResponse(userMessage, context = {}) {
    const {
      userProfile = {},
      previousTopics = [],
      currentTask = null,
      preferences = {}
    } = context;
    
    const contextPrompt = `
    User Profile: ${JSON.stringify(userProfile)}
    Recent Topics: ${previousTopics.join(', ')}
    Current Task: ${currentTask || 'None'}
    User Preferences: ${JSON.stringify(preferences)}
    
    User Message: "${userMessage}"
    
    Provide a response that takes into account the user's context, preferences, and conversation history.
    `;
    
    try {
      return await sendMessageToGPT5(contextPrompt, {
        personality: 'default',
        temperature: 0.7
      });
    } catch (error) {
      console.error('Context-aware response error:', error);
      return await sendMessageToGPT5(userMessage);
    }
  }
  
  // Batch processing for multiple queries
  static async batchProcess(queries, options = {}) {
    const { specialist = 'default', delay = 1000 } = options;
    const results = [];
    
    for (const query of queries) {
      try {
        let result;
        if (specialist === 'smart') {
          result = await this.smartChat(query, options);
        } else if (GPT5Specialists[specialist]) {
          result = await GPT5Specialists[specialist](query, options);
        } else {
          result = await sendMessageToGPT5(query, options);
        }
        
        results.push({
          query,
          result: result.response || result,
          success: true
        });
        
        // Add delay between requests to respect rate limits
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        results.push({
          query,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }
}

// Conversation manager for persistent chat sessions
export class ConversationManager {
  constructor(conversationId, options = {}) {
    this.conversationId = conversationId;
    this.options = {
      personality: 'default',
      maxHistory: 50,
      autoSummarize: true,
      ...options
    };
    this.metadata = {
      created: new Date(),
      lastUpdated: new Date(),
      messageCount: 0,
      topics: []
    };
  }
  
  async sendMessage(message, options = {}) {
    const result = await sendMessageToGPT5(message, {
      conversationId: this.conversationId,
      personality: this.options.personality,
      ...options
    });
    
    this.metadata.lastUpdated = new Date();
    this.metadata.messageCount += 1;
    
    return result;
  }
  
  async smartSend(message, options = {}) {
    return await GPT5Utils.smartChat(message, {
      conversationId: this.conversationId,
      ...options
    });
  }
  
  async getFollowUpSuggestions() {
    const history = this.getHistory();
    return await GPT5Utils.generateFollowUp(history, this.conversationId);
  }
  
  async getSummary() {
    const history = this.getHistory();
    return await GPT5Utils.summarizeConversation(history);
  }
  
  async getActionItems() {
    const history = this.getHistory();
    return await GPT5Utils.extractActionItems(history);
  }
  
  getHistory() {
    // Import from main service
    const { getConversationHistory } = require('./openaiService');
    return getConversationHistory(this.conversationId);
  }
  
  clear() {
    // Import from main service
    const { clearConversation } = require('./openaiService');
    clearConversation(this.conversationId);
    this.metadata.messageCount = 0;
    this.metadata.lastUpdated = new Date();
  }
  
  getMetadata() {
    return { ...this.metadata };
  }
}

// Export ready-to-use instances
export const createConversation = (id, options) => new ConversationManager(id, options);
export const defaultConversation = new ConversationManager('default');

// Quick access functions
export const quickChat = async (message, specialist = 'smart') => {
  return await GPT5Utils.smartChat(message, { forceSpecialist: specialist });
};

export const quickCode = async (codeQuery) => {
  return await GPT5Specialists.coder(codeQuery);
};

export const quickCreative = async (creativePrompt) => {
  return await GPT5Specialists.creative(creativePrompt);
};

export const quickBusiness = async (businessQuery) => {
  return await GPT5Specialists.business(businessQuery);
};

export const quickTutor = async (learningQuery) => {
  return await GPT5Specialists.tutor(learningQuery);
};
