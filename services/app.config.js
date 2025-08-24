import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    expo: {
      ...config.expo,
      name: "SimbaGlobal_AI",
      slug: "simbaglobalai",
      owner: "shambez",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/simba_global_ai_icon.PNG",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/images/splash-simba_global_ai_icon.PNG",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      runtimeVersion: {
        policy: "appVersion"
      },
      updates: {
        fallbackToCacheTimeout: 0,
        channel: process.env.EAS_UPDATE_BRANCH || "production"
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        ...(config.expo?.ios || {}),
        supportsTablet: true,
        bundleIdentifier: "com.shambez.simbaglobalai",
        buildNumber: "1"
      },
      android: {
        ...(config.expo?.android || {}),
        package: "com.shambez.simbaglobalai",
        versionCode: 1
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
};