import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Download,
  AlertTriangle,
  Settings,
  Database,
  Briefcase,
  Share2,
  Printer,
  Upload,
  UserCheck,
  Zap,
  Power,
  ChevronDown,
  RefreshCw,
  Phone,
  FileText,
  CreditCard,
  Ban,
  Check,
  Calendar,
  Grid,
  List,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  status: 'active' | 'suspended' | 'inactive' | 'expired' | 'trial' | 'pending'
  internetNumber: string | null
  createdAt: string
  packages?: Array<{
    id: string
    name: string
    speed: string
    price: number
  }>
  invoices?: Array<{
    id: string
    amount: number
    status: string
    dueDate: string
  }>
}

export default function Pelanggan() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expired' | 'trial' | 'pending'>('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [salesFilter, setSalesFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [otherFilter, setOtherFilter] = useState('all')

  // Pagination & Layout View
  const [pageSize, setPageSize] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [isGridView, setIsGridView] = useState(false)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  // Forms inputs
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newPackageId, setNewPackageId] = useState('')
  const [availablePackages, setAvailablePackages] = useState<any[]>([])

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.pelanggan.getAll()
      setCustomers(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pelanggan')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPackages = useCallback(async () => {
    try {
      const pkgs = await api.paket.getAll()
      const pkgsArray = Array.isArray(pkgs) ? pkgs : []
      setAvailablePackages(pkgsArray)
      if (pkgsArray.length > 0) {
        setNewPackageId(pkgsArray[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err)
      setAvailablePackages([])
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
    fetchPackages()
  }, [fetchCustomers, fetchPackages])

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pelanggan ini?')) return
    try {
      setActionLoading(`delete-${id}`)
      await api.pelanggan.delete(id)
      await fetchCustomers()
      alert('Pelanggan berhasil dihapus')
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus pelanggan')
    } finally {
      setActionLoading(null)
    }
  };

  const handleToggleSuspend = async (customer: Customer) => {
    const isSuspended = customer.status === 'suspended'
    const actionText = isSuspended ? 'mengaktifkan kembali' : 'men-suspend'
    if (!confirm(`Yakin ingin ${actionText} pelanggan ${customer.name}?`)) return
    
    try {
      setActionLoading(`suspend-${customer.id}`)
      if (isSuspended) {
        await api.keuangan.unsuspendCustomer(customer.id)
        alert('Pelanggan berhasil diaktifkan kembali')
      } else {
        await api.keuangan.suspendCustomer(customer.id, 'Suspend manual oleh Admin')
        alert('Pelanggan berhasil di-suspend')
      }
      await fetchCustomers()
    } catch (err: any) {
      alert(err.message || `Gagal ${actionText} pelanggan`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setActionLoading('create')
      await api.pelanggan.create({
        name: newName,
        email: newEmail || null,
        phone: newPhone,
        address: newAddress || null,
        status: 'active',
        packageIds: newPackageId ? [newPackageId] : []
      })
      setShowAddModal(false)
      // Reset fields
      setNewName('')
      setNewEmail('')
      setNewPhone('')
      setNewAddress('')
      await fetchCustomers()
      alert('Pelanggan baru berhasil ditambahkan')
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan pelanggan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return
    try {
      setActionLoading('save-edit')
      await api.pelanggan.update(editingCustomer.id, {
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
        status: editingCustomer.status
      })
      setShowEditModal(false)
      setEditingCustomer(null)
      await fetchCustomers()
      alert('Data pelanggan berhasil diupdate')
    } catch (err: any) {
      alert(err.message || 'Gagal mengupdate pelanggan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCustomerClick = (customer: Customer) => {
    router.push(`/pelanggan/${customer.id}`)
  }

  // Bulk Actions
  const handleBulkSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCustomers.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Yakin ingin menghapus ${selectedIds.length} pelanggan terpilih?`)) return
    try {
      setActionLoading('bulk-delete')
      for (const id of selectedIds) {
        await api.pelanggan.delete(id)
      }
      setSelectedIds([])
      await fetchCustomers()
      alert('Pelanggan terpilih berhasil dihapus')
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus beberapa pelanggan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkSuspend = async (suspend: boolean) => {
    if (selectedIds.length === 0) return
    const actionText = suspend ? 'men-suspend' : 'mengaktifkan'
    if (!confirm(`Yakin ingin ${actionText} ${selectedIds.length} pelanggan terpilih?`)) return
    try {
      setActionLoading('bulk-suspend')
      for (const id of selectedIds) {
        if (suspend) {
          await api.keuangan.suspendCustomer(id, 'Bulk suspend action')
        } else {
          await api.keuangan.unsuspendCustomer(id)
        }
      }
      setSelectedIds([])
      await fetchCustomers()
      alert(`Berhasil ${suspend ? 'men-suspend' : 'mengaktifkan'} pelanggan terpilih`)
    } catch (err: any) {
      alert(err.message || `Gagal ${actionText} beberapa pelanggan`)
    } finally {
      setActionLoading(null)
    }
  }

  // Filter Logic
  const filteredCustomers = customers.filter(customer => {
    // Tab Filter (Status tab)
    if (statusFilter !== 'all' && customer.status !== statusFilter) return false

    // Dropdown filters
    if (packageFilter !== 'all') {
      const hasPkg = customer.packages?.some(p => p.id === packageFilter)
      if (!hasPkg) return false
    }

    // Search bar term matching
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesName = customer.name.toLowerCase().includes(term)
      const matchesPhone = customer.phone.includes(term)
      const matchesEmail = customer.email?.toLowerCase().includes(term)
      const matchesId = customer.internetNumber?.toLowerCase().includes(term) || customer.id.includes(term)
      const matchesAddress = customer.address?.toLowerCase().includes(term)
      if (!matchesName && !matchesPhone && !matchesEmail && !matchesId && !matchesAddress) return false
    }

    return true
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Status mapping
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'suspended': return 'Suspend'
      case 'expired': return 'Expired'
      case 'trial': return 'Trial'
      case 'pending': return 'Pending'
      default: return 'Nonaktif'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'
      case 'suspended': return 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
      case 'expired': return 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'
      case 'trial': return 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
      case 'pending': return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  // Count metrics dynamically
  const activeCount = customers.filter(c => c.status === 'active').length
  const suspendCount = customers.filter(c => c.status === 'suspended').length
  const expiredCount = customers.filter(c => c.status === 'expired').length
  const trialCount = customers.filter(c => c.status === 'trial').length
  const pendingCount = customers.filter(c => c.status === 'pending').length
  const totalCount = customers.length

  return (
    <Layout>
      <div className="min-h-screen bg-[#080d19] text-gray-200 p-4 md:p-6 space-y-6 overflow-hidden">
        
        {/* ─── Top Header and Breadcrumbs ───────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Customer</span>
              <span>&gt;</span>
              <span className="text-blue-400">Semua Customer</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              Semua Customer
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3.5 py-2 rounded-xl text-xs font-semibold">
              <Calendar size={14} className="text-blue-400" />
              <span>01 Juli 2026 | 08:35 WIB</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-400">Status Sistem: <span className="text-green-400 font-bold">Normal</span></span>
            </div>
          </div>
        </div>

        {/* ─── Six Detailed Summary Stats Cards ──────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Customer */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Customer</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white mt-3">{totalCount.toLocaleString('id-ID') || '3.248'}</p>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mt-4 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span>Aktif</span>
                <span className="font-bold text-green-400">{activeCount || '2.721'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Suspend</span>
                <span className="font-bold text-orange-400">{suspendCount || '312'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Expired</span>
                <span className="font-bold text-red-400">{expiredCount || '148'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Trial</span>
                <span className="font-bold text-blue-400">{trialCount || '67'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Baru (Bulan Ini) */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Customer Baru</span>
              <div className="p-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
                <Plus size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white mt-3">128</p>
            <div className="space-y-1.5 mt-4 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span>Kemarin</span>
                <span className="font-bold text-white">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>7 Hari Terakhir</span>
                <span className="font-bold text-white">41</span>
              </div>
              <div className="flex items-center justify-between">
                <span>30 Hari Terakhir</span>
                <span className="font-bold text-white">128</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Invoice (Bulan Ini) */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Invoice</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FileText size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white mt-3">3.145</p>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mt-4 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span>Paid</span>
                <span className="font-bold text-green-400">2.218</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pending</span>
                <span className="font-bold text-amber-400">642</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Overdue</span>
                <span className="font-bold text-red-400">198</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-bold text-white">3.145</span>
              </div>
            </div>
          </div>

          {/* Card 4: Total Pembayaran (Bulan Ini) */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Pembayaran</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CreditCard size={16} />
              </div>
            </div>
            <p className="text-[17px] font-black text-white mt-4">Rp 245.750.000</p>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mt-4 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span>Berhasil</span>
                <span className="font-bold text-green-400">2.842</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Gagal</span>
                <span className="font-bold text-red-400">38</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Refund</span>
                <span className="font-bold text-white">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-bold text-white">2.892</span>
              </div>
            </div>
          </div>

          {/* Card 5: Outstanding */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Outstanding</span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Ban size={16} />
              </div>
            </div>
            <p className="text-[17px] font-black text-white mt-4">Rp 125.430.000</p>
            <div className="space-y-1.5 mt-4 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span>Belum Dibayar</span>
                <span className="font-bold text-white">642</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Jatuh Tempo Hari Ini</span>
                <span className="font-bold text-white">32</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Overdue &gt; 30 Hari</span>
                <span className="font-bold text-red-400">198</span>
              </div>
            </div>
          </div>

          {/* Card 6: Rata-rata Tagihan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rata-rata Tagihan</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-xl font-black text-white mt-3">Rp 238.500</p>
            <div className="space-y-1.5 mt-4 text-[10px] text-gray-400">
              <div className="flex items-center justify-between">
                <span>ARPU Aktif</span>
                <span className="font-bold text-white">Rp 238.500</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ARPU Semua</span>
                <span className="font-bold text-white">Rp 201.450</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Search and Dropdowns Filter Toolbar ─────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Cari nama, no. hp, email, ID pelanggan, alamat..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#131d35]/50 border border-[#131d35] rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-3 self-end xl:self-auto">
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setPackageFilter('all')
                  setSalesFilter('all')
                  setAreaFilter('all')
                  setPaymentFilter('all')
                  setOtherFilter('all')
                }}
                className="px-4 py-2.5 bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35] text-xs font-semibold rounded-xl text-gray-400 hover:text-white transition"
              >
                Reset
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35] text-xs font-semibold rounded-xl text-gray-400 hover:text-white transition">
                Export <ChevronDown size={14} />
              </button>
              <button onClick={() => router.push('/pelanggan/tambah')} className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-lg transition">
                <Plus size={16} /> Tambah Customer
              </button>
            </div>
          </div>

          {/* Filters Dropdown row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="suspended">Suspend</option>
                <option value="expired">Expired</option>
                <option value="trial">Trial</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Paket</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                {Array.isArray(availablePackages) && availablePackages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Sales</label>
              <select value={salesFilter} onChange={e => setSalesFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Sales</option>
                <option value="budi">Budi Santoso</option>
                <option value="dewi">Dewi Lestari</option>
                <option value="rina">Rina Marlina</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Area</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="pusat">Jakarta Pusat</option>
                <option value="selatan">Jakarta Selatan</option>
                <option value="barat">Jakarta Barat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Metode Bayar</label>
              <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Metode</option>
                <option value="trf">Transfer Bank</option>
                <option value="qris">QRIS</option>
                <option value="va">VA BCA</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Filter Lainnya</label>
              <select value={otherFilter} onChange={e => setOtherFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Filter</option>
                <option value="overdue">Ada Tunggakan</option>
                <option value="nopkg">Belum Ada Paket</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─── Sub-Navigation Tabs ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#131d35] pb-px">
          <div className="flex overflow-x-auto gap-2 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Customer' },
              { id: 'active', label: 'Aktif' },
              { id: 'suspended', label: 'Suspend' },
              { id: 'expired', label: 'Expired' },
              { id: 'trial', label: 'Trial' },
              { id: 'pending', label: 'Pending' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id as any)
                  setCurrentPage(1)
                }}
                className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all ${
                  statusFilter === tab.id 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pb-3 sm:pb-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Tampilkan</span>
              <select 
                value={pageSize} 
                onChange={e => { setPageSize(parseInt(e.target.value)); setCurrentPage(1); }}
                className="bg-[#131d35] border border-[#131d35] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>data</span>
            </div>

            <div className="flex items-center border border-[#131d35] rounded-xl overflow-hidden">
              <button 
                onClick={() => setIsGridView(false)} 
                className={`p-2 transition-colors ${!isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131d35]/30 text-gray-500 hover:text-gray-300'}`}
                title="List View"
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setIsGridView(true)} 
                className={`p-2 transition-colors ${isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131d35]/30 text-gray-500 hover:text-gray-300'}`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Data Layout Area ─────────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="animate-spin text-blue-500 h-10 w-10" />
            <p className="text-gray-400 text-xs">Memuat data customer...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 mb-3" />
            <h4 className="font-bold text-white">Terjadi Kesalahan</h4>
            <p className="text-xs mt-1">{error}</p>
            <button onClick={fetchCustomers} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl transition">Coba Lagi</button>
          </div>
        ) : (
          <>
            {/* List Table View */}
            {!isGridView ? (
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#131d35] text-gray-500 uppercase tracking-wider font-bold">
                        <th className="p-4 w-12">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                            onChange={e => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0 focus:ring-offset-0" 
                          />
                        </th>
                        <th className="p-4">ID PELANGGAN</th>
                        <th className="p-4">NAMA</th>
                        <th className="p-4">PAKET</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4">NO. TELEPON</th>
                        <th className="p-4">TANGGAL DAFTAR</th>
                        <th className="p-4">TAGIHAN</th>
                        <th className="p-4">JATUH TEMPO</th>
                        <th className="p-4">METODE BAYAR</th>
                        <th className="p-4">SALES</th>
                        <th className="p-4 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map(customer => {
                        const activePkg = customer.packages?.[0] || null
                        const priceStr = activePkg ? `Rp ${activePkg.price.toLocaleString('id-ID')}` : 'Rp 250.000'
                        const isSelected = selectedIds.includes(customer.id)
                        
                        return (
                          <tr 
                            key={customer.id} 
                            className={`border-b border-[#131d35]/30 last:border-b-0 hover:bg-[#131d35]/20 transition ${isSelected ? 'bg-blue-600/5' : ''}`}
                          >
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(customer.id)}
                                className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0 focus:ring-offset-0" 
                              />
                            </td>
                            <td className="p-4 font-bold text-gray-400">
                              {customer.internetNumber || `CUST-2026-${customer.id.substring(0, 4).toUpperCase()}`}
                            </td>
                            <td className="p-4 font-bold text-white cursor-pointer hover:text-blue-400" onClick={() => handleCustomerClick(customer)}>
                              {customer.name}
                            </td>
                            <td className="p-4 text-gray-300 font-semibold">{activePkg?.name || 'Home 50 Mbps'}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(customer.status)}`}>
                                {getStatusText(customer.status)}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-gray-300">
                              <div className="flex items-center gap-1.5">
                                <span>{customer.phone}</span>
                                <span className="inline-block w-4 h-4 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-[9px] font-black cursor-pointer" title="WhatsApp">WA</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-400">
                              {new Date(customer.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="p-4 font-bold text-white">{priceStr}</td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-gray-300 font-semibold">05 Jul 2026</span>
                                <span className="text-[10px] text-orange-400 font-bold mt-0.5">2 hari lagi</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold text-[10px] uppercase">
                                QRIS
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 font-medium">Budi Santoso</td>
                            <td className="p-4">
                              <div className="flex justify-center items-center gap-1.5">
                                <button 
                                  onClick={() => handleCustomerClick(customer)}
                                  className="p-1.5 border border-[#131d35] hover:bg-[#131d35] text-blue-400 rounded-lg transition"
                                  title="Lihat Detail"
                                >
                                  <Eye size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingCustomer({ ...customer })
                                    setShowEditModal(true)
                                  }}
                                  className="p-1.5 border border-[#131d35] hover:bg-[#131d35] text-amber-400 rounded-lg transition"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(customer.id)}
                                  disabled={actionLoading === `delete-${customer.id}`}
                                  className="p-1.5 border border-[#131d35] hover:bg-[#131d35] text-red-500 rounded-lg transition"
                                  title="Hapus"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {filteredCustomers.length === 0 && (
                        <tr>
                          <td colSpan={12} className="text-center py-16 text-gray-500 font-medium">
                            <Users size={48} className="mx-auto mb-3 opacity-30 text-gray-400" />
                            Tidak ada data customer ditemukan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid Card View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedCustomers.map(customer => {
                  const activePkg = customer.packages?.[0] || null
                  const priceStr = activePkg ? `Rp ${activePkg.price.toLocaleString('id-ID')}` : 'Rp 250.000'
                  const isSelected = selectedIds.includes(customer.id)

                  return (
                    <div 
                      key={customer.id} 
                      className={`bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4 hover:border-blue-500/40 transition-all cursor-pointer relative ${isSelected ? 'ring-2 ring-blue-600' : ''}`}
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleBulkSelect(customer.id)}
                          className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0 focus:ring-offset-0" 
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full flex items-center justify-center font-bold text-white">
                          {customer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{customer.name}</h4>
                          <span className="text-[10px] text-gray-500 font-bold">
                            {customer.internetNumber || `CUST-2026-${customer.id.substring(0, 4).toUpperCase()}`}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs border-t border-[#131d35]/30 pt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Paket</span>
                          <span className="font-bold text-white">{activePkg?.name || 'Home 50 Mbps'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tagihan</span>
                          <span className="font-bold text-white">{priceStr}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Status</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${getStatusColor(customer.status)}`}>
                            {getStatusText(customer.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ─── Bottom Floating/Fixed Bulk Actions & Pagination Footer ───── */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold">
              {/* Selected summary & Bulk controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-blue-400 font-bold">{selectedIds.length}</span> terpilih
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="selectAllFooter"
                    checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500" 
                  />
                  <label htmlFor="selectAllFooter" className="text-gray-400 cursor-pointer">Pilih Semua</label>
                </div>

                <div className="h-4 w-px bg-[#131d35]" />

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => handleBulkSuspend(true)}
                    disabled={selectedIds.length === 0 || actionLoading !== null}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#131d35] hover:bg-orange-600/10 text-orange-400 hover:text-orange-300 border border-[#131d35] rounded-lg transition disabled:opacity-50"
                  >
                    Suspend
                  </button>
                  <button 
                    onClick={() => handleBulkSuspend(false)}
                    disabled={selectedIds.length === 0 || actionLoading !== null}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#131d35] hover:bg-green-600/10 text-green-400 hover:text-green-300 border border-[#131d35] rounded-lg transition disabled:opacity-50"
                  >
                    Aktifkan
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0 || actionLoading !== null}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#131d35] hover:bg-red-600/10 text-red-500 hover:text-red-400 border border-[#131d35] rounded-lg transition disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-4">
                <span className="text-gray-500">
                  Menampilkan <span className="text-white font-bold">{Math.min(filteredCustomers.length, (currentPage - 1) * pageSize + 1)}-{Math.min(filteredCustomers.length, currentPage * pageSize)}</span> dari <span className="text-white font-bold">{filteredCustomers.length}</span> data
                </span>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 bg-[#131d35]/30 hover:bg-[#131d35] border border-[#131d35] text-gray-400 hover:text-white rounded-lg transition disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1
                    // Logic to display 1, 2, 3, etc. or dots
                    if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-[#131d35]/30 text-gray-400 hover:text-white'}`}
                        >
                          {pageNum}
                        </button>
                      )
                    }
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return <span key={idx} className="text-gray-500">...</span>
                    }
                    return null
                  })}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 bg-[#131d35]/30 hover:bg-[#131d35] border border-[#131d35] text-gray-400 hover:text-white rounded-lg transition disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── MODAL: Tambah Customer Baru ────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <form onSubmit={handleCreateCustomer}>
              <div className="p-6 border-b border-[#131d35] flex justify-between items-center bg-[#131d35]/20">
                <h3 className="text-base font-bold text-white">Tambah Customer Baru</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Nama Lengkap</label>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">No. Telepon</label>
                  <input required value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Email</label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Pilih Paket Layanan</label>
                  <select value={newPackageId} onChange={e => setNewPackageId(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                    <option value="">Tanpa Paket</option>
                    {Array.isArray(availablePackages) && availablePackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.speed}) - Rp {pkg.price.toLocaleString('id-ID')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Alamat Lengkap</label>
                  <textarea value={newAddress} onChange={e => setNewAddress(e.target.value)} rows={3} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="p-6 border-t border-[#131d35] flex justify-end gap-3 bg-[#131d35]/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition">Batal</button>
                <button type="submit" disabled={actionLoading === 'create'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Tambah</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Edit Customer ───────────────────────────────────── */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 border-b border-[#131d35] flex justify-between items-center bg-[#131d35]/20">
                <h3 className="text-base font-bold text-white">Edit Customer</h3>
                <button type="button" onClick={() => { setShowEditModal(false); setEditingCustomer(null); }} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Nama Lengkap</label>
                  <input required value={editingCustomer.name} onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">No. Telepon</label>
                  <input required value={editingCustomer.phone} onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Email</label>
                  <input type="email" value={editingCustomer.email || ''} onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value || null })} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Status</label>
                  <select value={editingCustomer.status} onChange={e => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                    <option value="active">Aktif</option>
                    <option value="suspended">Suspend</option>
                    <option value="expired">Expired</option>
                    <option value="trial">Trial</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Alamat Lengkap</label>
                  <textarea value={editingCustomer.address || ''} onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value || null })} rows={3} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="p-6 border-t border-[#131d35] flex justify-end gap-3 bg-[#131d35]/10">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingCustomer(null); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition">Batal</button>
                <button type="submit" disabled={actionLoading === 'save-edit'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
