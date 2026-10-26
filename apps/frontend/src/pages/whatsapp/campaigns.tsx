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
  Trash2,
  Copy,
  ChevronDown,
  Play,
  Pause,
  PlusCircle,
  X,
  Check
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  category: string;
  status: 'Aktif' | 'Terjadwal' | 'Draft' | 'Selesai' | 'Dijeda';
  date: string;
  contacts: number;
  sent: number;
  ratio: string;
  messageText: string;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: '1',
    name: 'Promo Juli Diskon 20%',
    category: 'Promo Paket Internet',
    status: 'Aktif',
    date: '22/10/2026 08:00',
    contacts: 1250,
    sent: 1210,
    ratio: '96.8%',
    messageText: '📢 PROMO SPESIAL AUDIRA 📢\n\nHalo Pelanggan, nikmati promo upgrade kecepatan diskon 20% khusus bulan ini! Info lengkap: https://audira.my.id',
  },
  {
    id: '2',
    name: 'Tagihan Jatuh Tempo Bulan Berjalan',
    category: 'Pengingat Pembayaran',
    status: 'Terjadwal',
    date: 'Hari ini 10:00',
    contacts: 48,
    sent: 0,
    ratio: '0%',
    messageText: 'Halo Kak, tagihan internet AUDIRA Anda telah memasuki jatuh tempo hari ini. Segera lakukan pembayaran via transfer / QRIS.',
  },
  {
    id: '3',
    name: 'Maintenance Backbone Harapan Indah',
    category: 'Informasi Layanan',
    status: 'Selesai',
    date: '30/06/2026 20:00',
    contacts: 320,
    sent: 320,
    ratio: '100%',
    messageText: 'Pemberitahuan pemeliharaan jaringan fiber optik di Harapan Indah telah selesai. Koneksi telah kembali normal.',
  },
  {
    id: '4',
    name: 'Survey Kepuasan Pelanggan Q3',
    category: 'Survey',
    status: 'Dijeda',
    date: '25/06/2026 14:00',
    contacts: 850,
    sent: 410,
    ratio: '48.2%',
    messageText: 'Bagaimana pengalaman internet Anda bersama AUDIRA? Beri nilai kami pada link berikut: https://audira.my.id/survey',
  },
  {
    id: '5',
    name: 'Draft Sosialisasi Aplikasi Customer Portal',
    category: 'Informasi Layanan',
    status: 'Draft',
    date: 'Belum Terjadwal',
    contacts: 1500,
    sent: 0,
    ratio: '0%',
    messageText: 'Kini bayar tagihan dan cek status router lebih mudah melalui AUDIRA Customer Portal di http://localhost:3219!',
  },
];

