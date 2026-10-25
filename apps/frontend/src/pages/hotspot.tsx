import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { 
  Wifi, 
  Printer, 
  QrCode, 
  Plus, 
  Search, 
  RefreshCw, 
  Layers, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Ticket,
  Copy,
  Download,
  Receipt,
  Check,
  Zap,
  Tag
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface HotspotProfile {
  id: string
  name: string
  price: number
  duration: number
  rateLimit: string
  sharedUsers: number
  _count?: { vouchers: number }
}

interface Voucher {
  id: string
  code: string
  username: string
  password: string
  status: 'ACTIVE' | 'USED' | 'EXPIRED'
  loginUrl: string
  qrData: string
}

interface BatchData {
  batchCode: string
  profile: HotspotProfile
  total: number
  vouchers: Voucher[]
}

interface Stats {
  total: number
  active: number
  used: number
  expired: number
  estimatedRevenue: number
  totalBatches: number
  recentBatches?: Array<{ batchCode: string }>
}

export default function HotspotStudioPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    used: 0,
    expired: 0,
    estimatedRevenue: 0,
    totalBatches: 0,
  })
  const [profiles, setProfiles] = useState<HotspotProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'studio'>('overview')

  useEffect(() => {
    if (router.query.action === 'generate') {
      setShowGenerateModal(true)
    } else if (router.query.action === 'print') {
      setActiveTab('studio')
    }
  }, [router.query.action])
  const [printLayout, setPrintLayout] = useState<'a4' | 'thermal'>('a4')

  // Generator form
  const [genProfileId, setGenProfileId] = useState('')
  const [genCount, setGenCount] = useState<number>(20)
  const [genPrefix, setGenPrefix] = useState('AUD')

  // Active batch selected for Studio / Print
  const [currentBatch, setCurrentBatch] = useState<BatchData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'USED'>('ALL')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const profRes = await fetch(`${API_BASE}/hotspot/profiles`)
      if (profRes.ok) {
        const profData = await profRes.json()
        setProfiles(Array.isArray(profData) ? profData : [])
        if (profData.length > 0 && !genProfileId) {
          setGenProfileId(profData[0].id)
        }
      }

      const statsRes = await fetch(`${API_BASE}/hotspot/vouchers/stats`)
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
        if (statsData.recentBatches && statsData.recentBatches.length > 0 && !currentBatch) {
          loadBatch(statsData.recentBatches[0].batchCode)
        }
      }
    } catch (err) {
      console.error('Error loading hotspot data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadBatch = async (batchCode: string) => {
    try {
      const res = await fetch(`${API_BASE}/hotspot/vouchers/batch/${batchCode}`)
      if (res.ok) {
        const data = await res.json()
        setCurrentBatch(data)
      }
    } catch (err) {
      console.error('Error loading batch:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!genProfileId) return

    try {
      setIsGenerating(true)
      const res = await fetch(`${API_BASE}/hotspot/vouchers/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: genProfileId,
          count: Number(genCount),
          prefix: genPrefix,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        setShowGenerateModal(false)
        await loadData()
        if (result.batchCode) {
          await loadBatch(result.batchCode)
          setActiveTab('studio')
        }
      } else {
        alert('Gagal membuat batch voucher hotspot')
      }
    } catch (err) {
      console.error('Error generating vouchers:', err)
      alert('Terjadi kesalahan jaringan')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredVouchers = (currentBatch?.vouchers || []).filter(v => {
    const matchSearch = v.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        v.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <Layout>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, header, nav, aside, footer {
            display: none !important;
          }
          .print-container {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .voucher-a4-card {
            page-break-inside: avoid;
            border: 1px dashed #cbd5e1 !important;
            box-shadow: none !important;
          }
          .voucher-thermal-receipt {
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">
        
        {/* Top Header */}
        <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Monetisasi & Hotspot</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Voucher Generator</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Wifi className="text-theme-primary" size={26} />
              Hotspot Voucher Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-sm transition"
            >
              <Plus size={16} />
              <span>Generate Batch Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Dynamic KPI Cards */}
        <div className="no-print grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Voucher Aktif</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{stats.active}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">dari {stats.total} total dicetak</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Voucher Terpakai</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">{stats.used}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">terlogin ke MikroTik</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Ticket size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Estimasi Omset</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                Rp {stats.estimatedRevenue.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-theme-muted mt-0.5">pendapatan voucher</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <DollarSign size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Batch Cetak</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">{stats.totalBatches}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">batch terdaftar</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Layers size={18} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="no-print flex items-center gap-2 border-b border-theme-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-text'
            }`}
          >
            <Layers size={15} />
            <span>Katalog Profil & Daftar Batch</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'studio'
                ? 'border-blue-600 text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-text'
            }`}
          >
            <Printer size={15} />
            <span>Studio Cetak Template ({currentBatch?.batchCode || 'Pilih Batch'})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PROFILES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-3">Profil Paket Hotspot Tersedia</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {profiles.map(p => (
                  <div
                    key={p.id}
                    className="p-4 bg-theme-card border border-theme-border rounded-xl shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
                          {p.rateLimit}
                        </span>
                        <span className="text-[10px] text-theme-muted">{p._count?.vouchers || 0} lembar</span>
                      </div>
                      <h3 className="text-sm font-bold text-theme-text">{p.name}</h3>
                      <div className="mt-2 text-xl font-black font-mono text-theme-text">
                        Rp {p.price.toLocaleString('id-ID')}
                      </div>
                      <div className="mt-1 text-[11px] text-theme-muted flex items-center gap-1.5">
                        <Clock size={13} />
                        <span>Masa Aktif: {p.duration >= 1440 ? `${p.duration / 1440} Hari` : `${p.duration / 60} Jam`}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setGenProfileId(p.id)
                        setShowGenerateModal(true)
                      }}
                      className="w-full py-2 bg-theme-bg hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border text-theme-text rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} /> Cetak Batch Paket Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Batch Preview */}
            {currentBatch && (
              <div className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-theme-text flex items-center gap-2">
                      <Tag size={16} className="text-theme-primary" />
                      Batch Terpilih: <span className="font-mono text-blue-600 dark:text-blue-400">{currentBatch.batchCode}</span>
                    </h3>
                    <p className="text-xs text-theme-muted mt-0.5">
                      {currentBatch.profile?.name} • Rp {currentBatch.profile?.price.toLocaleString('id-ID')} • {currentBatch.total} Voucher Tergenerate
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('studio')
                        setPrintLayout('a4')
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Printer size={14} /> Cetak Lembar A4
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('studio')
                        setPrintLayout('thermal')
                      }}
                      className="px-3.5 py-2 bg-theme-bg hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border text-theme-text text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Receipt size={14} /> Struk Thermal
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme-border">
                        <th className="p-3">Kode Voucher</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Password</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-border">
                      {currentBatch.vouchers.slice(0, 15).map(v => (
                        <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono font-bold text-theme-text">{v.code}</td>
                          <td className="p-3 font-mono text-theme-text">{v.username}</td>
                          <td className="p-3 font-mono text-theme-text">{v.password}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {v.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => copyToClipboard(v.code)}
                              className="text-theme-primary font-semibold flex items-center gap-1 ml-auto text-xs"
                            >
                              {copiedCode === v.code ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedCode === v.code ? 'Tersalin' : 'Salin'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRINT STUDIO */}
        {activeTab === 'studio' && currentBatch && (
          <div className="space-y-6">
            <div className="no-print bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-theme-muted font-bold">Pilih Layout Cetak:</span>
                <div className="flex border border-theme-border rounded-lg p-0.5 bg-theme-bg">
                  <button
                    onClick={() => setPrintLayout('a4')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${printLayout === 'a4' ? 'bg-theme-card text-theme-text shadow-xs' : 'text-theme-muted'}`}
                  >
                    Kertas A4 (Grid Kartu)
                  </button>
                  <button
                    onClick={() => setPrintLayout('thermal')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${printLayout === 'thermal' ? 'bg-theme-card text-theme-text shadow-xs' : 'text-theme-muted'}`}
                  >
                    Struk Thermal (58/80mm)
                  </button>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Printer size={15} /> Cetak Dokumen Sekarang
              </button>
            </div>

            {/* Printable Area */}
            <div className="print-container">
              {printLayout === 'a4' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredVouchers.map(v => (
                    <div
                      key={v.id}
                      className="voucher-a4-card bg-white border border-slate-300 rounded-xl p-3.5 text-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                        <div>
                          <div className="font-black text-xs tracking-wider text-blue-900">AUDIRA HOTSPOT</div>
                          <div className="text-[9px] text-slate-500">{currentBatch.profile?.name}</div>
                        </div>
                        <div className="font-bold text-xs font-mono text-emerald-700">
                          Rp {currentBatch.profile?.price.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <QRCodeSVG value={v.loginUrl || v.code} size={58} />
                        <div className="text-left font-mono space-y-0.5 text-xs">
                          <div className="text-[9px] text-slate-400 uppercase">KODE VOUCHER</div>
                          <div className="font-black text-sm text-slate-900 tracking-wider">{v.code}</div>
                          <div className="text-[10px] text-slate-600">Speed: {currentBatch.profile?.rateLimit}</div>
                        </div>
                      </div>

                      <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 pt-1">
                        Hubungkan ke Wi-Fi lalu scan QR atau masukkan kode
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-xs mx-auto space-y-4">
                  {filteredVouchers.map(v => (
                    <div
                      key={v.id}
                      className="voucher-thermal-receipt bg-white border border-slate-300 rounded-lg p-4 text-slate-900 font-mono text-center space-y-2"
                    >
                      <div className="font-black text-sm">AUDIRA NET HOTSPOT</div>
                      <div className="text-[10px] text-slate-500">Jl. Telekomunikasi No. 1 • 0821-1200-1600</div>
                      <div className="border-t border-dashed border-slate-300 my-2" />
                      <div className="font-bold text-xs">{currentBatch.profile?.name}</div>
                      <div className="text-base font-black">Rp {currentBatch.profile?.price.toLocaleString('id-ID')}</div>
                      <div className="my-2 flex justify-center">
                        <QRCodeSVG value={v.loginUrl || v.code} size={90} />
                      </div>
                      <div className="text-lg font-black tracking-widest">{v.code}</div>
                      <div className="text-[10px] text-slate-600">Durasi: {currentBatch.profile?.duration / 60} Jam</div>
                      <div className="border-t border-dashed border-slate-300 my-2" />
                      <div className="text-[9px] text-slate-400">Terima kasih telah berbelanja</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Generate Batch Baru */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
                  <Plus size={16} className="text-theme-primary" /> Generate Batch Voucher Hotspot
                </h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-theme-muted hover:text-theme-text">✕</button>
              </div>

              <form onSubmit={handleGenerate} className="p-5 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-theme-muted font-bold block">Pilih Profil Hotspot *</label>
                  <select
                    value={genProfileId}
                    onChange={e => setGenProfileId(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                  >
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - Rp {p.price.toLocaleString('id-ID')} ({p.rateLimit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-theme-muted font-bold block">Jumlah Voucher Yang Dibuat *</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={genCount}
                    onChange={e => setGenCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-theme-text font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-theme-muted font-bold block">Awalan Kode (Prefix)</label>
                  <input
                    type="text"
                    value={genPrefix}
                    onChange={e => setGenPrefix(e.target.value.toUpperCase())}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-theme-text font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl font-semibold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    <span>{isGenerating ? 'Membuat...' : 'Generate Batch'}</span>
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
