import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
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
  Users,
  MessageSquare,
  Send,
  Sliders,
  HelpCircle,
  Edit2,
  PlusCircle,
  Copy,
  ChevronDown,
  LayoutGrid,
  List,
  Star,
  StarOff,
  Trash2,
  Tag,
  FolderMinus,
  Check,
  X
} from 'lucide-react';

interface LabelItem {
  id: string;
  name: string;
  desc: string;
  color: string;
  category: 'Pelanggan' | 'Transaksi' | 'Layanan' | 'Marketing' | 'Partner';
  contactCount: number;
  lastUsed: string;
  createdBy: string;
  status: 'Aktif' | 'Non Aktif';
}

const initialLabels: LabelItem[] = [
  { id: '1', name: 'Pelanggan VIP', desc: 'Pelanggan prioritas utama SLA 99.9%', color: '#6366F1', category: 'Pelanggan', contactCount: 48, lastUsed: '26/10/2026 08:32', createdBy: 'Agus Dwi Rianto', status: 'Aktif' },
  { id: '2', name: 'Pelanggan Baru', desc: 'Pelanggan aktif baru aktivasi bulan ini', color: '#10B981', category: 'Pelanggan', contactCount: 125, lastUsed: '26/10/2026 07:45', createdBy: 'Rina Marlina', status: 'Aktif' },
  { id: '3', name: 'Menunggu Pembayaran', desc: 'Belum melakukan pembayaran invoice aktif', color: '#F59E0B', category: 'Transaksi', contactCount: 64, lastUsed: '25/10/2026 21:15', createdBy: 'Rina Marlina', status: 'Aktif' },
  { id: '4', name: 'Pembayaran Lunas', desc: 'Invoice lunas tepat waktu bulan ini', color: '#10B981', category: 'Transaksi', contactCount: 312, lastUsed: '25/10/2026 19:30', createdBy: 'Agus Dwi Rianto', status: 'Aktif' },
  { id: '5', name: 'Menunggu Konfirmasi', desc: 'Bukti transfer diunggah menunggu approval admin', color: '#8B5CF6', category: 'Layanan', contactCount: 18, lastUsed: '24/10/2026 16:20', createdBy: 'Indah Permata', status: 'Aktif' },
  { id: '6', name: 'Komplain & Gangguan', desc: 'Tiket komplain jaringan lambat / red LOS', color: '#EF4444', category: 'Layanan', contactCount: 7, lastUsed: '24/10/2026 10:10', createdBy: 'Indah Permata', status: 'Aktif' },
  { id: '7', name: 'Follow Up Prospek', desc: 'Calon pelanggan survei ODP & FAT', color: '#06B6D4', category: 'Marketing', contactCount: 42, lastUsed: '23/10/2026 14:00', createdBy: 'Agus Dwi Rianto', status: 'Aktif' },
  { id: '8', name: 'Mitra Reseller & RTRW', desc: 'Sub-distributor voucher hotspot & bandwith', color: '#EC4899', category: 'Partner', contactCount: 15, lastUsed: '22/10/2026 11:20', createdBy: 'WhatsApp Gateway', status: 'Aktif' },
  { id: '9', name: 'Grace Period / Isolir', desc: 'Layanan ditangguhkan sementara karena nunggak', color: '#6B7280', category: 'Layanan', contactCount: 23, lastUsed: '21/10/2026 09:15', createdBy: 'Mikrotik Sync', status: 'Non Aktif' },
  { id: '10', name: 'Blacklist', desc: 'Dilarang registrasi ulang / penagihan macet', color: '#374151', category: 'Layanan', contactCount: 4, lastUsed: '20/10/2026 16:45', createdBy: 'Agus Dwi Rianto', status: 'Aktif' }
];

