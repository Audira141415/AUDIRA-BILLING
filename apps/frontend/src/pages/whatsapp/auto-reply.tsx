import Link from 'next/link';
import React, { useState } from 'react';
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
  Play,
  Check,
  X
} from 'lucide-react';

interface AutoReplyRule {
  id: string;
  name: string;
  desc: string;
  triggerType: 'Pesan Masuk' | 'Di Luar Jam Kerja' | 'Kata Kunci' | 'Status Pembayaran' | 'Tidak Aktif (X Hari)' | 'Tanggal Spesial';
  condition: string;
  keywords: string;
  category: 'Umum' | 'Layanan' | 'Promosi' | 'Informasi' | 'Transaksi' | 'Retensi' | 'Support' | 'Event';
  status: 'Aktif' | 'Non Aktif';
  triggerCount: number;
  updatedAt: string;
  updatedBy: string;
  enabled: boolean;
  replyMessage: string;
  delaySeconds: number;
}

const initialRules: AutoReplyRule[] = [
  { 
    id: '1', 
    name: 'Salam Pembuka Otomatis', 
    desc: 'Menyapa pelanggan saat pertama kali mengirim pesan', 
    triggerType: 'Pesan Masuk', 
    condition: 'Pertama kali chat', 
    keywords: '',
    category: 'Umum', 
    status: 'Aktif', 
    triggerCount: 342, 
    updatedAt: '26/10/2026 08:32', 
    updatedBy: 'Agus Dwi Rianto', 
    enabled: true,
    replyMessage: 'Halo {{nama}} 👋,\nTerima kasih telah menghubungi Customer Care *AudiraNET*.\nAda yang bisa kami bantu seputar koneksi internet Anda hari ini? 😊',
    delaySeconds: 1
  },
  { 
    id: '2', 
    name: 'Respon Di Luar Jam Kerja', 
    desc: 'Memberi info jam operasional CS kantor pusat', 
    triggerType: 'Di Luar Jam Kerja', 
    condition: 'Chat masuk di luar 08:00 - 20:00',
    keywords: '',
    category: 'Layanan', 
    status: 'Aktif', 
    triggerCount: 213, 
    updatedAt: '26/10/2026 07:45', 
    updatedBy: 'Rina Marlina', 
    enabled: true,
    replyMessage: 'Halo Kak {{nama}} 🙏,\nSaat ini layanan CS kami sedang offline (Jam operasional: 08.00 - 20.00 WIB).\nPesan Anda telah tersimpan dan akan segera ditanggapi oleh tim NOC pada jam kerja berikutnya.',
    delaySeconds: 2
  },
  { 
    id: '3', 
    name: 'Cek Tagihan & Invoice', 
    desc: 'Menjawab otomatis ketika ada keyword tagihan / bayar', 
    triggerType: 'Kata Kunci', 
    condition: 'Mengandung kata kunci',
    keywords: 'tagihan, bayar, invoice, rek, rekening',
    category: 'Transaksi', 
    status: 'Aktif', 
    triggerCount: 524, 
    updatedAt: '25/10/2026 21:15', 
    updatedBy: 'Rina Marlina', 
    enabled: true,
    replyMessage: 'Halo Kak {{nama}},\nUntuk tagihan periode ini:\nNo Layanan: *{{no_layanan}}*\nJumlah: *{{tagihan}}*\nJatuh Tempo: *{{jatuh_tempo}}*\n\nPembayaran via Transfer BCA: 8831234567 a/n Audira Multimedia Digital.\nTerima kasih! 🙏',
    delaySeconds: 0
  },
  { 
    id: '4', 
    name: 'Informasi Paket & Upgrade', 
    desc: 'Menjawab pertanyaan seputar paket internet dan promo', 
    triggerType: 'Kata Kunci', 
    condition: 'Mengandung kata kunci',
    keywords: 'paket, harga, promo, upgrade, speed, kecepatan',
    category: 'Informasi', 
    status: 'Aktif', 
    triggerCount: 186, 
    updatedAt: '25/10/2026 19:30', 
    updatedBy: 'Agus Dwi Rianto', 
    enabled: true,
    replyMessage: 'Halo Kak! Pilihan paket internet fiber AudiraNET:\n🚀 20 Mbps: Rp 165.000/bln\n🚀 50 Mbps: Rp 250.000/bln\n🚀 100 Mbps: Rp 375.000/bln\nSemua paket Unlimited tanpa FUP! Mau kami bantu proses registrasi?',
    delaySeconds: 1
  },
  { 
    id: '5', 
    name: 'Konfirmasi Pembayaran Diterima', 
    desc: 'Memberi konfirmasi otomatis setelah pembayaran diverifikasi', 
    triggerType: 'Status Pembayaran', 
    condition: 'Status berubah Lunas',
    keywords: '',
    category: 'Transaksi', 
    status: 'Aktif', 
    triggerCount: 98, 
    updatedAt: '24/10/2026 16:20', 
    updatedBy: 'Indah Permata', 
    enabled: true,
    replyMessage: 'Terima kasih Kak {{nama}}! Pembayaran tagihan internet Anda sebesar {{tagihan}} telah kami terima dan diverifikasi. Layanan internet Anda aktif lancar.',
    delaySeconds: 0
  },
  { 
    id: '6', 
    name: 'Lapor Gangguan / Internet Mati', 
    desc: 'Mengarahkan tiket teknis ke tim NOC jika terjadi kendala', 
    triggerType: 'Kata Kunci', 
    condition: 'Mengandung kata kunci',
    keywords: 'gangguan, mati, lambat, putus, merah, los, lemot',
    category: 'Support', 
    status: 'Aktif', 
    triggerCount: 142, 
    updatedAt: '23/10/2026 14:00', 
    updatedBy: 'Agus Dwi Rianto', 
    enabled: true,
    replyMessage: 'Mohon maaf atas ketidaknyamanannya Kak {{nama}} 🙏.\nJika lampu indikator LOS pada modem menyala merah, silakan restart router selama 30 detik.\nJika masih kendala, tim teknisi NOC kami siap melakukan pengecekan fiber optic ke lokasi.',
    delaySeconds: 0
  }
];

