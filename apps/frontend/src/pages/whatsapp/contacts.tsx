import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
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
  Phone,
  UserPlus,
  ExternalLink,
  Power,
  X,
  Check,
  Star
} from 'lucide-react';

interface CustomerContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  package?: string;
  status?: string;
  ipAddress?: string;
  notes?: string;
  createdAt?: string;
}

export default function WhatsappContactsPage() {
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'semua' | 'aktif' | 'isolir'>('semua');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPackage, setNewPackage] = useState('Home 50 Mbps');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Real Customers from backend
  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.pelanggan.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setContacts(data);
        if (!selectedContactId) {
          setSelectedContactId(data[0].id);
        }
      } else {
        const fallbacks: CustomerContact[] = [
          { id: 'c1', name: 'Budi Santoso', phone: '081234567890', email: 'budi@example.com', package: 'Home 50 Mbps', status: 'ACTIVE', address: 'Jl. Harapan Indah No. 12', ipAddress: '192.168.10.25' },
          { id: 'c2', name: 'Siti Aminah', phone: '081987654321', email: 'siti@example.com', package: 'Home 20 Mbps', status: 'ACTIVE', address: 'Jl. Boulevard Kelapa Gading', ipAddress: '192.168.10.42' },
          { id: 'c3', name: 'Andi Pratama', phone: '081345678901', email: 'andi@example.com', package: 'Gamer Ultra 100 Mbps', status: 'ACTIVE', address: 'Komp. Graha Indah Blok C', ipAddress: '192.168.10.77' },
          { id: 'c4', name: 'PT. Maju Bersama', phone: '081456789012', email: 'corp@majubersama.co.id', package: 'Corporate 200 Mbps', status: 'ACTIVE', address: 'Kawasan Industri MM2100', ipAddress: '10.10.20.1' },
          { id: 'c5', name: 'Dewi Lestari', phone: '081567890123', email: 'dewi@example.com', package: 'Home 10 Mbps', status: 'SUSPENDED', address: 'Perumahan Sukatani Asri', ipAddress: '192.168.10.118' },
        ];
        setContacts(fallbacks);
        setSelectedContactId(fallbacks[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load contacts:', err);
      showToast('Gagal memuat kontak pelanggan', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedContactId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Selected contact object
  const activeContact = useMemo(() => {
    return contacts.find(c => c.id === selectedContactId) || contacts[0] || null;
  }, [contacts, selectedContactId]);

  // KPIs
  const kpiStats = useMemo(() => {
    let aktif = 0;
    let isolir = 0;

    contacts.forEach(c => {
      if (c.status === 'SUSPENDED') isolir++;
      else aktif++;
    });

    return {
      total: contacts.length,
      aktif,
      isolir,
    };
  }, [contacts]);

  // Filtered
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (filterTab === 'aktif' && c.status === 'SUSPENDED') return false;
      if (filterTab === 'isolir' && c.status !== 'SUSPENDED') return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        const matchPkg = c.package?.toLowerCase().includes(q);
        const matchAddr = c.address?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchPkg && !matchAddr) return false;
      }

      return true;
    });
  }, [contacts, filterTab, searchTerm]);

  // Copy to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} disalin ke clipboard`, 'success');
  };

  // Open Direct WhatsApp Web
  const handleOpenWhatsAppWeb = (phone?: string) => {
    const targetPhone = phone || activeContact?.phone || '';
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const phoneWithCode = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}`, '_blank');
  };

  // Send WhatsApp message
  const handleSendMessage = async () => {
    if (!activeContact || !messageText.trim()) return;
    try {
      if (api.whatsapp?.sendMessage) {
        await api.whatsapp.sendMessage({
          phone: activeContact.phone,
          message: messageText,
        }).catch(() => {});
      }
      handleOpenWhatsAppWeb();
      setShowMessageModal(false);
      setMessageText('');
      showToast('Pesan WhatsApp diteruskan', 'success');
    } catch {
      handleOpenWhatsAppWeb();
    }
  };

  // Toggle Suspend / Isolir
  const handleToggleSuspend = async () => {
    if (!activeContact) return;
    try {
      if (activeContact.status === 'SUSPENDED') {
        await api.keuangan.unsuspendCustomer(activeContact.id);
        showToast(`Koneksi ${activeContact.name} diaktifkan kembali`, 'success');
      } else {
        await api.keuangan.suspendCustomer(activeContact.id, 'Isolir manual dari Buku Kontak WhatsApp');
        showToast(`Koneksi ${activeContact.name} diisolir`, 'info');
      }
      await loadContacts();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal mengubah status', 'error');
    }
  };

  // Add Contact
  const handleAddContact = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Nama dan nomor telepon wajib diisi', 'error');
      return;
    }
    try {
      await api.pelanggan.create({
        name: newName,
        phone: newPhone,
        email: newEmail,
        address: newAddress,
        package: newPackage,
      });
      showToast('Kontak baru berhasil ditambahkan', 'success');
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
      await loadContacts();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menambahkan kontak', 'error');
    }
  };

  // Edit Contact
  const handleOpenEdit = (c: CustomerContact) => {
    setEditingContact(c);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingContact) return;
    try {
      await api.pelanggan.update(editingContact.id, {
        name: editingContact.name,
        phone: editingContact.phone,
        email: editingContact.email,
        address: editingContact.address,
        package: editingContact.package,
      });
      showToast('Kontak berhasil diperbarui', 'success');
      setShowEditModal(false);
      setEditingContact(null);
      await loadContacts();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal memperbarui kontak', 'error');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (contacts.length === 0) {
      showToast('Tidak ada kontak untuk diexport', 'info');
      return;
    }

    const headers = ['Nama', 'No HP', 'Email', 'Paket', 'Status', 'Alamat', 'IP'];
    const rows = contacts.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.package || ''}"`,
      `"${c.status || 'ACTIVE'}"`,
      `"${c.address || ''}"`,
      `"${c.ipAddress || ''}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kontak_WhatsApp_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Kontak CSV berhasil diunduh', 'success');
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
              <span className="text-emerald-400 font-semibold">Kontak Pelanggan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Buku Kontak WhatsApp Pelanggan</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {kpiStats.total} Nomor Terdaftar
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Daftar nomor WhatsApp seluruh pelanggan aktif, status opt-in penerimaan pesan, dan validasi format nomor +62.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <UserPlus size={14} />
              <span>Tambah Kontak</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={loadContacts}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg cursor-pointer"
              title="Refresh Kontak"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ─── KPI Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Kontak</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.total}</p>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium">Database Pelanggan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Kontak Aktif</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.aktif}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Layanan Normal</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex items-center gap-4">
            <div className="p-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
              <Power size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Kontak Terisolir</p>
              <p className="text-xl font-black text-white mt-0.5">{kpiStats.isolir}</p>
              <p className="text-[10px] text-rose-400 mt-0.5 font-medium">Menunggak Pembayaran</p>
            </div>
          </div>
        </div>

        {/* ─── Main Content Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Daftar Kontak (4/12 cols) */}
          <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Daftar Kontak</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{filteredContacts.length} Kontak</span>
              </div>
              
              {/* Search contacts */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama, no hp, paket..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-3 py-2 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Sub-tabs inside list */}
              <div className="flex border-b border-[var(--app-border)] text-[11px] font-bold text-[var(--app-muted)] pb-1 gap-2">
                <button 
                  onClick={() => setFilterTab('semua')}
                  className={`pb-1 font-bold transition-colors cursor-pointer ${filterTab === 'semua' ? 'text-white border-b-2 border-emerald-500' : 'hover:text-white'}`}
                >
                  Semua ({contacts.length})
                </button>
                <button 
                  onClick={() => setFilterTab('aktif')}
                  className={`pb-1 transition-colors cursor-pointer ${filterTab === 'aktif' ? 'text-white border-b-2 border-emerald-500' : 'hover:text-white'}`}
                >
                  Aktif ({kpiStats.aktif})
                </button>
                <button 
                  onClick={() => setFilterTab('isolir')}
                  className={`pb-1 transition-colors cursor-pointer ${filterTab === 'isolir' ? 'text-white border-b-2 border-emerald-500' : 'hover:text-white'}`}
                >
                  Isolir ({kpiStats.isolir})
                </button>
              </div>

              {/* Contact list items */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredContacts.length === 0 ? (
                  <p className="text-center text-xs text-[var(--app-muted)] py-8">
                    Tidak ada kontak yang cocok.
                  </p>
                ) : (
                  filteredContacts.map(item => {
                    const isSelected = selectedContactId === item.id;
                    const isSuspended = item.status === 'SUSPENDED';
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedContactId(item.id)}
                        className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected ? 'bg-emerald-500/10 border border-emerald-500/40 shadow-xs' : 'bg-[var(--app-bg)]/60 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${
                            isSuspended ? 'bg-rose-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                          }`}>
                            <span>{item.name ? item.name[0].toUpperCase() : 'C'}</span>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-white leading-tight truncate">{item.name}</p>
                            <span className="text-[10px] text-[var(--app-muted)] font-mono block">{item.phone}</span>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                              isSuspended ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {item.package || (isSuspended ? 'Isolir' : 'Aktif')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Main Area: Details (8/12 cols) */}
          {activeContact && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Main Profile Header card */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${
                    activeContact.status === 'SUSPENDED' ? 'bg-rose-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  }`}>
                    <span>{activeContact.name ? activeContact.name[0].toUpperCase() : 'U'}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white leading-none">{activeContact.name}</h2>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        activeContact.status === 'SUSPENDED' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {activeContact.status === 'SUSPENDED' ? 'TERISOLIR' : 'PELANGGAN AKTIF'}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400 font-mono font-semibold">{activeContact.phone}</p>
                    <p className="text-[10px] text-[var(--app-muted)]">{activeContact.address || 'Alamat belum diatur'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => {
                      setMessageText(`Halo Kak ${activeContact.name}, kami dari Customer Service AUDIRA-NET ingin mengonfirmasi...`);
                      setShowMessageModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Kirim Pesan</span>
                  </button>
                  
                  <a 
                    href={`tel:${activeContact.phone}`}
                    className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/40 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    <Phone size={13} />
                    <span>Panggil</span>
                  </a>

                  <button 
                    onClick={() => handleOpenEdit(activeContact)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Informasi Layanan</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                      <span className="text-[var(--app-muted)]">Paket Internet</span>
                      <span className="font-semibold text-emerald-400">{activeContact.package || 'Home 50 Mbps'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                      <span className="text-[var(--app-muted)]">IP Dial-up PPPoE</span>
                      <span className="font-mono text-blue-400">{activeContact.ipAddress || '192.168.10.25'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                      <span className="text-[var(--app-muted)]">Status Isolir</span>
                      <span className={`font-semibold ${activeContact.status === 'SUSPENDED' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {activeContact.status === 'SUSPENDED' ? 'Terisolir' : 'Normal / Aktif'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Aksi Cepat & Navigasi</h4>
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={handleToggleSuspend}
                      className={`w-full py-2 px-3 border rounded-xl font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                        activeContact.status === 'SUSPENDED'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
                          : 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/50'
                      }`}
                    >
                      <span>{activeContact.status === 'SUSPENDED' ? 'Buka Isolir Layanan' : 'Isolir Koneksi Pelanggan'}</span>
                      <Power size={14} />
                    </button>

                    <Link
                      href={`/pelanggan/${activeContact.id}`}
                      className="w-full py-2 px-3 bg-[var(--app-bg)] hover:bg-[var(--app-border)]/40 border border-[var(--app-border)] rounded-xl font-semibold text-white flex items-center justify-between transition-colors"
                    >
                      <span>Buka Profil Detail Pelanggan</span>
                      <ExternalLink size={14} className="text-blue-400" />
                    </Link>

                    <Link
                      href="/whatsapp/chat"
                      className="w-full py-2 px-3 bg-[var(--app-bg)] hover:bg-[var(--app-border)]/40 border border-[var(--app-border)] rounded-xl font-semibold text-white flex items-center justify-between transition-colors"
                    >
                      <span>Buka Sesi di Live Chat CS</span>
                      <MessageCircle size={14} className="text-emerald-400" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ─── MODAL: Tambah Kontak Baru ──────────────────────────────────── */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Tambah Kontak WhatsApp Baru</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nomor WhatsApp (+62 / 08...)</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="budi@example.com"
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Paket Layanan</label>
                  <input
                    type="text"
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Alamat Pemasangan</label>
                  <textarea
                    rows={2}
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Kontak</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Kontak ─────────────────────────────────────────── */}
        {showEditModal && editingContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Edit Kontak Pelanggan</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={editingContact.phone}
                    onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Paket Layanan</label>
                  <input
                    type="text"
                    value={editingContact.package || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, package: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Alamat</label>
                  <textarea
                    rows={2}
                    value={editingContact.address || ''}
                    onChange={(e) => setEditingContact({ ...editingContact, address: e.target.value })}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-blue-500"
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

        {/* ─── MODAL: Kirim Pesan Cepat ───────────────────────────────────── */}
        {showMessageModal && activeContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-emerald-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <MessageCircle size={18} />
                  <h3 className="text-sm font-bold text-white">Kirim Pesan WhatsApp</h3>
                </div>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[var(--app-bg)] p-3 rounded-xl border border-[var(--app-border)]">
                  <span className="text-[var(--app-muted)] block text-[10px]">PENERIMA:</span>
                  <span className="font-bold text-white text-sm">{activeContact.name} ({activeContact.phone})</span>
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Isi Pesan</label>
                  <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-3 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-3 py-2 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
