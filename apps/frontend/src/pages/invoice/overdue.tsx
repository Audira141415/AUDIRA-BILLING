import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  Search,
  Filter,
  Eye,
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
  Edit,
  Trash2,
  CheckCircle,
  Check,
  X,
  ShieldAlert,
  Power
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  amount: number;
  dueDate: string;
  paidAt?: string | null;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  description?: string;
  month: string;
  createdAt: string;
}

const PAYMENT_METHODS = ['Cash', 'Transfer Bank', 'QRIS', 'Virtual Account', 'E-Wallet'];

export default function OverdueInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedMethod, setSelectedMethod] = useState('Semua Metode');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState<'PENDING' | 'PAID' | 'OVERDUE'>('OVERDUE');
  const [editMonth, setEditMonth] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [markPaidMethod, setMarkPaidMethod] = useState('Transfer Bank');

  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { toast } = useToast();

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else if (type === 'warning') toast.warning(message);
    else toast.info(message);
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const fetchOverdueInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.keuangan.getInvoices();
      const list = Array.isArray(data) ? data : [];
      // Filter overdue: status is OVERDUE or dueDate < now and not PAID
      const overdueList = list.filter((inv: Invoice) => {
        if (inv.status === 'PAID') return false;
        const dueTime = new Date(inv.dueDate).getTime();
        return inv.status === 'OVERDUE' || (!isNaN(dueTime) && dueTime < Date.now());
      });
      setInvoices(overdueList);
    } catch (err: any) {
      console.error('Error fetching overdue invoices:', err);
      showToast('Gagal memuat data invoice overdue', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOverdueInvoices();
  }, [fetchOverdueInvoices]);

  // Compute days late for an invoice
  const getDaysLate = (dueDate: string) => {
    const dueTime = new Date(dueDate).getTime();
    if (isNaN(dueTime)) return 0;
    const diff = Date.now() - dueTime;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  // Grouped tab counts
  const tabCounts = useMemo(() => {
    const counts = { 'Semua': invoices.length, '1-7': 0, '8-14': 0, '15-30': 0, '31-60': 0, '60+': 0 };
    invoices.forEach(inv => {
      const days = getDaysLate(inv.dueDate);
      if (days >= 1 && days <= 7) counts['1-7']++;
      else if (days >= 8 && days <= 14) counts['8-14']++;
      else if (days >= 15 && days <= 30) counts['15-30']++;
      else if (days >= 31 && days <= 60) counts['31-60']++;
      else if (days > 60) counts['60+']++;
    });
    return counts;
  }, [invoices]);

  // Filtered overdue list
  const filteredOverdue = useMemo(() => {
    return invoices.filter(inv => {
      const days = getDaysLate(inv.dueDate);
      if (activeTab === '1-7' && (days < 1 || days > 7)) return false;
      if (activeTab === '8-14' && (days < 8 || days > 14)) return false;
      if (activeTab === '15-30' && (days < 15 || days > 30)) return false;
      if (activeTab === '31-60' && (days < 31 || days > 60)) return false;
      if (activeTab === '60+' && days <= 60) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchNo = inv.invoiceNumber?.toLowerCase().includes(term);
        const matchCust = inv.customer?.name?.toLowerCase().includes(term);
        const matchPhone = inv.customer?.phone?.includes(term);
        if (!matchNo && !matchCust && !matchPhone) return false;
      }
      return true;
    });
  }, [invoices, activeTab, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredOverdue.length / limit));
  const paginatedOverdue = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredOverdue.slice(start, start + limit);
  }, [filteredOverdue, page, limit]);

  // Total Outstanding
  const totalOutstanding = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [invoices]);

  // Top 5 Customers by overdue amount
  const topOverdueCustomers = useMemo(() => {
    const custMap: Record<string, { name: string; amount: number }> = {};
    invoices.forEach(inv => {
      const cname = inv.customer?.name || 'Pelanggan Umum';
      if (!custMap[cname]) {
        custMap[cname] = { name: cname, amount: 0 };
      }
      custMap[cname].amount += inv.amount || 0;
    });
    return Object.values(custMap).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [invoices]);

  // Selection handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedOverdue.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOverdue.map(d => d.id));
    }
  };

  // Actions: Edit
  const handleOpenEdit = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setEditAmount(String(inv.amount || ''));
    try {
      const d = new Date(inv.dueDate);
      setEditDueDate(isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10));
    } catch {
      setEditDueDate('');
    }
    setEditStatus(inv.status || 'OVERDUE');
    setEditMonth(inv.month || '');
    setEditDescription(inv.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!invoiceToEdit) return;
    const num = parseInt(editAmount);
    if (isNaN(num) || num <= 0) {
      showToast('Nominal harus berupa angka positif', 'error');
      return;
    }
    try {
      setActionLoading('save-edit');
      await api.keuangan.updateInvoice(invoiceToEdit.id, {
        amount: num,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : invoiceToEdit.dueDate,
        status: editStatus,
        month: editMonth || invoiceToEdit.month,
        description: editDescription
      });
      showToast(`Invoice ${invoiceToEdit.invoiceNumber} berhasil diperbarui`, 'success');
      setShowEditModal(false);
      setInvoiceToEdit(null);
      await fetchOverdueInvoices();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan perubahan invoice', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Actions: Delete
  const handleOpenDelete = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      setActionLoading('delete');
      await api.keuangan.deleteInvoice(invoiceToDelete.id);
      showToast(`Invoice ${invoiceToDelete.invoiceNumber} berhasil dihapus`, 'success');
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      await fetchOverdueInvoices();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus invoice', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Actions: Mark Paid
  const handleMarkPaid = async () => {
    if (!selectedInvoice) return;
    try {
      setActionLoading('mark-paid');
      await api.keuangan.markPaid(selectedInvoice.id, markPaidMethod);
      showToast(`Invoice ${selectedInvoice.invoiceNumber} berhasil ditandai LUNAS (${markPaidMethod})`, 'success');
      setShowMarkPaidModal(false);
      setSelectedInvoice(null);
      await fetchOverdueInvoices();
    } catch (err: any) {
      showToast(err.message || 'Gagal melunasi invoice', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Actions: Suspend Customer
  const handleSuspendCustomer = async (customerId: string, customerName: string) => {
    if (!confirm(`Konfirmasi Isolir: Yakin ingin men-suspend koneksi internet pelanggan "${customerName}" karena jatuh tempo?`)) return;
    try {
      setActionLoading(`suspend-${customerId}`);
      await api.keuangan.suspendCustomer(customerId, 'Koneksi diisolir otomatis karena tagihan jatuh tempo terlewati');
      showToast(`Pelanggan "${customerName}" berhasil diisolir`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengisolir pelanggan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Actions: WhatsApp Single
  const handleSendSingleWA = (inv: Invoice) => {
    const phone = inv.customer?.phone ? inv.customer.phone.replace(/\D/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone.startsWith('62') ? phone : '62' + phone;
    const days = getDaysLate(inv.dueDate);
    const msg = `Halo ${inv.customer?.name},\n\nPEMBERITAHUAN TAGIHAN OVERDUE AUDIRA NET:\n📄 No. Invoice: ${inv.invoiceNumber}\n💰 Total: ${formatCurrency(inv.amount)}\n⚠️ Telat: ${days} Hari\n📅 Jatuh Tempo: ${new Date(inv.dueDate).toLocaleDateString('id-ID')}\n\nMohon untuk segera melakukan pembayaran agar layanan internet tidak terputus otomatis.\nTerima kasih.\n\n– Helpdesk Billing AUDIRA NET`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Actions: Bulk WhatsApp
  const handlePrepareBulkWA = () => {
    if (selectedIds.length === 0) {
      showToast('Pilih minimal 1 invoice terlebih dahulu', 'info');
      return;
    }
    const lines = selectedIds.map(id => {
      const inv = invoices.find(i => i.id === id);
      if (!inv) return '';
      return `• ${inv.invoiceNumber} - ${inv.customer?.name} (${formatCurrency(inv.amount)})`;
    }).filter(Boolean).join('\n');

    setWhatsappMessage(`Pemberitahuan Tagihan Terlambat (Overdue) AUDIRA NET:\n\n${lines}\n\nMohon segera melunasi tagihan Anda agar koneksi internet tetap aktif. Terima kasih.`);
    setShowWhatsAppModal(true);
  };

  const handleSendBulkWA = async () => {
    const selected = invoices.filter(i => selectedIds.includes(i.id));
    let count = 0;
    for (const inv of selected) {
      if (inv.customer?.phone) {
        let phone = inv.customer.phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        count++;
        await new Promise(r => setTimeout(r, 600));
      }
    }
    showToast(`WhatsApp reminder dikirimkan ke ${count} pelanggan`, 'success');
    setShowWhatsAppModal(false);
    setSelectedIds([]);
  };

  // Actions: Export CSV
  const handleExportCSV = () => {
    const list = filteredOverdue.length > 0 ? filteredOverdue : invoices;
    if (list.length === 0) {
      showToast('Tidak ada data invoice overdue untuk diexport', 'info');
      return;
    }
    const headers = ['No Invoice', 'Pelanggan', 'No HP', 'Jumlah', 'Jatuh Tempo', 'Hari Telat', 'Status', 'Bulan'];
    const rows = list.map(inv => [
      `"${inv.invoiceNumber}"`,
      `"${inv.customer?.name || '-'}"`,
      `"${inv.customer?.phone || '-'}"`,
      `"${inv.amount}"`,
      `"${new Date(inv.dueDate).toLocaleDateString('id-ID')}"`,
      `"${getDaysLate(inv.dueDate)} Hari"`,
      `"${inv.status}"`,
      `"${inv.month || '-'}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audira-overdue-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV overdue berhasil diunduh', 'success');
  };

  // Actions: Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setActionLoading('bulk-delete');
      for (const id of selectedIds) {
        await api.keuangan.deleteInvoice(id);
      }
      showToast(`${selectedIds.length} invoice berhasil dihapus`, 'success');
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
      await fetchOverdueInvoices();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus invoice terpilih', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Tagihan</Link>
              <span>/</span>
              <span className="text-rose-500 font-bold">Overdue Invoices</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={24} />
              Daftar Tagihan Jatuh Tempo (Overdue Ledger)
            </h1>
            <p className="text-xs text-[var(--app-text-muted)]">
              Monitoring tagihan yang telah melewati batas tanggal jatuh tempo, kirim pengingat WhatsApp, atau lakukan isolir otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchOverdueInvoices()}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-blue-500' : ''} />
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              <Download size={15} />
              Export CSV
            </button>
            <button
              onClick={handlePrepareBulkWA}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              <BellRing size={15} />
              Kirim Reminder ({selectedIds.length})
            </button>
          </div>
        </div>

        {/* ─── Search & Quick Filters ────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl shadow-2xs p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-3 text-[var(--app-text-muted)]" size={15} />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor invoice, nama pelanggan, atau nomor HP..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] pl-10 pr-4 py-2.5 rounded-xl text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <button 
              onClick={() => { setSearchTerm(''); setActiveTab('Semua'); }}
              className="text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* ─── Table Tabs ────────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] gap-6 overflow-x-auto pb-1">
          {[
            { id: 'Semua', label: 'Semua Overdue', count: tabCounts['Semua'] },
            { id: '1-7', label: '1 - 7 Hari', count: tabCounts['1-7'] },
            { id: '8-14', label: '8 - 14 Hari', count: tabCounts['8-14'] },
            { id: '15-30', label: '15 - 30 Hari', count: tabCounts['15-30'] },
            { id: '31-60', label: '31 - 60 Hari', count: tabCounts['31-60'] },
            { id: '60+', label: '> 60 Hari', count: tabCounts['60+'] }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id ? 'border-[#0052cc] text-blue-500 font-bold' : 'border-transparent hover:text-[var(--app-text)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                activeTab === tab.id ? 'bg-[#0052cc] text-white' : 'bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text-muted)]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Overdue Table & Mass Action */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={paginatedOverdue.length > 0 && paginatedOverdue.every(d => selectedIds.includes(d.id))}
                          onChange={handleSelectAll}
                          className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-44">INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-32">JATUH TEMPO</th>
                      <th className="p-4 w-32">HARI TELAT</th>
                      <th className="p-4 w-32">TOTAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-28 text-right pr-4">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-[var(--app-text-muted)]">
                          <RefreshCw className="animate-spin mx-auto text-blue-500 mb-2" size={24} />
                          <span>Memuat tagihan overdue...</span>
                        </td>
                      </tr>
                    ) : paginatedOverdue.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-[var(--app-text-muted)]">
                          <CheckCircle className="mx-auto text-emerald-500 mb-2" size={28} />
                          <p className="font-bold text-[var(--app-text)]">Tidak ada tagihan overdue</p>
                          <p className="text-[11px] mt-1">Semua pelanggan telah melunasi tagihan tepat waktu.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedOverdue.map((inv, idx) => {
                        const isSelected = selectedIds.includes(inv.id);
                        const daysLate = getDaysLate(inv.dueDate);
                        return (
                          <tr 
                            key={inv.id}
                            className={`hover:bg-[var(--app-card-subtle)] transition-colors ${isSelected ? 'bg-[var(--app-primary-soft)]' : ''}`}
                          >
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleSelectRow(inv.id)}
                                className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-[var(--app-text-muted)] font-mono font-medium">{(page - 1) * limit + idx + 1}</td>
                            <td className="p-4 font-mono font-semibold">
                              <span className="block text-blue-500 font-bold">{inv.invoiceNumber}</span>
                              <span className="text-[10px] text-[var(--app-text-muted)]">{inv.month || '-'}</span>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[var(--app-text)]">{inv.customer?.name || 'Pelanggan Umum'}</div>
                              <div className="text-[10px] text-[var(--app-text-muted)] font-mono">{inv.customer?.phone || '-'}</div>
                            </td>
                            <td className="p-4 font-mono text-[var(--app-text)]">
                              {new Date(inv.dueDate).toLocaleDateString('id-ID')}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                daysLate > 60 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                daysLate > 30 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>
                                {daysLate} Hari Telat
                              </span>
                            </td>
                            <td className="p-4 font-bold text-[var(--app-text)] font-mono tabular-nums">
                              {formatCurrency(inv.amount)}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                Overdue
                              </span>
                            </td>
                            <td className="p-4 text-right pr-4">
                              <div className="flex items-center justify-end gap-1">
                                {/* Detail */}
                                <button
                                  onClick={() => { setSelectedInvoice(inv); setShowDetailModal(true); }}
                                  className="p-1.5 hover:bg-[var(--app-bg)] rounded-lg text-[var(--app-text-muted)] hover:text-blue-500 transition"
                                  title="Lihat Detail Tagihan"
                                >
                                  <Eye size={14} />
                                </button>
                                {/* Edit */}
                                <button
                                  onClick={() => handleOpenEdit(inv)}
                                  className="p-1.5 hover:bg-blue-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-blue-500 transition"
                                  title="Edit Tagihan & Nominal"
                                >
                                  <Edit size={14} />
                                </button>
                                {/* WA */}
                                <button
                                  onClick={() => handleSendSingleWA(inv)}
                                  className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-emerald-500 transition"
                                  title="Kirim Peringatan WhatsApp"
                                >
                                  <MessageCircle size={14} />
                                </button>
                                {/* Tandai Lunas */}
                                <button
                                  onClick={() => { setSelectedInvoice(inv); setShowMarkPaidModal(true); }}
                                  className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-emerald-500 transition"
                                  title="Tandai Lunas"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                {/* Isolir Layanan */}
                                {inv.customer?.id && (
                                  <button
                                    onClick={() => handleSuspendCustomer(inv.customer.id, inv.customer.name)}
                                    className="p-1.5 hover:bg-purple-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-purple-500 transition"
                                    title="Isolir Layanan Pelanggan"
                                  >
                                    <Power size={14} />
                                  </button>
                                )}
                                {/* Hapus */}
                                <button
                                  onClick={() => handleOpenDelete(inv)}
                                  className="p-1.5 hover:bg-rose-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-rose-500 transition"
                                  title="Hapus Tagihan"
                                >
                                  <Trash2 size={14} />
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)]">
                <span className="text-xs text-[var(--app-text-muted)]">
                  Menampilkan <span className="font-semibold text-[var(--app-text)] font-mono">{filteredOverdue.length === 0 ? 0 : (page - 1) * limit + 1} - {Math.min(page * limit, filteredOverdue.length)}</span> dari <span className="font-semibold text-[var(--app-text)] font-mono">{filteredOverdue.length}</span> overdue
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-xl text-[var(--app-text-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-mono font-bold text-[var(--app-text)] px-2">
                      Halaman {page} / {totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-xl text-[var(--app-text-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Mass Action */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl shadow-2xs p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider mr-2">
                  Mass Action ({selectedIds.length} dipilih)
                </span>
                
                <button
                  onClick={handlePrepareBulkWA}
                  disabled={selectedIds.length === 0}
                  className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:border-emerald-500 text-[var(--app-text)] hover:text-emerald-500 text-xs px-3.5 py-2 rounded-xl transition-all disabled:opacity-40"
                >
                  <BellRing size={13} />
                  <span>Kirim Reminder WA</span>
                </button>

                <button
                  onClick={() => setShowBulkDeleteModal(true)}
                  disabled={selectedIds.length === 0}
                  className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:border-rose-500 text-[var(--app-text)] hover:text-rose-500 text-xs px-3.5 py-2 rounded-xl transition-all disabled:opacity-40"
                >
                  <Trash2 size={13} />
                  <span>Hapus Massal</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:border-blue-500 text-[var(--app-text)] hover:text-blue-500 text-xs px-3.5 py-2 rounded-xl transition-all"
                >
                  <FileText size={13} />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex gap-3 text-rose-500 leading-relaxed text-[11px] font-bold">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>Tips Kebijakan: Tagihan yang telat lebih dari 7 hari direkomendasikan untuk diisolir otomatis agar menjaga cashflow operasional ISP.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Overdue Stats */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Ringkasan Overdue</h3>
              
              <div className="space-y-2 text-[11px] text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between py-1 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block"></span>
                    <span>1 - 7 Hari</span>
                  </div>
                  <span className="font-semibold text-[var(--app-text)] font-mono">{tabCounts['1-7']} tagihan</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"></span>
                    <span>8 - 14 Hari</span>
                  </div>
                  <span className="font-semibold text-[var(--app-text)] font-mono">{tabCounts['8-14']} tagihan</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
                    <span>15 - 30 Hari</span>
                  </div>
                  <span className="font-semibold text-[var(--app-text)] font-mono">{tabCounts['15-30']} tagihan</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                    <span>31 - 60 Hari</span>
                  </div>
                  <span className="font-semibold text-[var(--app-text)] font-mono">{tabCounts['31-60']} tagihan</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-800 inline-block"></span>
                    <span>&gt; 60 Hari</span>
                  </div>
                  <span className="font-semibold text-[var(--app-text)] font-mono">{tabCounts['60+']} tagihan</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Outstanding */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl p-5 shadow-2xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider block">Total Outstanding</span>
                <p className="text-lg font-black text-rose-500 font-mono tabular-nums">{formatCurrency(totalOutstanding)}</p>
                <span className="text-[10px] text-[var(--app-text-muted)]">{invoices.length} tagihan belum dibayar</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet size={18} />
              </div>
            </div>

            {/* Card 3: Top Customer Overdue */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Top Pelanggan Overdue</h3>
              
              <div className="space-y-3">
                {topOverdueCustomers.map((cust, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[var(--app-text)] truncate max-w-[120px]" title={cust.name}>{cust.name}</span>
                    <span className="text-rose-500 font-mono tabular-nums">{formatCurrency(cust.amount)}</span>
                  </div>
                ))}
                {topOverdueCustomers.length === 0 && (
                  <p className="text-xs text-[var(--app-text-muted)] text-center py-2">Tidak ada data</p>
                )}
              </div>
            </div>

            {/* Card 4: Aksi Cepat */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Aksi Cepat</h3>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={handlePrepareBulkWA}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition"
                >
                  <MessageCircle size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Kirim WA</span>
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition"
                >
                  <Download size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Export CSV</span>
                </button>
                <button 
                  onClick={() => fetchOverdueInvoices()}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition"
                >
                  <RefreshCw size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Sinkronisasi</span>
                </button>
                <button 
                  onClick={() => { if (selectedIds.length > 0) setShowBulkDeleteModal(true); else showToast('Pilih invoice terlebih dahulu', 'warning'); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
                >
                  <Trash2 size={16} className="mb-1" />
                  <span className="text-[10px] font-bold">Hapus Pilihan</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ─── MODAL: Detail Invoice ────────────────────────────────────────── */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Eye size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--app-text)]">Detail Tagihan Overdue</h2>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-mono">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Pelanggan:</span>
                <span className="font-bold text-[var(--app-text)]">{selectedInvoice.customer?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">No. Telepon:</span>
                <span className="font-mono text-[var(--app-text)]">{selectedInvoice.customer?.phone || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Jatuh Tempo:</span>
                <span className="font-mono text-[var(--app-text)]">{new Date(selectedInvoice.dueDate).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Hari Keterlambatan:</span>
                <span className="font-bold text-rose-500 font-mono">{getDaysLate(selectedInvoice.dueDate)} Hari</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Nominal Tagihan:</span>
                <span className="font-bold text-[var(--app-text)] font-mono text-sm">{formatCurrency(selectedInvoice.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Periode:</span>
                <span className="font-semibold text-[var(--app-text)]">{selectedInvoice.month || '-'}</span>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--app-border)] flex gap-2.5 justify-end bg-[var(--app-bg)]">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowMarkPaidModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Tandai Lunas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Edit Tagihan ─────────────────────────────────────────── */}
      {showEditModal && invoiceToEdit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Edit size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--app-text)]">Edit Data Tagihan</h2>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-mono">{invoiceToEdit.invoiceNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--app-text-muted)]">Pelanggan:</span>
                  <span className="font-bold text-[var(--app-text)]">{invoiceToEdit.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-text-muted)]">No. Telepon:</span>
                  <span className="font-mono text-[var(--app-text)]">{invoiceToEdit.customer?.phone || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--app-text-muted)] font-semibold mb-1">Nominal Tagihan (Rp)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 font-mono font-bold text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--app-text-muted)] font-semibold mb-1">Status Tagihan</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="OVERDUE">OVERDUE (Terlambat)</option>
                    <option value="PENDING">PENDING (Menunggu)</option>
                    <option value="PAID">PAID (Lunas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--app-text-muted)] font-semibold mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--app-text-muted)] font-semibold mb-1">Periode Bulan</label>
                  <input
                    type="text"
                    value={editMonth}
                    onChange={e => setEditMonth(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--app-border)] flex gap-2.5 justify-end bg-[var(--app-bg)]">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading === 'save-edit'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {actionLoading === 'save-edit' ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                <span>{actionLoading === 'save-edit' ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Hapus Tagihan ────────────────────────────────────────── */}
      {showDeleteModal && invoiceToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)] bg-rose-500/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <Trash2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-rose-500">Hapus Tagihan Overdue</h2>
                  <p className="text-[10px] text-[var(--app-text-muted)]">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-[var(--app-text-muted)]">
                Yakin ingin menghapus tagihan <strong className="text-[var(--app-text)] font-mono">{invoiceToDelete.invoiceNumber}</strong> milik <strong className="text-[var(--app-text)]">{invoiceToDelete.customer?.name}</strong> senilai <strong className="text-rose-500 font-mono">{formatCurrency(invoiceToDelete.amount)}</strong>?
              </p>
            </div>

            <div className="p-4 border-t border-[var(--app-border)] flex gap-2.5 justify-end bg-[var(--app-bg)]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading === 'delete'}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {actionLoading === 'delete' ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>{actionLoading === 'delete' ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Tandai Lunas ─────────────────────────────────────────── */}
      {showMarkPaidModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
              <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" /> Pelunasan Tagihan
              </h2>
              <button onClick={() => setShowMarkPaidModal(false)} className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--app-text-muted)]">Invoice:</span>
                  <span className="font-bold text-[var(--app-text)] font-mono">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-text-muted)]">Pelanggan:</span>
                  <span className="font-bold text-[var(--app-text)]">{selectedInvoice.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--app-text-muted)]">Total Tagihan:</span>
                  <span className="font-bold text-emerald-500 font-mono text-sm">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[var(--app-text-muted)] font-semibold mb-1">Metode Pembayaran</label>
                <select
                  value={markPaidMethod}
                  onChange={e => setMarkPaidMethod(e.target.value)}
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--app-border)] flex gap-2.5 justify-end bg-[var(--app-bg)]">
              <button
                onClick={() => setShowMarkPaidModal(false)}
                className="px-4 py-2 border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleMarkPaid}
                disabled={actionLoading === 'mark-paid'}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {actionLoading === 'mark-paid' ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                <span>{actionLoading === 'mark-paid' ? 'Menyimpan...' : 'Konfirmasi Lunas'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Kirim Massal WhatsApp ─────────────────────────────────── */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
              <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <Send size={16} className="text-emerald-500" /> Broadcast WhatsApp Tagihan Overdue
              </h2>
              <button onClick={() => setShowWhatsAppModal(false)} className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-[var(--app-text-muted)]">
                Mengirim pesan pengingat tagihan ke <strong className="text-[var(--app-text)]">{selectedIds.length} pelanggan terpilih</strong>:
              </p>
              <textarea
                rows={6}
                value={whatsappMessage}
                onChange={e => setWhatsappMessage(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-3 text-[var(--app-text)] font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-4 border-t border-[var(--app-border)] flex gap-2.5 justify-end bg-[var(--app-bg)]">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2 border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSendBulkWA}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Send size={14} />
                <span>Kirim WhatsApp Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Hapus Massal ─────────────────────────────────────────── */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)] bg-rose-500/10">
              <div className="flex items-center gap-2">
                <Trash2 size={16} className="text-rose-500" />
                <h2 className="text-sm font-bold text-rose-500">Hapus Massal Tagihan Overdue</h2>
              </div>
              <button onClick={() => setShowBulkDeleteModal(false)} className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-[var(--app-text-muted)]">
                Anda akan menghapus permanen <strong className="text-rose-500 font-mono">{selectedIds.length} invoice overdue</strong> dari sistem.
              </p>
            </div>

            <div className="p-4 border-t border-[var(--app-border)] flex gap-2.5 justify-end bg-[var(--app-bg)]">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 border border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                {actionLoading === 'bulk-delete' ? 'Menghapus...' : `Hapus ${selectedIds.length} Invoice`}
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
