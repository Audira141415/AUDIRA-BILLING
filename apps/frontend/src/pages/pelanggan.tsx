import { useState, useEffect, useCallback, useMemo } from 'react'
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
  MessageSquare,
  ShieldCheck,
  DollarSign,
  Activity
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

export default function Pelanggan() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expired' | 'trial' | 'pending'>('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'status'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Pagination & Layout View
  const [pageSize, setPageSize] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [isGridView, setIsGridView] = useState(false)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string; internetNumber?: string | null; phone?: string } | null>(null)

  // Forms inputs
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newPackageId, setNewPackageId] = useState('')
  const [availablePackages, setAvailablePackages] = useState<any[]>([])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

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
      if (pkgsArray.length > 0 && !newPackageId) {
        setNewPackageId(pkgsArray[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err)
      setAvailablePackages([])
    }
  }, [newPackageId])

  useEffect(() => {
    fetchCustomers()
    fetchPackages()
  }, [fetchCustomers, fetchPackages])

  const handleDelete = (id: string, name: string, internetNumber?: string | null, phone?: string) => {
    setCustomerToDelete({ id, name, internetNumber, phone })
  }

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return
    try {
      setActionLoading(`delete-${customerToDelete.id}`)
      await api.pelanggan.delete(customerToDelete.id)
      await fetchCustomers()
      showNotification(`Pelanggan "${customerToDelete.name}" berhasil dihapus dari database.`, 'success')
      setCustomerToDelete(null)
    } catch (err: any) {
      showNotification(err.message || 'Gagal menghapus pelanggan', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleSuspend = async (customer: Customer) => {
    const isSuspended = customer.status === 'suspended'
    const actionText = isSuspended ? 'mengaktifkan kembali' : 'mengisolir (suspend)'
    if (!confirm(`Konfirmasi: Yakin ingin ${actionText} koneksi internet pelanggan "${customer.name}"?`)) return
    
    try {
      setActionLoading(`suspend-${customer.id}`)
      if (isSuspended) {
        await api.keuangan.unsuspendCustomer(customer.id)
        showNotification(`Pelanggan "${customer.name}" berhasil diaktifkan kembali.`, 'success')
      } else {
        await api.keuangan.suspendCustomer(customer.id, 'Isolir manual oleh Admin Panel')
        showNotification(`Pelanggan "${customer.name}" berhasil diisolir.`, 'success')
      }
      await fetchCustomers()
    } catch (err: any) {
      showNotification(err.message || `Gagal ${actionText} pelanggan`, 'error')
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
      setNewName('')
      setNewEmail('')
      setNewPhone('')
      setNewAddress('')
      await fetchCustomers()
      showNotification('Pelanggan baru berhasil didaftarkan.', 'success')
    } catch (err: any) {
      showNotification(err.message || 'Gagal menambahkan pelanggan', 'error')
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
      showNotification('Data pelanggan berhasil diperbarui', 'success')
    } catch (err: any) {
      showNotification(err.message || 'Gagal mengupdate pelanggan', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredCustomers.map(c => c.id) : [])
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Konfirmasi Hapus Massal: Yakin ingin menghapus ${selectedIds.length} pelanggan terpilih?`)) return
    try {
      setActionLoading('bulk-delete')
      for (const id of selectedIds) {
        await api.pelanggan.delete(id)
      }
      setSelectedIds([])
      await fetchCustomers()
      showNotification(`${selectedIds.length} pelanggan berhasil dihapus`, 'success')
    } catch (err: any) {
      showNotification(err.message || 'Gagal menghapus beberapa pelanggan', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkSuspend = async (suspend: boolean) => {
    if (selectedIds.length === 0) return
    const actionText = suspend ? 'mengisolir' : 'mengaktifkan'
    if (!confirm(`Konfirmasi Massal: Yakin ingin ${actionText} ${selectedIds.length} pelanggan terpilih?`)) return
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
      showNotification(`Berhasil ${actionText} ${selectedIds.length} pelanggan`, 'success')
    } catch (err: any) {
      showNotification(err.message || `Gagal ${actionText} beberapa pelanggan`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleKickSession = async (customerId: string, customerName: string) => {
    try {
      setActionLoading(`coa-${customerId}`)
      const res = await fetch(`${API_BASE_URL}/billing/coa/reconnect/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok) {
        showNotification(`CoA Berhasil: Sesi modem ${customerName} berhasil di-reset`, 'success')
      } else {
        showNotification(data.message || 'Gagal mengirim sinyal CoA ke modem', 'error')
      }
    } catch (err: any) {
      showNotification(`Kesalahan CoA: ${err.message}`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // Real Export to CSV
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      showNotification('Tidak ada data pelanggan untuk diexport', 'error')
      return
    }
    const headers = ['ID Pelanggan', 'No Internet', 'Nama Lengkap', 'Telepon', 'Email', 'Status', 'Paket', 'Biaya Bulanan', 'Alamat', 'Tanggal Terdaftar']
    const rows = filteredCustomers.map(c => [
      `"${c.id}"`,
      `"${c.internetNumber || '-'}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email || '-'}"`,
      `"${c.status.toUpperCase()}"`,
      `"${c.packages?.[0]?.name || '-'}"`,
      `"${c.packages?.[0]?.price || 0}"`,
      `"${(c.address || '-').replace(/"/g, '""')}"`,
      `"${new Date(c.createdAt).toLocaleDateString('id-ID')}"`
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `audira-pelanggan-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification('Export CSV data pelanggan berhasil diunduh', 'success')
  }

  // Computed Real Metrics
  const metrics = useMemo(() => {
    const total = customers.length
    const active = customers.filter(c => c.status === 'active').length
    const suspended = customers.filter(c => c.status === 'suspended').length
    const expired = customers.filter(c => c.status === 'expired').length
    const trial = customers.filter(c => c.status === 'trial').length
    const pending = customers.filter(c => c.status === 'pending').length
    
    // Calculate MRR from active customers with packages
    const activeMRR = customers
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + (c.packages?.[0]?.price || 0), 0)
    
    const arpu = active > 0 ? Math.round(activeMRR / active) : 0

    return { total, active, suspended, expired, trial, pending, activeMRR, arpu }
  }, [customers])

  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      if (statusFilter !== 'all' && customer.status !== statusFilter) return false
      if (packageFilter !== 'all') {
        const hasPkg = customer.packages?.some(p => p.id === packageFilter)
        if (!hasPkg) return false
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesName = customer.name.toLowerCase().includes(term)
        const matchesPhone = customer.phone.includes(term)
        const matchesEmail = customer.email?.toLowerCase().includes(term)
        const matchesId = customer.internetNumber?.toLowerCase().includes(term) || customer.id.toLowerCase().includes(term)
        const matchesAddress = customer.address?.toLowerCase().includes(term)
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesId && !matchesAddress) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      if (sortBy === 'createdAt') {
        return sortOrder === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })
  }, [customers, statusFilter, packageFilter, searchTerm, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Aktif</span>
      case 'suspended':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Isolir</span>
      case 'expired':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Expired</span>
      case 'trial':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Trial</span>
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Pending</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">Nonaktif</span>
    }
  }

  const currentDateDisplay = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">
        
        {/* Toast Notification */}
        {notification && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* ─── Top Header and Breadcrumbs ───────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Customer CRM</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Pelanggan Internet</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Users className="text-theme-primary" size={26} />
              Manajemen Pelanggan
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-theme-card border border-theme-border px-3.5 py-2 rounded-xl text-xs font-medium text-theme-muted">
              <Calendar size={14} className="text-theme-primary" />
              <span>{currentDateDisplay}</span>
            </div>
            <div className="flex items-center gap-2 bg-theme-card border border-theme-border px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-theme-muted">Status Radius / CoA: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Online</span></span>
            </div>
            <button 
              onClick={() => fetchCustomers()}
              className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
          </div>
        </div>

        {/* ─── Six Dynamic KPI Summary Metrics (Real Data Calculation) ───── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          
          {/* Card 1: Total Pelanggan */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Pelanggan</span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Users size={15} />
              </div>
            </div>
            <p className="text-2xl font-black text-theme-text font-mono mt-2">{metrics.total.toLocaleString('id-ID')}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Terdaftar di DB</span>
              <span className="font-semibold text-theme-text">100%</span>
            </div>
          </div>

          {/* Card 2: Pelanggan Aktif */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Pelanggan Aktif</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle size={15} />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">{metrics.active.toLocaleString('id-ID')}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Rasio Aktif</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {metrics.total > 0 ? `${Math.round((metrics.active / metrics.total) * 100)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Card 3: Pelanggan Isolir / Suspend */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Terisolir / Suspend</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Ban size={15} />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-2">{metrics.suspended.toLocaleString('id-ID')}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Menunggu Bayar</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Tindakan</span>
            </div>
          </div>

          {/* Card 4: Expired / Menunggak */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Expired / Pasif</span>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <XCircle size={15} />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-2">{metrics.expired.toLocaleString('id-ID')}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Perlu Follow Up</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">Hubungi</span>
            </div>
          </div>

          {/* Card 5: Trial & Pending */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Trial / Pending</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Clock size={15} />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-2">{(metrics.trial + metrics.pending).toLocaleString('id-ID')}</p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>Onboarding</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">Aktivasi</span>
            </div>
          </div>

          {/* Card 6: Estimasi MRR Pelanggan */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Estimasi MRR</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <DollarSign size={15} />
              </div>
            </div>
            <p className="text-lg font-black text-theme-text font-mono mt-2">
              Rp {metrics.activeMRR.toLocaleString('id-ID')}
            </p>
            <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2 pt-2 border-t border-theme-border/50">
              <span>ARPU Aktif</span>
              <span className="font-semibold text-theme-text font-mono">Rp {metrics.arpu.toLocaleString('id-ID')}</span>
            </div>
          </div>

        </div>

        {/* ─── Search and Dropdowns Filter Toolbar ─────────────────────── */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3.5">
          <div className="flex flex-col xl:flex-row gap-3 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 text-theme-muted" size={16} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, nomor HP, email, ID Internet, atau alamat..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-theme-bg border border-theme-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2.5 self-end xl:self-auto">
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setPackageFilter('all')
                  setCurrentPage(1)
                }}
                className="px-3.5 py-2.5 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border text-theme-muted hover:text-theme-text text-xs font-semibold rounded-xl transition"
              >
                Reset Filter
              </button>
              
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border text-theme-muted hover:text-theme-text text-xs font-semibold rounded-xl transition"
                title="Download CSV Pelanggan"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <div className="flex items-center border border-theme-border rounded-xl p-0.5 bg-theme-bg">
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-1.5 rounded-lg text-xs transition ${!isGridView ? 'bg-theme-card text-theme-text shadow-xs' : 'text-theme-muted hover:text-theme-text'}`}
                  title="Tampilan Tabel"
                >
                  <List size={15} />
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-1.5 rounded-lg text-xs transition ${isGridView ? 'bg-theme-card text-theme-text shadow-xs' : 'text-theme-muted hover:text-theme-text'}`}
                  title="Tampilan Grid Kartu"
                >
                  <Grid size={15} />
                </button>
              </div>

              <button 
                onClick={() => setShowAddModal(true)} 
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-sm transition"
              >
                <Plus size={16} /> 
                <span>Tambah Pelanggan</span>
              </button>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-theme-border/50">
            <div className="space-y-1">
              <label className="text-[10px] text-theme-muted font-bold block uppercase tracking-wider">Status Akun</label>
              <select 
                value={statusFilter} 
                onChange={e => {
                  setStatusFilter(e.target.value as any)
                  setCurrentPage(1)
                }} 
                className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
              >
                <option value="all">Semua Status ({metrics.total})</option>
                <option value="active">Aktif ({metrics.active})</option>
                <option value="suspended">Isolir / Suspend ({metrics.suspended})</option>
                <option value="expired">Expired ({metrics.expired})</option>
                <option value="trial">Trial ({metrics.trial})</option>
                <option value="pending">Pending ({metrics.pending})</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-theme-muted font-bold block uppercase tracking-wider">Paket Layanan</label>
              <select 
                value={packageFilter} 
                onChange={e => {
                  setPackageFilter(e.target.value)
                  setCurrentPage(1)
                }} 
                className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
              >
                <option value="all">Semua Paket</option>
                {Array.isArray(availablePackages) && availablePackages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} ({pkg.speed})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-theme-muted font-bold block uppercase tracking-wider">Urutkan</label>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as any)} 
                className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
              >
                <option value="createdAt">Tanggal Daftar</option>
                <option value="name">Nama Pelanggan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-theme-muted font-bold block uppercase tracking-wider">Arah Urutan</label>
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value as any)} 
                className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
              >
                <option value="desc">Terbaru / Z-A</option>
                <option value="asc">Terlama / A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─── Bulk Action Bar (Visible when rows selected) ─────────────── */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700 dark:text-blue-300 font-mono">{selectedIds.length}</span>
              <span className="text-theme-muted">pelanggan terpilih</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkSuspend(true)}
                disabled={actionLoading !== null}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                Isolir Massal
              </button>
              <button
                onClick={() => handleBulkSuspend(false)}
                disabled={actionLoading !== null}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                Buka Isolir Massal
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading !== null}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                Hapus Terpilih
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-theme-card hover:bg-slate-200 dark:hover:bg-slate-700 text-theme-text rounded-lg border border-theme-border transition"
              >
                Batalkan
              </button>
            </div>
          </div>
        )}

        {/* ─── Content Area: Table / Grid View ──────────────────────────── */}
        {loading ? (
          <div className="bg-theme-card border border-theme-border rounded-xl p-12 text-center space-y-3">
            <RefreshCw className="animate-spin text-theme-primary mx-auto" size={32} />
            <p className="text-sm font-semibold text-theme-text">Memuat data pelanggan...</p>
            <p className="text-xs text-theme-muted">Sinkronisasi database pelanggan dan profil paket</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-theme-card border border-theme-border rounded-xl p-12 text-center space-y-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center text-theme-muted">
              <Users size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-theme-text">Tidak ada data pelanggan ditemukan</h3>
              <p className="text-xs text-theme-muted max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || packageFilter !== 'all'
                  ? 'Coba sesuaikan kriteria pencarian atau reset filter untuk menampilkan data.'
                  : 'Belum ada pelanggan terdaftar di sistem. Mulai tambahkan pelanggan baru sekarang.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl transition"
            >
              <Plus size={15} /> Tambah Pelanggan Baru
            </button>
          </div>
        ) : !isGridView ? (
          /* Table View */
          <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-theme-border text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedCustomers.length > 0 && paginatedCustomers.every(c => selectedIds.includes(c.id))}
                        onChange={e => handleSelectAll(e.target.checked)}
                        className="rounded border-theme-border"
                      />
                    </th>
                    <th className="p-3.5">ID / No Internet</th>
                    <th className="p-3.5">Nama & Kontak</th>
                    <th className="p-3.5">Paket Layanan</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Tagihan Terakhir</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border">
                  {paginatedCustomers.map(customer => {
                    const isSelected = selectedIds.includes(customer.id)
                    const isSuspended = customer.status === 'suspended'
                    const cleanPhone = customer.phone.replace(/[^0-9]/g, '')
                    const waPhone = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone

                    return (
                      <tr 
                        key={customer.id} 
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleBulkSelect(customer.id)}
                            className="rounded border-theme-border"
                          />
                        </td>

                        <td className="p-3.5 font-mono">
                          <div className="font-semibold text-theme-text text-[11px]">{customer.internetNumber || customer.id.slice(0, 8)}</div>
                          <div className="text-[10px] text-theme-muted mt-0.5">
                            {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <Link href={`/pelanggan/${customer.id}`} className="font-bold text-theme-text hover:text-blue-600 transition flex items-center gap-1 group">
                            <span>{customer.name}</span>
                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-theme-muted mt-0.5">
                            <span className="font-mono">{customer.phone}</span>
                            {customer.email && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[140px]">{customer.email}</span>
                              </>
                            )}
                          </div>
                          {customer.address && (
                            <div className="text-[10px] text-theme-muted/80 truncate max-w-[260px] mt-0.5">
                              {customer.address}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          {customer.packages && customer.packages.length > 0 ? (
                            <div>
                              <div className="font-semibold text-theme-text">{customer.packages[0].name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-theme-muted font-mono mt-0.5">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">{customer.packages[0].speed}</span>
                                <span>•</span>
                                <span>Rp {customer.packages[0].price.toLocaleString('id-ID')}/bln</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-theme-muted italic">Belum Ada Paket</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          {getStatusBadge(customer.status)}
                        </td>

                        <td className="p-3.5">
                          {customer.invoices && customer.invoices.length > 0 ? (
                            <div>
                              <div className="font-mono text-theme-text font-semibold">
                                Rp {customer.invoices[0].amount.toLocaleString('id-ID')}
                              </div>
                              <div className="text-[10px] text-theme-muted mt-0.5">
                                Due: {new Date(customer.invoices[0].dueDate).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-theme-muted">-</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Full Profile */}
                            <Link
                              href={`/pelanggan/${customer.id}`}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                              title="Lihat Profil Lengkap"
                            >
                              <Eye size={15} />
                            </Link>

                            {/* WhatsApp Quick Message */}
                            <a
                              href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Halo ${customer.name}, ini dari Tim Administrasi AUDIRA NET.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-theme-muted hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                              title="Chat WhatsApp"
                            >
                              <MessageSquare size={15} />
                            </a>

                            {/* Reset / Kick Session (CoA) */}
                            <button
                              onClick={() => handleKickSession(customer.id, customer.name)}
                              disabled={actionLoading === `coa-${customer.id}`}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                              title="Kick / Reconnect Sesi (CoA)"
                            >
                              <Zap size={15} className={actionLoading === `coa-${customer.id}` ? 'animate-spin text-blue-500' : ''} />
                            </button>

                            {/* Suspend / Unsuspend */}
                            <button
                              onClick={() => handleToggleSuspend(customer)}
                              disabled={actionLoading === `suspend-${customer.id}`}
                              className={`p-1.5 rounded-lg transition ${
                                isSuspended 
                                  ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40' 
                                  : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                              }`}
                              title={isSuspended ? 'Buka Isolir (Aktifkan)' : 'Isolir Koneksi'}
                            >
                              <Power size={15} />
                            </button>

                            {/* Edit Modal */}
                            <button
                              onClick={() => {
                                setEditingCustomer(customer)
                                setShowEditModal(true)
                              }}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit Profil"
                            >
                              <Edit size={15} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(customer.id, customer.name, customer.internetNumber, customer.phone)}
                              disabled={actionLoading === `delete-${customer.id}`}
                              className="p-1.5 rounded-lg text-theme-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Hapus Pelanggan"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-theme-muted">
                Menampilkan <span className="font-semibold text-theme-text font-mono">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-semibold text-theme-text font-mono">{Math.min(currentPage * pageSize, filteredCustomers.length)}</span> dari <span className="font-semibold text-theme-text font-mono">{filteredCustomers.length}</span> pelanggan
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-theme-border bg-theme-card text-theme-muted hover:text-theme-text disabled:opacity-40 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-1 font-mono text-xs font-semibold text-theme-text">
                  Hal {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-theme-border bg-theme-card text-theme-muted hover:text-theme-text disabled:opacity-40 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grid Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedCustomers.map(customer => {
              const isSuspended = customer.status === 'suspended'
              const cleanPhone = customer.phone.replace(/[^0-9]/g, '')
              const waPhone = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone

              return (
                <div key={customer.id} className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-theme-text">{customer.name}</h4>
                        <div className="text-[11px] text-theme-muted font-mono">{customer.internetNumber || customer.id.slice(0, 10)}</div>
                      </div>
                      {getStatusBadge(customer.status)}
                    </div>

                    <div className="space-y-1 text-xs text-theme-muted pt-2 border-t border-theme-border/50">
                      <div className="flex items-center justify-between">
                        <span>Paket:</span>
                        <span className="font-semibold text-theme-text">{customer.packages?.[0]?.name || '-'} ({customer.packages?.[0]?.speed || '-'})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Biaya:</span>
                        <span className="font-mono font-bold text-theme-text">Rp {customer.packages?.[0]?.price?.toLocaleString('id-ID') || 0}/bln</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Kontak:</span>
                        <span className="font-mono text-theme-text">{customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-3 border-t border-theme-border/50">
                    <Link
                      href={`/pelanggan/${customer.id}`}
                      className="p-1.5 rounded-lg border border-theme-border text-theme-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                      title="Lihat Profil"
                    >
                      <Eye size={14} />
                    </Link>
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Halo ${customer.name}, ini dari Layanan Pelanggan AUDIRA NET.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold transition"
                    >
                      <MessageSquare size={13} /> WA
                    </a>
                    <button
                      onClick={() => handleToggleSuspend(customer)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isSuspended
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      <Power size={13} /> {isSuspended ? 'Aktifkan' : 'Isolir'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCustomer(customer)
                        setShowEditModal(true)
                      }}
                      className="p-1.5 rounded-lg border border-theme-border text-theme-muted hover:text-theme-text transition cursor-pointer"
                      title="Edit Profil"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.name, customer.internetNumber, customer.phone)}
                      className="p-1.5 rounded-lg border border-theme-border text-theme-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Hapus Pelanggan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ─── MODAL: Tambah Customer Baru ────────────────────────────── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <form onSubmit={handleCreateCustomer}>
                <div className="p-5 border-b border-theme-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-base font-bold text-theme-text flex items-center gap-2">
                    <Plus size={18} className="text-theme-primary" /> Tambah Pelanggan Baru
                  </h3>
                  <button type="button" onClick={() => setShowAddModal(false)} className="text-theme-muted hover:text-theme-text">✕</button>
                </div>
                <div className="p-5 space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Nama Lengkap *</label>
                    <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">No. Telepon / WhatsApp *</label>
                    <input required value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Contoh: 081234567890" className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Email (Opsional)</label>
                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="pelanggan@domain.com" className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Pilih Paket Layanan</label>
                    <select value={newPackageId} onChange={e => setNewPackageId(e.target.value)} className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500">
                      <option value="">Tanpa Paket</option>
                      {Array.isArray(availablePackages) && availablePackages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} ({pkg.speed}) - Rp {pkg.price.toLocaleString('id-ID')}/bln
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Alamat Pemasangan</label>
                    <textarea value={newAddress} onChange={e => setNewAddress(e.target.value)} rows={3} placeholder="Jalan, Blok/No, RT/RW, Kelurahan..." className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5 bg-slate-50/50 dark:bg-slate-900/50">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition">Batal</button>
                  <button type="submit" disabled={actionLoading === 'create'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Simpan Pelanggan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL: Edit Customer ───────────────────────────────────── */}
        {showEditModal && editingCustomer && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <form onSubmit={handleSaveEdit}>
                <div className="p-5 border-b border-theme-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-base font-bold text-theme-text flex items-center gap-2">
                    <Edit size={18} className="text-theme-primary" /> Edit Data Pelanggan
                  </h3>
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingCustomer(null); }} className="text-theme-muted hover:text-theme-text">✕</button>
                </div>
                <div className="p-5 space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Nama Lengkap *</label>
                    <input required value={editingCustomer.name} onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })} className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">No. Telepon *</label>
                    <input required value={editingCustomer.phone} onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Email</label>
                    <input type="email" value={editingCustomer.email || ''} onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value || null })} className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Status Layanan</label>
                    <select value={editingCustomer.status} onChange={e => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })} className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500">
                      <option value="active">Aktif</option>
                      <option value="suspended">Isolir / Suspend</option>
                      <option value="expired">Expired</option>
                      <option value="trial">Trial</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Alamat Pemasangan</label>
                    <textarea value={editingCustomer.address || ''} onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value || null })} rows={3} className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5 bg-slate-50/50 dark:bg-slate-900/50">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingCustomer(null); }} className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition">Batal</button>
                  <button type="submit" disabled={actionLoading === 'save-edit'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
