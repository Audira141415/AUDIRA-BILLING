import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  // Request permission
  async requestPermission() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    return finalStatus;
  },

  // Get push token
  async getExpoPushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your Expo project ID
      });

      await AsyncStorage.setItem('expoPushToken', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  },

  // Schedule local notification
  async scheduleNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  },

  // Schedule notification for later
  async scheduleDelayedNotification(
    title: string,
    body: string,
    seconds: number,
    data?: any
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: { seconds },
    });
  },

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // Setup notification listeners
  setupListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
  ) {
    // Notification received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    // Notification tapped
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  },
};

// Notification types for ISP system
export const ISPNotifications = {
  // Customer notifications
  async notifyInvoiceDue(invoiceAmount: number, dueDate: string) {
    await notificationService.scheduleNotification(
      '💰 Tagihan Jatuh Tempo',
      `Tagihan Rp ${invoiceAmount.toLocaleString()} jatuh tempo pada ${dueDate}`,
      { type: 'invoice_due' }
    );
  },

  async notifyPaymentSuccess(amount: number) {
    await notificationService.scheduleNotification(
      '✅ Pembayaran Berhasil',
      `Pembayaran Rp ${amount.toLocaleString()} telah diterima`,
      { type: 'payment_success' }
    );
  },

  async notifyUsageAlert(percentage: number) {
    await notificationService.scheduleNotification(
      '⚠️ Kuota Hampir Habis',
      `Anda telah menggunakan ${percentage}% kuota internet bulan ini`,
      { type: 'usage_alert' }
    );
  },

  async notifyReferralSuccess(commission: number) {
    await notificationService.scheduleNotification(
      '🎉 Referral Berhasil!',
      `Selamat! Anda mendapat komisi Rp ${commission.toLocaleString()}`,
      { type: 'referral_success' }
    );
  },

  // Technician notifications
  async notifyNewJob(jobTitle: string, priority: string) {
    await notificationService.scheduleNotification(
      '📋 Pekerjaan Baru',
      `${priority.toUpperCase()}: ${jobTitle}`,
      { type: 'new_job' }
    );
  },

  async notifyJobReminder(jobTitle: string, time: string) {
    await notificationService.scheduleNotification(
      '⏰ Pengingat Pekerjaan',
      `${jobTitle} dijadwalkan pada ${time}`,
      { type: 'job_reminder' }
    );
  },

  async notifyJobCancelled(jobTitle: string) {
    await notificationService.scheduleNotification(
      '❌ Pekerjaan Dibatalkan',
      jobTitle,
      { type: 'job_cancelled' }
    );
  },
};
