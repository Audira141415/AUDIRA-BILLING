import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
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
    const headers = ['No Invoice', 'Pelanggan', 'Email', 'Telepon', 'Jumlah', 'Jatuh Tempo', 'Status', 'Tanggal Bayar', 'Bulan'];
    const rows = displayInvoices.map(inv => [
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
  };

  // Mock initial data if backend returns empty lists
  const displayInvoices = invoices.length > 0 ? invoices : [
    {
      id: '1',
      invoiceNumber: 'INV/2026/07/0001',
      customer: { id: 'CUST-0001', name: 'Budi Santoso', email: 'budi.santoso@email.com', phone: '0812-3456-7890', address: 'Jl. Merdeka No. 10, Yogyakarta' },
      amount: 375000,
      dueDate: '2026-07-10T23:59:00Z',
      createdAt: '2026-07-01T08:30:00Z',
      status: 'PAID' as const,
      month: '01/07/2026 - 31/07/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202607-0001'
    },
    {
      id: '2',
      invoiceNumber: 'INV/2026/07/0002',
      customer: { id: 'CUST-0002', name: 'Siti Aminah', email: 'siti@example.com', phone: '08123456780' },
      amount: 250000,
      dueDate: '2026-07-10T23:59:00Z',
      createdAt: '2026-07-01T08:31:00Z',
      status: 'PENDING' as const,
      month: '01/07/2026 - 31/07/2026',
      method: 'QRIS',
      referenceNumber: 'REF-202607-0002'
    },
    {
      id: '3',
      invoiceNumber: 'INV/2026/07/0003',
      customer: { id: 'CUST-0003', name: 'Andi Pratama', email: 'andi@example.com', phone: '08123456781' },
      amount: 575000,
      dueDate: '2026-07-10T23:59:00Z',
      createdAt: '2026-07-01T08:32:00Z',
      status: 'OVERDUE' as const,
      month: '01/07/2026 - 31/07/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202607-0003'
    },
    {
      id: '4',
      invoiceNumber: 'INV/2026/06/0121',
      customer: { id: 'CUST-0004', name: 'Rina Marlina', email: 'rina@example.com', phone: '08123456782' },
      amount: 750000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:15:00Z',
      status: 'PAID' as const,
      month: '01/06/2026 - 30/06/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202606-0121'
    },
    {
      id: '5',
      invoiceNumber: 'INV/2026/06/0122',
      customer: { id: 'CUST-0005', name: 'PT. Maju Bersama', email: 'maju@example.com', phone: '021888222' },
      amount: 1250000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:20:00Z',
      status: 'PAID' as const,
      month: '01/06/2026 - 30/06/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202606-0122'
    },
    {
      id: '6',
      invoiceNumber: 'INV/2026/06/0123',
      customer: { id: 'CUST-0006', name: 'Dewi Lestari', email: 'dewi@example.com', phone: '08123456783' },
      amount: 150000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:25:00Z',
      status: 'PAID' as const,
      month: '01/06/2026 - 30/06/2026',
      method: 'Cash',
      referenceNumber: 'REF-202606-0123'
    },
    {
      id: '7',
      invoiceNumber: 'INV/2026/06/0124',
      customer: { id: 'CUST-0007', name: 'Fajar Nugroho', email: 'fajar@example.com', phone: '08123456784' },
      amount: 375000,
      dueDate: '2026-06-10T23:59:00Z',
      createdAt: '2026-06-01T09:30:00Z',
      status: 'OVERDUE' as const,
      month: '01/06/2026 - 30/06/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202606-0124'
    },
    {
      id: '8',
      invoiceNumber: 'INV/2026/05/0101',
      customer: { id: 'CUST-0008', name: 'Nina Wulandari', email: 'nina@example.com', phone: '08123456785' },
      amount: 250000,
      dueDate: '2026-05-10T23:59:00Z',
      createdAt: '2026-05-01T08:40:00Z',
      status: 'PAID' as const,
      month: '01/05/2026 - 31/05/2026',
      method: 'QRIS',
      referenceNumber: 'REF-202605-0101'
    },
    {
      id: '9',
      invoiceNumber: 'INV/2026/05/0102',
      customer: { id: 'CUST-0009', name: 'Yudi Hermawan', email: 'yudi@example.com', phone: '08123456786' },
      amount: 500000,
      dueDate: '2026-05-10T23:59:00Z',
      createdAt: '2026-05-01T08:45:00Z',
      status: 'PAID' as const,
      month: '01/05/2026 - 31/05/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202605-0102'
    },
    {
      id: '10',
      invoiceNumber: 'INV/2026/05/0103',
      customer: { id: 'CUST-0010', name: 'Eva Apriyani', email: 'eva@example.com', phone: '08123456787' },
      amount: 375000,
      dueDate: '2026-05-10T23:59:00Z',
      createdAt: '2026-05-01T08:50:00Z',
      status: 'PENDING' as const,
      month: '01/05/2026 - 31/05/2026',
      method: 'Transfer',
      referenceNumber: 'REF-202605-0103'
    }
  ];

  // Set first item as active detail side view by default if none selected
  const activeDetail = selectedInvoice || displayInvoices[0];

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span>Invoice</span>
              <span>&gt;</span>
              <span className="text-blue-400">Semua Invoice</span>
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

        {/* ─── Stats Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Card 1: Total Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Invoice</p>
              <p className="text-xl font-black text-white mt-0.5">{stats.totalInvoice}</p>
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
              <p className="text-xl font-black text-white mt-0.5">{stats.paid}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">79.0% dari total</p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pending</p>
              <p className="text-xl font-black text-white mt-0.5">{stats.pending}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">13.0% dari total</p>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Overdue</p>
              <p className="text-xl font-black text-white mt-0.5">{stats.overdue}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">5.4% dari total</p>
            </div>
          </div>

          {/* Card 5: Total Pendapatan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Pendapatan</p>
              <p className="text-sm font-black text-white mt-0.5">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Dari semua invoice</p>
            </div>
          </div>

          {/* Card 6: Outstanding */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Outstanding</p>
              <p className="text-sm font-black text-white mt-0.5">{formatCurrency(stats.outstanding)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Belum dibayar</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari invoice, customer, package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080d19] border border-[#131d35] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">Lunas</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]"
            >
              <option value="all">Semua Metode</option>
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
              <option value="cash">Cash</option>
            </select>

            <select 
              className="bg-[#080d19] border border-[#131d35] text-xs py-2.5 px-4 rounded-xl text-gray-300 focus:outline-none min-w-[140px]"
            >
              <option value="all">Semua Periode</option>
              <option value="this-month">Bulan Ini</option>
            </select>

            {/* Date range picker mock */}
            <div className="flex items-center gap-2 bg-[#080d19] border border-[#131d35] px-3 py-2.5 rounded-xl text-xs text-gray-300 cursor-pointer">
              <Calendar size={14} className="text-gray-500" />
              <span>01/06/2026 - 01/07/2026</span>
            </div>
            
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); }}
              className="text-xs font-semibold text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-transparent hover:border-[#131d35] transition-all ml-auto"
            >
              Reset
            </button>

            <button 
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
              className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800"
            >
              <Download size={14} className="text-gray-400" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── Mass Action bar ────────────────────────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-2">Mass Action</span>
          
          <button 
            onClick={handleMassWhatsApp}
            className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400 text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <MessageCircle size={13} />
            <span>Kirim WA</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:border-blue-500/30 text-gray-400 hover:text-blue-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Mail size={13} />
            <span>Kirim Email</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <FileText size={13} />
            <span>Download PDF</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:border-blue-500/30 text-gray-400 hover:text-blue-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Download size={13} />
            <span>Export</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Trash2 size={13} />
            <span>Hapus</span>
          </button>

          <button className="flex items-center gap-1.5 bg-[#080d19] border border-[#131d35] hover:border-green-500/30 text-gray-400 hover:text-green-400 text-xs px-3.5 py-2 rounded-xl transition-all">
            <Check size={13} />
            <span>Tandai Lunas</span>
          </button>

          <button className="p-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] rounded-xl text-gray-400">
            <MoreVertical size={13} />
          </button>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Invoice list table */}
          <div className={`${showDetailSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 transition-all duration-300`}>
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
                      <th className="p-4 w-36">DUE DATE</th>
                      <th className="p-4 w-28">TOTAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-24">METODE</th>
                      <th className="p-4 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35] text-xs text-gray-300">
                    {displayInvoices.map((inv, idx) => {
                      const isAuto = idx < 3;
                      const isActiveRow = activeDetail?.id === inv.id;
                      return (
                        <tr 
                          key={inv.id} 
                          onClick={() => { setSelectedInvoice(inv); setShowDetailSidebar(true); }}
                          className={`hover:bg-[#121c38]/40 transition-colors cursor-pointer ${isActiveRow ? 'bg-[#121c38]/70 border-l-4 border-blue-500' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                          <td className="p-4 text-gray-400 leading-normal max-w-[130px] font-medium">{inv.month}</td>
                          <td className="p-4">
                            <span className="block text-gray-300">{new Date(inv.dueDate).toLocaleDateString('id-ID')}</span>
                            <span className={`text-[10px] block mt-0.5 ${inv.status === 'PAID' ? 'text-green-500' : inv.status === 'PENDING' ? 'text-blue-400' : 'text-red-400'}`}>
                              {inv.status === 'PAID' ? 'Lunas' : inv.status === 'PENDING' ? '9 Hari Lagi' : 'Lewat'}
                            </span>
                          </td>
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
                              {inv.method || 'Transfer'}
                            </span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => { setSelectedInvoice(inv); setShowDetailSidebar(true); }}
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
          </div>

          {/* Right Column: Invoice Detail sidebar widget */}
          {showDetailSidebar && (
            <div className="lg:col-span-4 space-y-6 transition-all duration-300">
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-5 relative">
                
                {/* Header widget */}
                <div className="flex justify-between items-start border-b border-[#131d35] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeDetail.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {activeDetail.status === 'PAID' ? 'Lunas' : 'Belum Dibayar'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">Auto</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-mono mt-1.5">{activeDetail.invoiceNumber}</h3>
                    <p className="text-[10px] text-gray-500">Dibuat pada 01 Juli 2026, 08:30 WIB</p>
                  </div>
                  
                  <button 
                    onClick={() => setShowDetailSidebar(false)}
                    className="p-1.5 hover:bg-[#131d35] rounded-xl text-gray-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Tagihan Summary Row */}
                <div className="grid grid-cols-4 gap-2 text-center bg-[#080d19]/40 border border-[#131d35] rounded-xl p-3">
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">Total Tagihan</span>
                    <p className="text-xs font-bold text-white mt-1">{formatCurrency(activeDetail.amount)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">Dibayar</span>
                    <p className="text-xs font-bold text-green-400 mt-1">{formatCurrency(activeDetail.status === 'PAID' ? activeDetail.amount : 0)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">Sisa</span>
                    <p className="text-xs font-bold text-white mt-1">{formatCurrency(activeDetail.status === 'PAID' ? 0 : activeDetail.amount)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">Jatuh Tempo</span>
                    <p className="text-xs font-bold text-blue-400 mt-1">10 Juli 2026</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#131d35] text-[10px] font-bold text-gray-500">
                  <button 
                    onClick={() => setDetailTab('overview')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'overview' ? 'border-blue-500 text-white' : 'border-transparent hover:text-gray-300'}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setDetailTab('items')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'items' ? 'border-blue-500 text-white' : 'border-transparent hover:text-gray-300'}`}
                  >
                    Item Tagihan
                  </button>
                  <button 
                    onClick={() => setDetailTab('payments')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'payments' ? 'border-blue-500 text-white' : 'border-transparent hover:text-gray-300'}`}
                  >
                    Pembayaran
                  </button>
                  <button 
                    onClick={() => setDetailTab('history')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'history' ? 'border-blue-500 text-white' : 'border-transparent hover:text-gray-300'}`}
                  >
                    Riwayat
                  </button>
                  <button 
                    onClick={() => setDetailTab('reminder')}
                    className={`flex-1 pb-2 border-b-2 transition-all ${detailTab === 'reminder' ? 'border-blue-500 text-white' : 'border-transparent hover:text-gray-300'}`}
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
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Informasi Customer</span>
                        <div className="text-xs space-y-1.5">
                          <p className="text-gray-500">Nama: <strong className="text-white">{activeDetail.customer.name}</strong></p>
                          <p className="text-gray-500">ID Customer: <strong className="text-white">{activeDetail.customer.id || 'CUST-0001'}</strong></p>
                          <p className="text-gray-500">No. WhatsApp: <strong className="text-white">{activeDetail.customer.phone}</strong></p>
                          <p className="text-gray-500 font-semibold break-all">Email: <span className="text-blue-400">{activeDetail.customer.email}</span></p>
                          <p className="text-gray-500 leading-relaxed">Alamat: <strong className="text-white">{activeDetail.customer.address || 'Jl. Merdeka No. 10, Yogyakarta'}</strong></p>
                        </div>
                      </div>

                      {/* Invoice Info */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Informasi Invoice</span>
                        <div className="text-xs space-y-1.5">
                          <p className="text-gray-500">No. Referensi: <strong className="text-white">{activeDetail.referenceNumber || 'REF-202607-0001'}</strong></p>
                          <p className="text-gray-500">Metode Pembayaran: <strong className="text-white">{activeDetail.method || 'Transfer Bank'}</strong></p>
                          <p className="text-gray-500">Bank Tujuan: <strong className="text-white">BCA - 1234567890</strong></p>
                          <p className="text-gray-500">Periode: <strong className="text-white">{activeDetail.month}</strong></p>
                          <p className="text-gray-500">Tanggal Invoice: <strong className="text-white">01 Juli 2026, 08:30 WIB</strong></p>
                          <p className="text-gray-500">Jatuh Tempo: <strong className="text-red-400">10 Juli 2026, 23:59 WIB</strong></p>
                          <p className="text-gray-500">Status: <span className="text-green-400 font-bold">Lunas</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Payment details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-[#131d35] pt-4">
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
                          <p className="text-[7px] font-semibold text-gray-400">PT. AudiraNET Solusi</p>
                        </div>
                        <div className="flex gap-2.5 mt-2 justify-center items-center scale-90">
                          <span className="text-[9px] font-extrabold text-blue-900 tracking-wider">QRIS</span>
                          <span className="text-[9px] font-extrabold text-blue-600">BCA</span>
                        </div>
                      </div>

                      {/* Financial values */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Ringkasan Pembayaran</span>
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal</span>
                          <span className="font-semibold text-white">{formatCurrency(activeDetail.amount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Diskon</span>
                          <span className="font-semibold text-white">- Rp 0</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>PPN (11%)</span>
                          <span className="font-semibold text-white">Rp 0</span>
                        </div>
                        <div className="flex justify-between text-white font-bold border-t border-[#131d35] pt-1 mt-1">
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
                  <div className="py-8 text-center text-xs text-gray-500 font-medium">
                    Konten Tab {detailTab} terhubung dengan data referensi database invoice.
                  </div>
                )}

                {/* Bottom link button */}
                <div className="border-t border-[#131d35] pt-4">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] text-blue-400 text-xs font-bold py-2.5 rounded-xl transition-all">
                    <span>Lihat Invoice Public (Customer View)</span>
                    <span>↗</span>
                  </button>
                </div>

              </div>
            </div>
          )}

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

    </Layout>
  );
}
