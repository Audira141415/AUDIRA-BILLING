import { useState, useEffect, useCallback } from 'react'
import Layout from '@/components/Layout'
import { 
  ShieldAlert, 
  Activity, 
  Zap, 
  Filter, 
  RefreshCw, 
  ArrowUpRight, 
  Radio, 
  Flame, 
  ShieldCheck, 
  Plus, 
  X, 
  Server, 
  Layers, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Eye,
  Trash2
} from 'lucide-react'
import { showAudiraToast } from '@/contexts/ToastContext'

interface NetflowRecord {
  id: string
  timestamp: string
  srcIp: string
  dstIp: string
  protocol: 'TCP' | 'UDP' | 'ICMP'
  srcPort: number
  dstPort: number
  packets: number
  bytes: number
  bandwidthMbps: number
  srcAsn: string
  dstAsn: string
  tcpFlags?: string
  application: string
}

interface DdosAlert {
  id: string
  detectedAt: string
  targetIp: string
  attackType: 'SYN_FLOOD' | 'UDP_AMPLIFICATION' | 'DNS_AMP' | 'ICMP_FLOOD'
  volumeGbps: number
  packetsPerSec: number
  sourceCountries: string[]
  status: 'MITIGATING' | 'DETECTED' | 'FILTERED' | 'MONITORING'
  mitigationMethod: 'BGP_FLOWSPEC' | 'RTBH_BLACKHOLE' | 'RATE_LIMIT'
  flowspecRule?: string
}

interface FlowspecRule {
  id: string
  prefix: string
  action: 'DISCARD' | 'RATE_LIMIT' | 'REDIRECT_SCRUBBING'
  rateLimitMbps?: number
  protocol?: string
  dstPort?: number
  injectedAt: string
  routerNode: string
  status: 'ACTIVE' | 'WITHDRAWN'
}

