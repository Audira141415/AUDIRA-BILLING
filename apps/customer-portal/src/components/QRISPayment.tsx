import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';

interface QRISPaymentProps {
  invoiceId: string;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const QRISPayment: React.FC<QRISPaymentProps> = ({
  invoiceId,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [expiryTime, setExpiryTime] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    createQRISPayment();
  }, [invoiceId]);

  const createQRISPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:4000/billing/create-qris-payment', {
        invoiceId,
      });

      if (response.data.success) {
        const { qrString, expiryTime: expiry, orderId: order } = response.data;
        
        // Generate QR Code image from string
        const qrDataUrl = await QRCode.toDataURL(qrString, {
          width: 300,
          margin: 2,
        });
        
        setQrCodeUrl(qrDataUrl);
        setExpiryTime(expiry);
        setOrderId(order);
        
        // Start checking payment status
        startStatusCheck(order);
      } else {
        setError(response.data.message || 'Failed to create QRIS payment');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create QRIS payment');
    } finally {
      setLoading(false);
    }
  };

  const startStatusCheck = (order: string) => {
    const interval = setInterval(async () => {
      try {
        setChecking(true);
        const response = await axios.get(
          `http://localhost:4000/billing/payment-status/${order}`
        );

        if (response.data.transaction_status === 'settlement') {
          clearInterval(interval);
          if (onSuccess) onSuccess();
        } else if (
          response.data.transaction_status === 'cancel' ||
          response.data.transaction_status === 'expire'
        ) {
          clearInterval(interval);
          setError('Payment expired or cancelled');
        }
      } catch (err) {
        // Continue checking
      } finally {
        setChecking(false);
      }
    }, 5000); // Check every 5 seconds

    // Stop checking after 15 minutes
    setTimeout(() => clearInterval(interval), 15 * 60 * 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800">Payment Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={createQRISPayment}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan QRIS Code</h2>
        <p className="text-gray-600">Scan dengan aplikasi e-wallet Anda</p>
      </div>

      {/* Amount */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 text-center mb-1">Total Pembayaran</p>
        <p className="text-3xl font-bold text-blue-600 text-center">
          Rp {amount.toLocaleString('id-ID')}
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white border-4 border-blue-500 rounded-lg p-4 mb-6">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="QRIS QR Code"
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 animate-pulse rounded"></div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Cara Pembayaran:</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-2 flex-shrink-0">1</span>
            <span>Buka aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay, dll)</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-2 flex-shrink-0">2</span>
            <span>Pilih menu Scan QR atau QRIS</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-2 flex-shrink-0">3</span>
            <span>Scan QR Code di atas</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-2 flex-shrink-0">4</span>
            <span>Konfirmasi pembayaran di aplikasi Anda</span>
          </li>
        </ol>
      </div>

      {/* Status */}
      {checking && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
            <p className="text-yellow-800 text-sm">Menunggu pembayaran...</p>
          </div>
        </div>
      )}

      {/* Expiry */}
      {expiryTime && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Berlaku sampai: {new Date(expiryTime).toLocaleString('id-ID')}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={createQRISPayment}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Refresh QR
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Supported Apps */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-3">Didukung oleh:</p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">GoPay</span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">OVO</span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">DANA</span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">ShopeePay</span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">LinkAja</span>
        </div>
      </div>
    </div>
  );
};

export default QRISPayment;
