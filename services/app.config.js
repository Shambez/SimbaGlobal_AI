import 'dotenv/config';

export default ({ config }) => {
  const updateChannel = process.env.EAS_UPDATE_BRANCH || "production";

  return {
    ...config,
    expo: {
      ...config.expo,
      name: "SimbaGlobal_AI",
      slug: "simbaglobalai",
      owner: "shambez",
      version: "1.0.0",
      orientation: "portrait",
      scheme: "simbaglobalai",
      icon: "./assets/simba-global-ai-icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/images/splash-simba-global-ai-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      runtimeVersion: {
        policy: "appVersion"
      },
      updates: {
        fallbackToCacheTimeout: 0,
        channel: updateChannel
      },
      assetBundlePatterns: ["**/*"],

      ios: {
        ...(config.expo?.ios || {}),
        supportsTablet: true,
        bundleIdentifier: "com.shambez.simbaglobalai",
        buildNumber: "1",
        associatedDomains: ["applinks:simbaglobalai.com"],
        infoPlist: {
          NSMicrophoneUsageDescription:
            "This app uses your microphone to allow you to talk to SimbaGlobal AI.",
          NSCameraUsageDescription:
            "This app may request camera access for visual features (future releases).",
          NSLocationWhenInUseUsageDescription:
            "This app may use your location for customized experiences.",
          NSPhotoLibraryUsageDescription:
            "This app may access your photo library for file upload features.",
          NSBluetoothAlwaysUsageDescription:
            "This app uses Bluetooth to connect to nearby devices (future optional features)."
        }
      },

      android: {
        ...(config.expo?.android || {}),
        package: "com.shambez.simbaglobalai",
        versionCode: 1,
        permissions: [
          "INTERNET",
          "RECORD_AUDIO",
          "CAMERA",
          "ACCESS_FINE_LOCATION",
          "VIBRATE",
          "WAKE_LOCK",
          "FOREGROUND_SERVICE",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE",
          "BLUETOOTH",
          "BLUETOOTH_ADMIN",
          "POST_NOTIFICATIONS"
        ],
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-simba-global-ai-icon.png",
          backgroundColor: "#ffffff"
        },
        intentFilters: [
          {
            action: "VIEW",
            data: [
              {
                scheme: "https",
                host: "simbaglobalai.com",
                pathPrefix: "/"
              },
              {
                scheme: "simbaglobalai"
              }
            ],
            category: ["BROWSABLE", "DEFAULT"]
          }
        ]
      },

      web: {
        favicon: "./assets/favicon.png"
      },

      plugins: [
        "expo-camera",
        "expo-location",
        "expo-splash-screen",
        "expo-updates"
      ],

      extra: {
        eas: {
          projectId: "ba7d41e6-6081-4145-ad6e-86526cb1ff00"
        },
        firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        stripePublicKey: process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY,
        openAiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
        apiUrl: process.env.EXPO_PUBLIC_API_URL,
        isProduction: process.env.EXPO_PUBLIC_IS_PRODUCTION === "true",
        easUpdateBranch: updateChannel
      }
    }
  };
};