import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

interface PushNotification {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
}

@Injectable()
export class NotificationService {
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  constructor(private prisma: PrismaService) {}

  // Send push notification via Expo
  async sendPushNotification(notification: PushNotification) {
    try {
      const message = {
        to: notification.to,
        sound: notification.sound || 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: notification.badge,
      };

      const response = await axios.post(this.EXPO_PUSH_URL, message, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Send to multiple devices
  async sendBatchNotifications(notifications: PushNotification[]) {
    try {
      const response = await axios.post(this.EXPO_PUSH_URL, notifications, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error sending batch notifications:', error);
      throw error;
    }
  }

  // Save device token
  async saveDeviceToken(userId: string, token: string) {
    // Store in user table or separate device tokens table
    await this.prisma.user.update({
      where: { id: userId },
      data: { pushToken: token },
    });
  }

  // Notify customer about invoice
  async notifyInvoiceDue(customerId: string, invoiceAmount: number, dueDate: Date) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (customer?.pushToken) {
      await this.sendPushNotification({
        to: customer.pushToken,
        title: '💰 Tagihan Jatuh Tempo',
        body: `Tagihan Rp ${invoiceAmount.toLocaleString()} jatuh tempo pada ${dueDate.toLocaleDateString('id-ID')}`,
        data: { type: 'invoice_due', customerId },
      });
    }
  }

  // Notify payment success
  async notifyPaymentSuccess(customerId: string, amount: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (customer?.pushToken) {
      await this.sendPushNotification({
        to: customer.pushToken,
        title: '✅ Pembayaran Berhasil',
        body: `Pembayaran Rp ${amount.toLocaleString()} telah diterima`,
        data: { type: 'payment_success', customerId },
      });
    }
  }

  // Notify usage alert
  async notifyUsageAlert(customerId: string, percentage: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (customer?.pushToken) {
      await this.sendPushNotification({
        to: customer.pushToken,
        title: '⚠️ Kuota Hampir Habis',
        body: `Anda telah menggunakan ${percentage}% kuota internet bulan ini`,
        data: { type: 'usage_alert', customerId },
      });
    }
  }

  // Notify technician about new job
  async notifyNewJob(technicianId: string, jobId: string, jobTitle: string, priority: string) {
    const technician = await this.prisma.user.findUnique({
      where: { id: technicianId },
    });

    if (technician?.pushToken) {
      await this.sendPushNotification({
        to: technician.pushToken,
        title: '📋 Pekerjaan Baru',
        body: `${priority.toUpperCase()}: ${jobTitle}`,
        data: { type: 'new_job', jobId },
        badge: 1,
      });
    }
  }

  // Notify referral success
  async notifyReferralSuccess(customerId: string, commission: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (customer?.pushToken) {
      await this.sendPushNotification({
        to: customer.pushToken,
        title: '🎉 Referral Berhasil!',
        body: `Selamat! Anda mendapat komisi Rp ${commission.toLocaleString()}`,
        data: { type: 'referral_success', customerId },
      });
    }
  }

  // Broadcast to all customers
  async broadcastToCustomers(title: string, body: string, data?: any) {
    const customers = await this.prisma.customer.findMany();

    const notifications = customers
      .filter((c) => c.pushToken)
      .map((c) => ({
        to: c.pushToken!,
        title,
        body,
        data,
      }));

    if (notifications.length > 0) {
      await this.sendBatchNotifications(notifications);
    }
  }

  // Broadcast to all technicians
  async broadcastToTechnicians(title: string, body: string, data?: any) {
    const technicians = await this.prisma.user.findMany({
      where: { role: 'technician' },
    });

    const notifications = technicians
      .filter((t) => t.pushToken)
      .map((t) => ({
        to: t.pushToken!,
        title,
        body,
        data,
      }));

    if (notifications.length > 0) {
      await this.sendBatchNotifications(notifications);
    }
  }
}
