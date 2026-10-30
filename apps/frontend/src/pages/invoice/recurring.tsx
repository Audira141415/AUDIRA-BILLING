import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/Pagination';
import {
  Search,
  Filter,
  Edit2,
  Play,
  Pause,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  X,
  Check,
  Zap,
  Trash2
} from 'lucide-react';

interface RecurringRow {
  id: string;
  name: string;
  code: string;
  customerName: string;
  customerNo: string;
  packageName: string;
  period: string;
  cycle: string;
  nextGenerate: string;
  nextGenerateDesc: string;
  total: number;
  status: 'Aktif' | 'Dijeda' | 'Gagal';
}

const mockRecurring: RecurringRow[] = [
  {
    id: '1',
    name: 'Budi Santoso - Home 50 Mbps',
    code: 'INV-REC-2026-0001',
    customerName: 'Budi Santoso',
    customerNo: 'CUST-0001',
    packageName: 'Home 50 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 375000,
    status: 'Aktif'
  },
  {
    id: '2',
    name: 'Siti Aminah - Home 20 Mbps',
    code: 'INV-REC-2026-0002',
    customerName: 'Siti Aminah',
    customerNo: 'CUST-0002',
    packageName: 'Home 20 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 250000,
    status: 'Aktif'
  },
  {
    id: '3',
    name: 'Andi Pratama - Home 100 Mbps',
    code: 'INV-REC-2026-0003',
    customerName: 'Andi Pratama',
    customerNo: 'CUST-0003',
    packageName: 'Home 100 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 575000,
    status: 'Aktif'
  },
  {
    id: '4',
    name: 'PT. Maju Bersama - Corporate 200 Mbps',
    code: 'INV-REC-2026-0004',
    customerName: 'PT. Maju Bersama',
    customerNo: 'CUST-0005',
    packageName: 'Corporate 200 Mbps',
    period: '01/06/2026 - 30/06/2026',
    cycle: 'Bulanan',
    nextGenerate: '22/10/2026',
    nextGenerateDesc: 'Hari ini',
    total: 1250000,
    status: 'Aktif'
  },
  {
    id: '5',
    name: 'Dewi Lestari - Home 10 Mbps',
    code: 'INV-REC-2026-0005',
    customerName: 'Dewi Lestari',
    customerNo: 'CUST-0006',
    packageName: 'Home 10 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 150000,
    status: 'Aktif'
  },
  {
    id: '6',
    name: 'Fajar Nugroho - Home 50 Mbps',
    code: 'INV-REC-2026-0006',
    customerName: 'Fajar Nugroho',
    customerNo: 'CUST-0007',
    packageName: 'Home 50 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 375000,
    status: 'Dijeda'
  },
  {
    id: '7',
    name: 'Nina Wulandari - Home 20 Mbps',
    code: 'INV-REC-2026-0007',
    customerName: 'Nina Wulandari',
    customerNo: 'CUST-0008',
    packageName: 'Home 20 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 250000,
    status: 'Aktif'
  },
  {
    id: '8',
    name: 'Yudi Hermawan - Corporate 50 Mbps',
    code: 'INV-REC-2026-0008',
    customerName: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    packageName: 'Corporate 50 Mbps',
    period: '01/06/2026 - 30/06/2026',
    cycle: 'Bulanan',
    nextGenerate: '22/10/2026',
    nextGenerateDesc: 'Hari ini',
    total: 500000,
    status: 'Aktif'
  },
  {
    id: '9',
    name: 'CV. Sinar Abadi - Corporate 300 Mbps',
    code: 'INV-REC-2026-0009',
    customerName: 'CV. Sinar Abadi',
    customerNo: 'CUST-0011',
    packageName: 'Corporate 300 Mbps',
    period: '01/06/2026 - 30/06/2026',
    cycle: 'Bulanan',
    nextGenerate: '22/10/2026',
    nextGenerateDesc: 'Hari ini',
    total: 2000000,
    status: 'Gagal'
  },
  {
    id: '10',
    name: 'PT. Digital Nusantara - Corporate 500 Mbps',
    code: 'INV-REC-2026-0010',
    customerName: 'PT. Digital Nusantara',
    customerNo: 'CUST-0012',
    packageName: 'Corporate 500 Mbps',
    period: '22/10/2026 - 31/07/2026',
    cycle: 'Bulanan',
    nextGenerate: '01/08/2026',
    nextGenerateDesc: '2 hari lagi',
    total: 3500000,
    status: 'Aktif'
  }
];

