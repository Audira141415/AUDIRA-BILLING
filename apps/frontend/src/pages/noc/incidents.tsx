import { useState, useEffect, useMemo } from 'react'
import Layout from '@/components/Layout'
import { useToast } from '@/contexts/ToastContext'
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Plus,
  Send,
  Radio,
  Activity,
  Layers,
  Phone,
  MessageSquare,
  Wrench,
  Users,
  ChevronRight,
  ChevronDown,
  X,
  MapPin,
  ExternalLink,
  Flame,
  Zap,
  Info,
  Calendar
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface AffectedCustomer {
  id: string
  name: string
  phone: string
  pppoeUser: string
  odp: string
  address: string
  notifiedWa: boolean
}

interface IncidentTimelineEvent {
  time: string
  title: string
  desc: string
  actor: string
}

interface OutageIncident {
  id: string
  incidentNumber: string
  title: string
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR'
  status: 'REPORTED' | 'INVESTIGATING' | 'SPLICING_IN_PROGRESS' | 'MONITORING' | 'RESOLVED'
  impactArea: string
  oltName: string
  ponPort: string
  odpNames: string[]
  affectedCount: number
  affectedCustomers: AffectedCustomer[]
  splicerTeam: string
  estimatedResolution: string
  rootCause: string
  createdAt: string
  resolvedAt?: string
  timeline: IncidentTimelineEvent[]
  whatsappBroadcastCount: number
  telegramDispatched: boolean
}

