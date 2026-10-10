import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async loadTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(__dirname, '..', '..', 'templates', 'email', `${templateName}.hbs`);
    
    try {
      const templateFile = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateFile);
      return template(data);
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error);
      // Fallback to simple text
      return this.getSimpleTemplate(templateName, data);
    }
  }

  private getSimpleTemplate(templateName: string, data: any): string {
    switch (templateName) {
      case 'invoice':
        return `
          <h2>Invoice Tagihan</h2>
          <p>Halo ${data.customerName},</p>
          <p>Invoice untuk bulan ${data.period} telah dibuat:</p>
          <ul>
            <li>Nomor Invoice: ${data.invoiceNumber}</li>
            <li>Jumlah: Rp ${data.amount.toLocaleString('id-ID')}</li>
            <li>Jatuh Tempo: ${data.dueDate}</li>
          </ul>
          <p>Silakan lakukan pembayaran sebelum tanggal jatuh tempo.</p>
          <p>Terima kasih,<br/>AudiraNET</p>
        `;
      case 'payment-confirmation':
        return `
          <h2>Konfirmasi Pembayaran</h2>
          <p>Halo ${data.customerName},</p>
          <p>Pembayaran Anda telah kami terima:</p>
          <ul>
            <li>Invoice: ${data.invoiceNumber}</li>
            <li>Jumlah: Rp ${data.amount.toLocaleString('id-ID')}</li>
            <li>Tanggal: ${data.paymentDate}</li>
            <li>Metode: ${data.paymentMethod}</li>
          </ul>
          <p>Terima kasih atas pembayaran Anda!</p>
          <p>Salam,<br/>AudiraNET</p>
        `;
      case 'payment-reminder':
        return `
          <h2>Pengingat Pembayaran</h2>
          <p>Halo ${data.customerName},</p>
          <p>Ini adalah pengingat bahwa tagihan Anda akan jatuh tempo ${data.daysUntilDue} hari lagi:</p>
          <ul>
            <li>Invoice: ${data.invoiceNumber}</li>
            <li>Jumlah: Rp ${data.amount.toLocaleString('id-ID')}</li>
            <li>Jatuh Tempo: ${data.dueDate}</li>
          </ul>
          <p>Silakan lakukan pembayaran untuk menghindari penangguhan layanan.</p>
          <p>Terima kasih,<br/>AudiraNET</p>
        `;
      default:
        return `<p>${data.message || 'Email notification from AudiraNET'}</p>`;
    }
  }

  async sendInvoiceEmail(data: {
    to: string;
    customerName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    period: string;
  }): Promise<boolean> {
    try {
      const html = await this.loadTemplate('invoice', data);
      
      await this.transporter.sendMail({
        from: `"AudiraNET" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `Invoice ${data.invoiceNumber} - ${data.period}`,
        html,
      });

      console.log(`Invoice email sent to ${data.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send invoice email:', error);
      return false;
    }
  }

  async sendPaymentConfirmation(data: {
    to: string;
    customerName: string;
    invoiceNumber: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
  }): Promise<boolean> {
    try {
      const html = await this.loadTemplate('payment-confirmation', data);
      
      await this.transporter.sendMail({
        from: `"AudiraNET" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `Pembayaran Diterima - ${data.invoiceNumber}`,
        html,
      });

      console.log(`Payment confirmation email sent to ${data.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send payment confirmation:', error);
      return false;
    }
  }

  async sendPaymentReminder(data: {
    to: string;
    customerName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    daysUntilDue: number;
  }): Promise<boolean> {
    try {
      const html = await this.loadTemplate('payment-reminder', data);
      
      await this.transporter.sendMail({
        from: `"AudiraNET" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: `Pengingat: Tagihan Jatuh Tempo ${data.daysUntilDue} Hari Lagi`,
        html,
      });

      console.log(`Payment reminder sent to ${data.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send payment reminder:', error);
      return false;
    }
  }

  async sendWelcomeEmail(data: {
    to: string;
    customerName: string;
    username: string;
    password: string;
  }): Promise<boolean> {
    try {
      const html = `
        <h2>Selamat Datang di AudiraNET!</h2>
        <p>Halo ${data.customerName},</p>
        <p>Selamat datang! Akun Anda telah dibuat:</p>
        <ul>
          <li>Username: ${data.username}</li>
          <li>Password: ${data.password}</li>
        </ul>
        <p>Login di: ${process.env.CUSTOMER_PORTAL_URL}</p>
        <p><strong>Harap ganti password Anda setelah login pertama kali.</strong></p>
        <p>Terima kasih telah mempercayai layanan kami!</p>
        <p>Salam,<br/>Team AudiraNET</p>
      `;
      
      await this.transporter.sendMail({
        from: `"AudiraNET" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: 'Selamat Datang di AudiraNET',
        html,
      });

      console.log(`Welcome email sent to ${data.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  async sendGenericEmail(data: {
    to: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"AudiraNET" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.to,
        subject: data.subject,
        html: `<p>${data.message}</p>`,
      });

      console.log(`Generic email sent to ${data.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send generic email:', error);
      return false;
    }
  }
}
