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
  X,
  Trash2
} from 'lucide-react';

interface CreditNoteRow {
  id: string;
  cnNumber: string;
  invoiceNumber: string;
  customerName: string;
  customerNo: string;
  type: 'Adjustment' | 'Refund' | 'Goodwill';
  nominal: number;
  remainingValue: number;
  status: 'Digunakan' | 'Belum Digunakan' | 'Sebagian Digunakan' | 'Dibatalkan';
  expiredDate: string;
  createdBy: string;
}

const initialCreditNotes: CreditNoteRow[] = [
  { id: '1', cnNumber: 'CN/2026/07/0001', invoiceNumber: 'INV/2026/06/0003', customerName: 'Budi Santoso', customerNo: 'CUST-0001', type: 'Adjustment', nominal: 375000, remainingValue: 0, status: 'Digunakan', expiredDate: '31/07/2026', createdBy: 'Agus Dwi Rianto' },
  { id: '2', cnNumber: 'CN/2026/07/0002', invoiceNumber: 'INV/2026/06/0005', customerName: 'Siti Aminah', customerNo: 'CUST-0002', type: 'Refund', nominal: 250000, remainingValue: 250000, status: 'Belum Digunakan', expiredDate: '31/08/2026', createdBy: 'Rina Marlina' },
  { id: '3', cnNumber: 'CN/2026/07/0003', invoiceNumber: 'INV/2026/06/0007', customerName: 'Andi Pratama', customerNo: 'CUST-0003', type: 'Adjustment', nominal: 575000, remainingValue: 0, status: 'Digunakan', expiredDate: '31/07/2026', createdBy: 'Agus Dwi Rianto' },
  { id: '4', cnNumber: 'CN/2026/07/0004', invoiceNumber: 'INV/2026/06/0010', customerName: 'Rina Marlina', customerNo: 'CUST-0004', type: 'Goodwill', nominal: 100000, remainingValue: 100000, status: 'Belum Digunakan', expiredDate: '31/08/2026', createdBy: 'Rina Marlina' },
  { id: '5', cnNumber: 'CN/2026/07/0005', invoiceNumber: 'INV/2026/06/0002', customerName: 'PT. Maju Bersama', customerNo: 'CUST-0005', type: 'Refund', nominal: 1250000, remainingValue: 750000, status: 'Sebagian Digunakan', expiredDate: '31/07/2026', createdBy: 'Fitri Handayani' },
  { id: '6', cnNumber: 'CN/2026/07/0006', invoiceNumber: 'INV/2026/06/0006', customerName: 'Dewi Lestari', customerNo: 'CUST-0006', type: 'Adjustment', nominal: 150000, remainingValue: 150000, status: 'Belum Digunakan', expiredDate: '31/08/2026', createdBy: 'Agus Dwi Rianto' },
  { id: '7', cnNumber: 'CN/2026/07/0007', invoiceNumber: 'INV/2026/06/0001', customerName: 'Fajar Nugroho', customerNo: 'CUST-0007', type: 'Goodwill', nominal: 2000000, remainingValue: 0, status: 'Digunakan', expiredDate: '31/07/2026', createdBy: 'Rina Marlina' },
  { id: '8', cnNumber: 'CN/2026/07/0008', invoiceNumber: 'INV/2026/06/0008', customerName: 'Nina Wulandari', customerNo: 'CUST-0008', type: 'Adjustment', nominal: 250000, remainingValue: 250000, status: 'Belum Digunakan', expiredDate: '31/08/2026', createdBy: 'Fitri Handayani' },
  { id: '9', cnNumber: 'CN/2026/07/0009', invoiceNumber: 'INV/2026/06/0009', customerName: 'Yudi Hermawan', customerNo: 'CUST-0009', type: 'Refund', nominal: 500000, remainingValue: 500000, status: 'Belum Digunakan', expiredDate: '31/08/2026', createdBy: 'Agus Dwi Rianto' },
  { id: '10', cnNumber: 'CN/2026/07/0010', invoiceNumber: 'INV/2026/06/0004', customerName: 'CV. Sinar Abadi', customerNo: 'CUST-0010', type: 'Adjustment', nominal: 2000000, remainingValue: 0, status: 'Digunakan', expiredDate: '31/07/2026', createdBy: 'Rina Marlina' }
];

