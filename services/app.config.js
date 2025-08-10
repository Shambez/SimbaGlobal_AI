import 'dotenv/config';

export default {
  expo: {
    name: "SimbaGlobal_AI",
    slug: "simbaglobalai",
    owner: "shambez",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      channel: process.env.EAS_UPDATE_BRANCH || "production"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.shambez.simbaglobalai"
    },
    android: {
      package: "com.shambez.simbaglobalai"
    },
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      isProduction: process.env.EXPO_PUBLIC_IS_PRODUCTION === "true"
    }
  }
};