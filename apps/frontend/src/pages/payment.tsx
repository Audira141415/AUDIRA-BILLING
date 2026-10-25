import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  FileText,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  Wallet,
  ArrowUpRight,
  CreditCard,
  RefreshCw,
  Printer,
  ChevronRight,
  ChevronLeft,
  Receipt,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  FileCheck,
  Zap,
  Radio,
  QrCode
} from 'lucide-react';

interface InvoicePayment {
  id: string;
  invoiceNumber: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    internetNumber?: string;
  };
  customerName?: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELED';
  paymentMethod?: string;
  paidAt?: string | null;
  dueDate: string;
  createdAt: string;
}

export default function PaymentDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [invoices, setInvoices] = useState<InvoicePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [selectedTx, setSelectedTx] = useState<InvoicePayment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.keuangan.getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load payment invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Aggregated Real Metrics
  const paidInvoices = useMemo(() => invoices.filter(i => i.status === 'PAID'), [invoices]);
  const pendingInvoices = useMemo(() => invoices.filter(i => i.status === 'PENDING'), [invoices]);
  const overdueInvoices = useMemo(() => invoices.filter(i => i.status === 'OVERDUE'), [invoices]);

  const totalPaid = useMemo(() => paidInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [paidInvoices]);
  const totalPending = useMemo(() => pendingInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [pendingInvoices]);
  const totalOverdue = useMemo(() => overdueInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [overdueInvoices]);

  const collectionRate = useMemo(() => {
    const totalBilled = totalPaid + totalPending + totalOverdue;
    if (totalBilled === 0) return 100;
    return Math.round((totalPaid / totalBilled) * 100);
  }, [totalPaid, totalPending, totalOverdue]);

  // Filtered recent transactions (top 8)
  const filteredInvoices = useMemo(() => {
    return invoices.filter(tx => {
      const matchStatus = statusFilter === 'ALL' ? true : tx.status === statusFilter;
      const query = searchTerm.trim().toLowerCase();
      const matchQuery = !query ||
        (tx.invoiceNumber && tx.invoiceNumber.toLowerCase().includes(query)) ||
        (tx.customer?.name && tx.customer.name.toLowerCase().includes(query)) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(query));
      return matchStatus && matchQuery;
    });
  }, [invoices, statusFilter, searchTerm]);

  const handlePrintReceipt = (tx: InvoicePayment) => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) return;
    const dateStr = tx.paidAt ? new Date(tx.paidAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID');
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pembayaran - ${tx.invoiceNumber}</title>
          <style>
            body { font-family: monospace; font-size: 11px; padding: 12px; margin: 0; }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="text-center font-bold" style="font-size: 14px;">AUDIRA NET & BILLING</div>
          <div class="text-center">KASIR & BUKTI BAYAR</div>
          <div class="text-center">Hotline: 0821-1200-1600</div>
          <div class="divider"></div>
          <div class="row"><span>Invoice:</span><span class="font-bold">${tx.invoiceNumber}</span></div>
          <div class="row"><span>Tanggal:</span><span>${dateStr}</span></div>
          <div class="row"><span>Pelanggan:</span><span>${tx.customer?.name || tx.customerName || '-'}</span></div>
          <div class="row"><span>No. Internet:</span><span>${tx.customer?.internetNumber || '-'}</span></div>
          <div class="divider"></div>
          <div class="row font-bold"><span>Total:</span><span>Rp ${(Number(tx.amount) || 0).toLocaleString('id-ID')}</span></div>
          <div class="row"><span>Metode:</span><span>${tx.paymentMethod || 'Tunai / Kasir'}</span></div>
          <div class="row"><span>Status:</span><span class="font-bold">${tx.status}</span></div>
          <div class="divider"></div>
          <div class="text-center" style="margin-top: 10px;">Terima kasih atas pembayaran Anda.</div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Layout>
      <div className="min-h-screen text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* ─── 1. Header Bar ─────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-medium">
              <span>Keuangan</span>
              <span>&gt;</span>
              <span>Kasir & Pembayaran</span>
              <span>&gt;</span>
              <span className="text-[var(--app-primary)] font-semibold">Dashboard Pembayaran</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] font-sans">
                Dashboard Gateway & Rekonsiliasi Kas
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gateway Active
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)]">
              Pemantauan arus kas masuk, rasio pelunasan invoice pelanggan, dan status saluran pembayaran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Refresh Trigger */}
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Perbarui Data Pembayaran"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600' : ''} />
            </button>

            {/* Quick Action: Transaksi Masuk */}
            <button
              onClick={() => router.push('/transaksi')}
              className="px-3.5 py-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Receipt size={14} /> Buku Transaksi
            </button>

            {/* Quick Action: Kasir Kolektor */}
            <button
              onClick={() => router.push('/kolektor')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Wallet size={14} /> Kasir Kolektor
            </button>
          </div>
        </div>

        {/* ─── 2. Real KPI Summary Ribbon ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Card 1: Penerimaan Kas */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Total Kas Masuk (Lunas)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    Rp {totalPaid.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Receipt size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Invoice Terbayar</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{paidInvoices.length} Terbayar</span>
            </div>
          </div>

          {/* Card 2: Menunggu Konfirmasi */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Menunggu Pembayaran
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
                    Rp {totalPending.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <Clock size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Menunggu Pelunasan</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{pendingInvoices.length} Inv</span>
            </div>
          </div>

          {/* Card 3: Overdue / Jatuh Tempo */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Piutang Menunggak (Overdue)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
                    Rp {totalOverdue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
                <XCircle size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Melewati Jatuh Tempo</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{overdueInvoices.length} Inv</span>
            </div>
          </div>

          {/* Card 4: Collection Rate */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Rasio Kolektibilitas Kas
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-blue-600 dark:text-blue-400">
                    {collectionRate}%
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Efektivitas Penagihan</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Sehat</span>
            </div>
          </div>

        </div>

        {/* ─── 3. Main Split Cockpit (65% / 35%) ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (65%): Live Recent Transactions Register */}
          <div className="lg:col-span-8 data-card p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h2 className="text-base font-bold text-[var(--app-text)] font-sans flex items-center gap-2">
                    <CreditCard size={17} className="text-[var(--app-primary)]" />
                    Transaksi Pembayaran Terbaru
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Daftar pembayaran invoice yang tercatat secara real-time di sistem
                  </p>
                </div>

                {/* Filter Status Tabs */}
                <div className="flex items-center gap-1 bg-[var(--app-card-subtle)] p-1 rounded-lg border border-[var(--app-border)] text-xs">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === 'ALL'
                        ? 'bg-[var(--app-card)] text-[var(--app-text)] shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Semua ({invoices.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('PAID')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === 'PAID'
                        ? 'bg-[var(--app-card)] text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Lunas ({paidInvoices.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('PENDING')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      statusFilter === 'PENDING'
                        ? 'bg-[var(--app-card)] text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Menunggu ({pendingInvoices.length})
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="pt-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-dim)]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari transaksi berdasarkan invoice atau pelanggan..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-[var(--app-primary)]"
                  />
                </div>
              </div>

              {/* Data Table / Authentic Empty State */}
              <div className="mt-3 overflow-x-auto border border-[var(--app-border)] rounded-lg">
                {filteredInvoices.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-[var(--app-card-subtle)]/30">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileCheck size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--app-text)]">
                        {invoices.length === 0
                          ? 'Belum Ada Transaksi Pembayaran Tercatat'
                          : 'Tidak Ada Transaksi yang Cocok dengan Filter'}
                      </p>
                      <p className="text-xs text-[var(--app-text-muted)] max-w-md mx-auto mt-1">
                        {invoices.length === 0
                          ? 'Sistem gateway pembayaran siap menerima transaksi via QRIS, Virtual Account, Transfer Bank, atau Kasir Kolektor.'
                          : 'Coba sesuaikan kata kunci atau filter status pembayaran.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--app-card-subtle)] border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">No. Invoice</th>
                        <th className="py-2.5 px-3">Pelanggan</th>
                        <th className="py-2.5 px-3">Nominal</th>
                        <th className="py-2.5 px-3">Metode</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)]">
                      {filteredInvoices.slice(0, 8).map((tx) => (
                        <tr key={tx.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {tx.invoiceNumber || tx.id.substring(0, 8)}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[var(--app-text)]">
                            {tx.customer?.name || tx.customerName || 'Pelanggan'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[var(--app-text)]">
                            Rp {(Number(tx.amount) || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-[var(--app-text-muted)]">
                            <span className="text-[11px] font-medium">
                              {tx.paymentMethod || 'Kasir / Tunai'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              tx.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : tx.status === 'OVERDUE'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setSelectedTx(tx);
                                  setShowDetailModal(true);
                                }}
                                className="p-1 text-[var(--app-text-muted)] hover:text-blue-600 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)]"
                                title="Lihat Detail"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                onClick={() => handlePrintReceipt(tx)}
                                className="p-1 text-[var(--app-text-muted)] hover:text-emerald-600 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)]"
                                title="Cetak Struk"
                              >
                                <Printer size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--app-border)] flex items-center justify-between text-xs text-[var(--app-text-muted)]">
              <span>Menampilkan {filteredInvoices.slice(0, 8).length} dari {filteredInvoices.length} tagihan</span>
              <button
                onClick={() => router.push('/transaksi')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                Buka Register Transaksi Lengkap <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Right Column (35%): Payment Channels & Quick Cashier Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Payment Channels Card */}
            <div className="data-card p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] font-sans flex items-center gap-2">
                    <Radio size={15} className="text-blue-600" />
                    Saluran Pembayaran ISP
                  </h3>
                  <p className="text-[11px] text-[var(--app-text-muted)]">Metode yang aktif di loket & gateway</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Kasir Kolektor Lapangan', desc: 'Setoran tunai & struk thermal Bluetooth', icon: Wallet, status: 'Aktif' },
                  { name: 'Transfer Bank Otomatis', desc: 'BCA, Mandiri, BRI, BNI virtual ledger', icon: CreditCard, status: 'Aktif' },
                  { name: 'QRIS Dinamis 24 Jam', desc: 'Scan instan via GoPay, OVO, DANA, BCA Mobile', icon: QrCode, status: 'Aktif' },
                  { name: 'Virtual Account (VA)', desc: 'Nomor pembayaran unik per invoice pelanggan', icon: Receipt, status: 'Aktif' }
                ].map((channel, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-md text-[var(--app-primary)]">
                        <channel.icon size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--app-text)] leading-tight">{channel.name}</p>
                        <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">{channel.desc}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {channel.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Cashier Dispatcher */}
            <div className="data-card p-5 space-y-3">
              <div className="pb-2 border-b border-[var(--app-border)]">
                <h3 className="text-sm font-bold text-[var(--app-text)] font-sans flex items-center gap-2">
                  <Zap size={15} className="text-amber-500" />
                  Akses Cepat Kasir
                </h3>
                <p className="text-[11px] text-[var(--app-text-muted)]">Modul penagihan dan pencatatan kas</p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => router.push('/kolektor')}
                  className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-blue-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Wallet size={16} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold text-[var(--app-text)]">Kasir Kolektor Lapangan</p>
                      <p className="text-[10px] text-[var(--app-text-dim)]">Buku kas shift & setoran kolektor</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-text-muted)]" />
                </button>

                <button
                  onClick={() => router.push('/transaksi')}
                  className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-blue-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt size={16} className="text-blue-600" />
                    <div>
                      <p className="font-semibold text-[var(--app-text)]">Register Semua Transaksi</p>
                      <p className="text-[10px] text-[var(--app-text-dim)]">Mutasi kas & ekspor file CSV</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-text-muted)]" />
                </button>

                <button
                  onClick={() => router.push('/invoice')}
                  className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:border-blue-500/50 hover:bg-[var(--app-card)] text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-amber-600" />
                    <div>
                      <p className="font-semibold text-[var(--app-text)]">Buku Tagihan & Pelunasan</p>
                      <p className="text-[10px] text-[var(--app-text-dim)]">Penerbitan tagihan & reminder WA</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-text-muted)]" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ─── 4. Transaction Detail Modal ─────────────────────────────────── */}
        {showDetailModal && selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] font-sans">
                    Detail Pembayaran Invoice
                  </h3>
                  <p className="text-[11px] text-[var(--app-text-muted)] font-mono">
                    {selectedTx.invoiceNumber || selectedTx.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                    selectedTx.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}>
                    {selectedTx.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Pelanggan:</span>
                  <span className="font-semibold text-[var(--app-text)]">
                    {selectedTx.customer?.name || selectedTx.customerName || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Metode Pembayaran:</span>
                  <span className="font-semibold text-[var(--app-text)]">
                    {selectedTx.paymentMethod || 'Tunai / Kasir'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Tanggal Jatuh Tempo:</span>
                  <span className="font-mono text-[var(--app-text)]">
                    {selectedTx.dueDate ? new Date(selectedTx.dueDate).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--app-card-subtle)] rounded-lg border border-[var(--app-border)] flex justify-between items-center">
                  <span className="font-semibold text-[var(--app-text-muted)]">Nominal Tagihan</span>
                  <span className="text-base font-bold font-mono text-[var(--app-text)]">
                    Rp {(Number(selectedTx.amount) || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[var(--app-card-subtle)] border-t border-[var(--app-border)] flex justify-end gap-2">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-3 py-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handlePrintReceipt(selectedTx)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer size={13} /> Cetak Struk
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
