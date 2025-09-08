import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

export function useFCMSubscription() {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          console.log("✅ FCM Token:", token);
          await messaging().subscribeToTopic("all");
          console.log("📢 Subscribed to topic: all");
        }
      } catch (err) {
        console.error("❌ FCM setup failed", err);
      }
    };

    setupFCM();
  }, []);
}
