import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Server, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Zap, 
  X, 
  Search, 
  ShieldCheck, 
  Signal, 
  Check, 
  ChevronRight,
  Radio,
  Layers,
  Activity
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface OltDevice {
  id: string
  name: string
  brand: string
  ipAddress: string
  ponCount: number
  status: string
  description?: string
  _count?: {
    onus: number
  }
}

interface OltOnu {
  id: string
  oltId: string
  ponPort: string
  onuIndex?: number | null
  serialNumber: string
  status: 'UNREGISTERED' | 'REGISTERED' | 'DEPROVISIONED'
  vlanId?: number | null
  customerId?: string | null
  customerName?: string | null
  rxPower?: number | null
  registeredAt?: string | null
  createdAt: string
  olt?: {
    id: string
    name: string
    brand: string
    ipAddress?: string
  }
}

interface Stats {
  totalOlts: number
  registeredOnus: number
  unregisteredOnus: number
}

export default function OltManagementPage() {
  const [olts, setOlts] = useState<OltDevice[]>([])
  const [unregistered, setUnregistered] = useState<OltOnu[]>([])
  const [registered, setRegistered] = useState<OltOnu[]>([])
  const [stats, setStats] = useState<Stats>({ totalOlts: 0, registeredOnus: 0, unregisteredOnus: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'unregistered' | 'registered' | 'olts'>('unregistered')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Modal State
  const [selectedOnu, setSelectedOnu] = useState<OltOnu | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [vlanId, setVlanId] = useState(100)
  const [isProvisioning, setIsProvisioning] = useState(false)
  const [provisionSuccess, setProvisionSuccess] = useState<any | null>(null)

  // Script Viewer Modal
  const [viewScript, setViewScript] = useState<string | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsRes, unregRes, regRes, oltRes] = await Promise.all([
        fetch(`${API_BASE}/olt/stats`).then(r => r.json()).catch(() => ({ totalOlts: 0, registeredOnus: 0, unregisteredOnus: 0 })),
        fetch(`${API_BASE}/olt/onus/unregistered`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/olt/onus/registered`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/olt`).then(r => r.json()).catch(() => []),
      ])

      setStats(statsRes)
      setUnregistered(Array.isArray(unregRes) ? unregRes : [])
      setRegistered(Array.isArray(regRes) ? regRes : [])
      setOlts(Array.isArray(oltRes) ? oltRes : [])
    } catch (err) {
      console.error('Error fetching OLT data:', err)
      showNotification('Gagal memuat telemetri OLT FTTH', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenProvision = (onu: OltOnu) => {
    setSelectedOnu(onu)
    setCustomerName('')
    setCustomerId('')
    setVlanId(100 + (onu.onuIndex || 1))
    setProvisionSuccess(null)
    setShowModal(true)
  }

  const handleExecuteProvision = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOnu) return

    try {
      setIsProvisioning(true)
      const res = await fetch(`${API_BASE}/olt/onus/${selectedOnu.id}/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerName,
          vlanId: Number(vlanId),
        }),
      })

      if (res.ok) {
        const result = await res.json()
        setProvisionSuccess(result)
        showNotification(`ONU ${selectedOnu.serialNumber} berhasil di-binding ke OLT!`, 'success')
        await loadData()
      } else {
        const err = await res.json()
        showNotification(err.message || 'Gagal melakukan provisioning OLT', 'error')
      }
    } catch (err: any) {
      showNotification(`Terjadi kesalahan: ${err.message}`, 'error')
    } finally {
      setIsProvisioning(false)
    }
  }

  const filteredUnregistered = unregistered.filter(o => 
    o.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.ponPort.toLowerCase().includes(search.toLowerCase()) ||
    (o.olt?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredRegistered = registered.filter(o => 
    o.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
    o.ponPort.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">

        {/* Toast */}
        {notification && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Infrastruktur FTTH</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Chassis OLT & ONU</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Server className="text-theme-primary" size={26} />
              Manajemen OLT & Zero-Touch ONU Provisioning
            </h1>
            <p className="text-xs text-theme-muted">
              Auto-discovery modem baru di port PON (ZTE, Huawei, VSOL, HIOSO) dengan monitoring redaman optik real-time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              disabled={loading}
              className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
          </div>
        </div>

        {/* Banner Alert if Unregistered ONUs exist */}
        {unregistered.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-200">
                  Terdeteksi {unregistered.length} Modem Baru Belum Terdaftar di Port PON
                </p>
                <p className="text-theme-muted text-[11px] mt-0.5">
                  Modem siap diikat ke profil pelanggan dengan 1-klik zero-touch provisioning.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('unregistered')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
            >
              <Zap size={14} />
              <span>Lihat Antrean</span>
            </button>
          </div>
        )}

        {/* 3 KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">OLT Hardware Chassis</p>
              <p className="text-2xl font-black font-mono text-theme-text mt-1">{stats.totalOlts}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">ZTE C320, Huawei & VSOL Online</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Server size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Modem Terdaftar (Aktif)</p>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">{stats.registeredOnus}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Service port status UP</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Menunggu Provisioning</p>
              <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">{stats.unregisteredOnus}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Unconfigured SN di port PON</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Cpu size={18} />
            </div>
          </div>
        </div>

        {/* Tab Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('unregistered')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'unregistered'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 text-theme-muted hover:text-theme-text border border-theme-border'
              }`}
            >
              Modem Ditemukan ({unregistered.length})
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'registered'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 text-theme-muted hover:text-theme-text border border-theme-border'
              }`}
            >
              Modem Aktif ({registered.length})
            </button>
            <button
              onClick={() => setActiveTab('olts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'olts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 text-theme-muted hover:text-theme-text border border-theme-border'
              }`}
            >
              Daftar OLT Chassis ({olts.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari SN, Port, atau Nama..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Tab 1: Unregistered ONUs */}
        {activeTab === 'unregistered' && (
          <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-theme-border">
              <h3 className="text-xs font-bold text-theme-text uppercase tracking-wider">Antrean Modem Baru (Zero-Touch Ready)</h3>
              <p className="text-[11px] text-theme-muted mt-0.5">Modem GPON/EPON terdeteksi di splitter ODP dengan sinyal optik terverifikasi.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme-border">
                    <th className="p-3.5">Serial Number</th>
                    <th className="p-3.5">OLT Target</th>
                    <th className="p-3.5">Port PON</th>
                    <th className="p-3.5">Redaman (Rx Power)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border">
                  {filteredUnregistered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-theme-muted">
                        Tidak ada modem baru yang belum terdaftar di antrean PON.
                      </td>
                    </tr>
                  ) : (
                    filteredUnregistered.map(onu => (
                      <tr key={onu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {onu.serialNumber}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-theme-text">{onu.olt?.name}</span>
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-theme-bg border border-theme-border text-theme-muted rounded">
                            {onu.olt?.brand}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                          {onu.ponPort}
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            (onu.rxPower || 0) > -24 && (onu.rxPower || 0) < -15 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            <Signal size={13} />
                            {onu.rxPower ? `${onu.rxPower} dBm` : '-'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            UNREGISTERED
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenProvision(onu)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                          >
                            <Zap size={13} />
                            <span>Provisioning</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Registered ONUs */}
        {activeTab === 'registered' && (
          <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-theme-border">
              <h3 className="text-xs font-bold text-theme-text uppercase tracking-wider">Daftar Modem Teraktivasi di Jaringan</h3>
              <p className="text-[11px] text-theme-muted mt-0.5">Modem yang sedang aktif melayani koneksi internet pelanggan.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme-border">
                    <th className="p-3.5">Pelanggan</th>
                    <th className="p-3.5">Serial Number</th>
                    <th className="p-3.5">OLT & Port</th>
                    <th className="p-3.5">VLAN</th>
                    <th className="p-3.5">Redaman (Rx Power)</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border">
                  {filteredRegistered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-theme-muted">
                        Belum ada data modem terdaftar.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistered.map(onu => (
                      <tr key={onu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="font-bold text-theme-text">{onu.customerName || 'Pelanggan'}</div>
                          <div className="text-[11px] text-theme-muted font-mono">{onu.customerId || '-'}</div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-theme-text">{onu.serialNumber}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-theme-text">{onu.olt?.name}</div>
                          <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">{onu.ponPort}</div>
                        </td>
                        <td className="p-3.5 font-mono text-theme-muted">{onu.vlanId || 100}</td>
                        <td className="p-3.5 font-mono">
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            (onu.rxPower || 0) > -24 && (onu.rxPower || 0) < -15 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            <Signal size={13} />
                            {onu.rxPower ? `${onu.rxPower} dBm` : '-'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            ONLINE / ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: OLT Chassis List */}
        {activeTab === 'olts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {olts.map(olt => (
              <div key={olt.id} className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-theme-text">{olt.name}</h4>
                    <p className="text-xs text-theme-muted font-mono mt-0.5">{olt.ipAddress} • {olt.brand}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {olt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-theme-border/50">
                  <div>
                    <span className="text-theme-muted">Kapasitas PON:</span>
                    <p className="font-bold text-theme-text font-mono mt-0.5">{olt.ponCount} Port GPON</p>
                  </div>
                  <div>
                    <span className="text-theme-muted">Total ONU Terhubung:</span>
                    <p className="font-bold text-theme-text font-mono mt-0.5">{olt._count?.onus || 0} Unit</p>
                  </div>
                </div>

                <div className="text-[11px] text-theme-muted">
                  {olt.description || 'Chassis OLT FTTH Distribusi Wilayah'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: 1-Click Provisioning */}
        {showModal && selectedOnu && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-xs">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-theme-text">Zero-Touch Provisioning ONU</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-theme-muted hover:text-theme-text">✕</button>
              </div>

              {provisionSuccess ? (
                <div className="p-5 space-y-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                    <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
                    <h4 className="text-emerald-800 dark:text-emerald-200 font-bold text-sm">Aktivasi Modem Berhasil</h4>
                    <p className="text-theme-muted text-xs mt-1">{provisionSuccess.message}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-theme-text mb-1.5 flex items-center gap-1">
                      <Terminal size={14} className="text-blue-500" /> CLI Script Yang Dieksekusi ke OLT:
                    </p>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      {provisionSuccess.generatedScript}
                    </pre>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExecuteProvision} className="p-5 space-y-4">
                  <div className="bg-theme-bg p-3.5 rounded-xl border border-theme-border space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-theme-muted">Serial Number (SN):</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{selectedOnu.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-muted">OLT Target:</span>
                      <span className="font-semibold text-theme-text">{selectedOnu.olt?.name} ({selectedOnu.olt?.brand})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-muted">Port PON:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{selectedOnu.ponPort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-muted">Redaman Optik:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">{selectedOnu.rxPower} dBm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-theme-muted font-bold block">Nama Pelanggan *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Nama pelanggan sesuai SPK"
                      className="w-full px-3.5 py-2 bg-theme-bg border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-theme-muted font-bold block">ID Pelanggan (Internet Number)</label>
                      <input
                        type="text"
                        value={customerId}
                        onChange={e => setCustomerId(e.target.value)}
                        placeholder="INT001"
                        className="w-full px-3.5 py-2 bg-theme-bg border border-theme-border rounded-xl text-theme-text font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-theme-muted font-bold block">Service VLAN ID *</label>
                      <input
                        type="number"
                        required
                        value={vlanId}
                        onChange={e => setVlanId(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-theme-bg border border-theme-border rounded-xl text-theme-text font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-theme-border">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl font-semibold transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isProvisioning}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      {isProvisioning ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                      <span>{isProvisioning ? 'Memproses...' : 'Binding ke OLT'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