export default function OutageIncidentsPage() {
  const [incidents, setIncidents] = useState<OutageIncident[]>([])
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    customersDownTotal: 0,
    splicingInProgress: 0,
    avgMttrMinutes: 78,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'MAJOR' | 'MINOR'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SPLICING' | 'RESOLVED'>('ALL')
  const { toast } = useToast()

  // Modals
  const [selectedIncident, setSelectedIncident] = useState<OutageIncident | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New Incident Form State
  const [newTitle, setNewTitle] = useState('')
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'MAJOR' | 'MINOR'>('CRITICAL')
  const [newImpactArea, setNewImpactArea] = useState('Kecamatan Merdeka Utara')
  const [newOltName, setNewOltName] = useState('OLT-HUAWEI-MA5608T-POP-BARAT')
  const [newPonPort, setNewPonPort] = useState('PON 0/1/4')
  const [newOdpNames, setNewOdpNames] = useState('ODP-MRD-05, ODP-MRD-06')
  const [newSplicerTeam, setNewSplicerTeam] = useState('Tim Reaksi Cepat Splicer (Hadi & Joko)')
  const [newEta, setNewEta] = useState('Hari ini, 18:00 WIB (~120 Menit)')
  const [newRootCause, setNewRootCause] = useState('Kabel dropcore / feeder putus akibat pohon tumbang.')

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else toast.info(message)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [listRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/incident/list`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/incident/stats`).then(r => r.json()).catch(() => null),
      ])

      const incList = Array.isArray(listRes) ? listRes : []
      setIncidents(incList)
      if (statsRes) setStats(statsRes)
    } catch (err) {
      console.error('Failed to load incidents:', err)
      showToast('Gagal memuat data gangguan massal', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtered List
  const filteredIncidents = useMemo(() => {
    return incidents.filter(item => {
      const matchSearch =
        item.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.impactArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.odpNames.some(o => o.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchSeverity = severityFilter === 'ALL' || item.severity === severityFilter

      let matchStatus = true
      if (statusFilter === 'ACTIVE') matchStatus = item.status !== 'RESOLVED'
      else if (statusFilter === 'SPLICING') matchStatus = item.status === 'SPLICING_IN_PROGRESS'
      else if (statusFilter === 'RESOLVED') matchStatus = item.status === 'RESOLVED'

      return matchSearch && matchSeverity && matchStatus
    })
  }, [incidents, searchTerm, severityFilter, statusFilter])

  // Create Incident
  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      showToast('Judul insiden wajib diisi', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const odpList = newOdpNames.split(',').map(s => s.trim()).filter(Boolean)
      const res = await fetch(`${API_BASE}/incident/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          severity: newSeverity,
          impactArea: newImpactArea,
          oltName: newOltName,
          ponPort: newPonPort,
          odpNames: odpList.length > 0 ? odpList : ['ODP-UMUM'],
          splicerTeam: newSplicerTeam,
          estimatedResolution: newEta,
          rootCause: newRootCause,
        }),
      })

      if (res.ok) {
        showToast('Tiket gangguan massal berhasil didaftarkan dan dikirim ke Telegram Topic 5!', 'success')
        setCreateModalOpen(false)
        setNewTitle('')
        await loadData()
      } else {
        showToast('Gagal mendaftarkan insiden', 'error')
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: OutageIncident['status'], notes?: string) => {
    try {
      setIsSubmitting(true)
      const res = await fetch(`${API_BASE}/incident/${id}/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes, actor: 'NOC Commander' }),
      })

      if (res.ok) {
        const updated = await res.json()
        showToast(`Status insiden diperbarui ke: ${newStatus}`, 'success')
        if (selectedIncident && selectedIncident.id === id) {
          setSelectedIncident(updated)
        }
        await loadData()
      }
    } catch (err: any) {
      showToast(`Gagal update status: ${err.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1-Click Mass Broadcast WhatsApp
  const handleBroadcastWhatsApp = async (id: string) => {
    try {
      setIsSubmitting(true)
      const res = await fetch(`${API_BASE}/incident/${id}/broadcast-wa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        const data = await res.json()
        showToast(`Broadcast terkirim ke ${data.successCount} dari ${data.totalTarget} pelanggan!`, 'success')
        setBroadcastModalOpen(false)
        await loadData()
        if (selectedIncident && selectedIncident.id === id) {
          setSelectedIncident(data.incident)
        }
      } else {
        showToast('Gagal memproses broadcast WhatsApp', 'error')
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dispatch to Telegram Topic 5
  const handleDispatchTelegram = async (id: string) => {
    try {
      setIsSubmitting(true)
      const res = await fetch(`${API_BASE}/incident/${id}/dispatch-telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Disiarkan ulang secara manual oleh operator NOC.' }),
      })

      if (res.ok) {
        showToast('Pemberitahuan darurat disiarkan ke Telegram Topic 5 (Network Incidents)!', 'success')
      } else {
        showToast('Gagal mengirim ke Telegram', 'error')
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
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Flame className="w-3 h-3 mr-1 animate-pulse" />
                NOC OUTAGE ENGINE
              </span>
              <span className="text-xs font-mono text-[var(--app-text-muted)]">
                Carrier-Grade Incident Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--app-text)] mt-1">
              Pusat Kendali Gangguan Massal & Broadcast
            </h1>
            <p className="text-sm text-[var(--app-text-muted)] mt-1">
              Pemetaan kabel optik putus, blast otomatis WhatsApp pelanggan terdampak, & sinkronisasi Telegram Topic 5.
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

            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Buka Insiden Baru
            </button>
          </div>
        </div>

        {/* 4 Top Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Insiden Aktif
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">
                {stats.activeIncidents}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">tiket berjalan</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              Prioritas kritis ditangani tim lapangan
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Pelanggan Padam
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {stats.customersDownTotal}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">akun PPPoE</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Terdampak di seluruh ODP bermasalah
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Tim Splicing On-Site
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {stats.splicingInProgress}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">tim bergerak</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Sedang melakukan fusion sambung core
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Rata-rata MTTR
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {stats.avgMttrMinutes}
              </span>
              <span className="text-xs text-[var(--app-text-muted)]">menit pemulihan</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">
              Mean Time to Recovery 30 hari terakhir
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari No Tiket, Judul, ODP, Area..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs">
              {(['ALL', 'ACTIVE', 'SPLICING', 'RESOLVED'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    statusFilter === tab
                      ? 'bg-[var(--app-card)] text-[var(--app-text)] shadow-sm font-semibold'
                      : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {tab === 'ALL'
                    ? 'Semua'
                    : tab === 'ACTIVE'
                    ? 'Aktif'
                    : tab === 'SPLICING'
                    ? 'Splicing'
                    : 'Pulih'}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
            >
              <option value="ALL">Semua Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="MAJOR">Major</option>
              <option value="MINOR">Minor</option>
            </select>
          </div>
        </div>

        {/* Incidents List Container */}
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-[var(--app-text)]">Tidak Ada Gangguan Ditemukan</h3>
              <p className="text-sm text-[var(--app-text-muted)] mt-1">
                Seluruh jaringan kabel optik dan backbone ISP beroperasi secara normal.
              </p>
            </div>
          ) : (
            filteredIncidents.map(inc => {
              const isResolved = inc.status === 'RESOLVED'
              return (
                <div
                  key={inc.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isResolved
                      ? 'border-[var(--app-border)] bg-[var(--app-card)] opacity-85'
                      : inc.severity === 'CRITICAL'
                      ? 'border-rose-500/40 bg-[var(--app-card)] shadow-sm'
                      : 'border-amber-500/30 bg-[var(--app-card)] shadow-sm'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info & Badges */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--app-text)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded border border-[var(--app-border)]">
                          {inc.incidentNumber}
                        </span>

                        {/* Severity Badge */}
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            inc.severity === 'CRITICAL'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : inc.severity === 'MAJOR'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {inc.severity}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            inc.status === 'RESOLVED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : inc.status === 'SPLICING_IN_PROGRESS'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {!isResolved && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                          {inc.status.replace(/_/g, ' ')}
                        </span>

                        {inc.telegramDispatched && (
                          <span className="text-[11px] font-mono text-blue-500 flex items-center gap-1">
                            <Radio className="w-3 h-3" /> Telegram Topic 5 Synced
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[var(--app-text)]">
                        {inc.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--app-text-muted)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {inc.impactArea}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          {inc.oltName} ({inc.ponPort})
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <b>{inc.affectedCount}</b> Pelanggan Padam
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" />
                          ETA: <b>{inc.estimatedResolution}</b>
                        </span>
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--app-border)]">
                      <button
                        onClick={() => {
                          setSelectedIncident(inc)
                          setDetailModalOpen(true)
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card)] transition-colors flex items-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Detail & Timeline
                      </button>

                      {!isResolved && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedIncident(inc)
                              setBroadcastModalOpen(true)
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Broadcast WA ({inc.whatsappBroadcastCount})
                          </button>

                          <button
                            onClick={() => handleDispatchTelegram(inc.id)}
                            className="p-2 rounded-xl text-xs font-semibold border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-blue-600 dark:text-blue-400 hover:bg-[var(--app-card)] transition-colors"
                            title="Kirim Peringatan ke Telegram Topic 5"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Lifecycle Advance Button */}
                          {inc.status === 'INVESTIGATING' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'SPLICING_IN_PROGRESS', 'Tim tiba di titik putus, proses splicing dimulai.')}
                              className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              Mulai Splicing
                            </button>
                          )}

                          {inc.status === 'SPLICING_IN_PROGRESS' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'MONITORING', 'Splicing core tuntas, menguji redaman ODP.')}
                              className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5"
                            >
                              <Activity className="w-3.5 h-3.5" />
                              Monitoring Redaman
                            </button>
                          )}

                          {inc.status === 'MONITORING' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'RESOLVED', 'Semua sesi PPPoE online kembali normal. Tiket ditutup.')}
                              className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Tutup Tiket (Pulih)
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal 1: Buka Insiden Baru */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[var(--app-text)]">Pendaftaran Insiden Gangguan Massal</h2>
                    <p className="text-xs text-[var(--app-text-muted)]">Otomatis mengirim alert ke Telegram Topic 5</p>
                  </div>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateIncident} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--app-text-muted)]">Judul Insiden</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Contoh: Kabel Feeder 24C Putus Tertabrak Truk - Jl. Ahmad Yani"
                    className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Tingkat Keparahan</label>
                    <select
                      value={newSeverity}
                      onChange={e => setNewSeverity(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
                    >
                      <option value="CRITICAL">Critical (Total Blackout)</option>
                      <option value="MAJOR">Major (Banyak ODP Drop)</option>
                      <option value="MINOR">Minor (Redaman Buruk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Area Terdampak</label>
                    <input
                      type="text"
                      value={newImpactArea}
                      onChange={e => setNewImpactArea(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">OLT Trunk</label>
                    <input
                      type="text"
                      value={newOltName}
                      onChange={e => setNewOltName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Port PON</label>
                    <input
                      type="text"
                      value={newPonPort}
                      onChange={e => setNewPonPort(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--app-text-muted)]">Daftar ODP Terdampak (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={newOdpNames}
                    onChange={e => setNewOdpNames(e.target.value)}
                    placeholder="ODP-MRD-01, ODP-MRD-02"
                    className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Tim Splicer Bertugas</label>
                    <input
                      type="text"
                      value={newSplicerTeam}
                      onChange={e => setNewSplicerTeam(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Estimasi Pemulihan (ETA)</label>
                    <input
                      type="text"
                      value={newEta}
                      onChange={e => setNewEta(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--app-text-muted)]">Akar Masalah (Root Cause Awal)</label>
                  <textarea
                    rows={2}
                    value={newRootCause}
                    onChange={e => setNewRootCause(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all"
                  >
                    {isSubmitting ? 'Mendaftarkan...' : 'Publikasikan Tiket Insiden'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Detail Insiden & Timeline Kronologis */}
        {detailModalOpen && selectedIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                      {selectedIncident.incidentNumber}
                    </span>
                    <span className="text-xs font-bold text-rose-500">{selectedIncident.severity}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--app-text)] mt-1">{selectedIncident.title}</h2>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Root Cause */}
              <div className="p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--app-text-muted)]">Status Penanganan:</span>
                  <span className="font-semibold text-blue-500">{selectedIncident.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--app-text-muted)]">Akar Penyebab:</span>
                  <span className="font-medium text-[var(--app-text)]">{selectedIncident.rootCause}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--app-text-muted)]">Tim Splicer Bertugas:</span>
                  <span className="font-mono text-emerald-500">{selectedIncident.splicerTeam}</span>
                </div>
              </div>

              {/* Pelanggan Terdampak */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] mb-2 flex items-center justify-between">
                  <span>Daftar Pelanggan Terdampak ({selectedIncident.affectedCustomers.length})</span>
                  <span className="text-emerald-500 text-[11px] font-normal">
                    {selectedIncident.affectedCustomers.filter(c => c.notifiedWa).length} Notifikasi Terkirim
                  </span>
                </h4>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-[var(--app-border)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] sticky top-0">
                      <tr>
                        <th className="p-2.5">Nama Pelanggan</th>
                        <th className="p-2.5">User PPPoE</th>
                        <th className="p-2.5">Titik ODP</th>
                        <th className="p-2.5">WhatsApp</th>
                        <th className="p-2.5 text-right">Status WA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                      {selectedIncident.affectedCustomers.map(cust => (
                        <tr key={cust.id} className="hover:bg-[var(--app-card-subtle)]">
                          <td className="p-2.5 font-medium">{cust.name}</td>
                          <td className="p-2.5 font-mono text-blue-500">{cust.pppoeUser}</td>
                          <td className="p-2.5 font-mono">{cust.odp}</td>
                          <td className="p-2.5 font-mono text-[var(--app-text-muted)]">{cust.phone}</td>
                          <td className="p-2.5 text-right">
                            {cust.notifiedWa ? (
                              <span className="inline-flex items-center text-emerald-500 font-semibold gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim
                              </span>
                            ) : (
                              <span className="text-amber-500">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline Kronologis */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] mb-3">
                  Log Kronologis Penanganan (Audit Feed)
                </h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--app-border)]">
                  {selectedIncident.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[var(--app-card)]" />
                      <div className="text-xs font-mono font-bold text-blue-500">{event.time}</div>
                      <div className="text-sm font-semibold text-[var(--app-text)] mt-0.5">{event.title}</div>
                      <div className="text-xs text-[var(--app-text-muted)] mt-0.5">{event.desc}</div>
                      <div className="text-[11px] text-[var(--app-text-muted)] italic mt-0.5">Oleh: {event.actor}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card)]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Konfirmasi 1-Click Mass Broadcast WhatsApp */}
        {broadcastModalOpen && selectedIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--app-text)]">Broadcast Massal WhatsApp</h3>
                  <p className="text-xs text-[var(--app-text-muted)]">Kirim notifikasi serentak via Fonnte / WAHA Baileys</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] text-xs text-[var(--app-text-muted)] space-y-2">
                <div className="font-semibold text-[var(--app-text)]">Preview Pesan Terkirim:</div>
                <div className="font-mono bg-[var(--app-card)] p-3 rounded-lg border border-[var(--app-border)] leading-relaxed whitespace-pre-line">
                  {`[PEMBERITAHUAN GANGGUAN JARINGAN FIBER OPTIK]\n\nYth. Pelanggan *{nama}*,\nKami menginformasikan bahwa saat ini layanan internet di wilayah Anda (*${selectedIncident.odpNames.join(', ')}*) sedang mengalami kendala sementara:\n\n*Kendala*: ${selectedIncident.title}\n*Area Terdampak*: ${selectedIncident.impactArea}\n*Estimasi Selesai (ETA)*: ${selectedIncident.estimatedResolution}\n\nTim teknisi kami sedang bekerja di lokasi untuk penyambungan kabel. Terima kasih atas kesabarannya.\n\n_Pusat Operasional AUDIRA-NET_`}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Target Pengiriman: <b>{selectedIncident.affectedCustomers.length} Pelanggan PPPoE</b>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--app-text-muted)]"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleBroadcastWhatsApp(selectedIncident.id)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all"
                >
                  {isSubmitting ? 'Mengirim Pesan...' : 'Kirim Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