export default function CreditNotePage() {
  const [creditNotes, setCreditNotes] = useState<CreditNoteRow[]>(initialCreditNotes);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [typeFilter, setTypeFilter] = useState('Semua Tipe');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [detailModal, setDetailModal] = useState<CreditNoteRow | null>(null);
  const [editModal, setEditModal] = useState<CreditNoteRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerNo: '',
    invoiceNumber: '',
    type: 'Adjustment' as CreditNoteRow['type'],
    nominal: 100000,
    expiredDate: '2026-12-31'
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
  const filteredData = creditNotes.filter(d => {
    const matchSearch = d.cnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Semua Status' || d.status === statusFilter;
    const matchType = typeFilter === 'Semua Tipe' || d.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Mass actions
  const handleMassApply = () => {
    if (selectedIds.length === 0) return;
    setCreditNotes(creditNotes.map(c => selectedIds.includes(c.id) ? { ...c, status: 'Digunakan', remainingValue: 0 } : c));
    showToast(`${selectedIds.length} Credit Note berhasil ditandai digunakan!`);
    setSelectedIds([]);
  };

  const handleMassCancel = () => {
    if (selectedIds.length === 0) return;
    setCreditNotes(creditNotes.map(c => selectedIds.includes(c.id) ? { ...c, status: 'Dibatalkan' } : c));
    showToast(`${selectedIds.length} Credit Note telah dibatalkan.`);
    setSelectedIds([]);
  };

  const handleMassEmail = () => {
    if (selectedIds.length === 0) return;
    showToast(`Notifikasi Credit Note terkirim ke ${selectedIds.length} email customer.`);
  };

  const handleExportCSV = () => {
    const target = selectedIds.length > 0 ? creditNotes.filter(c => selectedIds.includes(c.id)) : filteredData;
    const headers = ['Nomor CN', 'Invoice', 'Nama Customer', 'ID Customer', 'Tipe', 'Nominal', 'Sisa Nilai', 'Status', 'Tgl Expired'];
    const rows = target.map(c => [
      c.cnNumber,
      c.invoiceNumber,
      `"${c.customerName.replace(/"/g, '""')}"`,
      c.customerNo,
      c.type,
      c.nominal,
      c.remainingValue,
      c.status,
      c.expiredDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `credit_notes_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Credit Note berhasil diekspor.');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    const newCN: CreditNoteRow = {
      id: Date.now().toString(),
      cnNumber: `CN/2026/10/${String(creditNotes.length + 1).padStart(4, '0')}`,
      invoiceNumber: formData.invoiceNumber || 'INV/2026/10/0099',
      customerName: formData.customerName,
      customerNo: formData.customerNo || `CUST-00${creditNotes.length + 1}`,
      type: formData.type,
      nominal: Number(formData.nominal) || 100000,
      remainingValue: Number(formData.nominal) || 100000,
      status: 'Belum Digunakan',
      expiredDate: formData.expiredDate,
      createdBy: 'Agus Dwi Rianto'
    };

    setCreditNotes([newCN, ...creditNotes]);
    setIsCreateOpen(false);
    showToast(`Credit Note ${newCN.cnNumber} berhasil diterbitkan!`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setCreditNotes(creditNotes.map(c => c.id === editModal.id ? editModal : c));
    setEditModal(null);
    showToast(`Credit Note ${editModal.cnNumber} berhasil diperbarui.`);
  };

  // KPIs
  const totalNominal = creditNotes.reduce((acc, c) => acc + c.nominal, 0);
  const usedCount = creditNotes.filter(c => c.status === 'Digunakan').length;
  const unusedCount = creditNotes.filter(c => c.status === 'Belum Digunakan').length;

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
              <span className="text-blue-500 font-semibold">Credit Note</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Manajemen Credit Note & Penyesuaian Tagihan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Penerbitan memo kredit untuk kompensasi SLA downtime, koreksi salah tagih, atau deposit pelanggan.
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
              <span>Buat Credit Note</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total CN</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{creditNotes.length}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Semua catatan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Nilai</p>
              <p className="text-base font-black text-green-500 mt-0.5">{formatCurrency(totalNominal)}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Kompensasi</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Digunakan</p>
              <p className="text-xl font-black text-teal-500 mt-0.5">{usedCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Telah dipotong</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Belum Dipakai</p>
              <p className="text-xl font-black text-orange-500 mt-0.5">{unusedCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Siap klaim</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Klaim Rate</p>
              <p className="text-xl font-black text-purple-500 mt-0.5">
                {creditNotes.length ? Math.round((usedCount / creditNotes.length) * 100) : 0}%
              </p>
              <p className="text-[9px] text-[var(--app-muted)]">Rasio terpakai</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
              <XCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dibatalkan</p>
              <p className="text-xl font-black text-red-500 mt-0.5">
                {creditNotes.filter(c => c.status === 'Dibatalkan').length}
              </p>
              <p className="text-[9px] text-[var(--app-muted)]">Void</p>
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
                placeholder="Cari credit note, customer, invoice..."
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
              <option value="Belum Digunakan">Belum Digunakan</option>
              <option value="Digunakan">Digunakan</option>
              <option value="Sebagian Digunakan">Sebagian Digunakan</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>

            <select 
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[130px]"
            >
              <option value="Semua Tipe">Semua Tipe</option>
              <option value="Adjustment">Adjustment</option>
              <option value="Refund">Refund</option>
              <option value="Goodwill">Goodwill</option>
            </select>

            {(searchTerm || statusFilter !== 'Semua Status' || typeFilter !== 'Semua Tipe') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('Semua Status'); setTypeFilter('Semua Tipe'); }}
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
              Mass Action ({selectedIds.length} CN dipilih):
            </span>
            
            <button 
              onClick={handleMassApply}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-xs transition-all"
            >
              <CheckCircle size={13} />
              <span>Gunakan Terpilih</span>
            </button>

            <button 
              onClick={handleMassEmail}
              className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl font-semibold transition-all"
            >
              <Mail size={13} />
              <span>Kirim Email</span>
            </button>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs px-3.5 py-2 rounded-xl font-semibold transition-all"
            >
              <FileText size={13} />
              <span>Cetak PDF</span>
            </button>

            <button 
              onClick={handleMassCancel}
              className="flex items-center gap-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-xs px-3.5 py-2 rounded-xl font-bold transition-all"
            >
              <XCircle size={13} />
              <span>Batalkan</span>
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
                      <th className="p-3.5 w-32">NOMOR CN</th>
                      <th className="p-3.5 w-32">INVOICE</th>
                      <th className="p-3.5">NAMA CUSTOMER</th>
                      <th className="p-3.5 w-24 text-center">TIPE</th>
                      <th className="p-3.5 text-right">NOMINAL</th>
                      <th className="p-3.5 text-right">SISA NILAI</th>
                      <th className="p-3.5 w-28 text-center">STATUS</th>
                      <th className="p-3.5 text-center w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[var(--app-muted)]">
                          Tidak ada data Credit Note yang sesuai filter.
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
                            <td className="p-3.5 font-mono font-semibold text-blue-500">{d.cnNumber}</td>
                            <td className="p-3.5 font-mono text-[var(--app-muted)]">{d.invoiceNumber}</td>
                            <td className="p-3.5">
                              <div>
                                <span className="font-bold text-[var(--app-text)] block">{d.customerName}</span>
                                <span className="text-[10px] text-[var(--app-muted)] font-mono">{d.customerNo}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-center font-medium text-[var(--app-muted)]">{d.type}</td>
                            <td className="p-3.5 text-right font-bold">{formatCurrency(d.nominal)}</td>
                            <td className="p-3.5 text-right font-bold text-green-500">{formatCurrency(d.remainingValue)}</td>
                            <td className="p-3.5 text-center">
                              <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                d.status === 'Digunakan' 
                                  ? 'bg-teal-500/10 text-teal-500' 
                                  : d.status === 'Belum Digunakan'
                                  ? 'bg-orange-500/10 text-orange-500'
                                  : d.status === 'Dibatalkan'
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-blue-500/10 text-blue-500'
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
                                  title="Edit CN"
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Distribusi Berdasarkan Tipe</h3>
              <div className="space-y-2 text-xs">
                {['Adjustment', 'Refund', 'Goodwill'].map(t => {
                  const count = creditNotes.filter(c => c.type === t).length;
                  const pct = creditNotes.length ? Math.round((count / creditNotes.length) * 100) : 0;
                  return (
                    <div key={t} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span>{t}</span>
                        <span className="text-[var(--app-text)]">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
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
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">Ketentuan Credit Note</h5>
                <p className="text-[10px] text-[var(--app-muted)] leading-relaxed">
                  Credit Note otomatis mengurangi tagihan invoice pelanggan di siklus berikutnya saat diproses oleh sistem billing.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ─── MODAL: Buat Credit Note ───────────────────────────────────── */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Plus size={16} className="text-blue-500" />
                  Buat Credit Note Baru
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
                    placeholder="Contoh: PT. Maju Bersama"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Nomor Invoice Rujukan</label>
                    <input 
                      type="text"
                      placeholder="INV/2026/10/0001"
                      value={formData.invoiceNumber}
                      onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Tipe CN</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Adjustment">Adjustment</option>
                      <option value="Refund">Refund</option>
                      <option value="Goodwill">Goodwill</option>
                    </select>
                  </div>
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
                    <label className="font-semibold text-[var(--app-text)]">Masa Berlaku</label>
                    <input 
                      type="date"
                      value={formData.expiredDate}
                      onChange={e => setFormData({ ...formData, expiredDate: e.target.value })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)]"
                    />
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
                    Terbitkan CN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Detail CN ──────────────────────────────────────────── */}
        {detailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Credit Note</h3>
                <button onClick={() => setDetailModal(null)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nomor Credit Note</span>
                  <span className="font-mono font-bold text-blue-500">{detailModal.cnNumber}</span>
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
                  <span className="text-[var(--app-muted)]">Tipe Kompensasi</span>
                  <span className="font-semibold">{detailModal.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nominal CN</span>
                  <span className="font-bold font-mono">{formatCurrency(detailModal.nominal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Sisa Nilai</span>
                  <span className="font-bold font-mono text-green-500">{formatCurrency(detailModal.remainingValue)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Status</span>
                  <span className="font-semibold">{detailModal.status}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-muted)]">Dibuat Oleh</span>
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

        {/* ─── MODAL: Edit CN ────────────────────────────────────────────── */}
        {editModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Edit Credit Note ({editModal.cnNumber})</h3>
                <button onClick={() => setEditModal(null)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Status</label>
                  <select 
                    value={editModal.status}
                    onChange={e => setEditModal({ ...editModal, status: e.target.value as any })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none"
                  >
                    <option value="Belum Digunakan">Belum Digunakan</option>
                    <option value="Digunakan">Digunakan</option>
                    <option value="Sebagian Digunakan">Sebagian Digunakan</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Nominal Sisa</label>
                  <input 
                    type="number"
                    value={editModal.remainingValue}
                    onChange={e => setEditModal({ ...editModal, remainingValue: Number(e.target.value) })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono font-bold"
                  />
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
