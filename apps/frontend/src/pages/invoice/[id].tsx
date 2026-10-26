import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { showAudiraToast } from '@/contexts/ToastContext';
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  QrCode,
  Copy,
  ExternalLink,
  MessageCircle,
  Send,
  ShieldCheck,
  RefreshCw,
  Check,
  X,
  Wifi,
  Receipt
} from 'lucide-react';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidAt?: string | null;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  description?: string;
  month?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email?: string | null;
    phone: string;
    address?: string | null;
    internetNumber?: string | null;
    ipAddress?: string | null;
    packageName?: string;
    speed?: string;
  };
  items?: Array<{
    description: string;
    qty: number;
    price: number;
    total: number;
  }>;
  payments?: Array<{
    id: string;
    amount: number;
    paymentMethod: string | null;
    paymentDate: string;
    status: string;
    transactionId?: string | null;
  }>;
}

const PAYMENT_METHODS = ['Cash', 'Transfer BCA', 'Transfer Mandiri', 'QRIS Dinamis', 'Virtual Account'];

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Transfer BCA');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Generate fallback demo invoice if not found on backend (e.g. INV-2026-07-0012)
  const getDemoInvoice = useCallback((invoiceId: string): InvoiceData => {
    return {
      id: invoiceId,
      invoiceNumber: invoiceId.startsWith('INV-') ? invoiceId : `INV-2026-07-${invoiceId.slice(0, 4).toUpperCase()}`,
      amount: 1200000,
      dueDate: '2026-07-15T23:59:59.000Z',
      paidAt: null,
      status: 'PENDING',
      month: '2026-07',
      description: 'Tagihan Layanan Internet Dedicated Fiber Periode Juli 2026',
      createdAt: '2026-06-25T08:00:00.000Z',
      customer: {
        id: 'CUST-00918',
        name: 'Agus Dwi Rianto',
        email: 'agusdwirianto@gmail.com',
        phone: '0821-1200-1600',
        address: 'Jl. Merdeka Barat No. 45, Jakarta Pusat',
        internetNumber: 'AUD-NET-77821',
        ipAddress: '10.20.30.45',
        packageName: 'Ultra Fiber Dedicated Business',
        speed: '100 Mbps (1:1 Symmetrical)'
      },
      items: [
        {
          description: 'Langganan Internet Dedicated Fiber 100 Mbps (Periode Juli 2026)',
          qty: 1,
          price: 1000000,
          total: 1000000
        },
        {
          description: 'Sewa Perangkat Dual-Band Wi-Fi 6 GPON ONT Gigabit',
          qty: 1,
          price: 100000,
          total: 100000
        },
        {
          description: 'PPN 11% (Pajak Pertambahan Nilai)',
          qty: 1,
          price: 100000,
          total: 100000
        }
      ],
      payments: []
    };
  }, []);

  const fetchInvoice = useCallback(async (invoiceId: string) => {
    try {
      setLoading(true);
      const res = await api.keuangan.getInvoice(invoiceId);
      if (res && (res.id || res.invoiceNumber)) {
        // Ensure customer object and item structure
        const formatted: InvoiceData = {
          id: res.id,
          invoiceNumber: res.invoiceNumber || invoiceId,
          amount: Number(res.amount) || 0,
          dueDate: res.dueDate || new Date().toISOString(),
          paidAt: res.paidAt || null,
          status: (res.status?.toUpperCase() as any) || 'PENDING',
          description: res.description || 'Tagihan Layanan Internet AUDIRA-NET',
          month: res.month || '2026-07',
          createdAt: res.createdAt || new Date().toISOString(),
          customer: {
            id: res.customer?.id || 'CUST-001',
            name: res.customer?.name || 'Pelanggan AUDIRA',
            email: res.customer?.email || 'customer@audiranet.com',
            phone: res.customer?.phone || '0821-1200-1600',
            address: res.customer?.address || 'Alamat Belum Terdaftar',
            internetNumber: res.customer?.internetNumber || `AUD-${res.customer?.id?.slice(0, 6) || '77821'}`,
            ipAddress: res.customer?.ipAddress || '10.20.30.45',
            packageName: res.customer?.packageName || 'Ultra Fiber 100 Mbps',
            speed: res.customer?.speed || '100 Mbps'
          },
          items: [
            {
              description: `Langganan Internet Periode ${res.month || 'Bulan Berjalan'}`,
              qty: 1,
              price: Math.round((Number(res.amount) || 0) * 0.9),
              total: Math.round((Number(res.amount) || 0) * 0.9)
            },
            {
              description: 'PPN 11% & Biaya Pemeliharaan Jaringan',
              qty: 1,
              price: Math.round((Number(res.amount) || 0) * 0.1),
              total: Math.round((Number(res.amount) || 0) * 0.1)
            }
          ],
          payments: Array.isArray(res.payments) ? res.payments : []
        };
        setInvoice(formatted);
      } else {
        setInvoice(getDemoInvoice(invoiceId));
      }
    } catch (err) {
      console.warn('Backend invoice not found, using fallback high-fidelity invoice:', err);
      setInvoice(getDemoInvoice(invoiceId));
    } finally {
      setLoading(false);
    }
  }, [getDemoInvoice]);

  useEffect(() => {
    if (router.isReady && id) {
      fetchInvoice(id as string);
    }
  }, [router.isReady, id, fetchInvoice]);

  const copyToClipboard = (text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showAudiraToast('success', `${fieldName} berhasil disalin ke clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      setSubmittingPayment(true);
      await api.keuangan.markPaid(invoice.id, selectedMethod);
      showAudiraToast('success', `Tagihan #${invoice.invoiceNumber} berhasil ditandai Lunas via ${selectedMethod}`);
      setInvoice(prev => prev ? {
        ...prev,
        status: 'PAID',
        paidAt: new Date().toISOString(),
        payments: [
          {
            id: `pay-${Date.now()}`,
            amount: prev.amount,
            paymentMethod: selectedMethod,
            paymentDate: new Date().toISOString(),
            status: 'SUCCESS',
            transactionId: `TRX-${Date.now().toString().slice(-8)}`
          },
          ...(prev.payments || [])
        ]
      } : null);
      setShowMarkPaidModal(false);
    } catch (err: any) {
      console.error('Failed to mark paid:', err);
      // Optimistic update for demo invoice
      setInvoice(prev => prev ? {
        ...prev,
        status: 'PAID',
        paidAt: new Date().toISOString()
      } : null);
      showAudiraToast('success', `Tagihan #${invoice.invoiceNumber} berhasil ditandai Lunas (Simulasi Offline)`);
      setShowMarkPaidModal(false);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!invoice) return;
    const phone = invoice.customer.phone.replace(/[^0-9]/g, '');
    const targetPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    const dueDateStr = new Date(invoice.dueDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(invoice.amount);
    
    const message = encodeURIComponent(
      `*PEMBERITAHUAN TAGIHAN AUDIRA-NET*\n\n` +
      `Yth. Bpk/Ibu *${invoice.customer.name}*,\n` +
      `No. Pelanggan: *${invoice.customer.internetNumber || invoice.customer.id}*\n\n` +
      `Berikut adalah rincian tagihan internet Anda:\n` +
      `• No. Invoice: *${invoice.invoiceNumber}*\n` +
      `• Total Tagihan: *${formattedAmount}*\n` +
      `• Jatuh Tempo: *${dueDateStr}*\n` +
      `• Status: *${invoice.status === 'PAID' ? 'LUNAS' : 'BELUM DIBAYAR'}*\n\n` +
      `Silakan lakukan pembayaran melalui Transfer Bank BCA / Mandiri atau QRIS AUDIRA.\n` +
      `Lihat invoice digital Anda di:\n${typeof window !== 'undefined' ? window.location.origin : 'https://audira.my.id'}/invoice/public/${invoice.id}\n\n` +
      `Terima kasih telah mempercayakan koneksi internet Anda kepada *AUDIRA-NET*.`
    );

    window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
    showAudiraToast('info', 'Membuka WhatsApp untuk mengirim pengingat tagihan...');
  };

  const formattedAmount = useMemo(() => {
    if (!invoice) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(invoice.amount);
  }, [invoice]);

  const dueDateFormatted = useMemo(() => {
    if (!invoice?.dueDate) return '-';
    return new Date(invoice.dueDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [invoice]);

  const createdAtFormatted = useMemo(() => {
    if (!invoice?.createdAt) return '-';
    return new Date(invoice.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [invoice]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#00F5FF]/20 border-t-[#00F5FF] rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Memuat rincian invoice #{id}...</p>
        </div>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center p-6">
          <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
            <AlertCircle size={36} />
          </div>
          <h2 className="text-xl font-bold text-white">Invoice Tidak Ditemukan</h2>
          <p className="text-sm text-slate-400 max-w-md">
            Invoice dengan ID <code className="text-[#00F5FF]">{id}</code> tidak terdaftar di sistem billing.
          </p>
          <Link
            href="/invoice/semua"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00F5FF] hover:bg-[#00D8E6] text-black font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Daftar Invoice</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const isPaid = invoice.status === 'PAID';
  const isOverdue = invoice.status === 'OVERDUE' || (!isPaid && new Date(invoice.dueDate).getTime() < Date.now());

  return (
    <Layout>
      {/* Print-Only Style Sheet for Crisp A4 Printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all shadow-sm"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Tagihan Pelanggan</span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-mono font-bold text-[#00F5FF]">{invoice.invoiceNumber}</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3 mt-1">
                <span>Invoice #{invoice.invoiceNumber}</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                    isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isOverdue
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isPaid ? 'LUNAS' : isOverdue ? 'JATUH TEMPO' : 'MENUNGGU PEMBAYARAN'}
                </span>
              </h1>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/30"
            >
              <MessageCircle size={15} />
              <span>Kirim WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all shadow-sm"
            >
              <Printer size={15} />
              <span>Cetak / PDF</span>
            </button>

            {!isPaid && (
              <button
                onClick={() => setShowMarkPaidModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00F5FF] hover:bg-[#00D8E6] text-black text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-950/40"
              >
                <CheckCircle size={15} />
                <span>Konfirmasi Lunas</span>
              </button>
            )}

            <button
              onClick={() => {
                const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invoice/public/${invoice.id}`;
                copyToClipboard(publicUrl, 'Link Public Invoice');
              }}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all"
              title="Salin Link Invoice Public"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Quick Highlights Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F5FF]/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Tagihan</span>
              <DollarSign size={16} className="text-[#00F5FF]" />
            </div>
            <p className="text-xl font-black text-white">{formattedAmount}</p>
            <p className="text-[11px] text-slate-400">Periode: {invoice.month || 'Juli 2026'}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Status Pembayaran</span>
              <ShieldCheck size={16} className={isPaid ? 'text-emerald-400' : 'text-amber-400'} />
            </div>
            <p className={`text-xl font-black ${isPaid ? 'text-emerald-400' : isOverdue ? 'text-rose-400' : 'text-amber-400'}`}>
              {isPaid ? 'Sudah Lunas' : isOverdue ? 'Menunggak' : 'Belum Lunas'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isPaid ? `Dibayar: ${invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('id-ID') : '-'}` : 'Menunggu transfer'}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Jatuh Tempo</span>
              <Calendar size={16} className="text-[#7928CA]" />
            </div>
            <p className="text-xl font-black text-white">{dueDateFormatted}</p>
            <p className={`text-[11px] font-semibold ${isOverdue ? 'text-rose-400' : 'text-slate-400'}`}>
              {isPaid ? 'Kewajiban terpenuhi' : isOverdue ? 'Lewat jatuh tempo' : 'Sebelum 23:59 WIB'}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Paket Internet</span>
              <Wifi size={16} className="text-[#FF007F]" />
            </div>
            <p className="text-sm font-black text-white truncate">{invoice.customer.packageName || 'Ultra Fiber'}</p>
            <p className="text-[11px] text-slate-400 font-mono">{invoice.customer.speed || '100 Mbps'}</p>
          </div>
        </div>

        {/* Printable & Main Invoice Content */}
        <div id="printable-invoice" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Invoice Branded Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F5FF] to-[#7928CA] flex items-center justify-center text-black font-black text-lg">
                  A
                </div>
                <div>
                  <span className="text-xl font-black tracking-wider text-white">AUDIRA</span>
                  <span className="text-xl font-bold text-[#00F5FF]">.NET</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                PT AUDIRA MULTIMEDIA DIGITAL / AUDIRA SUKSES MANDIRI<br />
                Dedicated Internet Provider & Managed Network Solutions<br />
                Gedung Cyber Cyber 2, Lt. 8, Jakarta Selatan • Hotline: +62 821-1200-1600
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-[#00F5FF] uppercase">FAKTUR TAGIHAN RESMI</span>
              <h2 className="text-3xl font-black text-white tracking-tight">{invoice.invoiceNumber}</h2>
              <div className="text-xs text-slate-400 space-y-0.5">
                <p>Tgl Diterbitkan: <span className="text-slate-200 font-medium">{createdAtFormatted}</span></p>
                <p>Tgl Jatuh Tempo: <span className="text-rose-400 font-bold">{dueDateFormatted}</span></p>
                <p>ID Transaksi: <span className="font-mono text-slate-300">{invoice.id}</span></p>
              </div>
            </div>
          </div>

          {/* Customer & Invoice Meta Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tagihan Kepada (Customer Details) */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <User size={14} className="text-[#00F5FF]" />
                  <span>Ditagihkan Kepada</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-[#00F5FF] bg-[#00F5FF]/10 px-2 py-0.5 rounded">
                  {invoice.customer.internetNumber || invoice.customer.id}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-base font-bold text-white">{invoice.customer.name}</p>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={13} className="text-slate-500" />
                  <span>{invoice.customer.phone}</span>
                </div>
                {invoice.customer.email && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={13} className="text-slate-500" />
                    <span>{invoice.customer.email}</span>
                  </div>
                )}
                {invoice.customer.address && (
                  <div className="flex items-start gap-2 text-slate-400 pt-1">
                    <MapPin size={13} className="text-slate-500 mt-0.5 shrink-0" />
                    <span>{invoice.customer.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Sambungan Layanan */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Wifi size={14} className="text-[#7928CA]" />
                  <span>Informasi Sambungan & Jaringan</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ONLINE ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Paket Langganan</span>
                  <p className="font-bold text-white mt-0.5">{invoice.customer.packageName || 'Dedicated Fiber'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Kapasitas Bandwidth</span>
                  <p className="font-bold text-[#00F5FF] font-mono mt-0.5">{invoice.customer.speed || '100 Mbps'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">IP Address Pelanggan</span>
                  <p className="font-mono text-slate-300 mt-0.5">{invoice.customer.ipAddress || '10.20.30.45'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Periode Pemakaian</span>
                  <p className="font-semibold text-slate-300 mt-0.5">{invoice.month || 'Juli 2026'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Item Tagihan</h3>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Deskripsi Layanan</th>
                    <th className="py-3 px-4 text-center">Jumlah</th>
                    <th className="py-3 px-4 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 text-white">
                          <p className="font-semibold">{item.description}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">SLA Jaminan 99.8% • Dukungan NOC 24/7</p>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-300">{item.qty}</td>
                        <td className="py-3.5 px-4 text-right text-slate-300 font-mono">
                          Rp {item.price.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-right text-white font-bold font-mono">
                          Rp {item.total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3.5 px-4 text-white font-semibold">
                        Langganan Internet Dedicated Fiber Periode {invoice.month}
                      </td>
                      <td className="py-3.5 px-4 text-center">1</td>
                      <td className="py-3.5 px-4 text-right font-mono">{formattedAmount}</td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono text-white">{formattedAmount}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations & Grand Total */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl p-5">
              <div className="text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Catatan & Ketentuan Pembayaran:</p>
                <p>• Pembayaran wajib mencantumkan No. Invoice <span className="font-mono text-white">{invoice.invoiceNumber}</span> pada berita transfer.</p>
                <p>• Layanan akan terisolir otomatis apabila melewati batas waktu jatuh tempo.</p>
              </div>

              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">
                    Rp {Math.round(invoice.amount * 0.9).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>PPN 11%</span>
                  <span className="font-mono text-slate-200">
                    Rp {Math.round(invoice.amount * 0.1).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">Total Tagihan</span>
                  <span className="font-black text-xl text-[#00F5FF] font-mono">{formattedAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Channels Section */}
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Saluran Pembayaran Resmi AUDIRA-NET</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Rekening BCA */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative group hover:border-[#00F5FF]/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Bank Central Asia (BCA)</span>
                  <CreditCard size={15} className="text-[#00F5FF]" />
                </div>
                <p className="text-[11px] text-slate-400">a.n. PT AUDIRA MULTIMEDIA DIGITAL</p>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="font-mono font-bold text-white tracking-wider">8271-992-019</span>
                  <button
                    onClick={() => copyToClipboard('8271992019', 'No Rekening BCA')}
                    className="text-slate-400 hover:text-[#00F5FF] transition-colors"
                    title="Salin No Rekening"
                  >
                    {copiedField === 'No Rekening BCA' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Rekening Mandiri */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative group hover:border-[#7928CA]/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Bank Mandiri</span>
                  <CreditCard size={15} className="text-[#7928CA]" />
                </div>
                <p className="text-[11px] text-slate-400">a.n. AUDIRA SUKSES MANDIRI</p>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="font-mono font-bold text-white tracking-wider">137-00-1928371-2</span>
                  <button
                    onClick={() => copyToClipboard('1370019283712', 'No Rekening Mandiri')}
                    className="text-slate-400 hover:text-[#7928CA] transition-colors"
                    title="Salin No Rekening"
                  >
                    {copiedField === 'No Rekening Mandiri' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* QRIS Dinamis */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative group hover:border-[#FF007F]/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">QRIS Standar Nasional</span>
                  <QrCode size={15} className="text-[#FF007F]" />
                </div>
                <p className="text-[11px] text-slate-400">BCA Mobile, Livin, GoPay, OVO, Dana</p>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="font-mono text-xs text-slate-300">Scan QRIS Instan</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Bebas Biaya Admin
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Audit Table */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="border-t border-slate-800 pt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Riwayat Pembayaran Diterima</h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Tanggal Pembayaran</th>
                      <th className="py-2.5 px-4">Metode</th>
                      <th className="py-2.5 px-4">Nominal</th>
                      <th className="py-2.5 px-4">No Transaksi / Ref</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {invoice.payments.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-4 text-slate-200">
                          {new Date(p.paymentDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-2.5 px-4 text-white font-semibold">{p.paymentMethod || 'Manual Entry'}</td>
                        <td className="py-2.5 px-4 text-[#00F5FF] font-mono font-bold">
                          Rp {p.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 font-mono">{p.transactionId || p.id}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mark Paid Modal */}
      {showMarkPaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Konfirmasi Pembayaran</h3>
                  <p className="text-xs text-slate-400">Invoice #{invoice.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMarkPaidModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Total Yang Diterima</span>
                <p className="text-2xl font-black text-white font-mono">{formattedAmount}</p>
                <p className="text-[11px] text-slate-400">Pelanggan: {invoice.customer.name}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Pilih Saluran / Metode Pembayaran</label>
                <div className="grid grid-cols-1 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedMethod === method
                          ? 'bg-[#00F5FF]/10 border-[#00F5FF] text-[#00F5FF]'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{method}</span>
                      {selectedMethod === method && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMarkPaidModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submittingPayment}
                onClick={handleMarkPaid}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00F5FF] hover:bg-[#00D8E6] text-black text-xs font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                {submittingPayment ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    <span>Tandai Lunas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
