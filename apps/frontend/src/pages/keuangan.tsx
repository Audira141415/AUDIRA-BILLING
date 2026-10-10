import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import {
  DollarSign,
  Plus,
  Search,
  Eye,
  Download,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  Loader2,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import api from '@/lib/api'

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  dueDate: string
  paidAt?: string | null
  status: 'PAID' | 'PENDING' | 'OVERDUE'
  paymentMethod?: string
  month?: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    address?: string
    status: string
    createdAt: string
  }
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  createdAt: string
  packages?: Array<{
    name: string
    speed: string
    price: number
  }>
  invoices?: Invoice[]
}

const PAYMENT_METHODS = ['Cash', 'Transfer Bank', 'QRIS', 'Virtual Account BCA', 'Virtual Account BNI', 'Virtual Account BRI', 'E-Wallet']

export default function Keuangan() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/finance/dashboard')
  }, [router])

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null)
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    overdueInvoices: 0,
    unpaidAmount: 0,
    overdueAmount: 0
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'PAID' | 'PENDING' | 'OVERDUE'>('all')

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.keuangan.getInvoices()
      setInvoices(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data keuangan')
      console.error('Error fetching invoices:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.keuangan.getStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
    fetchStats()
  }, [fetchInvoices, fetchStats])

  const handleCustomerClick = async (customerId: string) => {
    try {
      setModalLoading(true)
      setShowCustomerModal(true)
      const customerData = await api.pelanggan.getOne(customerId)
      // Fetch invoices for this customer
      const customerInvoices = await api.keuangan.getInvoices(customerId)
      
      setSelectedCustomer({
        ...customerData,
        invoices: customerInvoices
      })
    } catch (err) {
      console.error('Error fetching customer detail:', err)
      alert('Gagal mengambil data detail pelanggan')
      setShowCustomerModal(false)
    } finally {
      setModalLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!selectedInvoice) return
    try {
      await api.keuangan.markPaid(selectedInvoice.id, paymentMethod)
      alert('Invoice berhasil ditandai LUNAS')
      setShowMarkPaidModal(false)
      setSelectedInvoice(null)
      fetchInvoices()
      fetchStats()
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status pembayaran')
    }
  }

  const handleExportCSV = () => {
    const headers = ['No. Invoice', 'Pelanggan', 'Jumlah', 'Jatuh Tempo', 'Tanggal Bayar', 'Metode Bayar', 'Status']
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.customer.name,
      inv.amount,
      new Date(inv.dueDate).toLocaleDateString('id-ID'),
      inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : '-',
      inv.paymentMethod || '-',
      inv.status
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `laporan-keuangan-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700 border border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
      case 'OVERDUE':
        return 'bg-red-100 text-red-700 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Lunas'
      case 'PENDING':
        return 'Belum Bayar'
      case 'OVERDUE':
        return 'Jatuh Tempo'
      default:
        return status
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat data keuangan...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <CreditCard className="text-blue-600" size={32} />
                  Manajemen Keuangan
                </h1>
                <p className="text-gray-600 mt-1">Kelola invoice, pembayaran, dan laporan keuangan</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
                >
                  <Download size={18} />
                  <span>Export CSV</span>
                </button>
                <button 
                  onClick={() => { fetchInvoices(); fetchStats(); }}
                  className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm shadow-sm"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      Rp {stats.totalRevenue.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-green-600">
                    <TrendingUp size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Invoice Lunas</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.paidInvoices} invoice</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <FileText size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Piutang Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      Rp {stats.unpaidAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600">
                    <CreditCard size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Tunggakan Jatuh Tempo</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      Rp {stats.overdueAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-red-600">
                    <TrendingDown size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nomor invoice atau nama pelanggan..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setStatusFilter('PAID')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'PAID' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Lunas
                  </button>
                  <button
                    onClick={() => setStatusFilter('PENDING')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Belum Bayar
                  </button>
                  <button
                    onClick={() => setStatusFilter('OVERDUE')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === 'OVERDUE' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Jatuh Tempo
                  </button>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No. Invoice</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jatuh Tempo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal Bayar</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Metode Bayar</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr 
                        key={invoice.id} 
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-gray-900">{invoice.invoiceNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleCustomerClick(invoice.customer.id)}
                            className="text-blue-600 font-semibold hover:underline text-left"
                          >
                            {invoice.customer.name}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">
                            Rp {invoice.amount.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('id-ID') : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{invoice.paymentMethod || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleCustomerClick(invoice.customer.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Detail Pelanggan"
                            >
                              <Eye size={18} />
                            </button>
                            {invoice.status !== 'PAID' && (
                              <button 
                                onClick={() => { setSelectedInvoice(invoice); setShowMarkPaidModal(true); }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Tandai Lunas"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-16">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4 opacity-40" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Tidak ada invoice ditemukan</h3>
                  <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau filter Anda</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {modalLoading ? 'Memuat data...' : selectedCustomer?.name}
                  </h2>
                  <p className="text-blue-100 text-sm">Detail Informasi Pelanggan & Keuangan</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowCustomerModal(false); setSelectedCustomer(null); }}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                  <span>Mengambil data dari server...</span>
                </div>
              ) : selectedCustomer && (
                <>
                  {/* Status Badge */}
                  <div className="mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${
                      selectedCustomer.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                      selectedCustomer.status === 'suspended' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedCustomer.status === 'active' ? 'bg-green-500' :
                        selectedCustomer.status === 'suspended' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}></span>
                      {selectedCustomer.status === 'active' ? 'Aktif' : 
                       selectedCustomer.status === 'suspended' ? 'Suspended' : 'Nonaktif'}
                    </span>
                  </div>

                  {/* Customer Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-6 bg-blue-600 rounded"></span>
                        Informasi Kontak
                      </h3>
                      
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.email || '-'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">No. Telepon</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Alamat</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.address || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Package & Billing Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-6 bg-purple-600 rounded"></span>
                        Paket & Layanan
                      </h3>
                      
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Paket Layanan</p>
                          <p className="font-bold text-gray-900">
                            {selectedCustomer.packages && selectedCustomer.packages.length > 0
                              ? selectedCustomer.packages[0].name
                              : 'Tidak Berlangganan Paket'}
                          </p>
                          <p className="text-sm text-purple-600">
                            {selectedCustomer.packages && selectedCustomer.packages.length > 0
                              ? selectedCustomer.packages[0].speed
                              : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Tanggal Bergabung</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedCustomer.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice History */}
                  {selectedCustomer.invoices && selectedCustomer.invoices.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-6 bg-orange-600 rounded"></span>
                        Riwayat Invoice ({selectedCustomer.invoices.length})
                      </h3>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {selectedCustomer.invoices.map((inv) => (
                          <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-mono font-semibold text-sm text-gray-900">{inv.invoiceNumber}</p>
                                <p className="text-xs text-gray-500">Jatuh tempo: {new Date(inv.dueDate).toLocaleDateString('id-ID')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-bold text-gray-900">Rp {inv.amount.toLocaleString('id-ID')}</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getStatusColor(inv.status)}`}>
                                {getStatusText(inv.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Belum ada riwayat tagihan/invoice untuk pelanggan ini.</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t flex items-center justify-end gap-3">
                    <button
                      onClick={() => { setShowCustomerModal(false); setSelectedCustomer(null); }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tandai Lunas */}
      {showMarkPaidModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle size={22} className="text-green-600" /> Tandai Lunas
              </h2>
              <button onClick={() => { setShowMarkPaidModal(false); setSelectedInvoice(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold">Invoice</p>
                <p className="font-mono font-bold text-blue-700">{selectedInvoice.invoiceNumber}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold mt-2">Pelanggan</p>
                <p className="font-semibold text-gray-800">{selectedInvoice.customer.name}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold mt-2">Jumlah Tagihan</p>
                <p className="text-2xl font-bold text-gray-800">Rp {selectedInvoice.amount.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`px-3 py-2 rounded-lg text-sm border transition ${
                        paymentMethod === m
                          ? 'bg-green-600 text-white border-green-600 font-semibold'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => { setShowMarkPaidModal(false); setSelectedInvoice(null); }} 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleMarkPaid}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm"
              >
                Konfirmasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
