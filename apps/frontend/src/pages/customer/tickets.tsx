import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRealtime } from '@/contexts/RealtimeContext';
import { 
  Ticket as TicketIcon, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  AlertTriangle,
  User,
  Radio,
  RefreshCw
} from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  technician?: {
    id: string;
    name: string;
    phone?: string;
  } | null;
  customer?: {
    id: string;
    name: string;
    phone?: string;
    email?: string | null;
    address?: string | null;
  };
}

export default function CustomerTickets() {
  const router = useRouter();
  const { lastEvent } = useRealtime();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Create ticket modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    category: 'Internet Lambat',
    description: '',
    priority: 'medium',
  });

  // Detail modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    loadTickets();
  }, [currentPage, statusFilter]);

  // Real-time synchronization
  useEffect(() => {
    if (lastEvent?.type === 'ticket_updated' || lastEvent?.type === 'dashboard_refresh') {
      loadTickets();
    }
  }, [lastEvent]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      
      const queryParams = new URLSearchParams();
      queryParams.set('page', currentPage.toString());
      queryParams.set('limit', '10');
      if (statusFilter) queryParams.set('status', statusFilter);

      const res = await fetch(`${baseUrl}/tickets?${queryParams.toString()}`);
      if (res.ok) {
        const result = await res.json();
        const list = Array.isArray(result) ? result : (result.data || []);
        setTickets(list);
        setTotal(result.pagination?.total || list.length);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setError('Gagal memuat daftar tiket dari server.');
      }
    } catch (err: any) {
      console.warn('Customer tickets API returned error:', err?.message);
      setError('Koneksi ke backend terputus.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError('');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      
      const payload = {
        title: `[${createForm.category}] ${createForm.title}`,
        category: createForm.category,
        description: createForm.description,
        priority: createForm.priority,
      };

      const res = await fetch(`${baseUrl}/tickets/customer-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setCreateForm({ title: '', category: 'Internet Lambat', description: '', priority: 'medium' });
        setCurrentPage(1);
        await loadTickets();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Gagal membuat tiket pengaduan.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim tiket ke server.');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'low':
      default:
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'in_progress':
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'closed':
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[var(--app-border)]">
          <div>
            <button
              onClick={() => router.push('/customer/dashboard')}
              className="text-xs text-[var(--app-primary)] hover:underline mb-1.5 flex items-center gap-1 font-mono"
            >
              <ChevronLeft size={14} />
              Kembali ke Portal Pelanggan
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2">
                <TicketIcon className="text-[var(--app-primary)]" size={24} />
                Tiket Pengaduan & Layanan CS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Radio size={10} className="animate-pulse" />
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-[var(--app-muted)] mt-1">
              Total riwayat tiket kendala: <strong className="font-mono text-[var(--app-text)]">{total}</strong> tiket
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTickets}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[var(--app-primary)] text-white text-xs font-semibold rounded-lg hover:opacity-90 flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Buat Tiket Gangguan
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--app-muted)]">Status:</span>
            <div className="flex items-center gap-1">
              {[
                { label: 'Semua', val: '' },
                { label: 'Open', val: 'open' },
                { label: 'Dalam Proses', val: 'in_progress' },
                { label: 'Selesai', val: 'resolved' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => {
                    setStatusFilter(tab.val);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    statusFilter === tab.val
                      ? 'bg-[var(--app-primary)] text-white'
                      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="text-center py-16 text-[var(--app-muted)] font-mono text-xs">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[var(--app-primary)]" />
              Menghubungkan ke NOC dan memuat data tiket...
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16">
              <TicketIcon className="w-12 h-12 text-[var(--app-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-sm font-semibold text-[var(--app-text)]">Belum Ada Tiket Pengaduan</p>
              <p className="text-xs text-[var(--app-muted)] mt-1">Semua layanan internet Anda beroperasi normal tanpa kendala.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-[var(--app-primary)] text-white text-xs font-semibold rounded-lg hover:opacity-90 inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Laporkan Masalah Baru
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--app-border)]">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-5 hover:bg-[var(--app-border)]/20 cursor-pointer transition-colors"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-[var(--app-primary)]">
                          {ticket.ticketNumber || `#TK-${ticket.id.slice(0, 6)}`}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getStatusBadge(ticket.status)}`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--app-text)]">{ticket.title}</h3>
                      {ticket.description && (
                        <p className="text-xs text-[var(--app-muted)] mt-1 line-clamp-2">{ticket.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--app-muted)] mt-2 font-mono">
                        <span>Lapor: {formatDate(ticket.createdAt)}</span>
                        {ticket.technician && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">Teknisi: {ticket.technician.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                      }}
                      className="self-end sm:self-center px-3 py-1.5 border border-[var(--app-border)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs rounded-lg transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-[var(--app-bg)]/50 px-6 py-3.5 flex items-center justify-between border-t border-[var(--app-border)] text-xs">
              <span className="text-[var(--app-muted)]">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-[var(--app-border)] rounded-md font-medium text-[var(--app-text)] bg-[var(--app-card)] disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-[var(--app-border)] rounded-md font-medium text-[var(--app-text)] bg-[var(--app-card)] disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-2xl max-w-lg w-full p-6 text-[var(--app-text)] animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--app-border)]">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <TicketIcon size={18} className="text-[var(--app-primary)]" />
                  Buat Tiket Pengaduan Gangguan
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[var(--app-muted)] mb-1">
                    Kategori Kendala <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                  >
                    <option value="Internet Lambat">Internet Lambat / Latensi Tinggi</option>
                    <option value="Lampu LOS Merah">Lampu LOS Merah / Kabel Putus</option>
                    <option value="Wi-Fi Tidak Terdeteksi">Wi-Fi Tidak Terdeteksi</option>
                    <option value="Kendala Tagihan">Kendala Pembayaran / Tagihan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[var(--app-muted)] mb-1">
                    Judul Ringkas Masalah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                    required
                    placeholder="Contoh: Sinyal WiFi sering putus di ruang kerja"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--app-muted)] mb-1">
                    Deskripsi Detail & Gejala <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                    required
                    placeholder="Jelaskan kondisi lampu indikator modem, waktu mulai gangguan, dll..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--app-muted)] mb-1">
                    Tingkat Urgensi
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                  >
                    <option value="low">Low - Pertanyaan umum</option>
                    <option value="medium">Medium - Gangguan kecepatan</option>
                    <option value="high">High - Total Down / Mati total</option>
                  </select>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                    className="flex-1 px-4 py-2 border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-[var(--app-primary)] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {creating ? 'Meneruskan ke NOC...' : 'Kirim Tiket Gangguan ➔'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-2xl max-w-lg w-full p-6 text-[var(--app-text)] animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start pb-4 border-b border-[var(--app-border)]">
                <div>
                  <span className="font-mono text-xs text-[var(--app-primary)] font-bold">
                    {selectedTicket.ticketNumber || `#TK-${selectedTicket.id}`}
                  </span>
                  <h2 className="text-base font-bold text-[var(--app-text)] mt-0.5">{selectedTicket.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {selectedTicket.description && (
                  <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg">
                    <span className="text-[10px] font-semibold uppercase text-[var(--app-muted)] block mb-1">Keterangan:</span>
                    <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-[var(--app-border)] rounded-lg">
                    <span className="text-[10px] font-semibold uppercase text-[var(--app-muted)] block mb-0.5">Waktu Lapor</span>
                    <p className="font-medium font-mono">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                  <div className="p-3 border border-[var(--app-border)] rounded-lg">
                    <span className="text-[10px] font-semibold uppercase text-[var(--app-muted)] block mb-0.5">Teknisi PIC</span>
                    <p className="font-semibold text-emerald-400">
                      {selectedTicket.technician ? selectedTicket.technician.name : 'Dalam antrean NOC'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 border border-[var(--app-border)] rounded-lg text-xs font-medium text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
