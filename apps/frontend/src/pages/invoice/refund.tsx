import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  AlertCircle,
  MessageCircle,
  MailWarning,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  BellRing,
  Wallet,
  Send,
  Plus,
  CheckCircle,
  XCircle,
  TrendingUp,
  X
} from 'lucide-react';

interface RefundRow {
  id: string;
  rfNumber: string;
  invoiceNumber: string;
  customerName: string;
  customerNo: string;
  reason: string;
  nominal: number;
  method: string;
  status: 'Selesai' | 'Diproses' | 'Ditolak';
  refundDate: string;
  createdBy: string;
}

const initialRefunds: RefundRow[] = [
  { id: '1', rfNumber: 'RF/2026/07/0001', invoiceNumber: 'INV/2026/06/0003', customerName: 'Budi Santoso', customerNo: 'CUST-0001', reason: 'Kelebihan Bayar Transfer', nominal: 375000, method: 'Transfer Bank BCA', status: 'Selesai', refundDate: '26/10/2026 08:32', createdBy: 'Agus Dwi Rianto' },
  { id: '2', rfNumber: 'RF/2026/07/0002', invoiceNumber: 'INV/2026/06/0005', customerName: 'Siti Aminah', customerNo: 'CUST-0002', reason: 'Downtime Jaringan > 24 Jam', nominal: 250000, method: 'Transfer Mandiri', status: 'Diproses', refundDate: '26/10/2026 07:45', createdBy: 'Rina Marlina' },
  { id: '3', rfNumber: 'RF/2026/07/0003', invoiceNumber: 'INV/2026/06/0007', customerName: 'Andi Pratama', customerNo: 'CUST-0003', reason: 'Pembatalan Pasang Baru (ODP Full)', nominal: 500000, method: 'Transfer BRI', status: 'Selesai', refundDate: '25/10/2026 21:15', createdBy: 'Agus Dwi Rianto' },
  { id: '4', rfNumber: 'RF/2026/07/0004', invoiceNumber: 'INV/2026/06/0010', customerName: 'Rina Marlina', customerNo: 'CUST-0004', reason: 'Double Payment Payment Gateway', nominal: 350000, method: 'E-Wallet DANA', status: 'Diproses', refundDate: '25/10/2026 19:30', createdBy: 'Rina Marlina' },
  { id: '5', rfNumber: 'RF/2026/07/0005', invoiceNumber: 'INV/2026/06/0002', customerName: 'PT. Maju Bersama', customerNo: 'CUST-0005', reason: 'Deposit Terminasi Kontrak', nominal: 1800000, method: 'Transfer Bank BCA', status: 'Selesai', refundDate: '24/10/2026 16:20', createdBy: 'Fitri Handayani' },
  { id: '6', rfNumber: 'RF/2026/07/0006', invoiceNumber: 'INV/2026/06/0006', customerName: 'Dewi Lestari', customerNo: 'CUST-0006', reason: 'Salah Input Nominal Pelanggan', nominal: 150000, method: 'Transfer BCA', status: 'Ditolak', refundDate: '24/10/2026 10:10', createdBy: 'Agus Dwi Rianto' },
  { id: '7', rfNumber: 'RF/2026/07/0007', invoiceNumber: 'INV/2026/06/0001', customerName: 'Fajar Nugroho', customerNo: 'CUST-0007', reason: 'Kompensasi SLA Korporat', nominal: 2000000, method: 'Transfer BNI', status: 'Selesai', refundDate: '23/10/2026 14:00', createdBy: 'Rina Marlina' },
  { id: '8', rfNumber: 'RF/2026/07/0008', invoiceNumber: 'INV/2026/06/0008', customerName: 'Nina Wulandari', customerNo: 'CUST-0008', reason: 'Migrasi Paket Lebih Murah', nominal: 250000, method: 'Transfer Mandiri', status: 'Diproses', refundDate: '22/10/2026 11:20', createdBy: 'Fitri Handayani' }
];

