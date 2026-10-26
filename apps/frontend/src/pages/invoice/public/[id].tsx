import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  FileText,
  Printer,
  Download,
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
  Check,
  Wifi,
  ShieldCheck
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
    packageName?: string;
    speed?: string;
  };
  items?: Array<{
    description: string;
    qty: number;
    price: number;
    total: number;
  }>;
}

export default function PublicInvoicePage() {
  const router = useRouter();
  const rawId = (router.query.id as string) || (typeof router.asPath === 'string' ? router.asPath.split('/')[3]?.split('?')[0] : '') || 'INV-2026-07-0012';

  const [invoice, setInvoice] = useState<InvoiceData>(() => ({
    id: rawId,
    invoiceNumber: rawId.startsWith('INV-') ? rawId : `INV-2026-07-${rawId.slice(0, 4).toUpperCase()}`,
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
    ]
  }));
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
      ]
    };
  }, []);

  const fetchInvoice = useCallback(async (invoiceId: string) => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const res = await fetch(`${API_BASE_URL}/keuangan/invoices/${invoiceId}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice({
          id: data.id,
          invoiceNumber: data.invoiceNumber || invoiceId,
          amount: Number(data.amount) || 0,
          dueDate: data.dueDate || new Date().toISOString(),
          paidAt: data.paidAt || null,
          status: (data.status?.toUpperCase() as any) || 'PENDING',
          description: data.description || 'Tagihan Layanan Internet AUDIRA-NET',
          month: data.month || '2026-07',
          createdAt: data.createdAt || new Date().toISOString(),
          customer: {
            id: data.customer?.id || 'CUST-001',
            name: data.customer?.name || 'Pelanggan AUDIRA',
            email: data.customer?.email || 'customer@audiranet.com',
            phone: data.customer?.phone || '0821-1200-1600',
            address: data.customer?.address || 'Alamat Terdaftar',
            internetNumber: data.customer?.internetNumber || `AUD-${data.customer?.id?.slice(0, 6) || '77821'}`,
            packageName: data.customer?.packageName || 'Ultra Fiber 100 Mbps',
            speed: data.customer?.speed || '100 Mbps'
          },
          items: [
            {
              description: `Langganan Internet Periode ${data.month || 'Bulan Berjalan'}`,
              qty: 1,
              price: Math.round((Number(data.amount) || 0) * 0.9),
              total: Math.round((Number(data.amount) || 0) * 0.9)
            },
            {
              description: 'PPN 11% & Jaminan Layanan Jaringan',
              qty: 1,
              price: Math.round((Number(data.amount) || 0) * 0.1),
              total: Math.round((Number(data.amount) || 0) * 0.1)
            }
          ]
        });
      } else {
        setInvoice(getDemoInvoice(invoiceId));
      }
    } catch {
      setInvoice(getDemoInvoice(invoiceId));
    } finally {
      setLoading(false);
    }
  }, [getDemoInvoice]);

  useEffect(() => {
    if (rawId) {
      fetchInvoice(rawId);
    }
  }, [rawId, fetchInvoice]);

  const copyToClipboard = (text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
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

  const isPaid = invoice?.status === 'PAID';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-8 px-4 sm:px-6">
      <Head>
        <title>{invoice ? `Tagihan #${invoice.invoiceNumber} - AUDIRA-NET` : 'Tagihan Internet - AUDIRA-NET'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #public-invoice-card, #public-invoice-card * {
            visibility: visible;
          }
          #public-invoice-card {
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

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Floating Action Bar */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00F5FF] to-[#7928CA] flex items-center justify-center text-black font-black text-base">
              A
            </div>
            <span className="font-black tracking-wide text-white text-lg">AUDIRA<span className="text-[#00F5FF]">.NET</span></span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 shadow-md transition-all"
          >
            <Printer size={14} />
            <span>Cetak Kwitansi</span>
          </button>
        </div>

        {/* Invoice Card */}
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#00F5FF]/20 border-t-[#00F5FF] rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400">Memuat data invoice...</p>
          </div>
        ) : invoice ? (
          <div id="public-invoice-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header Status & Logo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#00F5FF] uppercase">FAKTUR TAGIHAN PELANGGAN</span>
                <h1 className="text-2xl font-black text-white">{invoice.invoiceNumber}</h1>
                <p className="text-xs text-slate-400 mt-0.5">Bulan Pemakaian: <span className="text-slate-200 font-semibold">{invoice.month}</span></p>
              </div>

              <div className="text-left sm:text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                  {isPaid ? 'LUNAS (PAID)' : 'MENUNGGU PEMBAYARAN'}
                </span>
                <p className="text-xs text-slate-400 mt-1">Jatuh Tempo: <span className="text-rose-300 font-semibold">{dueDateFormatted}</span></p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Informasi Pelanggan</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Nama Pelanggan:</span>
                  <p className="text-white font-bold text-sm mt-0.5">{invoice.customer.name}</p>
                  <p className="text-slate-400">{invoice.customer.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">ID Pelanggan / Paket:</span>
                  <p className="font-mono font-bold text-[#00F5FF] mt-0.5">{invoice.customer.internetNumber || invoice.customer.id}</p>
                  <p className="text-slate-300">{invoice.customer.packageName} ({invoice.customer.speed})</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Tagihan</span>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Layanan</th>
                      <th className="py-2.5 px-4 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {invoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 text-white">
                          <p className="font-semibold">{item.description}</p>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-200">
                          Rp {item.total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400">Total Yang Harus Dibayar</span>
                <p className="text-2xl sm:text-3xl font-black text-[#00F5FF] font-mono">{formattedAmount}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Metode Pembayaran</span>
                <span className="text-xs font-bold text-white">BCA / Mandiri / QRIS</span>
              </div>
            </div>

            {/* Payment Options (When unpaid) */}
            {!isPaid && (
              <div className="border-t border-slate-800 pt-5 space-y-4 no-print">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saluran Pembayaran Resmi</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* BCA */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <span className="font-bold text-white block">Bank BCA</span>
                    <p className="text-[11px] text-slate-400">a.n. PT AUDIRA MULTIMEDIA DIGITAL</p>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="font-mono font-bold text-[#00F5FF]">8271-992-019</span>
                      <button
                        onClick={() => copyToClipboard('8271992019', 'BCA')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedField === 'BCA' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Mandiri */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <span className="font-bold text-white block">Bank Mandiri</span>
                    <p className="text-[11px] text-slate-400">a.n. AUDIRA SUKSES MANDIRI</p>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="font-mono font-bold text-[#7928CA]">137-00-1928371-2</span>
                      <button
                        onClick={() => copyToClipboard('1370019283712', 'Mandiri')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedField === 'Mandiri' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                  <p className="font-semibold">Konfirmasi Otomatis:</p>
                  <p className="text-[11px] text-blue-200/80 mt-0.5">
                    Sistem mendeteksi transfer otomatis dalam waktu 1-5 menit setelah pembayaran berhasil dilakukan.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-800 pt-4 text-center text-[11px] text-slate-500">
              <p>PT AUDIRA MULTIMEDIA DIGITAL • Layanan Pelanggan 24/7 Hotline: +62 821-1200-1600</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
