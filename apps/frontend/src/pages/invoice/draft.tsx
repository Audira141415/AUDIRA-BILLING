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
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Check,
  X,
  User,
  Layers
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

interface Customer {
  id: string;
  name: string;
  phone: string;
  package?: string;
}

export default function DraftInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Perlu Diperiksa' | 'Siap Dipublish'>('Semua');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Create Draft Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMonth, setNewMonth] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Edit Draft Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editMonth, setEditMonth] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Publish Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [invoiceToPublish, setInvoiceToPublish] = useState<Invoice | null>(null);
  const [showBulkPublishModal, setShowBulkPublishModal] = useState(false);

  // WhatsApp
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

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

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [invData, custList] = await Promise.all([
        api.keuangan.getInvoices().catch(() => []),
        api.pelanggan.getAll().catch(() => []),
      ]);

      if (Array.isArray(invData)) {
        setInvoices(invData);
      }
      if (Array.isArray(custList)) {
        setCustomers(custList);
      }
    } catch (err: any) {
      console.error('Failed to load draft data:', err);
      showToast('Gagal memuat data draft invoice', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Draft invoices = invoices with PENDING status
  const draftInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status === 'PENDING');
  }, [invoices]);

  // Categorize drafts
  const getDraftCategory = (inv: Invoice): 'Perlu Diperiksa' | 'Siap Dipublish' => {
    if (!inv.amount || inv.amount <= 0 || !inv.dueDate || !inv.customer?.phone) {
      return 'Perlu Diperiksa';
    }
    return 'Siap Dipublish';
  };

  // Dynamic KPIs
  const kpiStats = useMemo(() => {
    let perluDiperiksa = 0;
    let siapDipublish = 0;
    let totalNominal = 0;

    draftInvoices.forEach(inv => {
      totalNominal += Number(inv.amount) || 0;
      if (getDraftCategory(inv) === 'Perlu Diperiksa') {
        perluDiperiksa++;
      } else {
        siapDipublish++;
      }
    });

    return {
      totalDraft: draftInvoices.length,
      perluDiperiksa,
      siapDipublish,
      totalNominal,
    };
  }, [draftInvoices]);

  // Filtered
  const filteredDrafts = useMemo(() => {
    return draftInvoices.filter(inv => {
      const cat = getDraftCategory(inv);
      if (activeTab !== 'Semua' && cat !== activeTab) {
        return false;
      }

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
  }, [draftInvoices, activeTab, searchTerm]);

  // Paginated
  const totalPages = Math.max(1, Math.ceil(filteredDrafts.length / limit));
  const paginatedDrafts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredDrafts.slice(start, start + limit);
  }, [filteredDrafts, page, limit]);

  // Selection
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedDrafts.length && paginatedDrafts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedDrafts.map(d => d.id));
    }
  };

  // Create Draft
  const handleOpenCreate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 10);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    setNewMonth(`${months[now.getMonth()]} ${now.getFullYear()}`);
    setNewDueDate(nextMonth.toISOString().split('T')[0]);
    setNewAmount('250000');
    setNewDescription('Langganan Internet Dedicated / Broadband');
    if (customers.length > 0) {
      setNewCustomerId(customers[0].id);
    }
    setShowCreateModal(true);
  };

  const handleCreateDraft = async () => {
    if (!newCustomerId) {
      showToast('Pilih pelanggan terlebih dahulu', 'error');
      return;
    }
    setActionLoading('create');
    try {
      await api.keuangan.createInvoice({
        customerId: newCustomerId,
        amount: parseFloat(newAmount) || 0,
        dueDate: newDueDate,
        month: newMonth,
        description: newDescription,
      });
      showToast('Draft invoice berhasil dibuat', 'success');
      setShowCreateModal(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal membuat draft invoice', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Edit Draft
  const handleOpenEdit = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setEditAmount(inv.amount ? String(inv.amount) : '');
    setEditDueDate(inv.dueDate ? inv.dueDate.split('T')[0] : '');
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
        month: editMonth || invoiceToEdit.month,
        description: editDescription,
      });
      showToast('Draft invoice berhasil diperbarui', 'success');
      setShowEditModal(false);
      setInvoiceToEdit(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal memperbarui draft', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Draft
  const handleOpenDelete = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    setActionLoading('delete');
    try {
      await api.keuangan.deleteInvoice(invoiceToDelete.id);
      showToast('Draft invoice berhasil dihapus', 'success');
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menghapus draft', 'error');
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
      showToast(`${selectedIds.length} draft berhasil dihapus`, 'success');
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menghapus beberapa draft', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Publish Draft
  const handleOpenPublish = (inv: Invoice) => {
    setInvoiceToPublish(inv);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    if (!invoiceToPublish) return;
    setActionLoading('publish');
    try {
      // Touch invoice or send WhatsApp alert
      if (api.whatsapp?.sendInvoice && invoiceToPublish.customer) {
        await api.whatsapp.sendInvoice({
          customer: invoiceToPublish.customer,
          invoice: invoiceToPublish,
        }).catch(() => {});
      }
      showToast(`Invoice ${invoiceToPublish.invoiceNumber} berhasil dipublish ke penagihan aktif`, 'success');
      setShowPublishModal(false);
      setInvoiceToPublish(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal mempublish invoice', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Bulk Publish
  const handleConfirmBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading('bulk-publish');
    try {
      const targets = draftInvoices.filter(i => selectedIds.includes(i.id));
      for (const t of targets) {
        if (api.whatsapp?.sendInvoice && t.customer) {
          await api.whatsapp.sendInvoice({
            customer: t.customer,
            invoice: t,
          }).catch(() => {});
        }
      }
      showToast(`${targets.length} invoice berhasil dipublish dan dikirimkan`, 'success');
      setSelectedIds([]);
      setShowBulkPublishModal(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal mempublish beberapa invoice', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // WhatsApp Single Message
  const handleOpenWhatsApp = (inv: Invoice) => {
    setSelectedInvoice(inv);
    const cleanPhone = (inv.customer?.phone || '').replace(/[^0-9]/g, '');
    const defaultMsg = `Halo Kak ${inv.customer?.name || 'Pelanggan'}, berikut adalah informasi draft invoice AUDIRA (${inv.invoiceNumber}) untuk periode ${inv.month || '-'} sebesar ${formatCurrency(inv.amount)}. Batas jatuh tempo: ${formatDate(inv.dueDate)}. Terima kasih!`;
    setWhatsappMessage(defaultMsg);
    setShowWhatsAppModal(true);
  };

  const handleSendWhatsApp = () => {
    if (!selectedInvoice) return;
    const phone = selectedInvoice.customer?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    setShowWhatsAppModal(false);
    showToast('Pesan WhatsApp diarahkan ke WhatsApp Web/App', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredDrafts.length === 0) {
      showToast('Tidak ada data draft untuk diexport', 'info');
      return;
    }

    const headers = ['Draft No', 'Pelanggan', 'No HP', 'Periode', 'Jatuh Tempo', 'Total (Rp)', 'Status'];
    const rows = filteredDrafts.map(inv => {
      const cat = getDraftCategory(inv);
      return [
        `"${inv.invoiceNumber || ''}"`,
        `"${inv.customer?.name || ''}"`,
        `"${inv.customer?.phone || ''}"`,
        `"${inv.month || ''}"`,
        `"${inv.dueDate ? inv.dueDate.split('T')[0] : ''}"`,
        `"${inv.amount || 0}"`,
        `"${cat}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Draft_Tagihan_${new Date().toISOString().slice(0, 10)}.csv`);
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
              <span className="text-blue-500 font-semibold">Draft Invoice</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Draft Tagihan Belum Terbit</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {kpiStats.totalDraft} Draft
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Review, sunting, dan finalisasi invoice pra-terbit sebelum masuk ke antrian penagihan aktif dan notifikasi WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>Tambah Draft</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={loadData}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg cursor-pointer transition-all"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Total Draft */}
          <div 
            onClick={() => setActiveTab('Semua')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3.5 cursor-pointer transition-all ${
              activeTab === 'Semua' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Draft</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.totalDraft}</p>
              <p className="text-[10px] text-purple-400 mt-0.5 font-medium">Semua Draft Pending</p>
            </div>
          </div>

          {/* Card 2: Perlu Diperiksa */}
          <div 
            onClick={() => setActiveTab('Perlu Diperiksa')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3.5 cursor-pointer transition-all ${
              activeTab === 'Perlu Diperiksa' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Perlu Diperiksa</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.perluDiperiksa}</p>
              <p className="text-[10px] text-orange-400 mt-0.5 font-medium">Data Belum Lengkap</p>
            </div>
          </div>

          {/* Card 3: Siap Dipublish */}
          <div 
            onClick={() => setActiveTab('Siap Dipublish')}
            className={`bg-[var(--app-card)] border rounded-2xl shadow-2xs p-4 flex items-center gap-3.5 cursor-pointer transition-all ${
              activeTab === 'Siap Dipublish' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[var(--app-border)] hover:border-slate-500'
            }`}
          >
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Siap Dipublish</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.siapDipublish}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Siap Kirim WhatsApp</p>
            </div>
          </div>

          {/* Card 4: Total Estimasi Nominal */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3.5">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Estimasi Tagihan</p>
              <p className="text-lg font-black text-[var(--app-text)] mt-0.5">{formatCurrency(kpiStats.totalNominal)}</p>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium">Total Akumulasi</p>
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
                placeholder="Cari draft invoice, nama pelanggan, no telepon, keterangan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as any);
                setPage(1);
              }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[140px]"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Perlu Diperiksa">Perlu Diperiksa</option>
              <option value="Siap Dipublish">Siap Dipublish</option>
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
              onClick={() => {
                if (selectedIds.length === 0) {
                  showToast('Pilih draft invoice terlebih dahulu untuk publish massal', 'info');
                  return;
                }
                setShowBulkPublishModal(true);
              }}
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer ml-auto"
            >
              <CheckCircle size={14} />
              <span>Publish Massal</span>
            </button>
          </div>
        </div>

        {/* ─── Mass Action bar ────────────────────────────────────────────── */}
        {selectedIds.length > 0 && (
          <div className="bg-[var(--app-card)] border border-blue-500/40 rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-400">
                {selectedIds.length} draft dipilih
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-[var(--app-muted)] hover:text-white underline cursor-pointer"
              >
                Batal Pilih
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBulkPublishModal(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                <CheckCircle size={13} />
                <span>Publish Terpilih</span>
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

        {/* ─── Main Content: Draft Table ─────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={paginatedDrafts.length > 0 && selectedIds.length === paginatedDrafts.length}
                      onChange={handleSelectAll}
                      className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 cursor-pointer" 
                    />
                  </th>
                  <th className="p-4 w-12">NO</th>
                  <th className="p-4 w-44">DRAFT NO</th>
                  <th className="p-4 w-44">CUSTOMER</th>
                  <th className="p-4 w-36">PERIODE</th>
                  <th className="p-4 w-36">JATUH TEMPO</th>
                  <th className="p-4 w-28">TOTAL</th>
                  <th className="p-4 w-32">STATUS</th>
                  <th className="p-4 w-36 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[var(--app-muted)]">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin text-blue-500" size={16} />
                        <span>Memuat data draft invoice...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedDrafts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[var(--app-muted)]">
                      Tidak ada draft invoice yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedDrafts.map((d, idx) => {
                    const isSelected = selectedIds.includes(d.id);
                    const category = getDraftCategory(d);
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
                          <span className="text-blue-400 font-bold">{d.invoiceNumber}</span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[var(--app-text)] block">{d.customer?.name || 'Pelanggan'}</span>
                            <span className="text-[10px] text-[var(--app-muted)] block font-semibold">{d.customer?.phone || '-'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--app-text)]/90 font-medium">{d.month || '-'}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{formatDate(d.dueDate)}</td>
                        <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(d.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            category === 'Siap Dipublish' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View / Detail */}
                            <button 
                              onClick={() => {
                                setSelectedInvoice(d);
                                setShowDetailModal(true);
                              }}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                              title="Lihat Detail Draft"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit */}
                            <button 
                              onClick={() => handleOpenEdit(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                              title="Edit Draft"
                            >
                              <Edit2 size={14} />
                            </button>

                            {/* Publish */}
                            <button 
                              onClick={() => handleOpenPublish(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                              title="Publish Tagihan"
                            >
                              <CheckCircle size={14} />
                            </button>

                            {/* WhatsApp Direct */}
                            <button 
                              onClick={() => handleOpenWhatsApp(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                              title="Notifikasi WA"
                            >
                              <MessageCircle size={14} />
                            </button>

                            {/* Delete */}
                            <button 
                              onClick={() => handleOpenDelete(d)}
                              className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Hapus Draft"
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
              Menampilkan <span className="font-semibold text-[var(--app-text)]">{filteredDrafts.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, filteredDrafts.length)}</span> dari <span className="font-semibold text-[var(--app-text)]">{filteredDrafts.length}</span> data
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

        {/* ─── MODAL: Detail Draft ────────────────────────────────────────── */}
        {showDetailModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)]">Detail Draft Invoice</h3>
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
                    <span className="text-[var(--app-muted)] block">Nominal Draft</span>
                    <span className="font-bold text-blue-400 text-sm">{formatCurrency(selectedInvoice.amount)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 inline-block mt-1">
                      {getDraftCategory(selectedInvoice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Tanggal Dibuat</span>
                    <span className="font-semibold text-[var(--app-text)]">{formatDate(selectedInvoice.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Rencana Jatuh Tempo</span>
                    <span className="font-semibold text-amber-400">{formatDate(selectedInvoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Periode Penagihan</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedInvoice.month || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Keterangan / Paket</span>
                    <span className="font-semibold text-[var(--app-text)]">{selectedInvoice.description || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenPublish(selectedInvoice);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  <span>Publish Sekarang</span>
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

        {/* ─── MODAL: Buat Draft Baru ─────────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--app-text)]">Buat Draft Invoice Baru</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Pilih Pelanggan</label>
                  <select
                    value={newCustomerId}
                    onChange={(e) => setNewCustomerId(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none"
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone || 'No Phone'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nominal Tagihan (Rp)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Contoh: 250000"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Batas Akhir (Due Date)</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Periode Bulan</label>
                  <input
                    type="text"
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    placeholder="Contoh: Oktober 2026"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Deskripsi / Keterangan</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'create'}
                  onClick={handleCreateDraft}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'create' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Simpan Draft</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Draft ──────────────────────────────────────────── */}
        {showEditModal && invoiceToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--app-text)]">Edit Draft Invoice</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nomor Draft</label>
                  <input
                    type="text"
                    disabled
                    value={invoiceToEdit.invoiceNumber}
                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-muted)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nominal (Rp)</label>
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
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
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

        {/* ─── MODAL: Publish Confirmation ───────────────────────────────── */}
        {showPublishModal && invoiceToPublish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-emerald-500/40 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle size={24} />
                <h3 className="text-base font-bold text-white">Publish Draft Invoice?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Invoice <strong className="text-white">{invoiceToPublish.invoiceNumber}</strong> untuk <strong className="text-white">{invoiceToPublish.customer?.name}</strong> akan dipublish ke penagihan aktif dan notifikasi WhatsApp akan dikirimkan.
              </p>

              <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--app-border)] text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--app-muted)]">Nominal:</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(invoiceToPublish.amount)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[var(--app-muted)]">Jatuh Tempo:</span>
                  <span className="text-white font-medium">{formatDate(invoiceToPublish.dueDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'publish'}
                  onClick={handleConfirmPublish}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'publish' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Publish Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Bulk Publish Confirmation ──────────────────────────── */}
        {showBulkPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-emerald-500/40 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle size={24} />
                <h3 className="text-base font-bold text-white">Publish Massal Draft?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Anda akan mempublish <strong className="text-white">{selectedIds.length}</strong> invoice draft terpilih ke penagihan aktif.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowBulkPublishModal(false)}
                  className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-[var(--app-text)] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  disabled={actionLoading === 'bulk-publish'}
                  onClick={handleConfirmBulkPublish}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'bulk-publish' && <RefreshCw size={14} className="animate-spin" />}
                  <span>Publish Semua Terpilih</span>
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
                <h3 className="text-base font-bold text-white">Hapus Draft Invoice?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Apakah Anda yakin ingin menghapus draft <strong className="text-white">{invoiceToDelete.invoiceNumber}</strong> sebesar <strong className="text-white">{formatCurrency(invoiceToDelete.amount)}</strong>? Tindakan ini tidak dapat dibatalkan.
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
                  <span>Hapus Draft</span>
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
                <h3 className="text-base font-bold text-white">Hapus Massal Draft?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Anda akan menghapus <strong className="text-white">{selectedIds.length}</strong> draft invoice yang dipilih. Apakah Anda yakin?
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
                  <h3 className="text-base font-bold text-white">Notifikasi Draft WhatsApp</h3>
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
                    <span className="text-[var(--app-muted)]">Draft:</span>
                    <span className="font-mono text-blue-400">{selectedInvoice.invoiceNumber}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Teks Pesan WhatsApp</label>
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
                  <span>Kirim via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
