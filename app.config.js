import 'dotenv/config';

export default {
  expo: {
    owner: "shambez",
    name: 'SimbaGlobal AI',
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
        projectId: "03534e9c-979b-4793-87b0-f34030f1be04"
 }    },
    cli: {
      appVersionSource: "appVersion"
    }
  }
};