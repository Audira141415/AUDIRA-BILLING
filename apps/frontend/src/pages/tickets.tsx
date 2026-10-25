import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { 
  Ticket as TicketIcon, 
  Search, 
  Filter, 
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
  Wrench,
  RefreshCw,
  X,
  ChevronRight,
  ShieldAlert,
  Inbox
} from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  technician?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'open' | 'in_progress' | 'resolved' | 'closed'>('ALL');
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'low' | 'medium' | 'high'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    customerId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${baseUrl}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({ title: '', description: '', priority: 'medium', customerId: '' });
        fetchTickets();
      } else {
        alert('Gagal membuat tiket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Gagal membuat ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const response = await fetch(`${baseUrl}/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Gagal memperbarui status tiket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (ticket.ticketNumber || '').toLowerCase().includes(term) ||
      (ticket.title || '').toLowerCase().includes(term) ||
      (ticket.customer?.name || '').toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            Resolved
          </span>
        );
      case 'closed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Closed
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
            Critical
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
            Low
          </span>
        );
    }
  };

  const statsData = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--app-border)]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <span>Operasional & Lapangan</span>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Helpdesk</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] font-sans flex items-center gap-2.5">
              <TicketIcon className="text-[var(--app-primary)] w-6 h-6" />
              Tiket Gangguan & Helpdesk CS
            </h1>
            <p className="text-xs text-[var(--app-muted)] mt-0.5">
              Manajemen tiket kendala teknis pelanggan, eskalasi ke teknisi lapangan, dan monitoring SLA.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchTickets}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[var(--app-primary)] hover:opacity-90 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Buat Tiket Baru
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">Total Tiket Masuk</span>
            <div className="text-2xl font-bold font-mono text-[var(--app-text)] mt-1">{statsData.total}</div>
            <div className="text-[11px] text-[var(--app-muted)] mt-0.5">Semua riwayat pengaduan</div>
          </div>

          <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Open (Menunggu)</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{statsData.open}</div>
            <div className="text-[11px] text-[var(--app-muted)] mt-0.5">Memerlukan disposisi teknisi</div>
          </div>

          <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Dalam Penanganan</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{statsData.inProgress}</div>
            <div className="text-[11px] text-[var(--app-muted)] mt-0.5">Teknisi sedang di lapangan</div>
          </div>

          <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Selesai & Resolved</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{statsData.resolved}</div>
            <div className="text-[11px] text-[var(--app-muted)] mt-0.5">Koneksi kembali normal</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" size={15} />
            <input
              type="text"
              placeholder="Cari no tiket, kendala, nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-[var(--app-primary)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[var(--app-bg)] p-1 rounded-lg border border-[var(--app-border)]">
              {(['ALL', 'open', 'in_progress', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-[var(--app-primary)] text-white shadow-xs'
                      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {status === 'ALL' ? 'Semua Status' : status === 'open' ? 'Open' : status === 'in_progress' ? 'Progress' : 'Resolved'}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="high">Critical</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Data Table */}
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)]/50 text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)] font-mono">
                  <th className="px-4 py-3">No Tiket</th>
                  <th className="px-4 py-3">Judul Kendala</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Prioritas</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Teknisi PIC</th>
                  <th className="px-4 py-3">Waktu Lapor</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-[var(--app-muted)] font-mono">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[var(--app-primary)]" />
                      Memuat data tiket pelanggan...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="max-w-xs mx-auto text-center">
                        <Inbox size={32} className="mx-auto text-[var(--app-muted)] mb-2 opacity-60" />
                        <p className="text-sm font-semibold text-[var(--app-text)]">Belum Ada Tiket Gangguan</p>
                        <p className="text-xs text-[var(--app-muted)] mt-1">
                          Tidak ada tiket yang cocok dengan kriteria filter saat ini.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-[var(--app-border)]/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-[var(--app-primary)]">
                        {ticket.ticketNumber || `#TK-${ticket.id.slice(0, 6)}`}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--app-text)] max-w-xs truncate">
                        {ticket.title}
                      </td>
                      <td className="px-4 py-3">
                        {ticket.customer ? (
                          <div>
                            <div className="font-medium text-[var(--app-text)]">{ticket.customer.name}</div>
                            <div className="text-[11px] text-[var(--app-muted)] font-mono">{ticket.customer.phone}</div>
                          </div>
                        ) : (
                          <span className="text-[var(--app-muted)] italic">Umum / NOC</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                      <td className="px-4 py-3 text-[var(--app-muted)]">
                        {ticket.technician?.name || <span className="text-amber-500/80 font-mono text-[11px]">Belum Ditugaskan</span>}
                      </td>
                      <td className="px-4 py-3 text-[var(--app-muted)] font-mono text-[11px]">
                        {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 border border-[var(--app-border)] hover:bg-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-md transition-colors"
                            title="Detail Tiket"
                          >
                            <Eye size={14} />
                          </button>
                          {ticket.status !== 'resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-medium text-[11px] transition-colors"
                              title="Tandai Selesai"
                            >
                              Selesaikan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-2xl max-w-md w-full p-6 text-[var(--app-text)] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--app-border)]">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <TicketIcon size={18} className="text-[var(--app-primary)]" />
                  Buat Tiket Gangguan Baru
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1">Judul Kendala / Laporan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lampu LOS Merah / Redaman Tinggi"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1">Prioritas Masalah</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                  >
                    <option value="low">Low (Pertanyaan / Request)</option>
                    <option value="medium">Medium (Koneksi Lambat)</option>
                    <option value="high">Critical (Link Down / LOS Total)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1">Deskripsi Detail</label>
                  <textarea
                    rows={3}
                    placeholder="Keterangan tambahan kendala..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-medium border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-semibold bg-[var(--app-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Tiket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Ticket Modal */}
        {showDetailModal && selectedTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-2xl max-w-lg w-full p-6 text-[var(--app-text)] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--app-border)]">
                <div>
                  <span className="text-xs font-mono text-[var(--app-primary)]">{selectedTicket.ticketNumber || `#TK-${selectedTicket.id}`}</span>
                  <h3 className="text-base font-bold text-[var(--app-text)] mt-0.5">{selectedTicket.title}</h3>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(selectedTicket.priority)}
                  {getStatusBadge(selectedTicket.status)}
                </div>

                {selectedTicket.description && (
                  <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)]">
                    <span className="text-[10px] font-semibold uppercase text-[var(--app-muted)] block mb-1">Catatan Pelanggan:</span>
                    {selectedTicket.description}
                  </div>
                )}

                {selectedTicket.customer && (
                  <div className="p-3 border border-[var(--app-border)] rounded-lg space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-[var(--app-muted)] block mb-1">Data Pelanggan:</span>
                    <p><span className="text-[var(--app-muted)]">Nama:</span> <strong className="text-[var(--app-text)]">{selectedTicket.customer.name}</strong></p>
                    <p><span className="text-[var(--app-muted)]">Kontak:</span> <strong className="text-[var(--app-text)] font-mono">{selectedTicket.customer.phone}</strong></p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[var(--app-muted)] pt-2 border-t border-[var(--app-border)]">
                  <span>Dibuat: {new Date(selectedTicket.createdAt).toLocaleString('id-ID')}</span>
                  <span>Update: {new Date(selectedTicket.updatedAt).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-xs font-medium border border-[var(--app-border)] rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  Tutup
                </button>
                {selectedTicket.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedTicket.id, 'resolved');
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    Tandai Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
