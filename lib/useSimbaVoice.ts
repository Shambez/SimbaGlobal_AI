// lib/useSimbaVoice.ts
import { Audio } from "expo-audio";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import { simbaAsk, SimbaClient } from "./simbaClient";
import { generateSimbaReply, SimbaSpecialists } from "./openaiSimbaVoice";

/**
 * Enhanced TTS with GPT-5 integration and voice configuration
 */
export async function playSimbaTTS(
  text: string, 
  options: {
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    model?: 'tts-1' | 'tts-1-hd';
    speed?: number;
  } = {}
): Promise<void> {
  try {
    const { voice = 'alloy', model = 'tts-1-hd', speed = 1.0 } = options;
    
    console.log("🔊 SimbaGlobal AI GPT-5 TTS:", text.substring(0, 100));
    
    // Get API key from configuration
    const apiKey = Constants.expoConfig?.extra?.openAiKey || 
                   process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
                   Constants.manifest?.extra?.openAiKey;
                   
    if (!apiKey || apiKey === 'demo-key') {
      console.log("🎤 TTS in demo mode:", text);
      return; // Skip TTS in demo mode
    }

    // Enhanced TTS request with better configuration
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        input: text.length > 4096 ? text.substring(0, 4096) + "..." : text, // Truncate if too long
        speed
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64Audio = btoa(binaryString);

    const fileUri = FileSystem.cacheDirectory + "simbaglobal_ai_gpt5_voice.mp3";
    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Enhanced audio playback
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: fileUri });
    await sound.setStatusAsync({ shouldPlay: true, volume: 1.0 });
    
    // Clean up after playback
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        // Optionally clean up the temporary file
        FileSystem.deleteAsync(fileUri, { idempotent: true }).catch(() => {});
      }
    });
    
  } catch (err) {
    console.error("🚨 SimbaGlobal AI GPT-5 TTS error:", err);
  }
}

/**
 * Enhanced voice interaction with GPT-5 and smart routing
 */
export async function simbaTalk(
  prompt: string,
  options: {
    useSmartRouting?: boolean;
    specialist?: string;
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    ttsEnabled?: boolean;
    conversationId?: string;
  } = {}
): Promise<{
  reply: string;
  specialist?: string;
  usage?: any;
}> {
  try {
    const {
      useSmartRouting = true,
      specialist,
      voice = 'alloy',
      ttsEnabled = true,
      conversationId = 'simba-voice'
    } = options;

    // Use enhanced GPT-5 voice reply generation
    const result = await generateSimbaReply(prompt, {
      useSmartRouting,
      personality: specialist,
      conversationId,
      maxTokens: 600 // Longer responses for voice
    });

    // Play TTS if enabled
    if (ttsEnabled) {
      await playSimbaTTS(result.reply, { voice });
    }

    return result;
    
  } catch (error) {
    console.error('🚨 SimbaGlobal AI voice interaction error:', error);
    const errorReply = "🦁 I'm having trouble processing that request. Please try again.";
    
    if (options.ttsEnabled !== false) {
      await playSimbaTTS(errorReply, { voice: options.voice });
    }
    
    return {
      reply: errorReply,
      specialist: 'error'
    };
  }
}

/**
 * Specialized voice assistants
 */
export const SimbaVoiceSpecialists = {
  /**
   * Smart voice assistant with automatic routing
   */
  smart: async (prompt: string, voice: string = 'alloy'): Promise<string> => {
    const result = await simbaTalk(prompt, {
      useSmartRouting: true,
      voice: voice as any
    });
    return result.reply;
  },

  /**
   * Creative voice assistant
   */
  creative: async (prompt: string, voice: string = 'nova'): Promise<string> => {
    const result = await simbaTalk(prompt, {
      specialist: 'creative',
      voice: voice as any
    });
    return result.reply;
  },

  /**
   * Code assistant with voice
   */
  coder: async (prompt: string, voice: string = 'echo'): Promise<string> => {
    const result = await simbaTalk(prompt, {
      specialist: 'coder',
      voice: voice as any
    });
    return result.reply;
  },

  /**
   * Business advisor with voice
   */
  business: async (prompt: string, voice: string = 'onyx'): Promise<string> => {
    const result = await simbaTalk(prompt, {
      specialist: 'business',
      voice: voice as any
    });
    return result.reply;
  },

  /**
   * Educational tutor with voice
   */
  tutor: async (prompt: string, voice: string = 'shimmer'): Promise<string> => {
    const result = await simbaTalk(prompt, {
      specialist: 'tutor',
      voice: voice as any
    });
    return result.reply;
  }
};

/**
 * Quick voice query (backward compatibility)
 */
export async function quickVoiceQuery(
  prompt: string, 
  voice: string = 'alloy'
): Promise<string> {
  const result = await simbaTalk(prompt, {
    useSmartRouting: true,
    voice: voice as any,
    ttsEnabled: true
  });
  return result.reply;
}

/**
 * Text-only GPT-5 query (no TTS)
 */
export async function simbaTextOnly(
  prompt: string,
  specialist?: string
): Promise<string> {
  const result = await simbaTalk(prompt, {
    specialist,
    ttsEnabled: false,
    useSmartRouting: !specialist
  });
  return result.reply;
}

/**
 * Get available TTS voices
 */
export const TTS_VOICES = {
  alloy: 'Balanced and natural',
  echo: 'Clear and articulate', 
  fable: 'Warm and engaging',
  onyx: 'Deep and authoritative',
  nova: 'Bright and energetic',
  shimmer: 'Soft and pleasant'
} as const;

/**
 * Voice configuration helper
 */
export function getOptimalVoiceForSpecialist(specialist: string): string {
  const voiceMap = {
    creative: 'nova',
    coder: 'echo',
    business: 'onyx', 
    tutor: 'shimmer',
    default: 'alloy'
  };
  
  return voiceMap[specialist] || voiceMap.default;
}
