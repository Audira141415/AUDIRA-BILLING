import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/router'
import {
  Server,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  RefreshCcw,
  Wrench,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Radio,
  Network,
  Cpu,
  ArrowUpRight,
} from 'lucide-react'

export default function NOCDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const roleUpper = (user?.role || '').toUpperCase();
    if (user && roleUpper !== 'NOC' && roleUpper !== 'TECHNICIAN' && roleUpper !== 'ADMIN' && roleUpper !== 'OWNER' && roleUpper !== 'SUPERADMIN') {
      router.push('/dashboard/billing')
    }
  }, [user, router])

  const [stats] = useState({
    network: {
      status: 'ONLINE',
      uptime: '99.94%',
      totalDevices: 24,
      activeDevices: 23,
    },
    mikrotik: {
      total: 8,
      online: 7,
      offline: 1,
    },
    ont: {
      total: 156,
      online: 144,
      offline: 12,
    },
    tickets: {
      total: 28,
      open: 6,
      inProgress: 10,
      closed: 12,
    },
    bandwidth: {
      total: '10 Gbps',
      used: '4.82 Gbps',
      p95: '4.15 Gbps',
      percentage: 48,
    },
  })

  const [opticalAlerts, setOpticalAlerts] = useState([
    {
      id: 'ONT-ALERT-01',
      customerName: 'Ahmad Hidayat',
      inetNumber: 'INET-2026-0042',
      phone: '0812-3456-7890',
      ontSerial: 'ZTEGCA49D812',
      odpLocation: 'ODP-BTM-03 Port 4',
      cluster: 'Cluster Batam Centre',
      rxPower: -28.45,
      txPower: 2.1,
      threshold: -27.0,
      severity: 'CRITICAL',
      aiDiagnostic:
        'Dropcore fiber tertekuk tajam (macro-bending) atau konektor SC/UPC kotor di adaptor ODP. Degradasi redaman > 3.2 dBm dalam 2 jam terakhir.',
      lastPolled: '1 menit yang lalu via GenieACS TR-069',
      ticketCreated: false,
    },
    {
      id: 'ONT-ALERT-02',
      customerName: 'PT Bintang Mandiri Perkasa',
      inetNumber: 'CORP-2026-0019',
      phone: '0811-9876-5432',
      ontSerial: 'HWTC8812A904',
      odpLocation: 'ODP-SKP-08 Port 2',
      cluster: 'Cluster Sekupang',
      rxPower: -27.6,
      txPower: 2.35,
      threshold: -27.0,
      severity: 'WARNING',
      aiDiagnostic:
        'Splice core loss tinggi pada joint closure pasca pekerjaan drainase jalan di dekat Tiang T-04.',
      lastPolled: '4 menit yang lalu via GenieACS TR-069',
      ticketCreated: false,
    },
  ])

  const [queryingOnt, setQueryingOnt] = useState<string | null>(null)

  const handleCreateWorkOrder = (alertId: string, customerName: string) => {
    setOpticalAlerts((prev) =>
      prev.map((item) => (item.id === alertId ? { ...item, ticketCreated: true } : item))
    )
    toast.success(
      `SPK Teknisi Lapangan diterbitkan untuk perbaikan redaman optik ${customerName}! Notifikasi dikirim ke tim patroli.`
    )
  }

  const handleQueryOntLive = (alertId: string, ontSerial: string) => {
    setQueryingOnt(alertId)
    setTimeout(() => {
      setQueryingOnt(null)
      toast.info(`Polling TR-069 selesai untuk ONT ${ontSerial}. Parameter Rx/Tx dBm terverifikasi.`)
    }, 900)
  }

  return (
    <Layout>
      <Head>
        <title>NOC Engineer Cockpit - AUDIRA NET</title>
      </Head>

      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--app-border)] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
                NOC Engineering Cockpit
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CORE {stats.network.status} • {stats.network.uptime}
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)] mt-1">
              Operator bertugas: <span className="font-semibold text-[var(--app-text)]">{user?.name || 'NOC Engineer'}</span>: Pemantauan BNG MikroTik, OLT GPON, redaman optik TR-069, dan utilisasi uplink.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push('/noc/incidents')}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Mass Outage Broadcast</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/infrastruktur/otdr')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Kalkulator OTDR</span>
            </button>
          </div>
        </div>

        {/* Proactive High Optical Loss Warning Panel */}
        <div className="bg-[var(--app-card)] border border-rose-500/40 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--app-border)]">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold text-[var(--app-text)]">
                    Peringatan Redaman Optik Tinggi (&lt; -27.0 dBm) : {opticalAlerts.length} ONT Kritis
                  </h2>
                  <span className="text-[10px] font-mono bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold px-2 py-0.5 rounded-full uppercase">
                    PROAKTIF TR-069
                  </span>
                </div>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                  GenieACS mendeteksi sinyal optik mendekati ambang LOS (-29 dBm). Terbitkan SPK sebelum pelanggan melapor putus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => router.push('/modem-monitor')}
                className="text-xs font-semibold text-[var(--app-text)] bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Modem Monitor</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              </button>
              <button
                type="button"
                onClick={() => router.push('/infrastruktur/map')}
                className="text-xs font-semibold text-[var(--app-text)] bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Peta GIS ODP</span>
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {opticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--app-text)] text-sm">{alert.customerName}</span>
                        <span className="text-[10px] font-mono bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text-muted)] px-1.5 py-0.5 rounded">
                          {alert.inetNumber}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--app-text-muted)] font-mono mt-0.5">
                        {alert.odpLocation} • {alert.cluster} (SN: {alert.ontSerial})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-lg font-extrabold text-rose-500 font-mono">
                          {alert.rxPower.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-[var(--app-text-muted)] font-mono">dBm</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {alert.severity === 'CRITICAL' ? 'KRITIS (< -28 dBm)' : 'WASPADA (< -27 dBm)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs my-2 flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-[11px] text-amber-600 dark:text-amber-400 mb-0.5">
                        AI Root Cause Suggestion:
                      </strong>
                      <p className="text-[11px] leading-relaxed text-[var(--app-text)]">{alert.aiDiagnostic}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--app-border)] gap-2">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-mono">{alert.lastPolled}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQueryOntLive(alert.id, alert.ontSerial)}
                      disabled={queryingOnt === alert.id}
                      className="px-2.5 py-1.5 text-xs font-medium text-[var(--app-text)] bg-[var(--app-card)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <RefreshCcw
                        className={`w-3.5 h-3.5 ${queryingOnt === alert.id ? 'animate-spin text-blue-500' : ''}`}
                      />
                      <span>{queryingOnt === alert.id ? 'Polling...' : 'Poll TR-069'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCreateWorkOrder(alert.id, alert.customerName)}
                      disabled={alert.ticketCreated}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                        alert.ticketCreated
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      }`}
                    >
                      {alert.ticketCreated ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SPK Diterbitkan</span>
                        </>
                      ) : (
                        <>
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Buat SPK Lapangan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                MikroTik Core &amp; BNG
              </span>
              <Server className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-[var(--app-text)] mb-2">
              {stats.mikrotik.online}/{stats.mikrotik.total}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${(stats.mikrotik.online / stats.mikrotik.total) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[var(--app-text-muted)]">
                {Math.round((stats.mikrotik.online / stats.mikrotik.total) * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                ONT Pelanggan Online
              </span>
              <Wifi className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-[var(--app-text)] mb-2">
              {stats.ont.online}/{stats.ont.total}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(stats.ont.online / stats.ont.total) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[var(--app-text-muted)]">
                {Math.round((stats.ont.online / stats.ont.total) * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Tiket Gangguan SLA
              </span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-amber-500 mb-1">{stats.tickets.open} Open</p>
            <p className="text-xs text-[var(--app-text-muted)] font-mono">
              {stats.tickets.inProgress} In-Progress • {stats.tickets.closed} Closed
            </p>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                Uplink MRTG Utilisasi
              </span>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-[var(--app-text)] mb-1">
              {stats.bandwidth.used}
            </p>
            <p className="text-xs font-mono text-[var(--app-text-muted)]">
              Kap. {stats.bandwidth.total} • 95th: {stats.bandwidth.p95}
            </p>
          </div>
        </div>

        {/* Carrier-Grade NOC Quick Navigation */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[var(--app-text)] mb-4">Modul Teknis NOC &amp; Fiber Optik</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Live MRTG Traffic', href: '/infrastruktur/traffic', icon: Activity, color: 'text-emerald-500' },
              { label: 'ZTP Auto-ONU', href: '/infrastruktur/ztp', icon: Cpu, color: 'text-blue-500' },
              { label: 'IPAM & CGNAT', href: '/infrastruktur/ipam', icon: Server, color: 'text-indigo-500' },
              { label: 'Kalkulator OTDR', href: '/infrastruktur/otdr', icon: Network, color: 'text-amber-500' },
              { label: 'OLT GPON Matrix', href: '/infrastruktur/olt', icon: HardDrive, color: 'text-purple-500' },
              { label: 'Router MikroTik', href: '/mikrotik', icon: Wifi, color: 'text-cyan-500' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="p-3.5 rounded-xl bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] hover:border-blue-500/40 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--app-text-muted)] group-hover:text-[var(--app-text)]" />
                  </div>
                  <p className="text-xs font-bold text-[var(--app-text)]">{item.label}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