export default function WhatsappAutoReplyPage() {
  const [rules, setRules] = useState<AutoReplyRule[]>(initialRules);
  const [selectedRuleId, setSelectedRuleId] = useState('1');
  const [activeSubTab, setActiveSubTab] = useState<'semua' | 'aktif' | 'nonaktif'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [triggerFilter, setTriggerFilter] = useState('Semua Trigger');

  // Modal create
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteRule, setTargetDeleteRule] = useState<AutoReplyRule | null>(null);

  // New rule form
  const [newRuleData, setNewRuleData] = useState({
    name: '',
    desc: '',
    triggerType: 'Kata Kunci' as AutoReplyRule['triggerType'],
    keywords: '',
    category: 'Umum' as AutoReplyRule['category'],
    replyMessage: '',
    delaySeconds: 0
  });

  // Selected rule editor form state
  const selectedRule = rules.find(r => r.id === selectedRuleId) || rules[0];
  const [editName, setEditName] = useState(selectedRule?.name || '');
  const [editDesc, setEditDesc] = useState(selectedRule?.desc || '');
  const [editMessage, setEditMessage] = useState(selectedRule?.replyMessage || '');
  const [editKeywords, setEditKeywords] = useState(selectedRule?.keywords || '');
  const [editDelay, setEditDelay] = useState(selectedRule?.delaySeconds || 0);
  const [editEnabled, setEditEnabled] = useState(selectedRule?.enabled ?? true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync form when selected rule changes
  const handleSelectRule = (rule: AutoReplyRule) => {
    setSelectedRuleId(rule.id);
    setEditName(rule.name);
    setEditDesc(rule.desc);
    setEditMessage(rule.replyMessage);
    setEditKeywords(rule.keywords);
    setEditDelay(rule.delaySeconds);
    setEditEnabled(rule.enabled);
  };

  // Toggle rule status
  const handleToggleRule = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRules(rules.map(r => {
      if (r.id === id) {
        const nextState = !r.enabled;
        if (r.id === selectedRuleId) setEditEnabled(nextState);
        showToast(`Rule "${r.name}" sekarang ${nextState ? 'Aktif' : 'Non Aktif'}`);
        return {
          ...r,
          enabled: nextState,
          status: nextState ? 'Aktif' : 'Non Aktif',
          updatedAt: 'Baru saja'
        };
      }
      return r;
    }));
  };

  // Save changes from right panel
  const handleSaveEdit = (activate: boolean = false) => {
    if (!selectedRule) return;
    const finalEnabled = activate ? true : editEnabled;
    setRules(rules.map(r => r.id === selectedRule.id ? {
      ...r,
      name: editName,
      desc: editDesc,
      replyMessage: editMessage,
      keywords: editKeywords,
      delaySeconds: Number(editDelay) || 0,
      enabled: finalEnabled,
      status: finalEnabled ? 'Aktif' : 'Non Aktif',
      updatedAt: 'Baru saja',
      updatedBy: 'Agus Dwi Rianto'
    } : r));
    setEditEnabled(finalEnabled);
    showToast(`Rule "${editName}" berhasil diperbarui!`);
  };

  // Create rule
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleData.name.trim()) return;

    const newRule: AutoReplyRule = {
      id: Date.now().toString(),
      name: newRuleData.name,
      desc: newRuleData.desc || '-',
      triggerType: newRuleData.triggerType,
      condition: newRuleData.triggerType === 'Kata Kunci' ? 'Mengandung kata kunci' : 'Kondisi default',
      keywords: newRuleData.keywords,
      category: newRuleData.category,
      status: 'Aktif',
      triggerCount: 0,
      updatedAt: 'Baru saja',
      updatedBy: 'Agus Dwi Rianto',
      enabled: true,
      replyMessage: newRuleData.replyMessage || 'Pesan otomatis.',
      delaySeconds: Number(newRuleData.delaySeconds) || 0
    };

    setRules([newRule, ...rules]);
    handleSelectRule(newRule);
    setIsCreateOpen(false);
    showToast(`Rule baru "${newRule.name}" berhasil dibuat & diaktifkan!`);
  };

  // Delete rule
  const handleDeleteConfirm = () => {
    if (!targetDeleteRule) return;
    const rem = rules.filter(r => r.id !== targetDeleteRule.id);
    setRules(rem);
    if (rem.length > 0 && selectedRuleId === targetDeleteRule.id) {
      handleSelectRule(rem[0]);
    }
    setIsDeleteOpen(false);
    showToast(`Rule "${targetDeleteRule.name}" telah dihapus.`);
  };

  // Filter rules
  const filteredRules = rules.filter(item => {
    const matchesTab = activeSubTab === 'semua' || 
      (activeSubTab === 'aktif' && item.enabled) || 
      (activeSubTab === 'nonaktif' && !item.enabled);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua Kategori' || item.category === categoryFilter;
    const matchesTrigger = triggerFilter === 'Semua Trigger' || item.triggerType === triggerFilter;
    return matchesTab && matchesSearch && matchesCategory && matchesTrigger;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Rule', 'Trigger', 'Kata Kunci', 'Kategori', 'Status', 'Jumlah Dijalankan', 'Pesan Balasan'];
    const rows = filteredRules.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.triggerType,
      `"${r.keywords.replace(/"/g, '""')}"`,
      r.category,
      r.status,
      r.triggerCount,
      `"${r.replyMessage.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `whatsapp_autoreply_rules_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Aturan auto-reply berhasil diekspor.');
  };

  // KPIs
  const totalRules = rules.length;
  const activeCount = rules.filter(r => r.enabled).length;
  const inactiveCount = rules.filter(r => !r.enabled).length;
  const totalTriggerToday = rules.reduce((acc, r) => acc + r.triggerCount, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400">
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
              <span className="text-blue-500 font-semibold">Bot Balasan Otomatis</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Aturan Respon Otomatis (Auto-Reply Bot)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Otomasi respon pesan masuk berdasarkan kata kunci (contoh: "tagihan", "gangguan", "cara bayar") 24/7.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/whatsapp/chat" className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/30 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-xl transition-all">
              Live Inbox CS
            </Link>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <PlusCircle size={15} />
              <span>Tambah Rule Baru</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Rule</p>
              <p className="text-xl font-black text-[var(--app-text)]">{totalRules}</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Aktif</p>
              <p className="text-xl font-black text-green-500">{activeCount}</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
              <XCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Non Aktif</p>
              <p className="text-xl font-black text-red-500">{inactiveCount}</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl">
              <Play size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Dijalankan</p>
              <p className="text-xl font-black text-[var(--app-text)]">{totalTriggerToday}</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Success Rate</p>
              <p className="text-xl font-black text-teal-500">98.4%</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Avg Latensi</p>
              <p className="text-xl font-black text-purple-500">1.2s</p>
            </div>
          </div>
        </div>

        {/* ─── Sub-tabs row ──────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--app-border)] text-xs font-bold text-[var(--app-muted)] pb-px overflow-x-auto gap-2">
          {[
            { id: 'semua', label: `Semua Rule (${rules.length})` },
            { id: 'aktif', label: `Aktif (${activeCount})` },
            { id: 'nonaktif', label: `Non Aktif (${inactiveCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition-all ${
                activeSubTab === tab.id ? 'border-blue-500 text-blue-500 font-bold' : 'border-transparent hover:text-[var(--app-text)]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari rule atau kata kunci..."
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[130px]"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Umum">Umum</option>
              <option value="Layanan">Layanan</option>
              <option value="Transaksi">Transaksi</option>
              <option value="Informasi">Informasi</option>
              <option value="Support">Support</option>
            </select>

            <select 
              value={triggerFilter}
              onChange={e => setTriggerFilter(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none min-w-[130px]"
            >
              <option value="Semua Trigger">Semua Trigger</option>
              <option value="Pesan Masuk">Pesan Masuk</option>
              <option value="Di Luar Jam Kerja">Di Luar Jam Kerja</option>
              <option value="Kata Kunci">Kata Kunci</option>
              <option value="Status Pembayaran">Status Pembayaran</option>
            </select>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
            >
              <Download size={13} className="text-green-500" />
              <span>Ekspor</span>
            </button>
          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: List (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-[var(--app-text)]">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3.5">NAMA RULE</th>
                      <th className="p-3.5 w-28 text-center">TRIGGER</th>
                      <th className="p-3.5 w-20 text-center">KATEGORI</th>
                      <th className="p-3.5 w-16 text-center">STATUS</th>
                      <th className="p-3.5 w-16 text-center">TRIGGER</th>
                      <th className="p-3.5 text-center w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {filteredRules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[var(--app-muted)]">
                          Tidak ada aturan auto-reply yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRules.map(item => {
                        const isSelected = selectedRuleId === item.id;
                        return (
                          <tr 
                            key={item.id} 
                            onClick={() => handleSelectRule(item)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-600/10 hover:bg-blue-600/15' : 'hover:bg-[var(--app-border)]/20'
                            }`}
                          >
                            <td className="p-3.5">
                              <div className="flex gap-2.5 items-center">
                                <div className="p-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg shrink-0">
                                  <Sliders size={14} />
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <p className="font-bold text-[var(--app-text)] leading-tight truncate">{item.name}</p>
                                  <p className="text-[10px] text-[var(--app-muted)] truncate max-w-[200px]">{item.desc}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                {item.triggerType}
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-medium text-[var(--app-muted)] text-[11px]">{item.category}</td>
                            <td className="p-3.5 text-center">
                              <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                item.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-bold text-[var(--app-text)]">{item.triggerCount}</td>
                            <td className="p-3.5" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={(e) => handleToggleRule(item.id, e)}
                                  className={`w-8 h-4 rounded-full transition-all relative ${item.enabled ? 'bg-green-600' : 'bg-gray-400'}`}
                                  title={item.enabled ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                  <span className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                                </button>
                                <button 
                                  onClick={() => { setTargetDeleteRule(item); setIsDeleteOpen(true); }}
                                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                  title="Hapus Rule"
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

            {/* Live Message Simulator Preview */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)] flex items-center gap-2">
                <Smartphone size={14} className="text-green-500" />
                Simulasi Preview Balasan WhatsApp di Smartphone
              </h4>
              
              <div className="max-w-md mx-auto bg-[#0b141a] rounded-2xl p-4 shadow-xl border border-gray-800 space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">AudiraNET Bot</p>
                      <p className="text-[9px] text-green-400">Online 24/7</p>
                    </div>
                  </div>
                </div>

                {/* Inbound mock */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] text-white text-xs p-2.5 rounded-xl rounded-tr-xs max-w-[80%] shadow-sm">
                    <p>{selectedRule?.keywords ? selectedRule.keywords.split(',')[0].trim() : 'Halo admin'}</p>
                    <span className="text-[8px] text-gray-300 block text-right mt-1">12:00</span>
                  </div>
                </div>

                {/* Auto Reply output */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-white text-xs p-2.5 rounded-xl rounded-tl-xs max-w-[85%] shadow-sm space-y-1">
                    <p className="whitespace-pre-line leading-relaxed font-sans">{editMessage || 'Pesan balasan kosong.'}</p>
                    <div className="flex justify-between items-center text-[8px] text-gray-400 pt-1">
                      <span className="italic">Auto-reply ({editDelay}s delay)</span>
                      <span>12:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Edit Auto Reply Form (5/12 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--app-border)]">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Konfigurasi Rule</h3>
                  <p className="text-xs font-bold text-[var(--app-text)] mt-0.5">{selectedRule?.name}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase">{editEnabled ? 'Aktif' : 'Non Aktif'}</span>
                  <button 
                    onClick={() => setEditEnabled(!editEnabled)}
                    className={`w-9 h-5 rounded-full transition-all relative ${editEnabled ? 'bg-green-600' : 'bg-gray-400'}`}
                  >
                    <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${editEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-[var(--app-muted)]">
                
                {/* Rule Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[var(--app-text)]">Nama Rule</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" 
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[var(--app-text)]">Deskripsi Tujuan</label>
                  <input 
                    type="text" 
                    value={editDesc} 
                    onChange={e => setEditDesc(e.target.value)} 
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" 
                  />
                </div>

                {/* Keywords if trigger is Kata Kunci */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[var(--app-text)]">Kata Kunci Pemicu (Pisahkan dengan koma)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: tagihan, bayar, invoice, rekening"
                    value={editKeywords} 
                    onChange={e => setEditKeywords(e.target.value)} 
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3.5 py-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500" 
                  />
                </div>

                {/* Delay */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[var(--app-text)]">Delay Pengiriman Respon (Detik)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min={0}
                      max={60}
                      value={editDelay} 
                      onChange={e => setEditDelay(Number(e.target.value))} 
                      className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs px-3 py-2 text-[var(--app-text)] focus:outline-none w-20 text-center font-bold" 
                    />
                    <span className="text-[11px] text-[var(--app-muted)]">detik (memberikan impresi natural manusia)</span>
                  </div>
                </div>

                {/* Pesan Balasan */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--app-border)]">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-[var(--app-text)]">Teks Pesan Balasan Bot</label>
                    <span className="text-[9px] text-[var(--app-muted)]">{editMessage.length} karakter</span>
                  </div>
                  
                  <textarea 
                    rows={6} 
                    value={editMessage}
                    onChange={e => setEditMessage(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs p-3 text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                  />

                  {/* Variable chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['{{nama}}', '{{tagihan}}', '{{paket}}', '{{jatuh_tempo}}', '{{no_layanan}}'].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setEditMessage(prev => prev + ' ' + v)}
                        className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-md text-[10px] font-mono transition-colors"
                      >
                        + {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form action buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--app-border)]">
                  <button 
                    type="button"
                    onClick={() => selectedRule && handleSelectRule(selectedRule)}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Reset
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSaveEdit(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    Simpan Perubahan
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ─── MODAL: Buat Rule Baru ─────────────────────────────────────── */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <PlusCircle size={16} className="text-blue-500" />
                  Tambah Aturan Auto-Reply Baru
                </h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Nama Rule *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Respon Pertanyaan Password Wifi"
                    value={newRuleData.name}
                    onChange={e => setNewRuleData({ ...newRuleData, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Jenis Trigger</label>
                    <select 
                      value={newRuleData.triggerType}
                      onChange={e => setNewRuleData({ ...newRuleData, triggerType: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    >
                      <option value="Kata Kunci">Kata Kunci</option>
                      <option value="Pesan Masuk">Pesan Masuk</option>
                      <option value="Di Luar Jam Kerja">Di Luar Jam Kerja</option>
                      <option value="Status Pembayaran">Status Pembayaran</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Kategori</label>
                    <select 
                      value={newRuleData.category}
                      onChange={e => setNewRuleData({ ...newRuleData, category: e.target.value as any })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    >
                      <option value="Umum">Umum</option>
                      <option value="Layanan">Layanan</option>
                      <option value="Transaksi">Transaksi</option>
                      <option value="Informasi">Informasi</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                </div>

                {newRuleData.triggerType === 'Kata Kunci' && (
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--app-text)]">Kata Kunci Pemicu (Koma dipisah)</label>
                    <input 
                      type="text"
                      placeholder="password, wifi, sandi, ganti password"
                      value={newRuleData.keywords}
                      onChange={e => setNewRuleData({ ...newRuleData, keywords: e.target.value })}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--app-text)]">Pesan Balasan Otomatis *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Tulis pesan yang akan dikirim bot secara instan..."
                    value={newRuleData.replyMessage}
                    onChange={e => setNewRuleData({ ...newRuleData, replyMessage: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-2.5 text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-mono"
                  />
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
                    Buat & Aktifkan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Hapus Rule ─────────────────────────────────────────── */}
        {isDeleteOpen && targetDeleteRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--app-text)]">Hapus Aturan Ini?</h3>
                <p className="text-xs text-[var(--app-muted)]">
                  Rule <strong className="text-[var(--app-text)]">"{targetDeleteRule.name}"</strong> akan dihapus dan bot tidak akan merespon pemicu ini lagi.
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

      </div>
    </Layout>
  );
}
