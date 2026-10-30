import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/Pagination';
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Smartphone,
  CreditCard,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  Info,
  Edit2,
  X,
  Check
} from 'lucide-react';

interface MethodRow {
  id: string;
  name: string;
  subName: string;
  channel: string;
  type: string;
  adminFee: number;
  minPayment: number;
  status: 'Aktif' | 'Non Aktif';
}

const mockMethods: MethodRow[] = [
  { id: '1', name: 'Transfer Bank - BCA', subName: 'Bank Central Asia', channel: 'Transfer Bank', type: 'Otomatis', adminFee: 0, minPayment: 10000, status: 'Aktif' },
  { id: '2', name: 'Transfer Bank - Mandiri', subName: 'Bank Mandiri', channel: 'Transfer Bank', type: 'Otomatis', adminFee: 0, minPayment: 10000, status: 'Aktif' },
  { id: '3', name: 'QRIS', subName: 'QR Code Standar Indonesia', channel: 'QRIS', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '4', name: 'E-Wallet - OVO', subName: 'OVO Payment', channel: 'E-Wallet', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '5', name: 'E-Wallet - DANA', subName: 'DANA Payment', channel: 'E-Wallet', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '6', name: 'Virtual Account - BCA', subName: 'BCA Virtual Account', channel: 'Virtual Account', type: 'Otomatis', adminFee: 2500, minPayment: 10000, status: 'Aktif' },
  { id: '7', name: 'ShopeePay', subName: 'ShopeePay Payment', channel: 'E-Wallet', type: 'Otomatis', adminFee: 0, minPayment: 5000, status: 'Aktif' },
  { id: '8', name: 'Alfamart / Indomaret', subName: 'Retail Payment', channel: 'Retail', type: 'Manual', adminFee: 2000, minPayment: 20000, status: 'Non Aktif' }
];

