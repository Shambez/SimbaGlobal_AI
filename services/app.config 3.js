import "dotenv/config";

export default ({ config }) => {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || "development";
  const updateChannel = process.env.EAS_UPDATE_BRANCH || appEnv;

  // GPT-5 Configuration
  const gpt5Config = {
    model: process.env.EXPO_PUBLIC_GPT5_MODEL || "o3-mini",
    maxTokens: parseInt(process.env.EXPO_PUBLIC_GPT5_MAX_TOKENS || "8192"),
    temperature: parseFloat(process.env.EXPO_PUBLIC_GPT5_TEMPERATURE || "0.7"),
    enableStreaming: process.env.EXPO_PUBLIC_ENABLE_STREAMING === "true",
    enableSmartRouting: process.env.EXPO_PUBLIC_ENABLE_SMART_ROUTING === "true",
    maxConversationHistory: parseInt(process.env.EXPO_PUBLIC_MAX_CONVERSATION_HISTORY || "50"),
    autoSuggestions: process.env.EXPO_PUBLIC_AUTO_SUGGESTIONS === "true",
    defaultPersonality: process.env.EXPO_PUBLIC_DEFAULT_PERSONALITY || "smart"
  };

  const envConfig = {
    development: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      gpt5: gpt5Config,
    },
    preview: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_PREVIEW,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      gpt5: gpt5Config,
    },
    production: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_PRODUCTION,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      gpt5: gpt5Config,
    },
  };

  const current = envConfig[appEnv];

  return {
    ...config,
    expo: {
      ...config.expo,
      name: process.env.EXPO_PUBLIC_APP_NAME || "SimbaGlobal_AI",
      slug: "simbaglobalai",
      owner: "shambez",
      version: "1.0.0",
      orientation: "portrait",
      scheme: "simbaglobalai",
      icon: "./assets/simba-global-ai-icon.png",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/splash-simba-global-ai-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      runtimeVersion: "1.0.0",
      updates: {
        url: "https://u.expo.dev/ba7d41e6-6081-4145-ad6e-86526cb1ff00",
        fallbackToCacheTimeout: 0,
        checkAutomatically: "ON_LOAD",
        channel: updateChannel,
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.shambez.simbaglobalai",
        infoPlist: {
          NSMicrophoneUsageDescription: "This app uses your microphone to talk with SimbaGlobal AI.",
          NSCameraUsageDescription: "This app may request camera access for uploads.",
          NSLocationWhenInUseUsageDescription: "This app may use location for features.",
          NSPhotoLibraryUsageDescription: "This app may access your photos for uploads.",
          UIBackgroundModes: ["audio", "fetch"]
        }
      },
      android: {
        package: "com.shambez.simbaglobalai",
        permissions: ["INTERNET","RECORD_AUDIO","CAMERA","ACCESS_FINE_LOCATION","VIBRATE"],
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-simba-global-ai-icon.png",
          backgroundColor: "#ffffff"
        }
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        eas: { projectId: "ba7d41e6-6081-4145-ad6e-86526cb1ff00" },
        // Core API Configuration
        openAiKey: current.openAiKey,
        apiUrl: current.apiUrl,
        appEnv,
        isProduction: appEnv === "production",
        easUpdateBranch: updateChannel,
        stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        // GPT-5 Configuration
        gpt5: current.gpt5,
        OPENAI_API_KEY: current.openAiKey, // Legacy compatibility
        // Firebase Configuration
        firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
        // Runtime Configuration
        enableDevelopmentLogging: appEnv !== "production",
        apiTimeout: 60000,
        maxRetries: 3
      }
    }
  };
};