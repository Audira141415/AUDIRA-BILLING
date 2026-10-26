import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
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

export default function DueInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Hari Ini' | '1 - 3 Hari' | '4 - 7 Hari' | '8 - 14 Hari' | '> 15 Hari'>('Semua');
  const [selectedMethod, setSelectedMethod] = useState('Semua Metode');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState<'PENDING' | 'PAID' | 'OVERDUE'>('PENDING');
  const [editMonth, setEditMonth] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [markPaidMethod, setMarkPaidMethod] = useState('Transfer Bank');

  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const [showBulkReminderModal, setShowBulkReminderModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Fetch real invoices
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.keuangan.getInvoices();
      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        setInvoices([]);
      }
    } catch (err: any) {
      console.error('Failed to load due invoices:', err);
      showToast('Gagal memuat data tagihan jatuh tempo', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Compute days difference from today to due date
  // Positive = days late (past due), 0 = today, Negative = days remaining until due
  const getDueInfo = (dueDateStr: string) => {
    if (!dueDateStr) return { daysDiff: 0, label: 'Hari ini', statusCategory: 'Hari Ini' as const };
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - due.getTime();
    const daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (daysLate === 0) {
      return { daysLate: 0, label: 'Jatuh tempo Hari ini', statusCategory: 'Hari Ini' as const };
    } else if (daysLate > 0 && daysLate <= 3) {
      return { daysLate, label: `${daysLate} Hari lalu`, statusCategory: '1 - 3 Hari' as const };
    } else if (daysLate >= 4 && daysLate <= 7) {
      return { daysLate, label: `${daysLate} Hari lalu`, statusCategory: '4 - 7 Hari' as const };
    } else if (daysLate >= 8 && daysLate <= 14) {
      return { daysLate, label: `${daysLate} Hari lalu`, statusCategory: '8 - 14 Hari' as const };
    } else if (daysLate > 14) {
      return { daysLate, label: `${daysLate} Hari lalu`, statusCategory: '> 15 Hari' as const };
    } else {
      // Future due date within current period
      const daysLeft = Math.abs(daysLate);
      return { daysLate: 0, label: `${daysLeft} Hari lagi`, statusCategory: 'Hari Ini' as const };
    }
  };

  // Due invoices: unpaid invoices
  const dueInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status !== 'PAID');
  }, [invoices]);

  // Dynamic KPI Stats
  const kpiStats = useMemo(() => {
    let todayCount = 0;
    let todayTotal = 0;
    let d1to3Count = 0;
    let d1to3Total = 0;
    let d4to7Count = 0;
    let d4to7Total = 0;
    let d8to14Count = 0;
    let d8to14Total = 0;
    let d15PlusCount = 0;
    let d15PlusTotal = 0;

    dueInvoices.forEach(inv => {
      const { statusCategory } = getDueInfo(inv.dueDate);
      const amt = Number(inv.amount) || 0;
      if (statusCategory === 'Hari Ini') {
        todayCount++;
        todayTotal += amt;
      } else if (statusCategory === '1 - 3 Hari') {
        d1to3Count++;
        d1to3Total += amt;
      } else if (statusCategory === '4 - 7 Hari') {
        d4to7Count++;
        d4to7Total += amt;
      } else if (statusCategory === '8 - 14 Hari') {
        d8to14Count++;
        d8to14Total += amt;
      } else if (statusCategory === '> 15 Hari') {
        d15PlusCount++;
        d15PlusTotal += amt;
      }
    });

    return {
      totalCount: dueInvoices.length,
      todayCount,
      todayTotal,
      d1to3Count,
      d1to3Total,
      d4to7Count,
      d4to7Total,
      d8to14Count,
      d8to14Total,
      d15PlusCount,
      d15PlusTotal,
    };
  }, [dueInvoices]);

  // Filtered invoices according to tab & search
  const filteredInvoices = useMemo(() => {
    return dueInvoices.filter(inv => {
      const { statusCategory } = getDueInfo(inv.dueDate);
      
      // Tab filter
      if (activeTab !== 'Semua' && statusCategory !== activeTab) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchNum = inv.invoiceNumber?.toLowerCase().includes(q);
        const matchName = inv.customer?.name?.toLowerCase().includes(q);
        const matchPhone = inv.customer?.phone?.toLowerCase().includes(q);
        const matchDesc = inv.description?.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchPhone && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [dueInvoices, activeTab, searchTerm]);

  // Paginated
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / limit));
  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredInvoices.slice(start, start + limit);
  }, [filteredInvoices, page, limit]);

  // Selection handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedInvoices.map(d => d.id));
    }
  };

  // View / Detail
  const handleOpenDetail = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowDetailModal(true);
  };

  // Edit Invoice
  const handleOpenEdit = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setEditAmount(inv.amount ? String(inv.amount) : '');
    setEditDueDate(inv.dueDate ? inv.dueDate.split('T')[0] : '');
    setEditStatus(inv.status);
    setEditMonth(inv.month || '');
    setEditDescription(inv.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!invoiceToEdit) return;
    setActionLoading('edit');
    try {
      await api.keuangan.updateInvoice(invoiceToEdit.id, {
        amount: parseFloat(editAmount) || invoiceToEdit.amount,
        dueDate: editDueDate || invoiceToEdit.dueDate,
        status: editStatus,
        month: editMonth || invoiceToEdit.month,
        description: editDescription,
      });
      showToast('Tagihan berhasil diperbarui', 'success');
      setShowEditModal(false);
      setInvoiceToEdit(null);
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal memperbarui tagihan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Invoice
  const handleOpenDelete = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    setActionLoading('delete');
    try {
      await api.keuangan.deleteInvoice(invoiceToDelete.id);
      showToast('Tagihan berhasil dihapus', 'success');
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menghapus tagihan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading('bulk-delete');
    try {
      for (const id of selectedIds) {
        await api.keuangan.deleteInvoice(id);
      }
      showToast(`${selectedIds.length} tagihan berhasil dihapus`, 'success');
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menghapus beberapa tagihan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Mark Paid
  const handleOpenMarkPaid = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setShowMarkPaidModal(true);
  };

  const handleConfirmMarkPaid = async () => {
    if (!selectedInvoice) return;
    setActionLoading('mark-paid');
    try {
      await api.keuangan.markPaid(selectedInvoice.id, markPaidMethod);
      showToast(`Tagihan ${selectedInvoice.invoiceNumber} berhasil dilunasi`, 'success');
      setShowMarkPaidModal(false);
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal melunasi tagihan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Suspend Customer
  const handleToggleSuspend = async (inv: Invoice) => {
    if (!inv.customer?.id) return;
    setActionLoading(`suspend-${inv.id}`);
    try {
      await api.keuangan.suspendCustomer(inv.customer.id, 'Isolir otomatis karena tagihan jatuh tempo belum dibayar');
      showToast(`Pelanggan ${inv.customer.name} berhasil diisolir`, 'success');
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal mengisolir pelanggan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // WhatsApp Single Reminder
  const handleOpenWhatsApp = (inv: Invoice) => {
    setSelectedInvoice(inv);
    const { label } = getDueInfo(inv.dueDate);
    const phone = inv.customer?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const defaultMsg = `Halo Kak ${inv.customer?.name || 'Pelanggan'}, tagihan internet AUDIRA Anda (${inv.invoiceNumber}) sebesar ${formatCurrency(inv.amount)} telah jatuh tempo (${label}). Silakan melakukan pembayaran melalui link atau QRIS resmi kami. Terima kasih! 🙏`;
    setWhatsappMessage(defaultMsg);
    setShowWhatsAppModal(true);
  };

  const handleSendWhatsApp = async () => {
    if (!selectedInvoice) return;
    const phone = selectedInvoice.customer?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Attempt backend WhatsApp API or fallback to WhatsApp Web
    try {
      if (api.whatsapp?.sendHariHReminder) {
        await api.whatsapp.sendHariHReminder({
          phone: cleanPhone,
          invoiceId: selectedInvoice.id,
        }).catch(() => {});
      }
    } catch (e) {
      console.log('Backend WA not reachable, opening direct WA link');
    }

    const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    setShowWhatsAppModal(false);
    showToast('Pesan reminder WhatsApp diarahkan', 'success');
  };

  // Bulk WhatsApp Reminders
  const handleOpenBulkReminder = () => {
    if (selectedIds.length === 0) {
      showToast('Pilih minimal 1 tagihan untuk reminder massal', 'info');
      return;
    }
    setShowBulkReminderModal(true);
  };

  const handleSendBulkReminder = async () => {
    setActionLoading('bulk-reminder');
    try {
      const targets = dueInvoices.filter(i => selectedIds.includes(i.id));
      for (const t of targets) {
        if (api.whatsapp?.sendHariHReminder) {
          await api.whatsapp.sendHariHReminder({
            phone: t.customer?.phone || '',
            invoiceId: t.id,
          }).catch(() => {});
        }
      }
      showToast(`Reminder massal berhasil diproses untuk ${targets.length} pelanggan`, 'success');
      setShowBulkReminderModal(false);
    } catch (err: any) {
      console.error(err);
      showToast('Terjadi kesalahan saat memproses reminder massal', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      showToast('Tidak ada data tagihan untuk diexport', 'info');
      return;
    }

    const headers = ['No Invoice', 'Nama Pelanggan', 'No HP', 'Jatuh Tempo', 'Hari Terlambat', 'Total (Rp)', 'Status'];
    const rows = filteredInvoices.map(inv => {
      const { daysLate, statusCategory } = getDueInfo(inv.dueDate);
      return [
        `"${inv.invoiceNumber || ''}"`,
        `"${inv.customer?.name || ''}"`,
        `"${inv.customer?.phone || ''}"`,
        `"${inv.dueDate ? inv.dueDate.split('T')[0] : ''}"`,
        `"${daysLate} Hari"`,
        `"${inv.amount || 0}"`,
        `"${statusCategory}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tagihan_Jatuh_Tempo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV berhasil diunduh', 'success');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Toast Notification ────────────────────────────────────────── */}
        {toast && (
          <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : toast.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-800'
              : 'bg-blue-950/90 text-blue-200 border-blue-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
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
              <span className="text-amber-400 font-semibold">Invoice Jatuh Tempo</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Monitoring Tagihan Jatuh Tempo (Due Invoices)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {kpiStats.totalCount} Tagihan Aktif
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar tagihan yang memasuki batas akhir pembayaran bulan berjalan dan siap dikirimkan reminder WhatsApp atau diisolir.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenBulkReminder}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <BellRing size={14} />
              <span>Kirim Reminder Massal</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={loadInvoices}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Card 1: Total Jatuh Tempo */}
          <div 
            onClick={() => setActiveTab('Semua')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'Semua' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Jatuh Tempo</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{kpiStats.totalCount}</p>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium">Semua Unpaid</p>
            </div>
          </div>

          {/* Card 2: Hari Ini */}
          <div 
            onClick={() => setActiveTab('Hari Ini')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === 'Hari Ini' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Hari Ini</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{kpiStats.todayCount}</p>
              <p className="text-[10px] text-amber-400 mt-0.5 font-medium">{formatCurrency(kpiStats.todayTotal)}</p>
            </div>
          </div>

          {/* Card 3: 1 - 3 Hari */}
          <div 
            onClick={() => setActiveTab('1 - 3 Hari')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === '1 - 3 Hari' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">1 - 3 Hari</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{kpiStats.d1to3Count}</p>
              <p className="text-[10px] text-orange-400 mt-0.5 font-medium">{formatCurrency(kpiStats.d1to3Total)}</p>
            </div>
          </div>

          {/* Card 4: 4 - 7 Hari */}
          <div 
            onClick={() => setActiveTab('4 - 7 Hari')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === '4 - 7 Hari' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">4 - 7 Hari</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{kpiStats.d4to7Count}</p>
              <p className="text-[10px] text-purple-400 mt-0.5 font-medium">{formatCurrency(kpiStats.d4to7Total)}</p>
            </div>
          </div>

          {/* Card 5: 8 - 14 Hari */}
          <div 
            onClick={() => setActiveTab('8 - 14 Hari')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === '8 - 14 Hari' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">8 - 14 Hari</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{kpiStats.d8to14Count}</p>
              <p className="text-[10px] text-red-400 mt-0.5 font-medium">{formatCurrency(kpiStats.d8to14Total)}</p>
            </div>
          </div>

          {/* Card 6: > 15 Hari */}
          <div 
            onClick={() => setActiveTab('> 15 Hari')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === '> 15 Hari' ? 'border-rose-600 ring-2 ring-rose-600/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3 bg-rose-600/10 text-rose-500 border border-rose-600/20 rounded-xl">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">&gt; 15 Hari</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{kpiStats.d15PlusCount}</p>
              <p className="text-[10px] text-rose-400 mt-0.5 font-medium">{formatCurrency(kpiStats.d15PlusTotal)}</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari nomor invoice, pelanggan, telepon, deskripsi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category / Status Selector */}
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as any);
                setPage(1);
              }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[140px]"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Hari Ini">Hari Ini</option>
              <option value="1 - 3 Hari">1 - 3 Hari</option>
              <option value="4 - 7 Hari">4 - 7 Hari</option>
              <option value="8 - 14 Hari">8 - 14 Hari</option>
              <option value="> 15 Hari">&gt; 15 Hari</option>
            </select>

            <button 
              onClick={() => { 
                setSearchTerm(''); 
                setActiveTab('Semua');
                setPage(1);
              }}
              className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all cursor-pointer"
            >
              Reset Filter
            </button>

            <button 
              onClick={handleOpenBulkReminder}
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer ml-auto"
            >
              <BellRing size={14} />
              <span>Reminder Massal</span>
            </button>
          </div>
        </div>

        {/* ─── Mass Action bar (visible when rows selected) ─────────────── */}
        {selectedIds.length > 0 && (
          <div className="bg-[var(--app-card)] border border-blue-500/40 rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-400">
                {selectedIds.length} tagihan dipilih
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-[var(--app-muted)] hover:text-white underline"
              >
                Batal Pilih
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenBulkReminder}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                <MessageCircle size={13} />
                <span>Kirim WA Terpilih</span>
              </button>
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Hapus Terpilih</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Main Content: Due Table ────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={paginatedInvoices.length > 0 && selectedIds.length === paginatedInvoices.length}
                      onChange={handleSelectAll}
                      className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 cursor-pointer" 
                    />
                  </th>
                  <th className="p-4 w-12">NO</th>
                  <th className="p-4 w-44">INVOICE</th>
                  <th className="p-4 w-44">CUSTOMER</th>
                  <th className="p-4 w-36">JATUH TEMPO</th>
                  <th className="p-4 w-36">STATUS JATUH TEMPO</th>
                  <th className="p-4 w-28">TOTAL</th>
                  <th className="p-4 w-28">PERIODE</th>
                  <th className="p-4 w-36 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[var(--app-muted)]">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin text-blue-500" size={16} />
                        <span>Memuat data tagihan jatuh tempo...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[var(--app-muted)]">
                      Tidak ada tagihan jatuh tempo yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((d, idx) => {
                    const isSelected = selectedIds.includes(d.id);
                    const { daysLate, label, statusCategory } = getDueInfo(d.dueDate);
                    const rowNumber = (page - 1) * limit + idx + 1;

                    return (
                      <tr 
                        key={d.id}
                        className={`hover:bg-[var(--app-border)]/30 transition-colors ${isSelected ? 'bg-blue-500/10' : ''}`}
                      >
                        <td className="p-4">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleSelectRow(d.id)}
                            className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 cursor-pointer" 
                          />
                        </td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{rowNumber}</td>
                        <td className="p-4 font-mono font-semibold tracking-wider">
                          <div className="space-y-1">
                            <span className="block text-blue-400 font-bold">{d.invoiceNumber}</span>
                            <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              {d.month || 'Reguler'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[var(--app-text)] block">{d.customer?.name || 'Pelanggan'}</span>
                            <span className="text-[10px] text-[var(--app-muted)] block font-semibold">{d.customer?.phone || '-'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="block text-[var(--app-text)] font-semibold">{formatDate(d.dueDate)}</span>
                          <span className={`text-[10px] block mt-0.5 ${statusCategory === 'Hari Ini' ? 'text-amber-400 font-bold' : 'text-red-400'}`}>
                            {label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            statusCategory === 'Hari Ini' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : statusCategory === '1 - 3 Hari'
                              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                              : statusCategory === '4 - 7 Hari'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {statusCategory}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.amount)}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.month || '-'}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View Detail */}
                            <button 
                              onClick={() => handleOpenDetail(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                              title="Lihat Detail"
                            >
                              <Eye size={14} />
                            </button>
                            
                            {/* WhatsApp Reminder */}
                            <button 
                              onClick={() => handleOpenWhatsApp(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                              title="Kirim Reminder WA"
                            >
                              <MessageCircle size={14} />
                            </button>

                            {/* Mark Paid */}
                            <button 
                              onClick={() => handleOpenMarkPaid(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                              title="Catat Pembayaran"
                            >
                              <Wallet size={14} />
                            </button>

                            {/* Edit */}
                            <button 
                              onClick={() => handleOpenEdit(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                              title="Edit Tagihan"
                            >
                              <Edit size={14} />
                            </button>

                            {/* Suspend Customer */}
                            <button 
                              onClick={() => handleToggleSuspend(d)}
                              disabled={actionLoading === `suspend-${d.id}`}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                              title="Isolir Pelanggan"
                            >
                              <Power size={14} />
                            </button>

                            {/* Delete */}
                            <button 
                              onClick={() => handleOpenDelete(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-[var(--app-card)]">
            <span className="text-xs text-[var(--app-muted)]">
              Menampilkan <span className="font-semibold text-[var(--app-text)]">{filteredInvoices.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, filteredInvoices.length)}</span> dari <span className="font-semibold text-[var(--app-text)]">{filteredInvoices.length}</span> data
            </span>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <button 
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs px-3 py-1 font-semibold text-[var(--app-text)]">
                  Hal {page} dari {totalPages}
                </span>
                <button 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-3 rounded-lg text-[var(--app-text)] focus:outline-none"
              >
                <option value={10}>10 / halaman</option>
                <option value={25}>25 / halaman</option>
                <option value={50}>50 / halaman</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─── MODAL: Detail Tagihan ──────────────────────────────────────── */}
        {showDetailModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)]">Detail Tagihan Jatuh Tempo</h3>
                  <p className="text-xs text-blue-400 font-mono mt-0.5">{selectedInvoice.invoiceNumber}</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-[var(--app-bg)] p-4 rounded-xl border border-[var(--app-border)]">
                  <div>
                    <span className="text-[var(--app-muted)] block">Pelanggan</span>
                    <span className="font-bold text-[var(--app-text)] text-sm">{selectedInvoice.customer?.name || '-'}</span>
                    <span className="text-[var(--app-muted)] block mt-0.5">{selectedInvoice.customer?.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--app-muted)] block">Total Tagihan</span>
                    <span className="font-bold text-amber-400 text-sm">{formatCurrency(selectedInvoice.amount)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 inline-block mt-1">
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Tanggal Terbit</span>
                    <span className="font-semibold text-[var(--app-text)]">{formatDate(selectedInvoice.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Batas Akhir (Due Date)</span>
                    <span className="font-semibold text-red-400">{formatDate(selectedInvoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Periode Tagihan</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedInvoice.month || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Keterangan / Paket</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedInvoice.description || 'Layanan Internet AUDIRA-NET'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenWhatsApp(selectedInvoice);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>Kirim WA</span>
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenMarkPaid(selectedInvoice);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Wallet size={14} />
                  <span>Catat Lunas</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Tagihan ────────────────────────────────────────── */}
        {showEditModal && invoiceToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--app-text)]">Edit Data Tagihan</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nomor Invoice</label>
                  <input
                    type="text"
                    disabled
                    value={invoiceToEdit.invoiceNumber}
                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-muted)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Total Tagihan (Rp)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Batas Akhir (Due Date)</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Periode Bulan</label>
                  <input
                    type="text"
                    value={editMonth}
                    onChange={(e) => setEditMonth(e.target.value)}
                    placeholder="Contoh: Oktober 2026"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Status Tagihan</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="OVERDUE">OVERDUE</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Deskripsi / Keterangan</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'edit'}
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'edit' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Mark Paid ───────────────────────────────────────────── */}
        {showMarkPaidModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--app-text)]">Konfirmasi Pembayaran</h3>
                <button 
                  onClick={() => setShowMarkPaidModal(false)}
                  className="p-1 hover:bg-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-[var(--app-muted)]">
                  Tandai invoice <strong className="text-white">{selectedInvoice.invoiceNumber}</strong> milik <strong className="text-white">{selectedInvoice.customer?.name}</strong> sebagai <strong className="text-emerald-400">LUNAS</strong>?
                </p>

                <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--app-border)]">
                  <span className="text-[var(--app-muted)] block text-[10px]">TOTAL DIBAYAR</span>
                  <span className="text-base font-bold text-emerald-400">{formatCurrency(selectedInvoice.amount)}</span>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Metode Pembayaran</label>
                  <select
                    value={markPaidMethod}
                    onChange={(e) => setMarkPaidMethod(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none"
                  >
                    {PAYMENT_METHODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowMarkPaidModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'mark-paid'}
                  onClick={handleConfirmMarkPaid}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'mark-paid' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Proses Lunas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Delete Confirmation ─────────────────────────────────── */}
        {showDeleteModal && invoiceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-red-500/40 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle size={24} />
                <h3 className="text-base font-bold text-white">Hapus Tagihan?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Apakah Anda yakin ingin menghapus tagihan <strong className="text-white">{invoiceToDelete.invoiceNumber}</strong> sebesar <strong className="text-white">{formatCurrency(invoiceToDelete.amount)}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'delete'}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'delete' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Hapus Tagihan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Bulk Delete Confirmation ───────────────────────────── */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-red-500/40 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle size={24} />
                <h3 className="text-base font-bold text-white">Hapus Massal Tagihan?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Anda akan menghapus <strong className="text-white">{selectedIds.length}</strong> tagihan yang dipilih. Apakah Anda yakin?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'bulk-delete'}
                  onClick={handleConfirmBulkDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'bulk-delete' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Hapus Semua Terpilih</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: WhatsApp Reminder ──────────────────────────────────── */}
        {showWhatsAppModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-emerald-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <MessageCircle size={20} />
                  <h3 className="text-base font-bold text-white">Kirim Reminder WhatsApp</h3>
                </div>
                <button 
                  onClick={() => setShowWhatsAppModal(false)}
                  className="p-1 hover:bg-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--app-border)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--app-muted)]">Tujuan:</span>
                    <span className="font-bold text-white">{selectedInvoice.customer?.name} ({selectedInvoice.customer?.phone})</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[var(--app-muted)]">Invoice:</span>
                    <span className="font-mono text-blue-400">{selectedInvoice.invoiceNumber}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Teks Pesan Reminder</label>
                  <textarea
                    rows={4}
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Bulk WhatsApp Reminder ─────────────────────────────── */}
        {showBulkReminderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-emerald-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <BellRing size={20} />
                  <h3 className="text-base font-bold text-white">Broadcast Reminder Massal</h3>
                </div>
                <button 
                  onClick={() => setShowBulkReminderModal(false)}
                  className="p-1 hover:bg-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-[var(--app-muted)]">
                  Anda akan mengirimkan notifikasi reminder WhatsApp otomatis kepada <strong className="text-white">{selectedIds.length > 0 ? selectedIds.length : dueInvoices.length} pelanggan</strong> yang memiliki tagihan jatuh tempo.
                </p>

                <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl text-emerald-200">
                  <p className="font-semibold mb-1">Format Pesan Otomatis:</p>
                  <p className="italic text-[11px]">
                    "Halo [Nama Pelanggan], tagihan internet AUDIRA Anda ([Nomor Invoice]) sebesar [Nominal] telah jatuh tempo. Mohon segera melakukan pembayaran. Terima kasih!"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowBulkReminderModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'bulk-reminder'}
                  onClick={handleSendBulkReminder}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'bulk-reminder' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Jalankan Broadcast</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
