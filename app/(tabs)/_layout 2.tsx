import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { playSimbaTTS, simbaTalk } from "../../lib/useSimbaVoice";
import { SimbaUtils } from "../../lib";

export default function TabsLayout() {
  useEffect(() => {
    const initializeTabs = async () => {
      try {
        // Delay tab initialization to avoid conflicts with root layout
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const isGPT5Ready = SimbaUtils.isGPT5Available();
        
        if (isGPT5Ready && Platform.OS !== 'web') {
          await simbaTalk("Welcome to SimbaGlobal AI. Navigate between Home, Chat, Explore, Voice, and Profile.", {
            specialist: 'default',
            voice: 'alloy',
            ttsEnabled: true,
            maxTokens: 80,
            useSmartRouting: false
          });
        } else if (Platform.OS !== 'web') {
          await playSimbaTTS("SimbaGlobal AI navigation ready. Configure API key for full GPT-5 features.");
        }
        
        console.log('🦁 Tab Navigation Initialized');
      } catch (error) {
        console.error('🚨 Tab initialization error:', error);
        // Don't let tab initialization errors affect navigation
      }
    };

    // Only initialize tabs on native platforms to avoid web issues
    if (Platform.OS !== 'web') {
      initializeTabs();
    } else {
      console.log('🦁 Web platform - skipping TTS initialization');
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff9800",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { 
          backgroundColor: "#fff",
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: Platform.OS === 'ios' ? 85 : 70,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: "Voice",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
