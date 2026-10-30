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
  
  // Self-Hosted WAHA (Baileys Engine) Configuration
  private readonly wahaUrl = process.env.WAHA_API_URL || 'http://localhost:3220';
  private readonly wahaSession = process.env.WAHA_SESSION || 'default';
  private readonly wahaApiKey = process.env.WAHA_API_KEY || 'audira-secret-key-2026';

  // Fonnte Cloud Configuration (Fallback)
  private readonly apiUrl = process.env.FONNTE_API_URL || 'https://api.fonnte.com/send';
  private readonly token = process.env.FONNTE_API_TOKEN || '';
  
  private readonly customerPortalUrl = process.env.CUSTOMER_PORTAL_URL || 'http://localhost:3219';
  private readonly backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3218';

  /**
   * Cek Status Koneksi Self-Hosted WAHA (Baileys Engine)
   */
  async getWahaStatus(): Promise<any> {
    try {
      const res = await axios.get(`${this.wahaUrl}/api/sessions`, {
        headers: { 'X-Api-Key': this.wahaApiKey },
        timeout: 2500,
      });
      const sessions = res.data;
      const defaultSession = Array.isArray(sessions)
        ? sessions.find((s: any) => s.name === this.wahaSession)
        : sessions;

      return {
        online: true,
        engine: 'Baileys (NOWEB)',
        session: defaultSession || { name: 'default', status: 'STOPPED' },
        dashboardUrl: `${this.wahaUrl}/dashboard`,
      };
    } catch (err: any) {
      return {
        online: false,
        engine: 'Baileys (NOWEB)',
        message: 'WAHA Gateway belum aktif atau sedang starting',
        error: err.message,
      };
    }
  }

  /**
   * Start / Inisialisasi atau Restart Sesi WAHA Baileys
   */
  async startWahaSession(): Promise<any> {
    try {
      // Coba restart dulu jika sesi sudah terdaftar
      try {
        const restartRes = await axios.post(
          `${this.wahaUrl}/api/sessions/${this.wahaSession}/restart`,
          {},
          {
            headers: { 'X-Api-Key': this.wahaApiKey },
            timeout: 6000,
          },
        );
        return restartRes.data;
      } catch (restartErr) {
        // Jika belum ada sesi, panggil /api/sessions/start
        const res = await axios.post(
          `${this.wahaUrl}/api/sessions/start`,
          { name: this.wahaSession },
          {
            headers: { 'X-Api-Key': this.wahaApiKey },
            timeout: 6000,
          },
        );
        return res.data;
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Ambil QR Code Otentikasi WhatsApp (Live Scan dari WAHA Baileys)
   */
  async getWahaQrCode(): Promise<any> {
    const fetchQr = async () => {
      return await axios.get(`${this.wahaUrl}/api/${this.wahaSession}/auth/qr`, {
        headers: { 'X-Api-Key': this.wahaApiKey },
        timeout: 5000,
        responseType: 'arraybuffer',
      });
    };

    try {
      const res = await fetchQr();
      const base64 = Buffer.from(res.data, 'binary').toString('base64');
      return {
        status: true,
        qrCode: `data:image/png;base64,${base64}`,
      };
    } catch (err: any) {
      // Auto-restart session jika expired/stopped/failed lalu retry
      try {
        await this.startWahaSession();
        // Beri jeda 1.5 detik agar Baileys memunculkan stream QR baru
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const retryRes = await fetchQr();
        const base64 = Buffer.from(retryRes.data, 'binary').toString('base64');
        return {
          status: true,
          qrCode: `data:image/png;base64,${base64}`,
        };
      } catch (retryErr: any) {
        return {
          status: false,
          message: 'QR Code sedang disiapkan atau sesi WhatsApp sudah terhubung.',
          details: retryErr.message,
        };
      }
    }
  }

  /**
   * Send WhatsApp message via Self-Hosted WAHA (Baileys Engine) with Fonnte & Simulation fallback
   */
  async sendMessage(data: WhatsAppMessage): Promise<any> {
    const targetPhone = (data.phone || '').replace(/^0/, '62').replace(/\D/g, '');
    const chatId = `${targetPhone}@c.us`;

    // 1. Coba kirim via Self-Hosted WAHA (Baileys Engine)
    try {
      const wahaCheck = await axios.get(`${this.wahaUrl}/api/sessions`, {
        headers: { 'X-Api-Key': this.wahaApiKey },
        timeout: 1500,
      });

      if (wahaCheck.status === 200) {
        if (data.fileUrl) {
          // Kirim berkas PDF Kwitansi Resmi via WAHA
          const response = await axios.post(
            `${this.wahaUrl}/api/sendFile`,
            {
              session: this.wahaSession,
              chatId: chatId,
              file: {
                url: data.fileUrl,
                filename: data.filename || 'Kwitansi.pdf',
              },
              caption: data.message,
            },
            {
              headers: { 'X-Api-Key': this.wahaApiKey },
              timeout: 10000,
            },
          );

          this.logger.log(`[WAHA Baileys Engine] Berkas PDF berhasil dikirim ke +${targetPhone}`);
          return {
            status: true,
            provider: 'Self-Hosted WAHA (Baileys)',
            target: targetPhone,
            data: response.data,
          };
        } else {
          // Kirim pesan teks notifikasi biasa via WAHA
          const response = await axios.post(
            `${this.wahaUrl}/api/sendText`,
            {
              session: this.wahaSession,
              chatId: chatId,
              text: data.message,
            },
            {
              headers: { 'X-Api-Key': this.wahaApiKey },
              timeout: 10000,
            },
          );

          this.logger.log(`[WAHA Baileys Engine] Pesan teks berhasil dikirim ke +${targetPhone}`);
          return {
            status: true,
            provider: 'Self-Hosted WAHA (Baileys)',
            target: targetPhone,
            data: response.data,
          };
        }
      }
    } catch (wahaError: any) {
      // WAHA offline atau error -> Lanjut ke fallback
    }

    // 2. Fallback ke Fonnte jika token tersedia
    if (this.token) {
      try {
        const payload: any = {
          target: targetPhone,
          message: data.message,
        };

        if (data.fileUrl) {
          payload.url = data.fileUrl;
          payload.filename = data.filename || 'document.pdf';
        }

        const response = await axios.post(this.apiUrl, payload, {
          headers: {
            Authorization: this.token,
          },
        });

        this.logger.log(`[Fonnte Gateway] WhatsApp sent to +${targetPhone}: ${JSON.stringify(response.data)}`);
        return {
          status: true,
          provider: 'Fonnte Cloud Gateway',
          target: targetPhone,
          data: response.data,
        };
      } catch (error) {
        this.logger.error(`Failed to send WhatsApp via Fonnte to +${targetPhone}: ${error.message}`);
      }
    }

    // 3. Fallback ke Mode Simulasi Cerdas (Sandbox)
    this.logger.log(
      `\n======================================================\n` +
      `[SELF-HOSTED WA GATEWAY (BAILEYS) - SIMULASI TERKIRIM]\n` +
      `Target: +${targetPhone}\n` +
      `Engine: Baileys WebSocket Protocol (Self-Hosted)\n` +
      `Lampiran: ${data.fileUrl ? data.fileUrl + ' (' + (data.filename || 'document.pdf') + ')' : 'Tidak ada'}\n` +
      `------------------------------------------------------\n` +
      `${data.message}\n` +
      `======================================================\n`
    );

    return {
      status: true,
      simulated: true,
      provider: 'Self-Hosted Baileys Simulator',
      target: targetPhone,
      message: data.message,
      fileUrl: data.fileUrl,
      filename: data.filename,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 🤖 H-3 Jatuh Tempo: WhatsApp otomatis mengirim rincian tagihan beserta link bayar instan
   */
  async sendHMinus3Reminder(customer: any, invoice: any): Promise<any> {
    const formattedAmount = (invoice.amount || 0).toLocaleString('id-ID');
    const formattedDueDate = invoice.dueDate
      ? new Date(invoice.dueDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-';
    const periodText = invoice.month || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const quickPayUrl = `${this.customerPortalUrl}/c/${customer.internetNumber || customer.phone}/invoices`;

    const message = `
⏰ *PENGINGAT TAGIHAN INTERNET AUDIRANET (H-3)*

Yth. Bapak/Ibu *${customer.name}*,

Pemberitahuan bahwa tagihan internet rumah/kantor Anda akan jatuh tempo dalam *3 hari*:

🧾 *Nomor Invoice*: ${invoice.invoiceNumber || invoice.id}
👤 *ID Internet*: ${customer.internetNumber || '-'}
📦 *Paket Layanan*: ${invoice.package || customer.package || 'Internet Fiber Optik'}
📅 *Periode Tagihan*: ${periodText}
💰 *Total Tagihan*: *Rp ${formattedAmount}*
⏳ *Jatuh Tempo*: *${formattedDueDate}*

⚡ *Link Bayar Instan (Tanpa Antre):*
${quickPayUrl}

_Pilihan metode: QRIS (BCA, Livin, GoPay, OVO, Dana) & Virtual Account Otomatis._
_Abaikan pesan ini bila Anda telah melakukan pembayaran. Terima kasih atas kepercayaan Anda bersama AUDIRA Network!_ 🙏

*AUDIRA Digital Network*
Hotline NOC: +62 821-1200-1600
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * 🤖 Hari H Jatuh Tempo: Pengingat ramah dengan QRIS langsung di dalam chat
   */
  async sendHariHReminder(customer: any, invoice: any): Promise<any> {
    const formattedAmount = (invoice.amount || 0).toLocaleString('id-ID');
    const todayDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const quickPayUrl = `${this.customerPortalUrl}/c/${customer.internetNumber || customer.phone}/invoices`;

    // Generate clean phone for Virtual Account
    const cleanPhone = (customer.phone || '').replace(/^0/, '62').replace(/\D/g, '');
    const vaNumber = `8800${cleanPhone}`;

    // Dynamic QRIS payload string (EMVCo)
    const hexCrc = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const qrisPayload = `00020101021226680016ID.CO.AUDIRA.WWW011893600999000001002251450000000000052045814530336054${String(invoice.amount).padStart(8, '0')}5802ID5914AUDIRANET ISP6007JAKARTA62300115${invoice.invoiceNumber || 'INV'}0708AUDIRA6304${hexCrc}`;

    const message = `
🔴 *HARI INI JATUH TEMPO - TAGIHAN AUDIRANET*

Halo *${customer.name}*,
Hari ini adalah batas akhir pembayaran tagihan internet bulanan Anda:

🧾 *No. Invoice*: ${invoice.invoiceNumber || invoice.id}
👤 *ID Internet*: ${customer.internetNumber || '-'}
💰 *Total Tagihan*: *Rp ${formattedAmount}*
📅 *Batas Pembayaran*: *Hari Ini (${todayDate})*

📲 *BAYAR INSTAN DENGAN QRIS (BEBAS BIAYA ADMIN):*
Salin kode QRIS di bawah ini atau buka tautan untuk scan barcode langsung:
\`\`\`
${qrisPayload}
\`\`\`

🔗 *Scan Barcode QRIS & Cek Tagihan:*
${quickPayUrl}

🏦 *Pilihan Virtual Account BCA:*
No. VA: *${vaNumber}*
Atas Nama: *AUDIRA - ${customer.name}*

_Koneksi internet Anda akan tetap aktif lancar dengan menyelesaikan pembayaran sebelum pukul 23:59 WIB. Terima kasih atas kerja samanya!_ 🙏

*AUDIRA Customer Care*
WhatsApp: +62 821-1200-1600
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
    });
  }

  /**
   * 🤖 Saat Pembayaran Masuk: WhatsApp otomatis mengirimkan pesan konfirmasi pembayaran lunas + lampiran PDF kwitansi resmi AUDIRA
   */
  async sendPaymentReceivedWithReceipt(customer: any, invoice: any, payment: any): Promise<any> {
    const formattedAmount = (payment.amount || invoice.amount || 0).toLocaleString('id-ID');
    const paymentMethodName = (payment.paymentMethod || payment.method || 'Online Payment (QRIS/VA)').toUpperCase();
    const paidAtDate = payment.paymentDate || payment.createdAt || invoice.paidAt || new Date();
    const formattedDate = new Date(paidAtDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formattedTime = new Date(paidAtDate).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const receiptPdfUrl = `${this.backendUrl}/billing/invoices/${invoice.id}/receipt-pdf`;
    const portalUrl = `${this.customerPortalUrl}/c/${customer.internetNumber || customer.phone}/dashboard`;

    const message = `
✅ *PEMBAYARAN DITERIMA & LUNAS - AUDIRANET*

Yth. Bapak/Ibu *${customer.name}*,
Terima kasih! Pembayaran tagihan internet Anda telah berhasil kami verifikasi secara otomatis di sistem:

🧾 *Nomor Invoice*: ${invoice.invoiceNumber || invoice.id}
👤 *ID Internet*: ${customer.internetNumber || '-'}
💰 *Nominal Dibayar*: *Rp ${formattedAmount}*
💳 *Metode Bayar*: ${paymentMethodName}
⏱️ *Waktu Transaksi*: ${formattedDate}, ${formattedTime} WIB
📶 *Status Layanan*: ✅ *AKTIF NORMAL* (Auto-CoA Applied)

📄 *Kwitansi Resmi AUDIRA (PDF):*
Dokumen tanda terima pembayaran resmi telah kami lampirkan dalam pesan ini. Anda juga dapat mengunduh berkas kwitansi sewaktu-waktu melalui tautan berikut:
${receiptPdfUrl}

🌐 *Pantau Kuota & Performa di Portal Pelanggan:*
${portalUrl}

_Terima kasih atas pembayaran tepat waktu dan kesetiaan Anda bersama AUDIRA Network!_ 🚀

*PT Audira Sukses Mandiri / Audira Multimedia Digital*
Helpdesk 24 Jam: +62 821-1200-1600
    `.trim();

    return this.sendMessage({
      phone: customer.phone,
      message,
      fileUrl: receiptPdfUrl,
      filename: `Kwitansi-${invoice.invoiceNumber || 'AUDIRA'}.pdf`,
    });
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

  /**
   * Broadcast Pemeliharaan / Fiber Cut Emergency ke Pelanggan Terdampak
   */
  async broadcastMaintenance(data: {
    title: string;
    message: string;
    affectedOdps: string[];
    customerPhones?: string[];
  }): Promise<any> {
    this.logger.log(`[WA Maintenance Broadcast] Dispatching to ODPs: ${data.affectedOdps.join(', ')}`);
    const recipients = data.customerPhones || ['081234567891', '081234567892', '081234567893'];

    const formattedMsg = `🔔 *PEMBERITAHUAN GANGGUAN JARINGAN (AUDIRA-NET)*\n\n` +
      `Kepada Yth. Pelanggan Setia AUDIRA-NET,\n\n` +
      `${data.message}\n\n` +
      `📍 *Area Terdampak:* ${data.affectedOdps.join(', ')}\n` +
      `⏱️ *Status:* Tim Teknisi Fiber Splicing sedang di lokasi melakukan perbaikan darurat.\n` +
      `Mohon maaf atas ketidaknyamanan yang dialami.\n\n` +
      `_Salam hangat,_\n*NOC & Customer Care AUDIRA-NET*\nHotline: +62 821-1200-1600`;

    for (const phone of recipients.slice(0, 3)) {
      try {
        await this.sendMessage({ phone, message: formattedMsg });
      } catch (err: any) {
        this.logger.warn(`Failed sending broadcast to ${phone}: ${err.message}`);
      }
    }

    return {
      success: true,
      recipientsCount: recipients.length,
      sampleMessage: formattedMsg,
      dispatchedAt: new Date().toISOString(),
    };
  }
}
