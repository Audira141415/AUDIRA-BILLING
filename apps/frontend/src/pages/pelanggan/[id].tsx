import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  ArrowLeft,
  Edit,
  Plus,
  Lock,
  Ban,
  Trash2,
  Download,
  Calendar,
  Users,
  Package,
  Clock,
  CreditCard,
  FileText,
  Activity,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  User,
  ShieldAlert,
  DollarSign,
  CheckCircle,
  XCircle,
  PlusCircle,
  QrCode,
  Check,
  Play,
  RefreshCw,
  Eye,
  MessageSquare,
  Printer,
  Smartphone,
  Server
} from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft'
  dueDate: string
  createdAt: string
  paymentMethod?: string
  paidAt?: string
  month?: string
}

interface CustomerPackage {
  id: string
  name: string
  speed: string
  price: number
}

interface CustomerService {
  id: string
  name: string
  type: string
  status: string
}

interface SupportTicket {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
}

interface CustomerDetail {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  status: 'active' | 'suspended' | 'inactive'
  internetNumber: string | null
  ipAddress: string | null
  installedModem: string | null
  modemSerial: string | null
  installationDate: string | null
  createdAt: string
  packages: CustomerPackage[]
  services: CustomerService[]
  invoices: Invoice[]
  tickets: SupportTicket[]
}

interface CustomerNote {
  id: string
  date: string
  content: string
  author: string
}

