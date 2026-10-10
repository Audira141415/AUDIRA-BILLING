import { Injectable, Logger } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';

export interface PaymentRequest {
  invoiceId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);
  private snap: any;
  private coreApi: any;

  constructor() {
    // Initialize Midtrans Snap
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    });

    // Initialize Core API for checking transaction status
    this.coreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    });
  }

  /**
   * Create payment transaction
   */
  async createPayment(data: PaymentRequest): Promise<any> {
    try {
      if (!process.env.MIDTRANS_SERVER_KEY) {
        this.logger.warn('MIDTRANS_SERVER_KEY not configured');
        return {
          success: false,
          message: 'Payment gateway not configured',
          mockUrl: `http://localhost:3000/payment/mock/${data.invoiceId}`,
        };
      }

      const parameter = {
        transaction_details: {
          order_id: data.invoiceId,
          gross_amount: data.amount,
        },
        customer_details: {
          first_name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        enabled_payments: [
          'credit_card',
          'mandiri_clickpay',
          'cimb_clicks',
          'bca_klikbca',
          'bca_klikpay',
          'bri_epay',
          'echannel',
          'permata_va',
          'bca_va',
          'bni_va',
          'bri_va',
          'other_va',
          'gopay',
          'shopeepay',
          'qris',
        ],
        callbacks: {
          finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
          error: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/failed`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/pending`,
        },
      };

      const transaction = await this.snap.createTransaction(parameter);

      this.logger.log(`Payment created for invoice ${data.invoiceId}`);

      return {
        success: true,
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
      };
    } catch (error) {
      this.logger.error(`Failed to create payment for ${data.invoiceId}:`, error.message);
      throw error;
    }
  }

  /**
   * Create QRIS payment (dedicated method)
   */
  async createQRISPayment(data: PaymentRequest): Promise<any> {
    try {
      if (!process.env.MIDTRANS_SERVER_KEY) {
        this.logger.warn('MIDTRANS_SERVER_KEY not configured');
        return {
          success: false,
          message: 'Payment gateway not configured',
        };
      }

      const parameter = {
        payment_type: 'qris',
        transaction_details: {
          order_id: data.invoiceId,
          gross_amount: data.amount,
        },
        customer_details: {
          first_name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
      };

      const transaction = await this.coreApi.charge(parameter);

      this.logger.log(`QRIS payment created for invoice ${data.invoiceId}`);

      return {
        success: true,
        orderId: data.invoiceId,
        qrString: transaction.actions?.find((a: any) => a.name === 'generate-qr-code')?.url,
        expiryTime: transaction.expiry_time,
        transactionStatus: transaction.transaction_status,
      };
    } catch (error) {
      this.logger.error(`Failed to create QRIS payment for ${data.invoiceId}:`, error.message);
      throw error;
    }
  }

  /**
   * Create Virtual Account payment
   */
  async createVAPayment(data: PaymentRequest & { bank: string }): Promise<any> {
    try {
      if (!process.env.MIDTRANS_SERVER_KEY) {
        this.logger.warn('MIDTRANS_SERVER_KEY not configured');
        return {
          success: false,
          message: 'Payment gateway not configured',
        };
      }

      const parameter = {
        payment_type: 'bank_transfer',
        transaction_details: {
          order_id: data.invoiceId,
          gross_amount: data.amount,
        },
        customer_details: {
          first_name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        bank_transfer: {
          bank: data.bank, // bca, bni, bri, permata
        },
      };

      const transaction = await this.coreApi.charge(parameter);

      this.logger.log(`VA payment created for invoice ${data.invoiceId} (${data.bank})`);

      return {
        success: true,
        orderId: data.invoiceId,
        vaNumber: transaction.va_numbers?.[0]?.va_number,
        bank: data.bank.toUpperCase(),
        expiryTime: transaction.expiry_time,
        transactionStatus: transaction.transaction_status,
      };
    } catch (error) {
      this.logger.error(`Failed to create VA payment for ${data.invoiceId}:`, error.message);
      throw error;
    }
  }

  /**
   * Check transaction status
   */
  async checkStatus(orderId: string): Promise<any> {
    try {
      const status = await this.coreApi.transaction.status(orderId);
      return status;
    } catch (error) {
      this.logger.error(`Failed to check status for ${orderId}:`, error.message);
      throw error;
    }
  }

  /**
   * Verify webhook notification from Midtrans
   */
  verifyNotification(notification: any): boolean {
    // Verify signature hash
    // const signatureKey = notification.signature_key;
    // TODO: Implement proper signature verification
    return true;
  }

  /**
   * Process webhook notification
   */
  processNotification(notification: any): {
    orderId: string;
    status: 'success' | 'pending' | 'failed';
    transactionStatus: string;
    fraudStatus: string;
  } {
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let status: 'success' | 'pending' | 'failed' = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        status = 'success';
      }
    } else if (transactionStatus === 'settlement') {
      status = 'success';
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      status = 'failed';
    } else if (transactionStatus === 'pending') {
      status = 'pending';
    }

    return {
      orderId,
      status,
      transactionStatus,
      fraudStatus,
    };
  }
}