export default function RefundPage() {
  const [refunds, setRefunds] = useState<RefundRow[]>(initialRefunds);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [methodFilter, setMethodFilter] = useState('Semua Metode');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [detailModal, setDetailModal] = useState<RefundRow | null>(null);
  const [editModal, setEditModal] = useState<RefundRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerNo: '',
    invoiceNumber: '',
    reason: 'Kelebihan Bayar Transfer',
    nominal: 250000,
    method: 'Transfer Bank BCA'
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

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(d => d.id));
    }
  };

  // Filter
  const filteredData = refunds.filter(d => {
    const matchSearch = d.rfNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Semua Status' || d.status === statusFilter;
    const matchMethod = methodFilter === 'Semua Metode' || d.method.includes(methodFilter);
    return matchSearch && matchStatus && matchMethod;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Mass actions
  const handleMassApprove = () => {
    if (selectedIds.length === 0) return;
    setRefunds(refunds.map(c => selectedIds.includes(c.id) ? { ...c, status: 'Selesai' } : c));
    showToast(`${selectedIds.length} Pengajuan Refund berhasil diproses & diselesaikan!`);
    setSelectedIds([]);
  };

  const handleMassReject = () => {
    if (selectedIds.length === 0) return;
    setRefunds(refunds.map(c => selectedIds.includes(c.id) ? { ...c, status: 'Ditolak' } : c));
    showToast(`${selectedIds.length} Pengajuan Refund ditolak.`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const target = selectedIds.length > 0 ? refunds.filter(c => selectedIds.includes(c.id)) : filteredData;
    const headers = ['Nomor Refund', 'Invoice', 'Nama Customer', 'ID Customer', 'Alasan', 'Nominal', 'Metode', 'Status', 'Tanggal'];
    const rows = target.map(c => [
      c.rfNumber,
      c.invoiceNumber,
      `"${c.customerName.replace(/"/g, '""')}"`,
      c.customerNo,
      `"${c.reason.replace(/"/g, '""')}"`,
      c.nominal,
      `"${c.method}"`,
      c.status,
      c.refundDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `refunds_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Refund berhasil diekspor ke CSV.');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const newRF: RefundRow = {
      id: Date.now().toString(),
      rfNumber: `RF/2026/10/${String(refunds.length + 1).padStart(4, '0')}`,
      invoiceNumber: formData.invoiceNumber || 'INV/2026/10/0122',
      customerName: formData.customerName,
      customerNo: formData.customerNo || `CUST-00${refunds.length + 1}`,
      reason: formData.reason,
      nominal: Number(formData.nominal) || 100000,
      method: formData.method,
      status: 'Diproses',
      refundDate: 'Baru saja',
      createdBy: 'Agus Dwi Rianto'
    };

    setRefunds([newRF, ...refunds]);
    setIsCreateOpen(false);
    showToast(`Pengajuan Refund ${newRF.rfNumber} berhasil dibuat!`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setRefunds(refunds.map(c => c.id === editModal.id ? editModal : c));
    setEditModal(null);
    showToast(`Status Refund ${editModal.rfNumber} berhasil diperbarui.`);
  };

  // KPIs
  const totalNominal = refunds.reduce((acc, c) => acc + c.nominal, 0);
  const doneCount = refunds.filter(c => c.status === 'Selesai').length;
  const procCount = refunds.filter(c => c.status === 'Diproses').length;
  const rejectCount = refunds.filter(c => c.status === 'Ditolak').length;

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
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Refund Dana</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Manajemen Pengembalian Dana (Refund)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Otorisasi dan pencatatan pengembalian dana pembayaran berlebih atau deposit langganan pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/invoice/semua"
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/30 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-xl transition-all"
            >
              Semua Invoice
            </Link>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Plus size={15} />
              <span>Buat Refund</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Kasus</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{refunds.length}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Pengajuan refund</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Dana</p>
              <p className="text-base font-black text-green-500 mt-0.5">{formatCurrency(totalNominal)}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Nilai nominal</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Selesai</p>
              <p className="text-xl font-black text-teal-500 mt-0.5">{doneCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Telah ditransfer</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Diproses</p>
              <p className="text-xl font-black text-orange-500 mt-0.5">{procCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Verifikasi finance</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
              <XCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Ditolak</p>
              <p className="text-xl font-black text-red-500 mt-0.5">{rejectCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Klaim tidak valid</p>
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
                placeholder="Cari refund no, customer, invoice..."
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
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            <select 
              value={methodFilter}
              onChange={e => { setMethodFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[130px]"
            >
              <option value="Semua Metode">Semua Metode</option>
              <option value="BCA">Transfer BCA</option>
              <option value="Mandiri">Transfer Mandiri</option>
              <option value="BRI">Transfer BRI</option>
              <option value="E-Wallet">E-Wallet</option>
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

        {/* ─── Mass Action bar ────────────────────────────────────────────── */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-blue-500 mr-2">
              Mass Action ({selectedIds.length} Refund dipilih):
            </span>
            
            <button 
              onClick={handleMassApprove}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-xs transition-all"
            >
              <CheckCircle size={13} />
              <span>Selesaikan Refund Terpilih</span>
            </button>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl font-semibold transition-all"
            >
              <FileText size={13} />
              <span>Cetak Bukti Refund</span>
            </button>

            <button 
              onClick={handleMassReject}
              className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-xs px-3.5 py-2 rounded-xl font-bold transition-all"
            >
              <XCircle size={13} />
              <span>Tolak Pengajuan</span>
            </button>
          </div>
        )}

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3.5 w-10 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0 && selectedIds.length === filteredData.length}
                          onChange={handleSelectAll}
                          className="rounded text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-3.5 w-12 text-center">NO</th>
                      <th className="p-3.5 w-32">NOMOR REFUND</th>
                      <th className="p-3.5 w-32">INVOICE</th>
                      <th className="p-3.5">PELANGGAN</th>
                      <th className="p-3.5">ALASAN REFUND</th>
                      <th className="p-3.5 text-right">NOMINAL</th>
                      <th className="p-3.5">METODE</th>
                      <th className="p-3.5 w-24 text-center">STATUS</th>
                      <th className="p-3.5 text-center w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[var(--app-muted)]">
                          Tidak ada pengajuan refund yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((d, idx) => {
                        const isSelected = selectedIds.includes(d.id);
                        return (
                          <tr 
                            key={d.id}
                            onClick={() => handleSelectRow(d.id)}
                            className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${isSelected ? 'bg-blue-600/5' : ''}`}
                          >
                            <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleSelectRow(d.id)}
                                className="rounded text-blue-600 focus:ring-0" 
                              />
                            </td>
                            <td className="p-3.5 text-center text-[var(--app-muted)] font-mono">
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td className="p-3.5 font-mono font-semibold text-blue-500">{d.rfNumber}</td>
                            <td className="p-3.5 font-mono text-[var(--app-muted)]">{d.invoiceNumber}</td>
                            <td className="p-3.5">
                              <div>
                                <span className="font-bold text-[var(--app-text)] block">{d.customerName}</span>
                                <span className="text-[10px] text-[var(--app-muted)] font-mono">{d.customerNo}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-[var(--app-muted)] text-[11px] max-w-[180px] truncate">{d.reason}</td>
                            <td className="p-3.5 text-right font-bold text-green-500">{formatCurrency(d.nominal)}</td>
                            <td className="p-3.5 text-[var(--app-muted)] text-[11px]">{d.method}</td>
                            <td className="p-3.5 text-center">
                              <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                d.status === 'Selesai' 
                                  ? 'bg-teal-500/10 text-teal-500' 
                                  : d.status === 'Diproses'
                                  ? 'bg-orange-500/10 text-orange-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}>
                                {d.status}
                              </span>
                            </td>
                            <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => setDetailModal(d)}
                                  title="Lihat Detail"
                                  className="p-1.5 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-blue-500 transition-colors"
                                >
                                  <Eye size={13} />
                                </button>
                                <button 
                                  onClick={() => setEditModal(d)}
                                  title="Edit Status"
                                  className="p-1.5 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-green-500 transition-colors"
                                >
                                  <Edit2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Alasan Pengembalian Dana</h3>
              <div className="space-y-2 text-xs">
                {['Kelebihan Bayar Transfer', 'Downtime Jaringan > 24 Jam', 'Pembatalan Pasang Baru (ODP Full)', 'Double Payment Payment Gateway'].map(r => {
                  const count = refunds.filter(c => c.reason.includes(r.split(' ')[0])).length;
                  return (
                    <div key={r} className="flex justify-between items-center py-1 border-b border-[var(--app-border)]/40 last:border-0 text-[11px]">
                      <span className="text-[var(--app-muted)] truncate max-w-[160px]">{r}</span>
                      <span className="font-bold text-[var(--app-text)]">{count} kasus</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-2xl flex items-start gap-3 shadow-2xs">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg shrink-0">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">SLA Pencairan Refund</h5>
                <p className="text-[10px] text-[var(--app-muted)] leading-relaxed">
                  Pengembalian dana diproses maksimal 1x24 jam kerja ke nomor rekening bank terdaftar pelanggan.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ─── MODAL: Buat Refund ─────────────────────────────────────────── */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Plus size={16} className="text-blue-500" />
                  Buat Pengajuan Refund Baru
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
                  <label className="font-semibold text-[var(--app-text)]">Nomor Invoice Rujukan</label>
                  <input 
                    type="text"
                    placeholder="INV/2026/10/0045"
                    value={formData.invoiceNumber}
                    onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Alasan Pengembalian Dana</label>
                  <select 
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none"
                  >
                    <option value="Kelebihan Bayar Transfer">Kelebihan Bayar Transfer</option>
                    <option value="Downtime Jaringan Lebih Dari 24 Jam">Downtime Jaringan &gt; 24 Jam</option>
                    <option value="Pembatalan Pasang Baru (ODP Full)">Pembatalan Pasang Baru (ODP Full)</option>
                    <option value="Double Payment Payment Gateway">Double Payment Payment Gateway</option>
                    <option value="Deposit Terminasi Kontrak">Deposit Terminasi Kontrak</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Nominal (Rp) *</label>
                    <input 
                      type="number"
                      required
                      min={1000}
                      value={formData.nominal}
                      onChange={e => setFormData({ ...formData, nominal: Number(e.target.value) })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Metode Transfer</label>
                    <select 
                      value={formData.method}
                      onChange={e => setFormData({ ...formData, method: e.target.value })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)]"
                    >
                      <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                      <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                      <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                      <option value="Transfer Bank BNI">Transfer Bank BNI</option>
                      <option value="E-Wallet DANA">E-Wallet DANA</option>
                    </select>
                  </div>
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
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                  >
                    Kirim Pengajuan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Detail Refund ──────────────────────────────────────── */}
        {detailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Pengajuan Refund</h3>
                <button onClick={() => setDetailModal(null)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nomor Refund</span>
                  <span className="font-mono font-bold text-blue-500">{detailModal.rfNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Invoice Rujukan</span>
                  <span className="font-mono">{detailModal.invoiceNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nama Pelanggan</span>
                  <span className="font-bold text-[var(--app-text)]">{detailModal.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Alasan Pengembalian</span>
                  <span className="font-semibold text-right max-w-[200px]">{detailModal.reason}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nominal Refund</span>
                  <span className="font-bold font-mono text-green-500">{formatCurrency(detailModal.nominal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Metode Transfer</span>
                  <span className="font-medium">{detailModal.method}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Status</span>
                  <span className="font-semibold">{detailModal.status}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-muted)]">Diverifikasi Oleh</span>
                  <span>{detailModal.createdBy}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl font-semibold flex items-center gap-1.5 text-xs"
                >
                  <FileText size={13} />
                  <span>Cetak PDF</span>
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

        {/* ─── MODAL: Edit Refund ────────────────────────────────────────── */}
        {editModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Update Status Refund ({editModal.rfNumber})</h3>
                <button onClick={() => setEditModal(null)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Status Refund</label>
                  <select 
                    value={editModal.status}
                    onChange={e => setEditModal({ ...editModal, status: e.target.value as any })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none"
                  >
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai (Sudah Ditransfer)</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                  <button 
                    type="button"
                    onClick={() => setEditModal(null)}
                    className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
