import { useState } from 'react';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function Tickets() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    description: '',
  });

  const tickets = [
    {
      id: '1',
      ticketNumber: 'TKT-2025-001',
      title: 'Internet lambat',
      description: 'Kecepatan internet tidak sesuai paket',
      priority: 'high',
      status: 'IN_PROGRESS',
      createdAt: '2025-12-01',
      technician: 'Ahmad Teknisi',
    },
    {
      id: '2',
      ticketNumber: 'TKT-2025-002',
      title: 'Tidak bisa akses website tertentu',
      description: 'Beberapa website tidak bisa dibuka',
      priority: 'medium',
      status: 'RESOLVED',
      createdAt: '2025-11-28',
      technician: 'Budi Support',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const customer = JSON.parse(localStorage.getItem('customer') || '{}');

      const response = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          customerId: customer.id,
        }),
      });

      if (response.ok) {
        alert('Tiket berhasil dibuat!');
        setShowCreateModal(false);
        setFormData({ title: '', priority: 'medium', description: '' });
        // Reload tickets
      } else {
        alert('Gagal membuat tiket. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      OPEN: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Dibuka' },
      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Sedang Ditangani' },
      RESOLVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Selesai' },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Ditutup' },
    };

    const config = statusConfig[status] || statusConfig.OPEN;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: any = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'Rendah' },
      medium: { color: 'bg-blue-100 text-blue-800', label: 'Sedang' },
      high: { color: 'bg-red-100 text-red-800', label: 'Tinggi' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tiket Support</h1>
            <p className="text-gray-600">Kelola tiket dukungan teknis Anda</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Buat Tiket Baru
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <p className="text-xs text-gray-500">
                      Tiket: {ticket.ticketNumber} • Dibuat: {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                {ticket.technician && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MessageSquare className="h-4 w-4" />
                    <span>Ditangani oleh: <strong>{ticket.technician}</strong></span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Lihat Detail
                  </button>
                  {ticket.status !== 'CLOSED' && (
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
                      Tambah Komentar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada tiket</h3>
            <p className="text-gray-600 mb-4">Buat tiket baru jika Anda membutuhkan bantuan</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Buat Tiket
            </button>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Buat Tiket Baru</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Masalah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Internet lambat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioritas <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jelaskan masalah Anda secara detail..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buat Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
