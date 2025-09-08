#!/usr/bin/env ts-node

import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin (using service account key from environment)
const serviceAccount = {
  type: "service_account",
  project_id: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

try {
  const app = initializeApp({
    credential: cert(serviceAccount as any),
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  });

  const messaging = getMessaging(app);

  async function sendPushNotification(message: string) {
    const payload = {
      notification: {
        title: '🦁 SimbaGlobal AI',
        body: message,
        icon: '/assets/simba-global-ai-icon.png'
      },
      data: {
        url: 'simbaglobalai://home',
        action: 'open_app',
        timestamp: new Date().toISOString()
      },
      topic: 'all'
    };

    try {
      const response = await messaging.send(payload);
      console.log('✅ Push notification sent successfully:', response);
      console.log('📢 Message:', message);
      console.log('🎯 Topic: all users');
      
      return response;
    } catch (error) {
      console.error('❌ Failed to send push notification:', error);
      throw error;
    }
  }

  // Get message from command line argument
  const message = process.argv[2] || '🚀 SimbaGlobal AI has been updated!';
  
  sendPushNotification(message)
    .then(() => {
      console.log('🎉 Push notification deployment complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Push notification failed:', error.message);
      process.exit(1);
    });

} catch (error) {
  console.warn('⚠️ Firebase Admin not configured - skipping push notifications');
  console.log('📝 To enable push notifications, set these environment variables:');
  console.log('   • EXPO_PUBLIC_FIREBASE_PROJECT_ID');
  console.log('   • FIREBASE_PRIVATE_KEY_ID'); 
  console.log('   • FIREBASE_PRIVATE_KEY');
  console.log('   • FIREBASE_CLIENT_EMAIL');
  console.log('   • FIREBASE_CLIENT_ID');
  console.log('');
  console.log('✅ Continuing deployment without push notifications...');
  process.exit(0);
}
