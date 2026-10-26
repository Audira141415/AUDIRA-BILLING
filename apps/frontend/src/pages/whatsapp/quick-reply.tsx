import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
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
  Check,
  X
} from 'lucide-react';

interface QuickReplyItem {
  id: string;
  shortcut: string;
  name: string;
  category: 'Salam' | 'Informasi' | 'Pembayaran' | 'Notifikasi' | 'Penagihan' | 'Umum' | 'Promosi';
  lang: string;
  status: 'Aktif' | 'Non Aktif';
  usedCount: number;
  updatedAt: string;
  updatedBy: string;
  isFavorite: boolean;
  content: string;
}

const INITIAL_QUICK_REPLIES: QuickReplyItem[] = [
  {
    id: '1',
    shortcut: '/halo',
    name: 'Salam Pembuka CS',
    content: 'Halo Kak {{nama}}, selamat datang di Customer Care AUDIRA-NET! Ada yang bisa kami bantu seputar koneksi internet hari ini? 😊',
    category: 'Salam',
    lang: 'Indonesia',
    status: 'Aktif',
    usedCount: 342,
    updatedAt: '22/10/2026 08:32',
    updatedBy: 'Agus Dwi Rianto',
    isFavorite: true,
  },
  {
    id: '2',
    shortcut: '/paket',
    name: 'Daftar Paket Internet',
    content: 'Berikut daftar paket internet AUDIRA-NET Fiber Optik:\n• Home 20 Mbps: Rp 200.000/bln\n• Home 50 Mbps: Rp 275.000/bln\n• Gamer 100 Mbps: Rp 450.000/bln\n• Corporate 200 Mbps: Rp 950.000/bln\nSemua paket unlimited tanpa FUP!',
    category: 'Informasi',
    lang: 'Indonesia',
    status: 'Aktif',
    usedCount: 213,
    updatedAt: '22/10/2026 07:45',
    updatedBy: 'Rina Marlina',
    isFavorite: true,
  },
  {
    id: '3',
    shortcut: '/rekening',
    name: 'Info Rekening Bank & QRIS',
    content: 'Pembayaran tagihan resmi AUDIRA dapat ditransfer ke:\n🏦 BCA: 123-456-7890 a/n AUDIRA MULTIMEDIA\n🏦 Mandiri: 987-654-3210 a/n AUDIRA MULTIMEDIA\n📱 QRIS: Scan dinamis melalui portal kami https://audira.my.id',
    category: 'Pembayaran',
    lang: 'Indonesia',
    status: 'Aktif',
    usedCount: 186,
    updatedAt: '30/06/2026 21:15',
    updatedBy: 'Rina Marlina',
    isFavorite: true,
  },
  {
    id: '4',
    shortcut: '/restart',
    name: 'Panduan Restart Modem/ONT',
    content: 'Mohon matikan router/modem ONT Anda selama 3 menit dengan mencabut adaptor listrik, lalu hidupkan kembali. Tunggu hingga lampu indikator PON/Internet menyala hijau stabil tanpa kedip merah (LOS). 🙏',
    category: 'Notifikasi',
    lang: 'Indonesia',
    status: 'Aktif',
    usedCount: 128,
    updatedAt: '30/06/2026 19:30',
    updatedBy: 'Agus Dwi Rianto',
    isFavorite: true,
  },
  {
    id: '5',
    shortcut: '/due',
    name: 'Reminder Tagihan Jatuh Tempo',
    content: 'Halo Kak {{nama}}, menginformasikan tagihan internet AUDIRA Anda sebesar Rp {{nominal}} telah melewati tanggal jatuh tempo. Mohon lakukan pembayaran agar layanan tidak terisolir otomatis. Terima kasih! 🙏',
    category: 'Penagihan',
    lang: 'Indonesia',
    status: 'Aktif',
    usedCount: 98,
    updatedAt: '29/06/2026 16:20',
    updatedBy: 'Indah Permata',
    isFavorite: false,
  },
  {
    id: '6',
    shortcut: '/teknisi',
    name: 'Konfirmasi Kunjungan Teknisi',
    content: 'Tim teknisi lapangan AUDIRA telah ditugaskan untuk melakukan perbaikan koneksi di lokasi Anda hari ini. Teknisi kami akan menghubungi Anda sebelum tiba di lokasi.',
    category: 'Umum',
    lang: 'Indonesia',
    status: 'Aktif',
    usedCount: 76,
    updatedAt: '28/06/2026 10:10',
    updatedBy: 'Indah Permata',
    isFavorite: false,
  },
];

