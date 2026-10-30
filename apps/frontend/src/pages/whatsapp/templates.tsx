import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
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
  Trash2,
  Check,
  X,
  Upload
} from 'lucide-react';

interface TemplateItem {
  id: string;
  templateCode: string;
  name: string;
  varsText: string;
  content: string;
  category: 'Promosi' | 'Billing' | 'Transaksi' | 'Informasi' | 'Ucapan' | 'Survey';
  lang: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
  updatedAt: string;
  updatedBy: string;
  variables: string[];
}

const INITIAL_TEMPLATES: TemplateItem[] = [
  {
    id: '1',
    templateCode: 'promo_juli_20',
    name: 'Promo Juli Diskon 20%',
    varsText: 'Dapatkan diskon 20% untuk semua paket internet hanya di bulan Juli 2026!... Variabel: {{1}}, {{2}}, {{3}}',
    content: '📢 PROMO SPESIAL AUDIRA 📢\n\nHalo {{1}}, dapatkan diskon 20% untuk paket {{2}} hanya di bulan ini! Nikmati internet fiber ultra-cepat tanpa batas.\n\n📅 Promo berlaku sampai {{3}}.\n\nInfo lebih lanjut hubungi call center kami. Terima kasih! 🙏',
    category: 'Promosi',
    lang: 'Indonesia',
    status: 'Disetujui',
    updatedAt: '22/10/2026 08:32',
    updatedBy: 'Agus Dwi Rianto',
    variables: ['Nama Pelanggan', 'Nama Paket', 'Tanggal Kadaluarsa'],
  },
  {
    id: '2',
    templateCode: 'tagihan_jatuh_tempo',
    name: 'Tagihan Jatuh Tempo',
    varsText: 'Halo {{1}}, tagihan Anda sebesar Rp {{2}} akan jatuh tempo pada {{3}}... Variabel: {{1}}, {{2}}, {{3}}',
    content: '⚠️ PEMBERITAHUAN TAGIHAN AUDIRA ⚠️\n\nHalo Kak {{1}}, tagihan internet bulan ini sebesar Rp {{2}} telah memasuki tanggal jatuh tempo ({{3}}).\n\nMohon segera melakukan pembayaran via transfer bank atau scan QRIS resmi kami agar koneksi tetap lancar.\n\nTerima kasih atas kerja samanya! 🙏',
    category: 'Billing',
    lang: 'Indonesia',
    status: 'Disetujui',
    updatedAt: '22/10/2026 07:45',
    updatedBy: 'Agus Dwi Rianto',
    variables: ['Nama Pelanggan', 'Nominal Tagihan', 'Tanggal Jatuh Tempo'],
  },
  {
    id: '3',
    templateCode: 'pembayaran_berhasil',
    name: 'Pembayaran Berhasil & Kwitansi',
    varsText: 'Terima kasih {{1}}, pembayaran sebesar Rp {{2}} telah kami terima... Variabel: {{1}}, {{2}}',
    content: '✅ PEMBAYARAN DITERIMA ✅\n\nTerima kasih Kak {{1}}, pembayaran tagihan internet AUDIRA sebesar Rp {{2}} telah berhasil kami terima dan verifikasi sistem.\n\nLayanan internet Anda aktif dengan performa optimal. Kwitansi digital terlampir pada tautan berikut: {{3}}.\n\nSalam hangat dari Tim AUDIRA!',
    category: 'Transaksi',
    lang: 'Indonesia',
    status: 'Disetujui',
    updatedAt: '30/06/2026 21:15',
    updatedBy: 'Rina Marlina',
    variables: ['Nama Pelanggan', 'Nominal Pembayaran', 'Link Kwitansi'],
  },
  {
    id: '4',
    templateCode: 'aktivasi_paket_baru',
    name: 'Paket Baru Super Cepat',
    varsText: 'Selamat {{1}}, paket {{2}} Anda telah aktif. Nikmati kecepatan internet... Variabel: {{1}}, {{2}}, {{3}}',
    content: '🎉 SELAMAT BERGABUNG DI AUDIRA! 🎉\n\nHalo Kak {{1}}, aktivasi instalasi paket {{2}} telah rampung dan siap digunakan dengan kecepatan hingga {{3}}.\n\nJika memerlukan bantuan teknis, simpan nomor Customer Care ini. Selamat menikmati internet ngebut!',
    category: 'Informasi',
    lang: 'Indonesia',
    status: 'Disetujui',
    updatedAt: '30/06/2026 19:10',
    updatedBy: 'Rina Marlina',
    variables: ['Nama Pelanggan', 'Nama Paket', 'Speed Bandwidth'],
  },
  {
    id: '5',
    templateCode: 'maintenance_noc',
    name: 'Maintenance Terjadwal NOC',
    varsText: 'Informasi maintenance sistem akan dilakukan pada {{1}} pukul {{2}} - {{3}}... Variabel: {{1}}, {{2}}, {{3}}, {{4}}',
    content: '🔧 PEMBERITAHUAN PEMELIHARAAN JARINGAN 🔧\n\nPelanggan yang terhormat, kami informasikan pemeliharaan backbone pada {{1}} pukul {{2}} - {{3}} di wilayah {{4}}.\n\nLayanan mungkin mengalami degradasi sesaat. Kami mohon maaf atas ketidaknyamanannya.',
    category: 'Informasi',
    lang: 'Indonesia',
    status: 'Menunggu',
    updatedAt: '29/06/2026 16:20',
    updatedBy: 'Indah Permata',
    variables: ['Hari/Tanggal', 'Jam Mulai', 'Jam Selesai', 'Area Wilayah'],
  },
  {
    id: '6',
    templateCode: 'peringatan_isolir',
    name: 'Peringatan Isolir Otomatis',
    varsText: 'Koneksi internet Anda akan diisolir otomatis dalam 24 jam... Variabel: {{1}}, {{2}}',
    content: '🚫 PERINGATAN ISOLIR LAYANAN 🚫\n\nHalo Kak {{1}}, tagihan internet Anda sebesar Rp {{2}} belum diselesaikan melewati masa tenggang. Koneksi akan dinonaktifkan otomatis bila pembayaran tidak dilakukan hari ini.\n\nSegera hubungi tim penagihan jika membutuhkan bantuan.',
    category: 'Billing',
    lang: 'Indonesia',
    status: 'Disetujui',
    updatedAt: '28/06/2026 10:10',
    updatedBy: 'Agus Dwi Rianto',
    variables: ['Nama Pelanggan', 'Nominal Tagihan'],
  },
];

