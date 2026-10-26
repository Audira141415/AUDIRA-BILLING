import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Smartphone,
  CreditCard,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  Info,
  ChevronDown,
  Upload,
  X
} from 'lucide-react';

interface RefundVoidRow {
  id: string;
  date: string;
  type: 'Refund' | 'Void';
  refNo: string;
  invoiceNo: string;
  customerName: string;
  method: string;
  amount: number;
  percentage: number;
  status: 'Selesai' | 'Proses' | 'Dibatalkan';
  reason: string;
}

const initialRefundVoids: RefundVoidRow[] = [
  { id: '1', date: '26/10/2026 08:32', type: 'Refund', refNo: 'RFND-20261026-0001', invoiceNo: 'INV/2026/10/0012', customerName: 'Budi Santoso', method: 'Transfer Bank - BCA', amount: 1200000, percentage: 100, status: 'Selesai', reason: 'Permintaan Customer' },
  { id: '2', date: '26/10/2026 08:16', type: 'Void', refNo: 'VOID-20261026-0002', invoiceNo: 'INV/2026/10/0011', customerName: 'Siti Aminah', method: 'QRIS Gopay', amount: 450000, percentage: 100, status: 'Selesai', reason: 'Salah Input' },
  { id: '3', date: '25/10/2026 07:58', type: 'Refund', refNo: 'RFND-20261025-0003', invoiceNo: 'INV/2026/10/0010', customerName: 'Andi Pratama', method: 'Transfer Bank - BRI', amount: 1100000, percentage: 50, status: 'Selesai', reason: 'Kelebihan Bayar' },
  { id: '4', date: '25/10/2026 07:40', type: 'Void', refNo: 'VOID-20261025-0004', invoiceNo: 'INV/2026/10/0009', customerName: 'Dewi Lestari', method: 'OVO', amount: 350000, percentage: 100, status: 'Selesai', reason: 'Duplikat Invoice' },
  { id: '5', date: '24/10/2026 07:22', type: 'Refund', refNo: 'RFND-20261024-0005', invoiceNo: 'INV/2026/10/0008', customerName: 'Fajar Nugroho', method: 'DANA', amount: 900000, percentage: 20, status: 'Proses', reason: 'Partial Refund' },
  { id: '6', date: '24/10/2026 06:51', type: 'Refund', refNo: 'RFND-20261024-0006', invoiceNo: 'INV/2026/10/0007', customerName: 'Nina Wulandari', method: 'Transfer Bank - BCA', amount: 250000, percentage: 100, status: 'Selesai', reason: 'Batal Langganan' },
  { id: '7', date: '23/10/2026 06:45', type: 'Void', refNo: 'VOID-20261023-0007', invoiceNo: 'INV/2026/10/0006', customerName: 'Yudi Hermawan', method: 'Virtual Account - BCA', amount: 1300000, percentage: 100, status: 'Selesai', reason: 'Salah Paket' },
  { id: '8', date: '22/10/2026 16:12', type: 'Refund', refNo: 'RFND-20261022-0008', invoiceNo: 'INV/2026/10/0099', customerName: 'PT. Maju Bersama', method: 'Transfer Bank - Mandiri', amount: 3500000, percentage: 30, status: 'Proses', reason: 'Kelebihan Bayar' },
  { id: '9', date: '22/10/2026 15:31', type: 'Void', refNo: 'VOID-20261022-0009', invoiceNo: 'INV/2026/10/0098', customerName: 'CV. Sinar Abadi', method: 'QRIS ShopeePay', amount: 1100000, percentage: 100, status: 'Selesai', reason: 'Pembatalan Order' },
  { id: '10', date: '21/10/2026 14:46', type: 'Refund', refNo: 'RFND-20261021-0010', invoiceNo: 'INV/2026/10/0097', customerName: 'Rina Marlina', method: 'ShopeePay', amount: 750000, percentage: 25, status: 'Selesai', reason: 'Partial Refund' }
];

