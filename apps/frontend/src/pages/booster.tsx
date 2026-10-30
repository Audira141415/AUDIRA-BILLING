import Link from 'next/link';
import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Zap, 
  Rocket, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  Plus, 
  Search, 
  X, 
  Gauge, 
  ChevronRight,
  AlertCircle,
  UserCheck
} from 'lucide-react'
import api from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface BoosterPackage {
  id: string
  name: string
  speed: string
  duration: number
  price: number
  description?: string
  isActive: boolean
}

interface CustomerBooster {
  id: string
  customerId: string
  originalSpeed: string
  startedAt: string
  expiresAt: string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  customer?: {
    id: string
    name: string
    internetNumber?: string
    phone?: string
  }
  package?: BoosterPackage
}

interface Stats {
  totalCount: number
  activeCount: number
  totalRevenue: number
}

export default function BoosterPage() {
  const [packages, setPackages] = useState<BoosterPackage[]>([])
  const [history, setHistory] = useState<CustomerBooster[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [stats, setStats] = useState<Stats>({ totalCount: 0, activeCount: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)

  // Activation modal
  const [showModal, setShowModal] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState<BoosterPackage | null>(null)
  const [targetCustomer, setTargetCustomer] = useState('')
  const [isActivating, setIsActivating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [pkgRes, histRes, statsRes, custData] = await Promise.all([
        fetch(`${API_BASE}/booster/packages`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/booster/history`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/booster/stats`).then(r => r.json()).catch(() => ({ totalCount: 0, activeCount: 0, totalRevenue: 0 })),
        api.pelanggan.getAll().catch(() => [])
      ])

      setPackages(Array.isArray(pkgRes) ? pkgRes : [])
      setHistory(Array.isArray(histRes) ? histRes : [])
      setStats(statsRes || { totalCount: 0, activeCount: 0, totalRevenue: 0 })
      const custList = Array.isArray(custData) ? custData : []
      setCustomers(custList)
      if (custList.length > 0 && !targetCustomer) {
        setTargetCustomer(custList[0].id)
      }
    } catch (err) {
      console.error('Error loading booster data:', err)
      showToast('Gagal memuat data booster', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPkg || !targetCustomer) return

    try {
      setIsActivating(true)
      const res = await fetch(`${API_BASE}/booster/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: targetCustomer,
          packageId: selectedPkg.id,
        }),
      })

      if (res.ok) {
        showToast(`Turbo Speed ${selectedPkg.speed} berhasil diaktifkan ke pelanggan!`, 'success')
        setShowModal(false)
        await loadData()
      } else {
        const err = await res.json()
        showToast(err.message || 'Gagal mengaktifkan booster', 'error')
      }
    } catch (err: any) {
      showToast(`Kesalahan jaringan: ${err.message}`, 'error')
    } finally {
      setIsActivating(false)
    }
  }

  const formatExpires = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffHours = (d.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (diffHours <= 0) return 'Habis'
    return `Sisa ${Math.ceil(diffHours)} Jam`
  }

  const filteredHistory = history.filter(h => 
    (h.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.customer?.internetNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.package?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
            toast.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Monetisasi Layanan</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Turbo Speed on Demand</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Zap className="text-theme-primary" size={26} />
              Bandwidth Booster (Speed On-Demand)
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              disabled={loading}
              className="p-2 bg-theme-card hover:bg-[var(--app-border)]/30 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Booster Aktif Sekarang</p>
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">{stats.activeCount}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Sesi PPPoE berkecepatan turbo</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Zap size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Booster Terjual</p>
              <p className="text-2xl font-black font-mono text-theme-text mt-1">{stats.totalCount}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Akumulasi aktivasi pelanggan</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Rocket size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Estimasi Omset Add-On</p>
              <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {stats.totalRevenue.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-theme-muted mt-0.5">Pendapatan tambahan di luar paket bulanan</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        {/* KATALOG PAKET BOOSTER */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider">Katalog Paket Turbo Bandwidth (Add-On Instan)</h3>
            <span className="text-[11px] font-mono text-theme-muted">{packages.length} Paket Tersedia</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className="bg-theme-bg border border-theme-border hover:border-blue-500 rounded-xl p-4 flex flex-col justify-between transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <Gauge size={12} />
                      {pkg.speed}
                    </span>
                    <span className="text-[11px] font-mono text-theme-muted flex items-center gap-1">
                      <Clock size={12} />
                      {pkg.duration} Jam
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-theme-text">{pkg.name}</h4>
                  <p className="text-[11px] text-theme-muted line-clamp-2 mt-1">
                    {pkg.description || 'Peningkatan kecepatan internet instan tanpa restart modem.'}
                  </p>

                  <div className="text-lg font-bold font-mono text-theme-text mt-3">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPkg(pkg)
                    setShowModal(true)
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Zap size={14} />
                  <span>Aktifkan ke Pelanggan</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TABEL RIWAYAT BOOSTER PELANGGAN */}
        <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm space-y-0">
          <div className="p-4 border-b border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-theme-text">Riwayat & Sesi Booster Aktif</h3>
              <p className="text-xs text-theme-muted mt-0.5">Daftar pelanggan yang sedang menikmati peningkatan bandwidth</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-theme-muted" />
              <input
                type="text"
                placeholder="Cari pelanggan / paket..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--app-bg)] dark:bg-slate-900/50 border-b border-theme-border text-theme-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">Paket Turbo</th>
                  <th className="p-3.5">Mulai Aktivasi</th>
                  <th className="p-3.5">Batas Kadaluarsa</th>
                  <th className="p-3.5">Status Sesi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-theme-muted">
                      Belum ada riwayat aktivasi booster yang tercatat.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(item => (
                    <tr key={item.id} className="hover:bg-[var(--app-bg)]/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="font-bold text-theme-text">{item.customer?.name || 'Pelanggan'}</div>
                        <div className="text-[11px] text-theme-muted font-mono">{item.customer?.internetNumber || item.customerId}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{item.package?.speed || '+20 Mbps'}</span>
                        <div className="text-[11px] text-theme-muted">{item.package?.name}</div>
                      </td>

                      <td className="p-3.5 font-mono text-theme-muted text-[11px]">
                        {new Date(item.startedAt).toLocaleString('id-ID')}
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="text-theme-text font-medium">{new Date(item.expiresAt).toLocaleString('id-ID')}</div>
                        <div className="text-amber-600 dark:text-amber-400 font-bold">{formatExpires(item.expiresAt)}</div>
                      </td>

                      <td className="p-3.5">
                        {item.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Turbo Running
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-[var(--app-muted)] border border-slate-500/20">
                            Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Aktivasi Booster ke Pelanggan */}
        {showModal && selectedPkg && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-[var(--app-bg)]/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
                  <Zap size={16} className="text-blue-500" /> Aktivasi Turbo Booster Instan
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-theme-muted hover:text-theme-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]" aria-label="Tutup modal">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleActivate} className="p-5 space-y-4 text-xs">
                <div className="bg-theme-bg border border-theme-border rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Paket Dipilih:</span>
                    <span className="font-bold text-theme-text">{selectedPkg.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Tambahan Speed:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedPkg.speed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Masa Aktif:</span>
                    <span className="font-mono text-theme-text">{selectedPkg.duration} Jam</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-theme-border/50 pt-2">
                    <span className="text-theme-muted font-bold">Biaya Add-On:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">Rp {selectedPkg.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-theme-muted font-bold block">Pilih Pelanggan Target *</label>
                  <select
                    value={targetCustomer}
                    onChange={e => setTargetCustomer(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.internetNumber || c.phone || c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl font-semibold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isActivating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    {isActivating ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    <span>{isActivating ? 'Mengaktifkan...' : 'Aktifkan Sekarang'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
