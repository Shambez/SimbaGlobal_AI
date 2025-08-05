import 'dotenv/config';

export default {
  expo: {
<<<<<<< HEAD
    name: 'SimbaGlobal_AI',
=======
    name: 'SimbaGlobal AI',
>>>>>>> 26e328d (Fix iOS directory casing for EAS Build)
    slug: 'simbaglobal-ai',
    version: '1.0.0',
    jsEngine: 'hermes',
    sdkVersion: '53.0.0',
    scheme: 'simbaglobal-ai',
    ios: {
      bundleIdentifier: 'com.shambez.simbaglobalai',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: 'com.shambez.simbaglobalai'
    },
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      eas: {
        projectId: "d8bf1aa9-62f8-40cd-9c1c-73b1ae3ac442"
 }    },
    cli: {
      appVersionSource: "appVersion"
    }
  }
};