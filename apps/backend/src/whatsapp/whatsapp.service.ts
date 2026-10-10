import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface WhatsAppMessage {
  phone: string;
  message: string;
  filename?: string;
  fileUrl?: string;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiUrl = process.env.FONNTE_API_URL || 'https://api.fonnte.com/send';
  private readonly token = process.env.FONNTE_API_TOKEN || '';

  /**
   * Send WhatsApp message
   */
  async sendMessage(data: WhatsAppMessage): Promise<any> {
    try {
      if (!this.token) {
        this.logger.warn('FONNTE_API_TOKEN not configured, skipping WhatsApp send');
        return { success: false, message: 'WhatsApp API not configured' };
      }

      const payload: any = {
        target: data.phone.replace(/^0/, '62'), // Convert 08xxx to 628xxx
        message: data.message,
      };

      // Add file if provided
      if (data.fileUrl) {
        payload.url = data.fileUrl;
        payload.filename = data.filename || 'document.pdf';
      }

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          Authorization: this.token,
        },
      });

      this.logger.log(`WhatsApp sent to ${data.phone}: ${response.data.status}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp to ${data.phone}:`, error.message);
      throw error;
    }
  }

  /**
   * Send invoice notification
   */
  async sendInvoiceNotification(customer: any, invoice: any): Promise<any> {
    const message = `
🧾 *TAGIHAN INTERNET - AUDIRANET*

Yth. ${customer.name}
Nomor Invoice: ${invoice.invoiceNumber || invoice.id}
Paket: ${invoice.package || customer.package}
Periode: ${invoice.month || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
Total Tagihan: Rp ${(invoice.amount || 0).toLocaleString('id-ID')}
Jatuh Tempo: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('id-ID') : '-'}

Status: ${invoice.status === 'PAID' ? '✅ Lunas' : '⏳ Belum Dibayar'}

${invoice.status !== 'PAID' ? `💳 Bayar Sekarang: ${process.env.PAYMENT_URL || 'https://payment.audiranet.id'}/invoice/${invoice.id}` : ''}

Terima kasih atas kepercayaan Anda! 🙏

_AudiraNET - Internet Cepat & Terpercaya_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(customer: any, invoice: any, daysLeft: number): Promise<any> {
    let emoji = '⏰';
    let urgency = '';

    if (daysLeft === 3) {
      emoji = '⏰';
      urgency = 'Pengingat: ';
    } else if (daysLeft === 1) {
      emoji = '⚠️';
      urgency = 'Besok adalah ';
    } else if (daysLeft === 0) {
      emoji = '🔴';
      urgency = 'Hari ini adalah ';
    } else if (daysLeft < 0) {
      emoji = '🚨';
      urgency = 'Pembayaran Terlambat: ';
    }

    const message = `
${emoji} *${urgency}PENGINGAT TAGIHAN*

Hai ${customer.name},

${daysLeft > 0 ? `Tagihan Anda ${daysLeft} hari lagi jatuh tempo.` : daysLeft === 0 ? 'Tagihan Anda jatuh tempo HARI INI.' : `Tagihan Anda telah terlambat ${Math.abs(daysLeft)} hari.`}

Invoice: ${invoice.invoiceNumber || invoice.id}
Total: Rp ${(invoice.amount || 0).toLocaleString('id-ID')}
Jatuh Tempo: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('id-ID') : '-'}

💳 Bayar Sekarang: ${process.env.PAYMENT_URL || 'https://payment.audiranet.id'}/invoice/${invoice.id}

${daysLeft < 0 ? '⚠️ Layanan Anda akan disuspend jika belum dibayar dalam 7 hari.' : ''}

Butuh bantuan? Hubungi CS kami.

_AudiraNET_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(customer: any, payment: any): Promise<any> {
    const message = `
✅ *PEMBAYARAN BERHASIL*

Terima kasih ${customer.name}!

Pembayaran Anda telah kami terima:
Invoice: ${payment.invoiceNumber || payment.invoiceId}
Jumlah: Rp ${(payment.amount || 0).toLocaleString('id-ID')}
Metode: ${payment.method || 'Transfer Bank'}
Tanggal: ${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}

Status Layanan: ✅ *AKTIF*

Terima kasih atas pembayaran tepat waktu! 🙏

_AudiraNET - Internet Cepat & Terpercaya_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Send service suspension warning
   */
  async sendSuspensionWarning(customer: any, invoice: any): Promise<any> {
    const message = `
🚨 *PERINGATAN PEMUTUSAN LAYANAN*

Yth. ${customer.name},

Pembayaran Anda telah melewati jatuh tempo lebih dari 7 hari.

Invoice: ${invoice.invoiceNumber || invoice.id}
Total: Rp ${(invoice.amount || 0).toLocaleString('id-ID')}
Terlambat: ${Math.abs(this.calculateDaysLate(invoice.dueDate))} hari

⚠️ Layanan internet Anda akan kami suspend dalam 24 jam jika pembayaran belum diterima.

💳 Bayar Sekarang: ${process.env.PAYMENT_URL || 'https://payment.audiranet.id'}/invoice/${invoice.id}

Untuk keberatan atau bantuan, silakan hubungi CS kami segera.

_AudiraNET_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Send ticket update notification
   */
  async sendTicketUpdate(customer: any, ticket: any): Promise<any> {
    let statusEmoji = '📝';
    let statusText = ticket.status;

    switch (ticket.status) {
      case 'OPEN':
        statusEmoji = '📝';
        statusText = 'Dibuka';
        break;
      case 'IN_PROGRESS':
        statusEmoji = '⚙️';
        statusText = 'Sedang Ditangani';
        break;
      case 'RESOLVED':
        statusEmoji = '✅';
        statusText = 'Selesai';
        break;
      case 'CLOSED':
        statusEmoji = '🔒';
        statusText = 'Ditutup';
        break;
    }

    const message = `
${statusEmoji} *UPDATE TIKET SUPPORT*

Hai ${customer.name},

Tiket #${ticket.id} - ${statusText}
Judul: ${ticket.title}
${ticket.assignedTo ? `Teknisi: ${ticket.assignedTo}` : ''}

${ticket.notes ? `Catatan: ${ticket.notes}` : ''}

${ticket.status === 'RESOLVED' ? '✅ Masalah Anda telah diselesaikan. Terima kasih!' : 'Kami akan segera menangani tiket Anda.'}

_AudiraNET Support Team_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Send network downtime alert
   */
  async sendDowntimeAlert(customer: any, router: any): Promise<any> {
    const message = `
⚠️ *GANGGUAN JARINGAN*

Hai ${customer.name},

Kami mendeteksi gangguan pada router ${router.name}.
Waktu: ${new Date().toLocaleString('id-ID')}

Tim teknisi kami sedang menangani masalah ini.

Estimasi pemulihan: 30-60 menit

Mohon maaf atas ketidaknyamanannya. 🙏

_AudiraNET NOC Team_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Send promotional message
   */
  async sendPromotion(customer: any, promo: any): Promise<any> {
    const message = `
🎉 *PROMO SPECIAL - AUDIRANET*

Hai ${customer.name}!

${promo.title}

${promo.description}

${promo.discount ? `Diskon: ${promo.discount}%` : ''}
${promo.validUntil ? `Berlaku sampai: ${new Date(promo.validUntil).toLocaleDateString('id-ID')}` : ''}

💬 Hubungi CS untuk info lebih lanjut!

_AudiraNET - Internet Cepat & Terpercaya_
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * Calculate days late for payment
   */
  private calculateDaysLate(dueDate: Date | string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
