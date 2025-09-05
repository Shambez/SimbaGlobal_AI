import "dotenv/config";

export default ({ config }) => {
  const appEnv = process.env.EXPO_PUBLIC_APP_ENV || "development";
  const updateChannel = process.env.EAS_UPDATE_BRANCH || appEnv;

  const envConfig = {
    development: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    },
    preview: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_PREVIEW,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    },
    production: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL_PRODUCTION,
      openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
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
        openAiKey: current.openAiKey,
        apiUrl: current.apiUrl,
        appEnv,
        isProduction: appEnv === "production",
        easUpdateBranch: updateChannel,
        stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
      }
    }
  };
};