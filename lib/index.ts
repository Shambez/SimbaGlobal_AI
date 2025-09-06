// lib/index.ts - SimbaGlobal AI GPT-5 Library Exports

// Core GPT-5 Services
export {
  sendMessageToGPT5,
  sendMessageToOpenAI, // Legacy compatibility
  streamMessageToGPT5,
  clearConversation,
  getConversationHistory,
  GPT5Specialists
} from '../services/openai/openaiService';

export {
  GPT5Utils,
  ConversationManager,
  createConversation,
  defaultConversation,
  quickChat,
  quickCode,
  quickCreative,
  quickBusiness,
  quickTutor
} from '../services/openai/gpt5Utils';

// Voice & TTS Integration
export {
  generateSimbaReply,
  simbaQuickReply,
  SimbaSpecialists,
  getVoiceConversationSummary,
  clearVoiceConversation,
  getVoiceFollowUpSuggestions
} from './openaiSimbaVoice';

export {
  playSimbaTTS,
  simbaTalk,
  SimbaVoiceSpecialists,
  quickVoiceQuery,
  simbaTextOnly,
  TTS_VOICES,
  getOptimalVoiceForSpecialist
} from './useSimbaVoice';

// Client & General AI Functions
export {
  simbaAsk,
  SimbaClient,
  quickSimbaQuery,
  simbaQuickAsk
} from './simbaClient';

// Firebase Integration
export * from './firebase';

// Autopilot & Live Features
export * from './simbaAutopilotHelper';
export * from './simbaLive_autopilot';

// Types & Interfaces
export interface SimbaGPT5Response {
  reply: string;
  specialist?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  conversationId?: string;
  model?: string;
}

export interface SimbaVoiceOptions {
  useSmartRouting?: boolean;
  specialist?: 'smart' | 'creative' | 'coder' | 'business' | 'tutor' | 'default';
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  ttsEnabled?: boolean;
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SimbaConversationOptions {
  personality?: string;
  maxHistory?: number;
  includeHistory?: boolean;
  customSystemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

// Constants & Configuration
export const SIMBA_GPT5_CONFIG = {
  MODEL: 'o3-mini',
  MAX_TOKENS: 8192,
  DEFAULT_TEMPERATURE: 0.7,
  SPECIALISTS: {
    smart: '🧠',
    creative: '🎨', 
    coder: '💻',
    business: '💼',
    tutor: '🎓',
    default: '🤖'
  },
  VOICES: {
    alloy: 'Balanced and natural',
    echo: 'Clear and articulate',
    fable: 'Warm and engaging', 
    onyx: 'Deep and authoritative',
    nova: 'Bright and energetic',
    shimmer: 'Soft and pleasant'
  }
} as const;

// Utility Functions
export const SimbaUtils = {
  /**
   * Get specialist emoji
   */
  getSpecialistEmoji: (specialist: string): string => {
    return SIMBA_GPT5_CONFIG.SPECIALISTS[specialist] || SIMBA_GPT5_CONFIG.SPECIALISTS.default;
  },

  /**
   * Format GPT-5 response for display
   */
  formatResponse: (response: SimbaGPT5Response): string => {
    const emoji = SimbaUtils.getSpecialistEmoji(response.specialist || 'default');
    return `${emoji} ${response.reply}`;
  },

  /**
   * Get optimal configuration for specialist
   */
  getSpecialistConfig: (specialist: string) => {
    const configs = {
      creative: { temperature: 0.9, maxTokens: 800, voice: 'nova' },
      coder: { temperature: 0.3, maxTokens: 1200, voice: 'echo' },
      business: { temperature: 0.4, maxTokens: 600, voice: 'onyx' },
      tutor: { temperature: 0.6, maxTokens: 700, voice: 'shimmer' },
      smart: { temperature: 0.7, maxTokens: 600, voice: 'alloy' },
      default: { temperature: 0.7, maxTokens: 500, voice: 'alloy' }
    };
    return configs[specialist] || configs.default;
  },

  /**
   * Check if GPT-5 is available
   */
  isGPT5Available: (): boolean => {
    try {
      const Constants = require('expo-constants');
      const apiKey = Constants.expoConfig?.extra?.openAiKey || 
                     process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
                     Constants.manifest?.extra?.openAiKey;
      return !!(apiKey && apiKey !== 'demo-key');
    } catch {
      return false;
    }
  },

  /**
   * Get current GPT-5 configuration
   */
  getGPT5Config: () => {
    try {
      const Constants = require('expo-constants');
      return Constants.expoConfig?.extra?.gpt5 || SIMBA_GPT5_CONFIG;
    } catch {
      return SIMBA_GPT5_CONFIG;
    }
  }
};

// Quick Access Functions
export const Simba = {
  // Text interactions
  ask: simbaAsk,
  quick: quickChat,
  
  // Voice interactions  
  speak: simbaTalk,
  voice: quickVoiceQuery,
  
  // Specialists
  creative: quickCreative,
  code: quickCode,
  business: quickBusiness,
  tutor: quickTutor,
  
  // Utilities
  utils: SimbaUtils,
  config: SIMBA_GPT5_CONFIG
};

// Default export
export default Simba;
