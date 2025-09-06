import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { playSimbaTTS, simbaTalk } from "../lib/useSimbaVoice";
import { SimbaUtils } from "../lib";

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Add small delay to ensure app is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const isGPT5Ready = SimbaUtils.isGPT5Available();

        if (isGPT5Ready) {
          const intro = "🦁 SimbaGlobal AI powered by GPT-5 is now online. Welcome to your intelligent assistant.";

          // Only use TTS if not web platform
          if (Platform.OS !== 'web') {
            await simbaTalk(intro, {
              specialist: "default",
              voice: "alloy",
              ttsEnabled: true,
              useSmartRouting: false, // Avoid complex routing on startup
              maxTokens: 100
            });
          }

          console.log("✅ SimbaGlobal AI GPT-5 System Initialized");
        } else {
          console.log("⚠️ GPT-5 not configured, running in demo mode");
          
          if (Platform.OS !== 'web') {
            await playSimbaTTS("SimbaGlobal AI demo mode activated. Configure your API key for full GPT-5 capabilities.");
          }
        }
      } catch (error) {
        console.error("🚨 App initialization error:", error);
        // Don't let initialization errors crash the app
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: "slide_from_right",
        }}
      >
        {/* Home screen redirect to tabs */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        
        {/* Main Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {/* Auth + Helper screens */}
        <Stack.Screen
          name="login"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "🦁 Login to SimbaGlobal AI",
            headerTitleStyle: { fontSize: 18 }
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "✨ Create Account",
            headerTitleStyle: { fontSize: 18 }
          }}
        />
        <Stack.Screen
          name="trial"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "🎁 Free Trial",
            headerTitleStyle: { fontSize: 18 }
          }}
        />
        <Stack.Screen
          name="helper"
          options={{
            headerShown: true,
            title: "🦁 SimbaGlobal AI Assistant",
            headerTitleStyle: { fontSize: 18 }
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: true,
            title: "Page Not Found",
          }}
        />
      </Stack>
    </>
  );
}