export default function CustomerDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Informasi')
  
  // Custom mock/state data for fields not in basic database to achieve high-fidelity mockup
  const [ktp, setKtp] = useState('3203271501870001')
  const [sales, setSales] = useState('Budi Santoso')
  const [source, setSource] = useState('Walk In')
  const [type, setType] = useState('Perorangan')
  const [category, setCategory] = useState('Rumah')
  const [noteText, setNoteText] = useState('Pelanggan loyal')
  const [emergencyContact, setEmergencyContact] = useState({
    name: 'Siti Aminah',
    relation: 'Istri',
    phone: '0813-9876-5432',
    address: 'Sama dengan pelanggan'
  })
  
  // Notes List
  const [notes, setNotes] = useState<CustomerNote[]>([
    {
      id: '1',
      date: '01 Juli 2026 08:20',
      content: 'Pelanggan sudah bayar untuk bulan Juli.',
      author: 'Agus Dwi Rianto'
    },
    {
      id: '2',
      date: '15 Jan 2026 10:35',
      content: 'Pelanggan baru, pasang paket Home 50 Mbps.',
      author: 'Budi Santoso'
    }
  ])
  const [newNoteContent, setNewNoteContent] = useState('')

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false)
  const [showChangePackageModal, setShowChangePackageModal] = useState(false)
  
  // Edit Form Fields
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editIp, setEditIp] = useState('')
  const [editMac, setEditMac] = useState('AA:BB:CC:DD:EE:FF')
  const [editKtp, setEditKtp] = useState('')

  // New Invoice Form
  const [invoiceAmount, setInvoiceAmount] = useState('250000')
  const [invoiceMonth, setInvoiceMonth] = useState('2026-07')

  // Change Package Form
  const [availablePackages, setAvailablePackages] = useState<any[]>([])
  const [selectedPackageId, setSelectedPackageId] = useState('')

  const fetchCustomerData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await api.pelanggan.getOne(id as string)
      setCustomer(data)
      
      // Prefill edit form
      setEditName(data.name || '')
      setEditEmail(data.email || '')
      setEditPhone(data.phone || '')
      setEditAddress(data.address || '')
      setEditIp(data.ipAddress || '')
      
      // Load packages for dropdown
      try {
        const pkgs = await api.paket.getAll()
        const pkgsArray = Array.isArray(pkgs) ? pkgs : []
        setAvailablePackages(pkgsArray)
        if (pkgsArray.length > 0) {
          setSelectedPackageId(pkgsArray[0].id)
        }
      } catch (pkgErr) {
        console.error('Failed to load packages:', pkgErr)
        setAvailablePackages([])
      }
      
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pelanggan')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchCustomerData()
    }
  }, [id, fetchCustomerData])

  const handleToggleSuspend = async () => {
    if (!customer) return
    const isSuspended = customer.status === 'suspended'
    const actionText = isSuspended ? 'mengaktifkan kembali' : 'men-suspend'
    if (!confirm(`Yakin ingin ${actionText} pelanggan ${customer.name}?`)) return
    
    try {
      setActionLoading('suspend')
      if (isSuspended) {
        await api.keuangan.unsuspendCustomer(customer.id)
      } else {
        await api.keuangan.suspendCustomer(customer.id, 'Suspended by admin action')
      }
      await fetchCustomerData()
      alert(`Pelanggan berhasil di-${isSuspended ? 'aktifkan' : 'suspend'}`)
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status pelanggan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!customer) return
    if (!confirm('YAKIN INGIN MENGHAPUS PELANGGAN INI? Semua data invoice & layanan akan hilang.')) return
    try {
      setActionLoading('delete')
      await api.pelanggan.delete(customer.id)
      alert('Pelanggan berhasil dihapus')
      router.push('/pelanggan')
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus pelanggan')
      setActionLoading(null)
    }
  }

  const handleSaveChanges = async () => {
    if (!customer) return
    try {
      setActionLoading('save')
      const updated = await api.pelanggan.update(customer.id, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
        ipAddress: editIp
      })
      setKtp(editKtp || ktp)
      setCustomer({
        ...customer,
        ...updated
      })
      setShowEditModal(false)
      alert('Data pelanggan berhasil diupdate')
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan perubahan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer) return
    try {
      setActionLoading('add-invoice')
      // Call create invoice endpoint
      await api.keuangan.createInvoice({
        customerId: customer.id,
        amount: parseInt(invoiceAmount),
        dueDate: `${invoiceMonth}-05T00:00:00.000Z`,
        period: invoiceMonth
      })
      setShowAddInvoiceModal(false)
      await fetchCustomerData()
      alert('Invoice manual berhasil diterbitkan')
    } catch (err: any) {
      alert(err.message || 'Gagal membuat invoice')
    } finally {
      setActionLoading(null)
    }
  }

  const handleChangePackage = async () => {
    if (!customer || !selectedPackageId) return
    try {
      setActionLoading('change-package')
      // Update package relation
      await api.pelanggan.update(customer.id, {
        packageIds: [selectedPackageId]
      })
      setShowChangePackageModal(false)
      await fetchCustomerData()
      alert('Paket layanan berhasil diperbarui')
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah paket')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteContent.trim()) return
    const newNote: CustomerNote = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('id-ID', { hour12: false }),
      content: newNoteContent,
      author: 'Super Admin'
    }
    setNotes([newNote, ...notes])
    setNewNoteContent('')
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="animate-spin text-blue-500 h-10 w-10" />
            <p className="text-gray-400 text-sm">Memuat detail pelanggan...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !customer) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#080d19] p-6 flex flex-col items-center justify-center">
          <ShieldAlert className="text-red-500 h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Pelanggan Tidak Ditemukan</h2>
          <p className="text-gray-400 mb-6">{error || 'Data pelanggan tidak dapat dimuat.'}</p>
          <Link href="/pelanggan" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all">
            Kembali ke Daftar Pelanggan
          </Link>
        </div>
      </Layout>
    )
  }

  // Calculate statistics
  const activePackage = customer.packages?.[0] || null
  const packagePrice = activePackage?.price || 250000
  const packageName = activePackage?.name || 'Home 50 Mbps'
  const packageSpeed = activePackage?.speed || '50 Mbps'

  const invoices = customer.invoices || []
  const paidInvoices = invoices.filter(inv => inv.status === 'paid')
  const totalPaidAmount = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalOverdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  const isPaidThisMonth = invoices.some(inv => {
    const invDate = new Date(inv.createdAt)
    const now = new Date()
    return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear() && inv.status === 'paid'
  })

  return (
    <Layout>
      <div className="min-h-screen bg-[#080d19] text-gray-200 p-4 md:p-6 space-y-6 overflow-hidden">
        
        {/* ─── Top Breadcrumbs and Header ───────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Link href="/pelanggan" className="hover:text-blue-400 transition-colors">Customer</Link>
              <span>&gt;</span>
              <span className="text-blue-400">Detail Customer</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Link href="/pelanggan" className="p-1 hover:bg-[#131d35] rounded-lg transition text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </Link>
              Customer Detail
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

        {/* ─── Customer Header Information Box ──────────────────────────── */}
        <div className="bg-[#0b1329] border border-[#131d35] rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row justify-between gap-8 items-stretch relative overflow-hidden">
          {/* Left Panel: Profile Detail */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-[#131d35] shadow-lg relative">
                {customer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#0b1329] ${customer.status === 'active' ? 'bg-green-500' : customer.status === 'suspended' ? 'bg-orange-500' : 'bg-red-500'}`} />
              </div>
              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : customer.status === 'suspended' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {customer.status === 'active' ? 'Aktif' : customer.status === 'suspended' ? 'Suspended' : 'Nonaktif'}
              </span>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
                  <button onClick={() => {
                    setEditName(customer.name)
                    setEditEmail(customer.email || '')
                    setEditPhone(customer.phone)
                    setEditAddress(customer.address || '')
                    setEditIp(customer.ipAddress || '')
                    setEditKtp(ktp)
                    setShowEditModal(true)
                  }} className="text-gray-400 hover:text-blue-400 p-1 rounded-lg hover:bg-[#131d35] transition">
                    <Edit size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-1 flex items-center justify-center md:justify-start gap-1">
                  <Phone size={14} className="text-green-500" /> {customer.phone}
                </p>
                <p className="text-sm text-gray-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
                  <Mail size={14} className="text-blue-400" /> {customer.email || 'Tidak ada email'}
                </p>
                <p className="text-sm text-gray-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
                  <MapPin size={14} className="text-gray-500" /> {customer.address || 'Tidak ada alamat'}
                </p>
              </div>
            </div>
          </div>

          {/* Center Panel: Key Metadata Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3.5 border-t xl:border-t-0 xl:border-l border-[#131d35] pt-6 xl:pt-0 xl:pl-8 text-xs max-w-2xl flex-1 justify-center">
            {[
              { label: 'Customer ID', value: customer.internetNumber || 'CUST-2026-00125' },
              { label: 'Nomor Induk', value: ktp },
              { label: 'Tanggal Daftar', value: customer.installationDate ? new Date(customer.installationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '15 Jan 2026 10:30' },
              { label: 'Sales', value: sales },
              { label: 'Sumber', value: source },
              { label: 'Status', value: customer.status === 'active' ? 'Aktif' : customer.status === 'suspended' ? 'Suspended' : 'Nonaktif', colorClass: customer.status === 'active' ? 'text-green-400' : 'text-orange-400' },
              { label: 'Tipe', value: type },
              { label: 'Kategori', value: category },
              { label: 'Catatan', value: noteText }
            ].map(meta => (
              <div key={meta.label}>
                <span className="text-gray-500 font-medium">{meta.label}</span>
                <p className={`font-bold mt-0.5 ${meta.colorClass || 'text-white'}`}>{meta.value}</p>
              </div>
            ))}
          </div>

          {/* Right Panel: Actions & QR Code */}
          <div className="flex flex-col sm:flex-row xl:flex-col justify-between items-center xl:items-end gap-6 border-t xl:border-t-0 xl:border-l border-[#131d35] pt-6 xl:pt-0 xl:pl-8">
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button onClick={() => {
                setEditName(customer.name)
                setEditEmail(customer.email || '')
                setEditPhone(customer.phone)
                setEditAddress(customer.address || '')
                setEditIp(customer.ipAddress || '')
                setEditKtp(ktp)
                setShowEditModal(true)
              }} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => setShowAddInvoiceModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition">
                <Plus size={14} /> Tambah Invoice
              </button>
              <button onClick={handleToggleSuspend} disabled={actionLoading === 'suspend'} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition">
                <Ban size={14} /> {customer.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
              </button>
              <button onClick={handleDeleteCustomer} disabled={actionLoading === 'delete'} className="flex items-center gap-1.5 px-3 py-2 bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition">
                <Trash2 size={14} /> Hapus
              </button>
            </div>

            <div className="flex flex-col items-center bg-[#131d35]/30 p-3 rounded-2xl border border-[#131d35] text-center w-36">
              <span className="text-[10px] text-gray-500 font-bold mb-1.5">Customer QR Code</span>
              <QrCode size={64} className="text-white" />
              <button className="text-[10px] text-blue-400 font-bold hover:underline mt-2 flex items-center gap-1">
                <Download size={10} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* ─── Metric Cards Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Paket Aktif',
              value: packageName,
              desc: `Rp ${(packagePrice/1000).toFixed(0)}k / bulan`,
              icon: Package,
              iconColor: 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
            },
            {
              title: 'Tagihan Bulan Ini',
              value: `Rp ${(packagePrice/1000).toFixed(0)}.000`,
              desc: 'Jatuh tempo 05 Juli 2026',
              icon: FileText,
              iconColor: 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
            },
            {
              title: 'Status Pembayaran',
              value: isPaidThisMonth ? 'Lunas' : 'Belum Lunas',
              desc: isPaidThisMonth ? 'Terakhir bayar 01 Jul 2026' : 'Menunggu pembayaran',
              icon: CheckCircle,
              iconColor: isPaidThisMonth 
                ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
                : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
            },
            {
              title: 'Total Pembayaran',
              value: `Rp ${(totalPaidAmount/1000).toFixed(0) || '2.750'}.000`,
              desc: `${paidInvoices.length}x pembayaran`,
              icon: CreditCard,
              iconColor: 'text-green-400 bg-green-500/10 border border-green-500/20'
            },
            {
              title: 'Total Tunggakan',
              value: `Rp ${(totalOverdueAmount/1000).toFixed(0)}.000`,
              desc: totalOverdueAmount > 0 ? 'Ada tagihan tertunggak' : 'Tidak ada tunggakan',
              icon: Ban,
              iconColor: totalOverdueAmount > 0 
                ? 'text-red-400 bg-red-500/10 border border-red-500/20' 
                : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
            }
          ].map((card, i) => (
            <div key={i} className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{card.title}</span>
                <p className="text-lg font-black text-white mt-1">{card.value}</p>
                <span className="text-[10px] text-gray-400 block mt-1">{card.desc}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconColor}`}>
                <card.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* ─── Navigation Tabs Row ──────────────────────────────────────── */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#131d35] pb-px scrollbar-none">
          {[
            'Informasi',
            'Paket & Layanan',
            'Invoice',
            'Pembayaran',
            'Riwayat',
            'Ticket',
            'Dokumen',
            'Log Aktivitas',
            'Perangkat',
            'Catatan'
          ].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ─── Active Tab Content ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {activeTab === 'Informasi' && (
            <>
              {/* Card 1: Informasi Pribadi */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 xl:col-span-1 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#131d35]">
                  <User size={16} className="text-blue-400" />
                  Informasi Pribadi
                </h3>
                <div className="space-y-3.5 text-xs">
                  {[
                    { label: 'Nama Lengkap', value: customer.name },
                    { label: 'No. KTP', value: ktp },
                    { label: 'No. Telepon', value: customer.phone, phoneIcon: true },
                    { label: 'Email', value: customer.email || '-' },
                    { label: 'Alamat', value: customer.address || '-' },
                    { label: 'Tanggal Lahir', value: '15 Jan 1987' },
                    { label: 'Jenis Kelamin', value: 'Laki-laki' },
                    { label: 'Pekerjaan', value: 'Karyawan Swasta' },
                    { label: 'Catatan', value: noteText }
                  ].map((field, index) => (
                    <div key={index} className="space-y-1">
                      <span className="text-gray-500 font-semibold">{field.label}</span>
                      <p className="font-bold text-white flex items-center gap-1">
                        {field.value}
                        {field.phoneIcon && <span className="inline-block w-3.5 h-3.5 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-[8px] font-black">WA</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Informasi Layanan */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 xl:col-span-1 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#131d35]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server size={16} className="text-blue-400" />
                    Informasi Layanan
                  </h3>
                  <button onClick={() => setShowChangePackageModal(true)} className="text-[10px] text-blue-400 hover:underline font-bold">Ubah Paket</button>
                </div>
                <div className="space-y-3.5 text-xs">
                  {[
                    { label: 'Paket Aktif', value: packageName },
                    { label: 'Bandwidth', value: packageSpeed },
                    { label: 'IP Address', value: customer.ipAddress || '10.10.10.25' },
                    { label: 'MAC Address', value: 'AA:BB:CC:DD:EE:FF' },
                    { label: 'Jenis Koneksi', value: 'PPPoE' },
                    { label: 'Username', value: customer.email?.split('@')[0] || 'andi.setiawan' },
                    { label: 'Tanggal Mulai', value: customer.installationDate ? new Date(customer.installationDate).toLocaleDateString('id-ID') : '15 Jan 2026' },
                    { label: 'Tanggal Berakhir', value: '-' },
                    { label: 'Status', value: customer.status === 'active' ? 'Aktif' : customer.status === 'suspended' ? 'Suspended' : 'Nonaktif', colorClass: customer.status === 'active' ? 'text-green-400' : 'text-orange-400' },
                    { label: 'Lokasi Instalasi', value: 'Rumah' },
                    { label: 'Catatan Layanan', value: '-' }
                  ].map((field, index) => (
                    <div key={index} className="space-y-1">
                      <span className="text-gray-500 font-semibold">{field.label}</span>
                      <p className={`font-bold ${field.colorClass || 'text-white'}`}>{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Kontak Darurat */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 xl:col-span-1 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#131d35]">
                  <Phone size={16} className="text-blue-400" />
                  Kontak Darurat
                </h3>
                <div className="space-y-3.5 text-xs">
                  {[
                    { label: 'Nama', value: emergencyContact.name },
                    { label: 'Hubungan', value: emergencyContact.relation },
                    { label: 'No. Telepon', value: emergencyContact.phone },
                    { label: 'Alamat', value: emergencyContact.address }
                  ].map((field, index) => (
                    <div key={index} className="space-y-1">
                      <span className="text-gray-500 font-semibold">{field.label}</span>
                      <p className="font-bold text-white">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Riwayat Status */}
              <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 xl:col-span-1 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#131d35]">
                  <Activity size={16} className="text-blue-400" />
                  Riwayat Status
                </h3>
                
                <div className="relative border-l border-[#131d35] ml-2 pl-4 space-y-5 text-xs py-1">
                  {[
                    { time: '15 Jan 2026 10:30', title: 'Aktif', desc: 'Akun diaktifkan', dotClass: 'bg-green-500' },
                    { time: '01 Apr 2026 09:15', title: 'Ubah Paket', desc: 'Paket diubah dari Home 20 Mbps menjadi Home 50 Mbps', dotClass: 'bg-blue-500' },
                    { time: '05 Jun 2026 08:20', title: 'Reminder', desc: 'Pengingat pembayaran dikirim', dotClass: 'bg-amber-500' },
                    { time: '01 Jul 2026 08:15', title: 'Tunggakan Clear', desc: 'Pembayaran diterima', dotClass: 'bg-red-500' }
                  ].map((hist, idx) => (
                    <div key={idx} className="relative">
                      <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${hist.dotClass} border-2 border-[#0b1329]`} />
                      <span className="text-[10px] text-gray-500 font-bold block">{hist.time}</span>
                      <span className="text-white font-bold block mt-0.5">{hist.title}</span>
                      <span className="text-gray-400 block mt-0.5">{hist.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'Informasi' && (
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-12 xl:col-span-4 text-center">
              <Activity size={48} className="mx-auto text-gray-600 mb-3" />
              <h4 className="text-lg font-bold text-white">Tab {activeTab}</h4>
              <p className="text-xs text-gray-400 mt-1">Data dan detail historis untuk sub-layanan ini.</p>
            </div>
          )}
        </div>

        {/* ─── Bottom Section Grid (Invoice, Payments, Notes) ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Invoice Terakhir */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white">Invoice Terakhir</h4>
              <button onClick={() => setActiveTab('Invoice')} className="text-[10px] text-blue-400 font-bold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#131d35] text-gray-500">
                    <th className="pb-2">INVOICE #</th>
                    <th className="pb-2">PERIODE</th>
                    <th className="pb-2">NOMINAL</th>
                    <th className="pb-2">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map(inv => (
                    <tr key={inv.id} className="border-b border-[#131d35]/30 last:border-b-0 hover:bg-[#131d35]/20">
                      <td className="py-2.5 font-bold text-blue-400">{inv.invoiceNumber}</td>
                      <td className="py-2.5 text-gray-400">{inv.month || 'Jul 2026'}</td>
                      <td className="py-2.5 font-bold text-white">Rp {inv.amount.toLocaleString('id-ID')}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {inv.status === 'paid' ? 'Lunas' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">Belum ada invoice</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Pembayaran Terakhir */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white">Pembayaran Terakhir</h4>
              <button onClick={() => setActiveTab('Pembayaran')} className="text-[10px] text-blue-400 font-bold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#131d35] text-gray-500">
                    <th className="pb-2">TANGGAL</th>
                    <th className="pb-2">METODE</th>
                    <th className="pb-2">NOMINAL</th>
                    <th className="pb-2">BUKTI</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.filter(inv => inv.status === 'paid').slice(0, 5).map(inv => (
                    <tr key={inv.id} className="border-b border-[#131d35]/30 last:border-b-0 hover:bg-[#131d35]/20">
                      <td className="py-2.5 text-gray-400">{new Date(inv.paidAt || inv.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="py-2.5 font-bold text-white uppercase">{inv.paymentMethod || 'QRIS'}</td>
                      <td className="py-2.5 font-bold text-green-400">Rp {inv.amount.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-blue-400 cursor-pointer hover:underline"><Eye size={12} /></td>
                    </tr>
                  ))}
                  {invoices.filter(inv => inv.status === 'paid').length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">Belum ada pembayaran lunas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 3: Catatan */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white">Catatan</h4>
              <button onClick={() => {
                const note = prompt('Tambah Catatan Baru:')
                if (note) {
                  setNotes([{
                    id: Date.now().toString(),
                    date: new Date().toLocaleString('id-ID'),
                    content: note,
                    author: 'Super Admin'
                  }, ...notes])
                }
              }} className="flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline">
                <Plus size={10} /> Tambah Catatan
              </button>
            </div>
            
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {notes.map(note => (
                <div key={note.id} className="bg-[#131d35]/30 border border-[#131d35] rounded-xl p-3 space-y-1">
                  <span className="text-[9px] text-gray-500 font-bold">{note.date}</span>
                  <p className="text-[11px] text-gray-200 font-semibold">{note.content}</p>
                  <span className="text-[9px] text-blue-400 font-medium">oleh {note.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ─── MODAL: Edit Customer Details ─────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#131d35] flex justify-between items-center bg-[#131d35]/20">
              <h3 className="text-base font-bold text-white">Edit Customer Detail</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold block">Nama Lengkap</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold block">Email</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold block">No. Telepon</label>
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold block">Alamat</label>
                <textarea value={editAddress} onChange={e => setEditAddress(e.target.value)} rows={3} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">No. KTP</label>
                  <input value={editKtp} onChange={e => setEditKtp(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">IP Address</label>
                  <input value={editIp} onChange={e => setEditIp(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#131d35] flex justify-end gap-3 bg-[#131d35]/10">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition">Batal</button>
              <button onClick={handleSaveChanges} disabled={actionLoading === 'save'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add Invoice Manual ───────────────────────────────── */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <form onSubmit={handleCreateInvoice}>
              <div className="p-6 border-b border-[#131d35] flex justify-between items-center bg-[#131d35]/20">
                <h3 className="text-base font-bold text-white">Tambah Invoice Baru</h3>
                <button type="button" onClick={() => setShowAddInvoiceModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Nominal Tagihan (Rp)</label>
                  <input type="number" required value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold block">Periode Bulan</label>
                  <input type="month" required value={invoiceMonth} onChange={e => setInvoiceMonth(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="p-6 border-t border-[#131d35] flex justify-end gap-3 bg-[#131d35]/10">
                <button type="button" onClick={() => setShowAddInvoiceModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition">Batal</button>
                <button type="submit" disabled={actionLoading === 'add-invoice'} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition">Terbitkan Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Change Active Package ────────────────────────────── */}
      {showChangePackageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-[#131d35] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#131d35] flex justify-between items-center bg-[#131d35]/20">
              <h3 className="text-base font-bold text-white">Ubah Paket Layanan</h3>
              <button onClick={() => setShowChangePackageModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold block">Pilih Paket</label>
                <select value={selectedPackageId} onChange={e => setSelectedPackageId(e.target.value)} className="w-full bg-[#131d35] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
                  {Array.isArray(availablePackages) && availablePackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.speed}) - Rp {pkg.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[#131d35] flex justify-end gap-3 bg-[#131d35]/10">
              <button onClick={() => setShowChangePackageModal(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition">Batal</button>
              <button onClick={handleChangePackage} disabled={actionLoading === 'change-package'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Ubah Paket</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
