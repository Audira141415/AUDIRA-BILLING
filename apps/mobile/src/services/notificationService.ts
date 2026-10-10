import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: 'job_assigned' | 'job_updated' | 'invoice_new' | 'payment_received' | 'attendance_reminder';
  title: string;
  body: string;
  data?: any;
}

/**
 * Register device for push notifications
 * Returns the Expo push token
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);

    // Save token to backend
    try {
      await api.post('/notifications/register-device', {
        token,
        platform: Platform.OS,
        deviceId: await Device.deviceName,
      });
    } catch (error) {
      console.error('Error saving push token:', error);
    }

    // Save token locally
    await AsyncStorage.setItem('pushToken', token);
  } else {
    console.warn('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
    });
  }

  return token;
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  data?: any,
  triggerSeconds: number = 0
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: triggerSeconds > 0 ? { seconds: triggerSeconds } : null,
  });
}

/**
 * Send notification to backend (for admin to technician)
 */
export async function sendNotificationToUser(
  userId: string,
  notification: NotificationData
) {
  try {
    await api.post('/notifications/send', {
      userId,
      ...notification,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Handle notification received while app is foregrounded
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Handle notification response (user tapped notification)
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Get all scheduled notifications
 */
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Badge management
 */
export async function setBadgeCount(count: number) {
  await Notifications.setBadgeCountAsync(count);
}

export async function getBadgeCount() {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Clear all notifications
 */
export async function dismissAllNotifications() {
  await Notifications.dismissAllNotificationsAsync();
}
