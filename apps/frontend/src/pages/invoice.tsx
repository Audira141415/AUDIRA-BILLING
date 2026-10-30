import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  Receipt,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  MessageCircle,
  Users,
  Phone,
  RefreshCw,
  Zap,
  Plus,
  FileText,
  X,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Filter,
  Printer,
  CreditCard,
  Send,
  Building2,
  Percent,
  Edit,
  Trash2
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  amount: number;
  dueDate: string;
  paidAt?: string | null;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  description?: string;
  month: string;
  createdAt: string;
}

const PAYMENT_METHODS = ['Cash / Tunai', 'Transfer Bank BCA', 'Transfer Bank Mandiri', 'Transfer Bank BRI', 'QRIS', 'Virtual Account', 'Kolektor Lapangan'];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val || 0);
};

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState<'PENDING' | 'PAID' | 'OVERDUE'>('PENDING');
  const [editMonth, setEditMonth] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  
  // Form and Selection state
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [selectedInvoicesForWA, setSelectedInvoicesForWA] = useState<string[]>([]);
  const [markPaidMethod, setMarkPaidMethod] = useState('Cash / Tunai');
  const [generateMonth, setGenerateMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.keuangan.getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      showToast('Gagal memuat data tagihan invoice', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await api.pelanggan.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, [fetchInvoices, fetchCustomers]);

  // Bulk Monthly Generation
  const handleGenerateInvoices = async () => {
    try {
      setActionLoading('generate');
      const result = await api.keuangan.bulkGenerate(generateMonth);
      showToast(`Berhasil: ${result.message || 'Invoice bulanan berhasil digenerate.'}`, 'success');
      setShowGenerateModal(false);
      await fetchInvoices();
    } catch (error: any) {
      showToast(`Gagal generate invoice: ${error.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Edit Invoice Handlers
  const handleOpenEditModal = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setEditAmount(String(inv.amount || ''));
    try {
      const d = new Date(inv.dueDate);
      setEditDueDate(isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10));
    } catch {
      setEditDueDate('');
    }
    setEditStatus(inv.status || 'PENDING');
    setEditMonth(inv.month || '');
    setEditDescription(inv.description || '');
    setShowEditInvoiceModal(true);
  };

  const handleSaveEditInvoice = async () => {
    if (!invoiceToEdit) return;
    const num = parseInt(editAmount);
    if (isNaN(num) || num <= 0) {
      showToast('Nominal tagihan harus berupa angka positif', 'error');
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
      showToast(`Tagihan ${invoiceToEdit.invoiceNumber} berhasil diperbarui`, 'success');
      setShowEditInvoiceModal(false);
      setInvoiceToEdit(null);
      await fetchInvoices();
    } catch (err: any) {
      showToast(`Gagal update tagihan: ${err.message || 'Error server'}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenDeleteModal = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setShowDeleteInvoiceModal(true);
  };

  const handleConfirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    try {
      setActionLoading('delete-invoice');
      await api.keuangan.deleteInvoice(invoiceToDelete.id);
      showToast(`Invoice ${invoiceToDelete.invoiceNumber} berhasil dihapus dari sistem`, 'success');
      setShowDeleteInvoiceModal(false);
      setInvoiceToDelete(null);
      await fetchInvoices();
    } catch (err: any) {
      showToast(`Gagal menghapus tagihan: ${err.message || 'Error server'}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Mark Paid
  const handleMarkPaid = async () => {
    if (!selectedInvoice) return;
    try {
      setActionLoading('mark-paid');
      await api.keuangan.markPaid(selectedInvoice.id, markPaidMethod);
      showToast(`Invoice ${selectedInvoice.invoiceNumber} berhasil ditandai LUNAS (${markPaidMethod})`, 'success');
      setShowMarkPaidModal(false);
      setSelectedInvoice(null);
      await fetchInvoices();
    } catch (error: any) {
      showToast(`Gagal melunasi invoice: ${error.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // WhatsApp Single Reminder
  const handleOpenWhatsApp = (phone: string, invoiceNumber: string, amount: number, dueDate: string, customerName: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);
    else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

    const msg = `Halo ${customerName},\n\nPemberitahuan Tagihan Internet AUDIRA NET:\nNo. Invoice: ${invoiceNumber}\nTotal: ${formatCurrency(amount)}\nJatuh Tempo: ${new Date(dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\nSilakan lakukan pembayaran melalui Transfer Bank atau QRIS agar layanan tetap aktif tanpa isolir otomatis.\nTerima kasih.\n\n- Layanan Billing AUDIRA NET`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // WhatsApp Bulk
  const handlePrepareBulkWA = () => {
    if (selectedInvoicesForWA.length === 0) {
      showToast('Pilih minimal 1 invoice terlebih dahulu', 'info');
      return;
    }
    const lines = selectedInvoicesForWA.map(id => {
      const inv = invoices.find(i => i.id === id);
      if (!inv) return '';
      return `• ${inv.invoiceNumber} - ${inv.customer?.name} (${formatCurrency(inv.amount)})`;
    }).filter(Boolean).join('\n');
    setWhatsappMessage(`Pemberitahuan Tagihan AUDIRA NET:\n\n${lines}\n\nMohon untuk segera melunasi tagihan sebelum tanggal jatuh tempo. Terima kasih.`);
    setShowWhatsAppModal(true);
  };

  const handleSendBulkWhatsApp = async () => {
    const selectedInvs = invoices.filter(inv => selectedInvoicesForWA.includes(inv.id));
    let count = 0;
    for (const inv of selectedInvs) {
      if (inv.customer?.phone) {
        let phone = inv.customer.phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        count++;
        await new Promise(r => setTimeout(r, 600));
      }
    }
    showToast(`WhatsApp reminder dibuka untuk ${count} pelanggan`, 'success');
    setShowWhatsAppModal(false);
    setSelectedInvoicesForWA([]);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      showToast('Tidak ada data invoice untuk diexport', 'info');
      return;
    }
    const headers = ['No Invoice', 'Pelanggan', 'Email', 'Telepon', 'Jumlah (IDR)', 'Jatuh Tempo', 'Status', 'Tanggal Bayar', 'Periode Bulan'];
    const rows = filteredInvoices.map(inv => [
      `"${inv.invoiceNumber}"`,
      `"${(inv.customer?.name || '-').replace(/"/g, '""')}"`,
      `"${inv.customer?.email || '-'}"`,
      `"${inv.customer?.phone || '-'}"`,
      `"${inv.amount}"`,
      `"${new Date(inv.dueDate).toLocaleDateString('id-ID')}"`,
      `"${inv.status}"`,
      `"${inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : '-'}"`,
      `"${inv.month || '-'}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audira-invoice-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV invoice berhasil diunduh', 'success');
  };

  // Filter Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
      if (filterMonth !== 'ALL' && inv.month && !inv.month.includes(filterMonth)) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesNo = inv.invoiceNumber?.toLowerCase().includes(term);
        const matchesCust = inv.customer?.name?.toLowerCase().includes(term);
        const matchesPhone = inv.customer?.phone?.includes(term);
        if (!matchesNo && !matchesCust && !matchesPhone) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt || b.dueDate).getTime() - new Date(a.createdAt || a.dueDate).getTime());
  }, [invoices, filterStatus, filterMonth, searchTerm]);

  // Computed Financial Metrics (Real Aggregates)
  const stats = useMemo(() => {
    const totalCount = invoices.length;
    const paidInvoices = invoices.filter(i => i.status === 'PAID');
    const pendingInvoices = invoices.filter(i => i.status === 'PENDING');
    const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');

    const totalBilled = invoices.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalPaid = paidInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalPending = pendingInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalOverdue = overdueInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

    const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

    return {
      totalCount,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      totalBilled,
      totalPaid,
      totalPending,
      totalOverdue,
      collectionRate
    };
  }, [invoices]);

  const totalPages = Math.ceil(filteredInvoices.length / limit) || 1;
  const paginatedInvoices = filteredInvoices.slice((page - 1) * limit, page * limit);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Lunas
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Menunggu
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Jatuh Tempo
          </span>
        );
      default:
        return <span className="inline-flex items-center px-2 py-0.5 text-xs text-theme-muted">{status}</span>;
    }
  };

  const currentDateDisplay = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Keuangan & Billing</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Manajemen Tagihan</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Receipt className="text-theme-primary" size={26} />
              Daftar Tagihan & Invoice
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-theme-card border border-theme-border px-3.5 py-2 rounded-xl text-xs font-medium text-theme-muted">
              <Calendar size={14} className="text-theme-primary" />
              <span>{currentDateDisplay}</span>
            </div>
            <button 
              onClick={() => fetchInvoices()}
              className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Tagihan"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border text-theme-muted hover:text-theme-text text-xs font-semibold rounded-xl transition"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-sm transition"
            >
              <Plus size={16} />
              <span>Generate Invoice</span>
            </button>
            <Link 
              href="/whatsapp/billing-scheduler"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold rounded-xl text-white shadow-sm transition"
            >
              <Zap size={14} />
              <span>WhatsApp Scheduler</span>
            </Link>
          </div>
        </div>

        {/* ─── Dynamic Financial KPI Cards ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Card 1: Total Tagihan */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Tagihan</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <FileText size={15} />
              </div>
            </div>
            <p className="text-xl font-black text-theme-text font-mono mt-2">{formatCurrency(stats.totalBilled)}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Jumlah Lembar</span>
              <span className="font-semibold text-theme-text font-mono">{stats.totalCount} invoice</span>
            </div>
          </div>

          {/* Card 2: Lunas Terbayar */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Sudah Terbayar</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle size={15} />
              </div>
            </div>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">{formatCurrency(stats.totalPaid)}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Terkumpul</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{stats.paidCount} invoice</span>
            </div>
          </div>

          {/* Card 3: Menunggu Pembayaran */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Menunggu Bayar</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Clock size={15} />
              </div>
            </div>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-2">{formatCurrency(stats.totalPending)}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Tertunda</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">{stats.pendingCount} invoice</span>
            </div>
          </div>

          {/* Card 4: Jatuh Tempo / Overdue */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Jatuh Tempo</span>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <AlertTriangle size={15} />
              </div>
            </div>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono mt-2">{formatCurrency(stats.totalOverdue)}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Perlu Isolir</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono">{stats.overdueCount} invoice</span>
            </div>
          </div>

          {/* Card 5: Collection Rate */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Tingkat Penagihan</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Percent size={15} />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-2">{stats.collectionRate}%</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, stats.collectionRate)}%` }} />
            </div>
          </div>
        </div>

        {/* ─── Search & Status Filters ──────────────────────────────────── */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 text-theme-muted" size={16} />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor invoice, nama pelanggan, atau telepon..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-theme-bg border border-theme-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Status Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'PAID', label: 'Lunas' },
                { id: 'PENDING', label: 'Menunggu' },
                { id: 'OVERDUE', label: 'Jatuh Tempo' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilterStatus(tab.id as any);
                    setPage(1);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    filterStatus === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-theme-bg hover:bg-slate-100 dark:hover:bg-slate-800 text-theme-muted hover:text-theme-text border border-theme-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Bulk WhatsApp Action Bar (When selected) ─────────────────── */}
        {selectedInvoicesForWA.length > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{selectedInvoicesForWA.length}</span>
              <span className="text-theme-muted">invoice dipilih untuk pengingat WhatsApp</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrepareBulkWA}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
              >
                <MessageCircle size={14} /> Kirim Pengingat WA
              </button>
              <button
                onClick={() => setSelectedInvoicesForWA([])}
                className="px-3 py-1.5 bg-theme-card hover:bg-slate-200 dark:hover:bg-slate-700 text-theme-text rounded-lg border border-theme-border transition"
              >
                Batalkan
              </button>
            </div>
          </div>
        )}

        {/* ─── Invoices Table ───────────────────────────────────────────── */}
        {loading ? (
          <div className="bg-theme-card border border-theme-border rounded-xl p-12 text-center space-y-3">
            <RefreshCw className="animate-spin text-theme-primary mx-auto" size={32} />
            <p className="text-sm font-semibold text-theme-text">Memuat daftar invoice...</p>
            <p className="text-xs text-theme-muted">Sinkronisasi status pembayaran real-time</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="bg-theme-card border border-theme-border rounded-xl p-12 text-center space-y-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center text-theme-muted">
              <Receipt size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-theme-text">Tidak ada data invoice ditemukan</h3>
              <p className="text-xs text-theme-muted max-w-md mx-auto">
                {searchTerm || filterStatus !== 'ALL'
                  ? 'Tidak ada tagihan yang cocok dengan filter. Coba ubah kata kunci atau status.'
                  : 'Belum ada invoice yang dibuat pada sistem. Klik "Generate Invoice" untuk membuat tagihan otomatis.'}
              </p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl transition"
            >
              <Plus size={15} /> Buat Tagihan Bulanan
            </button>
          </div>
        ) : (
          <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-theme-border text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedInvoices.length > 0 && paginatedInvoices.every(i => selectedInvoicesForWA.includes(i.id))}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedInvoicesForWA(paginatedInvoices.map(i => i.id));
                          } else {
                            setSelectedInvoicesForWA([]);
                          }
                        }}
                        className="rounded border-theme-border"
                      />
                    </th>
                    <th className="p-3.5">No. Invoice</th>
                    <th className="p-3.5">Pelanggan</th>
                    <th className="p-3.5">Jumlah Tagihan</th>
                    <th className="p-3.5">Jatuh Tempo</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border">
                  {paginatedInvoices.map(inv => {
                    const isSelected = selectedInvoicesForWA.includes(inv.id);
                    return (
                      <tr
                        key={inv.id}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedInvoicesForWA(prev =>
                                prev.includes(inv.id) ? prev.filter(x => x !== inv.id) : [...prev, inv.id]
                              );
                            }}
                            className="rounded border-theme-border"
                          />
                        </td>

                        <td className="p-3.5 font-mono">
                          <span className="font-bold text-theme-text text-[11px]">{inv.invoiceNumber}</span>
                          <div className="text-[10px] text-theme-muted mt-0.5">{inv.month || '-'}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-theme-text">{inv.customer?.name || 'Pelanggan Umum'}</div>
                          <div className="text-[11px] text-theme-muted font-mono mt-0.5">{inv.customer?.phone || '-'}</div>
                        </td>

                        <td className="p-3.5 font-mono">
                          <div className="font-extrabold text-theme-text text-xs">{formatCurrency(inv.amount)}</div>
                          {inv.paidAt && (
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                              Lunas: {new Date(inv.paidAt).toLocaleDateString('id-ID')}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 font-mono">
                          <div className="text-theme-text font-medium">{new Date(inv.dueDate).toLocaleDateString('id-ID')}</div>
                          <div className="text-[10px] text-theme-muted">
                            {new Date(inv.dueDate).getTime() < Date.now() && inv.status !== 'PAID' ? (
                              <span className="text-rose-600 dark:text-rose-400 font-bold">Terlewat</span>
                            ) : (
                              'Berjalan'
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          {getStatusBadge(inv.status)}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* PDF Kwitansi Resmi AUDIRA */}
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'}/billing/invoices/${inv.id}/receipt-pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-theme-muted hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                              title="Cetak / Unduh Kwitansi PDF Resmi AUDIRA"
                            >
                              <FileText size={15} />
                            </a>

                            {/* WhatsApp Reminder */}
                            {inv.customer?.phone && (
                              <button
                                onClick={() => handleOpenWhatsApp(inv.customer.phone, inv.invoiceNumber, inv.amount, inv.dueDate, inv.customer.name)}
                                className="p-1.5 rounded-lg text-theme-muted hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                                title="Kirim Pengingat WhatsApp"
                              >
                                <MessageCircle size={15} />
                              </button>
                            )}

                            {/* Mark Paid button */}
                            {inv.status !== 'PAID' && (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setShowMarkPaidModal(true);
                                }}
                                className="p-1.5 rounded-lg text-theme-muted hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                                title="Tandai Lunas"
                              >
                                <CheckCircle size={15} />
                              </button>
                            )}

                            {/* Detail / Thermal Print Modal */}
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowDetailModal(true);
                              }}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Lihat Detail & Cetak Resi"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Edit Invoice Button */}
                            <button
                              onClick={() => handleOpenEditModal(inv)}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                              title="Edit Tagihan & Nominal"
                            >
                              <Edit size={15} />
                            </button>

                            {/* Delete Invoice Button */}
                            <button
                              onClick={() => handleOpenDeleteModal(inv)}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Hapus Tagihan"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-theme-muted">
                Menampilkan <span className="font-semibold text-theme-text font-mono">{(page - 1) * limit + 1}</span> - <span className="font-semibold text-theme-text font-mono">{Math.min(page * limit, filteredInvoices.length)}</span> dari <span className="font-semibold text-theme-text font-mono">{filteredInvoices.length}</span> invoice
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-theme-border bg-theme-card text-theme-muted hover:text-theme-text disabled:opacity-40 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-1 font-mono text-xs font-semibold text-theme-text">
                  Hal {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-theme-border bg-theme-card text-theme-muted hover:text-theme-text disabled:opacity-40 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Generate Invoice Massal ─────────────────────────── */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-theme-border bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-sm font-bold text-theme-text flex items-center gap-2">
                  <Plus size={16} className="text-theme-primary" /> Generate Tagihan Bulanan
                </h2>
                <button onClick={() => setShowGenerateModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-theme-muted hover:text-theme-text">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-theme-muted">Pilih Periode Bulan Tagihan</label>
                  <input
                    type="month"
                    value={generateMonth}
                    onChange={e => setGenerateMonth(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border px-3.5 py-2 rounded-xl text-theme-text text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-3.5 text-xs text-blue-800 dark:text-blue-300 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <Zap size={14} /> Aturan Otomasi Penagihan:
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[11px] opacity-90">
                    <li>Tagihan dibuat untuk semua pelanggan berstatus <strong>Aktif</strong></li>
                    <li>Nominal tagihan dihitung dari paket langganan pelanggan</li>
                    <li>Invoice ganda untuk pelanggan & periode yang sama diabaikan otomatis</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border-t border-theme-border flex gap-2.5 justify-end bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleGenerateInvoices}
                  disabled={actionLoading === 'generate'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  {actionLoading === 'generate' ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                  <span>{actionLoading === 'generate' ? 'Memproses...' : 'Generate Sekarang'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Tandai Lunas ─────────────────────────────────────── */}
        {showMarkPaidModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-theme-border bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-sm font-bold text-theme-text flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Konfirmasi Pelunasan Tagihan
                </h2>
                <button onClick={() => setShowMarkPaidModal(false)} className="p-1.5 text-theme-muted hover:text-theme-text">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-theme-bg border border-theme-border rounded-xl p-4 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">No. Invoice</span>
                    <p className="font-mono font-bold text-theme-text">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">Nama Pelanggan</span>
                    <p className="font-semibold text-theme-text">{selectedInvoice.customer?.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase font-bold tracking-wider">Total Pembayaran</span>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{formatCurrency(selectedInvoice.amount)}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-theme-muted">Metode Penerimaan Uang</label>
                  <select
                    value={markPaidMethod}
                    onChange={e => setMarkPaidMethod(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                  >
                    {PAYMENT_METHODS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-theme-border flex gap-2.5 justify-end bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowMarkPaidModal(false)}
                  className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleMarkPaid}
                  disabled={actionLoading === 'mark-paid'}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {actionLoading === 'mark-paid' ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{actionLoading === 'mark-paid' ? 'Menyimpan...' : 'Konfirmasi Lunas'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Detail Invoice & Thermal Print ───────────────────── */}
        {showDetailModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-theme-border bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-sm font-bold text-theme-text flex items-center gap-2">
                  <Receipt size={16} className="text-theme-primary" /> Detail & Struk Tagihan
                </h2>
                <button onClick={() => setShowDetailModal(false)} className="p-1.5 text-theme-muted hover:text-theme-text">
                  <X size={16} />
                </button>
              </div>

              {/* Printable Invoice Container */}
              <div className="p-6 space-y-5 text-xs font-sans print:p-0">
                <div className="flex justify-between items-start border-b border-theme-border pb-4">
                  <div>
                    <h3 className="font-black text-base text-theme-text tracking-wider">AUDIRA NET</h3>
                    <p className="text-[10px] text-theme-muted mt-0.5">PT. AUDIRA MULTIMEDIA DIGITAL</p>
                    <p className="text-[10px] text-theme-muted">Hotline: 0821-1200-1600 | https://audira.my.id</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-theme-primary">{selectedInvoice.invoiceNumber}</span>
                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase font-bold block">Ditagihkan Kepada:</span>
                    <p className="font-bold text-theme-text mt-1">{selectedInvoice.customer?.name}</p>
                    <p className="text-theme-muted font-mono">{selectedInvoice.customer?.phone}</p>
                    <p className="text-theme-muted">{selectedInvoice.customer?.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase font-bold block">Rincian Jatuh Tempo:</span>
                    <p className="text-theme-text mt-1">Periode: <span className="font-semibold">{selectedInvoice.month || '-'}</span></p>
                    <p className="text-theme-text">Batas Bayar: <span className="font-semibold font-mono">{new Date(selectedInvoice.dueDate).toLocaleDateString('id-ID')}</span></p>
                    {selectedInvoice.paidAt && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Tgl Lunas: {new Date(selectedInvoice.paidAt).toLocaleDateString('id-ID')}</p>
                    )}
                  </div>
                </div>

                <div className="border border-theme-border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-theme-border text-theme-muted font-bold">
                      <tr>
                        <th className="p-3">Deskripsi Layanan</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 text-theme-text">
                          <p className="font-semibold">Langganan Internet Dedicated Broadband</p>
                          <p className="text-[10px] text-theme-muted">Periode Billing: {selectedInvoice.month || '-'}</p>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-theme-text">
                          {formatCurrency(selectedInvoice.amount)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="border-t border-theme-border font-bold">
                      <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                        <td className="p-3 text-theme-text">Total Yang Harus Dibayar</td>
                        <td className="p-3 text-right font-mono text-sm text-theme-primary">
                          {formatCurrency(selectedInvoice.amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="text-[10px] text-theme-muted text-center pt-2">
                  <p>Struk ini merupakan bukti tagihan yang sah dari AUDIRA NET.</p>
                  <p>Terima kasih atas kepercayaan Anda menggunakan layanan kami.</p>
                </div>
              </div>

              <div className="p-4 border-t border-theme-border flex gap-2.5 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-theme-border text-theme-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer size={15} /> Cetak Struk
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-theme-primary hover:opacity-90 text-white rounded-xl text-xs font-bold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Tagihan (Invoice) ─────────────────────────── */}
        {showEditInvoiceModal && invoiceToEdit && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-theme-border bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    <Edit size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-theme-text">Edit Tagihan Pelanggan</h2>
                    <p className="text-[10px] text-theme-muted font-mono">{invoiceToEdit.invoiceNumber}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditInvoiceModal(false)} className="p-1.5 text-theme-muted hover:text-theme-text">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-theme-bg border border-theme-border rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Pelanggan:</span>
                    <span className="font-bold text-theme-text">{invoiceToEdit.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">No. Telepon:</span>
                    <span className="font-mono text-theme-text">{invoiceToEdit.customer?.phone || '-'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">Nominal Tagihan (Rp)</label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">Status Pembayaran</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as any)}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                    >
                      <option value="PENDING">PENDING (Menunggu)</option>
                      <option value="PAID">PAID (Lunas)</option>
                      <option value="OVERDUE">OVERDUE (Terlambat)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">Tanggal Jatuh Tempo</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={e => setEditDueDate(e.target.value)}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs font-mono text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">Periode Bulan</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026-07 atau Juli 2026"
                      value={editMonth}
                      onChange={e => setEditMonth(e.target.value)}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-muted mb-1">Catatan / Deskripsi Tambahan</label>
                  <input
                    type="text"
                    placeholder="e.g. Diskon promo / Penyesuaian paket"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-theme-border flex gap-2.5 justify-end bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowEditInvoiceModal(false)}
                  className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEditInvoice}
                  disabled={actionLoading === 'save-edit'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {actionLoading === 'save-edit' ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{actionLoading === 'save-edit' ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Hapus Tagihan (Delete Confirmation) ──────────────── */}
        {showDeleteInvoiceModal && invoiceToDelete && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-theme-border bg-rose-50/50 dark:bg-rose-950/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    <Trash2 size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">Konfirmasi Hapus Tagihan</h2>
                    <p className="text-[10px] text-theme-muted">Tindakan ini tidak dapat dibatalkan</p>
                  </div>
                </div>
                <button onClick={() => setShowDeleteInvoiceModal(false)} className="p-1.5 text-theme-muted hover:text-theme-text">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-theme-text">
                  Apakah Anda yakin ingin menghapus tagihan ini secara permanen dari basis data?
                </p>

                <div className="bg-theme-bg border border-theme-border rounded-xl p-3.5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Nomor Tagihan:</span>
                    <span className="font-bold text-theme-text">{invoiceToDelete.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Pelanggan:</span>
                    <span className="font-bold text-theme-text">{invoiceToDelete.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Nominal:</span>
                    <span className="font-bold text-rose-500">{formatCurrency(invoiceToDelete.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-muted">Status:</span>
                    <span className="font-bold uppercase text-theme-text">{invoiceToDelete.status}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-theme-border flex gap-2.5 justify-end bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowDeleteInvoiceModal(false)}
                  className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDeleteInvoice}
                  disabled={actionLoading === 'delete-invoice'}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  {actionLoading === 'delete-invoice' ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>{actionLoading === 'delete-invoice' ? 'Menghapus...' : 'Ya, Hapus Tagihan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Kirim Massal WhatsApp ────────────────────────────── */}
        {showWhatsAppModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-theme-border bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-sm font-bold text-theme-text flex items-center gap-2">
                  <Send size={16} className="text-emerald-500" /> Broadcast Pengingat WhatsApp
                </h2>
                <button onClick={() => setShowWhatsAppModal(false)} className="p-1.5 text-theme-muted hover:text-theme-text">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-3.5">
                <div className="text-xs text-theme-muted">
                  Mengirimkan pesan pengingat tagihan ke <strong className="text-theme-text font-mono">{selectedInvoicesForWA.length}</strong> pelanggan terpilih:
                </div>
                <textarea
                  rows={6}
                  value={whatsappMessage}
                  onChange={e => setWhatsappMessage(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-xl p-3 text-xs text-theme-text font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-4 border-t border-theme-border flex gap-2.5 justify-end bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendBulkWhatsApp}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Send size={14} /> Kirim WhatsApp Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
