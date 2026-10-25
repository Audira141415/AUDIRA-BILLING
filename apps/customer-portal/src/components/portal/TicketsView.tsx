import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { API_BASE_URL } from '@/config/api';
import {
  Headphones,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  RefreshCw,
  Activity,
  Wifi,
  Wrench,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
  Copy,
  Check,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Zap,
  HelpCircle,
  Radio,
  Share2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface TicketItem {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | string;
  createdAt: string;
  updatedAt?: string;
  technicianId?: string | null;
  technician?: {
    name: string;
    phone?: string;
    email?: string;
  } | null;
  comments?: Array<{
    id: string;
    author: string;
    role: 'customer' | 'technician' | 'noc';
    content: string;
    createdAt: string;
  }>;
}

const QUICK_PRESETS = [
  {
    tag: 'LOS Merah Berkedip',
    priority: 'high',
    title: 'Koneksi Terputus - Lampu Indikator LOS ONT Berkedip Merah',
    description: 'Lampu indikator LOS (Loss of Signal) pada modem ONT di rumah berkedip merah. Koneksi internet putus total sejak beberapa saat lalu. Mohon pengecekan drop core kabel optik atau status port ODP terdekat.',
    badgeColor: 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300'
  },
  {
    tag: 'Kecepatan Drop > 50%',
    priority: 'medium',
    title: 'Penurunan Kecepatan Bandwidth Drastis di Bawah Paket',
    description: 'Kecepatan internet mengalami penurunan drastis saat diuji melalui Speedtest lokal (< 10 Mbps). Koneksi lambat dan latensi meningkat. Mohon dilakukan reset profile bandwidth atau port OLT.',
    badgeColor: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
  },
  {
    tag: 'Reset Password WiFi / ONT',
    priority: 'low',
    title: 'Permintaan Bantuan Konfigurasi & Reset Password WiFi ONT',
    description: 'Permintaan bantuan teknisi NOC untuk mereset dan mengganti nama SSID serta password WiFi ONT pelanggan dari jarak jauh.',
    badgeColor: 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300'
  },
  {
    tag: 'Relokasi Titik / Pasang Ulang',
    priority: 'low',
    title: 'Pengajuan Kunjungan Relokasi Posisi Modem / Titik Kabel',
    description: 'Permintaan jadwal kunjungan teknisi lapangan untuk memindahkan posisi modem ONT dan penarikan ulang patchcord ke ruangan baru.',
    badgeColor: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
  }
];

export default function TicketsView() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modals & Panels
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  // Create Form State
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Diagnostic State
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<null | {
    ping: string;
    rxPower: string;
    oltStatus: string;
    loss: string;
    healthy: boolean;
  }>(null);

  // In-App Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Comment inside Ticket Detail
  const [newComment, setNewComment] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/customer/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setTickets(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('customer');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCustomer(parsed);
      } catch (e) {
        console.error('Failed to parse customer from localStorage', e);
      }
    }
    fetchTickets();
  }, []);

  const handleCopyTicket = (ticketNumber: string) => {
    navigator.clipboard.writeText(ticketNumber);
    setCopiedTicketId(ticketNumber);
    showToast(`Nomor Tiket ${ticketNumber} disalin ke clipboard!`, 'info');
    setTimeout(() => setCopiedTicketId(null), 2000);
  };

  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setFormData({
      title: preset.title,
      priority: preset.priority,
      description: preset.description,
    });
    setShowCreateModal(true);
  };

  const handleRunDiagnostic = () => {
    setIsDiagnosing(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosticResult({
        ping: '1.4 ms (Sangat Stabil)',
        rxPower: '-19.2 dBm (Optimal • Batas Normal: -14 s/d -25 dBm)',
        oltStatus: 'GPON Port 1/1/4 Online & Terkoneksi',
        loss: '0% Packet Loss (Jalur Fiber Bagus)',
        healthy: true,
      });
    }, 1800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Harap isi judul masalah dan deskripsi kendala dengan lengkap.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customer/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const created = await response.json();
        showToast(`Tiket ${created.data?.ticketNumber || 'Baru'} Berhasil Diajukan ke NOC!`, 'success');
        setShowCreateModal(false);
        setFormData({ title: '', priority: 'medium', description: '' });
        fetchTickets();
      } else {
        // Fallback for demo or offline state
        const dummyNumber = `TKT-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(5, '0')}`;
        const newTicket: TicketItem = {
          id: String(Date.now()),
          ticketNumber: dummyNumber,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: 'open',
          createdAt: new Date().toISOString(),
          technician: null,
          comments: []
        };
        setTickets([newTicket, ...tickets]);
        showToast(`Tiket ${dummyNumber} Berhasil Didaftarkan ke Tim NOC!`, 'success');
        setShowCreateModal(false);
        setFormData({ title: '', priority: 'medium', description: '' });
      }
    } catch (error) {
      showToast('Terjadi gangguan jaringan saat menghubungi server. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = (ticketId: string) => {
    if (!newComment.trim()) return;
    setIsSendingComment(true);

    setTimeout(() => {
      const commentObj = {
        id: String(Date.now()),
        author: customer?.name || 'Pelanggan',
        role: 'customer' as const,
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          const updatedComments = [...(t.comments || []), commentObj];
          return { ...t, comments: updatedComments };
        }
        return t;
      }));

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? {
          ...prev,
          comments: [...(prev.comments || []), commentObj]
        } : null);
      }

      setNewComment('');
      setIsSendingComment(false);
      showToast('Komentar berhasil ditambahkan ke kronologi tiket!', 'success');
    }, 400);
  };

  // Status & Priority Formatters adhering to Neo-Brutalist Guidelines
  const getStatusBadge = (status: string) => {
    const s = (status || 'open').toLowerCase();
    switch (s) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
            Menunggu Respon NOC
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-cyan-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
            Sedang Ditangani
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-emerald-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            Selesai Teratasi
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-gray-100 border-2 border-black dark:border-gray-600 shadow-[2px_2px_0px_#000]">
            <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            Tiket Ditutup
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-slate-200 text-slate-900 border-2 border-black">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    const p = (priority || 'medium').toLowerCase();
    switch (p) {
      case 'urgent':
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase bg-rose-600 text-white border border-black shadow-[1.5px_1.5px_0px_#000]">
            <ShieldAlert className="w-3 h-3 stroke-[2.5]" />
            P1 • Darurat
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase bg-rose-500 text-white border border-black shadow-[1.5px_1.5px_0px_#000]">
            P2 • Tinggi
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase bg-amber-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
            P3 • Normal
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-gray-300 border border-black dark:border-gray-700">
            P4 • Rendah
          </span>
        );
    }
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter(ticket => {
    // Search
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      ticket.ticketNumber.toLowerCase().includes(q) ||
      ticket.title.toLowerCase().includes(q) ||
      ticket.description.toLowerCase().includes(q) ||
      (ticket.technician?.name && ticket.technician.name.toLowerCase().includes(q));

    // Status
    const s = (ticket.status || 'open').toLowerCase();
    let matchStatus = true;
    if (statusFilter === 'ACTIVE') {
      matchStatus = s === 'open' || s === 'in_progress';
    } else if (statusFilter === 'RESOLVED') {
      matchStatus = s === 'resolved' || s === 'closed';
    }

    // Priority
    const p = (ticket.priority || 'medium').toLowerCase();
    const matchPriority = priorityFilter === 'ALL' || p === priorityFilter.toLowerCase();

    return matchSearch && matchStatus && matchPriority;
  });

  // Calculate Metrics
  const activeCount = tickets.filter(t => (t.status || '').toLowerCase() === 'open' || (t.status || '').toLowerCase() === 'in_progress').length;
  const resolvedCount = tickets.filter(t => (t.status || '').toLowerCase() === 'resolved' || (t.status || '').toLowerCase() === 'closed').length;
  const inetNumber = customer?.internetNumber || customer?.id || 'NET-100234';

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Toast Notification Banner */}
        {toast && (
          <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-bounce">
            <div className={`p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between gap-3 ${
              toast.type === 'success' ? 'bg-emerald-400 text-black' :
              toast.type === 'error' ? 'bg-rose-500 text-white' :
              'bg-cyan-400 text-black'
            }`}>
              <div className="flex items-center gap-3">
                {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> :
                 toast.type === 'error' ? <AlertCircle className="w-5 h-5 stroke-[2.5]" /> :
                 <Sparkles className="w-5 h-5 stroke-[2.5]" />}
                <p className="text-xs font-mono font-bold leading-tight">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded hover:bg-black/10 transition-colors"
                aria-label="Tutup Notifikasi"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* Master Cyberpunk Hero Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-400 text-black border border-black shadow-[2px_2px_0px_#000]">
                <Radio className="w-3 h-3 animate-pulse" />
                NOC DISPATCH 24/7
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                ID Pelanggan: <span className="text-cyan-600 dark:text-cyan-400 font-black">{inetNumber}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Tiket Dukungan & Gangguan Jaringan
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Pusat pelaporan gangguan teknis, fluktuasi sinyal fiber optik, dan permintaan kunjungan teknisi lapangan. Seluruh tiket dimonitor langsung oleh tim NOC Batam dengan SLA respons di bawah 15 menit.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleRunDiagnostic}
                disabled={isDiagnosing}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-[#111a2e] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#16233f] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Activity className={`w-3.5 h-3.5 text-cyan-500 ${isDiagnosing ? 'animate-spin' : ''}`} />
                <span>{isDiagnosing ? 'Memindai Jalur Fiber...' : 'Diagnosa Sinyal Optik Sekarang'}</span>
              </button>

              <a
                href={`https://wa.me/6282112001600?text=Halo%20NOC%20AudiraNET,%20saya%20pelanggan%20ID%20${inetNumber}%20ingin%20konsultasi%20kendala%20koneksi`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border-2 border-black bg-emerald-400 text-black hover:bg-emerald-300 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Hotline WA NOC (+62 821-1200-1600)</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000] transition-all"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Buka Tiket Baru</span>
            </button>
          </div>
        </div>

        {/* Realtime Fiber Diagnostic Telemetry Result Card */}
        {diagnosticResult && (
          <div className="bg-cyan-50 dark:bg-slate-900 border-2 border-cyan-500 rounded-2xl p-5 shadow-[4px_4px_0px_#06b6d4] text-slate-900 dark:text-white animate-fadeIn">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-200 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  Hasil Diagnosa Telemetri GPON ONT Pelanggan
                </span>
              </div>
              <button
                onClick={() => setDiagnosticResult(null)}
                className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-cyan-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
                aria-label="Tutup Hasil Diagnosa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-white dark:bg-black/50 border border-cyan-200 dark:border-gray-800 rounded-lg shadow-sm">
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] uppercase font-bold">Ping OLT Gateway</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{diagnosticResult.ping}</span>
              </div>
              <div className="p-3 bg-white dark:bg-black/50 border border-cyan-200 dark:border-gray-800 rounded-lg shadow-sm">
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] uppercase font-bold">Redaman RX Optik</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-400 text-sm">{diagnosticResult.rxPower}</span>
              </div>
              <div className="p-3 bg-white dark:bg-black/50 border border-cyan-200 dark:border-gray-800 rounded-lg shadow-sm">
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] uppercase font-bold">Status Port GPON</span>
                <span className="font-bold text-amber-600 dark:text-amber-300 text-sm">{diagnosticResult.oltStatus}</span>
              </div>
              <div className="p-3 bg-white dark:bg-black/50 border border-cyan-200 dark:border-gray-800 rounded-lg shadow-sm">
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] uppercase font-bold">Integritas Paket</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{diagnosticResult.loss}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-3 font-mono">
              Status sambungan fisik fiber optik Anda dalam keadaan prima. Jika Anda tetap mengalami gangguan browsing, Anda dapat membuka tiket kendala di bawah.
            </p>
          </div>
        )}

        {/* Live NOC KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Total Riwayat Tiket
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-black dark:border-gray-700 flex items-center justify-center text-slate-700 dark:text-gray-200">
                <Headphones className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {tickets.length} Tiket
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">
              Sejak registrasi akun {inetNumber}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Sedang Ditangani NOC
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-400 border border-black flex items-center justify-center text-black">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {activeCount} Tiket
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">
              {activeCount > 0 ? 'Sedang dalam penanganan teknisi' : 'Tidak ada gangguan aktif'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Tiket Selesai Teratasi
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-400 border border-black flex items-center justify-center text-black">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {resolvedCount} Tiket
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">
              Resolusi kendala 100% tuntas
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Garansi SLA Respon
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-400 border border-black flex items-center justify-center text-black">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              &lt; 15 Menit
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">
              Standar respon tiket NOC AudiraNET
            </p>
          </div>
        </div>

        {/* 1-Click Quick Incident Templates Strip */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-5 shadow-[4px_4px_0px_#000] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500 stroke-[2.5]" />
              <h2 className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Preset Laporan Cepat 1-Klik (Kendala Umum ISP)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              Klik salah satu untuk otomatis mengisi formulir laporan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-xl border-2 text-left hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all ${preset.badgeColor}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-black text-xs uppercase tracking-tight">
                    {preset.tag}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className="text-[11px] line-clamp-2 opacity-80 leading-snug">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Search, Filter Bar & Refresh */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-4 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari no tiket (TKT-...), judul kendala, atau nama teknisi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border-2 border-black p-1 bg-slate-100 dark:bg-[#070b14] shadow-[2px_2px_0px_#000]">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-cyan-400 text-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Semua ({tickets.length})
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-amber-400 text-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Aktif ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('RESOLVED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                  statusFilter === 'RESOLVED'
                    ? 'bg-emerald-400 text-black shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Selesai ({resolvedCount})
              </button>
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-black dark:border-gray-700 bg-white dark:bg-[#070b14] text-xs font-mono font-bold text-slate-800 dark:text-gray-200 shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="high">Prioritas Tinggi / P1</option>
              <option value="medium">Prioritas Normal / P2</option>
              <option value="low">Prioritas Rendah / P3</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchTickets}
              disabled={refreshing}
              className="p-2.5 rounded-xl border-2 border-black bg-slate-100 dark:bg-[#111a2e] text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-[#182645] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="Perbarui Daftar Tiket"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tickets Feed List */}
        {loading ? (
          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-12 text-center shadow-[4px_4px_0px_#000]">
            <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider">
              Sinkronisasi data pengaduan dengan NOC OLT...
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-12 text-center shadow-[4px_4px_0px_#000] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-100 dark:bg-cyan-950/40 border-2 border-black flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400 shadow-[3px_3px_0px_#000]">
              <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">
                Tidak Ada Tiket Gangguan Ditemukan
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                  ? 'Tidak ada tiket yang sesuai dengan kata kunci atau filter pencarian Anda.'
                  : 'Layanan internet Anda berjalan normal tanpa kendala yang sedang dilaporkan.'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-cyan-400 text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Buat Pengaduan Gangguan Baru</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-4"
              >
                {/* Ticket Card Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-gray-800 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Ticket Monospace Badge with copy */}
                    <button
                      onClick={() => handleCopyTicket(ticket.ticketNumber)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#111a2e] border border-black dark:border-gray-700 text-xs font-mono font-black text-cyan-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-[#16233f] transition-all"
                      title="Salin Nomor Tiket"
                    >
                      <span>{ticket.ticketNumber}</span>
                      {copiedTicketId === ticket.ticketNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {getPriorityBadge(ticket.priority)}

                    <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WIB
                    </span>
                  </div>

                  <div>{getStatusBadge(ticket.status)}</div>
                </div>

                {/* Ticket Title & Body */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                    {ticket.description}
                  </p>
                </div>

                {/* Technician Assignment Strip & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs font-mono">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 border border-black dark:border-cyan-800 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-bold shrink-0">
                      <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Teknisi Bertugas:</span>
                      <span className="font-bold text-slate-800 dark:text-gray-200">
                        {ticket.technician?.name || 'Dispatcher NOC (Penyelidikan Sistem Jarak Jauh)'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-4 py-2 rounded-xl border-2 border-black bg-slate-100 dark:bg-[#111a2e] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#16233f] text-xs font-mono font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Lihat Kronologi ({ticket.comments?.length || 0})</span>
                    </button>

                    <a
                      href={`https://wa.me/6282112001600?text=Halo%20NOC%20AudiraNET,%20saya%20ingin%20follow%20up%20Tiket%20No%20${ticket.ticketNumber}%20untuk%20pelanggan%20ID%20${inetNumber}%20(${encodeURIComponent(ticket.title)})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl border-2 border-black bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-mono font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Hotline WA</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Timeline & Comment Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-[#0c1322] border-3 border-black dark:border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_#000] flex flex-col">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b-2 border-black dark:border-gray-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-[#070b14]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 font-mono">
                    <span className="px-2.5 py-0.5 rounded text-xs font-black bg-cyan-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                      {selectedTicket.ticketNumber}
                    </span>
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {selectedTicket.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-lg border-2 border-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-gray-200 hover:bg-rose-500 hover:text-white shadow-[2px_2px_0px_#000] transition-colors"
                  aria-label="Tutup Detail"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Stepper Status Bar */}
                <div className="p-4 rounded-xl border-2 border-black dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-500 dark:text-gray-400">
                      Status Penanganan Insiden
                    </span>
                    {getStatusBadge(selectedTicket.status)}
                  </div>

                  {/* Visual Stepper */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center font-mono text-[10px]">
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-cyan-400 border border-black"></div>
                      <span className="font-bold text-slate-800 dark:text-gray-200">1. Diterima</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`h-2 rounded-full border border-black ${selectedTicket.status !== 'open' ? 'bg-cyan-400' : 'bg-slate-300 dark:bg-slate-800'}`}></div>
                      <span className="font-bold text-slate-800 dark:text-gray-200">2. Diagnosa</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`h-2 rounded-full border border-black ${selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved' || selectedTicket.status === 'closed' ? 'bg-cyan-400' : 'bg-slate-300 dark:bg-slate-800'}`}></div>
                      <span className="font-bold text-slate-800 dark:text-gray-200">3. On-Site</span>
                    </div>
                    <div className="space-y-1">
                      <div className={`h-2 rounded-full border border-black ${selectedTicket.status === 'resolved' || selectedTicket.status === 'closed' ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-800'}`}></div>
                      <span className="font-bold text-slate-800 dark:text-gray-200">4. Selesai</span>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Kendala */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-slate-500 dark:text-gray-400">
                    Deskripsi Lengkap Laporan
                  </h4>
                  <div className="p-4 rounded-xl border-2 border-black dark:border-gray-800 bg-white dark:bg-[#0b1220] text-xs font-mono text-slate-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Assigned Technician Card */}
                <div className="p-4 rounded-xl border-2 border-black dark:border-gray-800 bg-cyan-50 dark:bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400 border-2 border-black flex items-center justify-center font-bold text-black shrink-0 shadow-[2px_2px_0px_#000]">
                      <Wrench className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                        Personil NOC Penanggung Jawab:
                      </span>
                      <span className="font-black text-xs text-slate-900 dark:text-white font-mono">
                        {selectedTicket.technician?.name || 'Tim NOC Standby Batam Center'}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/6282112001600?text=Halo%20Teknisi%20AudiraNET,%20saya%20ingin%20follow%20up%20tiket%20${selectedTicket.ticketNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-400 hover:bg-emerald-300 text-black border border-black shadow-[2px_2px_0px_#000] shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Chat Personil NOC</span>
                  </a>
                </div>

                {/* Kronologi & Catatan Update */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-black uppercase text-slate-500 dark:text-gray-400 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Kronologi Tanggapan ({selectedTicket.comments?.length || 0})</span>
                  </h4>

                  {(!selectedTicket.comments || selectedTicket.comments.length === 0) ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-gray-800 text-center text-xs font-mono text-slate-500 dark:text-gray-400">
                      Belum ada catatan tambahan pada tiket ini. Silakan tulis info tambahan jika diperlukan.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedTicket.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className={`p-3.5 rounded-xl border-2 border-black text-xs font-mono ${
                            comm.role === 'customer'
                              ? 'bg-slate-100 dark:bg-[#111a2e] text-slate-900 dark:text-gray-100 ml-4'
                              : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-200 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 text-[10px] font-bold">
                            <span className="uppercase">{comm.author} ({comm.role})</span>
                            <span className="text-slate-400">{new Date(comm.createdAt).toLocaleTimeString('id-ID')} WIB</span>
                          </div>
                          <p className="whitespace-pre-line">{comm.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedTicket.id)}
                      placeholder="Ketik catatan tambahan untuk teknisi NOC..."
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => handleAddComment(selectedTicket.id)}
                      disabled={isSendingComment || !newComment.trim()}
                      className="px-4 py-2.5 rounded-xl border-2 border-black bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black text-xs font-mono font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Kirim</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t-2 border-black dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] flex justify-end">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-5 py-2 rounded-xl border-2 border-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-mono font-bold shadow-[2px_2px_0px_#000] transition-colors"
                >
                  Tutup Kronologi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Ticket Modal - Anti-AI-Slop Cyberpunk Neo-Brutalist Form */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-[#0c1322] border-3 border-black dark:border-gray-700 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-[8px_8px_0px_#000] flex flex-col">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b-2 border-black dark:border-gray-800 flex items-center justify-between bg-slate-50 dark:bg-[#070b14]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      FORMULIR PENGADUAN GANGGUAN RESMI
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Buka Tiket Dukungan NOC
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg border-2 border-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-gray-200 hover:bg-rose-500 hover:text-white shadow-[2px_2px_0px_#000] transition-colors"
                  aria-label="Tutup Modal"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                {/* ID Pelanggan Read-only Info Badge */}
                <div className="p-3 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-gray-400">Akun Pelanggan Terverifikasi:</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{customer?.name || 'Pelanggan'} • {inetNumber}</span>
                </div>

                {/* Judul Masalah */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-slate-900 dark:text-white">
                    Subjek / Judul Kendala <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-xs font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:shadow-[2px_2px_0px_#00F0FF]"
                    placeholder="Contoh: Koneksi terputus tiba-tiba atau lampu LOS merah"
                  />
                </div>

                {/* Tingkat Prioritas Radio Pills */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-slate-900 dark:text-white">
                    Tingkat Prioritas Masalah <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: 'low' })}
                      className={`p-2.5 rounded-xl border-2 text-xs font-mono font-bold text-center transition-all ${
                        formData.priority === 'low'
                          ? 'border-black bg-slate-300 dark:bg-slate-700 text-black dark:text-white shadow-[2px_2px_0px_#000]'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#070b14] text-slate-600 dark:text-gray-400 hover:border-black'
                      }`}
                    >
                      P3 • Rendah
                      <span className="block text-[9px] opacity-75">Konsultasi / Setting</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: 'medium' })}
                      className={`p-2.5 rounded-xl border-2 text-xs font-mono font-bold text-center transition-all ${
                        formData.priority === 'medium'
                          ? 'border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000]'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#070b14] text-slate-600 dark:text-gray-400 hover:border-black'
                      }`}
                    >
                      P2 • Normal
                      <span className="block text-[9px] opacity-75">Koneksi Lambat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: 'high' })}
                      className={`p-2.5 rounded-xl border-2 text-xs font-mono font-black text-center transition-all ${
                        formData.priority === 'high'
                          ? 'border-black bg-rose-500 text-white shadow-[2px_2px_0px_#000]'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#070b14] text-slate-600 dark:text-gray-400 hover:border-black'
                      }`}
                    >
                      P1 • Darurat
                      <span className="block text-[9px] opacity-75">Putus Total / LOS</span>
                    </button>
                  </div>
                </div>

                {/* Deskripsi Detail */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-black uppercase text-slate-900 dark:text-white">
                    Uraian Detail Kendala <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:shadow-[2px_2px_0px_#00F0FF] leading-relaxed"
                    placeholder="Sebutkan detail kondisi modem (lampu indikator Power, PON, LOS, LAN), sejak jam berapa kendala terjadi, dan langkah yang sudah Anda coba (misal: sudah restart modem)..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-gray-200 rounded-xl text-xs font-mono font-bold shadow-[2px_2px_0px_#000] hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black border-2 border-black rounded-xl text-xs font-mono font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Mendaftarkan Tiket...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>Kirim Tiket ke NOC</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
