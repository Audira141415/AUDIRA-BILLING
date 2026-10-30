'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@/contexts/ToastContext'
import {
  Activity,
  Server,
  Radio,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Zap,
  Globe,
  Wifi,
  Terminal,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import clsx from 'clsx'

export default function NocDashboardView() {
  const router = useRouter()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshNoc = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast.info('Telemetri core router, OLT, dan throughput BNG berhasil diperbarui.')
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. Header & NOC Identity ────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--app-text)] font-sans">
                NOC Real-Time Command Cockpit
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                BNG Klaster Anycast: HEALTHY
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                FreeRADIUS CoA: ONLINE
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
              Pemantauan backbone BGP, utilisasi uplink MRTG 10Gbps, mitigasi serangan DDoS, dan kesehatan OLT GPON.
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleRefreshNoc}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-[var(--app-text)] border border-[var(--app-border)] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={clsx('w-3.5 h-3.5 text-cyan-500', isRefreshing && 'animate-spin')} />
            <span>Sinkronisasi Live</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/noc/incidents')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pusat Gangguan Massal (Outages)</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Metric KPI Cards (NOC Telemetry) ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Uplink Throughput */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Total Uplink MRTG</span>
            <Activity className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--app-text)]">8.42</span>
            <span className="text-xs text-[var(--app-text-muted)]">/ 10.0 Gbps</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-[var(--app-card-subtle)] rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: '84.2%' }} />
          </div>
          <p className="text-[10px] text-[var(--app-text-dim)] mt-1.5 font-mono">Transit: 4.8G | OpenIXP: 3.6G</p>
        </div>

        {/* KPI 2: PPPoE Sessions */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Sesi PPPoE Aktif</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-500">1.842</span>
            <span className="text-xs text-[var(--app-text-muted)]">Online</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--app-text-muted)] font-mono">
            <span>Flapping: 0 User</span>
            <span className="text-emerald-500">99.98% SLA</span>
          </div>
        </div>

        {/* KPI 3: DDoS Flowspec Status */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>BGP Flowspec Shield</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-500">CLEAN</span>
            <span className="text-xs text-[var(--app-text-muted)]">Trafik Aman</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-dim)] mt-1 font-mono">Mitigasi otomatis: Siaga</p>
        </div>

        {/* KPI 4: Redaman Kritis */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>ONT Redaman Kritis</span>
            <Radio className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-500">3</span>
            <span className="text-xs text-[var(--app-text-muted)]">Unit (&lt; -27 dBm)</span>
          </div>
          <p className="text-[11px] text-rose-500/80 mt-1">Perlu penerbitan SPK kalibrasi</p>
        </div>
      </div>

      {/* ─── 3. Quick Action Hub NOC ─────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">
              Pintasan Cepat Operasional NOC &amp; Jaringan
            </h3>
          </div>
          <span className="text-[11px] text-[var(--app-text-muted)] font-mono">Port 3218 MikroTik REST API</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/infrastruktur/traffic')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4 text-cyan-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Live MRTG Uplink</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Analisis 95th percentile &amp; BGP peering</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/infrastruktur/netflow')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-purple-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">NetFlow DDoS Shield</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Deteksi Top Talkers &amp; Flowspec RTBH</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/infrastruktur/otdr')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 text-emerald-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Waveform .SOR Studio</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Analisis kurva redaman Telcordia</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/infrastruktur/ztp')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-amber-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Zero-Touch Provisioning</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Auto-discovery ONU &amp; aktivasi ZTP</p>
          </button>
        </div>
      </div>

      {/* ─── 4. Router Cluster & Outages Radar Table ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Router Core Nodes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--app-border)]">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-500" />
              <h2 className="text-sm font-bold text-[var(--app-text)]">Klaster BNG &amp; Core Router MikroTik</h2>
            </div>
            <button
              type="button"
              onClick={() => router.push('/mikrotik/cluster')}
              className="text-xs text-[var(--app-primary)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>Kelola Klaster</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Core-01 (CCR2004-1G-12S+2XS)', ip: '10.10.10.1', cpu: '14%', ram: '28%', status: 'ACTIVE', sessions: 640 },
              { name: 'Core-02 (CCR2004-1G-12S+2XS)', ip: '10.10.10.2', cpu: '11%', ram: '24%', status: 'STANDBY', sessions: 580 },
              { name: 'BRAS-East (CCR1072-1G-8S+)', ip: '10.10.20.1', cpu: '22%', ram: '34%', status: 'ACTIVE', sessions: 380 },
              { name: 'BRAS-West (RB4011iGS+RM)', ip: '10.10.30.1', cpu: '18%', ram: '31%', status: 'ACTIVE', sessions: 242 },
            ].map((node) => (
              <div key={node.ip} className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-[var(--app-text)]">{node.name}</p>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-mono">{node.ip} | Sesi: {node.sessions} PPPoE</p>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>CPU: {node.cpu}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Optical Loss Alert List */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--app-border)]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-[var(--app-text)]">Radar Degradasi Optik TR-069</h2>
            </div>
            <button
              type="button"
              onClick={() => router.push('/pelanggan/retensi')}
              className="text-xs text-[var(--app-primary)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>Radar Retensi</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Ibu Ratna Sari', pppoe: 'ratna_net', rx: '-31.2 dBm', odp: 'ODP-NG-03/02', status: 'CRITICAL', est: 'Tekukan Dropcore' },
              { name: 'Bpk. Ahmad Dahlan', pppoe: 'dahlan_fiber', rx: '-28.4 dBm', odp: 'ODP-BC-02/06', status: 'WARNING', est: 'Konektor Kotor' },
              { name: 'CV Mega Mandiri', pppoe: 'megamandiri_dia', rx: '-27.8 dBm', odp: 'ODP-NGY-04/01', status: 'WARNING', est: 'Splice Loss ODC' },
            ].map((cust) => (
              <div key={cust.pppoe} className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-[var(--app-text)]">{cust.name} ({cust.pppoe})</p>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-mono">{cust.odp} • Analisis: {cust.est}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-500 block">{cust.rx}</span>
                  <span className="text-[9px] font-bold text-rose-500 uppercase">{cust.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
