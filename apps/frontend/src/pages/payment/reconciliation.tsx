import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/Pagination';
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
  X,
  Check
} from 'lucide-react';

interface ReconRow {
  id: string;
  date: string;
  refNo: string;
  channel: string;
  method: string;
  invoiceNo: string;
  customerName: string;
  amount: number;
  status: 'Cocok' | 'Selisih' | 'Tidak Cocok' | 'Duplikat';
  diffAmount: number;
}

const mockRecons: ReconRow[] = [
  { id: '1', date: '22/10/2026 08:32', refNo: 'TRX-20260701-0001', channel: 'Mobile Banking', method: 'Transfer Bank - BCA', invoiceNo: 'INV/2026/07/0012', customerName: 'Budi Santoso', amount: 1200000, status: 'Cocok', diffAmount: 0 },
  { id: '2', date: '22/10/2026 08:16', refNo: 'TRX-20260701-0002', channel: 'QR Code', method: 'QRIS', invoiceNo: 'INV/2026/07/0011', customerName: 'Siti Aminah', amount: 450000, status: 'Cocok', diffAmount: 0 },
  { id: '3', date: '22/10/2026 07:58', refNo: 'TRX-20260701-0003', channel: 'Internet Banking', method: 'Transfer Bank - BRI', invoiceNo: 'INV/2026/07/0010', customerName: 'Andi Pratama', amount: 2200000, status: 'Cocok', diffAmount: 0 },
  { id: '4', date: '22/10/2026 07:40', refNo: 'TRX-20260701-0004', channel: 'E-Wallet', method: 'OVO', invoiceNo: 'INV/2026/07/0009', customerName: 'Dewi Lestari', amount: 350000, status: 'Selisih', diffAmount: 50000 },
  { id: '5', date: '22/10/2026 07:22', refNo: 'TRX-20260701-0005', channel: 'E-Wallet', method: 'DANA', invoiceNo: 'INV/2026/07/0008', customerName: 'Fajar Nugroho', amount: 900000, status: 'Tidak Cocok', diffAmount: 900000 },
  { id: '6', date: '22/10/2026 06:51', refNo: 'TRX-20260701-0006', channel: 'Mobile Banking', method: 'Transfer Bank - BCA', invoiceNo: 'INV/2026/07/0007', customerName: 'Nina Wulandari', amount: 250000, status: 'Cocok', diffAmount: 0 },
  { id: '7', date: '22/10/2026 06:45', refNo: 'TRX-20260701-0007', channel: 'Virtual Account', method: 'VA BCA', invoiceNo: 'INV/2026/07/0006', customerName: 'Yudi Hermawan', amount: 1300000, status: 'Cocok', diffAmount: 0 },
  { id: '8', date: '30/06/2026 16:12', refNo: 'TRX-20260630-0001', channel: 'Internet Banking', method: 'Transfer Bank - Mandiri', invoiceNo: 'INV/2026/06/0099', customerName: 'PT. Maju Bersama', amount: 3500000, status: 'Cocok', diffAmount: 0 },
  { id: '9', date: '30/06/2026 15:31', refNo: 'TRX-20260630-0002', channel: 'QR Code', method: 'QRIS', invoiceNo: 'INV/2026/06/0098', customerName: 'CV. Sinar Abadi', amount: 1100000, status: 'Selisih', diffAmount: 10000 },
  { id: '10', date: '30/06/2026 14:46', refNo: 'TRX-20260630-0003', channel: 'E-Wallet', method: 'ShopeePay', invoiceNo: 'INV/2026/06/0097', customerName: 'Rina Marlina', amount: 750000, status: 'Duplikat', diffAmount: 0 }
];

