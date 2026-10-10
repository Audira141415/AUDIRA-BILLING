import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Activity, Plus, Search, Edit, Trash2, Eye, User, AlertCircle, CheckCircle, Clock, XCircle, X, Phone, Mail, MapPin, Package, Calendar, FileText, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Ticket {
  id: string
  ticketNumber: string
  title: string
  customer: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'rejected'
  technician?: string
  createdDate: string
  description: string
}

interface Technician {
  id: string
  name: string
  phone: string
  status: 'available' | 'busy' | 'offline'
  activeTickets: number
  skills: string[]
}

interface TicketDetail extends Ticket {
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  history?: Array<{
    date: string
    action: string
    by: string
  }>
}

export default function Operational() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: '1',
      name: 'Andi Wijaya',
      phone: '081234567890',
      status: 'busy',
      activeTickets: 3,
      skills: ['Network', 'Hardware', 'Installation']
    },
    {
      id: '2',
      name: 'Rudi Hermawan',
      phone: '082345678901',
      status: 'available',
      activeTickets: 0,
      skills: ['Network', 'Configuration']
    },
    {
      id: '3',
      name: 'Dedi Supriadi',
      phone: '083456789012',
      status: 'busy',
      activeTickets: 2,
      skills: ['Installation', 'Hardware']
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'rejected'>('all')
  const [activeTab, setActiveTab] = useState<'tickets' | 'technicians'>('tickets')
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    description: ''
  })

  // Mock data untuk fallback
  const mockTickets: Ticket[] = [
    {
      id: '1',
      ticketNumber: 'TKT-2024-001',
      title: 'Internet Lambat',
      customer: 'Budi Santoso',
      priority: 'high',
      status: 'in-progress',
      technician: 'Andi Wijaya',
      createdDate: '28 Nov 2024',
      description: 'Kecepatan internet di bawah standar paket'
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-002',
      title: 'Koneksi Terputus',
      customer: 'Siti Aminah',
      priority: 'urgent',
      status: 'open',
      createdDate: '29 Nov 2024',
      description: 'Tidak bisa terhubung ke internet sama sekali'
    },
    {
      id: '3',
      ticketNumber: 'TKT-2024-003',
      title: 'Ganti Password WiFi',
      customer: 'Ahmad Hidayat',
      priority: 'low',
      status: 'resolved',
      technician: 'Rudi Hermawan',
      createdDate: '25 Nov 2024',
      description: 'Request perubahan password WiFi'
    }
  ]

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const data = await api.operational.getTickets()
      setTickets(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data tiket')
      console.error('Error fetching tickets:', err)
      // Gunakan mock data jika API gagal
      setTickets(mockTickets)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async () => {
    try {
      await api.operational.createTicket(formData)
      setShowCreateModal(false)
      setFormData({ title: '', customer: '', priority: 'medium', description: '' })
      await fetchTickets()
    } catch (err: any) {
      alert(err.message || 'Gagal membuat tiket')
    }
  }

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tiket ini?')) return
    
    try {
      await api.operational.deleteTicket(id)
      await fetchTickets()
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus tiket')
    }
  }

  const handleEditClick = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingTicket) return
    
    try {
      await api.operational.updateTicket(editingTicket.id, editingTicket)
      setShowEditModal(false)
      setEditingTicket(null)
      await fetchTickets()
      alert('Tiket berhasil diupdate')
    } catch (err: any) {
      alert(err.message || 'Gagal mengupdate tiket')
    }
  }

  // Mock detailed ticket data
  const getTicketDetails = (ticket: Ticket): TicketDetail => {
    const customerData: { [key: string]: any } = {
      'Budi Santoso': {
        customerEmail: 'budi.santoso@email.com',
        customerPhone: '081234567890',
        customerAddress: 'Jl. Merdeka No. 123, Jakarta Pusat'
      },
      'Siti Aminah': {
        customerEmail: 'siti.aminah@email.com',
        customerPhone: '082345678901',
        customerAddress: 'Jl. Sudirman No. 456, Bandung'
      },
      'Ahmad Hidayat': {
        customerEmail: 'ahmad.h@email.com',
        customerPhone: '083456789012',
        customerAddress: 'Jl. Ahmad Yani No. 789, Surabaya'
      }
    }

    return {
      ...ticket,
      ...customerData[ticket.customer],
      history: [
        { date: '28 Nov 2024 10:30', action: 'Tiket dibuat', by: ticket.customer },
        { date: '28 Nov 2024 11:00', action: 'Ditugaskan ke teknisi', by: 'System' },
        ...(ticket.technician ? [{ date: '28 Nov 2024 11:15', action: 'Teknisi menerima tugas', by: ticket.technician }] : []),
        ...(ticket.status === 'in-progress' ? [{ date: '28 Nov 2024 14:00', action: 'Dalam penanganan', by: ticket.technician || 'Teknisi' }] : [])
      ]
    }
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(getTicketDetails(ticket))
    setShowTicketModal(true)
  }

  // Gunakan data dari API jika ada, fallback ke mock data
  const displayTickets = tickets.length > 0 ? tickets : mockTickets

  const filteredTickets = displayTickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const openTickets = displayTickets.filter(t => t.status === 'open').length
  const inProgressTickets = displayTickets.filter(t => t.status === 'in-progress').length
  const resolvedTickets = displayTickets.filter(t => t.status === 'resolved').length
  const availableTechnicians = technicians.filter(t => t.status === 'available').length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700'
      case 'resolved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTechnicianStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700'
      case 'busy':
        return 'bg-yellow-100 text-yellow-700'
      case 'offline':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={18} />
      case 'in-progress':
        return <Clock size={18} />
      case 'resolved':
        return <CheckCircle size={18} />
      case 'rejected':
        return <XCircle size={18} />
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat data tiket...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold">Menggunakan data demo</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">\n              <div>
                <h1 className="text-3xl font-bold text-gray-900">Operational Management</h1>
                <p className="text-gray-600 mt-1">Kelola tiket dan teknisi lapangan</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                <span>Buat Tiket Baru</span>
              </button>
            </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tiket Terbuka</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{openTickets}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Dalam Progress</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{inProgressTickets}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Terselesaikan</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{resolvedTickets}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Teknisi Tersedia</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{availableTechnicians}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'tickets'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tiket Support
              </button>
              <button
                onClick={() => setActiveTab('technicians')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'technicians'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Teknisi
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'tickets' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 md:mr-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nomor tiket, judul, atau pelanggan..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setStatusFilter('open')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setStatusFilter('in-progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'in-progress' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Progress
                  </button>
                  <button
                    onClick={() => setStatusFilter('resolved')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No. Tiket
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Judul
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Pelanggan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Prioritas
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Teknisi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <tr 
                        key={ticket.id} 
                        onClick={() => handleTicketClick(ticket)}
                        className="hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-gray-900">{ticket.ticketNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{ticket.title}</p>
                            <p className="text-sm text-gray-500">{ticket.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900">
                            {typeof ticket.customer === 'string' ? ticket.customer : (ticket.customer as any)?.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(ticket.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                              {ticket.status === 'in-progress' ? 'Progress' : ticket.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {typeof ticket.technician === 'string' ? ticket.technician : (ticket.technician as any)?.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{ticket.createdDate}</span>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleTicketClick(ticket)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleEditClick(ticket)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit Tiket"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'technicians' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <div key={tech.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{tech.name}</h3>
                      <p className="text-sm text-gray-500">{tech.phone}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTechnicianStatusColor(tech.status)}`}>
                    {tech.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Active Tickets: <span className="font-semibold text-gray-900">{tech.activeTickets}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {tech.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors">
                    Assign Ticket
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <Plus size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Buat Tiket Baru</h2>
                  <p className="text-sm opacity-90">Tambahkan tiket support baru</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Tiket</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Masukkan judul tiket"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pelanggan</label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Nama pelanggan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prioritas</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  rows={4}
                  placeholder="Jelaskan masalah atau permintaan"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleCreateTicket}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Buat Tiket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowTicketModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <FileText size={32} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Ticket Detail</p>
                  <h2 className="text-2xl font-bold">{selectedTicket.ticketNumber}</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedTicket.status)}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status === 'in-progress' ? 'In Progress' : selectedTicket.status.toUpperCase()}
                  </span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority} Priority
                </span>
              </div>

              {/* Ticket Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedTicket.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Created Date</p>
                      <p className="font-semibold">{selectedTicket.createdDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <User className="text-blue-600" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Assigned Technician</p>
                      <p className="font-semibold">
                        {typeof selectedTicket.technician === 'string' 
                          ? selectedTicket.technician 
                          : (selectedTicket.technician as any)?.name || 'Not Assigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                  <User className="text-blue-600" size={20} />
                  <span>Customer Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <User className="text-blue-600 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedTicket.customer}</p>
                    </div>
                  </div>
                  {selectedTicket.customerEmail && (
                    <div className="flex items-start space-x-3">
                      <Mail className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{selectedTicket.customerEmail}</p>
                      </div>
                    </div>
                  )}
                  {selectedTicket.customerPhone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{selectedTicket.customerPhone}</p>
                      </div>
                    </div>
                  )}
                  {selectedTicket.customerAddress && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-blue-600 mt-1" size={18} />
                      <div>
                        <p className="text-xs text-gray-600">Address</p>
                        <p className="font-semibold text-gray-900">{selectedTicket.customerAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* History Timeline */}
              {selectedTicket.history && selectedTicket.history.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                    <Clock className="text-blue-600" size={20} />
                    <span>Ticket History</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedTicket.history.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                          <p className="text-xs text-gray-600">by {item.by} • {item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
                  Assign Technician
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Tiket</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTicket(null);
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Tiket
                </label>
                <input
                  type="text"
                  value={editingTicket.title}
                  onChange={(e) => setEditingTicket({...editingTicket, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={editingTicket.description || ''}
                  onChange={(e) => setEditingTicket({...editingTicket, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas
                  </label>
                  <select
                    value={editingTicket.priority}
                    onChange={(e) => setEditingTicket({...editingTicket, priority: e.target.value as any})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingTicket.status}
                    onChange={(e) => setEditingTicket({...editingTicket, status: e.target.value as any})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={editingTicket.customer}
                    onChange={(e) => setEditingTicket({...editingTicket, customer: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teknisi
                  </label>
                  <input
                    type="text"
                    value={editingTicket.technician || ''}
                    onChange={(e) => setEditingTicket({...editingTicket, technician: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Belum ditugaskan"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTicket(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
