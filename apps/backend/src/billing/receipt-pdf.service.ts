import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit');


@Injectable()
export class ReceiptPdfService {
  private readonly logger = new Logger(ReceiptPdfService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Format number as Indonesian Rupiah (without Rp prefix)
   */
  private formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount || 0);
  }

  /**
   * Convert number to Indonesian Words (Terbilang)
   */
  private terbilang(n: number): string {
    const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    n = Math.floor(n);
    if (n < 12) return satuan[n];
    if (n < 20) return `${this.terbilang(n - 10)} Belas`;
    if (n < 100) return `${this.terbilang(Math.floor(n / 10))} Puluh ${this.terbilang(n % 10)}`.trim();
    if (n < 200) return `Seratus ${this.terbilang(n - 100)}`.trim();
    if (n < 1000) return `${this.terbilang(Math.floor(n / 100))} Ratus ${this.terbilang(n % 100)}`.trim();
    if (n < 2000) return `Seribu ${this.terbilang(n - 1000)}`.trim();
    if (n < 1000000) return `${this.terbilang(Math.floor(n / 1000))} Ribu ${this.terbilang(n % 1000)}`.trim();
    if (n < 1000000000) return `${this.terbilang(Math.floor(n / 1000000))} Juta ${this.terbilang(n % 1000000)}`.trim();
    return `${this.terbilang(Math.floor(n / 1000000000))} Miliar ${this.terbilang(n % 1000000000)}`.trim();
  }

  /**
   * Generate official PDF receipt buffer
   */
  async generateReceiptPdf(invoiceId: string): Promise<Buffer> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        OR: [
          { id: invoiceId },
          { invoiceNumber: invoiceId },
        ],
      },
      include: {
        customer: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice ${invoiceId} tidak ditemukan`);
    }

    const customer = invoice.customer;
    const payment = invoice.payments[0] || null;
    const receiptNumber = `KWT-${invoice.invoiceNumber.replace('INV-', '')}`;
    const paymentDate = payment?.paymentDate || invoice.paidAt || new Date();
    const formattedDate = new Date(paymentDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formattedTime = new Date(paymentDate).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40,
          info: {
            Title: `Kwitansi Pembayaran - ${receiptNumber}`,
            Author: 'Agus Dwi Rianto (AUDIRA)',
            Subject: 'Kwitansi Resmi Pembayaran Internet AUDIRANET',
            Keywords: 'AUDIRA, Kwitansi, Invoice, ISP, Internet Billing',
            Producer: 'AUDIRA Billing Engine v2.4',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header Background Bar (Cyberpunk / Modern ISP Theme)
        doc.rect(40, 40, 515, 65).fill('#0B132B');

        // Company Logo & Name
        doc.fillColor('#00E5FF').fontSize(18).font('Helvetica-Bold')
          .text('AUDIRA MULTIMEDIA DIGITAL', 55, 52);

        doc.fillColor('#A0AEC0').fontSize(8).font('Helvetica')
          .text('Internet Service Provider & Enterprise Connectivity Solutions', 55, 74)
          .text('License: Kominfo ISP & APJII Member • Website: https://audira.my.id • Hotline: +62 821-1200-1600', 55, 86);

        // Title Block
        doc.rect(40, 115, 515, 36).fill('#F0FDF4');
        doc.rect(40, 115, 515, 36).strokeColor('#10B981').lineWidth(1.5).stroke();

        doc.fillColor('#065F46').fontSize(13).font('Helvetica-Bold')
          .text('BUKTI PEMBAYARAN RESMI / OFFICIAL PAYMENT RECEIPT', 55, 126);

        // Stamp "LUNAS / VERIFIED"
        doc.rect(420, 121, 120, 24).fill('#10B981');
        doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold')
          .text('LUNAS / PAID', 420, 128, { width: 120, align: 'center' });

        // Meta Info Columns
        const metaTop = 165;
        // Left Column: Customer Info
        doc.fillColor('#4B5563').fontSize(8).font('Helvetica-Bold')
          .text('DITERIMA DARI (CUSTOMER):', 40, metaTop);

        doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold')
          .text(customer.name, 40, metaTop + 14);

        doc.fillColor('#4B5563').fontSize(8.5).font('Helvetica')
          .text(`ID Internet: ${customer.internetNumber || '-'}`, 40, metaTop + 29)
          .text(`No. WhatsApp: ${customer.phone}`, 40, metaTop + 42)
          .text(`Alamat: ${customer.address || 'Alamat terdaftar di sistem'}`, 40, metaTop + 55, { width: 230 });

        // Right Column: Receipt & Invoice Details
        const rightCol = 320;
        doc.fillColor('#4B5563').fontSize(8).font('Helvetica-Bold')
          .text('RINCIAN KWITANSI & TRANSAKSI:', rightCol, metaTop);

        doc.fontSize(8.5).font('Helvetica')
          .text('No. Kwitansi:', rightCol, metaTop + 14)
          .font('Helvetica-Bold').fillColor('#0F172A').text(receiptNumber, rightCol + 90, metaTop + 14)
          
          .font('Helvetica').fillColor('#4B5563').text('No. Invoice:', rightCol, metaTop + 28)
          .font('Helvetica-Bold').fillColor('#0F172A').text(invoice.invoiceNumber, rightCol + 90, metaTop + 28)

          .font('Helvetica').fillColor('#4B5563').text('Tanggal Bayar:', rightCol, metaTop + 42)
          .font('Helvetica-Bold').fillColor('#0F172A').text(`${formattedDate}, ${formattedTime} WIB`, rightCol + 90, metaTop + 42)

          .font('Helvetica').fillColor('#4B5563').text('Metode Bayar:', rightCol, metaTop + 56)
          .font('Helvetica-Bold').fillColor('#0F172A').text((payment?.paymentMethod || 'Online Payment').toUpperCase(), rightCol + 90, metaTop + 56)

          .font('Helvetica').fillColor('#4B5563').text('Status Transaksi:', rightCol, metaTop + 70)
          .font('Helvetica-Bold').fillColor('#059669').text('BERHASIL & TERVERIFIKASI', rightCol + 90, metaTop + 70);

        // Divider
        doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(40, 260).lineTo(555, 260).stroke();

        // Table Header
        const tableTop = 275;
        doc.rect(40, tableTop, 515, 24).fill('#0F172A');

        doc.fillColor('#FFFFFF').fontSize(8.5).font('Helvetica-Bold')
          .text('NO', 50, tableTop + 7)
          .text('DESKRIPSI LAYANAN / PRODUK', 80, tableTop + 7)
          .text('PERIODE', 330, tableTop + 7)
          .text('JUMLAH (IDR)', 450, tableTop + 7, { width: 95, align: 'right' });

        // Table Row
        const rowTop = tableTop + 24;
        doc.rect(40, rowTop, 515, 34).fill('#F8FAFC');
        doc.rect(40, rowTop, 515, 34).strokeColor('#E2E8F0').lineWidth(0.5).stroke();

        const serviceDesc = invoice.description || 'Langganan Internet Fiber Optik Berkecepatan Tinggi (Unlimited FUP)';
        const periodText = invoice.month || formattedDate;

        doc.fillColor('#1E293B').fontSize(8.5).font('Helvetica')
          .text('1.', 50, rowTop + 10)
          .font('Helvetica-Bold').text(serviceDesc, 80, rowTop + 10, { width: 240 })
          .font('Helvetica').text(periodText, 330, rowTop + 10)
          .font('Helvetica-Bold').fillColor('#0F172A')
          .text(`Rp ${this.formatRupiah(invoice.amount)}`, 450, rowTop + 10, { width: 95, align: 'right' });

        // Total Section
        const totalTop = rowTop + 45;
        doc.rect(300, totalTop, 255, 65).fill('#F1F5F9');
        doc.rect(300, totalTop, 255, 65).strokeColor('#CBD5E1').lineWidth(1).stroke();

        doc.fillColor('#475569').fontSize(8.5).font('Helvetica')
          .text('Subtotal:', 315, totalTop + 10)
          .text(`Rp ${this.formatRupiah(invoice.amount)}`, 450, totalTop + 10, { width: 95, align: 'right' })

          .text('PPN (11%):', 315, totalTop + 24)
          .text('Termasuk (Included)', 430, totalTop + 24, { width: 115, align: 'right' });

        doc.strokeColor('#94A3B8').lineWidth(0.5).moveTo(315, totalTop + 38).lineTo(545, totalTop + 38).stroke();

        doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
          .text('TOTAL LUNAS:', 315, totalTop + 45)
          .fillColor('#059669')
          .text(`Rp ${this.formatRupiah(invoice.amount)}`, 430, totalTop + 45, { width: 115, align: 'right' });

        // Terbilang Block (Left side)
        doc.rect(40, totalTop, 245, 65).fill('#F8FAFC');
        doc.rect(40, totalTop, 245, 65).strokeColor('#E2E8F0').lineWidth(0.5).stroke();

        doc.fillColor('#64748B').fontSize(7.5).font('Helvetica-Bold')
          .text('JUMLAH TERBILANG:', 50, totalTop + 10);

        const terbilangWords = `${this.terbilang(invoice.amount)} Rupiah`;
        doc.fillColor('#0F172A').fontSize(8.5).font('Helvetica-Oblique')
          .text(`"${terbilangWords}"`, 50, totalTop + 25, { width: 225 });

        // Digital Security Seal & Verification Notice
        const sealTop = 450;
        doc.rect(40, sealTop, 515, 68).fill('#F0FDF4');
        doc.rect(40, sealTop, 515, 68).strokeColor('#86EFAC').lineWidth(1).stroke();

        doc.fillColor('#166534').fontSize(8.5).font('Helvetica-Bold')
          .text('SEAL KEAMANAN & VERIFIKASI DIGITAL AUDIRA', 55, sealTop + 10);

        doc.fillColor('#15803D').fontSize(7.5).font('Helvetica')
          .text('• Dokumen ini merupakan bukti pembayaran resmi yang sah diterbitkan oleh Sistem Billing Otomatis AUDIRA.', 55, sealTop + 24)
          .text('• Keabsahan dokumen ini dapat diverifikasi melalui Portal Pelanggan resmi AUDIRA di https://audira.my.id.', 55, sealTop + 36)
          .text('• Sesuai UU ITE No. 11/2008 Pasal 5 Ayat 1, tanda terima digital ini memiliki kekuatan hukum yang sah tanpa tanda tangan basah.', 55, sealTop + 48);

        // Signatures / Authority
        const sigTop = 535;
        doc.fillColor('#64748B').fontSize(8).font('Helvetica')
          .text('Diterbitkan Otomatis Oleh:', 40, sigTop)
          .font('Helvetica-Bold').fillColor('#0F172A').text('AUDIRA Billing System Engine v2.4', 40, sigTop + 12)
          .font('Helvetica').fillColor('#64748B').text('PT Audira Sukses Mandiri / Audira Multimedia Digital', 40, sigTop + 24);

        doc.fillColor('#64748B').fontSize(8).font('Helvetica')
          .text('Otorisasi Keuangan:', 370, sigTop)
          .font('Helvetica-Bold').fillColor('#0F172A').text('Agus Dwi Rianto', 370, sigTop + 12)
          .font('Helvetica').fillColor('#64748B').text('Managing Director & Founder', 370, sigTop + 24);

        // Page Bottom Footer
        doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(40, 780).lineTo(555, 780).stroke();
        doc.fillColor('#94A3B8').fontSize(7).font('Helvetica')
          .text(`© 2026 AUDIRA Network & Billing. Hak Cipta Dilindungi Undang-Undang. ID: ${invoice.id}`, 40, 790)
          .text('Dokumen Resmi • Generated Real-Time', 430, 790, { width: 125, align: 'right' });

        doc.end();
      } catch (err) {
        this.logger.error(`Gagal membuat PDF Kwitansi untuk invoice ${invoiceId}:`, err.message);
        reject(err);
      }
    });
  }
}