export default function PaymentMethodsPage() {
  const { toast } = useToast();
  const [methods, setMethods] = useState<MethodRow[]>(mockMethods);
  const [selectedMethodId, setSelectedMethodId] = useState('1');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [channelFilter, setChannelFilter] = useState('Semua Channel');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<MethodRow | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<MethodRow | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subName: '',
    channel: 'Transfer Bank',
    type: 'Otomatis',
    adminFee: 0,
    minPayment: 10000,
    status: 'Aktif' as 'Aktif' | 'Non Aktif'
  });

  const [channelSwitches, setChannelSwitches] = useState({
    active: true,
    showInInvoice: true,
    autoVerify: true,
    autoNotify: true
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filtered list
  const filteredMethods = useMemo(() => {
    return methods.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.channel.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'Semua Status' || item.status === statusFilter;
      const matchChannel = channelFilter === 'Semua Channel' || item.channel === channelFilter;

      return matchSearch && matchStatus && matchChannel;
    });
  }, [methods, searchQuery, statusFilter, channelFilter]);

  const totalPages = Math.ceil(filteredMethods.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedMethods = filteredMethods.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const selectedMethod = methods.find(m => m.id === selectedMethodId) || methods[0] || mockMethods[0];

  // Actions
  const handleToggleStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMethods(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'Aktif' ? 'Non Aktif' : 'Aktif';
        toast.success(`Kanal pembayaran "${m.name}" kini ${nextStatus}.`);
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      subName: '',
      channel: 'Transfer Bank',
      type: 'Otomatis',
      adminFee: 0,
      minPayment: 10000,
      status: 'Aktif'
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Nama metode pembayaran wajib diisi.');
      return;
    }
    const newMethod: MethodRow = {
      id: `method-${Date.now()}`,
      name: formData.name,
      subName: formData.subName || formData.name,
      channel: formData.channel,
      type: formData.type,
      adminFee: Number(formData.adminFee) || 0,
      minPayment: Number(formData.minPayment) || 0,
      status: formData.status
    };
    setMethods(prev => [newMethod, ...prev]);
    setSelectedMethodId(newMethod.id);
    setShowAddModal(false);
    toast.success(`Kanal ${newMethod.name} berhasil ditambahkan!`);
  };

  const handleOpenEditModal = (method: MethodRow, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingMethod(method);
    setFormData({
      name: method.name,
      subName: method.subName,
      channel: method.channel,
      type: method.type,
      adminFee: method.adminFee,
      minPayment: method.minPayment,
      status: method.status
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;
    setMethods(prev => prev.map(m => {
      if (m.id === editingMethod.id) {
        return {
          ...m,
          name: formData.name,
          subName: formData.subName,
          channel: formData.channel,
          type: formData.type,
          adminFee: Number(formData.adminFee) || 0,
          minPayment: Number(formData.minPayment) || 0,
          status: formData.status
        };
      }
      return m;
    }));
    toast.success(`Konfigurasi kanal "${formData.name}" berhasil diperbarui.`);
    setEditingMethod(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/payment" className="hover:text-[var(--app-text)]">Kasir & Pembayaran</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Metode Pembayaran</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Kanal Pembayaran & Gateway Aktif
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Manajemen akun merchant QRIS, Virtual Account BCA/Mandiri/BRI, E-Wallet (OVO/DANA/GoPay), dan loket tunai.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/payment/settings" className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg">Konfigurasi Gateway</Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total Metode */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Metode</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">8</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua metode</p>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">7</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">87.5% dari total</p>
            </div>
          </div>

          {/* Card 3: Non Aktif */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">1</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">12.5% dari total</p>
            </div>
          </div>

          {/* Card 4: Channel Tersedia */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Channel Tersedia</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">5</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Transfer, QRIS, E-Wallet, VA, dll</p>
            </div>
          </div>

          {/* Card 5: Transaksi Hari Ini */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Transaksi Hari Ini</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">156</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Total transaksi</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Bottom Widgets */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
              
              {/* Header inside */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Daftar Metode Pembayaran</h3>
                
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Cari metode pembayaran..."
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-3 py-2 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[120px]"
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>

                  <select
                    value={channelFilter}
                    onChange={(e) => { setChannelFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)]/80 focus:outline-none min-w-[120px]"
                  >
                    <option value="Semua Channel">Semua Channel</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Virtual Account">Virtual Account</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Retail">Retail</option>
                  </select>

                  <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all sm:ml-auto">
                    <Plus size={14} />
                    <span>Tambah Metode</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4">NAMA METODE</th>
                      <th className="p-4">CHANNEL</th>
                      <th className="p-4">TIPE</th>
                      <th className="p-4">BIAYA ADMIN</th>
                      <th className="p-4">MIN. PEMBAYARAN</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {paginatedMethods.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-xs text-[var(--app-muted)]">
                          Tidak ditemukan metode pembayaran yang sesuai filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedMethods.map((d, idx) => {
                        const isSelected = selectedMethodId === d.id;
                        return (
                          <tr 
                            key={d.id} 
                            onClick={() => setSelectedMethodId(d.id)}
                            className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${
                              isSelected ? 'bg-[#0052cc]/5 border-l-2 border-l-blue-500' : ''
                            }`}
                          >
                            <td className="p-4 text-[var(--app-muted)] font-medium">{(safeCurrentPage - 1) * pageSize + idx + 1}</td>
                            <td className="p-4 font-bold text-[var(--app-text)]">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded bg-[var(--app-card)] flex items-center justify-center text-[9px] font-black text-blue-500 border border-[var(--app-border)] overflow-hidden">
                                  {d.name.split(' ')[0][0]}{d.name.split(' ').pop()?.[0]}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[var(--app-text)] leading-tight font-semibold">{d.name}</p>
                                  <p className="text-[9px] text-[var(--app-muted)] font-medium">{d.subName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-[var(--app-text)]/80">
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                {d.channel}
                              </span>
                            </td>
                            <td className="p-4 text-[var(--app-muted)] font-medium">{d.type}</td>
                            <td className="p-4 text-[var(--app-muted)] font-medium">{formatCurrency(d.adminFee)}</td>
                            <td className="p-4 text-[var(--app-muted)] font-medium">{formatCurrency(d.minPayment)}</td>
                            <td className="p-4">
                              <button
                                onClick={(e) => handleToggleStatus(d.id, e)}
                                title="Klik untuk mengubah status"
                                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition hover:opacity-80 ${
                                  d.status === 'Aktif' 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {d.status}
                              </button>
                            </td>
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => handleOpenEditModal(d, e)}
                                  title="Edit Konfigurasi"
                                  className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => setDetailModalItem(d)}
                                  title="Lihat Detail Channel"
                                  className="p-1.5 hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={(e) => handleToggleStatus(d.id, e)}
                                  title={d.status === 'Aktif' ? 'Nonaktifkan Kanal' : 'Aktifkan Kanal'}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    d.status === 'Aktif'
                                      ? 'hover:bg-red-500/10 text-[var(--app-muted)] hover:text-red-400'
                                      : 'hover:bg-green-500/10 text-[var(--app-muted)] hover:text-green-400'
                                  }`}
                                >
                                  {d.status === 'Aktif' ? <XCircle size={13} /> : <CheckCircle size={13} />}
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
                  totalItems={filteredMethods.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Statistik Metode Pembayaran Donut */}
              <div className="md:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Statistik Metode Pembayaran</h4>
                  
                  <div className="relative flex justify-center py-4 scale-95">
                    <svg width="100" height="100" viewBox="0 0 42 42" className="transform -rotate-90">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#101935" strokeWidth="4.5" />
                      
                      {/* Transfer Bank: 41.7% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                        strokeDasharray="41.7 58.3" 
                        strokeDashoffset="0" 
                      />

                      {/* QRIS: 24.4% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" 
                        strokeDasharray="24.4 75.6" 
                        strokeDashoffset="-41.7" 
                      />

                      {/* E-Wallet: 20.5% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#eab308" strokeWidth="4.5" 
                        strokeDasharray="20.5 79.5" 
                        strokeDashoffset="-66.1" 
                      />

                      {/* VA: 9.6% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                        strokeDasharray="9.6 90.4" 
                        strokeDashoffset="-86.6" 
                      />

                      {/* Retail: 3.8% */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.5" 
                        strokeDasharray="3.8 96.2" 
                        strokeDashoffset="-96.2" 
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-[7px] text-[var(--app-muted)] font-bold uppercase">Total Transaksi</p>
                      <p className="text-base font-black text-[var(--app-text)] leading-none">156</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px] text-[var(--app-muted)] font-semibold mt-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-blue-500" />Transfer Bank</span>
                      <span className="text-white">65 (41.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-orange-500" />QRIS</span>
                      <span className="text-white">38 (24.4%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-yellow-500" />E-Wallet</span>
                      <span className="text-white">32 (20.5%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-green-500" />Virtual Account</span>
                      <span className="text-white">15 (9.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded bg-purple-500" />Retail</span>
                      <span className="text-white">6 (3.8%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panduan Konfigurasi */}
              <div className="md:col-span-7 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Panduan Konfigurasi</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-[10px] font-bold text-[var(--app-muted)]">
                    {[
                      { step: 1, title: 'Tambah Metode', desc: 'Klik tombol "Tambah Metode" untuk menambahkan metode pembayaran baru.' },
                      { step: 2, title: 'Konfigurasi Detail', desc: 'Isi detail metode, biaya admin, dan informasi rekening atau API yang diperlukan.' },
                      { step: 3, title: 'Atur Status & Channel', desc: 'Aktifkan metode dan pilih channel yang sesuai untuk metode pembayaran.' },
                      { step: 4, title: 'Uji Coba', desc: 'Lakukan uji coba untuk memastikan metode pembayaran berfungsi dengan baik.' }
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--app-bg)] border border-[var(--app-border)] text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                          {item.step}
                        </span>
                        <div>
                          <p className="text-[var(--app-text)] font-bold leading-tight">{item.title}</p>
                          <p className="text-[9px] text-[var(--app-muted)] font-medium leading-relaxed mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[var(--app-border)]/60 pt-3 mt-4 text-left">
                  <button onClick={() => window.open('/dokumentasi', '_blank')} className="text-blue-500 font-bold hover:underline text-xs">
                    Lihat Dokumentasi Lengkap &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Detail Pane */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Detail Metode Pembayaran */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-5">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)] font-sans">Detail Metode Pembayaran</h3>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  selectedMethod.status === 'Aktif'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {selectedMethod.status}
                </span>
              </div>

              {/* Logo & Bank */}
              <div className="flex items-center gap-3 bg-[var(--app-bg)] border border-[var(--app-border)] p-3 rounded-xl">
                <div className="w-12 h-12 bg-[var(--app-card)] rounded-lg flex items-center justify-center text-blue-500 font-black text-xs border border-[var(--app-border)] overflow-hidden">
                  {selectedMethod.name.split(' ')[0][0]}{selectedMethod.name.split(' ').pop()?.[0]}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[var(--app-text)] leading-tight">{selectedMethod.name}</p>
                  <p className="text-[9px] text-[var(--app-muted)] font-semibold">{selectedMethod.subName}</p>
                </div>
              </div>

              {/* Detail fields */}
              <div className="text-[11px] text-[var(--app-muted)] font-semibold space-y-3 border-b border-[var(--app-border)] pb-4">
                <div className="flex justify-between">
                  <span>Channel</span>
                  <span className="text-[var(--app-text)]">{selectedMethod.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe</span>
                  <span className="text-[var(--app-text)]">{selectedMethod.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin</span>
                  <span className="text-[var(--app-text)]">{formatCurrency(selectedMethod.adminFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Pembayaran</span>
                  <span className="text-[var(--app-text)]">{formatCurrency(selectedMethod.minPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu Proses</span>
                  <span className="text-green-400">Real-time / Instant</span>
                </div>
                <div className="space-y-1">
                  <span>Deskripsi Kanal</span>
                  <p className="text-[var(--app-text)] text-[10px] leading-relaxed font-normal">
                    Penerimaan otomatis pembayaran tagihan internet pelanggan melalui {selectedMethod.name}.
                  </p>
                </div>
              </div>

              {/* Pengaturan Channel */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] font-bold text-[var(--app-text)] uppercase tracking-wider">Pengaturan Integrasi</h4>
                
                <div className="space-y-3 text-[11px] font-semibold text-[var(--app-muted)]">
                  <div className="flex items-center justify-between">
                    <span>Aktifkan kanal ini</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={selectedMethod.status === 'Aktif'} onChange={() => handleToggleStatus(selectedMethod.id)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tampilkan di invoice</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={channelSwitches.showInInvoice} onChange={() => setChannelSwitches(p => ({ ...p, showInInvoice: !p.showInInvoice }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Verifikasi callback otomatis</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={channelSwitches.autoVerify} onChange={() => setChannelSwitches(p => ({ ...p, autoVerify: !p.autoVerify }))} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[var(--app-bg)] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--app-card)] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => handleOpenEditModal(selectedMethod)}
                  className="flex items-center justify-center gap-1.5 bg-[#0052cc] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  <Edit2 size={13} />
                  <span>Edit Metode</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedMethod.id)}
                  className={`flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 rounded-xl transition-all ${
                    selectedMethod.status === 'Aktif'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedMethod.status === 'Aktif' ? (
                    <>
                      <XCircle size={13} />
                      <span>Non Aktifkan</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={13} />
                      <span>Aktifkan</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Modal: Tambah Metode Pembayaran Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Tambah Kanal Pembayaran</h3>
                    <p className="text-[10px] text-[var(--app-muted)]">Integrasi kanal baru untuk kasir & invoice</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveAdd} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Nama Kanal</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Contoh: Virtual Account BRI / GoPay"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Keterangan / Sub Nama</label>
                  <input
                    type="text"
                    value={formData.subName}
                    onChange={(e) => setFormData(p => ({ ...p, subName: e.target.value }))}
                    placeholder="Contoh: BRI Virtual Account Online"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Channel</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData(p => ({ ...p, channel: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Virtual Account">Virtual Account</option>
                      <option value="E-Wallet">E-Wallet</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Tipe Verifikasi</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Otomatis">Otomatis</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Biaya Admin (Rp)</label>
                    <input
                      type="number"
                      value={formData.adminFee}
                      onChange={(e) => setFormData(p => ({ ...p, adminFee: Number(e.target.value) }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Min. Bayar (Rp)</label>
                    <input
                      type="number"
                      value={formData.minPayment}
                      onChange={(e) => setFormData(p => ({ ...p, minPayment: Number(e.target.value) }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Status Awal</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>
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
                    Simpan Kanal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Metode Pembayaran */}
        {editingMethod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Edit2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Edit Konfigurasi Kanal</h3>
                    <p className="text-[10px] text-[var(--app-muted)]">{editingMethod.name}</p>
                  </div>
                </div>
                <button onClick={() => setEditingMethod(null)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Nama Kanal</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Keterangan / Sub Nama</label>
                  <input
                    type="text"
                    value={formData.subName}
                    onChange={(e) => setFormData(p => ({ ...p, subName: e.target.value }))}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Channel</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData(p => ({ ...p, channel: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Virtual Account">Virtual Account</option>
                      <option value="E-Wallet">E-Wallet</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Tipe Verifikasi</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="Otomatis">Otomatis</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Biaya Admin (Rp)</label>
                    <input
                      type="number"
                      value={formData.adminFee}
                      onChange={(e) => setFormData(p => ({ ...p, adminFee: Number(e.target.value) }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--app-text)] mb-1">Min. Bayar (Rp)</label>
                    <input
                      type="number"
                      value={formData.minPayment}
                      onChange={(e) => setFormData(p => ({ ...p, minPayment: Number(e.target.value) }))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setEditingMethod(null)}
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

        {/* Modal: Detail Channel */}
        {detailModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Eye size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Rincian Kanal</h3>
                </div>
                <button onClick={() => setDetailModalItem(null)} className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-muted)] font-medium">Metode</span>
                  <span className="font-bold text-[var(--app-text)]">{detailModalItem.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Channel</span>
                  <span className="text-blue-400 font-semibold">{detailModalItem.channel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Tipe</span>
                  <span className="text-[var(--app-text)]">{detailModalItem.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Biaya Admin</span>
                  <span className="text-[var(--app-text)] font-mono">{formatCurrency(detailModalItem.adminFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--app-muted)] font-medium">Min. Pembayaran</span>
                  <span className="text-[var(--app-text)] font-mono">{formatCurrency(detailModalItem.minPayment)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--app-border)]">
                  <span className="text-[var(--app-muted)] font-medium">Status Operasional</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    detailModalItem.status === 'Aktif'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {detailModalItem.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDetailModalItem(null)}
                className="w-full py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-xs font-semibold rounded-xl text-[var(--app-text)] transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
