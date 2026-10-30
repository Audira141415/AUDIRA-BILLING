import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Server, 
  Activity, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  ArrowRightLeft, 
  Network, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Check,
  Cpu,
  Layers,
  Globe
} from 'lucide-react'
import { showAudiraToast } from '@/contexts/ToastContext'

interface ClusterNode {
  id: string
  name: string
  role: 'BGP_CORE' | 'BRAS_BNG' | 'DISTRIBUTION'
  ipAddress: string
  model: string
  version: string
  cpuPct: number
  ramPct: number
  uptime: string
  activePppoe: number
  activeHotspot: number
  throughputGbps: number
  status: 'HEALTHY' | 'DEGRADED' | 'STANDBY' | 'DRAINING'
  bgpPeeringStatus: 'ESTABLISHED' | 'IDLE' | 'N/A'
  vrrpRole?: 'MASTER' | 'BACKUP'
}

export default function MikrotikClusterBalancingPage() {
  const [nodes, setNodes] = useState<ClusterNode[]>([
    {
      id: 'node-core-01',
      name: 'AUDIRA-Core-BGP-01',
      role: 'BGP_CORE',
      ipAddress: '10.10.10.1',
      model: 'CCR2004-16G-2S+',
      version: 'RouterOS 7.15.2',
      cpuPct: 28,
      ramPct: 42,
      uptime: '42 hari 14 jam',
      activePppoe: 420,
      activeHotspot: 85,
      throughputGbps: 8.42,
      status: 'HEALTHY',
      bgpPeeringStatus: 'ESTABLISHED',
      vrrpRole: 'MASTER',
    },
    {
      id: 'node-core-02',
      name: 'AUDIRA-Core-BGP-02',
      role: 'BGP_CORE',
      ipAddress: '10.10.10.2',
      model: 'CCR2004-16G-2S+',
      version: 'RouterOS 7.15.2',
      cpuPct: 22,
      ramPct: 38,
      uptime: '38 hari 06 jam',
      activePppoe: 380,
      activeHotspot: 40,
      throughputGbps: 6.18,
      status: 'HEALTHY',
      bgpPeeringStatus: 'ESTABLISHED',
      vrrpRole: 'BACKUP',
    },
    {
      id: 'node-bras-east',
      name: 'AUDIRA-BRAS-East-01',
      role: 'BRAS_BNG',
      ipAddress: '10.10.20.1',
      model: 'CCR1036-8G-2S+',
      version: 'RouterOS 7.14.3',
      cpuPct: 31,
      ramPct: 49,
      uptime: '15 hari 11 jam',
      activePppoe: 390,
      activeHotspot: 110,
      throughputGbps: 2.14,
      status: 'HEALTHY',
      bgpPeeringStatus: 'N/A',
    },
    {
      id: 'node-bras-west',
      name: 'AUDIRA-BRAS-West-02',
      role: 'BRAS_BNG',
      ipAddress: '10.10.30.1',
      model: 'CCR1036-8G-2S+',
      version: 'RouterOS 7.14.3',
      cpuPct: 26,
      ramPct: 44,
      uptime: '19 hari 20 jam',
      activePppoe: 290,
      activeHotspot: 65,
      throughputGbps: 1.68,
      status: 'HEALTHY',
      bgpPeeringStatus: 'N/A',
    },
  ])

  const [isSyncing, setIsSyncing] = useState(false)
  const [autoBalancingEnabled, setAutoBalancingEnabled] = useState(true)
  const [drainingNodeId, setDrainingNodeId] = useState<string | null>(null)

  const totalSessions = nodes.reduce((sum, n) => sum + n.activePppoe + n.activeHotspot, 0)
  const totalThroughput = nodes.reduce((sum, n) => sum + n.throughputGbps, 0)
  const avgCpu = Math.round(nodes.reduce((sum, n) => sum + n.cpuPct, 0) / nodes.length)

  const handleDrainNode = (node: ClusterNode) => {
    if (!confirm(`Mulai proses Session Drain untuk '${node.name}'? Sesi pelanggan akan dimigrasikan secara bertahap via FreeRADIUS CoA ke node sekunder tanpa downtime.`)) return

    setDrainingNodeId(node.id)
    showAudiraToast.info(`Session Drain diinisiasi untuk ${node.name}. Mengirim Disconnect-Request CoA...`, 'Session Drain')

    setTimeout(() => {
      setNodes(prev => prev.map(n => {
        if (n.id === node.id) {
          return { ...n, status: 'DRAINING', activePppoe: 25, activeHotspot: 5 }
        }
        if (n.id === 'node-core-02' && node.id === 'node-core-01') {
          return { ...n, activePppoe: n.activePppoe + 395, activeHotspot: n.activeHotspot + 80 }
        }
        return n
      }))
      setDrainingNodeId(null)
      showAudiraToast.success(`Sesi dari ${node.name} berhasil dialihkan ke node redundan!`, 'Migrasi Tuntas')
    }, 2500)
  }

  const handleSyncCluster = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      showAudiraToast.success('Seluruh PPP Secrets, Address List, & Firewall Mangle berhasil disinkronkan ke 4 router kluster!', 'Kluster Sinkron')
    }, 1500)
  }

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Network className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--app-text)]">
                  Multi-NAS MikroTik Centralized Balancing & Anycast BNG
                </h1>
                <p className="text-xs sm:text-sm text-[var(--app-text-muted)]">
                  Kluster Multi-Router BRAS/BNG Terdistribusi, Redundansi VRRP Anycast, & Otomasi Penyeimbangan Beban Sesi Sempurna
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleSyncCluster}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card)] transition-colors shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Secret Kluster'}
              </button>

              <button
                onClick={() => setAutoBalancingEnabled(!autoBalancingEnabled)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  autoBalancingEnabled 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {autoBalancingEnabled ? 'Auto-Balancing ON' : 'Manual Mode'}
              </button>
            </div>
          </div>

          {/* 4 Carrier-Grade KPI Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Total Node Router Kluster</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{nodes.length}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Unit Core & BRAS</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Online & Terhubung</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Total Sesi Pelanggan Aktif</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{totalSessions.toLocaleString()}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Sesi</span>
              </div>
              <div className="mt-1 text-[11px] text-[var(--app-text-muted)]">{nodes.reduce((s, n) => s + n.activePppoe, 0)} PPPoE • {nodes.reduce((s, n) => s + n.activeHotspot, 0)} Hotspot</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Rata-rata CPU Load Kluster</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-purple-600 dark:text-purple-400">{avgCpu}%</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Optimal</span>
              </div>
              <div className="mt-1 text-[11px] text-purple-500 font-medium">Standar Deviasi 3.2% (Seimbang)</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Agregat Throughput Kluster</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{totalThroughput.toFixed(2)}</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Gbps</span>
              </div>
              <div className="mt-1 text-[11px] text-cyan-500 font-medium">10G SFP+ Trunk Terhubung</div>
            </div>
          </div>
        </div>

        {/* VRRP & Anycast Redundancy Ribbon */}
        <div className="p-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
              VIP
            </span>
            <div>
              <span className="font-bold text-[var(--app-text)]">Virtual IP Gateway (VRRP-100): </span>
              <code className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">103.189.20.1/24</code>
              <span className="ml-2 text-[var(--app-text-muted)]">(Master: Core-01 • Backup: Core-02)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
              VRRP STATE: SYNCHRONIZED
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
              BGP FULL MESH: 4 PEERS
            </span>
          </div>
        </div>

        {/* Cluster Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {nodes.map((node) => (
            <div 
              key={node.id} 
              className={`rounded-2xl border p-5 bg-[var(--app-card)] shadow-sm space-y-4 transition-all ${
                node.status === 'DRAINING' ? 'border-amber-500/50 bg-amber-500/5' : 'border-[var(--app-border)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[var(--app-text)]">{node.name}</h3>
                      {node.vrrpRole && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                          node.vrrpRole === 'MASTER' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-500/20 text-slate-500'
                        }`}>
                          {node.vrrpRole}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[var(--app-text-muted)]">
                      {node.ipAddress} • {node.model} ({node.version})
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  node.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  node.status === 'DRAINING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse' :
                  'bg-rose-500/10 text-rose-600'
                }`}>
                  {node.status}
                </span>
              </div>

              {/* Hardware & Session Gauges */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-medium">CPU Load</span>
                  <div className="font-mono font-bold text-sm text-[var(--app-text)] mt-0.5">{node.cpuPct}%</div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 mt-1 overflow-hidden">
                    <div className={`h-full rounded-full ${node.cpuPct > 70 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${node.cpuPct}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Sesi PPPoE</span>
                  <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">{node.activePppoe}</div>
                  <div className="text-[10px] text-[var(--app-text-muted)] mt-1">+{node.activeHotspot} Hotspot</div>
                </div>

                <div className="p-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                  <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Throughput</span>
                  <div className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400 mt-0.5">{node.throughputGbps}G</div>
                  <div className="text-[10px] text-[var(--app-text-muted)] mt-1">Uptime: {node.uptime.split(' ')[0]} hari</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--app-border)] text-xs">
                <span className="text-[11px] text-[var(--app-text-muted)] font-mono">
                  BGP: <strong>{node.bgpPeeringStatus}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDrainNode(node)}
                    disabled={drainingNodeId === node.id || node.status === 'DRAINING'}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    {node.status === 'DRAINING' ? 'Draining...' : 'Drain & Failover'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Session Distribution Bar */}
        <div className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold text-[var(--app-text)]">Distribusi Alokasi Sesi Pelanggan Antar-Node Kluster</h3>
            <span className="text-[var(--app-text-muted)] font-mono">Total {totalSessions} Sesi Terbuka</span>
          </div>

          <div className="h-3 w-full rounded-full bg-[var(--app-card-subtle)] overflow-hidden flex">
            {nodes.map((n, i) => {
              const pct = totalSessions > 0 ? ((n.activePppoe + n.activeHotspot) / totalSessions) * 100 : 25
              const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500']
              return (
                <div 
                  key={n.id} 
                  className={`h-full ${colors[i % colors.length]} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                  title={`${n.name}: ${Math.round(pct)}%`}
                />
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-[var(--app-text-muted)]">
            {nodes.map((n, i) => {
              const pct = totalSessions > 0 ? Math.round(((n.activePppoe + n.activeHotspot) / totalSessions) * 100) : 25
              const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500']
              return (
                <div key={n.id} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${colors[i % colors.length]}`} />
                  <span>{n.name}: <strong>{pct}%</strong> ({n.activePppoe + n.activeHotspot} sesi)</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </Layout>
  )
}