export default function WhatsappTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>(INITIAL_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('1');
  const [activeSubTab, setActiveSubTab] = useState<'semua' | 'disetujui' | 'menunggu' | 'ditolak'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState<'Promosi' | 'Billing' | 'Transaksi' | 'Informasi' | 'Ucapan' | 'Survey'>('Billing');
  const [newContent, setNewContent] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateItem | null>(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const { toast } = useToast();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast.info(message);
    }
  };

  // Selected template object
  const activeTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId) || templates[0] || null;
  }, [templates, selectedTemplateId]);

  // KPIs
  const kpiStats = useMemo(() => {
    let disetujui = 0;
    let menunggu = 0;
    let ditolak = 0;

    templates.forEach(t => {
      if (t.status === 'Disetujui') disetujui++;
      else if (t.status === 'Menunggu') menunggu++;
      else if (t.status === 'Ditolak') ditolak++;
    });

    return {
      total: templates.length,
      disetujui,
      menunggu,
      ditolak,
    };
  }, [templates]);

  // Filtered
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      if (activeSubTab === 'disetujui' && t.status !== 'Disetujui') return false;
      if (activeSubTab === 'menunggu' && t.status !== 'Menunggu') return false;
      if (activeSubTab === 'ditolak' && t.status !== 'Ditolak') return false;

      if (selectedCategory !== 'Semua Kategori' && t.category !== selectedCategory) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchCode = t.templateCode.toLowerCase().includes(q);
        const matchContent = t.content.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchContent) return false;
      }

      return true;
    });
  }, [templates, activeSubTab, selectedCategory, searchTerm]);

  // Copy text to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} disalin ke clipboard`, 'success');
  };

  // Create Template
  const handleCreateTemplate = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Judul dan konten template wajib diisi', 'error');
      return;
    }

    const code = newCode.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newT: TemplateItem = {
      id: `tmpl-${Date.now()}`,
      templateCode: code,
      name: newTitle,
      varsText: newContent.slice(0, 80) + '...',
      content: newContent,
      category: newCategory,
      lang: 'Indonesia',
      status: 'Disetujui',
      updatedAt: 'Hari ini ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      updatedBy: 'Agus Dwi Rianto',
      variables: ['Nama Pelanggan', 'Nominal', 'Info'],
    };

    setTemplates(prev => [newT, ...prev]);
    setSelectedTemplateId(newT.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewCode('');
    setNewContent('');
    showToast('Template baru berhasil ditambahkan', 'success');
  };

  // Edit Template
  const handleOpenEdit = (t: TemplateItem) => {
    setEditingTemplate(t);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setShowEditModal(false);
    setEditingTemplate(null);
    showToast('Template berhasil diperbarui', 'success');
  };

  // Delete Template
  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
    if (selectedTemplateId === templateToDelete.id) {
      const remaining = templates.filter(t => t.id !== templateToDelete.id);
      if (remaining.length > 0) setSelectedTemplateId(remaining[0].id);
    }
    setShowDeleteModal(false);
    setTemplateToDelete(null);
    showToast('Template berhasil dihapus', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (templates.length === 0) {
      showToast('Tidak ada template untuk diexport', 'info');
      return;
    }

    const headers = ['Kode Template', 'Nama Template', 'Kategori', 'Bahasa', 'Status', 'Konten'];
    const rows = templates.map(t => [
      `"${t.templateCode}"`,
      `"${t.name}"`,
      `"${t.category}"`,
      `"${t.lang}"`,
      `"${t.status}"`,
      `"${t.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WhatsApp_Templates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template CSV berhasil diunduh', 'success');
  };

  // Import JSON/CSV text
  const handleImport = () => {
    if (!importText.trim()) {
      showToast('Tempel data template terlebih dahulu', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        setTemplates(prev => [...parsed, ...prev]);
        showToast(`${parsed.length} template berhasil diimport`, 'success');
      } else {
        setTemplates(prev => [parsed, ...prev]);
        showToast('Template berhasil diimport', 'success');
      }
      setShowImportModal(false);
      setImportText('');
    } catch {
      // Fallback simple line-by-line text
      const lines = importText.split('\n').filter(l => l.trim().length > 0);
      const newItems: TemplateItem[] = lines.map((line, idx) => ({
        id: `import-${Date.now()}-${idx}`,
        templateCode: `imported_${idx + 1}`,
        name: `Imported Template ${idx + 1}`,
        varsText: line.slice(0, 60),
        content: line,
        category: 'Informasi',
        lang: 'Indonesia',
        status: 'Disetujui',
        updatedAt: 'Hari ini',
        updatedBy: 'Admin Import',
        variables: ['Variabel 1'],
      }));
      setTemplates(prev => [...newItems, ...prev]);
      setShowImportModal(false);
      setImportText('');
      showToast(`${newItems.length} template berhasil diimport`, 'success');
    }
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
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Template Pesan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Katalog Template WhatsApp Resmi (HSM)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {templates.length} Template Aktif
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Manajemen template pesan penagihan otomatis (variabel nama, total, virtual account) dan notifikasi isolir.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PlusCircle size={14} />
              <span>Buat Template Baru</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ─── Sub-tabs row ──────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-muted)] pb-px overflow-x-auto gap-2">
          {[
            { id: 'semua', label: `Semua Template (${kpiStats.total})` },
            { id: 'disetujui', label: `Disetujui (${kpiStats.disetujui})` },
            { id: 'menunggu', label: `Menunggu (${kpiStats.menunggu})` },
            { id: 'ditolak', label: `Ditolak (${kpiStats.ditolak})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeSubTab === tab.id ? 'border-blue-500 text-[var(--app-text)] font-bold' : 'border-transparent hover:text-[var(--app-text)]/80'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Template</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.total}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Semua kategori</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Disetujui</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.disetujui}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Siap Broadcast</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Menunggu</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.menunggu}</p>
              <p className="text-[10px] text-orange-400 mt-0.5 font-medium">Dalam Review Meta</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Ditolak</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{kpiStats.ditolak}</p>
              <p className="text-[10px] text-red-400 mt-0.5 font-medium">Perlu Revisi</p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama template, kode, konten..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[140px]"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Promosi">Promosi</option>
              <option value="Billing">Billing</option>
              <option value="Transaksi">Transaksi</option>
              <option value="Informasi">Informasi</option>
              <option value="Ucapan">Ucapan</option>
              <option value="Survey">Survey</option>
            </select>

            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Semua Kategori');
                setActiveSubTab('semua');
              }}
              className="text-xs text-[var(--app-muted)] hover:text-white px-3 py-2 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Template List (6/12 cols) */}
          <div className="lg:col-span-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">TEMPLATE</th>
                    <th className="p-4 w-24 text-center">KATEGORI</th>
                    <th className="p-4 w-24 text-center">STATUS</th>
                    <th className="p-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[var(--app-muted)]">
                        Tidak ada template yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map(item => {
                      const isSelected = selectedTemplateId === item.id;
                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedTemplateId(item.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'hover:bg-[var(--app-border)]/20'
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex gap-3">
                              <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg mt-0.5 flex-shrink-0">
                                <MessageSquare size={14} />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <p className="font-bold text-[var(--app-text)] leading-tight">{item.name}</p>
                                <p className="text-[10px] font-mono text-blue-400">{item.templateCode}</p>
                                <p className="text-[9px] text-[var(--app-muted)] line-clamp-1 truncate max-w-[240px]">{item.content}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              item.category === 'Promosi' ? 'bg-purple-500/10 text-purple-400' :
                              item.category === 'Billing' ? 'bg-blue-500/10 text-blue-400' :
                              item.category === 'Transaksi' ? 'bg-emerald-500/10 text-emerald-400' :
                              item.category === 'Ucapan' ? 'bg-rose-500/10 text-rose-400' : 'bg-orange-500/10 text-orange-400'
                            }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                              item.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-400' :
                              item.status === 'Menunggu' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                                title="Edit Template"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => handleCopy(item.content, 'Konten template')}
                                className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                title="Salin Konten"
                              >
                                <Copy size={13} />
                              </button>
                              <button 
                                onClick={() => {
                                  setTemplateToDelete(item);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="Hapus Template"
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
          </div>

          {/* Right Column: Detail & Preview Template (6/12 cols) */}
          {activeTemplate && (
            <div className="lg:col-span-6 space-y-5">
              
              {/* Detail Card */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]">
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeTemplate.name}</h3>
                    <p className="text-xs text-blue-400 font-mono mt-0.5">{activeTemplate.templateCode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      activeTemplate.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {activeTemplate.status}
                    </span>
                    <button 
                      onClick={() => handleOpenEdit(activeTemplate)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--app-border)]">
                  <div>
                    <span className="text-[var(--app-muted)] text-[10px] block">Kategori</span>
                    <span className="font-semibold text-white">{activeTemplate.category}</span>
                  </div>
                  <div>
                    <span className="text-[var(--app-muted)] text-[10px] block">Bahasa</span>
                    <span className="font-semibold text-white">{activeTemplate.lang}</span>
                  </div>
                  <div>
                    <span className="text-[var(--app-muted)] text-[10px] block">Dibuat Oleh</span>
                    <span className="font-semibold text-white">{activeTemplate.updatedBy}</span>
                  </div>
                  <div>
                    <span className="text-[var(--app-muted)] text-[10px] block">Terakhir Update</span>
                    <span className="font-semibold text-white">{activeTemplate.updatedAt}</span>
                  </div>
                </div>

                {/* WhatsApp Chat Preview Bubble */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-[var(--app-muted)] tracking-wider mb-2">
                    Simulasi Tampilan WhatsApp
                  </h4>
                  <div className="bg-[#0b141a] p-4 rounded-xl border border-[#202c33] shadow-inner">
                    <div className="bg-[#005c4b] text-white rounded-2xl rounded-tr-none p-3.5 max-w-[90%] ml-auto text-xs space-y-2 shadow">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {activeTemplate.content}
                      </p>
                      <div className="text-[9px] text-emerald-200 text-right pt-1 flex items-center justify-end gap-1 font-mono">
                        <span>08:30</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Variables */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-[var(--app-muted)] tracking-wider mb-2">
                    Daftar Variabel Penampung
                  </h4>
                  <div className="space-y-1.5 text-xs font-mono">
                    {activeTemplate.variables.map((v, i) => (
                      <div key={i} className="flex justify-between items-center bg-[var(--app-bg)] border border-[var(--app-border)] p-2 rounded-lg">
                        <span className="text-blue-400 font-bold">{`{{${i + 1}}}`}</span>
                        <span className="text-[var(--app-text)] font-sans">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
                  <button
                    onClick={() => handleCopy(activeTemplate.content, 'Pesan template')}
                    className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Salin Pesan</span>
                  </button>
                  <Link
                    href="/whatsapp/chat"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send size={13} />
                    <span>Gunakan di Live Chat</span>
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ─── MODAL: Buat Template Baru ──────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Buat Template WhatsApp Baru</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Template</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Pengingat Tagihan H-1"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kode Template (Slug)</label>
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="tagihan_h1"
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Billing">Billing</option>
                      <option value="Promosi">Promosi</option>
                      <option value="Transaksi">Transaksi</option>
                      <option value="Informasi">Informasi</option>
                      <option value="Ucapan">Ucapan</option>
                      <option value="Survey">Survey</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Konten Pesan (Gunakan {"{{1}}"}, {"{{2}}"} untuk variabel)</label>
                  <textarea
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Halo {{1}}, tagihan internet AUDIRA Anda sebesar Rp {{2}} akan jatuh tempo..."
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Template ───────────────────────────────────────── */}
        {showEditModal && editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Edit Template WhatsApp</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Template</label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <select
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Billing">Billing</option>
                      <option value="Promosi">Promosi</option>
                      <option value="Transaksi">Transaksi</option>
                      <option value="Informasi">Informasi</option>
                      <option value="Ucapan">Ucapan</option>
                      <option value="Survey">Survey</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Status</label>
                    <select
                      value={editingTemplate.status}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, status: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Disetujui">Disetujui</option>
                      <option value="Menunggu">Menunggu</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Konten Pesan</label>
                  <textarea
                    rows={5}
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Delete Confirmation ─────────────────────────────────── */}
        {showDeleteModal && templateToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-red-500/40 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={22} />
                <h3 className="text-base font-bold text-white">Hapus Template?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Apakah Anda yakin ingin menghapus template <strong className="text-white">{templateToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-1.5 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Hapus Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Import Template ─────────────────────────────────────── */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Import Template WhatsApp</h3>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-[var(--app-muted)]">
                  Tempel teks konten template atau JSON array yang berisi definisi template WhatsApp:
                </p>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Tempel teks pesan atau JSON di sini..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-2 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleImport}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Proses Import</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