export default function WhatsappLabelPage() {
  const [labels, setLabels] = useState<LabelItem[]>(initialLabels);
  const [selectedLabelId, setSelectedLabelId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [categoryFilter, setCategoryFilter] = useState('Semua Jenis');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [targetLabel, setTargetLabel] = useState<LabelItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    color: '#3B82F6',
    category: 'Pelanggan' as LabelItem['category'],
    status: 'Aktif' as LabelItem['status']
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.pelanggan.getAll();
      if (res && res.data) {
        setCustomers(res.data);
      }
    } catch (e) {
      console.error('Error fetching customers:', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter labels
  const filteredLabels = labels.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua Status' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'Semua Jenis' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredLabels.length / pageSize) || 1;
  const paginatedLabels = filteredLabels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const selectedLabel = labels.find(l => l.id === selectedLabelId) || labels[0];

  // Handlers
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      desc: '',
      color: '#3B82F6',
      category: 'Pelanggan',
      status: 'Aktif'
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newLabel: LabelItem = {
      id: Date.now().toString(),
      name: formData.name,
      desc: formData.desc || '-',
      color: formData.color,
      category: formData.category,
      contactCount: 0,
      lastUsed: 'Baru saja',
      createdBy: 'Agus Dwi Rianto',
      status: formData.status
    };

    setLabels([newLabel, ...labels]);
    setSelectedLabelId(newLabel.id);
    setIsCreateOpen(false);
    showToast(`Label "${newLabel.name}" berhasil dibuat!`);
  };

  const handleOpenEdit = (item: LabelItem) => {
    setTargetLabel(item);
    setFormData({
      name: item.name,
      desc: item.desc,
      color: item.color,
      category: item.category,
      status: item.status
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLabel || !formData.name.trim()) return;

    setLabels(labels.map(l => l.id === targetLabel.id ? {
      ...l,
      name: formData.name,
      desc: formData.desc,
      color: formData.color,
      category: formData.category,
      status: formData.status
    } : l));

    setIsEditOpen(false);
    showToast(`Label "${formData.name}" berhasil diperbarui!`);
  };

  const handleDuplicate = (item: LabelItem) => {
    const copyItem: LabelItem = {
      ...item,
      id: Date.now().toString(),
      name: `${item.name} (Salinan)`,
      contactCount: 0,
      lastUsed: 'Baru saja',
      createdBy: 'Agus Dwi Rianto'
    };
    setLabels([copyItem, ...labels]);
    setSelectedLabelId(copyItem.id);
    showToast(`Label "${item.name}" berhasil diduplikasi!`);
  };

  const handleToggleStatus = (item: LabelItem) => {
    const newStatus = item.status === 'Aktif' ? 'Non Aktif' : 'Aktif';
    setLabels(labels.map(l => l.id === item.id ? { ...l, status: newStatus } : l));
    showToast(`Status label "${item.name}" diubah menjadi ${newStatus}!`);
  };

  const handleOpenDelete = (item: LabelItem) => {
    setTargetLabel(item);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!targetLabel) return;
    const remaining = labels.filter(l => l.id !== targetLabel.id);
    setLabels(remaining);
    if (selectedLabelId === targetLabel.id && remaining.length > 0) {
      setSelectedLabelId(remaining[0].id);
    }
    setIsDeleteOpen(false);
    showToast(`Label "${targetLabel.name}" berhasil dihapus.`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Label', 'Deskripsi', 'Warna', 'Kategori', 'Jumlah Kontak', 'Status', 'Terakhir Digunakan'];
    const rows = filteredLabels.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.desc.replace(/"/g, '""')}"`,
      l.color,
      l.category,
      l.contactCount,
      l.status,
      l.lastUsed
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `whatsapp_labels_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data label berhasil diekspor ke CSV.');
  };

  // KPIs
  const totalLabelsCount = labels.length;
  const activeLabelsCount = labels.filter(l => l.status === 'Aktif').length;
  const inactiveLabelsCount = labels.filter(l => l.status === 'Non Aktif').length;
  const totalContactsCount = labels.reduce((acc, l) => acc + l.contactCount, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-blue-650 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400">
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
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Label & Segmentasi</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Manajemen Label & Segmentasi Kontak WhatsApp
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengelompokan kontak berdasarkan kategori (VIP Korporat, Isolir Menunggak, Gangguan Massal, Prospek Baru).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/whatsapp/contacts" className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/30 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-xl transition-all">
              Buku Kontak
            </Link>
            <Link href="/whatsapp/chat" className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md">
              Live Chat CS
            </Link>
          </div>
        </div>

        {/* ─── Description & Global Action Buttons ───────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[var(--app-text)] leading-none">Daftar Tag & Label</p>
            <p className="text-[10px] text-[var(--app-muted)] font-semibold mt-1">
              Kelola tag untuk memfilter kontak penerima blast, routing chat, dan automasi penagihan.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all border-none"
            >
              <PlusCircle size={15} />
              <span>Buat Label Baru</span>
            </button>
            <button 
              onClick={() => setIsImportOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Import Label</span>
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
              title="Ekspor CSV"
            >
              <FileText size={14} className="text-green-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Label</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">{totalLabelsCount}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua label</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Label Aktif</p>
              <p className="text-2xl font-black text-green-500 mt-0.5">{activeLabelsCount}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">
                {totalLabelsCount ? Math.round((activeLabelsCount / totalLabelsCount) * 100) : 0}% dari total
              </p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-2xl font-black text-red-500 mt-0.5">{inactiveLabelsCount}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Diarsipkan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Kontak</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">{totalContactsCount}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Tersinkronisasi</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <Sliders size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Multi Label</p>
              <p className="text-2xl font-black text-purple-500 mt-0.5">85</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Segmentasi ganda</p>
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
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari label atau deskripsi..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <select 
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[130px]"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>

            <select 
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[130px]"
            >
              <option value="Semua Jenis">Semua Jenis</option>
              <option value="Pelanggan">Pelanggan</option>
              <option value="Transaksi">Transaksi</option>
              <option value="Layanan">Layanan</option>
              <option value="Marketing">Marketing</option>
              <option value="Partner">Partner</option>
            </select>

            {(searchQuery || statusFilter !== 'Semua Status' || categoryFilter !== 'Semua Jenis') && (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('Semua Status'); setCategoryFilter('Semua Jenis'); }}
                className="text-xs text-red-500 hover:underline font-semibold px-2 py-1"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-1 gap-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'}`}
                title="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'}`}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: List & Bottom visual widgets (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Table / Grid Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]">
                    <thead>
                      <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                        <th className="p-3.5">NAMA LABEL</th>
                        <th className="p-3.5 w-16 text-center">WARNA</th>
                        <th className="p-3.5 w-24 text-center">JENIS</th>
                        <th className="p-3.5 w-20 text-center">KONTAK</th>
                        <th className="p-3.5">TERAKHIR PAKAI</th>
                        <th className="p-3.5 w-20 text-center">STATUS</th>
                        <th className="p-3.5 text-center w-28">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)]">
                      {paginatedLabels.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[var(--app-muted)]">
                            Tidak ada label yang sesuai kriteria pencarian.
                          </td>
                        </tr>
                      ) : (
                        paginatedLabels.map(item => {
                          const isSelected = selectedLabelId === item.id;
                          return (
                            <tr 
                              key={item.id} 
                              onClick={() => setSelectedLabelId(item.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-600/10 hover:bg-blue-600/15' : 'hover:bg-[var(--app-border)]/20'
                              }`}
                            >
                              <td className="p-3.5">
                                <div className="flex gap-2.5 items-center">
                                  <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: item.color + '15', color: item.color }}>
                                    <Tag size={14} />
                                  </div>
                                  <div className="space-y-0.5 min-w-0">
                                    <p className="font-bold text-[var(--app-text)] leading-tight truncate">{item.name}</p>
                                    <p className="text-[10px] text-[var(--app-muted)] truncate max-w-[180px]">{item.desc}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5 text-center">
                                <div className="flex justify-center">
                                  <span 
                                    className="w-5 h-5 rounded-md border border-[var(--app-border)] flex items-center justify-center shadow-xs" 
                                    style={{ backgroundColor: item.color }}
                                    title={item.color}
                                  />
                                </div>
                              </td>
                              <td className="p-3.5 text-center font-medium text-[var(--app-muted)] text-[11px]">{item.category}</td>
                              <td className="p-3.5 text-center font-bold text-[var(--app-text)]">{item.contactCount}</td>
                              <td className="p-3.5 font-medium text-[11px] text-[var(--app-muted)] whitespace-nowrap">{item.lastUsed}</td>
                              <td className="p-3.5 text-center">
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                  item.status === 'Aktif' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-3.5" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1">
                                  <button 
                                    onClick={() => handleOpenEdit(item)}
                                    title="Edit Label"
                                    className="p-1.5 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-blue-500 transition-colors"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleDuplicate(item)}
                                    title="Duplikat Label"
                                    className="p-1.5 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-green-500 transition-colors"
                                  >
                                    <Copy size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleOpenDelete(item)}
                                    title="Hapus Label"
                                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                                  >
                                    <Trash2 size={13} />
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
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                  {paginatedLabels.map(item => {
                    const isSelected = selectedLabelId === item.id;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedLabelId(item.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-500/5 shadow-md' : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:border-blue-400/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <h4 className="font-bold text-xs text-[var(--app-text)]">{item.name}</h4>
                          </div>
                          <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${
                            item.status === 'Aktif' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--app-muted)] mt-1 line-clamp-2">{item.desc}</p>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-[var(--app-border)] text-[9px] text-[var(--app-muted)]">
                          <span>{item.category} • {item.contactCount} Kontak</span>
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleOpenEdit(item)} className="p-1 hover:text-blue-500"><Edit2 size={12} /></button>
                            <button onClick={() => handleDuplicate(item)} className="p-1 hover:text-green-500"><Copy size={12} /></button>
                            <button onClick={() => handleOpenDelete(item)} className="p-1 hover:text-red-500"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-[var(--app-card)]">
                <span className="text-xs text-[var(--app-muted)]">
                  Menampilkan <span className="font-semibold text-[var(--app-text)]">{filteredLabels.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredLabels.length)}</span> dari <span className="font-semibold text-[var(--app-text)]">{filteredLabels.length}</span> label
                </span>
                
                <div className="flex items-center gap-4">
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

                  <select 
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none"
                  >
                    <option value={5}>5 / hal</option>
                    <option value={10}>10 / hal</option>
                    <option value={20}>20 / hal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom row widgets: Distribusi, Top 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Distribusi Label */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Distribusi Berdasarkan Jenis</h4>
                <div className="space-y-2 text-xs">
                  {['Pelanggan', 'Transaksi', 'Layanan', 'Marketing', 'Partner'].map(cat => {
                    const count = labels.filter(l => l.category === cat).length;
                    const pct = totalLabelsCount ? Math.round((count / totalLabelsCount) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span>{cat}</span>
                          <span className="text-[var(--app-text)]">{count} label ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top 5 Label Kontak Terbanyak */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Top Label Terbanyak</h4>
                <div className="space-y-2 text-xs">
                  {[...labels].sort((a, b) => b.contactCount - a.contactCount).slice(0, 5).map(l => (
                    <div key={l.id} className="flex items-center justify-between py-1 border-b border-[var(--app-border)]/40 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                        <span className="text-[11px] font-semibold text-[var(--app-text)]">{l.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-blue-500">{l.contactCount} kontak</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Detail Label Aktif & Aksi Cepat (5/12 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Detail Label Card (Connected to selectedLabel) */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Detail Label Terpilih</h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                  selectedLabel?.status === 'Aktif' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {selectedLabel?.status}
                </span>
              </div>

              {selectedLabel && (
                <div className="space-y-4 text-xs font-semibold text-[var(--app-muted)]">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl border shrink-0" style={{ backgroundColor: selectedLabel.color + '15', borderColor: selectedLabel.color + '30', color: selectedLabel.color }}>
                      <Tag size={20} />
                    </div>
                    <div>
                      <h4 className="text-[var(--app-text)] font-bold text-base leading-tight">{selectedLabel.name}</h4>
                      <p className="text-[10px] text-[var(--app-muted)] font-mono mt-0.5">ID: {selectedLabel.id}</p>
                    </div>
                  </div>

                  {/* Mini Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                      <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Total Kontak</p>
                      <p className="text-base font-black text-[var(--app-text)] mt-0.5">{selectedLabel.contactCount}</p>
                    </div>
                    <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                      <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Kategori</p>
                      <p className="text-xs font-black text-blue-500 mt-1 truncate">{selectedLabel.category}</p>
                    </div>
                    <div className="bg-[var(--app-bg)] border border-[var(--app-border)] p-2.5 rounded-xl">
                      <p className="text-[8px] text-[var(--app-muted)] font-bold uppercase">Status</p>
                      <p className={`text-xs font-black mt-1 ${selectedLabel.status === 'Aktif' ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedLabel.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-[11px] pt-1 border-t border-[var(--app-border)]/60">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-muted)] uppercase">Deskripsi</span>
                      <p className="text-[var(--app-text)] text-xs leading-relaxed font-normal bg-[var(--app-bg)] p-2.5 rounded-xl border border-[var(--app-border)]">
                        {selectedLabel.desc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[var(--app-border)]/40">
                      <span>Kode Hex Warna</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-[var(--app-border)]" style={{ backgroundColor: selectedLabel.color }} />
                        <span className="text-[var(--app-text)] font-mono font-bold">{selectedLabel.color}</span>
                      </div>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                      <span>Dibuat Oleh</span>
                      <span className="text-[var(--app-text)] font-semibold">{selectedLabel.createdBy}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Terakhir Digunakan</span>
                      <span className="text-[var(--app-text)] font-mono">{selectedLabel.lastUsed}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Aksi Cepat Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Cepat untuk "{selectedLabel?.name}"</h3>
              
              <div className="space-y-2 text-xs font-bold">
                <button 
                  onClick={() => selectedLabel && handleOpenEdit(selectedLabel)}
                  className="w-full flex items-center gap-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 p-3 rounded-xl transition-all"
                >
                  <Edit2 size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">Edit Properti Label</p>
                    <p className="text-[9px] opacity-80 font-normal">Ubah nama, warna, kategori, atau deskripsi</p>
                  </div>
                </button>

                <button 
                  onClick={() => selectedLabel && handleDuplicate(selectedLabel)}
                  className="w-full flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 p-3 rounded-xl transition-all"
                >
                  <Copy size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">Duplikasi Label</p>
                    <p className="text-[9px] opacity-80 font-normal">Gandakan aturan label untuk segmen baru</p>
                  </div>
                </button>

                <button 
                  onClick={() => selectedLabel && handleToggleStatus(selectedLabel)}
                  className="w-full flex items-center gap-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 p-3 rounded-xl transition-all"
                >
                  <FolderMinus size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">{selectedLabel?.status === 'Aktif' ? 'Nonaktifkan Label' : 'Aktifkan Kembali Label'}</p>
                    <p className="text-[9px] opacity-80 font-normal">Ganti status aktif / arsip pada WhatsApp blast</p>
                  </div>
                </button>

                <button 
                  onClick={() => selectedLabel && handleOpenDelete(selectedLabel)}
                  className="w-full flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-md transition-all border-none"
                >
                  <Trash2 size={16} />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-bold">Hapus Label Permanen</p>
                    <p className="text-[9px] text-red-200 font-normal">Lepas tag ini dari semua kontak terkait</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Kontak Sampel */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Kontak Terdaftar ({customers.length})</h3>
                <Link href="/whatsapp/contacts" className="text-[10px] text-blue-500 font-bold hover:underline">
                  Kelola Semua
                </Link>
              </div>

              <div className="space-y-2 mt-2">
                {customers.slice(0, 4).map(c => (
                  <div key={c.id} className="flex justify-between items-center py-1.5 border-b border-[var(--app-border)]/40 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                        {c.nama ? c.nama[0] : 'P'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text)] leading-tight">{c.nama}</p>
                        <p className="text-[10px] text-[var(--app-muted)] font-mono">{c.telepon || c.no_layanan || '-'}</p>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/20">
                      {c.paket?.nama || 'Aktif'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ─── MODAL: Buat Label Baru ────────────────────────────────────── */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <PlusCircle size={16} className="text-blue-500" />
                  Buat Label Baru
                </h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Nama Label *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Isolir Menunggak > 7 Hari"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Deskripsi</label>
                  <textarea 
                    rows={2}
                    placeholder="Keterangan tujuan penggunaan label ini..."
                    value={formData.desc}
                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    >
                      <option value="Pelanggan">Pelanggan</option>
                      <option value="Transaksi">Transaksi</option>
                      <option value="Layanan">Layanan</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Warna Label</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--app-border)] p-0.5 bg-[var(--app-bg)]"
                      />
                      <input 
                        type="text"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                        className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono uppercase text-center"
                      />
                    </div>
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
                    Simpan Label
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Label ─────────────────────────────────────────── */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Edit2 size={16} className="text-blue-500" />
                  Edit Properti Label
                </h3>
                <button onClick={() => setIsEditOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Nama Label *</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Deskripsi</label>
                  <textarea 
                    rows={2}
                    value={formData.desc}
                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    >
                      <option value="Pelanggan">Pelanggan</option>
                      <option value="Transaksi">Transaksi</option>
                      <option value="Layanan">Layanan</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Warna Label</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--app-border)] p-0.5 bg-[var(--app-bg)]"
                      />
                      <input 
                        type="text"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                        className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] font-mono uppercase text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non Aktif">Non Aktif</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                  <button 
                    type="button" 
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Hapus Label ────────────────────────────────────────── */}
        {isDeleteOpen && targetLabel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--app-text)]">Hapus Label Ini?</h3>
                <p className="text-xs text-[var(--app-muted)]">
                  Label <strong className="text-[var(--app-text)] font-semibold">"{targetLabel.name}"</strong> akan dihapus dan dilepaskan dari {targetLabel.contactCount} kontak terkait.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button 
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Import Label ───────────────────────────────────────── */}
        {isImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Download size={16} className="text-blue-500" />
                  Import Label dari File CSV
                </h3>
                <button onClick={() => setIsImportOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-[var(--app-muted)]">
                  Unggah file CSV dengan kolom: <code className="text-blue-400 font-mono">nama, deskripsi, warna, kategori</code>.
                </p>
                <div className="border-2 border-dashed border-[var(--app-border)] rounded-xl p-6 text-center hover:border-blue-500 cursor-pointer">
                  <FileText size={32} className="mx-auto text-[var(--app-muted)] mb-2" />
                  <p className="font-semibold text-[var(--app-text)]">Pilih file CSV atau drag & drop di sini</p>
                  <p className="text-[10px] text-[var(--app-muted)] mt-1">Maksimal 2MB (.csv)</p>
                  <input type="file" accept=".csv" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button 
                  onClick={() => setIsImportOpen(false)}
                  className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    setIsImportOpen(false);
                    showToast('Label contoh berhasil diimpor!');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Mulai Import
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