export default function PaymentReconciliationPage() {
  const { toast } = useToast();
  const [recons, setRecons] = useState<ReconRow[]>(mockRecons);
  const [activeTab, setActiveTab] = useState('Semua');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('Semua Channel');
  const [methodFilter, setMethodFilter] = useState('Semua Metode');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [selectedDetailItem, setSelectedDetailItem] = useState<ReconRow | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAutoReconciling, setIsAutoReconciling] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      Semua: recons.length,
      Cocok: recons.filter(r => r.status === 'Cocok').length,
      'Tidak Cocok': recons.filter(r => r.status === 'Tidak Cocok').length,
      Selisih: recons.filter(r => r.status === 'Selisih').length,
      Duplikat: recons.filter(r => r.status === 'Duplikat').length,
    };
  }, [recons]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return recons.filter((item) => {
      // Tab filter
      if (activeTab !== 'Semua' && item.status !== activeTab) return false;

      // Dropdown filters
      if (channelFilter !== 'Semua Channel' && !item.channel.toLowerCase().includes(channelFilter.toLowerCase())) return false;
      if (methodFilter !== 'Semua Metode' && !item.method.toLowerCase().includes(methodFilter.toLowerCase())) return false;
      if (statusFilter !== 'Semua Status' && item.status !== statusFilter) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchRef = item.refNo.toLowerCase().includes(query);
        const matchInvoice = item.invoiceNo.toLowerCase().includes(query);
        const matchCustomer = item.customerName.toLowerCase().includes(query);
        if (!matchRef && !matchInvoice && !matchCustomer) return false;
      }

      return true;
    });
  }, [recons, activeTab, channelFilter, methodFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedData = filteredData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // Auto Reconcile Action
  const handleRunAutoReconcile = () => {
    setIsAutoReconciling(true);
    toast.info('Memulai pemindaian mutasi rekening koran BCA, BRI, Mandiri & QRIS...');
    setTimeout(() => {
      setRecons(prev => prev.map(item => {
        if (item.status === 'Selisih' || item.status === 'Tidak Cocok') {
          return { ...item, status: 'Cocok', diffAmount: 0 };
        }
        return item;
      }));
      setIsAutoReconciling(false);
      toast.success('Rekonsiliasi otomatis selesai! 100% mutasi terverifikasi cocok.');
    }, 1500);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.warning('Tidak ada data rekonsiliasi untuk diekspor.');
      return;
    }
    const headers = ['No', 'Tanggal', 'Referensi Mutasi', 'Channel', 'Metode', 'No Invoice', 'Customer', 'Nominal', 'Status', 'Selisih'];
    const rows = filteredData.map((d, idx) => [
      idx + 1,
      `"${d.date}"`,
      `"${d.refNo}"`,
      `"${d.channel}"`,
      `"${d.method}"`,
      `"${d.invoiceNo}"`,
      `"${d.customerName.replace(/"/g, '""')}"`,
      d.amount,
      `"${d.status}"`,
      d.diffAmount
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekonsiliasi_bank_audira_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Berhasil mengunduh laporan rekonsiliasi (${filteredData.length} baris).`);
  };

  // Manual Status Change
  const handleUpdateStatus = (id: string, newStatus: ReconRow['status']) => {
    setRecons(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          diffAmount: newStatus === 'Cocok' ? 0 : item.diffAmount || 50000
        };
      }
      return item;
    }));
    if (selectedDetailItem && selectedDetailItem.id === id) {
      setSelectedDetailItem(p => p ? { ...p, status: newStatus, diffAmount: newStatus === 'Cocok' ? 0 : p.diffAmount || 50000 } : null);
    }
    toast.success(`Status transaksi berhasil diperbarui menjadi ${newStatus}.`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/payment" className="hover:text-[var(--app-text)]">Kasir & Pembayaran</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Rekonsiliasi Bank</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Rekonsiliasi Mutasi Bank & Settlement Gateway
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pencocokan otomatis antara data mutasi rekening koran, settlement payment gateway, dan data invoice terbit.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/finance/rekonsiliasi" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Rekonsiliasi Akuntansi</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Transaksi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Transaksi</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.847</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+12.5% dari periode lalu</span>
              </p>
            </div>
          </div>

          {/* Card 2: Sudah Rekonsiliasi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Sudah Rekonsiliasi</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">2.612</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">91.75% dari total</p>
            </div>
          </div>

          {/* Card 3: Belum Rekonsiliasi */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Belum Rekonsiliasi</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">183</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">6.43% dari total</p>
            </div>
          </div>

          {/* Card 4: Tidak Cocok */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Tidak Cocok</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">52</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">1.82% dari total</p>
            </div>
          </div>

          {/* Card 5: Total Nilai */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Nilai</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">Rp 2.847.560.000</p>
              <p className="text-[10px] text-green-400 mt-0.5 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>+15.2% dari periode lalu</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date range */}
            <div className="flex items-center gap-2 bg-[var(--app-bg)] border border-[var(--app-border)] px-3 py-2.5 rounded-xl text-xs text-[var(--app-text)]/80">
              <Calendar size={14} className="text-[var(--app-muted)]" />
              <span>01/06/2026 - 22/10/2026</span>
            </div>

            <select
              value={channelFilter}
              onChange={(e) => { setChannelFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]"
            >
              <option value="Semua Channel">Semua Channel</option>
              <option value="Mobile Banking">Mobile Banking</option>
              <option value="Internet Banking">Internet Banking</option>
              <option value="QR Code">QR Code</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Virtual Account">Virtual Account</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]"
            >
              <option value="Semua Metode">Semua Metode</option>
              <option value="BCA">BCA</option>
              <option value="Mandiri">Mandiri</option>
              <option value="BRI">BRI</option>
              <option value="QRIS">QRIS</option>
              <option value="OVO">OVO</option>
              <option value="DANA">DANA</option>
              <option value="ShopeePay">ShopeePay</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Cocok">Cocok</option>
              <option value="Tidak Cocok">Tidak Cocok</option>
              <option value="Selisih">Selisih</option>
              <option value="Duplikat">Duplikat</option>
            </select>
            
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari referensi, invoice, customer..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setChannelFilter('Semua Channel');
                setMethodFilter('Semua Metode');
                setStatusFilter('Semua Status');
                setActiveTab('Semua');
                setCurrentPage(1);
                toast.info('Filter direset ke nilai awal.');
              }}
              className="text-xs text-[var(--app-muted)] hover:text-[var(--app-text)] font-semibold px-3 py-2 border border-[var(--app-border)] rounded-xl transition"
            >
              Reset
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table and Bottom Widgets */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card with internal Sub-tabs */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              
              {/* Tabs row */}
              <div className="flex border-b border-[var(--app-border)] bg-[var(--app-card-subtle)] text-xs font-bold text-[var(--app-muted)] overflow-x-auto">
                {[
                  { label: 'Semua', count: tabCounts.Semua },
                  { label: 'Cocok', count: tabCounts.Cocok },
                  { label: 'Tidak Cocok', count: tabCounts['Tidak Cocok'] },
                  { label: 'Selisih', count: tabCounts.Selisih },
                  { label: 'Duplikat', count: tabCounts.Duplikat }
                ].map(tab => {
                  const isActive = activeTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => { setActiveTab(tab.label); setCurrentPage(1); }}
                      className={`py-3 px-5 border-b-2 transition-all flex items-center gap-1.5 ${
                        isActive ? 'border-blue-500 text-[var(--app-text)] font-bold' : 'border-transparent hover:text-[var(--app-text)]/80'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#0052cc] text-white' : 'bg-[var(--app-bg)] text-[var(--app-muted)]'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4">TANGGAL</th>
                      <th className="p-4">REFERENSI</th>
                      <th className="p-4">CHANNEL</th>
                      <th className="p-4">METODE</th>
                      <th className="p-4">INVOICE</th>
                      <th className="p-4">CUSTOMER</th>
                      <th className="p-4">NILAI</th>
                      <th className="p-4">STATUS REKONSILIASI</th>
                      <th className="p-4">SELISIH</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-xs text-[var(--app-muted)]">
                          Tidak ditemukan data transaksi mutasi yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((d, idx) => (
                        <tr key={d.id} className="hover:bg-[var(--app-border)]/20 transition-colors">
                          <td className="p-4 text-[var(--app-muted)] font-medium">{(safeCurrentPage - 1) * pageSize + idx + 1}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.date}</td>
                          <td className="p-4 font-mono font-semibold text-[var(--app-muted)]">{d.refNo}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{d.channel}</td>
                          <td className="p-4 text-[var(--app-muted)] font-medium">{d.method}</td>
                          <td className="p-4 font-mono font-semibold text-blue-400">{d.invoiceNo}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{d.customerName}</td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.amount)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              d.status === 'Cocok' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : d.status === 'Selisih'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : d.status === 'Tidak Cocok'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.diffAmount)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedDetailItem(d)}
                                title="Lihat Detail Rekonsiliasi"
                                className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
                              >
                                <Eye size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  totalItems={filteredData.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Sumber Data */}
              <div className="md:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Sumber Data</h4>
                
                <div className="space-y-3.5 text-xs font-bold text-[var(--app-muted)]">
                  {[
                    { name: 'BCA (Mobile Banking)', tx: 650, amount: 1250500000 },
                    { name: 'Mandiri (Internet Banking)', tx: 420, amount: 850300000 },
                    { name: 'BRI (Internet Banking)', tx: 380, amount: 720150000 },
                    { name: 'QRIS', tx: 520, amount: 480250000 },
                    { name: 'E-Wallet (OVO, DANA, ShopeePay)', tx: 877, amount: 1050360000 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5 border-b border-[var(--app-border)]/40 last:border-0 pb-1.5">
                      <span className="text-white">{item.name}</span>
                      <div className="text-right">
                        <span className="text-[var(--app-muted)] font-semibold">{item.tx} Transaksi</span>
                        <span className="text-white ml-3">{formatCurrency(item.amount)}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-2.5 font-black border-t border-[var(--app-border)] text-white">
                    <span>Total</span>
                    <div className="text-right">
                      <span className="text-[var(--app-muted)]">2.847 Transaksi</span>
                      <span className="ml-3 text-blue-400">{formatCurrency(4351560000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafik Rekonsiliasi (30 Hari Terakhir) */}
              <div className="md:col-span-7 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Grafik Rekonsiliasi (30 Hari Terakhir)</h4>
                
                <div className="h-36 w-full mt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                    
                    <text x="5" y="16" fill="#4a5568" fontSize="7" fontWeight="bold">400</text>
                    <text x="5" y="46" fill="#4a5568" fontSize="7" fontWeight="bold">200</text>
                    <text x="5" y="76" fill="#4a5568" fontSize="7" fontWeight="bold">100</text>
                    
                    {/* Lines */}
                    <path d="M20,38 L60,50 L100,45 L140,40 L180,48 L220,30 L260,25" fill="none" stroke="#10b981" strokeWidth="2" />
                    <path d="M20,80 L60,82 L100,78 L140,85 L180,72 L220,68 L260,65" fill="none" stroke="#f97316" strokeWidth="1.5" />
                    <path d="M20,95 L60,92 L100,95 L140,90 L180,92 L220,89 L260,88" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                    <path d="M20,98 L60,99 L100,98 L140,99 L180,98 L220,99 L260,98" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    
                    <text x="15" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">02 Jun</text>
                    <text x="55" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">06 Jun</text>
                    <text x="95" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">10 Jun</text>
                    <text x="135" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">14 Jun</text>
                    <text x="175" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">18 Jun</text>
                    <text x="215" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">22 Jun</text>
                    <text x="255" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">26 Jun</text>
                    <text x="285" y="96" fill="#4a5568" fontSize="7" fontWeight="bold">01 Jul</text>
                  </svg>
                </div>

                <div className="flex justify-center gap-3.5 text-[8px] text-[var(--app-muted)] font-bold uppercase pt-1">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-green-500 inline-block"></span>Cocok</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>Tidak Cocok</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span>Selisih</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span>Duplikat</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Rekonsiliasi Donut */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Rekonsiliasi</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Cocok: 71.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray="71.6 28.4" 
                    strokeDashoffset="0" 
                  />

                  {/* Tidak Cocok: 28.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray="28.4 71.6" 
                    strokeDashoffset="-71.6" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-base font-black text-[var(--app-text)] leading-none">183</p>
                  <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase mt-0.5">Total Transaksi</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[10px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-green-500" />Cocok</span>
                  <span className="text-[var(--app-text)] font-bold">131 (71.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500" />Tidak Cocok</span>
                  <span className="text-[var(--app-text)] font-bold">52 (28.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-orange-500" />Selisih</span>
                  <span className="text-[var(--app-text)] font-bold">28 (15.3%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-purple-550 bg-purple-500" />Duplikat</span>
                  <span className="text-[var(--app-text)] font-bold">12 (6.6%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-gray-500" />Belum Rekonsiliasi</span>
                  <span className="text-[var(--app-text)] font-bold">183 (100%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Ringkasan Nilai */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Nilai</h3>
              
              <div className="space-y-3 text-xs text-[var(--app-muted)] font-semibold pt-1">
                <div className="flex justify-between">
                  <span>Total Nilai Masuk</span>
                  <span className="text-[var(--app-text)] font-bold">Rp 2.847.560.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Cocok</span>
                  <span className="text-green-400">Rp 2.612.850.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Tidak Cocok</span>
                  <span className="text-red-400">Rp 156.230.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Selisih</span>
                  <span className="text-orange-400">Rp 78.480.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Belum Rekonsiliasi</span>
                  <span className="text-[var(--app-muted)]">Rp 183.000.000</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[var(--app-border)] items-center">
                  <span>Persentase Cocok</span>
                  <span className="text-green-400 font-black text-sm">91.75%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Aktivitas Terbaru */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aktivitas Terbaru</h3>
              
              <div className="relative border-l border-[var(--app-border)] ml-2 pl-4 space-y-4 text-[9px] text-[var(--app-muted)] font-bold">
                {[
                  { title: 'Rekonsiliasi otomatis dijalankan', time: '22/10/2026 08:32 WIB' },
                  { title: 'Pembayaran TRX-20260701-0004 ditandai selisih', time: '22/10/2026 07:40 WIB' },
                  { title: 'Pembayaran TRX-20260701-0005 ditandai tidak cocok', time: '22/10/2026 07:22 WIB' },
                  { title: 'Statement BCA diimport', time: '22/10/2026 06:30 WIB' },
                  { title: 'Rekonsiliasi manual dilakukan oleh Agus Dwi Rianto', time: '22/10/2026 06:15 WIB' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-[var(--app-border)] bg-blue-500"></span>
                    <span className="text-white block leading-none">{item.title}</span>
                    <span className="text-[var(--app-muted)] text-[8px] font-semibold mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => toast.info("Menampilkan semua log aktivitas rekonsiliasi pembayaran.")} className="w-full text-center text-xs font-bold text-blue-500 hover:underline pt-2 border-t border-[var(--app-border)] block">
                Lihat Semua Aktivitas &rarr;
              </button>
            </div>

            {/* Card 4: Aksi Cepat */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat</h3>
              
              <div className="space-y-2 text-[10px] font-bold text-[var(--app-muted)]">
                <div
                  onClick={handleRunAutoReconcile}
                  className="flex items-center justify-between p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-card-subtle)] cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold leading-none flex items-center gap-1.5">
                      {isAutoReconciling && <RefreshCw size={11} className="animate-spin text-blue-500" />}
                      Jalankan Rekonsiliasi Otomatis
                    </p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Cocokkan transaksi rekening & gateway massal</p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-muted)]" />
                </div>

                <div
                  onClick={() => {
                    setActiveTab('Tidak Cocok');
                    setCurrentPage(1);
                    toast.info('Menampilkan daftar transaksi yang butuh rekonsiliasi manual.');
                  }}
                  className="flex items-center justify-between p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-card-subtle)] cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold leading-none">Rekonsiliasi Manual</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Pilih dan cocokkan transaksi tidak cocok/selisih</p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-muted)]" />
                </div>

                <div
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center justify-between p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-card-subtle)] cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold leading-none">Upload Statement Bank</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Import rekening koran BCA/BRI/Mandiri (CSV/Excel)</p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-muted)]" />
                </div>

                <div
                  onClick={handleExportCSV}
                  className="flex items-center justify-between p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl hover:bg-[var(--app-card-subtle)] cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-[var(--app-text)] font-bold leading-none">Download Laporan Rekonsiliasi</p>
                    <p className="text-[8px] text-[var(--app-muted)] font-normal mt-0.5">Export laporan hasil rekonsiliasi ke CSV</p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--app-muted)]" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal: Upload Statement Rekening Koran */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Upload Mutasi Bank / Statement</h3>
                    <p className="text-[10px] text-[var(--app-muted)]">Format didukung: CSV, XLSX rekening koran</p>
                  </div>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Pilih Rekening Bank</label>
                  <select className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none">
                    <option>BCA - 1234567890 (PT. Audira NET Indonesia)</option>
                    <option>Mandiri - 9876543210 (PT. Audira NET Indonesia)</option>
                    <option>BRI - 5544332211 (PT. Audira NET Indonesia)</option>
                    <option>QRIS Settlement Merchant</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-[var(--app-border)] hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition bg-[var(--app-bg)]">
                  <Upload size={24} className="mx-auto text-[var(--app-muted)] mb-2" />
                  <p className="font-semibold text-xs text-[var(--app-text)]">Klik atau seret file CSV/XLSX mutasi ke sini</p>
                  <p className="text-[10px] text-[var(--app-muted)] mt-1">Maksimal ukuran file 15 MB</p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      handleRunAutoReconcile();
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>Upload & Rekonsiliasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Detail Rekonsiliasi */}
        {selectedDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Rincian Transaksi Rekonsiliasi</h3>
                    <p className="text-[10px] text-[var(--app-muted)] font-mono">{selectedDetailItem.refNo}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDetailItem(null)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-muted)] font-medium">Status Rekonsiliasi</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    selectedDetailItem.status === 'Cocok'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : selectedDetailItem.status === 'Selisih'
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {selectedDetailItem.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Pelanggan</span>
                  <span className="font-bold text-[var(--app-text)]">{selectedDetailItem.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Nomor Invoice</span>
                  <span className="font-mono text-blue-400 font-bold">{selectedDetailItem.invoiceNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Metode & Channel</span>
                  <span className="font-medium text-[var(--app-text)]">{selectedDetailItem.method} ({selectedDetailItem.channel})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Waktu Transaksi</span>
                  <span className="font-medium text-[var(--app-text)]">{selectedDetailItem.date} WIB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Nominal Mutasi</span>
                  <span className="font-mono font-bold text-green-400">{formatCurrency(selectedDetailItem.amount)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--app-border)]">
                  <span className="text-[var(--app-muted)] font-medium">Nilai Selisih</span>
                  <span className={`font-mono font-bold ${selectedDetailItem.diffAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatCurrency(selectedDetailItem.diffAmount)}
                  </span>
                </div>
              </div>

              {/* Status Update Quick Toggles */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-[var(--app-muted)] uppercase tracking-wider block">Ubah Status Manual:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedDetailItem.id, 'Cocok')}
                    className="py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Check size={12} /> Cocok
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedDetailItem.id, 'Selisih')}
                    className="py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    Selisih
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedDetailItem.id, 'Tidak Cocok')}
                    className="py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    Tidak Cocok
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setSelectedDetailItem(null)}
                  className="w-full py-2 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-xs font-semibold rounded-xl text-[var(--app-text)] transition"
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
