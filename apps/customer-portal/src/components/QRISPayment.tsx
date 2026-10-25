import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { API_BASE_URL } from '../config/api';
import { RefreshCw, X, QrCode as QrIcon, CheckCircle2, AlertCircle } from 'lucide-react';

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

      const response = await axios.post(`${API_BASE_URL}/billing/create-qris-payment`, {
        invoiceId,
      });

      if (response.data.success) {
        const { qrString, expiryTime: expiry, orderId: order } = response.data;
        
        const qrDataUrl = await QRCode.toDataURL(qrString, {
          width: 300,
          margin: 2,
        });
        
        setQrCodeUrl(qrDataUrl);
        setExpiryTime(expiry);
        setOrderId(order);
        
        startStatusCheck(order);
      } else {
        setError(response.data.message || 'Gagal membuat QRIS pembayaran');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat QRIS pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const startStatusCheck = (order: string) => {
    const interval = setInterval(async () => {
      try {
        setChecking(true);
        const response = await axios.get(
          `${API_BASE_URL}/billing/payment-status/${order}`
        );

        if (response.data.transaction_status === 'settlement') {
          clearInterval(interval);
          if (onSuccess) onSuccess();
        } else if (
          response.data.transaction_status === 'cancel' ||
          response.data.transaction_status === 'expire'
        ) {
          clearInterval(interval);
          setError('Sesi pembayaran telah kedaluwarsa atau dibatalkan');
        }
      } catch (err) {
        // Continue checking
      } finally {
        setChecking(false);
      }
    }, 5000);

    setTimeout(() => clearInterval(interval), 15 * 60 * 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 font-mono text-xs text-cyan-600 dark:text-cyan-400 gap-3">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Menghasilkan Kode QRIS Pembayaran...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-2xl p-6 text-slate-900 dark:text-white font-mono text-xs max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400 font-bold">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-sm font-black uppercase">Kendala QRIS</h3>
        </div>
        <p className="mb-4 text-slate-700 dark:text-gray-300">{error}</p>
        <button
          onClick={createQRISPayment}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold uppercase hover:bg-rose-700 transition"
        >
          Coba Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl shadow-[4px_4px_0px_#000] p-6 max-w-md mx-auto text-slate-950 dark:text-white font-sans">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-400 text-black border-2 border-black rounded-xl mb-3 shadow-[2px_2px_0px_#000]">
          <QrIcon className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
          Scan QRIS Resmi
        </h2>
        <p className="text-xs text-slate-600 dark:text-gray-400 font-mono mt-0.5">
          Scan dengan GoPay, OVO, Dana, BCA, atau aplikasi perbankan Anda
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl p-4 mb-5 text-center font-mono">
        <p className="text-[11px] text-slate-500 dark:text-gray-400 uppercase font-bold mb-0.5">
          Total Tagihan Pembayaran
        </p>
        <p className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
          Rp {amount.toLocaleString('id-ID')}
        </p>
      </div>

      {/* QR Code Frame */}
      <div className="bg-white border-2 border-black dark:border-cyan-500/50 rounded-xl p-4 mb-5 flex items-center justify-center shadow-inner">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="QRIS QR Code"
            className="w-full max-w-[260px] h-auto rounded"
          />
        ) : (
          <div className="w-64 h-64 bg-slate-100 animate-pulse rounded flex items-center justify-center text-xs font-mono text-slate-400">
            Memuat QR Code...
          </div>
        )}
      </div>

      {/* Status */}
      {checking && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 rounded-xl p-3 mb-4 font-mono text-xs flex items-center gap-2 text-amber-900 dark:text-amber-300">
          <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
          <span>Menunggu konfirmasi pelunasan dari jaringan QRIS...</span>
        </div>
      )}

      {/* Expiry */}
      {expiryTime && (
        <div className="text-center font-mono text-[11px] text-slate-500 dark:text-gray-400 mb-4">
          Batas Waktu: {new Date(expiryTime).toLocaleTimeString('id-ID')} WIB
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 font-mono text-xs font-bold">
        <button
          onClick={createQRISPayment}
          className="flex-1 py-2.5 rounded-xl border border-black dark:border-gray-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh QR</span>
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-black bg-rose-600 text-white hover:bg-rose-700 transition flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QRISPayment;
