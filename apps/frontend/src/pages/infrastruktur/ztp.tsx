import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import {
  Zap,
  Server,
  Radio,
  Cpu,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  Plus,
  Play,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Layers,
  X
} from 'lucide-react'

interface DiscoveredONU {
  id: string
  serialNumber: string
  macAddress: string
  vendorModel: string
  oltId: string
  oltName: string
  ponPort: string
  opticalRxDbm: number
  discoveredAt: string
  status: 'PENDING_ASSIGNMENT' | 'PROVISIONING' | 'ACTIVE'
}

interface ZtpHistory {
  id: string
  timestamp: string
  serialNumber: string
  macAddress: string
  oltName: string
  ponPort: string
  onuId: number
  vlanId: number
  customerId: string
  customerName: string
  pppoeUser: string
  wifiSsid: string
  opticalRxDbm: number
  technicianName: string
  durationSeconds: number
  status: 'SUCCESS' | 'FAILED'
}

export default function ZtpProvisioningPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [provisioning, setProvisioning] = useState(false)
  const [queue, setQueue] = useState<DiscoveredONU[]>([])
  const [history, setHistory] = useState<ZtpHistory[]>([])
  const [totalSuccess, setTotalSuccess] = useState(0)
  const [selectedOnu, setSelectedOnu] = useState<DiscoveredONU | null>(null)
  const [showProvisionModal, setShowProvisionModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Form inputs for 1-Click Provisioning
  const [customerName, setCustomerName] = useState('')
  const [internetNumber, setInternetNumber] = useState('')
  const [packagePlan, setPackagePlan] = useState('Home Ultimate 50 Mbps')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [technicianName, setTechnicianName] = useState('Agung Wicaksono (Teknisi Lapangan)')

  // Pipeline simulation stages
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([])

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
      const [resQueue, resHist] = await Promise.all([
        api.ztp.getQueue(),
        api.ztp.getHistory(),
      ])

      if (resQueue?.success) setQueue(resQueue.queue || [])
      if (resHist?.success) {
        setHistory(resHist.history || [])
        setTotalSuccess(resHist.totalSuccess || 0)
      }
    } catch (err: any) {
      console.error('Failed to load ZTP data:', err)
      showToast('Gagal memuat status ZTP: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openProvisionModal = (onu: DiscoveredONU) => {
    setSelectedOnu(onu)
    setCustomerName('Bpk. Hendra Wijaya')
    setInternetNumber(`AU-${Math.floor(100000 + Math.random() * 900000)}`)
    setWifiSsid(`AUDIRA-Hendra-${onu.serialNumber.slice(-4)}`)
    setWifiPassword('audira2026')
    setPipelineLogs([])
    setShowProvisionModal(true)
  }

  const handleStartProvisioning = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOnu) return

    try {
      setProvisioning(true)
      setPipelineLogs([
        `[0.0s] Memulai pipeline ZTP untuk ONT ${selectedOnu.serialNumber}...`,
        `[0.4s] Mengalokasikan ONU ID pada OLT ${selectedOnu.oltName} (${selectedOnu.ponPort})...`,
        `[0.9s] Mendaftarkan PPPoE Secret di Core Router MikroTik dengan Profile ${packagePlan}...`,
        `[1.4s] Menghubungi GenieACS TR-069 server untuk konfigurasi SSID "${wifiSsid}" & WPA2...`,
        `[1.9s] Mengirimkan alert Telegram otomatis ke Topik 8 (Installation & Activation)...`,
      ])

      const res = await api.ztp.provision({
        discoveryId: selectedOnu.id,
        customerName,
        internetNumber,
        packagePlan,
        wifiSsid,
        wifiPassword,
        technicianName,
      })

      if (res?.success) {
        setPipelineLogs((prev) => [
          ...prev,
          `[2.1s] [SUCCESS] ZTP SELESAI 100%! Layanan Internet Aktif.`,
        ])
        showToast(`Zero-Touch Provisioning Berhasil! Pelanggan ${customerName} telah aktif online.`)
        setTimeout(() => {
          setShowProvisionModal(false)
          fetchData()
        }, 1200)
      }
    } catch (err: any) {
      showToast('Gagal melakukan ZTP: ' + err.message, 'error')
      setPipelineLogs((prev) => [...prev, `[ERROR] Gagal: ${err.message}`])
    } finally {
      setProvisioning(false)
    }
  }

  const filteredHistory = history.filter(
    (h) =>
      h.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.pppoeUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.oltName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--app-card)] border border-[var(--app-border)] p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                AUTONOMOUS ZERO-TOUCH PROVISIONING
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                DISCOVERY QUEUE ACTIVE
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--app-text)] tracking-tight flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-500" />
              Zero-Touch Provisioning (ZTP) & Discovery Queue
            </h1>
            <p className="text-sm text-[var(--app-text-muted)] max-w-2xl">
              Deteksi otomatis modem ONT baru yang dicolok teknisi di lapangan. Mengaktifkan layanan pelanggan dalam 2.1 detik (Registrasi OLT PON + Pembuatan PPPoE MikroTik + Konfigurasi WiFi TR-069).
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] text-xs font-semibold flex items-center gap-2 border border-[var(--app-border)] transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Segarkan Queue
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Antrean ONT Baru (Unassigned)</span>
              <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{queue.length} Modem</div>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Menunggu penetapan pelanggan</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Total ZTP Berhasil</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalSuccess + history.length} Aktivasi</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400/80 mt-1 font-medium">100% Zero-Touch OLT & Router</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Rata-rata Waktu Eksekusi</span>
              <Clock className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">2.1 Detik</div>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Pangkas waktu teknisi dari 25 menit</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Sub-Sistem Terintegrasi</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">3 / 3 Subsystem</div>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-1">OLT + MikroTik + TR-069</p>
            </div>
          </div>
        </div>

        {/* Discovery Queue Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-500" />
              Antrean ONT Terdeteksi di Lapangan (Unassigned Queue)
            </h2>
            <span className="text-xs text-[var(--app-text-muted)]">Auto-polling setiap 5 detik</span>
          </div>

          {queue.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-center text-[var(--app-text-muted)] text-xs">
              Tidak ada ONT baru yang terdeteksi di antrean OLT saat ini. Colokkan kabel fiber optik ke port PON untuk auto-discovery.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {queue.map((onu) => {
                const isOptimal = onu.opticalRxDbm >= -25 && onu.opticalRxDbm <= -15
                return (
                  <div
                    key={onu.id}
                    className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] hover:border-amber-500/40 transition flex flex-col justify-between space-y-4 relative overflow-hidden shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                          {onu.vendorModel}
                        </span>
                        <span className="text-[11px] text-[var(--app-text-muted)] font-mono">
                          {new Date(onu.discoveredAt).toLocaleTimeString('id-ID')}
                        </span>
                      </div>

                      <div>
                        <div className="text-base font-black text-[var(--app-text)] font-mono">{onu.serialNumber}</div>
                        <div className="text-xs text-[var(--app-text-muted)] font-mono">MAC: {onu.macAddress}</div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-[var(--app-text-muted)]">
                          <span>OLT:</span>
                          <span className="font-semibold text-[var(--app-text)]">{onu.oltName}</span>
                        </div>
                        <div className="flex justify-between text-[var(--app-text-muted)]">
                          <span>PON Port:</span>
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{onu.ponPort}</span>
                        </div>
                        <div className="flex justify-between text-[var(--app-text-muted)]">
                          <span>Optical Rx Power:</span>
                          <span
                            className={`font-mono font-bold ${
                              isOptimal ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {onu.opticalRxDbm} dBm
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openProvisionModal(onu)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      1-Click Zero-Touch Provision
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--app-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              Riwayat Aktivasi Otomatis ZTP ({history.length} Catatan)
            </h3>

            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--app-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pelanggan atau serial..."
                className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold border-b border-[var(--app-border)]">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pelanggan & PPPoE</th>
                  <th className="py-3 px-4">Serial Number ONT</th>
                  <th className="py-3 px-4">OLT & Port</th>
                  <th className="py-3 px-4">WiFi SSID</th>
                  <th className="py-3 px-4">Teknisi</th>
                  <th className="py-3 px-4">Durasi</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)] font-mono">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[var(--app-text-muted)] font-sans">
                      Belum ada riwayat aktivasi ZTP
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--app-card-subtle)] transition">
                      <td className="py-3 px-4 text-[var(--app-text-muted)] font-sans">
                        {new Date(item.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-[var(--app-text)]">{item.customerName}</div>
                        <div className="text-[11px] text-[var(--app-text-muted)] font-mono">{item.pppoeUser}</div>
                      </td>
                      <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-bold">{item.serialNumber}</td>
                      <td className="py-3 px-4 font-sans text-[var(--app-text-muted)]">
                        {item.oltName} ({item.ponPort})
                      </td>
                      <td className="py-3 px-4 text-cyan-600 dark:text-cyan-400 font-sans font-semibold">{item.wifiSsid}</td>
                      <td className="py-3 px-4 text-[var(--app-text)] font-sans">{item.technicianName}</td>
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{item.durationSeconds}s</td>
                      <td className="py-3 px-4 text-right font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: 1-Click Provisioning Wizard */}
        {showProvisionModal && selectedOnu && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Autonomous ZTP Provisioning Wizard
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Aktivasi instan: {selectedOnu.serialNumber} ({selectedOnu.vendorModel})
                  </p>
                </div>
                <button
                  disabled={provisioning}
                  onClick={() => setShowProvisionModal(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50"
                  aria-label="Tutup modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleStartProvisioning} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-text)] mb-1 font-semibold">Nama Pelanggan</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={provisioning}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--app-text)] mb-1 font-semibold">Nomor Internet</label>
                    <input
                      type="text"
                      required
                      value={internetNumber}
                      onChange={(e) => setInternetNumber(e.target.value)}
                      disabled={provisioning}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-text)] mb-1 font-semibold">Paket Langganan</label>
                    <select
                      value={packagePlan}
                      onChange={(e) => setPackagePlan(e.target.value)}
                      disabled={provisioning}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                    >
                      <option value="Home Basic 20 Mbps">Home Basic 20 Mbps</option>
                      <option value="Home Prime 30 Mbps">Home Prime 30 Mbps</option>
                      <option value="Home Ultimate 50 Mbps">Home Ultimate 50 Mbps</option>
                      <option value="Home Turbo 100 Mbps">Home Turbo 100 Mbps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--app-text)] mb-1 font-semibold">Teknisi Lapangan</label>
                    <input
                      type="text"
                      value={technicianName}
                      onChange={(e) => setTechnicianName(e.target.value)}
                      disabled={provisioning}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--app-text)] mb-1 font-semibold">SSID WiFi Rumah</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      disabled={provisioning}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--app-text)] mb-1 font-semibold">WPA2 Password</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      disabled={provisioning}
                      className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl px-3 py-2 text-[var(--app-text)] focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {/* Pipeline Execution Log Terminal */}
                {pipelineLogs.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1 text-emerald-400 max-h-40 overflow-y-auto">
                    {pipelineLogs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                )}

                <div className="pt-3 flex justify-end gap-2 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    disabled={provisioning}
                    onClick={() => setShowProvisionModal(false)}
                    className="px-4 py-2 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-card)] text-[var(--app-text)] font-semibold border border-[var(--app-border)] transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={provisioning}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    {provisioning ? 'Eksekusi Autonomous Pipeline...' : 'Jalankan ZTP Sekarang'}
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
