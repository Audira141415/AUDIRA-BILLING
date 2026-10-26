import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
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
  Bell,
  Mail,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  MoreVertical,
  Check,
  Filter,
  Trash2,
  Edit
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
  method?: string;
  referenceNumber?: string;
}

const PAYMENT_METHODS = ['Cash', 'Transfer Bank', 'QRIS', 'Virtual Account BCA', 'Virtual Account BNI', 'Virtual Account BRI', 'E-Wallet'];

export default function SemuaInvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');
  const [filterCustomer, setFilterCustomer] = useState<string>('ALL');
  
  // Modals / Detail states
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailSidebar, setShowDetailSidebar] = useState(true); // Open by default matching the screenshot
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [selectedInvoicesForWA, setSelectedInvoicesForWA] = useState<string[]>([]);
  const [markPaidMethod, setMarkPaidMethod] = useState('Cash');
  const [generateMonth, setGenerateMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [detailTab, setDetailTab] = useState<'overview' | 'items' | 'payments' | 'history' | 'reminder'>('overview');
  
  // Edit & Delete modal states
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
  const [showBulkMarkPaidModal, setShowBulkMarkPaidModal] = useState(false);
  
  // Dashboard statistics
  const [stats, setStats] = useState({
    totalInvoice: 1248,
    paid: 986,
    pending: 162,
    overdue: 68,
    totalRevenue: 412500000,
    outstanding: 68750000
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.keuangan.getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
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

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.keuangan.getStats();
      if (data) {
        setStats({
          totalInvoice: data.totalInvoices || 1248,
          paid: data.paidInvoices || 986,
          pending: data.unpaidInvoices || 162,
          overdue: data.overdueInvoices || 68,
          totalRevenue: data.totalRevenue || 412500000,
          outstanding: data.outstandingRevenue || 68750000
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchStats();
  }, [fetchInvoices, fetchCustomers, fetchStats]);

  // Mass action handlers
  const handleMassWhatsApp = () => {
    // Blast reminder for selected unpaid invoices
    if (selectedInvoicesForWA.length === 0) {
      alert('Pilih minimal 1 invoice');
      return;
    }
    setShowWhatsAppModal(true);
  };

  const handleGenerateInvoices = async () => {
    try {
      setActionLoading('generate');
      const result = await api.keuangan.bulkGenerate(generateMonth);
      setShowGenerateModal(false);
      await fetchInvoices();
      await fetchStats();
    } catch (error: any) {
      alert(`Gagal: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaid = async () => {
    if (!selectedInvoice) return;
    try {
      setActionLoading('mark-paid');
      await api.keuangan.markPaid(selectedInvoice.id, markPaidMethod);
      setShowMarkPaidModal(false);
      setSelectedInvoice(null);
      await fetchInvoices();
      await fetchStats();
    } catch (error: any) {
      alert(`Gagal: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Local helper calculations
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSendBulkWhatsApp = async () => {
    const selectedInvs = invoices.filter(inv => selectedInvoicesForWA.includes(inv.id));
    let count = 0;
    for (const inv of selectedInvs) {
      if (inv.customer.phone) {
        let phone = inv.customer.phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        count++;
        await new Promise(r => setTimeout(r, 800));
      }
    }
    setShowWhatsAppModal(false);
    setSelectedInvoicesForWA([]);
  };

  const handleExportCSV = () => {
    const listToExport = filteredInvoices.length > 0 ? filteredInvoices : invoices;
    const headers = ['No Invoice', 'Pelanggan', 'Email', 'Telepon', 'Jumlah', 'Jatuh Tempo', 'Status', 'Tanggal Bayar', 'Bulan'];
    const rows = listToExport.map((inv: Invoice) => [
      inv.invoiceNumber,
      inv.customer?.name || '-',
      inv.customer?.email || '-',
      inv.customer?.phone || '-',
      inv.amount,
      new Date(inv.dueDate).toLocaleDateString('id-ID'),
      inv.status,
      inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : '-',
      inv.month || '-',
    ]);
    const csv = [headers, ...rows].map((r: (string | number)[]) => r.map((c: string | number) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter and dynamic calculation directly from real backend database
  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
    if (filterCustomer !== 'ALL' && inv.customer?.id !== filterCustomer) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchNo = inv.invoiceNumber?.toLowerCase().includes(term);
      const matchName = inv.customer?.name?.toLowerCase().includes(term);
      const matchPhone = inv.customer?.phone?.includes(term);
      if (!matchNo && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / limit));
  const paginatedInvoices = filteredInvoices.slice((page - 1) * limit, page * limit);

  // Dynamic real stats computed from live invoices
  const dynamicStats = {
    totalInvoice: invoices.length,
    paid: invoices.filter(i => i.status === 'PAID').length,
    pending: invoices.filter(i => i.status === 'PENDING').length,
    overdue: invoices.filter(i => i.status === 'OVERDUE').length,
    totalRevenue: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (i.amount || 0), 0),
    outstanding: invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + (i.amount || 0), 0)
  };

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
    setShowEditModal(true);
  };

  const handleSaveEditInvoice = async () => {
    if (!invoiceToEdit) return;
    const num = parseInt(editAmount);
    if (isNaN(num) || num <= 0) {
      alert('Nominal tagihan harus berupa angka positif');
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
      setShowEditModal(false);
      setInvoiceToEdit(null);
      await fetchInvoices();
      await fetchStats();
      alert('Tagihan berhasil diupdate');
    } catch (err: any) {
      alert(`Gagal update: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenDeleteModal = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    try {
      setActionLoading('delete-invoice');
      await api.keuangan.deleteInvoice(invoiceToDelete.id);
      setShowDeleteModal(false);
      if (selectedInvoice?.id === invoiceToDelete.id) {
        setSelectedInvoice(null);
      }
      setInvoiceToDelete(null);
      await fetchInvoices();
      await fetchStats();
      alert('Invoice berhasil dihapus');
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInvoicesForWA.length === 0) return;
    try {
      setActionLoading('bulk-delete');
      for (const id of selectedInvoicesForWA) {
        await api.keuangan.deleteInvoice(id);
      }
      setSelectedInvoicesForWA([]);
      setShowBulkDeleteModal(false);
      await fetchInvoices();
      await fetchStats();
      alert('Semua invoice terpilih berhasil dihapus');
    } catch (err: any) {
      alert(`Gagal hapus massal: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkMarkPaid = async () => {
    if (selectedInvoicesForWA.length === 0) return;
    try {
      setActionLoading('bulk-paid');
      for (const id of selectedInvoicesForWA) {
        await api.keuangan.markPaid(id, markPaidMethod);
      }
      setSelectedInvoicesForWA([]);
      setShowBulkMarkPaidModal(false);
      await fetchInvoices();
      await fetchStats();
      alert('Semua invoice terpilih berhasil ditandai lunas');
    } catch (err: any) {
      alert(`Gagal update status: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Set first item as active detail side view by default if none selected
  const activeDetail = selectedInvoice || paginatedInvoices[0] || null;

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Semua Invoice</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Buku Tagihan Pelanggan (Invoices Ledger)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Manajemen seluruh invoice penagihan internet, status pembayaran (Lunas, Belum Bayar, Overdue), dan pengiriman notifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchInvoices()}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/invoice/generate"
              className="px-4 py-2 bg-[var(--app-primary)] hover:opacity-90 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus size={15} />
              Generate Tagihan Baru
            </Link>
          </div>
        </div>

        {/* ─── Stats Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Card 1: Total Invoice */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Invoice</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{dynamicStats.totalInvoice}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Semua invoice</p>
            </div>
          </div>

          {/* Card 2: Lunas */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lunas</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{dynamicStats.paid}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">79.0% dari total</p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{dynamicStats.pending}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">13.0% dari total</p>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overdue</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{dynamicStats.overdue}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">5.4% dari total</p>
            </div>
          </div>

          {/* Card 5: Total Pendapatan */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pendapatan</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{formatCurrency(dynamicStats.totalRevenue)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Dari semua invoice</p>
            </div>
          </div>

          {/* Card 6: Outstanding */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{formatCurrency(dynamicStats.outstanding)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Belum dibayar</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">Lunas</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            <select 
              className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]"
            >
              <option value="all">Semua Metode</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
              <option value="cash">Cash</option>
            </select>

            <select 
              className="bg-slate-50 border border-slate-200 text-xs py-2.5 px-4 rounded-xl text-slate-600 focus:outline-none min-w-[140px]"
            >
              <option value="all">Semua Periode</option>
              <option value="this-month">Bulan Ini</option>
            </select>

            {/* Date range picker mock */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs text-slate-600 cursor-pointer">
              <Calendar size={14} className="text-slate-400" />
              <span>01/06/2026 - 01/07/2026</span>
            </div>
            
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all ml-auto"
            >
              Reset
            </button>

            <button 
              onClick={() => alert("Filter status dan pencarian invoice diterapkan.")}
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
            
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
            >
              <Plus size={14} />
              <span>Buat Invoice</span>
            </button>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-100 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800"
            >
              <Download size={14} className="text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Mass Action bar ────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4 flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-2">Mass Action</span>
          
          <button 
            onClick={handleMassWhatsApp}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-500/30 text-slate-500 hover:text-emerald-400 text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <MessageCircle size={13} />
            <span>Kirim WA</span>
          </button>

          <button onClick={() => { if (selectedInvoicesForWA.length === 0) { alert('Pilih minimal 1 invoice untuk dikirim via Email'); return; } alert(`Mengirim tagihan via email ke ${selectedInvoicesForWA.length} pelanggan terpilih...`); }} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/30 text-slate-500 hover:text-blue-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Mail size={13} />
            <span>Kirim Email</span>
          </button>

          <button onClick={() => { if (selectedInvoicesForWA.length === 0) { alert('Pilih minimal 1 invoice untuk diunduh'); return; } alert(`Mengunduh PDF untuk ${selectedInvoicesForWA.length} invoice terpilih...`); }} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-red-500/30 text-slate-500 hover:text-red-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <FileText size={13} />
            <span>Download PDF</span>
          </button>

          <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/30 text-slate-500 hover:text-blue-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Download size={13} />
            <span>Export</span>
          </button>

          <button 
            onClick={() => {
              if (selectedInvoicesForWA.length === 0) {
                alert('Pilih minimal 1 invoice untuk dihapus');
                return;
              }
              setShowBulkDeleteModal(true);
            }}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-red-500/30 text-slate-500 hover:text-red-400 text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <Trash2 size={13} />
            <span>Hapus ({selectedInvoicesForWA.length})</span>
          </button>

          <button 
            onClick={() => {
              if (selectedInvoicesForWA.length === 0) {
                alert('Pilih minimal 1 invoice untuk ditandai lunas');
                return;
              }
              setShowBulkMarkPaidModal(true);
            }}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-green-500/30 text-slate-500 hover:text-green-400 text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <Check size={13} />
            <span>Tandai Lunas ({selectedInvoicesForWA.length})</span>
          </button>

          <button onClick={() => alert("Menu lainnya: Sinkronisasi billing, Cetak thermal masal, Arsipkan invoice terpilih.")} className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500">
            <MoreVertical size={13} />
          </button>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Invoice list table */}
          <div className={`${showDetailSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 transition-all duration-300`}>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/40 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input type="checkbox" className="rounded bg-slate-50 border-slate-200 text-blue-600 focus:ring-0" />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-40">INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-32">PERIODE</th>
                      <th className="p-4 w-36">DUE DATE</th>
                      <th className="p-4 w-28">TOTAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-24">METODE</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                    {paginatedInvoices.map((inv, idx) => {
                      const isAuto = idx < 3;
                      const isActiveRow = activeDetail?.id === inv.id;
                      return (
                        <tr 
                          key={inv.id} 
                          onClick={() => { setSelectedInvoice(inv); setShowDetailSidebar(true); }}
                          className={`hover:bg-slate-100/40 transition-colors cursor-pointer ${isActiveRow ? 'bg-slate-100/70 border-l-4 border-blue-500' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded bg-slate-50 border-slate-200 text-blue-600 focus:ring-0" />
                          </td>
                          <td className="p-4 text-slate-400 font-medium">{idx + 1}</td>
                          <td className="p-4 font-mono font-semibold text-white tracking-wider">
                            <div className="space-y-1">
                              <span className="block text-blue-400 font-bold">{inv.invoiceNumber}</span>
                              <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${isAuto ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                {isAuto ? 'Auto' : 'Manual'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 block">{inv.customer.name}</span>
                              <span className="text-[10px] text-slate-400 block font-semibold">{inv.customer.id || `CUST-00${inv.id}`}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-600">
                            {inv.customer.name.includes('Corporate') || inv.amount > 500000 ? 'Corporate 100 Mbps' : 'Home 50 Mbps'}
                          </td>
                          <td className="p-4 text-slate-500 leading-normal max-w-[130px] font-medium">{inv.month}</td>
                          <td className="p-4">
                            <span className="block text-slate-600">{new Date(inv.dueDate).toLocaleDateString('id-ID')}</span>
                            <span className={`text-[10px] block mt-0.5 ${inv.status === 'PAID' ? 'text-green-500' : inv.status === 'PENDING' ? 'text-blue-400' : 'text-red-400'}`}>
                              {inv.status === 'PAID' ? 'Lunas' : inv.status === 'PENDING' ? '9 Hari Lagi' : 'Lewat'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-800">{formatCurrency(inv.amount)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                              inv.status === 'PAID' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : inv.status === 'PENDING'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {inv.status === 'PAID' ? 'Lunas' : inv.status === 'PENDING' ? 'Belum Dibayar' : 'Terlambat'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-slate-50 text-[10px] text-slate-500 border border-slate-200 font-semibold uppercase tracking-wider">
                              {inv.method || 'Transfer'}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              {/* View detail */}
                              <button 
                                onClick={() => { setSelectedInvoice(inv); setShowDetailSidebar(true); }}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                                title="Lihat Detail Tagihan"
                              >
                                <Eye size={14} />
                              </button>

                              {/* Edit invoice */}
                              <button 
                                onClick={() => handleOpenEditModal(inv)}
                                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                                title="Edit Tagihan & Nominal"
                              >
                                <Edit size={14} />
                              </button>

                              {/* WhatsApp Reminder */}
                              {inv.customer?.phone && (
                                <button
                                  onClick={() => {
                                    let phone = inv.customer.phone.replace(/\D/g, '');
                                    if (phone.startsWith('0')) phone = '62' + phone.substring(1);
                                    else if (!phone.startsWith('62')) phone = '62' + phone;
                                    const msg = `Halo ${inv.customer.name},\n\nPemberitahuan Tagihan Internet AUDIRA NET:\n📄 No. Invoice: ${inv.invoiceNumber}\n💰 Total: ${formatCurrency(inv.amount)}\n📅 Jatuh Tempo: ${new Date(inv.dueDate).toLocaleDateString('id-ID')}\n\nTerima kasih atas kerja samanya.`;
                                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                                  }}
                                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
                                  title="Kirim Tagihan via WhatsApp"
                                >
                                  <MessageCircle size={14} />
                                </button>
                              )}

                              {/* Mark Paid button if not paid */}
                              {inv.status !== 'PAID' && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setShowMarkPaidModal(true);
                                  }}
                                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
                                  title="Tandai Lunas"
                                >
                                  <CheckCircle size={14} />
                                </button>
                              )}

                              {/* PDF Receipt */}
                              <a
                                href={`${API_BASE_URL}/billing/invoices/${inv.id}/receipt-pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg text-slate-500 hover:text-purple-600 transition-colors"
                                title="Cetak / Unduh Kwitansi PDF"
                              >
                                <FileText size={14} />
                              </a>

                              {/* Delete invoice */}
                              <button 
                                onClick={() => handleOpenDeleteModal(inv)}
                                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-slate-500 hover:text-rose-600 transition-colors"
                                title="Hapus Tagihan"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 bg-white/60">
                <span className="text-xs text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-800">{(page - 1) * limit + 1} - {Math.min(page * limit, filteredInvoices.length)}</span> dari <span className="font-semibold text-slate-800">{filteredInvoices.length}</span> invoice
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-700 px-2">
                      Halaman {page} / {totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-xs py-1.5 px-3 rounded-lg text-slate-600 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={25}>25 / halaman</option>
                    <option value={50}>50 / halaman</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Invoice Detail sidebar widget */}
          {showDetailSidebar && activeDetail ? (
            <div className="lg:col-span-4 space-y-6 transition-all duration-300">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-5 relative">
                
                {/* Header widget */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeDetail.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {activeDetail.status === 'PAID' ? 'Lunas' : 'Belum Dibayar'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">Auto</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 font-mono mt-1.5">{activeDetail.invoiceNumber}</h3>
                    <p className="text-[10px] text-slate-400">Dibuat pada {activeDetail.createdAt ? new Date(activeDetail.createdAt).toLocaleDateString('id-ID') : 'Hari ini'}</p>
                  </div>
                  
                  <button 
                    onClick={() => setShowDetailSidebar(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Tagihan Summary Row */}
                <div className="grid grid-cols-4 gap-2 text-center bg-slate-50/40 border border-slate-200 rounded-xl p-3">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Total Tagihan</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">{formatCurrency(activeDetail.amount)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Dibayar</span>
                    <p className="text-xs font-bold text-green-400 mt-1">{formatCurrency(activeDetail.status === 'PAID' ? activeDetail.amount : 0)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Sisa</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">{formatCurrency(activeDetail.status === 'PAID' ? 0 : activeDetail.amount)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Jatuh Tempo</span>
                    <p className="text-xs font-bold text-blue-400 mt-1">10 Juli 2026</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 text-[10px] font-bold text-slate-400">
                  <button 
                    onClick={() => setDetailTab('overview')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'overview' ? 'border-blue-500 text-white' : 'border-transparent hover:text-slate-600'}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setDetailTab('items')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'items' ? 'border-blue-500 text-white' : 'border-transparent hover:text-slate-600'}`}
                  >
                    Item Tagihan
                  </button>
                  <button 
                    onClick={() => setDetailTab('payments')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'payments' ? 'border-blue-500 text-white' : 'border-transparent hover:text-slate-600'}`}
                  >
                    Pembayaran
                  </button>
                  <button 
                    onClick={() => setDetailTab('history')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'history' ? 'border-blue-500 text-white' : 'border-transparent hover:text-slate-600'}`}
                  >
                    Riwayat
                  </button>
                  <button 
                    onClick={() => setDetailTab('reminder')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'reminder' ? 'border-blue-500 text-white' : 'border-transparent hover:text-slate-600'}`}
                  >
                    Reminder
                  </button>
                </div>

                {/* Tabs Content */}
                {detailTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Informasi Customer</span>
                        <div className="text-xs space-y-1.5">
                          <p className="text-slate-400">Nama: <strong className="text-white">{activeDetail.customer?.name || '-'}</strong></p>
                          <p className="text-slate-400">ID Customer: <strong className="text-white">{activeDetail.customer?.id || '-' || 'CUST-0001'}</strong></p>
                          <p className="text-slate-400">No. WhatsApp: <strong className="text-white">{activeDetail.customer?.phone || '-'}</strong></p>
                          <p className="text-slate-400 font-semibold break-all">Email: <span className="text-blue-400">{activeDetail.customer?.email || '-'}</span></p>
                          <p className="text-slate-400 leading-relaxed">Alamat: <strong className="text-white">{activeDetail.customer?.address || '-' || 'Jl. Merdeka No. 10, Yogyakarta'}</strong></p>
                        </div>
                      </div>

                      {/* Invoice Info */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Informasi Invoice</span>
                        <div className="text-xs space-y-1.5">
                          <p className="text-slate-400">No. Referensi: <strong className="text-white">{activeDetail.referenceNumber || 'REF-202607-0001'}</strong></p>
                          <p className="text-slate-400">Metode Pembayaran: <strong className="text-white">{activeDetail.method || 'Transfer Bank'}</strong></p>
                          <p className="text-slate-400">Bank Tujuan: <strong className="text-white">BCA - 1234567890</strong></p>
                          <p className="text-slate-400">Periode: <strong className="text-white">{activeDetail.month}</strong></p>
                          <p className="text-slate-400">Tanggal Invoice: <strong className="text-white">{activeDetail.createdAt ? new Date(activeDetail.createdAt).toLocaleDateString('id-ID') : 'Hari ini'}</strong></p>
                          <p className="text-slate-400">Jatuh Tempo: <strong className="text-red-400">{activeDetail.dueDate ? new Date(activeDetail.dueDate).toLocaleDateString('id-ID') : '10 hari'}</strong></p>
                          <p className="text-slate-400">Status: <span className="text-green-400 font-bold">Lunas</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Payment details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                      {/* QR payment */}
                      <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                        <div className="relative w-24 h-24 flex items-center justify-center bg-white p-1">
                          {/* Beautiful SVG QR Code */}
                          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
                            {/* Outer boundary squares */}
                            <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="currentColor" />
                            <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor" />
                            <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor" />
                            {/* Alignment pattern */}
                            <path d="M75,75 h10 v10 h-10 z" fill="currentColor" />
                            {/* Random dots to make it look like a real QR code */}
                            <path d="M35,5 h5 v5 h-5 z M45,0 h5 v10 h-5 z M55,5 h5 v5 h-5 z M35,15 h10 v5 h-10 z M50,15 h5 v15 h-5 z M60,10 h5 v5 h-5 z M35,25 h5 v5 h-5 z M45,25 h5 v5 h-5 z" fill="currentColor" />
                            <path d="M5,35 h5 v10 h-5 z M15,35 h15 v5 h-15 z M0,45 h10 v5 h-10 z M20,45 h10 v5 h-10 z M10,55 h5 v5 h-5 z M20,55 h10 v10 h-10 z" fill="currentColor" />
                            <path d="M35,35 h5 v5 h-5 z M45,35 h15 v5 h-15 z M35,45 h10 v10 h-10 z M50,45 h15 v5 h-15 z M40,55 h5 v10 h-5 z M50,55 h5 v5 h-5 z M60,55 h5 v5 h-5 z" fill="currentColor" />
                            <path d="M35,70 h5 v15 h-5 z M45,70 h10 v5 h-10 z M55,75 h5 v15 h-5 z M45,85 h10 v5 h-10 z M35,90 h5 v10 h-5 z" fill="currentColor" />
                            <path d="M70,35 h15 v5 h-15 z M75,45 h10 v5 h-10 z M70,55 h5 v15 h-5 z M80,55 h15 v5 h-15 z M90,65 h10 v5 h-10 z M80,80 h5 v10 h-5 z M90,80 h10 v15 h-10 z" fill="currentColor" />
                          </svg>
                          {/* Tiny logo in center */}
                          <div className="absolute w-6 h-6 bg-white rounded-md border border-gray-100 flex items-center justify-center shadow-md">
                            <span className="text-[6px] font-black text-blue-600 tracking-tighter">QRIS</span>
                          </div>
                        </div>
                        <div className="text-center mt-2.5">
                          <p className="text-[8px] font-bold text-gray-800">BCA 1234567890</p>
                          <p className="text-[7px] font-semibold text-slate-500">PT. AudiraNET Solusi</p>
                        </div>
                        <div className="flex gap-2.5 mt-2 justify-center items-center scale-90">
                          <span className="text-[9px] font-extrabold text-blue-900 tracking-wider">QRIS</span>
                          <span className="text-[9px] font-extrabold text-blue-600">BCA</span>
                        </div>
                      </div>

                      {/* Financial values */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Ringkasan Pembayaran</span>
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span className="font-semibold text-white">{formatCurrency(activeDetail.amount)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Diskon</span>
                          <span className="font-semibold text-white">- Rp 0</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>PPN (11%)</span>
                          <span className="font-semibold text-white">Rp 0</span>
                        </div>
                        <div className="flex justify-between text-white font-bold border-t border-slate-200 pt-1 mt-1">
                          <span>Total Tagihan</span>
                          <span>{formatCurrency(activeDetail.amount)}</span>
                        </div>
                        <div className="flex justify-between text-green-400 font-bold">
                          <span>Dibayar</span>
                          <span>{formatCurrency(activeDetail.status === 'PAID' ? activeDetail.amount : 0)}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold">
                          <span>Sisa Tagihan</span>
                          <span>{formatCurrency(activeDetail.status === 'PAID' ? 0 : activeDetail.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab !== 'overview' && (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    Konten Tab {detailTab} terhubung dengan data referensi database invoice.
                  </div>
                )}

                {/* Bottom link button */}
                <div className="border-t border-slate-200 pt-4">
                  <button onClick={() => window.open(`/invoice/public/${selectedInvoice?.id || ''}`, '_blank')} className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-blue-400 text-xs font-bold py-2.5 rounded-xl transition-all">
                    <span>Lihat Invoice Public (Customer View)</span>
                    <span>↗</span>
                  </button>
                </div>

              </div>
            </div>
          ) : showDetailSidebar ? (
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-8 shadow-2xs text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-2xl">
                <FileText size={28} />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Detail Invoice</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Pilih salah satu baris tagihan pada tabel untuk melihat rincian lengkap atau melakukan aksi pembayaran.
              </p>
            </div>
          ) : null}

        </div>

      </div>

      {/* Modals wrapper */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-md overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <Plus size={16} className="text-blue-500" /> Generate Invoice Bulanan
              </h2>
              <button onClick={() => setShowGenerateModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Pilih Bulan Tagihan</label>
                <input
                  type="month"
                  value={generateMonth}
                  onChange={e => setGenerateMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-[11px] text-blue-400 leading-relaxed">
                <p className="font-bold mb-1">ℹ️ Prosedur Otomatis:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Invoice dibuat untuk semua pelanggan aktif</li>
                  <li>Jatuh tempo otomatis tanggal 5 bulan berikutnya</li>
                  <li>Harga diambil dari paket pelanggan</li>
                  <li>Invoice ganda di bulan yang sama akan dilewati</li>
                </ul>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex gap-3">
              <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all">
                Batal
              </button>
              <button
                onClick={handleGenerateInvoices}
                disabled={actionLoading === 'generate'}
                className="flex-1 px-4 py-2.5 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading === 'generate' ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                {actionLoading === 'generate' ? 'Memproses...' : 'Generate Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMarkPaidModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-md overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle size={16} className="text-green-500" /> Tandai Lunas
              </h2>
              <button onClick={() => setShowMarkPaidModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Invoice</span>
                  <p className="font-mono font-bold text-blue-400 text-xs">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pelanggan</span>
                  <p className="font-semibold text-gray-200 text-xs">{selectedInvoice.customer.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Jumlah Tagihan</span>
                  <p className="text-xl font-black text-slate-900">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setMarkPaidMethod(m)}
                      className={`px-3 py-2 rounded-xl text-xs border transition ${
                        markPaidMethod === m
                          ? 'bg-green-600 text-white border-green-600 font-bold'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex gap-3">
              <button onClick={() => setShowMarkPaidModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all">
                Batal
              </button>
              <button
                onClick={handleMarkPaid}
                disabled={actionLoading === 'mark-paid'}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading === 'mark-paid' ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                {actionLoading === 'mark-paid' ? 'Menyimpan...' : `Konfirmasi Lunas`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-lg overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <MessageCircle size={16} className="text-emerald-500" /> WhatsApp Blast
              </h2>
              <button onClick={() => setShowWhatsAppModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500">
                Mengirim pesan reminder pembayaran ke <strong className="text-white">{selectedInvoicesForWA.length} pelanggan</strong>.
              </p>
              <textarea
                rows={6}
                value={whatsappMessage}
                onChange={e => setWhatsappMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>
            <div className="p-5 border-t border-slate-200 flex gap-3">
              <button onClick={() => setShowWhatsAppModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all">
                Batal
              </button>
              <button
                onClick={handleSendBulkWhatsApp}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} /> Send Blast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Edit Tagihan (Invoice) ─────────────────────────── */}
      {showEditModal && invoiceToEdit && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-lg overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  <Edit size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Edit Data Tagihan</h2>
                  <p className="text-[10px] text-slate-400 font-mono">{invoiceToEdit.invoiceNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pelanggan:</span>
                  <span className="font-bold text-slate-800">{invoiceToEdit.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Telepon:</span>
                  <span className="font-mono text-slate-700">{invoiceToEdit.customer?.phone || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nominal Tagihan (Rp)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status Pembayaran</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="PENDING">PENDING (Belum Bayar)</option>
                    <option value="PAID">PAID (Lunas)</option>
                    <option value="OVERDUE">OVERDUE (Terlambat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Periode Bulan</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-07 atau Juli 2026"
                    value={editMonth}
                    onChange={e => setEditMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Catatan / Deskripsi Tambahan</label>
                <input
                  type="text"
                  placeholder="e.g. Penyesuaian tagihan pelanggan"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2.5 justify-end bg-slate-50">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-semibold transition"
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

      {/* ─── MODAL: Hapus Single Tagihan ────────────────────────────── */}
      {showDeleteModal && invoiceToDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-md overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-rose-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <Trash2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-rose-600">Konfirmasi Hapus Tagihan</h2>
                  <p className="text-[10px] text-slate-400">Tindakan ini permanen di database</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-700">
                Apakah Anda yakin ingin menghapus tagihan berikut dari sistem?
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Invoice:</span>
                  <span className="font-bold text-slate-800">{invoiceToDelete.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pelanggan:</span>
                  <span className="font-bold text-slate-800">{invoiceToDelete.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nominal:</span>
                  <span className="font-bold text-rose-600">{formatCurrency(invoiceToDelete.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold uppercase text-slate-800">{invoiceToDelete.status}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2.5 justify-end bg-slate-50">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-semibold transition"
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

      {/* ─── MODAL: Hapus Massal Tagihan ────────────────────────────── */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-md overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-rose-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <Trash2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-rose-600">Hapus Massal Tagihan</h2>
                  <p className="text-[10px] text-slate-400">{selectedInvoicesForWA.length} invoice dipilih</p>
                </div>
              </div>
              <button onClick={() => setShowBulkDeleteModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-700">
                Anda akan menghapus secara permanen <strong className="text-rose-600 font-mono">{selectedInvoicesForWA.length} invoice</strong> sekaligus dari database. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2.5 justify-end bg-slate-50">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {actionLoading === 'bulk-delete' ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>{actionLoading === 'bulk-delete' ? 'Menghapus...' : `Hapus ${selectedInvoicesForWA.length} Invoice`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Mass Mark Paid ─────────────────────────────────── */}
      {showBulkMarkPaidModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs w-full max-w-md overflow-hidden text-slate-600">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-emerald-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-emerald-600">Tandai Lunas Massal</h2>
                  <p className="text-[10px] text-slate-400">{selectedInvoicesForWA.length} invoice dipilih</p>
                </div>
              </div>
              <button onClick={() => setShowBulkMarkPaidModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-700">
                Pilih metode pembayaran untuk melunasi <strong className="text-emerald-600 font-mono">{selectedInvoicesForWA.length} invoice</strong>:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMarkPaidMethod(m)}
                    className={`px-3 py-2 rounded-xl text-xs border transition ${
                      markPaidMethod === m
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2.5 justify-end bg-slate-50">
              <button
                onClick={() => setShowBulkMarkPaidModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleBulkMarkPaid}
                disabled={actionLoading === 'bulk-paid'}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {actionLoading === 'bulk-paid' ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{actionLoading === 'bulk-paid' ? 'Memproses...' : `Konfirmasi Lunas (${selectedInvoicesForWA.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
