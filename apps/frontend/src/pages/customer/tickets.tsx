import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  technician: {
    id: string;
    name: string;
  } | null;
}

interface TicketDetail extends Ticket {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    address: string | null;
  };
}

export default function CustomerTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filter
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Create ticket modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  // Detail modal
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [currentPage, statusFilter]);

  const loadTickets = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/customer/login');
      return;
    }

    try {
      setLoading(true);
      const data = await api.customer.getTickets(token, currentPage, limit, statusFilter || undefined);
      setTickets(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      if (err.message?.includes('401')) {
        localStorage.removeItem('customer_token');
        router.push('/customer/login');
      } else {
        setError(err.message || 'Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetail = async (ticketId: string) => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/customer/login');
      return;
    }

    try {
      setLoadingDetail(true);
      const data = await api.customer.getTicketDetail(token, ticketId);
      setSelectedTicket(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket detail');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/customer/login');
      return;
    }

    try {
      setCreating(true);
      setError('');
      await api.customer.createTicket(token, createForm);
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', priority: 'medium' });
      setCurrentPage(1);
      await loadTickets();
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/customer/dashboard')}
              className="text-blue-600 hover:underline mb-2 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
            <p className="text-gray-600 mt-2">Total: {total} ticket(s)</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Ticket
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p className="text-slate-400">No tickets found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-blue-600 hover:underline"
              >
                Create your first ticket
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => loadTicketDetail(ticket.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>#{ticket.ticketNumber}</span>
                        <span>•</span>
                        <span>{formatDate(ticket.createdAt)}</span>
                        {ticket.technician && (
                          <>
                            <span>•</span>
                            <span>Assigned to: {ticket.technician.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Support Ticket</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateForm({ title: '', description: '', priority: 'medium' });
                  }}
                  className="text-slate-500 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Provide detailed information about your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Service issue</option>
                    <option value="high">High - Service down</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Ticket'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateForm({ title: '', description: '', priority: 'medium' });
                    }}
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">#{selectedTicket.ticketNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-slate-500 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loadingDetail ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              ) : (
                <>
                  {/* Status & Priority */}
                  <div className="flex gap-3 mb-6">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                      {selectedTicket.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Assigned Technician</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedTicket.technician ? selectedTicket.technician.name : 'Not assigned yet'}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="w-24 text-gray-600">Name:</span>
                        <span className="text-gray-900">{selectedTicket.customer.name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Phone:</span>
                        <span className="text-gray-900">{selectedTicket.customer.phone}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 text-gray-600">Email:</span>
                        <span className="text-gray-900">{selectedTicket.customer.email || '-'}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
