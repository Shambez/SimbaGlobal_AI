import 'dotenv/config';

export default {
  expo: {
    owner: "shambez",
    name: "SimbaGlobal_AI",
    slug: "simbaglobal-ai",
    version: "1.0.0",
    jsEngine: "hermes",
    sdkVersion: "53.0.0",
    scheme: "simbaglobal-ai",
    ios: {
      bundleIdentifier: "com.shambez.simbaglobalai",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.shambez.simbaglobalai"
    },
    extra: {
      // Using EXPO_PUBLIC_ variables for Expo compatibility
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      isProduction: process.env.EXPO_PUBLIC_IS_PRODUCTION,

      // Keep original OPENAI_API_KEY reference (backward compatibility)
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,

      // EAS Project ID (required for builds/updates)
      eas: {
        projectId: "03534e9c-979b-4793-87b0-f34030f1be04"
      }
    },
    cli: {
      appVersionSource: "appVersion"
    }
  }
};