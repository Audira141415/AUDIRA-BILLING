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
  FileCheck
} from 'lucide-react';

interface InvoiceTransaction {
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
  description?: string;
}

export default function SemuaPembayaranPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [invoices, setInvoices] = useState<InvoiceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<InvoiceTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.keuangan.getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load transaction register:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Real KPI Aggregates
  const paidInvoices = useMemo(() => invoices.filter(i => i.status === 'PAID'), [invoices]);
  const pendingInvoices = useMemo(() => invoices.filter(i => i.status === 'PENDING'), [invoices]);
  const overdueInvoices = useMemo(() => invoices.filter(i => i.status === 'OVERDUE'), [invoices]);

  const totalPaidNominal = useMemo(() => paidInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [paidInvoices]);
  const totalPendingNominal = useMemo(() => pendingInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [pendingInvoices]);
  const totalOverdueNominal = useMemo(() => overdueInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0), [overdueInvoices]);

  const averageTransaction = useMemo(() => {
    if (paidInvoices.length === 0) return 0;
    return Math.round(totalPaidNominal / paidInvoices.length);
  }, [totalPaidNominal, paidInvoices]);

  // Unique payment methods from real data
  const availableMethods = useMemo(() => {
    const set = new Set<string>();
    invoices.forEach(i => {
      if (i.paymentMethod) set.add(i.paymentMethod);
    });
    return Array.from(set);
  }, [invoices]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return invoices.filter(tx => {
      const matchStatus = statusFilter === 'ALL' ? true : tx.status === statusFilter;
      const matchMethod = methodFilter === 'ALL' ? true : (tx.paymentMethod === methodFilter);
      const query = searchTerm.trim().toLowerCase();
      const matchQuery = !query ||
        (tx.invoiceNumber && tx.invoiceNumber.toLowerCase().includes(query)) ||
        (tx.customer?.name && tx.customer.name.toLowerCase().includes(query)) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(query)) ||
        (tx.customer?.phone && tx.customer.phone.toLowerCase().includes(query));

      return matchStatus && matchMethod && matchQuery;
    });
  }, [invoices, statusFilter, methodFilter, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Real CSV Export
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('Tidak ada data transaksi untuk diexport.');
      return;
    }
    const headers = ['No. Invoice', 'Pelanggan', 'No. Internet', 'Nominal', 'Status', 'Metode Pembayaran', 'Tanggal Bayar', 'Jatuh Tempo'];
    const rows = filteredTransactions.map(tx => [
      `"${tx.invoiceNumber || tx.id}"`,
      `"${(tx.customer?.name || tx.customerName || '-').replace(/"/g, '""')}"`,
      `"${tx.customer?.internetNumber || '-'}"`,
      `"${Number(tx.amount) || 0}"`,
      `"${tx.status}"`,
      `"${tx.paymentMethod || '-'}"`,
      `"${tx.paidAt ? new Date(tx.paidAt).toLocaleDateString('id-ID') : '-'}"`,
      `"${tx.dueDate ? new Date(tx.dueDate).toLocaleDateString('id-ID') : '-'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audira-transaksi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReceipt = (tx: InvoiceTransaction) => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) return;
    const dateStr = tx.paidAt ? new Date(tx.paidAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID');
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Bukti Bayar - ${tx.invoiceNumber}</title>
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
          <div class="text-center">BUKTI PEMBAYARAN RESMI</div>
          <div class="text-center">Hotline: 0821-1200-1600</div>
          <div class="divider"></div>
          <div class="row"><span>No. Invoice:</span><span class="font-bold">${tx.invoiceNumber}</span></div>
          <div class="row"><span>Tanggal:</span><span>${dateStr}</span></div>
          <div class="row"><span>Pelanggan:</span><span>${tx.customer?.name || tx.customerName || '-'}</span></div>
          <div class="row"><span>No. Internet:</span><span>${tx.customer?.internetNumber || '-'}</span></div>
          <div class="divider"></div>
          <div class="row font-bold"><span>Total Bayar:</span><span>Rp ${(Number(tx.amount) || 0).toLocaleString('id-ID')}</span></div>
          <div class="row"><span>Metode:</span><span>${tx.paymentMethod || 'Tunai / Kasir'}</span></div>
          <div class="row"><span>Status:</span><span class="font-bold">${tx.status}</span></div>
          <div class="divider"></div>
          <div class="text-center" style="margin-top: 10px;">Terima kasih telah berlangganan layanan internet AUDIRA NET.</div>
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
              <span className="text-[var(--app-primary)] font-semibold">Semua Transaksi Masuk</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] font-sans">
                Register Transaksi & Penerimaan Kas
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Database Live
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)]">
              Buku besar penerimaan mutasi tagihan, riwayat verifikasi transaksi, dan cetak bukti pembayaran resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Refresh Trigger */}
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Perbarui Data Transaksi"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600' : ''} />
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download size={14} /> Export CSV
            </button>

            {/* Quick Action: Buat Tagihan / Kasir */}
            <button
              onClick={() => router.push('/invoice')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Buat Tagihan
            </button>
          </div>
        </div>

        {/* ─── 2. Real KPI Summary Ribbon ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* KPI 1: Total Realized Revenue */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Total Kas Masuk (Lunas)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    Rp {totalPaidNominal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Receipt size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Transaksi Berhasil</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{paidInvoices.length} Transaksi</span>
            </div>
          </div>

          {/* KPI 2: Pending Invoices */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Menunggu Pembayaran
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
                    Rp {totalPendingNominal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <Clock size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Jumlah Tagihan Pending</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{pendingInvoices.length} Inv</span>
            </div>
          </div>

          {/* KPI 3: Overdue Invoices */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Piutang Jatuh Tempo (Overdue)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
                    Rp {totalOverdueNominal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
                <XCircle size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Perlu Reminder WhatsApp</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{overdueInvoices.length} Inv</span>
            </div>
          </div>

          {/* KPI 4: Average Order Value (AOV) */}
          <div className="data-card p-4.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                  Rata-rata Nilai Transaksi
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-[var(--app-text)]">
                    Rp {averageTransaction.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <CreditCard size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--app-border)] pt-2.5 mt-3 text-[11px] text-[var(--app-text-muted)]">
              <span>Berdasarkan {paidInvoices.length} pembayaran lunas</span>
              <span className="font-mono font-bold text-[var(--app-primary)]">100% Riil</span>
            </div>
          </div>

        </div>

        {/* ─── 3. Search & Filter Bar ─────────────────────────────────────── */}
        <div className="data-card p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-dim)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nomor invoice, nama pelanggan, atau nomor telepon..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-[var(--app-primary)] transition-colors"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--app-text-muted)] font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)] cursor-pointer"
              >
                <option value="ALL">Semua Status ({invoices.length})</option>
                <option value="PAID">Lunas ({paidInvoices.length})</option>
                <option value="PENDING">Menunggu ({pendingInvoices.length})</option>
                <option value="OVERDUE">Jatuh Tempo ({overdueInvoices.length})</option>
              </select>
            </div>

            {/* Filter Metode */}
            {availableMethods.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[var(--app-text-muted)] font-medium">Metode:</span>
                <select
                  value={methodFilter}
                  onChange={(e) => {
                    setMethodFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)] cursor-pointer"
                >
                  <option value="ALL">Semua Metode</option>
                  {availableMethods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ─── 4. Live Transaction Register Table ─────────────────────────── */}
        <div className="data-card overflow-hidden">
          <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--app-text)] font-sans">
                Mutasi Pembayaran & Rekonsiliasi Tagihan
              </h3>
              <p className="text-[11px] text-[var(--app-text-muted)]">
                Daftar transaksi terdaftar di database keuangan • Menampilkan {paginatedTransactions.length} dari {filteredTransactions.length} data
              </p>
            </div>
            <button
              onClick={() => router.push('/invoice')}
              className="text-xs text-[var(--app-primary)] hover:underline font-semibold flex items-center gap-1"
            >
              Pusat Tagihan & Invoice <ChevronRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            {paginatedTransactions.length === 0 ? (
              <div className="py-14 px-4 text-center space-y-3 bg-[var(--app-card-subtle)]/30">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--app-text)]">
                    {invoices.length === 0
                      ? 'Belum Ada Transaksi Pembayaran Masuk'
                      : 'Tidak Ada Transaksi yang Cocok dengan Kriteria Pencarian'}
                  </p>
                  <p className="text-xs text-[var(--app-text-muted)] max-w-md mx-auto mt-1">
                    {invoices.length === 0
                      ? 'Database transaksi siap beroperasi. Buat tagihan baru atau tandai tagihan yang telah dibayar oleh pelanggan.'
                      : 'Coba ubah kata kunci pencarian atau sesuaikan filter status di atas.'}
                  </p>
                </div>
                {invoices.length === 0 && (
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      onClick={() => router.push('/invoice')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus size={14} /> Terbitkan Tagihan Pertama
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--app-card-subtle)] border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">No. Invoice</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Jatuh Tempo</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {tx.invoiceNumber || tx.id.substring(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[var(--app-text)]">
                            {tx.customer?.name || tx.customerName || 'Pelanggan'}
                          </p>
                          <p className="text-[10px] text-[var(--app-text-muted)] font-mono">
                            {tx.customer?.internetNumber || tx.customer?.phone || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--app-text)]">
                        Rp {(Number(tx.amount) || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-[var(--app-text-muted)]">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">
                          <CreditCard size={11} className="text-blue-500" />
                          {tx.paymentMethod || 'Kasir / Tunai'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--app-text-muted)] font-mono text-[11px]">
                        {tx.dueDate ? new Date(tx.dueDate).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          tx.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : tx.status === 'OVERDUE'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                          {tx.status === 'PAID' ? 'LUNAS' : tx.status === 'OVERDUE' ? 'JATUH TEMPO' : 'MENUNGGU'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 text-[var(--app-text-muted)] hover:text-blue-600 rounded bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] border border-[var(--app-border)] transition-colors"
                            title="Lihat Detail Transaksi"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(tx)}
                            className="p-1.5 text-[var(--app-text-muted)] hover:text-emerald-600 rounded bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] border border-[var(--app-border)] transition-colors"
                            title="Cetak Struk Thermal"
                          >
                            <Printer size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-3.5 border-t border-[var(--app-border)] flex items-center justify-between text-xs text-[var(--app-text-muted)]">
              <span>Halaman {currentPage} dari {totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-[var(--app-border)] bg-[var(--app-card-subtle)] disabled:opacity-40"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="px-2 font-mono font-semibold text-[var(--app-text)]">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-[var(--app-border)] bg-[var(--app-card-subtle)] disabled:opacity-40"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── 5. Transaction Detail Modal ─────────────────────────────────── */}
        {showDetailModal && selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] font-sans">
                    Detail Mutasi Pembayaran
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

              <div className="p-5 space-y-3.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Status Tagihan:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                    selectedTx.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}>
                    {selectedTx.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Nama Pelanggan:</span>
                  <span className="font-semibold text-[var(--app-text)]">
                    {selectedTx.customer?.name || selectedTx.customerName || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">ID / No. Internet:</span>
                  <span className="font-mono text-[var(--app-text)]">
                    {selectedTx.customer?.internetNumber || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Telepon:</span>
                  <span className="font-mono text-[var(--app-text)]">
                    {selectedTx.customer?.phone || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Metode Pembayaran:</span>
                  <span className="font-semibold text-[var(--app-text)]">
                    {selectedTx.paymentMethod || 'Tunai / Kasir Lapangan'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Tanggal Terbit:</span>
                  <span className="font-mono text-[var(--app-text)]">
                    {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString('id-ID') : '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-text-muted)]">Tanggal Jatuh Tempo:</span>
                  <span className="font-mono text-[var(--app-text)]">
                    {selectedTx.dueDate ? new Date(selectedTx.dueDate).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--app-card-subtle)] rounded-lg border border-[var(--app-border)] flex justify-between items-center">
                  <span className="font-semibold text-[var(--app-text-muted)]">Total Tagihan</span>
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
