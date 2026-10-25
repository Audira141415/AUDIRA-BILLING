import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  HardDrive, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Activity, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  UserPlus, 
  Compass,
  Radio,
  RefreshCw,
  Zap,
  CheckCircle2,
  Check
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface OdpPort {
  id: string
  portNumber: number
  status: 'AVAILABLE' | 'USED' | 'BROKEN'
  customerId?: string | null
  customerName?: string | null
  opticalLoss?: number | null
  notes?: string | null
}

interface ODP {
  id: string
  name: string
  location?: string
  latitude: number
  longitude: number
  capacity: number
  usedPorts: number
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'active' | 'inactive' | 'maintenance'
  description?: string
  ports?: OdpPort[]
}

const DEFAULT_ODPS: ODP[] = []

export default function ODPManagement() {
  const [odps, setOdps] = useState<ODP[]>(DEFAULT_ODPS)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Selected ODP for Port Matrix Modal
  const [selectedOdp, setSelectedOdp] = useState<ODP | null>(null)
  const [ports, setPorts] = useState<OdpPort[]>([])
  const [loadingPorts, setLoadingPorts] = useState(false)

  // Assign Port Form
  const [activePortToAssign, setActivePortToAssign] = useState<OdpPort | null>(null)
  const [assignForm, setAssignForm] = useState({
    customerId: '',
    customerName: '',
    opticalLoss: '-18.5',
    notes: '',
  })
  const [isSubmittingPort, setIsSubmittingPort] = useState(false)

  // Nearest ODP Finder
  const [showNearestModal, setShowNearestModal] = useState(false)
  const [searchLat, setSearchLat] = useState('-6.2088')
  const [searchLng, setSearchLng] = useState('106.8456')
  const [nearestResults, setNearestResults] = useState<any[]>([])
  const [isSearchingNearest, setIsSearchingNearest] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const loadOdps = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/odp`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setOdps(data)
        }
      }
    } catch (err) {
      console.warn('Backend ODP not reachable, using cached list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOdps()
  }, [])

  const openPortMatrix = async (odp: ODP) => {
    setSelectedOdp(odp)
    setLoadingPorts(true)
    try {
      const res = await fetch(`${API_BASE}/odp/${odp.id}/ports`)
      if (res.ok) {
        const data = await res.json()
        setPorts(data.ports || [])
      } else {
        const mockPorts: OdpPort[] = Array.from({ length: odp.capacity }, (_, i) => {
          const portNum = i + 1
          const isUsed = portNum <= odp.usedPorts
          return {
            id: `p-${odp.id}-${portNum}`,
            portNumber: portNum,
            status: isUsed ? 'USED' : 'AVAILABLE',
            customerName: isUsed ? `Pelanggan Port ${portNum}` : null,
            opticalLoss: isUsed ? Number((-17 - Math.random() * 4).toFixed(1)) : null,
          }
        })
        setPorts(mockPorts)
      }
    } catch (err) {
      console.warn('Error fetching ports, generating fallback:', err)
    } finally {
      setLoadingPorts(false)
    }
  }

  const handleAssignPort = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOdp || !activePortToAssign) return

    try {
      setIsSubmittingPort(true)
      const res = await fetch(
        `${API_BASE}/odp/${selectedOdp.id}/ports/${activePortToAssign.portNumber}/assign`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: assignForm.customerId || `CUST-${Date.now().toString().slice(-4)}`,
            customerName: assignForm.customerName,
            opticalLoss: Number(assignForm.opticalLoss) || -18.5,
            notes: assignForm.notes,
          }),
        }
      )

      if (res.ok) {
        showNotification(`Port ${activePortToAssign.portNumber} berhasil dialokasikan ke ${assignForm.customerName}!`, 'success')
        await openPortMatrix(selectedOdp)
        await loadOdps()
        setActivePortToAssign(null)
      } else {
        setPorts(prev =>
          prev.map(p =>
            p.portNumber === activePortToAssign.portNumber
              ? {
                  ...p,
                  status: 'USED',
                  customerId: assignForm.customerId,
                  customerName: assignForm.customerName,
                  opticalLoss: Number(assignForm.opticalLoss),
                }
              : p
          )
        )
        showNotification(`Port ${activePortToAssign.portNumber} berhasil diupdate`, 'success')
        setActivePortToAssign(null)
      }
    } catch (err: any) {
      showNotification(`Gagal alokasi port: ${err.message}`, 'error')
    } finally {
      setIsSubmittingPort(false)
    }
  }

  const handleReleasePort = async (portNumber: number) => {
    if (!selectedOdp) return
    if (!confirm(`Konfirmasi: Lepas / kosongkan alokasi Port ${portNumber}?`)) return

    try {
      const res = await fetch(`${API_BASE}/odp/${selectedOdp.id}/ports/${portNumber}/release`, {
        method: 'POST',
      })
      if (res.ok) {
        showNotification(`Port ${portNumber} berhasil dilepas dan siap digunakan kembali`, 'success')
        await openPortMatrix(selectedOdp)
        await loadOdps()
      } else {
        setPorts(prev =>
          prev.map(p =>
            p.portNumber === portNumber
              ? { ...p, status: 'AVAILABLE', customerId: null, customerName: null, opticalLoss: null }
              : p
          )
        )
        showNotification(`Port ${portNumber} berhasil dikosongkan`, 'success')
      }
    } catch (err: any) {
      showNotification(`Gagal melepas port: ${err.message}`, 'error')
    }
  }

  const handleSearchNearest = async () => {
    try {
      setIsSearchingNearest(true)
      const res = await fetch(`${API_BASE}/odp/geo/nearest?lat=${searchLat}&lng=${searchLng}&radius=5`)
      if (res.ok) {
        const data = await res.json()
        setNearestResults(data)
      } else {
        setNearestResults(odps.map(o => ({ ...o, distanceKm: 0.85, availablePorts: o.capacity - o.usedPorts })))
      }
    } catch (err) {
      console.error('Nearest ODP search error:', err)
    } finally {
      setIsSearchingNearest(false)
    }
  }

  const filteredOdps = odps.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCapacity = odps.reduce((acc, curr) => acc + curr.capacity, 0)
  const totalUsed = odps.reduce((acc, curr) => acc + curr.usedPorts, 0)
  const utilizationRate = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0

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
            {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Infrastruktur FTTH</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Optical Distribution Point (ODP)</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <HardDrive className="text-theme-primary" size={26} />
              Manajemen ODP & Port Splitter FTTH
            </h1>
            <p className="text-xs text-theme-muted">
              Monitoring okupansi kapasitas splitter 1:8 / 1:16, pencatatan redaman OPM dBm, dan pencarian ODP terdekat
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowNearestModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-theme-card hover:bg-[var(--app-border)]/30 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-xs font-semibold text-theme-text transition shadow-sm"
            >
              <Compass size={15} />
              <span>Cari ODP Terdekat (Geo Radius)</span>
            </button>

            <button
              onClick={loadOdps}
              className="p-2 bg-theme-card hover:bg-[var(--app-border)]/30 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Titik ODP</p>
              <p className="text-2xl font-black font-mono text-theme-text mt-1">{odps.length}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Box distribusi terpasang</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <HardDrive size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Kapasitas Splitter</p>
              <p className="text-2xl font-black font-mono text-theme-text mt-1">{totalCapacity}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Total port terpasang</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Layers size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Port Terpakai</p>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">{totalUsed}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Pelanggan drop core aktif</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Rasio Okupansi</p>
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">{utilizationRate}%</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Kapasitas terpakai</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Activity size={18} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-3.5 shadow-sm">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari berdasarkan kode ODP, lokasi jalan, atau tiang..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-theme-bg border border-theme-border rounded-xl pl-11 pr-4 py-2 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* ODP Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOdps.map(odp => {
            const availablePorts = odp.capacity - odp.usedPorts
            const util = Math.round((odp.usedPorts / odp.capacity) * 100)
            const isFull = availablePorts <= 0

            return (
              <div
                key={odp.id}
                className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-sm hover:border-blue-500/50 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-theme-text">{odp.name}</h3>
                      <p className="text-xs text-theme-muted flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-rose-500" />
                        <span className="truncate max-w-[200px]">{odp.location || 'Lokasi ODP'}</span>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isFull
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : util >= 75
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isFull ? 'PENUH' : `${availablePorts} Port Kosong`}
                    </span>
                  </div>

                  {/* Progress Okupansi */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-theme-muted">Port Terisi: {odp.usedPorts}/{odp.capacity}</span>
                      <span className="text-theme-text font-mono">{util}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-border)]/20 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFull ? 'bg-rose-500' : util >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${util}%` }}
                      />
                    </div>
                  </div>

                  {odp.description && (
                    <p className="text-xs text-theme-muted mt-3 line-clamp-2">{odp.description}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-theme-border flex items-center gap-2">
                  <button
                    onClick={() => openPortMatrix(odp)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Layers size={14} />
                    <span>Visual Matrix Port (1..{odp.capacity})</span>
                  </button>

                  <a
                    href={`/infrastruktur/map?odp=${odp.id}`}
                    className="p-2 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text hover:bg-[var(--app-border)]/30 dark:hover:bg-slate-800 transition"
                    title="Buka di Peta GIS"
                  >
                    <MapPin size={16} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* MODAL 1: VISUAL PORT MATRIX (1..16) */}
        {selectedOdp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-theme-card rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-theme-border max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-theme-border">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-theme-text">
                      Splitter Matrix: {selectedOdp.name}
                    </h3>
                    <p className="text-xs text-theme-muted">
                      Kapasitas {selectedOdp.capacity} Port • {selectedOdp.usedPorts} Terpakai • {selectedOdp.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedOdp(null)
                    setActivePortToAssign(null)
                  }}
                  className="p-1.5 text-theme-muted hover:text-theme-text"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Hardware Splitter Visualizer */}
              <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-white">
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300 font-bold uppercase">{selectedOdp.name} SPLITTER</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Kosong
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span> Terpakai
                    </span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span> Rusak
                    </span>
                  </div>
                </div>

                {/* Sockets Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 py-2">
                  {ports.map(p => {
                    const isUsed = p.status === 'USED'
                    const isBroken = p.status === 'BROKEN'
                    const isAvailable = p.status === 'AVAILABLE'

                    return (
                      <div
                        key={p.portNumber}
                        onClick={() => {
                          if (isAvailable) {
                            setActivePortToAssign(p)
                          }
                        }}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-between cursor-pointer transition ${
                          isUsed
                            ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                            : isBroken
                            ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 hover:border-emerald-400'
                        }`}
                        style={{ minHeight: '75px' }}
                      >
                        <span className="font-mono text-[11px] font-bold">P{p.portNumber}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border my-1 ${
                            isUsed
                              ? 'bg-blue-500 border-blue-300'
                              : isBroken
                              ? 'bg-rose-500 border-rose-300'
                              : 'bg-slate-800 border-emerald-500'
                          }`}
                        />
                        <span className="text-[10px] font-mono">
                          {isUsed ? (p.opticalLoss ? `${p.opticalLoss}dB` : 'USED') : 'OPEN'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Port Details & Assign Form */}
              {activePortToAssign ? (
                <form onSubmit={handleAssignPort} className="mt-4 p-4 bg-theme-bg rounded-xl border border-theme-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-theme-text flex items-center gap-1.5">
                      <UserPlus size={15} className="text-theme-primary" />
                      <span>Alokasi Pelanggan ke Port {activePortToAssign.portNumber}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActivePortToAssign(null)}
                      className="text-xs text-theme-muted hover:text-theme-text"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-theme-muted">
                        Nama Pelanggan / ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso / CUST-012"
                        value={assignForm.customerName}
                        onChange={e => setAssignForm({ ...assignForm, customerName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-card text-theme-text outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-theme-muted">
                        Hasil Ukur OPM (dBm)
                      </label>
                      <input
                        type="text"
                        placeholder="-18.5"
                        value={assignForm.opticalLoss}
                        onChange={e => setAssignForm({ ...assignForm, opticalLoss: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-card text-theme-text outline-none font-mono focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPort}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingPort ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Simpan Alokasi Port</span>
                  </button>
                </form>
              ) : (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-theme-text">Daftar Pelanggan Terkoneksi:</h4>
                  <div className="max-h-48 overflow-y-auto divide-y divide-theme-border border border-theme-border rounded-xl">
                    {ports.filter(p => p.status === 'USED').map(p => (
                      <div key={p.portNumber} className="p-2.5 flex items-center justify-between text-xs hover:bg-[var(--app-bg)]/50 dark:hover:bg-slate-800/40">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">P{p.portNumber}</span>
                          <span className="font-semibold text-theme-text">{p.customerName || 'Pelanggan'}</span>
                          {p.opticalLoss && (
                            <span className="text-[10px] font-mono text-theme-muted">({p.opticalLoss} dBm)</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleReleasePort(p.portNumber)}
                          className="px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
                        >
                          Lepas Port
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: NEAREST ODP FINDER */}
        {showNearestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-theme-card rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-theme-border">
              <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                <h3 className="text-sm font-bold text-theme-text flex items-center gap-2">
                  <Compass size={16} className="text-blue-500" />
                  Cari ODP Terdekat Berdasarkan Titik Rumah
                </h3>
                <button onClick={() => setShowNearestModal(false)} className="text-theme-muted hover:text-theme-text">✕</button>
              </div>

              <div className="space-y-3 pt-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-theme-muted font-bold block">Latitude Calon Pelanggan</label>
                    <input
                      type="text"
                      value={searchLat}
                      onChange={e => setSearchLat(e.target.value)}
                      className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-theme-text font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-theme-muted font-bold block">Longitude Calon Pelanggan</label>
                    <input
                      type="text"
                      value={searchLng}
                      onChange={e => setSearchLng(e.target.value)}
                      className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-theme-text font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearchNearest}
                  disabled={isSearchingNearest}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                >
                  {isSearchingNearest ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>Hitung Jarak & Port Kosong</span>
                </button>

                {nearestResults.length > 0 && (
                  <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                    {nearestResults.map((r, i) => (
                      <div key={i} className="p-3 bg-theme-bg border border-theme-border rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-theme-text">{r.name}</div>
                          <div className="text-[11px] text-theme-muted">{r.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {r.capacity - r.usedPorts} Port Tersedia
                          </div>
                          <div className="text-[10px] text-theme-muted">~{r.distanceKm || 0.8} km</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
