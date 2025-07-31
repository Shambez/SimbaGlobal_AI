import 'dotenv/config';

export default {
  expo: {
    name: 'Simba_AI_App',
    slug: 'simba-ai-app',
    version: '1.0.0',
    sdkVersion: '53.0.0',
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
};