export default function WhatsappQuickReplyPage() {
  const [replies, setReplies] = useState<QuickReplyItem[]>(INITIAL_QUICK_REPLIES);
  const [selectedQRId, setSelectedQRId] = useState<string>('1');
  const [activeSubTab, setActiveSubTab] = useState<'semua' | 'favorit' | 'aktif' | 'nonaktif'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShortcut, setNewShortcut] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Salam' | 'Informasi' | 'Pembayaran' | 'Notifikasi' | 'Penagihan' | 'Umum' | 'Promosi'>('Salam');
  const [newContent, setNewContent] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReply, setEditingReply] = useState<QuickReplyItem | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<QuickReplyItem | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Active reply item
  const activeReply = useMemo(() => {
    return replies.find(r => r.id === selectedQRId) || replies[0] || null;
  }, [replies, selectedQRId]);

  // KPIs
  const kpiStats = useMemo(() => {
    let aktif = 0;
    let favorit = 0;
    let totalUsage = 0;

    replies.forEach(r => {
      if (r.status === 'Aktif') aktif++;
      if (r.isFavorite) favorit++;
      totalUsage += r.usedCount;
    });

    return {
      total: replies.length,
      aktif,
      favorit,
      totalUsage,
    };
  }, [replies]);

  // Filtered
  const filteredReplies = useMemo(() => {
    return replies.filter(r => {
      if (activeSubTab === 'favorit' && !r.isFavorite) return false;
      if (activeSubTab === 'aktif' && r.status !== 'Aktif') return false;
      if (activeSubTab === 'nonaktif' && r.status !== 'Non Aktif') return false;

      if (selectedCategory !== 'Semua Kategori' && r.category !== selectedCategory) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchShort = r.shortcut.toLowerCase().includes(q);
        const matchCont = r.content.toLowerCase().includes(q);
        if (!matchName && !matchShort && !matchCont) return false;
      }

      return true;
    });
  }, [replies, activeSubTab, selectedCategory, searchTerm]);

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReplies(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
    showToast('Status favorit diperbarui', 'success');
  };

  // Copy content
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} disalin ke clipboard`, 'success');
  };

  // Create
  const handleCreateReply = () => {
    if (!newName.trim() || !newContent.trim()) {
      showToast('Nama dan isi pesan wajib diisi', 'error');
      return;
    }

    const shortcut = newShortcut.startsWith('/') ? newShortcut : `/${newShortcut || newName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const newR: QuickReplyItem = {
      id: `qr-${Date.now()}`,
      shortcut,
      name: newName,
      content: newContent,
      category: newCategory,
      lang: 'Indonesia',
      status: 'Aktif',
      usedCount: 0,
      updatedAt: 'Hari ini',
      updatedBy: 'Agus Dwi Rianto',
      isFavorite: false,
    };

    setReplies(prev => [newR, ...prev]);
    setSelectedQRId(newR.id);
    setShowCreateModal(false);
    setNewName('');
    setNewShortcut('');
    setNewContent('');
    showToast('Balasan cepat berhasil ditambahkan', 'success');
  };

  // Edit
  const handleOpenEdit = (r: QuickReplyItem) => {
    setEditingReply(r);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingReply) return;
    setReplies(prev => prev.map(r => r.id === editingReply.id ? editingReply : r));
    setShowEditModal(false);
    setEditingReply(null);
    showToast('Balasan cepat berhasil diperbarui', 'success');
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!replyToDelete) return;
    setReplies(prev => prev.filter(r => r.id !== replyToDelete.id));
    if (selectedQRId === replyToDelete.id) {
      const remaining = replies.filter(r => r.id !== replyToDelete.id);
      if (remaining.length > 0) setSelectedQRId(remaining[0].id);
    }
    setShowDeleteModal(false);
    setReplyToDelete(null);
    showToast('Balasan cepat berhasil dihapus', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (replies.length === 0) {
      showToast('Tidak ada data balasan cepat untuk diexport', 'info');
      return;
    }

    const headers = ['Shortcut', 'Nama', 'Kategori', 'Status', 'Penggunaan', 'Isi Pesan'];
    const rows = replies.map(r => [
      `"${r.shortcut}"`,
      `"${r.name}"`,
      `"${r.category}"`,
      `"${r.status}"`,
      `"${r.usedCount}"`,
      `"${r.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Quick_Replies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Balasan cepat CSV berhasil diunduh', 'success');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Toast ─────────────────────────────────────────────────────── */}
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
              <Link href="/whatsapp" className="hover:text-[var(--app-text)]">WhatsApp Gateway</Link>
              <span>/</span>
              <span className="text-emerald-400 font-semibold">Balasan Cepat (Quick Reply)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Manajemen Balasan Cepat (Quick Reply CS)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {replies.length} Respon Tersimpan
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar template respon cepat (/paket, /rekening, /restart) untuk mempercepat First Response Time (FRT) penanganan komplain.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PlusCircle size={14} />
              <span>Buat Balasan Cepat</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <Link 
              href="/whatsapp/chat" 
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              <span>Buka Live Chat</span>
            </Link>
          </div>
        </div>

        {/* ─── Sub-tabs row ──────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-muted)] pb-px overflow-x-auto gap-2">
          {[
            { id: 'semua', label: `Semua (${kpiStats.total})` },
            { id: 'favorit', label: `⭐ Favorit (${kpiStats.favorit})` },
            { id: 'aktif', label: `Aktif (${kpiStats.aktif})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeSubTab === tab.id ? 'border-emerald-500 text-white font-bold' : 'border-transparent hover:text-white'
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
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Respon</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.total}</p>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium">Semua Kategori</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl">
              <Star size={20} className="fill-yellow-500/20" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Favorit CS</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.favorit}</p>
              <p className="text-[10px] text-yellow-400 mt-0.5 font-medium">Sering Digunakan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Status Aktif</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.aktif}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Siap Pakai</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Terkirim</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.totalUsage}</p>
              <p className="text-[10px] text-purple-400 mt-0.5 font-medium">Kali Digunakan</p>
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
                placeholder="Cari shortcut (/paket), nama, isi..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-white focus:outline-none min-w-[140px]"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Salam">Salam</option>
              <option value="Informasi">Informasi</option>
              <option value="Pembayaran">Pembayaran</option>
              <option value="Notifikasi">Notifikasi</option>
              <option value="Penagihan">Penagihan</option>
              <option value="Umum">Umum</option>
              <option value="Promosi">Promosi</option>
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

          {/* Left Column: Quick Replies List (6/12 cols) */}
          <div className="lg:col-span-6 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]/80">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4 w-10 text-center">⭐</th>
                    <th className="p-4">BALASAN CEPAT</th>
                    <th className="p-4 w-24 text-center">KATEGORI</th>
                    <th className="p-4 w-20 text-center">PENGGUNAAN</th>
                    <th className="p-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {filteredReplies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--app-muted)]">
                        Tidak ada balasan cepat yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredReplies.map(item => {
                      const isSelected = selectedQRId === item.id;
                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedQRId(item.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : 'hover:bg-[var(--app-border)]/20'
                          }`}
                        >
                          <td className="p-4 text-center" onClick={(e) => handleToggleFavorite(item.id, e)}>
                            <button onClick={(e) => handleToggleFavorite(item.id, e)} className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer">
                              <Star size={15} className={item.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'} />
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold">
                                  {item.shortcut}
                                </span>
                                <span className="font-bold text-white">{item.name}</span>
                              </div>
                              <p className="text-[10px] text-[var(--app-muted)] line-clamp-1 truncate max-w-[280px]">
                                {item.content}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-2 py-0.5 text-[8px] font-bold uppercase rounded bg-slate-800 text-slate-300">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono font-semibold text-white">
                            {item.usedCount}x
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => handleCopy(item.content, 'Pesan balasan cepat')}
                                className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                title="Salin"
                              >
                                <Copy size={13} />
                              </button>
                              <button 
                                onClick={() => {
                                  setReplyToDelete(item);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1.5 hover:bg-[var(--app-border)]/50 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="Hapus"
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

          {/* Right Column: Detail & Simulator (6/12 cols) */}
          {activeReply && (
            <div className="lg:col-span-6 space-y-5">
              
              {/* Detail Card */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]">
                  <div>
                    <h3 className="text-base font-bold text-white">{activeReply.name}</h3>
                    <p className="text-xs text-blue-400 font-mono mt-0.5">Shortcut Command: {activeReply.shortcut}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {activeReply.category}
                    </span>
                    <button 
                      onClick={() => handleOpenEdit(activeReply)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Chat Preview Bubble */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-[var(--app-muted)] tracking-wider mb-2">
                    Simulasi Balasan di Chat CS
                  </h4>
                  <div className="bg-[#0b141a] p-4 rounded-xl border border-[#202c33] shadow-inner">
                    <div className="bg-[#005c4b] text-white rounded-2xl rounded-tr-none p-3.5 max-w-[90%] ml-auto text-xs space-y-2 shadow">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {activeReply.content}
                      </p>
                      <div className="text-[9px] text-emerald-200 text-right pt-1 flex items-center justify-end gap-1 font-mono">
                        <span>08:32</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--app-border)]">
                  <div>
                    <span className="text-[var(--app-muted)] text-[10px] block">Frekuensi Penggunaan</span>
                    <span className="font-bold text-white">{activeReply.usedCount} kali</span>
                  </div>
                  <div>
                    <span className="text-[var(--app-muted)] text-[10px] block">Terakhir Diperbarui</span>
                    <span className="font-semibold text-white">{activeReply.updatedAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
                  <button
                    onClick={() => handleCopy(activeReply.content, 'Teks balasan cepat')}
                    className="px-4 py-2 bg-[var(--app-border)]/50 hover:bg-[var(--app-border)] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Salin Teks</span>
                  </button>
                  <Link
                    href="/whatsapp/chat"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send size={13} />
                    <span>Pakai di Chat</span>
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ─── MODAL: Buat Balasan Cepat Baru ─────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Buat Balasan Cepat Baru</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Respon</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Info Rekening Pembayaran"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Shortcut (Awali dengan /)</label>
                    <input
                      type="text"
                      value={newShortcut}
                      onChange={(e) => setNewShortcut(e.target.value)}
                      placeholder="/bank"
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Salam">Salam</option>
                      <option value="Informasi">Informasi</option>
                      <option value="Pembayaran">Pembayaran</option>
                      <option value="Notifikasi">Notifikasi</option>
                      <option value="Penagihan">Penagihan</option>
                      <option value="Umum">Umum</option>
                      <option value="Promosi">Promosi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Isi Pesan Respon</label>
                  <textarea
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Ketik isi pesan balasan cepat..."
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-emerald-500"
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
                  onClick={handleCreateReply}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Respon</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Balasan Cepat ──────────────────────────────────── */}
        {showEditModal && editingReply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Edit Balasan Cepat</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Respon</label>
                  <input
                    type="text"
                    value={editingReply.name}
                    onChange={(e) => setEditingReply({ ...editingReply, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Shortcut</label>
                    <input
                      type="text"
                      value={editingReply.shortcut}
                      onChange={(e) => setEditingReply({ ...editingReply, shortcut: e.target.value })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <select
                      value={editingReply.category}
                      onChange={(e) => setEditingReply({ ...editingReply, category: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Salam">Salam</option>
                      <option value="Informasi">Informasi</option>
                      <option value="Pembayaran">Pembayaran</option>
                      <option value="Notifikasi">Notifikasi</option>
                      <option value="Penagihan">Penagihan</option>
                      <option value="Umum">Umum</option>
                      <option value="Promosi">Promosi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Isi Pesan Respon</label>
                  <textarea
                    rows={5}
                    value={editingReply.content}
                    onChange={(e) => setEditingReply({ ...editingReply, content: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-emerald-500"
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Delete Confirmation ─────────────────────────────────── */}
        {showDeleteModal && replyToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-red-500/40 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={22} />
                <h3 className="text-base font-bold text-white">Hapus Balasan Cepat?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Apakah Anda yakin ingin menghapus balasan cepat <strong className="text-white">{replyToDelete.name} ({replyToDelete.shortcut})</strong>?
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
                  Hapus Respon
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
