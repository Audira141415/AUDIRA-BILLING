import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
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
  Bell,
  Mail,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  MoreVertical,
  Check,
  Filter
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

const PAYMENT_METHODS = ['Cash', 'Transfer Bank', 'QRIS', 'Virtual Account BCA', 'Virtual Account BNI', 'Virtual Account BRI', 'E-Wallet'];

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm`}>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose}><X size={16} /></button>
    </div>
  );
}

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');
  const [filterCustomer, setFilterCustomer] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [selectedInvoicesForWA, setSelectedInvoicesForWA] = useState<string[]>([]);
  const [markPaidMethod, setMarkPaidMethod] = useState('Cash');
  const [generateMonth, setGenerateMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [stats, setStats] = useState({ totalRevenue: 412500000, paidInvoices: 986, unpaidInvoices: 162, overdueInvoices: 68 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.keuangan.getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showToast('Gagal memuat data invoice', 'error');
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
          totalRevenue: data.totalRevenue || 412500000,
          paidInvoices: data.paidInvoices || 986,
          unpaidInvoices: data.unpaidInvoices || 162,
          overdueInvoices: data.overdueInvoices || 68
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

  // ── Generate Invoice Bulk ─────────────────────────────────────────────
  const handleGenerateInvoices = async () => {
    try {
      setActionLoading('generate');
      const result = await api.keuangan.bulkGenerate(generateMonth);
      showToast(`✅ ${result.message}`, 'success');
      setShowGenerateModal(false);
      await fetchInvoices();
      await fetchStats();
    } catch (error: any) {
      showToast(`❌ Gagal generate: ${error.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Mark Invoice Paid ─────────────────────────────────────────────────
  const handleMarkPaid = async () => {
    if (!selectedInvoice) return;
    try {
      setActionLoading('mark-paid');
      await api.keuangan.markPaid(selectedInvoice.id, markPaidMethod);
      showToast(`✅ Invoice ${selectedInvoice.invoiceNumber} ditandai LUNAS`, 'success');
      setShowMarkPaidModal(false);
      setSelectedInvoice(null);
      await fetchInvoices();
      await fetchStats();
    } catch (error: any) {
      showToast(`❌ Gagal: ${error.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Send Email Reminder ───────────────────────────────────────────────
  const handleSendReminder = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    try {
      setActionLoading(`remind-${invoiceId}`);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/billing/send-reminders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, customerEmail: invoice.customer.email }),
      });
      if (response.ok) {
        showToast(`✅ Reminder dikirim ke ${invoice.customer.email}`, 'success');
      } else {
        showToast('⚠️ Email reminder gagal dikirim', 'error');
      }
    } catch (error) {
      showToast('❌ Gagal kirim reminder', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── WhatsApp ──────────────────────────────────────────────────────────
  const handleOpenWhatsApp = (phone: string, invoiceNumber: string, amount: number, dueDate: string) => {
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.substring(1);
    else if (!formattedPhone.startsWith('62')) formattedPhone = '62' + formattedPhone;

    const msg = `Halo, kami mengingatkan tagihan internet Anda:\n\n📄 Invoice: ${invoiceNumber}\n💰 Jumlah: Rp ${amount.toLocaleString('id-ID')}\n📅 Jatuh Tempo: ${new Date(dueDate).toLocaleDateString('id-ID')}\n\nMohon segera lakukan pembayaran. Terima kasih.\n\n– AudiraNET`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBulkWhatsApp = () => {
    if (selectedInvoicesForWA.length === 0) {
      showToast('Pilih minimal 1 invoice', 'info');
      return;
    }
    const lines = selectedInvoicesForWA.map(id => {
      const inv = invoices.find(i => i.id === id);
      if (!inv) return '';
      return `📄 ${inv.invoiceNumber} — Rp ${inv.amount.toLocaleString('id-ID')} (Jatuh: ${new Date(inv.dueDate).toLocaleDateString('id-ID')})`;
    }).filter(Boolean).join('\n');
    setWhatsappMessage(`Halo, berikut tagihan internet Anda yang perlu dibayar:\n\n${lines}\n\nMohon segera lakukan pembayaran.\n\n– AudiraNET`);
    setShowWhatsAppModal(true);
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
    showToast(`✅ Membuka WhatsApp untuk ${count} customer`, 'success');
    setShowWhatsAppModal(false);
    setSelectedInvoicesForWA([]);
  };

  // ── Export CSV ────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['No Invoice', 'Pelanggan', 'Email', 'Telepon', 'Jumlah', 'Jatuh Tempo', 'Status', 'Tanggal Bayar', 'Bulan'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.customer.name,
      inv.customer.email,
      inv.customer.phone,
      inv.amount,
      new Date(inv.dueDate).toLocaleDateString('id-ID'),
      inv.status,
      inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : '-',
      inv.month || '-',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✅ Exported ${filteredInvoices.length} invoice ke CSV`, 'success');
  };

  // ── Filters ───────────────────────────────────────────────────────────
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.phone.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterStatus !== 'ALL') {
      matchesFilter = invoice.status === filterStatus;
    }
    const matchesCustomer = filterCustomer === 'ALL' || invoice.customer.id === filterCustomer;
    return matchesSearch && matchesFilter && matchesCustomer;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const daysOverdue = (dueDate: string) => {
    const diff = new Date().getTime() - new Date(dueDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  // Mock initial detailed data if DB is empty to match screenshots
  const displayInvoices = filteredInvoices.length > 0 ? filteredInvoices : [
    {
      id: '1',
      invoiceNumber: 'INV/2026/07/0001',
      customer: { id: 'CUST-0001', name: 'Budi Santoso', email: 'budi@example.com', phone: '08123456789' },
      amount: 375000,
      dueDate: '2026-07-10T23:59:00Z',
      createdAt: '2026-07-01T08:30:00Z',
      status: 'PAID' as const,
      month: '01/07/2026 – 31/07/2026',
      method: 'Transfer'
    },
    {
      id: '2',
      invoiceNumber: 'INV/2026/07/0002',
      customer: { id: 'CUST-0002', name: 'Siti Aminah', email: 'siti@example.com', phone: '08123456780' },
      amount: 250000,
      dueDate: '2026-07-10T23:59:00Z',
      createdAt: '2026-07-01T08:31:00Z',
      status: 'PENDING' as const,
      month: '01/07/2026 – 31/07/2026',
      method: 'QRIS'
    },
    {
      id: '3',
      invoiceNumber: 'INV/2026/07/0003',
      customer: { id: 'CUST-0003', name: 'Andi Pratama', email: 'andi@example.com', phone: '08123456781' },
      amount: 575000,
      dueDate: '2026-07-10T23:59:00Z',
      createdAt: '2026-07-01T08:32:00Z',
      status: 'OVERDUE' as const,
      month: '01/07/2026 – 31/07/2026',
      method: 'Transfer'
    },
    {
      id: '4',
      invoiceNumber: 'INV/2026/06/0121',
      customer: { id: 'CUST-0004', name: 'Rina Marlina', email: 'rina@example.com', phone: '08123456782' },
      amount: 750000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:15:00Z',
      status: 'PAID' as const,
      month: '01/06/2026 – 30/06/2026',
      method: 'Transfer'
    },
    {
      id: '5',
      invoiceNumber: 'INV/2026/06/0122',
      customer: { id: 'CUST-0005', name: 'PT. Maju Bersama', email: 'maju@example.com', phone: '021888222' },
      amount: 1250000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:20:00Z',
      status: 'PAID' as const,
      month: '01/06/2026 – 30/06/2026',
      method: 'Transfer'
    },
    {
      id: '6',
      invoiceNumber: 'INV/2026/06/0123',
      customer: { id: 'CUST-0006', name: 'Dewi Lestari', email: 'dewi@example.com', phone: '08123456783' },
      amount: 150000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:25:00Z',
      status: 'PAID' as const,
      month: '01/06/2026 – 30/06/2026',
      method: 'Cash'
    },
    {
      id: '7',
      invoiceNumber: 'INV/2026/06/0124',
      customer: { id: 'CUST-0007', name: 'Fajar Nugroho', email: 'fajar@example.com', phone: '08123456784' },
      amount: 375000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:30:00Z',
      status: 'OVERDUE' as const,
      month: '01/06/2026 – 30/06/2026',
      method: 'Transfer'
    },
    {
      id: '8',
      invoiceNumber: 'INV/2026/05/0101',
      customer: { id: 'CUST-0008', name: 'Nina Wulandari', email: 'nina@example.com', phone: '08123456785' },
      amount: 250000,
      dueDate: '2026-05-10T23:59:00Z',
      createdAt: '2026-05-01T08:40:00Z',
      status: 'PAID' as const,
      month: '01/05/2026 – 31/05/2026',
      method: 'QRIS'
    },
    {
      id: '9',
      invoiceNumber: 'INV/2026/05/0102',
      customer: { id: 'CUST-0009', name: 'Yudi Hermawan', email: 'yudi@example.com', phone: '08123456786' },
      amount: 500000,
      dueDate: '2026-05-10T23:59:00Z',
      createdAt: '2026-05-01T08:45:00Z',
      status: 'PAID' as const,
      month: '01/05/2026 – 31/05/2026',
      method: 'Transfer'
    },
    {
      id: '10',
      invoiceNumber: 'INV/2026/05/0103',
      customer: { id: 'CUST-0010', name: 'Eva Apriyani', email: 'eva@example.com', phone: '08123456787' },
      amount: 375000,
      dueDate: '2026-05-10T23:59:00Z',
      createdAt: '2026-05-01T08:50:00Z',
      status: 'PENDING' as const,
      month: '01/05/2026 – 31/05/2026',
      method: 'Transfer'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span className="text-blue-400">Invoice</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Invoice</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Calendar */}
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-2 rounded-xl text-xs text-gray-300">
              <Calendar size={14} className="text-blue-400" />
              <span>01 Juli 2026</span>
              <span className="text-[10px] text-gray-500">08:35 WIB</span>
            </div>
            
            {/* Status Sistem */}
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-2 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-400">Status Sistem</span>
              <span className="text-green-400 font-bold">Normal</span>
            </div>

            {/* Global Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari customer, invoice, tagihan..."
                className="w-full bg-[#0b1329] border border-[#131d35] rounded-xl text-xs pl-9 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Notification and Profile icons */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors">
                <Bell size={16} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">12</span>
              </button>
              <button className="relative p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors">
                <Mail size={16} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">8</span>
              </button>
              <button className="p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors max-sm:hidden">
                <Maximize2 size={16} className="text-gray-400" />
              </button>
              
              {/* Profile */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#131d35]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  <span className="text-xs">AR</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-white">Agus Dwi Rianto</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Top Action Buttons Area ─────────────────────────────────────── */}
        <div className="flex justify-end gap-3">
          <div className="relative">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <Download size={14} className="text-gray-400" />
              <span>Export</span>
              <span className="text-[9px] text-gray-500">▼</span>
            </button>
          </div>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Buat Invoice</span>
          </button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Card 1: Total Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Invoice</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.paidInvoices + stats.unpaidInvoices + stats.overdueInvoices}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Semua invoice</p>
            </div>
          </div>

          {/* Card 2: Lunas */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Lunas</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.paidInvoices}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">79.0% dari total</p>
            </div>
          </div>

          {/* Card 3: Belum Dibayar */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Belum Dibayar</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.unpaidInvoices}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">13.0% dari total</p>
            </div>
          </div>

          {/* Card 4: Terlambat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Terlambat</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.overdueInvoices}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">5.4% dari total</p>
            </div>
          </div>

          {/* Card 5: Total Pendapatan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Pendapatan</p>
              <p className="text-base font-black text-white mt-0.5">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Dari semua invoice</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">Lunas</option>
              <option value="PENDING">Belum Dibayar</option>
              <option value="OVERDUE">Terlambat</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Metode</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
              <option value="cash">Cash</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">Semua Periode</option>
              <option value="this-month">Bulan Ini</option>
              <option value="last-month">Bulan Lalu</option>
            </select>
            
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); }}
              className="text-xs font-semibold text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-transparent hover:border-[#131d35] transition-all ml-auto"
            >
              Reset
            </button>

            <button 
              className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* ─── Main Two-Column Panel ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Invoice list & Quick actions */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#131d35] bg-[#101935]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input type="checkbox" className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-40">INVOICE</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-32">PERIODE</th>
                      <th className="p-4 w-36">TANGGAL</th>
                      <th className="p-4 w-36">JATUH TEMPO</th>
                      <th className="p-4 w-28">TOTAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-24">METODE</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {displayInvoices.map((inv, idx) => {
                      const isAuto = idx < 3; // First 3 rows mock Auto badge
                      return (
                        <tr key={inv.id} className="hover:bg-[#121c38]/40 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded bg-[#080d19] border-[#131d35] text-blue-600 focus:ring-0" />
                          </td>
                          <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
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
                              <span className="font-bold text-white block">{inv.customer.name}</span>
                              <span className="text-[10px] text-gray-500 block font-semibold">{inv.customer.id || `CUST-00${inv.id}`}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-300">
                            {inv.customer.name.includes('Corporate') || inv.amount > 500000 ? 'Corporate 100 Mbps' : 'Home 50 Mbps'}
                          </td>
                          <td className="p-4 text-gray-400 leading-normal max-w-[130px] font-medium">{inv.month || '01/07/2026 – 31/07/2026'}</td>
                          <td className="p-4 text-gray-400">{new Date(inv.createdAt).toLocaleString('id-ID')}</td>
                          <td className="p-4 text-gray-400">{new Date(inv.dueDate).toLocaleString('id-ID')}</td>
                          <td className="p-4 font-bold text-white">{formatCurrency(inv.amount)}</td>
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
                            <span className="px-2 py-0.5 rounded bg-[#101935] text-[10px] text-gray-400 border border-[#131d35] font-semibold uppercase tracking-wider">
                              {(inv as any).method || 'Transfer'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => { setSelectedInvoice(inv); setShowDetailModal(true); }}
                                className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-blue-400 hover:text-blue-300 transition-colors">
                                <Download size={14} />
                              </button>
                              <button className="p-1.5 hover:bg-[#1b2647] rounded-lg text-gray-400 hover:text-white transition-colors">
                                <MoreVertical size={14} />
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[#131d35] bg-[#0b1329]/60">
                <span className="text-xs text-gray-500">
                  Menampilkan <span className="font-semibold text-white">1 - 10</span> dari <span className="font-semibold text-white">1.248</span> data
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled
                      className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border bg-[#0052cc] text-white border-[#0052cc]">1</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">2</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">3</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">4</button>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">5</button>
                    <span className="text-gray-600 text-xs px-1">...</span>
                    <button className="w-8 h-8 rounded-xl text-xs font-semibold border border-[#131d35] text-gray-400 hover:text-white hover:bg-[#121c38]">125</button>
                    <button className="p-2 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="bg-[#080d19] border border-[#131d35] text-xs py-1.5 px-3 rounded-lg text-gray-300 focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={25}>25 / halaman</option>
                    <option value={50}>50 / halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Card banner - Aksi Cepat */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Buat Invoice */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-[#101c3a]/30 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Plus size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Buat Invoice</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Buat invoice baru untuk customer</p>
                  </div>
                </div>

                {/* 2. Invoice Berulang */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-[#101c3a]/30 transition-colors cursor-pointer">
                  <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                    <RefreshCw size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Invoice Berulang</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Buat invoice berulang otomatis</p>
                  </div>
                </div>

                {/* 3. Import Invoice */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-[#101c3a]/30 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Download size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Import Invoice</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Import invoice dari file Excel</p>
                  </div>
                </div>

                {/* 4. Template Invoice */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-[#101c3a]/30 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Template Invoice</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Kelola template invoice</p>
                  </div>
                </div>

                {/* 5. Pengaturan Invoice */}
                <div className="bg-[#080d19] border border-[#131d35] p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-[#101c3a]/30 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Settings size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Pengaturan Invoice</p>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">Atur pajak, denda, dan lainnya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Pendapatan */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Pendapatan</h3>
                <select className="bg-[#080d19] border border-[#131d35] text-[10px] py-1 px-2 rounded-lg text-gray-400 focus:outline-none">
                  <option>Bulan ini</option>
                  <option>Bulan lalu</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <p className="text-base font-black text-white">{formatCurrency(stats.totalRevenue)}</p>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full">+18.5%</span>
              </div>
              <p className="text-[9px] text-gray-500">Dibanding bulan lalu</p>

              {/* Sparkline chart SVG */}
              <div className="h-10 w-full mt-4">
                <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                  <path 
                    d="M0,16 Q18,6 36,12 T72,4 T100,8" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M0,16 Q18,6 36,12 T72,4 T100,8 L100,20 L0,20 Z" 
                    fill="url(#sparkline-grad-invoice)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad-invoice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Card 2: Status Invoice Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Status Invoice</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Lunas: 986 / 1248 = 79.0% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(986 / 1248) * 100} ${100 - (986 / 1248) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Belum Dibayar: 162 / 1248 = 13.0% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(162 / 1248) * 100} ${100 - (162 / 1248) * 100}`} 
                    strokeDashoffset={`${100 - (986 / 1248) * 100}`} 
                  />

                  {/* Terlambat: 68 / 1248 = 5.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(68 / 1248) * 100} ${100 - (68 / 1248) * 100}`} 
                    strokeDashoffset={`${100 - (1148 / 1248) * 100}`} 
                  />

                  {/* Dibatalkan: 32 / 1248 = 2.6% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6b7280" strokeWidth="4.5" 
                    strokeDasharray={`${(32 / 1248) * 100} ${100 - (32 / 1248) * 100}`} 
                    strokeDashoffset={`${100 - (1216 / 1248) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-white">1.248</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block"></span>
                    <span>Lunas</span>
                  </div>
                  <span className="font-semibold text-white">986 (79.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#f97316] inline-block"></span>
                    <span>Belum Dibayar</span>
                  </div>
                  <span className="font-semibold text-white">162 (13.0%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"></span>
                    <span>Terlambat</span>
                  </div>
                  <span className="font-semibold text-white">68 (5.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-gray-500 inline-block"></span>
                    <span>Dibatalkan</span>
                  </div>
                  <span className="font-semibold text-white">32 (2.6%)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Metode Pembayaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metode Pembayaran</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Transfer Bank', amount: 245750000, percentage: 59.6 },
                  { name: 'QRIS', amount: 98200000, percentage: 23.8 },
                  { name: 'Cash', amount: 45350000, percentage: 11.0 },
                  { name: 'E-Wallet', amount: 23200000, percentage: 5.6 },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-300">{item.name}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{formatCurrency(item.amount)} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 4: Aktivitas Terakhir */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Aktivitas Terakhir</h3>
                <span className="text-[10px] text-blue-500 font-bold hover:underline cursor-pointer">Lihat Semua</span>
              </div>
              
              <div className="relative border-l-2 border-[#131d35] pl-4 ml-2.5 space-y-5 text-[11px] text-gray-400">
                
                {/* Item 1 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:30</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Invoice <strong className="text-white">"INV/2026/07/0001"</strong> dibayar oleh <span className="text-blue-400">Budi Santoso</span>
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:25</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Invoice <strong className="text-white">"INV/2026/07/0002"</strong> dibuat secara otomatis
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#0b1329]" />
                  <p className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                    <Clock size={10} />
                    <span>01 Jul 2026 08:20</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Invoice <strong className="text-white">"INV/2026/07/0003"</strong> jatuh tempo
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modals wrapper */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl w-full max-w-md overflow-hidden text-gray-300">
            <div className="flex items-center justify-between p-5 border-b border-[#131d35]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <Plus size={16} className="text-blue-500" /> Generate Invoice Bulanan
              </h2>
              <button onClick={() => setShowGenerateModal(false)} className="p-1.5 hover:bg-[#131d35] rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Pilih Bulan Tagihan</label>
                <input
                  type="month"
                  value={generateMonth}
                  onChange={e => setGenerateMonth(e.target.value)}
                  className="w-full bg-[#080d19] border border-[#131d35] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
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
            <div className="p-5 border-t border-[#131d35] flex gap-3">
              <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2.5 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
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
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl w-full max-w-md overflow-hidden text-gray-300">
            <div className="flex items-center justify-between p-5 border-b border-[#131d35]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle size={16} className="text-green-500" /> Tandai Lunas
              </h2>
              <button onClick={() => setShowMarkPaidModal(false)} className="p-1.5 hover:bg-[#131d35] rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[#080d19] border border-[#131d35] rounded-xl p-4 space-y-2">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Invoice</span>
                  <p className="font-mono font-bold text-blue-400 text-xs">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Pelanggan</span>
                  <p className="font-semibold text-gray-200 text-xs">{selectedInvoice.customer.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Jumlah Tagihan</span>
                  <p className="text-xl font-black text-white">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setMarkPaidMethod(m)}
                      className={`px-3 py-2 rounded-xl text-xs border transition ${
                        markPaidMethod === m
                          ? 'bg-green-600 text-white border-green-600 font-bold'
                          : 'bg-[#080d19] text-gray-400 border-[#131d35] hover:bg-[#121c38]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-[#131d35] flex gap-3">
              <button onClick={() => setShowMarkPaidModal(false)} className="flex-1 px-4 py-2.5 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
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
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl w-full max-w-lg overflow-hidden text-gray-300">
            <div className="flex items-center justify-between p-5 border-b border-[#131d35]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <MessageCircle size={16} className="text-emerald-500" /> WhatsApp Blast
              </h2>
              <button onClick={() => setShowWhatsAppModal(false)} className="p-1.5 hover:bg-[#131d35] rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-400">
                Mengirim pesan reminder pembayaran ke <strong className="text-white">{selectedInvoicesForWA.length} pelanggan</strong>.
              </p>
              <textarea
                rows={6}
                value={whatsappMessage}
                onChange={e => setWhatsappMessage(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>
            <div className="p-5 border-t border-[#131d35] flex gap-3">
              <button onClick={() => setShowWhatsAppModal(false)} className="flex-1 px-4 py-2.5 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
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

      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl w-full max-w-md overflow-hidden text-gray-300">
            <div className="flex items-center justify-between p-5 border-b border-[#131d35]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Detail Invoice</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-[#131d35] rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-blue-400">{selectedInvoice.invoiceNumber}</span>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                  selectedInvoice.status === 'PAID' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : selectedInvoice.status === 'PENDING'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {selectedInvoice.status === 'PAID' ? 'Lunas' : selectedInvoice.status === 'PENDING' ? 'Belum Dibayar' : 'Terlambat'}
                </span>
              </div>
              <hr className="border-[#131d35]" />
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500">Pelanggan</p>
                  <p className="font-bold text-white mt-0.5">{selectedInvoice.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Telepon</p>
                  <p className="font-semibold text-gray-300 mt-0.5">{selectedInvoice.customer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold text-gray-300 mt-0.5 break-all">{selectedInvoice.customer.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bulan</p>
                  <p className="font-semibold text-gray-300 mt-0.5">{selectedInvoice.month || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Jumlah</p>
                  <p className="font-bold text-base text-white mt-0.5">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Jatuh Tempo</p>
                  <p className={`font-semibold mt-0.5 ${selectedInvoice.status === 'OVERDUE' ? 'text-red-400' : 'text-gray-300'}`}>
                    {new Date(selectedInvoice.dueDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                {selectedInvoice.paidAt && (
                  <div>
                    <p className="text-gray-500">Tanggal Bayar</p>
                    <p className="font-semibold text-green-400 mt-0.5">{new Date(selectedInvoice.paidAt).toLocaleDateString('id-ID')}</p>
                  </div>
                )}
                {selectedInvoice.description && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Keterangan</p>
                    <p className="text-gray-300 mt-0.5 leading-relaxed">{selectedInvoice.description}</p>
                  </div>
                )}
              </div>

              {selectedInvoice.status !== 'PAID' && (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => { setShowDetailModal(false); setMarkPaidMethod('Cash'); setShowMarkPaidModal(true); }}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Tandai Lunas
                  </button>
                  <button
                    onClick={() => { setShowDetailModal(false); if (selectedInvoice.customer.phone) handleOpenWhatsApp(selectedInvoice.customer.phone, selectedInvoice.invoiceNumber, selectedInvoice.amount, selectedInvoice.dueDate); }}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} /> Kirim WA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