export default function PaymentRefundsPage() {
  const [data, setData] = useState<RefundVoidRow[]>(initialRefundVoids);
  const [activeTab, setActiveTab] = useState<'Semua' | 'Refund' | 'Void'>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [methodFilter, setMethodFilter] = useState('Semua Metode');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [detailModal, setDetailModal] = useState<RefundVoidRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<'Refund' | 'Void'>('Refund');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    invoiceNo: '',
    method: 'Transfer Bank - BCA',
    amount: 250000,
    reason: 'Kelebihan Bayar'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter
  const filteredData = data.filter(d => {
    const matchTab = activeTab === 'Semua' || d.type === activeTab;
    const matchSearch = d.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Semua Status' || d.status === statusFilter;
    const matchMethod = methodFilter === 'Semua Metode' || d.method.includes(methodFilter);
    return matchTab && matchSearch && matchStatus && matchMethod;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = (type: 'Refund' | 'Void') => {
    setCreateType(type);
    setFormData({
      customerName: '',
      invoiceNo: '',
      method: type === 'Void' ? 'QRIS' : 'Transfer Bank - BCA',
      amount: 150000,
      reason: type === 'Void' ? 'Salah Input / Duplikat' : 'Permintaan Customer'
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const newRow: RefundVoidRow = {
      id: Date.now().toString(),
      date: 'Baru saja',
      type: createType,
      refNo: `${createType === 'Refund' ? 'RFND' : 'VOID'}-20261026-${String(data.length + 1).padStart(4, '0')}`,
      invoiceNo: formData.invoiceNo || 'INV/2026/10/0099',
      customerName: formData.customerName,
      method: formData.method,
      amount: Number(formData.amount) || 100000,
      percentage: 100,
      status: createType === 'Void' ? 'Selesai' : 'Proses',
      reason: formData.reason
    };

    setData([newRow, ...data]);
    setIsCreateOpen(false);
    showToast(`${createType} ${newRow.refNo} berhasil diproses!`);
  };

  const handleExportCSV = () => {
    const headers = ['Nomor Referensi', 'Invoice', 'Tipe', 'Nama Customer', 'Metode Pembayaran', 'Nilai', 'Status', 'Alasan', 'Tanggal'];
    const rows = filteredData.map(c => [
      c.refNo,
      c.invoiceNo,
      c.type,
      `"${c.customerName.replace(/"/g, '""')}"`,
      `"${c.method}"`,
      c.amount,
      c.status,
      `"${c.reason.replace(/"/g, '""')}"`,
      c.date
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `payment_refund_void_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Refund & Void berhasil diekspor ke CSV.');
  };

  // KPIs
  const totalRefundAmount = data.filter(d => d.type === 'Refund').reduce((acc, d) => acc + d.amount, 0);
  const totalVoidAmount = data.filter(d => d.type === 'Void').reduce((acc, d) => acc + d.amount, 0);
  const refundCount = data.filter(d => d.type === 'Refund').length;
  const voidCount = data.filter(d => d.type === 'Void').length;

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400">
            <CheckCircle size={18} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/payment" className="hover:text-[var(--app-text)]">Manajemen Pembayaran</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Refund & Void</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Refund & Pembatalan Transaksi (Void)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Log pengembalian dana gateway Midtrans / Xendit / Bank Transfer dan pembatalan transaksi salah bayar.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/payment/transactions"
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/30 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-xl transition-all"
            >
              Semua Transaksi
            </Link>
            <button 
              onClick={() => handleOpenCreate('Refund')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Plus size={15} />
              <span>Buat Refund</span>
            </button>
            <button 
              onClick={() => handleOpenCreate('Void')}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <XCircle size={15} />
              <span>Void Transaksi</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Refund</p>
              <p className="text-lg font-black text-purple-500 mt-0.5">{formatCurrency(totalRefundAmount)}</p>
              <p className="text-[9px] text-[var(--app-muted)]">{refundCount} transaksi</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
              <XCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Void</p>
              <p className="text-lg font-black text-red-500 mt-0.5">{formatCurrency(totalVoidAmount)}</p>
              <p className="text-[9px] text-[var(--app-muted)]">{voidCount} transaksi dibatalkan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Selesai Diproses</p>
              <p className="text-xl font-black text-teal-500 mt-0.5">
                {data.filter(d => d.status === 'Selesai').length}
              </p>
              <p className="text-[9px] text-[var(--app-muted)]">Dana terkirim kembali</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Kasus</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{data.length}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Refund & Void</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, referensi..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <select 
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[130px]"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Proses">Proses</option>
            </select>

            <select 
              value={methodFilter}
              onChange={e => { setMethodFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[130px]"
            >
              <option value="Semua Metode">Semua Metode</option>
              <option value="BCA">BCA</option>
              <option value="Mandiri">Mandiri</option>
              <option value="BRI">BRI</option>
              <option value="QRIS">QRIS</option>
              <option value="DANA">DANA / E-Wallet</option>
            </select>

            {(searchTerm || statusFilter !== 'Semua Status' || methodFilter !== 'Semua Metode') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('Semua Status'); setMethodFilter('Semua Metode'); }}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all"
            >
              <Download size={13} className="text-green-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card with internal Sub-tabs */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              
              {/* Tabs row */}
              <div className="flex border-b border-[var(--app-border)] bg-[var(--app-card)] text-xs font-bold text-[var(--app-muted)] overflow-x-auto">
                {(['Semua', 'Refund', 'Void'] as const).map(tab => {
                  const isActive = activeTab === tab;
                  const count = tab === 'Semua' ? data.length : data.filter(d => d.type === tab).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                      className={`py-3 px-5 border-b-2 transition-all flex items-center gap-1.5 ${
                        isActive ? 'border-blue-500 text-blue-500 font-bold' : 'border-transparent hover:text-[var(--app-text)]'
                      }`}
                    >
                      <span>{tab}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] text-[var(--app-muted)]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3.5 w-12 text-center">NO</th>
                      <th className="p-3.5">TANGGAL</th>
                      <th className="p-3.5 w-20 text-center">TIPE</th>
                      <th className="p-3.5 w-36">REFERENSI</th>
                      <th className="p-3.5 w-32">INVOICE</th>
                      <th className="p-3.5">CUSTOMER</th>
                      <th className="p-3.5">METODE</th>
                      <th className="p-3.5 text-right">NILAI</th>
                      <th className="p-3.5 w-20 text-center">STATUS</th>
                      <th className="p-3.5 text-center w-20">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[var(--app-muted)]">
                          Tidak ada data yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((d, idx) => (
                        <tr key={d.id} className="hover:bg-[var(--app-border)]/20 transition-colors">
                          <td className="p-3.5 text-center text-[var(--app-muted)] font-mono">
                            {(currentPage - 1) * pageSize + idx + 1}
                          </td>
                          <td className="p-3.5 text-[var(--app-muted)] text-[11px] whitespace-nowrap">{d.date}</td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              d.type === 'Refund'
                                ? 'bg-purple-500/10 text-purple-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}>
                              {d.type}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-[var(--app-muted)]">{d.refNo}</td>
                          <td className="p-3.5 font-mono font-semibold text-blue-500">{d.invoiceNo}</td>
                          <td className="p-3.5 font-bold text-[var(--app-text)]">{d.customerName}</td>
                          <td className="p-3.5 text-[var(--app-muted)] text-[11px]">{d.method}</td>
                          <td className="p-3.5 text-right font-bold text-green-500">{formatCurrency(d.amount)}</td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              d.status === 'Selesai' ? 'bg-teal-500/10 text-teal-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <button 
                              onClick={() => setDetailModal(d)}
                              title="Lihat Detail"
                              className="p-1.5 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-blue-500 transition-colors"
                            >
                              <Eye size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-[var(--app-card)]">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-[var(--app-text)]">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredData.length)}</span> dari <span className="font-semibold text-[var(--app-text)]">{filteredData.length}</span> data
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold border transition-all ${
                        currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat Transaksi</h3>
              
              <div className="space-y-2 text-xs font-bold">
                <button 
                  onClick={() => handleOpenCreate('Refund')}
                  className="w-full flex items-center gap-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border border-purple-500/20 p-3 rounded-xl transition-all"
                >
                  <Wallet size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">Pengembalian Dana</p>
                    <p className="text-[9px] opacity-80 font-normal">Buat refund untuk transaksi sukses</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleOpenCreate('Void')}
                  className="w-full flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 p-3 rounded-xl transition-all"
                >
                  <XCircle size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">Void Pembatalan</p>
                    <p className="text-[9px] opacity-80 font-normal">Batalkan invoice salah/duplikat</p>
                  </div>
                </button>

                <button 
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-3 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] p-3 rounded-xl transition-all"
                >
                  <Download size={16} className="text-green-500" />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">Unduh Laporan CSV</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-normal">Rekap mutasi refund & void</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ─── MODAL: Buat Refund/Void ───────────────────────────────────── */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Plus size={16} className={createType === 'Refund' ? 'text-purple-500' : 'text-red-500'} />
                  Proses {createType} Baru
                </h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Nama Pelanggan *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Nomor Invoice</label>
                  <input 
                    type="text"
                    placeholder="INV/2026/10/0045"
                    value={formData.invoiceNo}
                    onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Nominal (Rp) *</label>
                    <input 
                      type="number"
                      required
                      min={1000}
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Metode</label>
                    <select 
                      value={formData.method}
                      onChange={e => setFormData({ ...formData, method: e.target.value })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)]"
                    >
                      <option value="Transfer Bank - BCA">Transfer Bank - BCA</option>
                      <option value="Transfer Bank - Mandiri">Transfer Bank - Mandiri</option>
                      <option value="QRIS Gopay">QRIS Gopay</option>
                      <option value="DANA">DANA</option>
                      <option value="OVO">OVO</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Alasan</label>
                  <input 
                    type="text"
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className={`px-4 py-2 text-white rounded-xl font-bold shadow-md ${
                      createType === 'Refund' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Eksekusi {createType}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Detail ─────────────────────────────────────────────── */}
        {detailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Transaksi {detailModal.type}</h3>
                <button onClick={() => setDetailModal(null)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">No. Referensi</span>
                  <span className="font-mono font-bold text-blue-500">{detailModal.refNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Invoice Rujukan</span>
                  <span className="font-mono">{detailModal.invoiceNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nama Pelanggan</span>
                  <span className="font-bold text-[var(--app-text)]">{detailModal.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Metode Pembayaran</span>
                  <span>{detailModal.method}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nominal</span>
                  <span className="font-bold font-mono text-green-500">{formatCurrency(detailModal.amount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Alasan</span>
                  <span>{detailModal.reason}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-muted)]">Status</span>
                  <span className="font-semibold">{detailModal.status}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl font-semibold flex items-center gap-1.5 text-xs"
                >
                  <FileText size={13} />
                  <span>Cetak Bukti</span>
                </button>
                <button 
                  onClick={() => setDetailModal(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