export default function RecurringInvoicePage() {
  const { toast } = useToast();
  const [recurringList, setRecurringList] = useState<RecurringRow[]>(mockRecurring);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [cycleFilter, setCycleFilter] = useState('Semua Periode');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringRow | null>(null);
  const [actionModalItem, setActionModalItem] = useState<RecurringRow | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerNo: '',
    packageName: 'Home 50 Mbps',
    cycle: 'Bulanan',
    total: 375000,
    nextGenerate: '01/11/2026',
    status: 'Aktif' as 'Aktif' | 'Dijeda' | 'Gagal'
  });

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map(r => r.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Toggle pause/play
  const handleTogglePause = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecurringList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Aktif' ? 'Dijeda' : 'Aktif';
        toast.success(`Jadwal recurring "${item.name}" kini ${nextStatus}.`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // Generate now
  const handleGenerateNow = (item: RecurringRow) => {
    toast.success(`Invoice untuk ${item.customerName} (${formatCurrency(item.total)}) berhasil digenerate seketika! Tagihan dikirim ke WhatsApp.`);
    setActionModalItem(null);
  };

  // Delete recurring
  const handleDeleteRecurring = (id: string) => {
    if (!confirm('Hapus jadwal tagihan berulang ini? Pelanggan tidak akan menerima tagihan otomatis lagi.')) return;
    setRecurringList(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(x => x !== id));
    toast.success('Jadwal tagihan berulang berhasil dihapus.');
    setActionModalItem(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      toast.warning('Tidak ada data tagihan berulang untuk diekspor.');
      return;
    }
    const headers = ['No', 'Kode Recurring', 'Nama Profil', 'Nama Pelanggan', 'No Pelanggan', 'Paket', 'Periode', 'Siklus', 'Next Generate', 'Total', 'Status'];
    const rows = filteredList.map((r, idx) => [
      idx + 1,
      `"${r.code}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${r.customerNo}"`,
      `"${r.packageName}"`,
      `"${r.period}"`,
      `"${r.cycle}"`,
      `"${r.nextGenerate}"`,
      r.total,
      `"${r.status}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `recurring_billing_audira_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Berhasil mengunduh jadwal recurring (${filteredList.length} baris).`);
  };

  // Add Recurring Handler
  const handleOpenAddModal = () => {
    setFormData({
      customerName: '',
      customerNo: `CUST-${String(recurringList.length + 1).padStart(4, '0')}`,
      packageName: 'Home 50 Mbps',
      cycle: 'Bulanan',
      total: 375000,
      nextGenerate: '01/11/2026',
      status: 'Aktif'
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      toast.warning('Nama pelanggan wajib diisi.');
      return;
    }
    const newItem: RecurringRow = {
      id: `rec-${Date.now()}`,
      code: `INV-REC-2026-${String(recurringList.length + 1).padStart(4, '0')}`,
      name: `${formData.customerName} - ${formData.packageName}`,
      customerName: formData.customerName,
      customerNo: formData.customerNo || `CUST-00${recurringList.length + 1}`,
      packageName: formData.packageName,
      period: '01/11/2026 - 30/11/2026',
      cycle: formData.cycle,
      nextGenerate: formData.nextGenerate,
      nextGenerateDesc: '1 Nov 2026',
      total: Number(formData.total) || 0,
      status: formData.status
    };
    setRecurringList(prev => [newItem, ...prev]);
    setShowAddModal(false);
    toast.success(`Jadwal recurring baru untuk "${newItem.customerName}" berhasil dibuat!`);
  };

  // Edit Recurring Handler
  const handleOpenEditModal = (item: RecurringRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingItem(item);
    setFormData({
      customerName: item.customerName,
      customerNo: item.customerNo,
      packageName: item.packageName,
      cycle: item.cycle,
      total: item.total,
      nextGenerate: item.nextGenerate,
      status: item.status
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setRecurringList(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          customerName: formData.customerName,
          packageName: formData.packageName,
          name: `${formData.customerName} - ${formData.packageName}`,
          cycle: formData.cycle,
          total: Number(formData.total) || 0,
          nextGenerate: formData.nextGenerate,
          status: formData.status
        };
      }
      return item;
    }));
    toast.success(`Jadwal recurring "${formData.customerName}" berhasil diperbarui.`);
    setEditingItem(null);
  };

  // Filtering
  const filteredList = useMemo(() => {
    return recurringList.filter((item) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCustomer = item.customerName.toLowerCase().includes(query);
        const matchCode = item.code.toLowerCase().includes(query);
        const matchPkg = item.packageName.toLowerCase().includes(query);
        if (!matchName && !matchCustomer && !matchCode && !matchPkg) return false;
      }
      if (statusFilter !== 'Semua Status' && item.status !== statusFilter) return false;
      if (cycleFilter !== 'Semua Periode' && item.cycle !== cycleFilter) return false;

      return true;
    });
  }, [recurringList, searchTerm, statusFilter, cycleFilter]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedList = filteredList.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

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
              <span className="text-blue-500 font-semibold">Tagihan Berulang (Recurring)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Otomasi Penagihan Berulang (Recurring Billing)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Konfigurasi jadwal penerbitan otomatis setiap tanggal 1 atau tanggal aktivasi layanan pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/invoice/settings" className="px-3 py-2 bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg">Pengaturan Billing</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Card 1: Total Berulang */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Berulang</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">86</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua invoice berulang</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">64</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">74.4% dari total</p>
            </div>
          </div>

          {/* Card 3: Akan Dibuat Hari Ini */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Akan Dibuat Hari Ini</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">12</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 4.250.000</p>
            </div>
          </div>

          {/* Card 4: Berhasil Dibuat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Berhasil Dibuat (Bulan Ini)</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">152</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 54.250.000</p>
            </div>
          </div>

          {/* Card 5: Gagal Dibuat */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Gagal Dibuat (Bulan Ini)</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">3</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Rp 1.250.000</p>
            </div>
          </div>

          {/* Card 6: Dijeda */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-gray-500/10 text-[var(--app-muted)] border border-gray-500/20 rounded-xl">
              <Pause size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Dijeda</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">7</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">8.1% dari total</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari nama, package, atau customer..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Dijeda">Dijeda</option>
              <option value="Gagal">Gagal</option>
            </select>

            <select
              value={cycleFilter}
              onChange={(e) => { setCycleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[140px]"
            >
              <option value="Semua Periode">Semua Siklus</option>
              <option value="Bulanan">Bulanan</option>
              <option value="Mingguan">Mingguan</option>
              <option value="Tahunan">Tahunan</option>
            </select>

            {(searchTerm || statusFilter !== 'Semua Status' || cycleFilter !== 'Semua Periode') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('Semua Status');
                  setCycleFilter('Semua Periode');
                  setCurrentPage(1);
                  toast.info('Filter tagihan berulang direset.');
                }}
                className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-[var(--app-border)] transition-all"
              >
                Reset
              </button>
            )}

            <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all ml-auto">
              <Plus size={14} />
              <span>Tambah Berulang</span>
            </button>

            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm border-gray-800">
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Recurring Table */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0}
                          onChange={handleSelectAll}
                          className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-52">NAMA BERULANG</th>
                      <th className="p-4 w-44">CUSTOMER</th>
                      <th className="p-4 w-36">PACKAGE</th>
                      <th className="p-4 w-40">PERIODE</th>
                      <th className="p-4 w-28">SIKLUS</th>
                      <th className="p-4 w-36">NEXT GENERATE</th>
                      <th className="p-4 w-32">TOTAL TAGIHAN</th>
                      <th className="p-4 w-24">STATUS</th>
                      <th className="p-4 w-24 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                    {paginatedList.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-xs text-[var(--app-muted)]">
                          Tidak ditemukan tagihan berulang yang sesuai parameter filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedList.map((r, idx) => {
                        const isSelected = selectedIds.includes(r.id);
                        return (
                          <tr 
                            key={r.id}
                            onClick={() => handleSelectRow(r.id)}
                            className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${isSelected ? 'bg-[var(--app-border)]/20/50' : ''}`}
                          >
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleSelectRow(r.id)}
                                className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-[var(--app-muted)] font-medium">{(safeCurrentPage - 1) * pageSize + idx + 1}</td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="font-bold text-[var(--app-text)] block">{r.name}</span>
                                <span className="font-mono text-[9px] text-[var(--app-muted)] block font-semibold">{r.code}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-0.5">
                                <span className="font-bold text-[var(--app-text)] block">{r.customerName}</span>
                                <span className="text-[10px] text-[var(--app-muted)] block font-semibold">{r.customerNo}</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium text-[var(--app-text)]/80">{r.packageName}</td>
                            <td className="p-4 text-[var(--app-muted)] font-medium">{r.period}</td>
                            <td className="p-4 text-[var(--app-muted)] font-medium">{r.cycle}</td>
                            <td className="p-4">
                              <span className="block text-slate-700 font-semibold">{r.nextGenerate}</span>
                              <span className={`text-[10px] block mt-0.5 ${r.nextGenerateDesc === 'Hari ini' ? 'text-orange-400 font-bold' : 'text-green-500'}`}>
                                {r.nextGenerateDesc}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-[var(--app-text)]">{formatCurrency(r.total)}</td>
                            <td className="p-4">
                              <button
                                onClick={(e) => handleTogglePause(r.id, e)}
                                title="Klik untuk mengubah status aktif/jeda"
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition hover:opacity-80 ${
                                  r.status === 'Aktif' 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                    : r.status === 'Dijeda'
                                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {r.status}
                              </button>
                            </td>
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => handleOpenEditModal(r, e)}
                                  title="Edit Jadwal Recurring"
                                  className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={(e) => handleTogglePause(r.id, e)}
                                  title={r.status === 'Aktif' ? 'Jeda Jadwal Recurring' : 'Aktifkan Kembali'}
                                  className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
                                >
                                  {r.status === 'Aktif' ? <Pause size={13} /> : <Play size={13} />}
                                </button>
                                <button
                                  onClick={() => setActionModalItem(r)}
                                  title="Tindakan Tagihan Lainnya"
                                  className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
                                >
                                  <MoreVertical size={13} />
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
              <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  totalItems={filteredList.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Bottom Section: Jadwal Generate Berikutnya */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Jadwal Generate Berikutnya</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { title: 'Hari Ini', date: '22 Oktober 2026', count: 12, amount: 4250000, active: true },
                  { title: '2 Hari Lagi', date: '03 Juli 2026', count: 18, amount: 6750000 },
                  { title: '3 Hari Lagi', date: '04 Juli 2026', count: 15, amount: 4875000 },
                  { title: '7 Hari Lagi', date: '08 Juli 2026', count: 21, amount: 7125000 },
                  { title: '30 Hari Lagi', date: '31 Juli 2026', count: 10, amount: 3250000 },
                  { title: '> 30 Hari', date: '-', count: 10, amount: 2750000 }
                ].map((sched, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl flex flex-col justify-between gap-3 transition-colors ${
                      sched.active 
                        ? 'bg-amber-500/10 border-2 border-amber-500/40 text-amber-400' 
                        : 'bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-bg)]/30'
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider">{sched.title}</p>
                      <p className="text-[9px] text-[var(--app-muted)] font-medium mt-0.5">{sched.date}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--app-text)]">{sched.count} Invoice</p>
                      <p className="text-[10px] text-[var(--app-muted)] font-semibold mt-1">{formatCurrency(sched.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Ringkasan Berulang Donut Chart */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Berulang</h3>
              
              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                  
                  {/* Aktif: 64 / 86 = 74.4% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                    strokeDasharray={`${(64 / 86) * 100} ${100 - (64 / 86) * 100}`} 
                    strokeDashoffset="0" 
                  />

                  {/* Dijeda: 7 / 86 = 8.1% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                    strokeDasharray={`${(7 / 86) * 100} ${100 - (7 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (64 / 86) * 100}`} 
                  />

                  {/* Gagal: 3 / 86 = 3.5% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" 
                    strokeDasharray={`${(3 / 86) * 100} ${100 - (3 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (71 / 86) * 100}`} 
                  />

                  {/* Selesai: 12 / 86 = 14% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray={`${(12 / 86) * 100} ${100 - (12 / 86) * 100}`} 
                    strokeDashoffset={`${100 - (74 / 86) * 100}`} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black text-[var(--app-text)]">86</p>
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase">Total</p>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-[11px] text-[var(--app-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block"></span>
                    <span>Aktif</span>
                  </div>
                  <span className="font-semibold text-white">64 (74.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#f97316] inline-block"></span>
                    <span>Dijeda</span>
                  </div>
                  <span className="font-semibold text-white">7 (8.1%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#ef4444] inline-block"></span>
                    <span>Gagal</span>
                  </div>
                  <span className="font-semibold text-white">3 (3.5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-[#3b82f6] inline-block"></span>
                    <span>Selesai</span>
                  </div>
                  <span className="font-semibold text-white">12 (14.0%)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Siklus Berulang */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Siklus Berulang</h3>
              
              <div className="space-y-3.5">
                {[
                  { name: 'Bulanan', count: 78, percentage: 90.7, color: 'bg-blue-600' },
                  { name: 'Mingguan', count: 3, percentage: 3.5, color: 'bg-purple-600' },
                  { name: 'Tahunan', count: 2, percentage: 2.3, color: 'bg-orange-600' },
                  { name: 'Kustom', count: 3, percentage: 3.5, color: 'bg-green-600' },
                ].map((item, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--app-text)]/80">{item.name}</span>
                        <span className="text-[10px] font-semibold text-[var(--app-muted)]">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`${item.color} h-full rounded-full transition-all duration-500`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Selanjutnya Generate */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Selanjutnya Generate</h3>
              
              <div className="space-y-2 text-xs font-semibold text-[var(--app-muted)]">
                <div className="flex justify-between items-center text-amber-500">
                  <span>Hari Ini</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>1 - 3 Hari</span>
                  <span className="text-white">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>4 - 7 Hari</span>
                  <span className="text-white">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>&gt; 7 Hari</span>
                  <span className="text-white">28</span>
                </div>
              </div>
            </div>

            {/* Card 4: Pengaturan Otomatis */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Pengaturan Otomatis</h3>
              
              <div className="space-y-3 text-[11px] font-semibold text-[var(--app-muted)]">
                {[
                  { name: 'Auto Generate', desc: 'Aktif' },
                  { name: 'Auto Send WA', desc: 'Aktif' },
                  { name: 'Auto Send Email', desc: 'Aktif' },
                  { name: 'Skip Jika Suspend', desc: 'Aktif' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal: Tambah Tagihan Berulang Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Tambah Tagihan Berulang</h3>
                    <p className="text-[10px] text-[var(--app-muted)]">Buat jadwal penerbitan invoice otomatis</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveAdd} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Nama Pelanggan</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData(p => ({ ...p, customerName: e.target.value }))}
                    placeholder="Contoh: Ahmad Fauzi"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">ID / No. Pelanggan</label>
                    <input
                      type="text"
                      value={formData.customerNo}
                      onChange={(e) => setFormData(p => ({ ...p, customerNo: e.target.value }))}
                      placeholder="CUST-0099"
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Paket Internet</label>
                    <select
                      value={formData.packageName}
                      onChange={(e) => setFormData(p => ({ ...p, packageName: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Home 20 Mbps">Home 20 Mbps</option>
                      <option value="Home 50 Mbps">Home 50 Mbps</option>
                      <option value="Home 100 Mbps">Home 100 Mbps</option>
                      <option value="Corporate 200 Mbps">Corporate 200 Mbps</option>
                      <option value="Corporate 500 Mbps">Corporate 500 Mbps</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Siklus Penagihan</label>
                    <select
                      value={formData.cycle}
                      onChange={(e) => setFormData(p => ({ ...p, cycle: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Bulanan">Bulanan</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Tahunan">Tahunan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Total Tagihan (Rp)</label>
                    <input
                      type="number"
                      required
                      value={formData.total}
                      onChange={(e) => setFormData(p => ({ ...p, total: Number(e.target.value) }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Tanggal Terbit Pertama</label>
                    <input
                      type="date"
                      value={formData.nextGenerate}
                      onChange={(e) => setFormData(p => ({ ...p, nextGenerate: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Status Awal</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Dijeda">Dijeda</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Tagihan Berulang */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Edit2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Edit Tagihan Berulang</h3>
                    <p className="text-[10px] text-[var(--app-muted)] font-mono">{editingItem.code}</p>
                  </div>
                </div>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Nama Pelanggan</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Paket</label>
                    <select
                      value={formData.packageName}
                      onChange={(e) => setFormData(p => ({ ...p, packageName: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Home 20 Mbps">Home 20 Mbps</option>
                      <option value="Home 50 Mbps">Home 50 Mbps</option>
                      <option value="Home 100 Mbps">Home 100 Mbps</option>
                      <option value="Corporate 200 Mbps">Corporate 200 Mbps</option>
                      <option value="Corporate 500 Mbps">Corporate 500 Mbps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Total Tagihan (Rp)</label>
                    <input
                      type="number"
                      required
                      value={formData.total}
                      onChange={(e) => setFormData(p => ({ ...p, total: Number(e.target.value) }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Siklus Penagihan</label>
                    <select
                      value={formData.cycle}
                      onChange={(e) => setFormData(p => ({ ...p, cycle: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Bulanan">Bulanan</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Tahunan">Tahunan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Dijeda">Dijeda</option>
                      <option value="Gagal">Gagal</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl border border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Opsi Tindakan Lanjutan */}
        {actionModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Tindakan Recurring</h3>
                <button onClick={() => setActionModalItem(null)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={15} />
                </button>
              </div>

              <div className="text-xs text-[var(--app-muted)] space-y-1">
                <p>Pelanggan: <span className="text-[var(--app-text)] font-semibold">{actionModalItem.customerName}</span></p>
                <p>Paket: <span className="text-[var(--app-text)] font-semibold">{actionModalItem.packageName}</span></p>
                <p>Nominal: <span className="text-green-400 font-bold">{formatCurrency(actionModalItem.total)}</span></p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleGenerateNow(actionModalItem)}
                  className="w-full text-left p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-xs font-semibold text-blue-400 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2"><Zap size={14} className="text-blue-500" /> Terbitkan Invoice Sekarang</span>
                  <span className="text-[10px] text-blue-400">&rarr;</span>
                </button>

                <button
                  onClick={() => {
                    handleTogglePause(actionModalItem.id);
                    setActionModalItem(null);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-xs font-semibold text-[var(--app-text)] flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    {actionModalItem.status === 'Aktif' ? <Pause size={14} className="text-orange-500" /> : <Play size={14} className="text-green-500" />}
                    {actionModalItem.status === 'Aktif' ? 'Jeda Jadwal Recurring' : 'Aktifkan Kembali'}
                  </span>
                  <span className="text-[10px] text-[var(--app-muted)]">&rarr;</span>
                </button>

                <button
                  onClick={() => handleDeleteRecurring(actionModalItem.id)}
                  className="w-full text-left p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2"><Trash2 size={14} className="text-red-400" /> Hapus Jadwal Recurring</span>
                  <span className="text-[10px] text-red-400">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
