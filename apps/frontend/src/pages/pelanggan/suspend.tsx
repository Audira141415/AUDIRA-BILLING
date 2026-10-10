import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  UserX, Search, Eye, Edit, RefreshCw, Phone, Calendar, CheckCircle, ShieldAlert,
  MessageSquare, Trash2, Ban, ChevronDown, List, Grid, Clock, Wallet, HelpCircle, Check, Play, UserCheck, AlertTriangle, Plus, MoreHorizontal, Download, FileText
} from 'lucide-react'

interface SuspendedCustomer {
  id: string
  name: string
  packageName: string
  phone: string
  email: string
  salesName: string
  suspendReason: 'Tunggakan' | 'Request Customer' | 'Lainnya'
  suspendType: 'Auto Suspend' | 'Manual Suspend'
  suspendDate: string
  outstandingAmount: number
  activationDate: string
  activationStatus: 'Auto Suspend' | 'Manual Suspend'
  area: string
  initials: string
  colorClass: string
}

// Initial mock data matching the updated screenshot exactly
const INITIAL_SUSPEND_DATA: SuspendedCustomer[] = [
  { id: '1', name: 'Rudi Hartono', initials: 'RH', colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', packageName: 'Home 50 Mbps', phone: '0812-3456-7890', email: 'rudi.h@email.com', salesName: 'Budi Santoso', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '28 Jun 2026 10:30', outstandingAmount: 350000, activationDate: '03 Jul 2026', activationStatus: 'Auto Suspend', area: 'Cimahi Selatan' },
  { id: '2', name: 'Siti Aisyah', initials: 'SA', colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', packageName: 'Home 20 Mbps', phone: '0813-9876-5432', email: 'siti.a@email.com', salesName: 'Dewi Lestari', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '28 Jun 2026 09:15', outstandingAmount: 250000, activationDate: '03 Jul 2026', activationStatus: 'Auto Suspend', area: 'Cimahi Utara' },
  { id: '3', name: 'Ahmad Fauzi', initials: 'AF', colorClass: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', packageName: 'Business 100 Mbps', phone: '0821-2345-6789', email: 'ahmad.f@email.com', salesName: 'Rina Marlina', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '27 Jun 2026 16:45', outstandingAmount: 650000, activationDate: '02 Jul 2026', activationStatus: 'Auto Suspend', area: 'Bandung Barat' },
  { id: '4', name: 'Dian Permata', initials: 'DP', colorClass: 'bg-green-600/20 text-green-400 border border-green-500/30', packageName: 'Home 20 Mbps', phone: '0811-2222-3333', email: 'dian.p@email.com', salesName: 'Budi Santoso', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '27 Jun 2026 14:20', outstandingAmount: 250000, activationDate: '02 Jul 2026', activationStatus: 'Auto Suspend', area: 'Cimahi Tengah' },
  { id: '5', name: 'Yoga Pratama', initials: 'YP', colorClass: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', packageName: 'Home 50 Mbps', phone: '0822-4444-5555', email: 'yoga.p@email.com', salesName: 'Dewi Lestari', suspendReason: 'Request Customer', suspendType: 'Manual Suspend', suspendDate: '26 Jun 2026 11:05', outstandingAmount: 0, activationDate: '11 Jul 2026', activationStatus: 'Manual Suspend', area: 'Cimahi Selatan' },
  { id: '6', name: 'Lina Handayani', initials: 'LH', colorClass: 'bg-green-600/20 text-green-400 border border-green-500/30', packageName: 'Business 100 Mbps', phone: '0817-7777-8888', email: 'lina.h@email.com', salesName: 'Rina Marlina', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '26 Jun 2026 09:40', outstandingAmount: 950000, activationDate: '01 Jul 2026', activationStatus: 'Auto Suspend', area: 'Bandung Barat' },
  { id: '7', name: 'Fajar Nugroho', initials: 'FN', colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30', packageName: 'Dedicated 200 Mbps', phone: '0816-9999-0000', email: 'fajar.n@email.com', salesName: 'Budi Santoso', suspendReason: 'Request Customer', suspendType: 'Manual Suspend', suspendDate: '25 Jun 2026 17:30', outstandingAmount: 0, activationDate: '25 Jul 2026', activationStatus: 'Manual Suspend', area: 'Cimahi Utara' },
  { id: '8', name: 'Maya Sari', initials: 'MS', colorClass: 'bg-green-600/20 text-green-400 border border-green-500/30', packageName: 'Home 20 Mbps', phone: '0812-1234-5678', email: 'maya.s@email.com', salesName: 'Dewi Lestari', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '25 Jun 2026 10:20', outstandingAmount: 250000, activationDate: '30 Jun 2026', activationStatus: 'Auto Suspend', area: 'Cimahi Tengah' },
  { id: '9', name: 'Budi Setiawan', initials: 'BS', colorClass: 'bg-orange-650/20 text-orange-400 border border-orange-500/30 bg-orange-600/10', packageName: 'Home 50 Mbps', phone: '0823-5555-6666', email: 'budi.s@email.com', salesName: 'Rina Marlina', suspendReason: 'Tunggakan', suspendType: 'Auto Suspend', suspendDate: '24 Jun 2026 15:10', outstandingAmount: 250000, activationDate: '29 Jun 2026', activationStatus: 'Auto Suspend', area: 'Cimahi Selatan' },
  { id: '10', name: 'Novia Putri', initials: 'NP', colorClass: 'bg-purple-600/20 text-purple-400 border border-purple-500/30', packageName: 'Home 20 Mbps', phone: '0819-8888-9999', email: 'novia.p@email.com', salesName: 'Dewi Lestari', suspendReason: 'Lainnya', suspendType: 'Manual Suspend', suspendDate: '24 Jun 2026 09:00', outstandingAmount: 0, activationDate: '24 Jul 2026', activationStatus: 'Manual Suspend', area: 'Cimahi Utara' }
]

export default function CustomerSuspend() {
  const router = useRouter()
  const [customers, setCustomers] = useState<SuspendedCustomer[]>(INITIAL_SUSPEND_DATA)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [reasonFilter, setReasonFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [salesFilter, setSalesFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [dateRange, setDateRange] = useState('01/06/2026 - 01/07/2026')
  const [statusFilter, setStatusFilter] = useState('all')

  // Tab filter (Semua, Auto Suspend, Manual Suspend, Akan Aktif)
  const [activeTab, setActiveTab] = useState<'all' | 'auto' | 'manual' | 'akan_aktif' | 'aktif_kembali'>('all')

  // Pagination & Layout View state
  const [pageSize, setPageSize] = useState(25)
  const [isGridView, setIsGridView] = useState(false)

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Load actual customers and merge with mock data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.pelanggan.getAll()
      const dbSuspended = Array.isArray(data)
        ? data.filter((c: any) => c.status === 'suspended').map((c: any) => {
            const pkgName = c.packages?.[0]?.name || 'Home 20 Mbps'
            return {
              id: c.id,
              name: c.name,
              initials: c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
              colorClass: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
              packageName: pkgName,
              phone: c.phone || '0812-0000-0000',
              email: c.email || `${c.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
              salesName: 'Budi Santoso',
              suspendReason: 'Tunggakan' as const,
              suspendType: 'Auto Suspend' as const,
              suspendDate: '28 Jun 2026 10:30',
              outstandingAmount: 250000,
              activationDate: '03 Jul 2026',
              activationStatus: 'Auto Suspend' as const,
              area: 'Cimahi Selatan'
            }
          })
        : []
      setCustomers([...dbSuspended, ...INITIAL_SUSPEND_DATA])
    } catch (err) {
      console.error(err)
      setCustomers(INITIAL_SUSPEND_DATA)
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
    setReasonFilter('all')
    setPackageFilter('all')
    setSalesFilter('all')
    setAreaFilter('all')
    setStatusFilter('all')
  }

  // Bulk selections
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

  // Unsuspend Action (Aktifkan)
  const handleBulkUnsuspend = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin mengaktifkan kembali ${selectedIds.length} customer terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.keuangan.unsuspendCustomer(id)
        }
      }

      setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)))
      setSelectedIds([])
      alert('Berhasil mengaktifkan kembali customer terpilih.')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat memproses unsuspend.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data customer suspend terpilih?`)) return

    try {
      setActionLoading(true)
      for (const id of selectedIds) {
        if (id.length > 5) {
          await api.pelanggan.delete(id)
        }
      }
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

  // Filters logic
  const filteredCustomers = customers.filter(c => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchName = c.name.toLowerCase().includes(term)
      const matchPhone = c.phone.includes(term)
      const matchEmail = c.email.toLowerCase().includes(term)
      const matchPkg = c.packageName.toLowerCase().includes(term)
      if (!matchName && !matchPhone && !matchEmail && !matchPkg) return false
    }

    // Tab Filters
    if (activeTab === 'auto' && c.suspendType !== 'Auto Suspend') return false
    if (activeTab === 'manual' && c.suspendType !== 'Manual Suspend') return false
    if (activeTab === 'akan_aktif' && c.activationDate !== '03 Jul 2026') return false // Mock filter

    // Dropdown filters
    if (reasonFilter !== 'all' && c.suspendReason.toLowerCase() !== reasonFilter.toLowerCase()) return false
    if (packageFilter !== 'all' && c.packageName.toLowerCase() !== packageFilter.toLowerCase()) return false
    if (salesFilter !== 'all' && c.salesName.toLowerCase() !== salesFilter.toLowerCase()) return false
    if (areaFilter !== 'all' && c.area.toLowerCase() !== areaFilter.toLowerCase()) return false
    if (statusFilter !== 'all' && c.activationStatus.toLowerCase() !== statusFilter.toLowerCase()) return false

    return true
  })

  // Dynamic statistics calculations
  const countTotal = customers.length
  const countAuto = customers.filter(c => c.suspendType === 'Auto Suspend').length
  const countManual = customers.filter(c => c.suspendType === 'Manual Suspend').length
  const countAkanAktif = 18 // Mock statistic matching design
  const totalOutstanding = 125430000 // Rp 125.430.000
  const avgOutstanding = 402017 // Rp 402.017

  // Donut chart variables
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const getOffset = (count: number) => {
    const pct = countTotal > 0 ? (count / countTotal) : 0
    return circumference - pct * circumference
  }

  const offsetAuto = getOffset(countAuto)
  const offsetManual = getOffset(countManual)

  return (
    <Layout>
      <div className="min-h-screen bg-[#080d19] text-gray-200 p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
              <Link href="/pelanggan" className="hover:text-blue-400 transition">Customer</Link>
              <span>&gt;</span>
              <span className="text-blue-400">Customer Suspend</span>
            </div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
              Customer Suspend
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

        {/* 6 Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Suspend */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-blue-500/35 transition cursor-pointer" onClick={() => { setActiveTab('all'); handleResetFilters(); }}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Suspend</span>
              <p className="text-2xl font-black text-white mt-1">{countTotal}</p>
              <p className="text-[10px] text-gray-400">Semua data suspend</p>
            </div>
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 2: Auto Suspend */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-orange-500/35 transition cursor-pointer" onClick={() => setActiveTab('auto')}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Auto Suspend</span>
              <p className="text-2xl font-black text-orange-400 mt-1">{countAuto}</p>
              <p className="text-[10px] text-gray-400">Suspend otomatis</p>
            </div>
            <div className="p-3 bg-orange-650/10 rounded-xl text-orange-400 border border-orange-500/20 bg-orange-600/10">
              <Clock size={20} />
            </div>
          </div>

          {/* Card 3: Manual Suspend */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-purple-500/35 transition cursor-pointer" onClick={() => setActiveTab('manual')}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Manual Suspend</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{countManual}</p>
              <p className="text-[10px] text-gray-400">Suspend manual</p>
            </div>
            <div className="p-3 bg-purple-600/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Wallet size={20} />
            </div>
          </div>

          {/* Card 4: Akan Aktif */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-red-500/35 transition cursor-pointer" onClick={() => setActiveTab('akan_aktif')}>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Akan Aktif (Hari Ini)</span>
              <p className="text-2xl font-black text-red-400 mt-1">{countAkanAktif}</p>
              <p className="text-[10px] text-gray-400">Akan aktif hari ini</p>
            </div>
            <div className="p-3 bg-red-600/10 rounded-xl text-red-455 border border-red-500/20 text-red-500">
              <Ban size={20} />
            </div>
          </div>

          {/* Card 5: Total Outstanding */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-teal-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Outstanding</span>
              <p className="text-lg font-black text-teal-400 mt-1">Rp 125.430.000</p>
              <p className="text-[10px] text-gray-400">Total tunggakan</p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 6: Rata-rata Tunggakan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between hover:border-green-500/35 transition cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rata-rata Tunggakan</span>
              <p className="text-lg font-black text-green-400 mt-1">Rp 402.017</p>
              <p className="text-[10px] text-gray-400">Per customer</p>
            </div>
            <div className="p-3 bg-green-600/10 rounded-xl text-green-400 border border-green-500/20">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Cari nama, no. hp, email, paket, area..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#131d35]/50 border border-[#131d35] rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button onClick={handleResetFilters} className="px-4 py-3 bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35] text-xs font-semibold rounded-xl text-gray-400 hover:text-white transition">
                Reset
              </button>
              <button className="flex items-center gap-1.5 px-4 py-3 bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35] text-xs font-semibold rounded-xl text-gray-400 hover:text-white transition">
                Export <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Filtering Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Alasan Suspend</label>
              <select value={reasonFilter} onChange={e => setReasonFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="tunggakan">Tunggakan</option>
                <option value="request customer">Request Customer</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Paket</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Paket</option>
                <option value="home 20 mbps">Home 20 Mbps</option>
                <option value="home 50 mbps">Home 50 Mbps</option>
                <option value="business 100 mbps">Business 100 Mbps</option>
                <option value="dedicated 200 mbps">Dedicated 200 Mbps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Sales</label>
              <select value={salesFilter} onChange={e => setSalesFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Sales</option>
                <option value="budi santoso">Budi Santoso</option>
                <option value="dewi lestari">Dewi Lestari</option>
                <option value="rina marlina">Rina Marlina</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Area</label>
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua Area</option>
                <option value="cimahi selatan">Cimahi Selatan</option>
                <option value="cimahi utara">Cimahi Utara</option>
                <option value="cimahi tengah">Cimahi Tengah</option>
                <option value="bandung barat">Bandung Barat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Tanggal Suspend</label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold block">Status Aktivasi</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-[#131d35] border border-[#131d35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="all">Semua</option>
                <option value="auto suspend">Auto Suspend</option>
                <option value="manual suspend">Manual Suspend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Table & Tab navigation */}
          <div className="xl:col-span-9 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-[#131d35] pb-px">
              <div className="flex overflow-x-auto gap-2 scrollbar-none">
                {[
                  { id: 'all', label: `Semua Suspend (${countTotal})` },
                  { id: 'auto', label: `Auto Suspend (${countAuto})` },
                  { id: 'manual', label: `Manual Suspend (${countManual})` },
                  { id: 'akan_aktif', label: `Akan Aktif (${countAkanAktif})` },
                  { id: 'aktif_kembali', label: `Aktif Kembali (Bulan Ini) (56)` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id 
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
                    onChange={e => setPageSize(parseInt(e.target.value))}
                    className="bg-[#131d35] border border-[#131d35] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>data</span>
                </div>

                <div className="flex items-center border border-[#131d35] rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-2 transition-colors ${!isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131d35]/30 text-gray-500 hover:text-gray-300'}`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-2 transition-colors ${isGridView ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131d35]/30 text-gray-500 hover:text-gray-300'}`}
                    title="Grid View"
                  >
                    <Grid size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Suspend Table */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#131d35] text-gray-500 uppercase tracking-wider font-bold">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0" 
                        />
                      </th>
                      <th className="p-4 w-10 text-center">NO</th>
                      <th className="p-4">PELANGGAN</th>
                      <th className="p-4">PAKET</th>
                      <th className="p-4">SALES</th>
                      <th className="p-4">ALASAN SUSPEND</th>
                      <th className="p-4">TANGGAL SUSPEND</th>
                      <th className="p-4">TUNGGAKAN</th>
                      <th className="p-4">AKAN AKTIF</th>
                      <th className="p-4">STATUS AKTIVASI</th>
                      <th className="p-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]/35">
                    {loading ? (
                      <tr><td colSpan={11} className="py-12 text-center text-gray-500">Memuat data customer suspend...</td></tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr><td colSpan={11} className="py-12 text-center text-gray-500">Tidak ada data customer suspend yang cocok.</td></tr>
                    ) : (
                      filteredCustomers.slice(0, pageSize).map((row, index) => {
                        const isSelected = selectedIds.includes(row.id)
                        
                        let reasonBadge = 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        if (row.suspendReason === 'Tunggakan') reasonBadge = 'bg-red-500/10 text-red-400 border border-red-500/20'
                        else if (row.suspendReason === 'Request Customer') reasonBadge = 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'

                        let actStatusBadge = 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
                        if (row.activationStatus === 'Auto Suspend') actStatusBadge = 'bg-red-500/10 text-red-400 border border-red-500/20'

                        return (
                          <tr 
                            key={row.id} 
                            className={`border-b border-[#131d35]/20 last:border-b-0 hover:bg-[#131d35]/25 transition ${
                              isSelected ? 'bg-blue-600/5' : ''
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => handleBulkSelect(row.id)}
                                className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b] text-blue-500 focus:ring-0" 
                              />
                            </td>
                            <td className="p-4 text-center text-gray-500 font-semibold">{index + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${row.colorClass}`}>
                                  {row.initials}
                                </div>
                                <div>
                                  <div className="font-bold text-white cursor-pointer hover:text-blue-400 flex items-center gap-1.5" onClick={() => router.push(`/pelanggan/${row.id}`)}>
                                    <span>{row.name}</span>
                                    <a href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
                                      <MessageSquare size={12} className="fill-green-500/10" />
                                    </a>
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-medium">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300 font-semibold">{row.packageName}</td>
                            <td className="p-4 text-gray-400 font-semibold">{row.salesName}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${reasonBadge}`}>
                                {row.suspendReason}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 font-medium">{row.suspendDate}</td>
                            <td className={`p-4 font-bold ${row.outstandingAmount > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                              {row.outstandingAmount > 0 ? `Rp ${row.outstandingAmount.toLocaleString('id-ID')}` : 'Rp 0'}
                            </td>
                            <td className="p-4 text-gray-400 font-medium">{row.activationDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${actStatusBadge}`}>
                                {row.activationStatus}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => router.push(`/pelanggan/${row.id}`)} className="p-1 hover:bg-[#131d35] hover:text-white text-gray-400 rounded transition" title="Lihat Detail">
                                  <Eye size={12} />
                                </button>
                                <button className="p-1 hover:bg-[#131d35] hover:text-white text-gray-400 rounded transition" title="Edit Data">
                                  <Edit size={12} />
                                </button>
                                <button className="p-1 hover:bg-[#131d35] hover:text-white text-gray-400 rounded transition">
                                  <MoreHorizontal size={12} />
                                </button>
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

            <div className="flex justify-between items-center text-xs text-gray-500 font-medium pt-2">
              <span>Menampilkan 1 - {Math.min(filteredCustomers.length, pageSize)} dari {filteredCustomers.length} data</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-[#131d35] border border-[#1e293b] text-gray-400 hover:text-white rounded-lg font-semibold">&lt;</button>
                <button className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg font-semibold">1</button>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-500 rounded-lg font-semibold">2</button>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-500 rounded-lg font-semibold">3</button>
                <span className="px-2 pt-1 text-gray-600">...</span>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-500 rounded-lg font-semibold">13</button>
                <button className="px-3 py-1 bg-[#131d35]/30 border border-[#1e293b]/50 text-gray-400 hover:text-white rounded-lg font-semibold">&gt;</button>
              </div>
            </div>

          </div>

          {/* Right Side: Widgets Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Widget 1: Ringkasan Suspend (Donut Chart) */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Statistik Suspend</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#131d35" strokeWidth="6" />
                    
                    {/* Auto Suspend (57.1%) - Red/Orange */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#ef4444" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetAuto}
                    />

                    {/* Manual Suspend (42.9%) - Orange */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="6" 
                      strokeDasharray={circumference}
                      strokeDashoffset={offsetManual}
                    />
                  </svg>
                  
                  <div className="absolute flex flex-col items-center">
                    <span className="text-base font-black text-white">{countTotal}</span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Total</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 flex-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-gray-400">Auto Suspend</span>
                    </div>
                    <span className="font-bold text-white">178 <span className="text-[8px] text-gray-500 font-normal">(57.1%)</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-450 bg-orange-400"></span>
                      <span className="text-gray-400">Manual Suspend</span>
                    </div>
                    <span className="font-bold text-white">134 <span className="text-[8px] text-gray-500 font-normal">(42.9%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Alasan Suspend */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Alasan Suspend</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Tunggakan', value: 238, pct: 'w-[76.3%]', color: 'bg-red-550 bg-red-500' },
                  { label: 'Request Customer', value: 58, pct: 'w-[18.6%]', color: 'bg-orange-500' },
                  { label: 'Lainnya', value: 16, pct: 'w-[5.1%]', color: 'bg-blue-500' }
                ].map(src => (
                  <div key={src.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-bold">{src.label}</span>
                      <span className="text-white font-bold">{src.value} <span className="text-[8px] text-gray-500 font-normal">({src.pct.replace('w-[', '').replace(']', '')})</span></span>
                    </div>
                    <div className="w-full bg-[#131d35] h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${src.color} ${src.pct}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Tunggakan Suspend */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tunggakan Suspend</h3>
              <div className="space-y-3.5">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold">Total Tunggakan</div>
                  <div className="text-lg font-black text-white mt-0.5">Rp 125.430.000</div>
                </div>
                <div className="border-t border-[#131d35] pt-3">
                  <div className="text-[10px] text-gray-500 font-bold">Rata-rata per Customer</div>
                  <div className="text-sm font-extrabold text-gray-300 mt-0.5">Rp 402.017</div>
                </div>
              </div>
            </div>

            {/* Widget 4: Aktivasi Cepat */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-3">
              <button onClick={handleBulkUnsuspend} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl transition shadow-lg">
                Aktifkan Massal
              </button>
              <button className="w-full py-2.5 bg-[#131d35] hover:bg-[#1e293b] border border-[#1e293b] text-xs font-bold text-gray-300 rounded-xl transition">
                Jadwalkan Aktivasi
              </button>
            </div>

          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0b1329] border border-[#131d35] p-4 rounded-2xl gap-4">
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            <span className="text-gray-400 font-bold">
              <span className="text-blue-400 font-black">{selectedIds.length}</span> dipilih
            </span>
            <label className="flex items-center gap-2 text-gray-300 font-semibold cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0} 
                onChange={e => handleSelectAll(e.target.checked)} 
                className="w-4 h-4 rounded bg-[#131d35] border-[#1e293b]" 
              />
              Pilih Semua
            </label>
            <div className="h-4 w-px bg-[#131d35] hidden sm:block"></div>
            <button
              onClick={handleBulkUnsuspend}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50 text-green-400 border border-green-500/20 rounded-xl font-bold transition"
            >
              <Check size={12} /> Aktifkan
            </button>
            <button
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131d35] hover:bg-[#1e293b] disabled:opacity-50 text-gray-300 border border-[#1e293b] rounded-xl font-bold transition"
            >
              <MessageSquare size={12} /> Kirim WhatsApp
            </button>
            <button
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131d35] hover:bg-[#1e293b] disabled:opacity-50 text-gray-300 border border-[#1e293b] rounded-xl font-bold transition"
            >
              <Download size={12} /> Export
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0 || actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#131d35] hover:bg-red-500/10 disabled:opacity-50 text-gray-400 hover:text-red-400 border border-[#1e293b] rounded-xl font-bold transition"
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


