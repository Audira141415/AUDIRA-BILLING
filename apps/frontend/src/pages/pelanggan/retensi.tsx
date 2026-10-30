import { useState, useEffect, useMemo } from 'react'
import Layout from '@/components/Layout'
import {
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Phone,
  MessageSquare,
  Wrench,
  DollarSign,
  ChevronRight,
  X,
  Activity,
  UserCheck,
  Send,
  Zap,
  Gift,
  PhoneCall,
  Sliders,
  HelpCircle,
  Eye
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface RetentionRadarItem {
  id: string
  customerId: string
  customerName: string
  internetNumber: string
  phone: string
  address: string
  packageName: string
  monthlyBill: number
  opticalRxDbm: number
  opticalSlope30d: number[]
  opticalCondition: 'NORMAL' | 'WARNING' | 'CRITICAL'
  complaintTicketsCount: number
  avgLatePaymentDays: number
  churnRiskScore: number
  riskTier: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'HEALTHY'
  riskFactors: string[]
  recommendedAction: 'SCHEDULE_CALIBRATION' | 'OFFER_PROMO' | 'VIP_CARE'
  status: 'PENDING_ACTION' | 'IN_TREATMENT' | 'RESOLVED'
  treatmentNotes?: string
}

export default function ChurnRetentionRadarPage() {
  const [items, setItems] = useState<RetentionRadarItem[]>([])
  const [stats, setStats] = useState({
    totalMonitored: 0,
    criticalRiskCount: 0,
    highRiskCount: 0,
    opticalDegradationCount: 0,
    mrrAtRisk: 0,
    avgChurnScore: 60,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'HEALTHY'>('ALL')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Action Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<RetentionRadarItem | null>(null)
  const [actionType, setActionType] = useState<'SCHEDULE_CALIBRATION' | 'OFFER_PROMO' | 'VIP_CARE'>('SCHEDULE_CALIBRATION')
  const [actionNotes, setActionNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [listRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/retensi/radar`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/retensi/stats`).then(r => r.json()).catch(() => null),
      ])

      setItems(Array.isArray(listRes) ? listRes : [])
      if (statsRes) setStats(statsRes)
    } catch (err) {
      console.error('Failed to load retention data:', err)
      showToast('Gagal memuat radar retensi', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.internetNumber.includes(searchTerm) ||
        item.phone.includes(searchTerm) ||
        item.packageName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchTier = tierFilter === 'ALL' || item.riskTier === tierFilter

      return matchSearch && matchTier
    })
  }, [items, searchTerm, tierFilter])

  // Execute Action
  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return

    try {
      setIsSubmitting(true)
      const res = await fetch(`${API_BASE}/retensi/${selectedItem.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          notes: actionNotes || `Tindakan ${actionType} dieksekusi dari radar admin.`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        showToast(data.message || 'Tindakan retensi berhasil diproses!', 'success')
        setActionModalOpen(false)
        await loadData()
      } else {
        showToast('Gagal memproses tindakan retensi', 'error')
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-3 transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : toast.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
            } backdrop-blur-md`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Activity className="w-3 h-3 mr-1" />
                AI CHURN RADAR
              </span>
              <span className="text-xs font-mono text-[var(--app-text-muted)]">
                Predictive Optical Degradation & Retention Engine
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--app-text)] mt-1">
              Radar Retensi & Deteksi Pelemahan Optik
            </h1>
            <p className="text-sm text-[var(--app-text-muted)] mt-1">
              Kombinasi telemetri redaman serat optik, frekuensi komplain tiket, & kebiasaan bayar untuk mencegah pelanggan cabut.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Risiko Churn Kritis
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">
                {stats.criticalRiskCount}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">pelanggan (Skor ≥80%)</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Memerlukan tindakan retensi dalam 48 jam
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Anomali Redaman Optik
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {stats.opticalDegradationCount}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">modem dropcore</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Redaman memburuk (Rx &lt; -24 dBm)
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                MRR Berisiko Hilang
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                Rp {stats.mrrAtRisk.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Pendapatan bulanan dari akun berisiko tinggi
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Tingkat Retensi Berhasil
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                94.8%
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">retention rate</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Pelanggan terselamatkan pasca intervensi
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari Pelanggan, No Internet, HP..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tier Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs flex-wrap">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'HEALTHY'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTierFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  tierFilter === tab
                    ? 'bg-[var(--app-card)] text-[var(--app-text)] shadow-sm font-semibold'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                {tab === 'ALL'
                  ? 'Semua'
                  : tab === 'CRITICAL'
                  ? 'Kritis'
                  : tab === 'HIGH'
                  ? 'Tinggi'
                  : tab === 'MODERATE'
                  ? 'Moderat'
                  : 'Sehat'}
              </button>
            ))}
          </div>
        </div>

        {/* Radar Table */}
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] text-xs uppercase tracking-wider border-b border-[var(--app-border)]">
                <tr>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Paket & Biaya</th>
                  <th className="p-4">Kualitas Redaman (Rx dBm)</th>
                  <th className="p-4">Faktor Risiko Terdeteksi</th>
                  <th className="p-4">Skor Churn</th>
                  <th className="p-4 text-right">Rekomendasi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                {filteredItems.map(item => {
                  const isCritical = item.riskTier === 'CRITICAL'
                  const isHigh = item.riskTier === 'HIGH'

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[var(--app-card-subtle)] transition-colors ${
                        isCritical ? 'bg-rose-500/[0.02]' : isHigh ? 'bg-amber-500/[0.02]' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-[var(--app-text)]">{item.customerName}</div>
                        <div className="text-xs font-mono text-[var(--app-text-muted)]">{item.internetNumber}</div>
                        <div className="text-xs text-[var(--app-text-muted)] mt-0.5">{item.address}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-xs">{item.packageName}</div>
                        <div className="text-xs font-mono text-[var(--app-text-muted)]">
                          Rp {item.monthlyBill.toLocaleString('id-ID')}/bln
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                              item.opticalCondition === 'CRITICAL'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : item.opticalCondition === 'WARNING'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {item.opticalRxDbm} dBm
                          </span>
                        </div>

                        {/* Sparkline Visual Mini-Slope */}
                        <div className="mt-2 flex items-end gap-1 h-4">
                          {item.opticalSlope30d.map((val, idx) => {
                            // Map -18 to -30 dBm to bar height
                            const heightPct = Math.max(15, Math.min(100, Math.round(((Math.abs(val) - 16) / 14) * 100)))
                            return (
                              <div
                                key={idx}
                                title={`T-${(4 - idx) * 7}h: ${val} dBm`}
                                className={`w-2 rounded-t transition-all ${
                                  idx === 4
                                    ? val < -27
                                      ? 'bg-rose-500'
                                      : val < -23
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                    : 'bg-[var(--app-text-muted)] opacity-30'
                                }`}
                                style={{ height: `${heightPct}%` }}
                              />
                            )
                          })}
                          <span className="text-[10px] text-[var(--app-text-muted)] ml-1">30 hari</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <ul className="text-xs space-y-1 text-[var(--app-text-muted)] max-w-xs">
                          {item.riskFactors.map((f, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-rose-500">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isCritical
                                ? 'text-rose-600 dark:text-rose-400'
                                : isHigh
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {item.churnRiskScore}%
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              isCritical
                                ? 'bg-rose-500/10 text-rose-500'
                                : isHigh
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}
                          >
                            {item.riskTier}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-28 h-1.5 rounded-full bg-[var(--app-card-subtle)] mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.churnRiskScore}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setActionType(item.recommendedAction)
                              setActionNotes('')
                              setActionModalOpen(true)
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                              item.recommendedAction === 'SCHEDULE_CALIBRATION'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : item.recommendedAction === 'OFFER_PROMO'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {item.recommendedAction === 'SCHEDULE_CALIBRATION' ? (
                              <>
                                <Wrench className="w-3.5 h-3.5" /> Kalibrasi Optik
                              </>
                            ) : item.recommendedAction === 'OFFER_PROMO' ? (
                              <>
                                <Gift className="w-3.5 h-3.5" /> Promo Retensi
                              </>
                            ) : (
                              <>
                                <PhoneCall className="w-3.5 h-3.5" /> VIP Care
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Intervensi Retensi */}
        {actionModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--app-text)]">Eksekusi Tindakan Retensi Proaktif</h3>
                    <p className="text-xs text-[var(--app-text-muted)]">
                      {selectedItem.customerName} ({selectedItem.internetNumber})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActionModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleExecuteAction} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--app-text-muted)]">Pilih Jenis Tindakan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setActionType('SCHEDULE_CALIBRATION')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        actionType === 'SCHEDULE_CALIBRATION'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)]'
                      }`}
                    >
                      <Wrench className="w-4 h-4" />
                      Kalibrasi Optik
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionType('OFFER_PROMO')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        actionType === 'OFFER_PROMO'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)]'
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                      Promo Retensi
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionType('VIP_CARE')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        actionType === 'VIP_CARE'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)]'
                      }`}
                    >
                      <PhoneCall className="w-4 h-4" />
                      VIP Care Call
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs text-[var(--app-text-muted)] space-y-1.5">
                  <div className="font-semibold text-[var(--app-text)]">Dampak Tindakan:</div>
                  {actionType === 'SCHEDULE_CALIBRATION' && (
                    <p>
                      Menerbitkan Surat Perintah Kerja (SPK) teknisi lapangan gratis untuk membersihkan konektor dropcore & memulihkan redaman ke level prima (-19 dBm), serta mengirim WhatsApp jadwal kunjungan ke pelanggan.
                    </p>
                  )}
                  {actionType === 'OFFER_PROMO' && (
                    <p>
                      Mengirimkan voucher Speed Booster +30 Mbps selama 7 hari atau diskon tagihan 20% bulan depan langsung ke WhatsApp pelanggan untuk meningkatkan kepuasan.
                    </p>
                  )}
                  {actionType === 'VIP_CARE' && (
                    <p>
                      Memasukkan akun ke daftar prioritas antrean Customer Service untuk dihubungi secara personal via telepon/WA resmi ISP.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--app-text-muted)]">Catatan Khusus Tindakan</label>
                  <textarea
                    rows={2}
                    value={actionNotes}
                    onChange={e => setActionNotes(e.target.value)}
                    placeholder="Contoh: Jadwalkan kunjungan teknisi hari Sabtu pagi pukul 09:00 WIB."
                    className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setActionModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--app-text-muted)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all"
                  >
                    {isSubmitting ? 'Memproses...' : 'Eksekusi Tindakan Retensi'}
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
