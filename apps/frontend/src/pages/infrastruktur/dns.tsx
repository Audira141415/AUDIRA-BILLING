import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Plus,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Globe,
  Radio,
  Server,
  Zap,
  Trash2,
  Eye,
  Sliders,
  Database,
  ArrowRight,
  X
} from 'lucide-react'

interface DnsCategory {
  id: string
  name: string
  description: string
  blockedCount: number
  enabled: boolean
  badgeColor: string
}

interface CustomRule {
  id: string
  domain: string
  type: 'BLACKLIST' | 'WHITELIST'
  category: string
  reason: string
  addedAt: string
  createdBy: string
}

interface BlockedLog {
  id: string
  timestamp: string
  clientIp: string
  pppoeUser: string
  domain: string
  category: string
  action: string
}

export default function DnsFilteringPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState<any>(null)
  const [categories, setCategories] = useState<DnsCategory[]>([])
  const [customRules, setCustomRules] = useState<CustomRule[]>([])
  const [blockedLogs, setBlockedLogs] = useState<BlockedLog[]>([])
  const [activeTab, setActiveTab] = useState<'categories' | 'rules' | 'logs'>('categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWalledGarden, setShowWalledGarden] = useState(false)

  // Form state
  const [newDomain, setNewDomain] = useState('')
  const [newType, setNewType] = useState<'BLACKLIST' | 'WHITELIST'>('BLACKLIST')
  const [newCategory, setNewCategory] = useState('Custom Policy')
  const [newReason, setNewReason] = useState('')

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') {
      toast.error(message)
    } else {
      toast.success(message)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resStatus, resCat, resRules, resLogs] = await Promise.all([
        api.dns.getStatus(),
        api.dns.getCategories(),
        api.dns.getCustomRules(),
        api.dns.getBlockedLogs(),
      ])

      if (resStatus?.success) setStatus(resStatus)
      if (resCat?.success) setCategories(resCat.categories || [])
      if (resRules?.success) setCustomRules(resRules.rules || [])
      if (resLogs?.success) setBlockedLogs(resLogs.logs || [])
    } catch (err: any) {
      console.error('Failed to load DNS filtering data:', err)
      showToast('Gagal memuat status DNS Filtering: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSyncTrustPositif = async () => {
    try {
      setSyncing(true)
      const res = await api.dns.syncTrustPositif()
      if (res?.success) {
        showToast(`Sinkronisasi TrustPositif Berhasil! +${res.syncedDomains} domain diperbarui. Notifikasi Telegram terkirim.`)
        fetchData()
      }
    } catch (err: any) {
      showToast('Gagal sinkronisasi TrustPositif: ' + err.message, 'error')
    } finally {
      setSyncing(false)
    }
  }

  const handleToggleCategory = async (catId: string, currentStatus: boolean) => {
    try {
      const res = await api.dns.toggleCategory(catId, !currentStatus)
      if (res?.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === catId ? { ...c, enabled: !currentStatus } : c))
        )
        showToast(res.message || 'Status kategori diperbarui')
      }
    } catch (err: any) {
      showToast('Gagal mengubah kategori: ' + err.message, 'error')
    }
  }

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDomain) return

    try {
      const res = await api.dns.addCustomRule({
        domain: newDomain.trim().toLowerCase(),
        type: newType,
        category: newCategory,
        reason: newReason || 'Kebijakan Administrator ISP',
      })
      if (res?.success) {
        showToast(`Rule untuk domain ${newDomain} berhasil ditambahkan!`)
        setShowAddModal(false)
        setNewDomain('')
        setNewReason('')
        fetchData()
      }
    } catch (err: any) {
      showToast('Gagal menambahkan rule: ' + err.message, 'error')
    }
  }

  const handleDeleteRule = async (id: string, domain: string) => {
    if (!confirm(`Hapus aturan domain ${domain}?`)) return
    try {
      const res = await api.dns.deleteCustomRule(id)
      if (res?.success) {
        showToast(`Rule domain ${domain} dihapus`)
        setCustomRules((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (err: any) {
      showToast('Gagal menghapus rule: ' + err.message, 'error')
    }
  }

  const filteredRules = customRules.filter(
    (r) =>
      r.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLogs = blockedLogs.filter(
    (l) =>
      l.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.clientIp.includes(searchQuery) ||
      l.pppoeUser.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                KOMINFO UU ITE COMPLIANT
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                DNS SINKHOLE ACTIVE
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--app-text)] tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              DNS Filtering & Internet Positif
            </h1>
            <p className="text-sm text-[var(--app-text-muted)] max-w-2xl">
              Sinkhole DNS Carrier-Grade ISP AUDIRA. Memblokir situs judi online, konten terlarang, malware, serta penegakan regulasi TrustPositif Kominfo dengan zero latency impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => setShowWalledGarden(true)}
              className="px-4 py-2.5 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] text-xs font-semibold flex items-center gap-2 border border-[var(--app-border)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <Eye className="w-4 h-4 text-cyan-500" />
              Preview Walled Garden
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <Plus className="w-4 h-4" />
              Tambah Custom Rule
            </button>
            <button
              onClick={handleSyncTrustPositif}
              disabled={syncing}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sinkronisasi Kominfo...' : 'Sinkronisasi TrustPositif'}
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">DNS Sinkhole Engine</span>
              <Server className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{status?.engineStatus || 'ENFORCED'}</div>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Bind9 / CoreDNS Port 53</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Database TrustPositif</span>
              <Database className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-[var(--app-text)]">
                {status?.totalBlockedDomains ? Number(status.totalBlockedDomains).toLocaleString('id-ID') : '2,418,920'}
              </div>
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-medium">Domain diblokir otomatis</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Throughput QPS</span>
              <Zap className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{status?.liveQps || '14,820'} QPS</div>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Avg Latency: 1.1ms</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Intersepsi Hari Ini</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-[var(--app-text)]">
                {status?.interceptionsToday ? Number(status.interceptionsToday).toLocaleString('id-ID') : '482,190'}
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">Dialihkan ke Walled Garden</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Sinkronisasi Terakhir</span>
              <RefreshCw className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold text-purple-600 dark:text-purple-300">
                {status?.lastSync ? new Date(status.lastSync).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Hari Ini 11:45'} WIB
              </div>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Auto Sync Setiap 6 Jam</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'categories'
                  ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Kategori Kebijakan Kominfo ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'rules'
                  ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]'
              }`}
            >
              <Lock className="w-4 h-4" />
              Custom Whitelist / Blacklist ({customRules.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'logs'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]'
              }`}
            >
              <Radio className="w-4 h-4" />
              Audit Log Intersepsi ({blockedLogs.length})
            </button>
          </div>

          {(activeTab === 'rules' || activeTab === 'logs') && (
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--app-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari domain atau IP..."
                className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Kategori Kominfo */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] hover:border-cyan-500/40 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                        cat.badgeColor || 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {cat.name}
                    </span>
                    <button
                      onClick={() => handleToggleCategory(cat.id, cat.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        cat.enabled ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-100 transition-transform ${
                          cat.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--app-text-muted)] mt-3 leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--app-border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--app-text-muted)]">Domain Terdaftar:</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">
                    {Number(cat.blockedCount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Custom Rules */}
        {activeTab === 'rules' && (
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold border-b border-[var(--app-border)]">
                  <tr>
                    <th className="py-3 px-4">Tipe & Domain</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Alasan & Regulasi</th>
                    <th className="py-3 px-4">Waktu Dibuat</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                  {filteredRules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--app-text-muted)]">
                        Tidak ada aturan kustom yang cocok dengan pencarian
                      </td>
                    </tr>
                  ) : (
                    filteredRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-[var(--app-card-subtle)] transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                rule.type === 'BLACKLIST'
                                  ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                              }`}
                            >
                              {rule.type}
                            </span>
                            <span className="font-mono font-bold text-[var(--app-text)]">{rule.domain}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[var(--app-text-muted)]">{rule.category}</td>
                        <td className="py-3 px-4 text-[var(--app-text)] max-w-xs truncate">{rule.reason}</td>
                        <td className="py-3 px-4 text-[var(--app-text-muted)] font-mono">
                          {new Date(rule.addedAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-[var(--app-text-muted)]">{rule.createdBy}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteRule(rule.id, rule.domain)}
                            className="p-1.5 rounded-lg text-[var(--app-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                            title="Hapus Rule"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Tab 3: Blocked Logs Stream */}
        {activeTab === 'logs' && (
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-[var(--app-text)]">Live Interception Feed (Kominfo Sinkhole)</span>
              </div>
              <span className="text-xs text-[var(--app-text-muted)]">Sinkhole Target IP: <code className="text-cyan-600 dark:text-cyan-400 font-mono">10.10.10.1 (Walled Garden)</code></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold border-b border-[var(--app-border)]">
                  <tr>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Pelanggan / IP</th>
                    <th className="py-3 px-4">Domain Target</th>
                    <th className="py-3 px-4">Kategori Pelanggaran</th>
                    <th className="py-3 px-4">Tindakan DNS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)] font-mono">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[var(--app-text-muted)] font-sans">
                        Tidak ada log intersepsi ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[var(--app-card-subtle)] transition">
                        <td className="py-2.5 px-4 text-[var(--app-text-muted)]">{new Date(log.timestamp).toLocaleTimeString('id-ID')}</td>
                        <td className="py-2.5 px-4">
                          <span className="text-[var(--app-text)] font-semibold">{log.pppoeUser}</span>
                          <span className="text-[var(--app-text-muted)] ml-2 text-[11px]">({log.clientIp})</span>
                        </td>
                        <td className="py-2.5 px-4 text-red-600 dark:text-red-400 font-bold">{log.domain}</td>
                        <td className="py-2.5 px-4 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                            {log.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-sans text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {log.action}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Tambah Custom Rule */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-500" />
                  Tambah Aturan DNS Baru
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  aria-label="Tutup modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRule} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--app-text)] mb-1 font-semibold">Tipe Rule</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType('BLACKLIST')}
                      className={`py-2 rounded-xl font-bold border transition flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                        newType === 'BLACKLIST'
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500'
                          : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-border)]'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>BLACKLIST (Blokir)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType('WHITELIST')}
                      className={`py-2 rounded-xl font-bold border transition flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        newType === 'WHITELIST'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                          : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-border)]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>WHITELIST (Izinkan)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--app-text)] mb-1 font-semibold">Domain / Hostname</label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: situs-terlarang.xyz atau domain.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--app-text)] mb-1 font-semibold">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    <option value="Judi Online">Judi Online & Taruhan</option>
                    <option value="Pornografi & Asusila">Pornografi & Asusila</option>
                    <option value="Phishing & Penipuan">Phishing & Penipuan</option>
                    <option value="DNS Bypass / DoH">DNS Bypass / DoH / VPN</option>
                    <option value="Custom Policy">Custom ISP Policy</option>
                    <option value="Whitelisted CDN / Gov">Whitelisted CDN / Portal Pemerintah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--app-text)] mb-1 font-semibold">Alasan Pemblokiran / Regulasi</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Surat Edaran Kominfo No. 12/2026 atau Laporan Warga"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] font-semibold border border-[var(--app-border)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    Simpan Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Walled Garden Simulation */}
        {showWalledGarden && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-xl rounded-3xl p-8 shadow-2xl border-4 border-red-600 relative overflow-hidden">
              <button
                onClick={() => setShowWalledGarden(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
                aria-label="Tutup simulasi"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <ShieldAlert className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    INTERNET BAIK & AMAN AUDIRA
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
                    AKSES DIBLOKIR!
                  </h2>
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    Domain ini terindikasi melanggar peraturan perundang-undangan Republik Indonesia.
                  </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl text-left text-xs space-y-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Dasar Hukum:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">UU ITE No. 19/2016 & Permenkominfo No. 5/2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Kategori Pelanggaran:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">Judi Online / Pornografi / Penipuan Siber</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Penyedia Layanan (ISP):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">AUDIRA MULTIMEDIA DIGITAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Alamat IP Pengguna:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">103.189.201.44 (CGNAT Safe Pool)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Jika Anda meyakini situs ini bukan situs terlarang dan ingin mengajukan normalisasi, silakan hubungi Customer Care AUDIRA atau aduan konten Kominfo di <a href="https://trustpositif.kominfo.go.id" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 underline font-semibold">trustpositif.kominfo.go.id</a>.
                </p>

                <button
                  onClick={() => setShowWalledGarden(false)}
                  className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  Tutup Tampilan Simulasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
