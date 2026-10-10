import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from './src/services/notificationService';

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync();

    // Listen for notifications
    notificationListener.current = addNotificationReceivedListener(notification => {
      console.log('📬 Notification received:', notification);
    });

    // Listen for notification responses (user tapped)
    responseListener.current = addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      // Handle navigation based on notification data
      const data = response.notification.request.content.data;
      if (data?.type === 'job_assigned') {
        // Navigate to job detail
      } else if (data?.type === 'invoice_new') {
        // Navigate to invoices
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