interface TopTalker {
  rank: number
  ip: string
  name: string
  trafficGb: number
  sharePct: number
  asn: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

export default function NetflowFlowspecShieldPage() {
  const [activeTab, setActiveTab] = useState<'flows' | 'ddos' | 'flowspec' | 'top-talkers'>('flows')
  const [flows, setFlows] = useState<NetflowRecord[]>([])
  const [ddosAlerts, setDdosAlerts] = useState<DdosAlert[]>([])
  const [flowspecRules, setFlowspecRules] = useState<FlowspecRule[]>([])
  const [topTalkers, setTopTalkers] = useState<TopTalker[]>([])
  const [stats, setStats] = useState({
    totalBandwidthGbps: 18.42,
    peakBandwidthGbps: 24.80,
    totalPps: 2450000,
    flowRateKfps: 142.5,
    activeFlowsCount: 48590,
    activeDdosAlertsCount: 1,
    totalAttacksBlockedToday: 14,
    flowspecRulesActive: 2,
  })
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Flowspec Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetPrefix, setTargetPrefix] = useState('103.189.20.')
  const [actionType, setActionType] = useState<'DISCARD' | 'RATE_LIMIT' | 'REDIRECT_SCRUBBING'>('DISCARD')
  const [rateLimitMbps, setRateLimitMbps] = useState(10)
  const [targetProtocol, setTargetProtocol] = useState('UDP')
  const [targetPort, setTargetPort] = useState(53)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, flowsRes, alertsRes, rulesRes, talkersRes] = await Promise.all([
        fetch(`${API_BASE}/netflow/stats`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/netflow/flows?limit=30`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/netflow/ddos-alerts`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/netflow/flowspec-rules`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/netflow/top-talkers`).then(r => r.json()).catch(() => []),
      ])

      if (statsRes) setStats(statsRes)
      if (Array.isArray(flowsRes)) setFlows(flowsRes)
      if (Array.isArray(alertsRes)) setDdosAlerts(alertsRes)
      if (Array.isArray(rulesRes)) setFlowspecRules(rulesRes)
      if (Array.isArray(talkersRes)) setTopTalkers(talkersRes)
    } catch (err) {
      console.error('Error fetching netflow telemetry:', err)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchData, 4000)
    return () => clearInterval(interval)
  }, [autoRefresh, fetchData])

  const handleApplyFlowspec = async () => {
    if (!targetPrefix || targetPrefix.length < 9) {
      showAudiraToast.error('Masukkan prefix IP target yang valid (misal 103.189.20.45/32)', 'Validasi IP')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch(`${API_BASE}/netflow/flowspec/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prefix: targetPrefix.includes('/') ? targetPrefix : `${targetPrefix}/32`,
          action: actionType,
          rateLimitMbps: actionType === 'RATE_LIMIT' ? rateLimitMbps : undefined,
          protocol: targetProtocol,
          dstPort: targetPort || undefined,
        }),
      })

      const data = await res.json()
      if (data.success) {
        showAudiraToast.success(data.message, 'BGP Flowspec Sukses')
        setIsModalOpen(false)
        fetchData()
      } else {
        showAudiraToast.error(data.message || 'Gagal menginjeksi Flowspec', 'Kesalahan')
      }
    } catch (err: any) {
      showAudiraToast.error('Gagal terhubung ke backend BGP Core', 'Kesalahan Jaringan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWithdrawRule = async (id: string, prefix: string) => {
    if (!confirm(`Cabut aturan BGP Flowspec untuk ${prefix}? Trafik akan dinormalkan kembali.`)) return
    try {
      const res = await fetch(`${API_BASE}/netflow/flowspec/${id}/withdraw`, {
        method: 'POST',
      })
      const data = await res.json()
      if (data.success) {
        showAudiraToast.success(data.message, 'Flowspec Withdrawn')
        fetchData()
      }
    } catch (err) {
      showAudiraToast.error('Gagal mencabut aturan Flowspec', 'Kesalahan')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--app-text)]">
                    NetFlow v9 / IPFIX & BGP Flowspec DDoS Shield
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--app-text-muted)]">
                    Telemetri Aliran Trafik Real-Time, Pemindai Anomali Serangan L4/L7, dan Mitigasi BGP Flowspec / RTBH Otomatis
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  autoRefresh 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Live Polling 4s' : 'Polling Jeda'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <Plus className="h-4 w-4" />
                Injeksi Aturan BGP Flowspec
              </button>
            </div>
          </div>

          {/* 4 Carrier-Grade KPI Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Total Throughput Aliran</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{stats.totalBandwidthGbps}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Gbps</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Peak: {stats.peakBandwidthGbps} Gbps</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Packet Processing Rate</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-purple-600 dark:text-purple-400">{(stats.totalPps / 1000000).toFixed(2)}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Mpps</span>
              </div>
              <div className="mt-1 text-[11px] text-[var(--app-text-muted)]">{stats.flowRateKfps} kflows / detik</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Sesi Aliran Aktif</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{stats.activeFlowsCount.toLocaleString()}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">flows</span>
              </div>
              <div className="mt-1 text-[11px] text-blue-500 font-medium">Full Conntrack Hash</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Serangan Dicegah Hari Ini</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{stats.totalAttacksBlockedToday}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">insiden</span>
              </div>
              <div className="mt-1 text-[11px] text-rose-500 font-medium">{stats.flowspecRulesActive} Aturan BGP Aktif</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--app-border)] gap-2">
          <button
            onClick={() => setActiveTab('flows')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-t-lg ${
              activeTab === 'flows'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Activity className="h-4 w-4" />
            Live Flow Stream ({flows.length})
          </button>

          <button
            onClick={() => setActiveTab('ddos')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-t-lg ${
              activeTab === 'ddos'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Flame className="h-4 w-4" />
            Radar Deteksi DDoS ({ddosAlerts.length})
          </button>

          <button
            onClick={() => setActiveTab('flowspec')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-lg ${
              activeTab === 'flowspec'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Aturan BGP Flowspec ({flowspecRules.length})
          </button>

          <button
            onClick={() => setActiveTab('top-talkers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
              activeTab === 'top-talkers'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Layers className="h-4 w-4" />
            Top Talkers & ASN
          </button>
        </div>

        {/* TAB 1: Live Flow Stream */}
        {activeTab === 'flows' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">Sampling Aliran Paket (NetFlow v9 / IPFIX)</h3>
                <p className="text-xs text-[var(--app-text-muted)]">Sampling frekuensi 1:1000 dari antarmuka Core Router BGP-01</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Ingest
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-semibold">
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Source IP & Port</th>
                    <th className="py-2.5 px-3">Destination IP & Port</th>
                    <th className="py-2.5 px-3">Proto</th>
                    <th className="py-2.5 px-3">Aplikasi / Flags</th>
                    <th className="py-2.5 px-3">ASN Asal</th>
                    <th className="py-2.5 px-3 text-right">Throughput</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {flows.map((flow) => (
                    <tr key={flow.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                      <td className="py-2.5 px-3 text-[var(--app-text-muted)] font-mono">
                        {new Date(flow.timestamp).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-[var(--app-text)]">
                        {flow.srcIp}:{flow.srcPort}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {flow.dstIp}:{flow.dstPort}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          flow.protocol === 'TCP' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                          flow.protocol === 'UDP' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                          'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}>
                          {flow.protocol}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[var(--app-text)]">
                        <span className="font-semibold">{flow.application}</span>
                        {flow.tcpFlags && (
                          <span className="ml-1.5 text-[10px] text-[var(--app-text-muted)] font-mono">[{flow.tcpFlags}]</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[var(--app-text-muted)]">
                        {flow.srcAsn}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[var(--app-text)]">
                        {flow.bandwidthMbps} Mbps
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Radar Deteksi DDoS */}
        {activeTab === 'ddos' && (
          <div className="space-y-4">
            {ddosAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                      <Flame className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-rose-600 dark:text-rose-400 tracking-tight">
                          {alert.attackType.replace('_', ' ')} TERDETEKSI
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--app-text-muted)] font-mono">
                        Target IP: <strong className="text-[var(--app-text)]">{alert.targetIp}</strong> • Terdeteksi: {new Date(alert.detectedAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-lg font-black text-rose-600 dark:text-rose-400">{alert.volumeGbps} Gbps</div>
                      <div className="text-[11px] text-[var(--app-text-muted)] font-mono">{(alert.packetsPerSec / 1000).toFixed(0)} kpps</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-3.5 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--app-text-muted)] font-medium">Metode Mitigasi Aktif:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{alert.mitigationMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-text-muted)] font-medium">Aturan Discard BGP:</span>
                    <code className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{alert.flowspecRule}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--app-text-muted)] font-medium">Negara Sumber Botnet:</span>
                    <div className="flex gap-1">
                      {alert.sourceCountries.map(c => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-[var(--app-card-subtle)] font-mono text-[10px] border border-[var(--app-border)]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Aturan BGP Flowspec */}
        {activeTab === 'flowspec' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">Tabel Aturan BGP Flowspec Aktif</h3>
                <p className="text-xs text-[var(--app-text-muted)]">Aturan filter terpasang langsung pada tabel BGP Core MikroTik CCR2004</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Aturan Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-semibold">
                    <th className="py-2.5 px-3">Target Prefix</th>
                    <th className="py-2.5 px-3">Tindakan Mitigasi</th>
                    <th className="py-2.5 px-3">Protokol & Port</th>
                    <th className="py-2.5 px-3">Router Core</th>
                    <th className="py-2.5 px-3">Waktu Injeksi</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {flowspecRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[var(--app-text)]">
                        {rule.prefix}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rule.action === 'DISCARD' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {rule.action} {rule.rateLimitMbps ? `(${rule.rateLimitMbps} Mbps)` : ''}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[var(--app-text-muted)]">
                        {rule.protocol || 'ALL'}:{rule.dstPort || 'ANY'}
                      </td>
                      <td className="py-2.5 px-3 text-[var(--app-text)] font-medium">
                        {rule.routerNode}
                      </td>
                      <td className="py-2.5 px-3 text-[var(--app-text-muted)]">
                        {new Date(rule.injectedAt).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {rule.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleWithdrawRule(rule.id, rule.prefix)}
                            className="text-xs text-rose-500 hover:text-rose-600 font-semibold inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Cabut
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Top Talkers */}
        {activeTab === 'top-talkers' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--app-text)] mb-4">Peringkat Konsumen Trafik Terbesar (Top Talkers)</h3>
            <div className="space-y-3">
              {topTalkers.map((talker) => (
                <div key={talker.rank} className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 text-xs font-black">
                        #{talker.rank}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-[var(--app-text)]">{talker.name}</div>
                        <div className="font-mono text-xs text-[var(--app-text-muted)]">{talker.ip} • {talker.asn}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-cyan-600 dark:text-cyan-400">{talker.trafficGb} GB</div>
                      <div className="text-xs text-[var(--app-text-muted)] font-semibold">{talker.sharePct}% dari Total Trafik</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" 
                      style={{ width: `${talker.sharePct * 3}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Injeksi Flowspec Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-base font-black text-[var(--app-text)] flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-cyan-500" />
                  Injeksi BGP Flowspec Baru
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  aria-label="Tutup modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[var(--app-text)] mb-1">Target Prefix / Subnet IP</label>
                  <input
                    type="text"
                    value={targetPrefix}
                    onChange={(e) => setTargetPrefix(e.target.value)}
                    placeholder="Contoh: 103.189.20.45/32"
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs font-mono font-bold text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Tindakan</label>
                    <select
                      value={actionType}
                      onChange={(e: any) => setActionType(e.target.value)}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-2.5 py-2 text-xs text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      <option value="DISCARD">DISCARD (Drop Paket)</option>
                      <option value="RATE_LIMIT">RATE LIMIT (Batasi Throughput)</option>
                      <option value="REDIRECT_SCRUBBING">REDIRECT SCRUBBING</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Protokol</label>
                    <select
                      value={targetProtocol}
                      onChange={(e) => setTargetProtocol(e.target.value)}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-2.5 py-2 text-xs text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      <option value="ALL">Semua Protokol</option>
                      <option value="UDP">UDP (DNS/NTP Amp)</option>
                      <option value="TCP">TCP (SYN Flood)</option>
                      <option value="ICMP">ICMP (Ping Flood)</option>
                    </select>
                  </div>
                </div>

                {actionType === 'RATE_LIMIT' && (
                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Batas Maksimal Throughput (Mbps)</label>
                    <input
                      type="number"
                      value={rateLimitMbps}
                      onChange={(e) => setRateLimitMbps(Number(e.target.value))}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs font-bold text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[var(--app-text)] mb-1">Destination Port (Opsional)</label>
                  <input
                    type="number"
                    value={targetPort}
                    onChange={(e) => setTargetPort(Number(e.target.value))}
                    placeholder="Contoh: 53 (DNS), 80, 443"
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs font-bold text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[var(--app-border)] pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleApplyFlowspec}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {submitting ? 'Menginjeksi...' : 'Injeksi ke Router MikroTik BGP'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
