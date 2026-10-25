import { Controller, Post, Body, UnauthorizedException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CustomerLoginDto } from './dto/customer-login.dto';

export interface RegisterOrderDto {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  address: string;
  packageId?: string;
  packageName?: string;
  price?: number;
  speed?: number;
  notes?: string;
  paymentMethod?: string;
}

import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Controller('auth')
export class CustomerAuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private whatsappService: WhatsAppService,
  ) {}

  @Post(['customer/login', 'login/customer'])
  @HttpCode(HttpStatus.CREATED)
  async customerLogin(@Body() loginDto: CustomerLoginDto) {
    const identifier = (loginDto.email || '').trim();

    // Find customer by email, phone, id, or internetNumber
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { id: identifier },
          { internetNumber: identifier },
        ],
      },
      include: {
        packages: true,
      },
    });

    if (!customer) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Check if customer has password
    if (!customer.password) {
      throw new UnauthorizedException('Akun belum memiliki password. Silakan hubungi admin.');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, customer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Ensure customer has an internetNumber
    let activeCustomer = customer;
    if (!customer.internetNumber) {
      const generated = 'NET-' + Math.floor(100000 + Math.random() * 900000);
      activeCustomer = await this.prisma.customer.update({
        where: { id: customer.id },
        data: { internetNumber: generated },
        include: { packages: true },
      });
    }

    // Generate JWT token
    const payload = { 
      email: activeCustomer.email, 
      sub: activeCustomer.id, 
      type: 'customer',
      name: activeCustomer.name,
      internetNumber: activeCustomer.internetNumber,
    };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...result } = activeCustomer;

    return {
      message: 'Login berhasil',
      access_token: token,
      customer: result,
    };
  }

  /**
   * POST /auth/customer/register-order
   * Online registration with auto customer creation, package link, first invoice, installation ticket, & QRIS
   */
  @Post(['customer/register-order', 'register/order'])
  @HttpCode(HttpStatus.CREATED)
  async registerOrder(@Body() body: RegisterOrderDto) {
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const address = (body.address || '').trim();

    if (!name || !phone || !address) {
      throw new BadRequestException('Nama lengkap, nomor telepon, dan alamat wajib diisi');
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const email = (body.email || '').trim().toLowerCase() || `pelanggan.${cleanPhone}@audiranet.id`;
    const rawPassword = body.password?.trim() || 'Audira@123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const internetNumber = 'NET-' + Math.floor(100000 + Math.random() * 900000);

    // 1. Find or create customer
    let customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { phone: phone },
          { email: email },
        ],
      },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          name,
          phone,
          email,
          address,
          password: hashedPassword,
          internetNumber,
          status: 'pending_installation',
        },
      });
    } else {
      customer = await this.prisma.customer.update({
        where: { id: customer.id },
        data: {
          name,
          address,
          status: 'pending_installation',
          ...(!customer.password ? { password: hashedPassword } : {}),
          ...(!customer.internetNumber ? { internetNumber } : {}),
        },
      });
    }

    // 2. Package association
    const packageName = body.packageName || 'Gamer Ultra 50 Mbps';
    const amount = body.price && body.price > 0 ? body.price : 285000;
    const speed = body.speed ? `${body.speed} Mbps` : '50 Mbps';

    try {
      await this.prisma.package.create({
        data: {
          name: packageName,
          price: amount,
          speed: speed,
          description: `Paket Berlangganan ${packageName}`,
          status: 'active',
          customerId: customer.id,
        },
      });
    } catch {}

    // 3. Create initial registration invoice
    const yearMonth = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const invoiceNumber = `INV-${yearMonth}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        amount,
        dueDate,
        status: 'PENDING',
        description: `Biaya Pasang Baru & Langganan Bulan Pertama - ${packageName}`,
        month: new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
        customerId: customer.id,
      },
    });

    // 4. Create field installation ticket for technicians
    const ticketNumber = `TKT-INST-${Date.now().toString().slice(-6)}`;
    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber,
        title: `Instalasi Baru: ${customer.name} (${customer.internetNumber}) - ${packageName}`,
        description: `Alamat: ${customer.address}\nWhatsApp: ${customer.phone}\nPaket: ${packageName}\nCatatan: ${body.notes || 'Pendaftaran online mandiri via Web Portal'}`,
        priority: 'high',
        status: 'open',
        customerId: customer.id,
      },
    });

    // 5. Generate QRIS dynamic payload string (EMVCo standard structure) & VA
    const hexCrc = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const qrisString = `00020101021226680016ID.CO.AUDIRA.WWW011893600999000001002251450000000000052045814530336054${String(amount).padStart(8, '0')}5802ID5914AUDIRANET ISP6007JAKARTA62300115${invoice.invoiceNumber}0708AUDIRA6304${hexCrc}`;
    const vaNumber = `8800${cleanPhone.startsWith('62') ? cleanPhone : '62' + cleanPhone.replace(/^0/, '')}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 6. Generate JWT token so client can immediately access portal
    const payload = { 
      email: customer.email, 
      sub: customer.id, 
      type: 'customer',
      name: customer.name,
      internetNumber: customer.internetNumber,
    };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Pendaftaran pasang baru berhasil dibuat',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        internetNumber: customer.internetNumber,
        address: customer.address,
      },
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        status: invoice.status,
      },
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
      },
      payment: {
        method: body.paymentMethod || 'qris',
        qrisString,
        vaNumber,
        amount,
        expiresAt,
      },
      access_token: token,
    };
  }

  /**
   * POST /auth/customer/confirm-payment
   * Confirm payment, mark invoice PAID, create Payment record, activate customer
   */
  @Post(['customer/confirm-payment', 'order/confirm-payment'])
  @HttpCode(HttpStatus.OK)
  async confirmPayment(@Body() body: { invoiceId: string; paymentMethod?: string }) {
    if (!body.invoiceId) {
      throw new BadRequestException('Invoice ID wajib dikirim');
    }

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        OR: [
          { id: body.invoiceId },
          { invoiceNumber: body.invoiceId },
        ],
      },
      include: { customer: true },
    });

    if (!invoice) {
      throw new BadRequestException('Invoice tidak ditemukan');
    }

    if (invoice.status === 'PAID') {
      return {
        success: true,
        message: 'Invoice ini sudah lunas sebelumnya',
        invoice,
      };
    }

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.amount,
        paymentMethod: body.paymentMethod || 'qris',
        status: 'success',
        description: `Pembayaran online registrasi pasang baru (${body.paymentMethod || 'qris'})`,
      },
    });

    await this.prisma.customer.update({
      where: { id: invoice.customerId },
      data: { status: 'active' },
    });

    // 🤖 Kirim WhatsApp otomatis konfirmasi lunas + lampiran PDF kwitansi resmi AUDIRA
    try {
      await this.whatsappService.sendPaymentReceivedWithReceipt(invoice.customer, updatedInvoice, payment);
    } catch (waErr: any) {
      console.warn('Gagal mengirim WhatsApp konfirmasi kwitansi:', waErr.message);
    }

    return {
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi! Akun internet Anda telah aktif.',
      invoice: updatedInvoice,
      payment,
    };
  }
}
