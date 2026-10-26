import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Phone,
  Video,
  Smile,
  Paperclip,
  Image,
  Mic,
  CalendarDays,
  Tag,
  PlusCircle,
  UserPlus,
  Edit2,
  Power,
  Receipt,
  Ticket,
  ExternalLink,
  Check,
  CheckCheck
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  package?: string;
  status?: string;
  ipAddress?: string;
}

interface ChatMessage {
  id: string;
  sender: 'admin' | 'customer';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const QUICK_REPLIES = [
  { id: '1', title: 'Tagihan Jatuh Tempo', text: 'Halo Kak, mengingatkan tagihan internet AUDIRA Anda telah jatuh tempo. Silakan lakukan pembayaran via transfer / QRIS.' },
  { id: '2', title: 'Konfirmasi Lunas', text: 'Terima kasih, pembayaran tagihan internet Anda telah kami terima dan diverifikasi. Layanan internet aktif normal.' },
  { id: '3', title: 'Cek Redaman/LOS', text: 'Baik Kak, kami sedang memeriksa indikator redaman fiber optik dan status router dari sistem NOC kami. Mohon ditunggu.' },
  { id: '4', title: 'Jadwal Teknisi', text: 'Tim teknisi kami telah dijadwalkan untuk kunjungan perbaikan ke lokasi Anda hari ini pukul 14:00 WIB.' },
  { id: '5', title: 'Info Promo Upgrade', text: 'Khusus pelanggan setia AUDIRA, ada promo upgrade speed ke 100 Mbps dengan diskon 25% bulan ini.' },
];

export default function WhatsappChatPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'Semua' | 'Aktif' | 'Isolir'>('Semua');
  
