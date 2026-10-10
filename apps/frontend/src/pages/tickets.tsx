import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import Layout from '@/components/Layout';
import { 
  TicketIcon, 
  Search, 
  Filter, 
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
  Wrench
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

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('${API_BASE_URL}/operational/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_BASE_URL}/operational/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Ticket berhasil dibuat!');
        setShowCreateModal(false);
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Gagal membuat ticket');
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/operational/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Status ticket berhasil diupdate!');
        fetchTickets();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Gagal update status');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'ALL' || ticket.status === filterStatus;

    const matchesPriority = 
      filterPriority === 'ALL' || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { icon: AlertTriangle, color: 'bg-red-100 text-red-800', text: 'Open' },
      in_progress: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      resolved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Resolved' },
      closed: { icon: XCircle, color: 'bg-gray-100 text-gray-800', text: 'Closed' }
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: { color: 'bg-blue-100 text-blue-800', text: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      high: { color: 'bg-red-100 text-red-800', text: 'High' }
    };
    const badge = badges[priority as keyof typeof badges];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const statsData = {
    total: filteredTickets.length,
    open: filteredTickets.filter(t => t.status === 'open').length,
    inProgress: filteredTickets.filter(t => t.status === 'in_progress').length,
    resolved: filteredTickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <TicketIcon className="text-blue-600" size={36} />
              Ticket Support
            </h1>
            <p className="text-gray-600 mt-1">Kelola ticket customer support</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            Buat Ticket Baru
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ticket</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{statsData.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TicketIcon className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{statsData.open}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{statsData.inProgress}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{statsData.resolved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari ticket number, judul, atau nama customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-600 flex items-center">Status:</span>
                {(['ALL', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'ALL' ? 'Semua' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 ml-4">
                <span className="text-sm font-medium text-gray-600 flex items-center">Priority:</span>
                {(['ALL', 'low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilterPriority(priority)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterPriority === priority
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority === 'ALL' ? 'Semua' : priority}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ticket #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Technician</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada ticket
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-blue-600">{ticket.ticketNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{ticket.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.customer ? (
                          <div>
                            <p className="font-medium text-gray-800">{ticket.customer.name}</p>
                            <p className="text-sm text-gray-500">{ticket.customer.phone}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                      <td className="px-6 py-4">
                        {ticket.technician ? (
                          <span className="text-gray-700">{ticket.technician.name}</span>
                        ) : (
                          <span className="text-gray-400">Belum ditugaskan</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          {ticket.status !== 'resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Tandai Selesai"
                            >
                              <CheckCircle size={18} />
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

        {/* Detail Modal */}
        {showDetailModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Detail Ticket</h2>
                    <p className="text-gray-600 mt-1">{selectedTicket.ticketNumber}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Ticket Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedTicket.title}</h3>
                  <div className="flex gap-2 mb-4">
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  {selectedTicket.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedTicket.description}</p>
                    </div>
                  )}
                </div>

                {/* Customer Info */}
                {selectedTicket.customer && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                      <User size={16} />
                      Customer
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Nama:</span> {selectedTicket.customer.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedTicket.customer.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedTicket.customer.phone}</p>
                    </div>
                  </div>
                )}

                {/* Technician Info */}
                {selectedTicket.technician && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                      <Wrench size={16} />
                      Technician
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Nama:</span> {selectedTicket.technician.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedTicket.technician.email}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <Calendar size={16} />
                    Timeline
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Dibuat:</span> {new Date(selectedTicket.createdAt).toLocaleString('id-ID')}</p>
                    <p><span className="font-medium">Update Terakhir:</span> {new Date(selectedTicket.updatedAt).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                {selectedTicket.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedTicket.id, 'resolved');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Tandai Selesai
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
