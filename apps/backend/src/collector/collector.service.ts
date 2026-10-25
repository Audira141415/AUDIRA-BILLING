import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from '../billing/billing.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  /**
   * Dapatkan shift kolektor yang aktif hari ini atau buat shift baru jika belum ada
   */
  async getActiveShift(collectorId: string, collectorName = 'Petugas Kolektor') {
    let shift = await this.prisma.collectorShift.findFirst({
      where: {
        collectorId,
        isHandedOver: false,
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!shift) {
      shift = await this.prisma.collectorShift.create({
        data: {
          collectorId,
          collectorName,
          totalCollected: 0,
          isHandedOver: false,
        },
        include: {
          payments: true,
        },
      });
      this.logger.log(`Created new collector shift for ${collectorName} (${collectorId})`);
    }

    return shift;
  }

  /**
   * Daftar tagihan yang belum lunas / overdue (rute penagihan door-to-door)
   */
  async getDueInvoices(search?: string) {
    const where: any = {
      status: { in: ['PENDING', 'OVERDUE'] },
    };

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { address: { contains: search, mode: 'insensitive' } } },
        { customer: { internetNumber: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true,
            internetNumber: true,
            status: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Penerimaan Pembayaran Tunai di Rumah Pelanggan (Door-to-Door)
   */
  async collectCashPayment(data: {
    invoiceId: string;
    collectorId: string;
    collectorName?: string;
    amountPaid: number;
    notes?: string;
  }) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { customer: true },
    });

    if (!invoice) {
      throw new Error('Invoice tidak ditemukan');
    }

    if (invoice.status === 'PAID') {
      throw new Error('Invoice ini sudah lunas sebelumnya');
    }

    // 1. Ambil atau inisialisasi shift aktif kolektor
    const shift = await this.getActiveShift(data.collectorId, data.collectorName || 'Kolektor Lapangan');

    const paidAt = new Date();
    const amount = Number(data.amountPaid) || invoice.amount;

    // 2. Tandai Invoice Lunas
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'PAID',
        paidAt,
      },
    });

    // 3. Catat Transaksi Pembayaran Kas Kolektor
    const transaction = await this.prisma.transaction.create({
      data: {
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        amount,
        type: 'payment',
        method: 'CASH_COLLECTOR',
        status: 'success',
        description: `Bayar Tunai ke ${shift.collectorName} (${invoice.invoiceNumber})`,
        collectorShiftId: shift.id,
      },
    });

    // 4. Update akumulasi kas fisik pada shift kolektor
    const updatedShift = await this.prisma.collectorShift.update({
      where: { id: shift.id },
      data: {
        totalCollected: { increment: amount },
      },
    });

    // 5. Auto Unsuspend & Kirim CoA jika pelanggan sebelumnya terisolir!
    if (invoice.customer?.status === 'suspended') {
      try {
        await this.billingService.unsuspendService(invoice.customerId);
        this.logger.log(`[Collector CoA] Layanan ${invoice.customer.name} otomatis di-unblock.`);
      } catch (unsuspendErr: any) {
        this.logger.warn(`Gagal unsuspend via kolektor: ${unsuspendErr.message}`);
      }
    }

    // 6. Kirim Struk Digital Tanda Terima via WhatsApp detik itu juga
    try {
      const receiptMsg = 
        `🧾 *BUKTI PEMBAYARAN TUNAI (LUNAS)*\n\n` +
        `Yth. *${invoice.customer.name}*,\n` +
        `Terima kasih! Pembayaran internet Anda telah diterima tunai oleh petugas kolektor kami:\n\n` +
        `No. Invoice: *${invoice.invoiceNumber}*\n` +
        `Nomor Internet: *${invoice.customer.internetNumber || '-'}*\n` +
        `Jumlah Bayar: *Rp ${amount.toLocaleString('id-ID')}*\n` +
        `Metode: *Tunai (Kolektor Lapangan)*\n` +
        `Petugas: *${shift.collectorName}*\n` +
        `Tanggal: *${paidAt.toLocaleString('id-ID')} WIB*\n` +
        `Status Layanan: 🟢 *AKTIF NORMAL*\n\n` +
        `Simpan pesan WhatsApp ini sebagai bukti pembayaran sah.\n\n` +
        `_AUDIRA Digital Network_`;

      await this.whatsappService.sendMessage({
        phone: invoice.customer.phone,
        message: receiptMsg,
      });
    } catch (waErr: any) {
      this.logger.warn(`Gagal kirim WA Struk Kolektor: ${waErr.message}`);
    }

    return {
      success: true,
      message: `Pembayaran Rp ${amount.toLocaleString('id-ID')} berhasil diterima oleh ${shift.collectorName}`,
      receipt: {
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customer.name,
        internetNumber: invoice.customer.internetNumber,
        amount,
        collectorName: shift.collectorName,
        paidAt,
      },
      shift: updatedShift,
      transaction,
    };
  }

  /**
   * Serah Terima Kas Kolektor ke Bendahara / Kasir Kantor (Tutup Shift)
   */
  async handoverShiftCash(shiftId: string, notes?: string) {
    const shift = await this.prisma.collectorShift.findUnique({
      where: { id: shiftId },
      include: { payments: true },
    });

    if (!shift) {
      throw new Error('Shift tidak ditemukan');
    }

    if (shift.isHandedOver) {
      throw new Error('Shift ini sudah diserahterimakan sebelumnya');
    }

    const updated = await this.prisma.collectorShift.update({
      where: { id: shiftId },
      data: {
        isHandedOver: true,
        handedOverAt: new Date(),
        handoverNotes: notes || `Serah terima kas tunai Rp ${shift.totalCollected.toLocaleString('id-ID')}`,
      },
    });

    this.logger.log(`[Kasir Kantor] Kas tunai shift ${shiftId} sebesar Rp ${shift.totalCollected} telah diverifikasi dan disetorkan.`);

    return {
      success: true,
      message: `Serah terima kas sebesar Rp ${shift.totalCollected.toLocaleString('id-ID')} berhasil diverifikasi. Shift ditutup.`,
      shift: updated,
    };
  }

  /**
   * Statistik Rekonsiliasi Kas Kolektor
   */
  async getCollectorStats(collectorId?: string) {
    const where: any = {};
    if (collectorId) where.collectorId = collectorId;

    const shifts = await this.prisma.collectorShift.findMany({ where });

    const totalCollectedAllTime = shifts.reduce((sum, s) => sum + s.totalCollected, 0);
    const unhandedCash = shifts
      .filter((s) => !s.isHandedOver)
      .reduce((sum, s) => sum + s.totalCollected, 0);

    const openShiftsCount = shifts.filter((s) => !s.isHandedOver).length;

    return {
      totalCollectedAllTime,
      unhandedCash,
      openShiftsCount,
      totalShifts: shifts.length,
    };
  }
}