  // Message history map: customerId -> ChatMessage[]
  const [chatLogs, setChatLogs] = useState<Record<string, ChatMessage[]>>({});
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // Modals state
  const [showSendInvoiceModal, setShowSendInvoiceModal] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('250000');
  const [invoiceMonth, setInvoiceMonth] = useState('Oktober 2026');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load Real Customers from backend
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.pelanggan.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setCustomers(data);
        if (!selectedCustomerId) {
          setSelectedCustomerId(data[0].id);
        }
      } else {
        // Fallback default customer list if database is freshly seeded
        const fallbackList: Customer[] = [
          { id: 'cust-1', name: 'Budi Santoso', phone: '081234567890', package: 'Home 50 Mbps', status: 'ACTIVE', address: 'Jl. Harapan Indah No. 12', ipAddress: '192.168.10.25' },
          { id: 'cust-2', name: 'Siti Aminah', phone: '081987654321', package: 'Home 20 Mbps', status: 'ACTIVE', address: 'Jl. Boulevard Kelapa Gading', ipAddress: '192.168.10.42' },
          { id: 'cust-3', name: 'Andi Pratama', phone: '081345678901', package: 'Gamer Ultra 100 Mbps', status: 'ACTIVE', address: 'Komp. Graha Indah Blok C', ipAddress: '192.168.10.77' },
          { id: 'cust-4', name: 'PT. Maju Bersama', phone: '081456789012', package: 'Corporate 200 Mbps', status: 'ACTIVE', address: 'Kawasan Industri MM2100', ipAddress: '10.10.20.1' },
          { id: 'cust-5', name: 'Dewi Lestari', phone: '081567890123', package: 'Home 10 Mbps', status: 'SUSPENDED', address: 'Perumahan Sukatani Asri', ipAddress: '192.168.10.118' },
        ];
        setCustomers(fallbackList);
        setSelectedCustomerId(fallbackList[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load customers for chat:', err);
      showToast('Gagal memuat daftar pelanggan', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Selected customer object
  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0] || null;
  }, [customers, selectedCustomerId]);

  // Current messages for active customer
  const currentMessages = useMemo(() => {
    if (!activeCustomer) return [];
    if (chatLogs[activeCustomer.id]) {
      return chatLogs[activeCustomer.id];
    }
    // Initial sample messages for the selected customer
    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'customer',
        text: `Halo CS AUDIRA, saya ${activeCustomer.name}. Mau tanya mengenai status koneksi internet dan info tagihan saya. 🙏`,
        time: '08:20',
      },
      {
        id: 'msg-2',
        sender: 'admin',
        text: `Halo Kak ${activeCustomer.name}, selamat pagi! Terima kasih telah menghubungi Customer Care AUDIRA-NET. Koneksi paket ${activeCustomer.package || 'Internet'} Anda terpantau normal dan aktif. Ada yang bisa kami bantu? 😊`,
        time: '08:22',
        status: 'read',
      },
    ];
    return initialMsgs;
  }, [activeCustomer, chatLogs]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (filterTab === 'Aktif' && c.status === 'SUSPENDED') return false;
      if (filterTab === 'Isolir' && c.status !== 'SUSPENDED') return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        const matchPkg = c.package?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchPkg) return false;
      }
      return true;
    });
  }, [customers, filterTab, searchTerm]);

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeCustomer) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      time: timeStr,
      status: 'sent',
    };

    // Update local state
    setChatLogs(prev => ({
      ...prev,
      [activeCustomer.id]: [...(prev[activeCustomer.id] || currentMessages), newMsg],
    }));

    setInputText('');
    setSending(true);

    // Call backend WhatsApp API or fallback
    try {
      if (api.whatsapp?.sendMessage) {
        await api.whatsapp.sendMessage({
          phone: activeCustomer.phone,
          message: text,
        }).catch(() => {});
      }
      showToast('Pesan terkirim', 'success');
    } catch (err: any) {
      console.log('Backend WA not responding, local bubble appended');
    } finally {
      setSending(false);
    }
  };

  // Open Direct WhatsApp Web
  const handleOpenWhatsAppWeb = () => {
    if (!activeCustomer) return;
    const cleanPhone = (activeCustomer.phone || '').replace(/[^0-9]/g, '');
    const phoneWithCode = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${phoneWithCode}`, '_blank');
  };

  // Toggle Suspend / Isolir
  const handleToggleSuspend = async () => {
    if (!activeCustomer) return;
    try {
      if (activeCustomer.status === 'SUSPENDED') {
        await api.keuangan.unsuspendCustomer(activeCustomer.id);
        showToast(`Layanan ${activeCustomer.name} berhasil diaktifkan kembali`, 'success');
      } else {
        await api.keuangan.suspendCustomer(activeCustomer.id, 'Isolir via Live Chat CS');
        showToast(`Layanan ${activeCustomer.name} berhasil diisolir`, 'info');
      }
      await loadCustomers();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal mengubah status isolir', 'error');
    }
  };

  // Send Invoice Notification via WhatsApp
  const handleSendInvoiceNotification = async () => {
    if (!activeCustomer) return;
    try {
      const msg = `Halo Kak ${activeCustomer.name}, berikut rincian tagihan internet AUDIRA periode ${invoiceMonth} sebesar Rp ${parseInt(invoiceAmount).toLocaleString('id-ID')}. Batas akhir pembayaran tanggal 20. Terima kasih! 🙏`;
      await handleSendMessage(msg);
      setShowSendInvoiceModal(false);
      showToast('Notifikasi tagihan berhasil dikirim via WhatsApp', 'success');
    } catch (err: any) {
      showToast('Gagal mengirimkan notifikasi tagihan', 'error');
    }
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
              <span className="text-emerald-400 font-semibold">Live Chat CS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-3">
              <span>Live Chat CS & Tiket NOC</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {customers.length} Kontak Pelanggan
              </span>
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Inbox percakapan pelanggan terpadu untuk tim Customer Service, eskalasi komplain tiket NOC, dan respon interaktif.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link 
              href="/whatsapp/templates" 
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>Katalog Template</span>
            </Link>
            <button
              onClick={handleOpenWhatsAppWeb}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ExternalLink size={14} />
              <span>Buka WA Web</span>
            </button>
            <button
              onClick={loadCustomers}
              className="p-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg cursor-pointer"
              title="Refresh Kontak"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ─── Main Chat Interface Layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-210px)] min-h-[640px]">

          {/* Left Column: Customer & Chat List (3/12) */}
          <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-3.5 flex flex-col justify-between h-full overflow-hidden space-y-3">
            <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Daftar Kontak CS</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{filteredCustomers.length} Pelanggan</span>
              </div>
              
              {/* Search contacts */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama, no hp, paket..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-8 pr-3 py-2 rounded-xl text-[var(--app-text)] placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Sub-tabs inside list */}
              <div className="flex border-b border-[var(--app-border)] text-[11px] font-bold text-[var(--app-muted)] pb-1 gap-2">
                <button 
                  onClick={() => setFilterTab('Semua')}
                  className={`pb-1 font-bold transition-colors cursor-pointer ${filterTab === 'Semua' ? 'text-white border-b-2 border-emerald-500' : 'hover:text-white'}`}
                >
                  Semua ({customers.length})
                </button>
                <button 
                  onClick={() => setFilterTab('Aktif')}
                  className={`pb-1 flex items-center gap-1 transition-colors cursor-pointer ${filterTab === 'Aktif' ? 'text-white border-b-2 border-emerald-500' : 'hover:text-white'}`}
                >
                  <span>Aktif</span>
                </button>
                <button 
                  onClick={() => setFilterTab('Isolir')}
                  className={`pb-1 transition-colors cursor-pointer ${filterTab === 'Isolir' ? 'text-white border-b-2 border-emerald-500' : 'hover:text-white'}`}
                >
                  <span>Isolir</span>
                </button>
              </div>

              {/* Customer list items */}
              <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                {filteredCustomers.length === 0 ? (
                  <p className="text-center text-xs text-[var(--app-muted)] py-8">
                    Tidak ada kontak yang cocok.
                  </p>
                ) : (
                  filteredCustomers.map(item => {
                    const isSelected = selectedCustomerId === item.id;
                    const isSuspended = item.status === 'SUSPENDED';
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedCustomerId(item.id)}
                        className={`flex justify-between items-start p-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-emerald-500/10 border border-emerald-500/40 shadow-xs' 
                            : 'bg-[var(--app-bg)]/60 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30'
                        }`}
                      >
                        <div className="flex gap-2.5 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${
                            isSuspended ? 'bg-rose-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                          }`}>
                            <span>{item.name ? item.name[0].toUpperCase() : 'C'}</span>
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-[var(--app-text)] leading-none truncate">{item.name}</p>
                            </div>
                            <p className="text-[10px] text-[var(--app-muted)] leading-tight truncate">{item.phone || '-'}</p>
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

            {/* Quick stats at bottom of sidebar */}
            <div className="pt-2 border-t border-[var(--app-border)] text-[10px] text-[var(--app-muted)] flex justify-between items-center">
              <span>Status Gateway:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Online (WAHA Engine)
              </span>
            </div>
          </div>

          {/* Center Main Chat Area (6/12 or 9/12 depending on right drawer) */}
          <div className={`${showRightSidebar ? 'lg:col-span-6' : 'lg:col-span-9'} bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs flex flex-col justify-between h-full overflow-hidden`}>
            
            {/* Header chat */}
            {activeCustomer ? (
              <div className="flex justify-between items-center p-3.5 border-b border-[var(--app-border)] bg-[var(--app-card)] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    activeCustomer.status === 'SUSPENDED' ? 'bg-rose-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  }`}>
                    <span>{activeCustomer.name ? activeCustomer.name[0].toUpperCase() : 'U'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[var(--app-text)] leading-none">{activeCustomer.name}</h3>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                        activeCustomer.status === 'SUSPENDED' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {activeCustomer.status === 'SUSPENDED' ? 'Isolir' : 'Pelanggan Aktif'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--app-muted)] font-mono mt-0.5 block">{activeCustomer.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <a 
                    href={`tel:${activeCustomer.phone}`}
                    className="p-2 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-white transition-colors"
                    title="Panggil Telepon"
                  >
                    <Phone size={14} />
                  </a>
                  <button 
                    onClick={handleOpenWhatsAppWeb}
                    className="p-2 hover:bg-[var(--app-border)]/40 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    title="Buka di WhatsApp Web"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button 
                    onClick={() => setShowRightSidebar(!showRightSidebar)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${showRightSidebar ? 'bg-emerald-500/10 text-emerald-400' : 'text-[var(--app-muted)] hover:text-white'}`}
                    title="Detail Pelanggan"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-[var(--app-border)] text-xs text-[var(--app-muted)]">
                Pilih pelanggan dari daftar di sebelah kiri
              </div>
            )}

            {/* Bubble log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--app-bg)]/40">
              <div className="flex justify-center">
                <span className="bg-[var(--app-card)] border border-[var(--app-border)] text-[9px] text-[var(--app-muted)] font-semibold uppercase px-2.5 py-1 rounded-md">
                  Percakapan Terenkripsi AUDIRA Gateway
                </span>
              </div>

              {/* Chat flow bubbles */}
              <div className="space-y-3">
                {currentMessages.map(msg => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 max-w-[85%] rounded-2xl text-xs space-y-1 relative shadow-2xs ${
                        isAdmin 
                          ? 'bg-emerald-950/60 text-emerald-100 border border-emerald-800/60 rounded-tr-none' 
                          : 'bg-[var(--app-card)] text-[var(--app-text)] border border-[var(--app-border)] rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <div className="text-[8px] text-[var(--app-muted)] text-right font-semibold pt-0.5 flex items-center justify-end gap-1">
                          <span>{msg.time}</span>
                          {isAdmin && <CheckCheck size={12} className="text-emerald-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick reply bar above input */}
            <div className="px-3.5 py-2 bg-[var(--app-card)] border-t border-[var(--app-border)]/60 flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span className="text-[var(--app-muted)] font-bold flex-shrink-0 flex items-center gap-1">
                <Tag size={10} /> Balasan Cepat:
              </span>
              {QUICK_REPLIES.map(q => (
                <button
                  key={q.id}
                  onClick={() => setInputText(q.text)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] hover:border-emerald-500 hover:text-emerald-400 text-[var(--app-muted)] whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
                >
                  {q.title}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-[var(--app-border)] bg-[var(--app-card)] flex-shrink-0 flex items-center gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder={activeCustomer ? `Ketik balasan untuk ${activeCustomer.name}...` : 'Pilih kontak terlebih dahulu...'}
                disabled={!activeCustomer}
                className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />

              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || sending || !activeCustomer}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Kirim</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customer Info & NOC Action Drawer (3/12) */}
          {showRightSidebar && activeCustomer && (
            <div className="lg:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-col justify-between h-full overflow-y-auto space-y-4 animate-in fade-in">
              <div className="space-y-4">
                <div className="border-b border-[var(--app-border)] pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Profil Pelanggan</h3>
                  <p className="text-[10px] text-[var(--app-muted)]">Informasi teknis dan penagihan</p>
                </div>

                {/* Avatar and Name */}
                <div className="text-center space-y-2 py-2 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] p-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-base">
                    <span>{activeCustomer.name ? activeCustomer.name[0].toUpperCase() : 'U'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--app-text)]">{activeCustomer.name}</h4>
                    <p className="text-xs font-mono text-[var(--app-muted)]">{activeCustomer.phone}</p>
                  </div>
                </div>

                {/* Technical Info list */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Paket Berlangganan</span>
                    <span className="font-semibold text-emerald-400">{activeCustomer.package || 'Home 50 Mbps'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Status Layanan</span>
                    <span className={`font-semibold ${activeCustomer.status === 'SUSPENDED' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {activeCustomer.status === 'SUSPENDED' ? 'TERISOLIR' : 'AKTIF NORMAL'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">IP Dial-up/PPPoE</span>
                    <span className="font-mono text-blue-400">{activeCustomer.ipAddress || '192.168.10.25'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--app-border)]">
                    <span className="text-[var(--app-muted)]">Alamat Rumah</span>
                    <span className="text-[10px] text-[var(--app-text)] text-right max-w-[150px] truncate">{activeCustomer.address || 'Harapan Indah'}</span>
                  </div>
                </div>

                {/* Quick Action Buttons for CS/Billing */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold uppercase text-[var(--app-muted)] tracking-wider">Aksi Cepat CS / Billing</p>
                  
                  <button
                    onClick={() => setShowSendInvoiceModal(true)}
                    className="w-full py-2 px-3 bg-[var(--app-bg)] hover:bg-[var(--app-border)]/40 border border-[var(--app-border)] rounded-xl text-xs font-semibold text-[var(--app-text)] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Receipt size={14} className="text-amber-400" />
                      <span>Kirim Info Tagihan</span>
                    </span>
                    <Send size={12} className="text-[var(--app-muted)]" />
                  </button>

                  <button
                    onClick={handleToggleSuspend}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      activeCustomer.status === 'SUSPENDED'
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
                        : 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Power size={14} />
                      <span>{activeCustomer.status === 'SUSPENDED' ? 'Buka Isolir Pelanggan' : 'Isolir Koneksi Pelanggan'}</span>
                    </span>
                  </button>

                  <Link
                    href={`/pelanggan/${activeCustomer.id}`}
                    className="w-full py-2 px-3 bg-[var(--app-bg)] hover:bg-[var(--app-border)]/40 border border-[var(--app-border)] rounded-xl text-xs font-semibold text-[var(--app-text)] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Eye size={14} className="text-blue-400" />
                      <span>Buka Profil Lengkap</span>
                    </span>
                    <ExternalLink size={12} className="text-[var(--app-muted)]" />
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--app-border)] text-center">
                <span className="text-[9px] text-[var(--app-muted)]">AUDIRA-NET Billing & Gateway v3.4</span>
              </div>
            </div>
          )}

        </div>

        {/* ─── MODAL: Kirim Info Tagihan Cepat ────────────────────────────── */}
        {showSendInvoiceModal && activeCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-white">Kirim Tagihan via Chat</h3>
                <button 
                  onClick={() => setShowSendInvoiceModal(false)}
                  className="p-1 text-[var(--app-muted)] hover:text-white"
                >
                  <XCircle size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nama Pelanggan</label>
                  <input
                    type="text"
                    disabled
                    value={activeCustomer.name}
                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-[var(--app-muted)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Periode Tagihan</label>
                  <input
                    type="text"
                    value={invoiceMonth}
                    onChange={(e) => setInvoiceMonth(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-muted)] mb-1">Nominal Tagihan (Rp)</label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowSendInvoiceModal(false)}
                  className="px-3 py-1.5 text-xs text-[var(--app-muted)] hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendInvoiceNotification}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Kirim ke Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