export default function WhatsappCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'semua' | 'aktif' | 'terjadwal' | 'selesai' | 'draft'>('semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Promo Paket Internet');
  const [newMessage, setNewMessage] = useState('');
  const [newContactsCount, setNewContactsCount] = useState('50');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<CampaignItem | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const activeCampaign = useMemo(() => {
    return campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || null;
  }, [campaigns, selectedCampaignId]);

  // KPIs
  const kpiStats = useMemo(() => {
    let aktif = 0;
    let terjadwal = 0;
    let totalTerkirim = 0;

    campaigns.forEach(c => {
      if (c.status === 'Aktif') aktif++;
      if (c.status === 'Terjadwal') terjadwal++;
      totalTerkirim += c.sent;
    });

    return {
      total: campaigns.length,
      aktif,
      terjadwal,
      totalTerkirim,
    };
  }, [campaigns]);

  // Filtered
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (activeTab === 'aktif' && c.status !== 'Aktif') return false;
      if (activeTab === 'terjadwal' && c.status !== 'Terjadwal') return false;
      if (activeTab === 'selesai' && c.status !== 'Selesai') return false;
      if (activeTab === 'draft' && c.status !== 'Draft') return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchCat = c.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }

      return true;
    });
  }, [campaigns, activeTab, searchTerm]);

  // Toggle Pause / Resume
  const handleTogglePause = (c: CampaignItem) => {
    const nextStatus = c.status === 'Aktif' ? 'Dijeda' : 'Aktif';
    setCampaigns(prev => prev.map(item => item.id === c.id ? { ...item, status: nextStatus } : item));
    showToast(`Status kampanye "${c.name}" diubah menjadi ${nextStatus}`, 'success');
  };

  // Create Campaign
  const handleCreateCampaign = () => {
    if (!newName.trim() || !newMessage.trim()) {
      showToast('Nama kampanye dan isi pesan wajib diisi', 'error');
      return;
    }

    const count = parseInt(newContactsCount) || 50;
    const newCamp: CampaignItem = {
      id: `camp-${Date.now()}`,
      name: newName,
      category: newCategory,
      status: 'Aktif',
      date: 'Hari ini ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      contacts: count,
      sent: 0,
      ratio: '0%',
      messageText: newMessage,
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setSelectedCampaignId(newCamp.id);
    setShowCreateModal(false);
    setNewName('');
    setNewMessage('');
    showToast('Kampanye baru berhasil dibuat dan dijadwalkan', 'success');
  };

  // Edit Campaign
  const handleSaveEdit = () => {
    if (!editingCampaign) return;
    setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? editingCampaign : c));
    setShowEditModal(false);
    setEditingCampaign(null);
    showToast('Kampanye berhasil diperbarui', 'success');
  };

  // Delete Campaign
  const handleConfirmDelete = () => {
    if (!campaignToDelete) return;
    setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
    if (selectedCampaignId === campaignToDelete.id) {
      const remaining = campaigns.filter(c => c.id !== campaignToDelete.id);
      if (remaining.length > 0) setSelectedCampaignId(remaining[0].id);
    }
    setShowDeleteModal(false);
    setCampaignToDelete(null);
    showToast('Kampanye berhasil dihapus', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (campaigns.length === 0) {
      showToast('Tidak ada data kampanye untuk diexport', 'info');
      return;
    }

    const headers = ['Nama Kampanye', 'Kategori', 'Status', 'Jadwal', 'Total Kontak', 'Terkirim', 'Rasio Sukses'];
    const rows = campaigns.map(c => [
      `"${c.name}"`,
      `"${c.category}"`,
      `"${c.status}"`,
      `"${c.date}"`,
      `"${c.contacts}"`,
      `"${c.sent}"`,
      `"${c.ratio}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Broadcast_Campaigns_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data kampanye berhasil diunduh', 'success');
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
              <span className="text-emerald-400 font-semibold">Broadcast & Campaign</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Broadcast & Kampanye Pesan Massal</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {campaigns.length} Kampanye
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengiriman pesan promo, informasi maintenance jaringan fiber, dan broadcast tagihan terintegrasi database pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PlusCircle size={14} />
              <span>Buat Kampanye Baru</span>
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

        {/* ─── KPI Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Send size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Kampanye</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.total}</p>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium">Semua Jadwal</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Play size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Kampanye Aktif</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.aktif}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Sedang Berjalan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Terjadwal</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.terjadwal}</p>
              <p className="text-[10px] text-orange-400 mt-0.5 font-medium">Menunggu Antrian</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Pesan Terkirim</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.totalTerkirim}</p>
              <p className="text-[10px] text-purple-400 mt-0.5 font-medium">Berhasil Masuk</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Daftar Campaign (4/12 cols) */}
          <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Daftar Kampanye</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{filteredCampaigns.length} Item</span>
              </div>
              
              {/* Search campaign */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kampanye..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-3 py-2 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Sub-tabs inside list */}
              <div className="flex border-b border-[var(--app-border)] text-[11px] font-bold text-[var(--app-muted)] pb-1 gap-2">
                <button 
                  onClick={() => setActiveTab('semua')}
                  className={`pb-1 transition-colors cursor-pointer ${activeTab === 'semua' ? 'text-white border-b-2 border-emerald-500 font-bold' : 'hover:text-white'}`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setActiveTab('aktif')}
                  className={`pb-1 transition-colors cursor-pointer ${activeTab === 'aktif' ? 'text-white border-b-2 border-emerald-500 font-bold' : 'hover:text-white'}`}
                >
                  Aktif
                </button>
                <button 
                  onClick={() => setActiveTab('terjadwal')}
                  className={`pb-1 transition-colors cursor-pointer ${activeTab === 'terjadwal' ? 'text-white border-b-2 border-emerald-500 font-bold' : 'hover:text-white'}`}
                >
                  Terjadwal
                </button>
                <button 
                  onClick={() => setActiveTab('selesai')}
                  className={`pb-1 transition-colors cursor-pointer ${activeTab === 'selesai' ? 'text-white border-b-2 border-emerald-500 font-bold' : 'hover:text-white'}`}
                >
                  Selesai
                </button>
              </div>

              {/* Campaign list items */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredCampaigns.map(item => {
                  const isSelected = selectedCampaignId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCampaignId(item.id)}
                      className={`flex justify-between items-start p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-emerald-500/10 border border-emerald-500/40 shadow-xs' : 'bg-[var(--app-bg)]/60 border border-[var(--app-border)] hover:bg-[var(--app-border)]/20'
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg mt-0.5">
                          <Send size={14} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                            <span className={`px-1.5 py-0.2 rounded text-[7px] font-black uppercase ${
                              item.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400' :
                              item.status === 'Terjadwal' ? 'bg-orange-500/10 text-orange-400' :
                              item.status === 'Selesai' ? 'bg-blue-500/10 text-blue-400' :
                              item.status === 'Draft' ? 'bg-gray-500/10 text-[var(--app-muted)]' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--app-muted)] font-semibold">{item.category}</p>
                          <div className="flex gap-3 text-[9px] text-[var(--app-muted)] pt-1 font-mono">
                            <span>{item.contacts} Kontak</span>
                            <span>{item.sent} Terkirim ({item.ratio})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Area: Details (8/12 cols) */}
          {activeCampaign && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Main Campaign Header card */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <Send size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white leading-none">{activeCampaign.name}</h2>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        activeCampaign.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {activeCampaign.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{activeCampaign.category}</p>
                    <p className="text-xs text-[var(--app-muted)]">Jadwal: {activeCampaign.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTogglePause(activeCampaign)}
                    className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-orange-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    {activeCampaign.status === 'Aktif' ? <Pause size={13} /> : <Play size={13} />}
                    <span>{activeCampaign.status === 'Aktif' ? 'Jeda Kampanye' : 'Lanjutkan'}</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setEditingCampaign(activeCampaign);
                      setShowEditModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button 
                    onClick={() => {
                      setCampaignToDelete(activeCampaign);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 hover:bg-[var(--app-border)]/40 rounded-xl text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Hapus Kampanye"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Campaign metrics row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 text-center">
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Target</p>
                  <p className="text-lg font-black text-white mt-1">{activeCampaign.contacts}</p>
                  <p className="text-[9px] text-[var(--app-muted)]">Nomor WhatsApp</p>
                </div>
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 text-center">
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Terkirim</p>
                  <p className="text-lg font-black text-emerald-400 mt-1">{activeCampaign.sent}</p>
                  <p className="text-[9px] text-[var(--app-muted)]">{activeCampaign.ratio} Sukses</p>
                </div>
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 text-center">
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Antrian Pending</p>
                  <p className="text-lg font-black text-amber-400 mt-1">{Math.max(0, activeCampaign.contacts - activeCampaign.sent)}</p>
                  <p className="text-[9px] text-[var(--app-muted)]">Sedang Diproses</p>
                </div>
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3 text-center">
                  <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Delivery Rate</p>
                  <p className="text-lg font-black text-blue-400 mt-1">{activeCampaign.ratio}</p>
                  <p className="text-[9px] text-[var(--app-muted)]">Tingkat Keberhasilan</p>
                </div>
              </div>

              {/* Message preview bubble */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Teks Pesan Broadcast</h4>
                <div className="bg-[#0b141a] p-4 rounded-xl border border-[#202c33]">
                  <div className="bg-[#005c4b] text-white rounded-2xl rounded-tr-none p-4 max-w-[90%] text-xs space-y-2 shadow">
                    <p className="whitespace-pre-wrap leading-relaxed">{activeCampaign.messageText}</p>
                    <div className="text-[9px] text-emerald-200 text-right pt-1 flex items-center justify-end gap-1 font-mono">
                      <span>{activeCampaign.date}</span>
                      <span>✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ─── MODAL: Buat Kampanye Baru ──────────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Buat Kampanye Broadcast Baru</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Kampanye</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Promo Diskon Hari Kemerdekaan"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Promo Paket Internet">Promo Paket Internet</option>
                      <option value="Pengingat Pembayaran">Pengingat Pembayaran</option>
                      <option value="Informasi Layanan">Informasi Layanan</option>
                      <option value="Survey">Survey</option>
                      <option value="Ucapan Hari Raya">Ucapan Hari Raya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[var(--app-muted)] mb-1">Estimasi Target Kontak</label>
                    <input
                      type="number"
                      value={newContactsCount}
                      onChange={(e) => setNewContactsCount(e.target.value)}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Isi Pesan Broadcast</label>
                  <textarea
                    rows={5}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik isi pesan kampanye di sini..."
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
                  onClick={handleCreateCampaign}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Jadwalkan Kampanye</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Kampanye ───────────────────────────────────────── */}
        {showEditModal && editingCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Edit Kampanye Broadcast</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Kampanye</label>
                  <input
                    type="text"
                    value={editingCampaign.name}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Kategori</label>
                  <select
                    value={editingCampaign.category}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, category: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Promo Paket Internet">Promo Paket Internet</option>
                    <option value="Pengingat Pembayaran">Pengingat Pembayaran</option>
                    <option value="Informasi Layanan">Informasi Layanan</option>
                    <option value="Survey">Survey</option>
                    <option value="Ucapan Hari Raya">Ucapan Hari Raya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Isi Pesan</label>
                  <textarea
                    rows={5}
                    value={editingCampaign.messageText}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, messageText: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
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
        {showDeleteModal && campaignToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-red-500/40 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={22} />
                <h3 className="text-base font-bold text-white">Hapus Kampanye?</h3>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Apakah Anda yakin ingin menghapus kampanye <strong className="text-white">{campaignToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
                  Hapus Kampanye
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
