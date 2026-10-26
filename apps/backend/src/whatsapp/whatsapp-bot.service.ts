import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from './whatsapp.service';
import { GenieacsService } from '../genieacs/genieacs.service';

@Injectable()
export class WhatsAppBotService {
  private readonly logger = new Logger(WhatsAppBotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
    private readonly genieacsService: GenieacsService,
  ) {}

  /**
   * Handle incoming WhatsApp message webhook from Fonnte
   */
  async handleIncomingMessage(sender: string, rawMessage: string, senderName?: string): Promise<any> {
    try {
      if (!sender || !rawMessage) {
        return { success: false, message: 'Invalid payload: sender or message missing' };
      }

      const cleanSender = sender.replace(/\D/g, ''); // Extract only digits
      const text = rawMessage.trim();
      const upperText = text.toUpperCase();

      this.logger.log(`[WhatsApp Bot] Incoming chat from ${cleanSender}: "${text}"`);

      // 1. Identify customer by phone
      const customer = await this.findCustomerByPhone(cleanSender);

      if (!customer) {
        // Unknown user response
        const unregisteredReply = 
          `Halo! 👋\n` +
          `Terima kasih telah menghubungi *AUDIRA Digital Network*.\n\n` +
          `Nomor WhatsApp Anda (*${cleanSender}*) belum terdaftar sebagai pelanggan internet aktif di sistem kami.\n\n` +
          `🌐 *Pendaftaran Pasang Baru*:\n` +
          `Kunjungi website resmi kami di https://audira.my.id atau hubungi hotline tim sales kami di *+62 821-1200-1600*.\n\n` +
          `_AUDIRA Multimedia Digital - Internet Cepat & Terpercaya_`;

        await this.whatsappService.sendMessage({ phone: cleanSender, message: unregisteredReply });
        return { success: true, match: 'UNREGISTERED_USER' };
      }

      // 2. State & Keyword Routing for Registered Customer
      if (upperText === '1' || upperText.includes('TAGIHAN') || upperText.includes('BAYAR') || upperText.includes('INVOICE') || upperText.includes('!TAGIHAN')) {
        await this.handleCheckInvoice(cleanSender, customer);
        return { success: true, match: 'MENU_INVOICE' };
      }

      if (upperText === '2' || upperText.includes('STATUS') || upperText.includes('REDAMAN') || upperText.includes('SIGNAL') || upperText.includes('KONEKSI') || upperText.includes('!CEK') || upperText.includes('!CEKSINYAL') || upperText.includes('!CEKMODEM') || upperText.includes('!SINYAL')) {
        await this.handleCheckStatusAndOptical(cleanSender, customer);
        return { success: true, match: 'MENU_STATUS_OPTICAL' };
      }

      if (upperText === '3' || upperText.includes('RESTART') || upperText.includes('REBOOT') || upperText.includes('!REBOOT')) {
        await this.handleRebootONT(cleanSender, customer);
        return { success: true, match: 'MENU_REBOOT_ONT' };
      }

      if (upperText.startsWith('GANTIWIFI#') || upperText === '4' || upperText.includes('WIFI') || upperText.includes('SANDI')) {
        await this.handleWifiConfig(cleanSender, customer, text);
        return { success: true, match: 'MENU_WIFI_CONFIG' };
      }

      if (upperText === '0' || upperText.includes('CS') || upperText.includes('BANTUAN') || upperText.includes('ADMIN') || upperText.includes('OPERATOR')) {
        await this.handleConnectCS(cleanSender, customer);
        return { success: true, match: 'MENU_CS' };
      }

      // Default Menu Response
      await this.sendMainMenu(cleanSender, customer);
      return { success: true, match: 'MAIN_MENU' };
    } catch (error: any) {
      this.logger.error(`[WhatsApp Bot] Error handling chat from ${sender}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cari customer berdasarkan nomor HP dengan berbagai variasi format (08xxx, 628xxx, +628xxx)
   */
  private async findCustomerByPhone(cleanSender: string) {
    let variants: string[] = [cleanSender];

    if (cleanSender.startsWith('62')) {
      variants.push('0' + cleanSender.slice(2));
      variants.push('+' + cleanSender);
    } else if (cleanSender.startsWith('0')) {
      variants.push('62' + cleanSender.slice(1));
      variants.push('+62' + cleanSender.slice(1));
    }

    const customer = await this.prisma.customer.findFirst({
      where: {
        phone: { in: variants },
      },
    });

    return customer;
  }

  /**
   * Menu 1: Cek Tagihan & Link Bayar QRIS Instan
   */
  private async handleCheckInvoice(phone: string, customer: any) {
    const unpaidInvoices = await this.prisma.invoice.findMany({
      where: {
        customerId: customer.id,
        status: { in: ['PENDING', 'OVERDUE'] },
      },
      orderBy: { dueDate: 'asc' },
    });

    if (!unpaidInvoices || unpaidInvoices.length === 0) {
      const msg = 
        `✅ *STATUS TAGIHAN ANDA: LUNAS*\n\n` +
        `Yth. *${customer.name}* (No. Internet: ${customer.internetNumber || '-'})\n\n` +
        `Saat ini Anda *tidak memiliki tagihan menunggak*. Layanan internet Anda aktif normal tanpa kendala.\n\n` +
        `Terima kasih telah menjadi pelanggan setia AUDIRA Digital Network! 🙏\n\n` +
        `_Ketik *MENU* untuk menampilkan pilihan lainnya._`;

      await this.whatsappService.sendMessage({ phone, message: msg });
      return;
    }

    const inv = unpaidInvoices[0];
    const dueDateStr = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    const amountStr = (inv.amount || 0).toLocaleString('id-ID');
    const paymentUrl = `${process.env.PAYMENT_URL || 'http://localhost:3217/payment'}?invoice=${inv.id}`;

    const msg = 
      `🧾 *TAGIHAN INTERNET AUDIRA-NET*\n\n` +
      `Pelanggan: *${customer.name}*\n` +
      `No. Internet: *${customer.internetNumber || '-'}*\n` +
      `No. Invoice: *${inv.invoiceNumber}*\n` +
      `Periode: *${inv.month || 'Bulan Berjalan'}*\n` +
      `Total Tagihan: *Rp ${amountStr}*\n` +
      `Jatuh Tempo: *${dueDateStr}*\n` +
      `Status: *⏳ BELUM LUNAS*\n\n` +
      `💳 *Bayar Sekarang (QRIS / VA / Alfa)*:\n` +
      `👉 ${paymentUrl}\n\n` +
      `💡 *Bayar, Langsung Nyala*: Setelah Anda membayar, sistem otomatis mengaktifkan internet dalam 3-5 detik tanpa perlu konfirmasi manual.\n\n` +
      `_Ketik *MENU* untuk kembali._`;

    await this.whatsappService.sendMessage({ phone, message: msg });
  }

  /**
   * Menu 2: Cek Kesehatan Internet & Redaman Optik (dBm) via GenieACS
   */
  private async handleCheckStatusAndOptical(phone: string, customer: any) {
    const ontId = customer.modemSerial || customer.internetNumber || 'demo-ont-01';
    const optical = await this.genieacsService.getOpticalPower(ontId);

    const isGood = optical.status === 'GOOD';
    const indicatorEmoji = isGood ? '🟢' : optical.status === 'WARN' ? '🟡' : '🔴';

    const msg = 
      `📊 *STATUS KONEKSI & TELEMETRI MODEM*\n\n` +
      `Pelanggan: *${customer.name}*\n` +
      `No. Internet: *${customer.internetNumber || '-'}*\n` +
      `Perangkat: *${customer.installedModem || 'Huawei / ZTE GPON ONT'}*\n\n` +
      `Status Jaringan: ${indicatorEmoji} *${customer.status === 'active' ? 'ONLINE (AKTIF)' : 'SUSPENDED'}*\n` +
      `Redaman Optik (RX Power): *${optical.rxPower} dBm*\n` +
      `Kondisi Redaman: *${optical.statusLabel}*\n` +
      `Suhu Modem: *${optical.temperature}*\n` +
      `Tegangan: *${optical.voltage}*\n\n` +
      `💡 *Penjelasan*: Redaman optik ideal ISP berada di rentang -15 dBm s/d -24 dBm. Koneksi Anda terpantau ${optical.statusLabel.toLowerCase()}.\n\n` +
      `Ketik *3* jika Anda ingin me-restart modem dari jauh.\n` +
      `_Ketik *MENU* untuk kembali._`;

    await this.whatsappService.sendMessage({ phone, message: msg });
  }

  /**
   * Menu 3: Restart / Reboot Modem Jarak Jauh via TR-069
   */
  private async handleRebootONT(phone: string, customer: any) {
    const ontId = customer.modemSerial || customer.internetNumber || 'demo-ont-01';
    await this.genieacsService.rebootDevice(ontId);

    const msg = 
      `🔄 *PERINTAH REBOOT MODEM DIKIRIM*\n\n` +
      `Halo *${customer.name}*,\n` +
      `Sinyal restart TR-069 telah berhasil kami kirimkan ke modem ONT di rumah Anda.\n\n` +
      `Modem akan mati dan menyala kembali secara otomatis dalam 1–2 menit. Mohon pastikan kabel daya listrik modem tidak dicabut saat proses ini berlangsung.\n\n` +
      `Semoga koneksi internet Anda kembali lancar dan segar! 🚀\n\n` +
      `_Ketik *MENU* untuk kembali._`;

    await this.whatsappService.sendMessage({ phone, message: msg });
  }

  /**
   * Menu 4: Ganti Nama (SSID) & Sandi WiFi Mandiri
   */
  private async handleWifiConfig(phone: string, customer: any, rawText: string) {
    if (rawText.toUpperCase().startsWith('GANTIWIFI#')) {
      const parts = rawText.split('#');
      if (parts.length < 3) {
        const errorMsg = 
          `⚠️ *FORMAT SALAH*\n\n` +
          `Format yang benar adalah:\n` +
          `*GANTIWIFI#NamaWiFiBaru#SandiBaru*\n\n` +
          `Contoh:\n` +
          `*GANTIWIFI#AUDIRA-${customer.name.split(' ')[0]}#rahasia1234*`;
        await this.whatsappService.sendMessage({ phone, message: errorMsg });
        return;
      }

      const newSsid = parts[1].trim();
      const newPassword = parts[2].trim();

      if (newPassword.length < 8) {
        const passLenMsg = 
          `⚠️ *KATA SANDI KURANG PANJANG*\n\n` +
          `Kata sandi WiFi minimal harus *8 karakter* demi keamanan jaringan Anda.\n` +
          `Silakan ulangi kembali dengan format: *GANTIWIFI#NamaWiFi#SandiMin8Huruf*`;
        await this.whatsappService.sendMessage({ phone, message: passLenMsg });
        return;
      }

      const ontId = customer.modemSerial || customer.internetNumber || 'demo-ont-01';
      await this.genieacsService.updateWifi(ontId, {
        ssid24: newSsid,
        password24: newPassword,
        ssid5: `${newSsid}-5G`,
        password5: newPassword,
      });

      const successMsg = 
        `✅ *PENGATURAN WIFI BERHASIL DIPERBARUI!*\n\n` +
        `Yth. *${customer.name}*,\n` +
        `Nama WiFi (SSID): *${newSsid}* & *${newSsid}-5G*\n` +
        `Kata Sandi Baru: *${newPassword}*\n\n` +
        `Perubahan telah dikirimkan ke modem ONT Anda. Modem sedang memperbarui konfigurasi. Silakan sambungkan kembali HP dan laptop Anda menggunakan sandi baru tersebut. 🎉\n\n` +
        `_Ketik *MENU* untuk kembali._`;

      await this.whatsappService.sendMessage({ phone, message: successMsg });
      return;
    }

    // Default petunjuk cara ganti sandi
    const guideMsg = 
      `📶 *GANTI NAMA & KATA SANDI WIFI MANDIRI*\n\n` +
      `Anda dapat mengubah nama WiFi (SSID) dan kata sandi langsung dari WhatsApp ini tanpa perlu menunggu teknisi datang ke rumah.\n\n` +
      `Balas pesan ini dengan format:\n` +
      `👉 *GANTIWIFI#NamaWiFiBaru#SandiBaru*\n\n` +
      `Contoh:\n` +
      `*GANTIWIFI#AUDIRA-${customer.name.split(' ')[0]}#bismillah123*\n\n` +
      `⚠️ *Catatan*: Kata sandi minimal 8 karakter. Modem dual-band (2.4G & 5G) akan otomatis terkonfigurasi serentak.\n\n` +
      `_Ketik *MENU* untuk kembali._`;

    await this.whatsappService.sendMessage({ phone, message: guideMsg });
  }

