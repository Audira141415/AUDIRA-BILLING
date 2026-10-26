import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  Clock, Hourglass, Wallet, CheckCircle, XCircle, Search, Eye, Edit, MoreHorizontal,
  RefreshCw, Phone, Calendar, Package, ArrowUpRight, Check, Trash2, Ban, Plus, ChevronDown, List, Grid, SlidersHorizontal
} from 'lucide-react'

interface PendingCustomer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  packageName: string
  salesName: string
  status: 'Menunggu Verifikasi' | 'Menunggu Pembayaran' | 'Pembayaran Diterima' | 'Ditolak'
  createdAt: string
  updatedAt: string
  area: string
}

// Initial mock data matching the screenshot exactly
const INITIAL_PENDING_DATA: PendingCustomer[] = []

export default function CustomerPending() {
  const router = useRouter()
  const [customers, setCustomers] = useState<PendingCustomer[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [salesFilter, setSalesFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [dateRange, setDateRange] = useState('01/06/2026 - 01/07/2026')

  // Layout View State
  const [pageSize, setPageSize] = useState(25)
  const [isGridView, setIsGridView] = useState(false)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Load actual customers from database and merge/append to match design
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.pelanggan.getAll()
      const dbPending = Array.isArray(data) 
        ? data.filter((c: any) => c.status === 'pending').map((c: any, index: number) => {
            // Map db schema to pending UI schema
            const pkgName = c.packages?.[0]?.name || 'Home 20 Mbps'
            return {
              id: c.id,
              name: c.name,
              phone: c.phone || '0812-0000-0000',
              email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
              address: c.address || 'Alamat tidak diisi',
              packageName: pkgName,
              salesName: 'Website / Form',
              status: 'Menunggu Verifikasi' as const,
              createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              updatedAt: new Date(c.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              area: 'Cimahi Selatan'
            }
          })
        : []

      setCustomers(dbPending)
    } catch (err) {
      console.error(err)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPackageFilter('all')
    setSalesFilter('all')
    setPaymentFilter('all')
    setAreaFilter('all')
  }

  // Bulk Actions
  const handleBulkSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCustomers.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleBulkStatusChange = async (newStatus: 'active' | 'suspended' | 'inactive') => {
    if (selectedIds.length === 0) return
    const actionName = newStatus === 'active' ? 'Memverifikasi' : 'Menolak'
    if (!confirm(`Apakah Anda yakin ingin ${actionName.toLowerCase()} ${selectedIds.length} pengajuan terpilih?`)) return
    
    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        // If it is a real DB customer id (not '1' - '10' mock items), hit the API
        if (id.length > 5) {
          await api.pelanggan.update(id, { status: newStatus })
        }
      }

      // Update local state for mock items
      const statusLabel = newStatus === 'active' ? 'Pembayaran Diterima' : 'Ditolak'
      setCustomers(prev => 
        prev.map(c => selectedIds.includes(c.id) ? { ...c, status: statusLabel as any } : c)
      )
      
      setSelectedIds([])
      alert(`Berhasil ${actionName.toLowerCase()} pengajuan terpilih.`)
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat memproses data.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} pengajuan terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.pelanggan.delete(id)
        }
      }

      // Update local state
      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      alert('Data terpilih berhasil dihapus.')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data terpilih.')
    } finally {
      setActionLoading(false)
    }
  }

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    // Search Term matching
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchName = c.name.toLowerCase().includes(term)
      const matchPhone = c.phone.includes(term)
      const matchEmail = c.email.toLowerCase().includes(term)
      const matchPkg = c.packageName.toLowerCase().includes(term)
      const matchSales = c.salesName.toLowerCase().includes(term)
      if (!matchName && !matchPhone && !matchEmail && !matchPkg && !matchSales) return false
    }

    // Status Tab/Dropdown Filter
    if (statusFilter !== 'all') {
      const statusMap: Record<string, string> = {
        verifikasi: 'Menunggu Verifikasi',
        pembayaran: 'Menunggu Pembayaran',
        diterima: 'Pembayaran Diterima',
        ditolak: 'Ditolak'
      }
      const targetStatus = statusMap[statusFilter] || statusFilter
      if (c.status.toLowerCase() !== targetStatus.toLowerCase()) return false
    }

    // Package Filter
    if (packageFilter !== 'all' && c.packageName.toLowerCase() !== packageFilter.toLowerCase()) return false

    // Sales Filter
    if (salesFilter !== 'all' && c.salesName.toLowerCase() !== salesFilter.toLowerCase()) return false

    // Area Filter
    if (areaFilter !== 'all' && c.area.toLowerCase() !== areaFilter.toLowerCase()) return false

    return true
  })

  // Dynamic statistics calculations
  const countTotal = customers.length
  const countVerifikasi = customers.filter(c => c.status === 'Menunggu Verifikasi').length
  const countPembayaran = customers.filter(c => c.status === 'Menunggu Pembayaran').length
  const countDiterima = customers.filter(c => c.status === 'Pembayaran Diterima').length
  const countDitolak = customers.filter(c => c.status === 'Ditolak').length

  // Donut chart variables
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const getOffset = (count: number) => {
    const pct = countTotal > 0 ? (count / countTotal) : 0
    return circumference - pct * circumference
  }

  // Segments offsets calculation
  const offsetVerifikasi = getOffset(countVerifikasi)
  const offsetPembayaran = getOffset(countPembayaran)
  const offsetDiterima = getOffset(countDiterima)
  const offsetDitolak = getOffset(countDitolak)

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/pelanggan" className="hover:text-[var(--app-text)]">Customer CRM</Link>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Customer Pending</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              Customer Pending & Verifikasi Berkas
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Antrean registrasi calon pelanggan baru yang memerlukan verifikasi administrasi dan survei lokasi ODP.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              href="/pelanggan/tambah"
              className="px-4 py-2 bg-[var(--app-primary)] hover:opacity-90 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus size={15} />
              Tambah Calon Pelanggan
            </Link>
          </div>
        </div>

        {/* 5 Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          
          {/* Card 1: Total Pending */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-blue-500/35 transition cursor-pointer" onClick={() => setStatusFilter('all')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pending</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{countTotal}</p>
              <p className="text-[10px] text-slate-500">Semua data pending</p>
            </div>
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-orange-500/35 transition cursor-pointer" onClick={() => setStatusFilter('verifikasi')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Menunggu Verifikasi</span>
              <p className="text-2xl font-black text-orange-400 mt-1">{countVerifikasi}</p>
              <p className="text-[10px] text-slate-500">Menunggu verifikasi admin</p>
            </div>
            <div className="p-3 bg-orange-600/10 rounded-xl text-orange-400 border border-orange-500/20">
              <Hourglass size={20} />
            </div>
          </div>

          {/* Card 3: Menunggu Pembayaran */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-purple-500/35 transition cursor-pointer" onClick={() => setStatusFilter('pembayaran')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Menunggu Pembayaran</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{countPembayaran}</p>
              <p className="text-[10px] text-slate-500">Menunggu pembayaran</p>
            </div>
            <div className="p-3 bg-purple-600/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Wallet size={20} />
            </div>
          </div>

          {/* Card 4: Pembayaran Diterima */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-green-500/35 transition cursor-pointer" onClick={() => setStatusFilter('diterima')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pembayaran Diterima</span>
              <p className="text-2xl font-black text-green-400 mt-1">{countDiterima}</p>
              <p className="text-[10px] text-slate-500">Pembayaran sudah diterima</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 5: Ditolak */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between hover:border-red-500/35 transition cursor-pointer" onClick={() => setStatusFilter('ditolak')}>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ditolak</span>
              <p className="text-2xl font-black text-red-400 mt-1">{countDitolak}</p>
              <p className="text-[10px] text-slate-500">Pengajuan ditolak</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
              <XCircle size={20} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama, no. hp, email, paket, sales..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleResetFilters} className="px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition">
                Reset
              </button>
              <button onClick={() => alert("Mengekspor daftar pelanggan pending...")} className="flex items-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition">Export <ChevronDown size={14} /></button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Status Pending</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Status</option>
                <option value="verifikasi">Menunggu Verifikasi</option>
                <option value="pembayaran">Menunggu Pembayaran</option>
                <option value="diterima">Pembayaran Diterima</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Paket</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                <option value="home 20 mbps">Home 20 Mbps</option>
                <option value="home 50 mbps">Home 50 Mbps</option>
                <option value="business 100 mbps">Business 100 Mbps</option>
                <option value="dedicated 200 mbps">Dedicated 200 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Sales</label>
              <select value={salesFilter} onChange={e => setSalesFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Sales</option>
                <option value="budi santoso">Budi Santoso</option>
                <option value="dewi lestari">Dewi Lestari</option>
                <option value="rina marlina">Rina Marlina</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Tanggal Pengajuan</label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Metode Pembayaran</label>
              <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="qris">QRIS</option>
                <option value="trf">Transfer Bank</option>
                <option value="cash">Tunai</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold block">Area</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="cimahi selatan">Cimahi Selatan</option>
                <option value="cimahi utara">Cimahi Utara</option>
                <option value="cimahi tengah">Cimahi Tengah</option>
                <option value="bandung barat">Bandung Barat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Columns Grid: 2 Columns (Table + Widget Sidebar) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Tabs Navigation and Table (xl:col-span-9) */}
          <div className="xl:col-span-9 space-y-4">
            
            {/* Sub-Navigation Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-slate-200 pb-px">
              <div className="flex overflow-x-auto gap-2 scrollbar-none">
                {[
                  { id: 'verifikasi', label: `Menunggu Verifikasi (${countVerifikasi})` },
                  { id: 'pembayaran', label: `Menunggu Pembayaran (${countPembayaran})` },
                  { id: 'diterima', label: `Pembayaran Diterima (${countDiterima})` },
                  { id: 'ditolak', label: `Ditolak (${countDitolak})` },
                  { id: 'all', label: `Semua (${countTotal})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all ${
                      statusFilter === tab.id 
                        ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                        : 'border-transparent text-slate-500 hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pb-3 sm:pb-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Tampilkan</span>
                  <select 
                    value={pageSize} 
                    onChange={e => setPageSize(parseInt(e.target.value))}
                    className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data</span>
                </div>

                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-2 transition-colors ${!isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-2 transition-colors ${isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                    title="Grid View"
                  >
                    <Grid size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* List Table Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-100 border-slate-200 text-blue-500 focus:ring-0 focus:ring-offset-0" 
                        />
                      </th>
                      <th className="p-4 w-10 text-center">NO</th>
                      <th className="p-4">TANGGAL PENGAJUAN</th>
                      <th className="p-4">NAMA</th>
                      <th className="p-4">PAKET</th>
                      <th className="p-4">SALES</th>
                      <th className="p-4">NO. HP / EMAIL</th>
                      <th className="p-4">AREA</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">TERAKHIR DIUPDATE</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/35">
                    {loading ? (
                      <tr><td colSpan={11} className="py-12 text-center text-slate-400">Memuat data customer pending...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={11} className="py-12 text-center text-slate-400">Tidak ada data customer pending yang cocok.</td></tr>
                    ) : (
                      filteredCustomers.slice(0, pageSize).map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        let badgeColor = 'bg-gray-500/10 text-slate-500 border border-gray-500/20'
                        if (row.status === 'Menunggu Verifikasi') badgeColor = 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        else if (row.status === 'Menunggu Pembayaran') badgeColor = 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        else if (row.status === 'Pembayaran Diterima') badgeColor = 'bg-green-500/10 text-green-400 border border-green-500/20'
                        else if (row.status === 'Ditolak') badgeColor = 'bg-red-500/10 text-red-400 border border-red-500/20'

                        return (
                          <tr 
                            key={row.id} 
                            className={`border-b border-slate-200/20 last:border-b-0 hover:bg-slate-100/25 transition ${
                              isSelected ? 'bg-blue-600/5' : ''
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(row.id)}
                                className="w-4 h-4 rounded bg-slate-100 border-slate-200 text-blue-500 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-center text-slate-400 font-semibold">{index + 1}</td>
                            <td className="p-4 text-slate-500 font-medium">{row.createdAt}</td>
                            <td className="p-4 font-bold text-slate-800 cursor-pointer hover:text-blue-600" onClick={() => router.push(`/pelanggan/${row.id}`)}>{row.name}</td>
                            <td className="p-4 text-slate-700 font-semibold">{row.packageName}</td>
                            <td className="p-4 text-slate-500 font-medium">{row.salesName}</td>
                            <td className="p-4 text-slate-700 font-semibold">
                              <div className="flex flex-col">
                                <span>{row.phone}</span>
                                <span className="text-[10px] text-slate-400 font-normal">{row.email}</span>
                              </div>
                            </td>
                            <td className="p-4 text-slate-500 font-medium">{row.area}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${badgeColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-medium">{row.updatedAt}</td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition">
                                  <Eye size={12} />
                                </button>
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition">
                                  <Edit size={12} />
                                </button>
                                <button onClick={() => alert("Opsi tindakan: Verifikasi Pendaftaran, Kirim WhatsApp, Batalkan.")} className="p-1 hover:bg-slate-100 hover:text-white text-slate-500 rounded transition"><MoreHorizontal size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2">
              <span>Menampilkan 1 - {Math.min(filteredCustomers.length, pageSize)} dari {filteredCustomers.length} data</span>
              <div className="flex gap-1">
                <button onClick={() => alert("Halaman pertama sudah aktif.")} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg font-semibold">&lt;</button>
                <button onClick={() => alert("Halaman 1 saat ini aktif.")} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg font-semibold">1</button>
                <button onClick={() => alert("Beralih ke halaman 2")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">2</button>
                <button onClick={() => alert("Beralih ke halaman 3")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">3</button>
                <span className="px-2 pt-1 text-gray-600">...</span>
                <button onClick={() => alert("Beralih ke halaman 13")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-400 rounded-lg font-semibold">13</button>
                <button onClick={() => alert("Beralih ke halaman selanjutnya.")} className="px-3 py-1 bg-slate-100 border border-slate-200/50 text-slate-500 hover:text-slate-900 rounded-lg font-semibold">&gt;</button>
              </div>
            </div>

          </div>

          {/* Right Side: Sidebar Widgets (xl:col-span-3) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Statistik Pending (Donut Chart) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Statistik Pending</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                    
                    {/* Menunggu Verifikasi (40.6%) - Orange */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetVerifikasi}
                    />

                    {/* Menunggu Pembayaran (37.5%) - Purple */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#8b5cf6" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetPembayaran}
                    />

                    {/* Pembayaran Diterima (15.6%) - Green */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#10b981" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetDiterima}
                    />

                    {/* Ditolak (6.3%) - Red */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#ef4444" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetDitolak}
                    />
                  </svg>
                  
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-slate-900">{countTotal}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Total</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 flex-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      <span className="text-slate-500">Verifikasi</span>
                    </div>
                    <span className="font-bold text-slate-800">{countVerifikasi}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      <span className="text-slate-500">Pembayaran</span>
                    </div>
                    <span className="font-bold text-slate-800">{countPembayaran}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      <span className="text-slate-500">Diterima</span>
                    </div>
                    <span className="font-bold text-slate-800">{countDiterima}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      <span className="text-slate-500">Ditolak</span>
                    </div>
                    <span className="font-bold text-slate-800">{countDitolak}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Sumber Pending */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sumber Pending</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Website / Form', value: 64, pct: 'w-[50%]', color: 'bg-blue-500' },
                  { label: 'WhatsApp', value: 32, pct: 'w-[25%]', color: 'bg-[#10b981]' },
                  { label: 'Sales', value: 24, pct: 'w-[18.8%]', color: 'bg-[#f59e0b]' },
                  { label: 'Import Data', value: 8, pct: 'w-[6.2%]', color: 'bg-indigo-500' }
                ].map(src => (
                  <div key={src.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold">{src.label}</span>
                      <span className="text-white font-bold">{src.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${src.color} ${src.pct}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Aktivitas Terakhir */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Aktivitas Terakhir</h3>
              
              <div className="relative pl-4 border-l border-slate-200 space-y-5">
                {[
                  { time: '22 Okt 2026 08:25', desc: 'Pengajuan baru dari Rudi Hartono', detail: 'Paket Home 50 Mbps', icon: 'bg-orange-500/20 text-orange-400' },
                  { time: '22 Okt 2026 08:10', desc: 'Pengajuan baru dari Siti Aisyah', detail: 'Paket Home 20 Mbps', icon: 'bg-orange-500/20 text-orange-400' },
                  { time: '22 Okt 2026 07:45', desc: 'Pembayaran diterima dari Dian Permata', detail: 'Paket Home 20 Mbps', icon: 'bg-green-500/20 text-green-400' }
                ].map((act, i) => (
                  <div key={i} className="relative space-y-1 text-[10px]">
                    <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-50 border-2 border-blue-500"></span>
                    <span className="text-slate-400 font-bold">{act.time}</span>
                    <p className="text-white font-bold leading-relaxed">{act.desc}</p>
                    <p className="text-slate-500">{act.detail}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Action Bar (Bulk actions panel that matches the style) */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl gap-4">
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            <span className="text-slate-500 font-bold">
              <span className="text-blue-400 font-black">{selectedIds.length}</span> dipilih
            </span>
            <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                onChange={e => handleSelectAll(e.target.checked)} 
                className="w-4 h-4 rounded bg-slate-100 border-slate-200" 
              />
              Pilih Semua
            </label>
            <div className="h-4 w-px bg-slate-100 hidden sm:block"></div>
            <button
              onClick={() => handleBulkStatusChange('active')}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 text-green-400 border border-green-500/20 rounded-xl font-bold transition"
            >
              <Check size={12} /> Verifikasi
            </button>
            <button
              onClick={() => handleBulkStatusChange('inactive')}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 border border-red-500/20 rounded-xl font-bold transition"
            >
              <Ban size={12} /> Tolak
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-red-500/10 disabled:opacity-50 text-slate-500 hover:text-red-400 border border-slate-200 rounded-xl font-bold transition"
            >
              <Trash2 size={12} /> Hapus
            </button>
          </div>

          <button onClick={() => router.push('/pelanggan/tambah')} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-lg transition">
            <Plus size={14} /> Tambah Customer
          </button>
        </div>

      </div>
    </Layout>
  )
}