  /**
   * Menu 0: Teruskan ke Petugas CS Manusia
   */
  private async handleConnectCS(phone: string, customer: any) {
    const csMsg = 
      `👨‍💼 *TERHUBUNG KE CUSTOMER CARE AUDIRA*\n\n` +
      `Halo *${customer.name}*,\n` +
      `Permintaan Anda telah kami teruskan ke meja kerja Admin & Tim Helpdesk AUDIRA.\n\n` +
      `Petugas kami akan segera menghubungi atau membalas pesan Anda di nomor ini.\n` +
      `Untuk kondisi mendesak, silakan hubungi hotline langsung kami:\n` +
      `📞 *Hotline*: +62 821-1200-1600\n` +
      `📧 *Email*: support@audira.my.id\n\n` +
      `Terima kasih! 🙏`;

    await this.whatsappService.sendMessage({ phone, message: csMsg });
  }

  /**
   * Menu Utama Virtual Assistant
   */
  private async sendMainMenu(phone: string, customer: any) {
    const menuMsg = 
      `🤖 *AUDIRA VIRTUAL ASSISTANT (24/7)*\n\n` +
      `Halo *${customer.name}*! 👋\n` +
      `Selamat datang di layanan mandiri otomatis *AUDIRA Digital Network*.\n\n` +
      `Silakan ketik nomor pilihan Anda atau gunakan perintah cepat:\n\n` +
      `1️⃣ *Cek Tagihan & Bayar QRIS* (Ketik: *1* atau *!tagihan*)\n` +
      `2️⃣ *Cek Status Internet & Redaman dBm* (Ketik: *2* atau *!ceksinyal*)\n` +
      `3️⃣ *Restart / Reboot Modem TR-069* (Ketik: *3* atau *!reboot*)\n` +
      `4️⃣ *Ganti Nama & Kata Sandi WiFi* (Ketik: *4* atau *wifi*)\n` +
      `0️⃣ *Hubungkan ke Petugas CS / NOC* (Ketik: *0* atau *cs*)\n\n` +
      `_Balas dengan angka *1* - *4*, *0*, atau ketik perintah *!ceksinyal* / *!reboot*_`;

    await this.whatsappService.sendMessage({ phone, message: menuMsg });
  }
}
