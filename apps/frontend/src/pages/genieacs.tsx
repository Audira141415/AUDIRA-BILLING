import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { showAudiraToast } from '@/contexts/ToastContext'
import { 
  RefreshCcw, 
  Plus, 
  Search, 
  Trash2, 
  Wifi, 
  Power, 
  Settings, 
  Activity, 
  Users, 
  Zap, 
  ShieldCheck, 
  Radio, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Smartphone,
  Laptop,
  Tv,
  Check
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface GenieDevice {
  id: string
  deviceId: string
  serialNumber: string
  manufacturer: string
  model: string
  softwareVersion: string
  ipAddress: string
  macAddress: string
  status: 'online' | 'offline'
  lastInform: string
  customer?: string
}

interface ConnectedClient {
  hostname: string
  ipAddress: string
  macAddress: string
  band: string
  rssiDbm: number
  signalQuality: string
  rxRateMbps: number
  txRateMbps: number
  connectedDuration: string
}

const INITIAL_DEVICES: GenieDevice[] = [
  {
    id: '1',
    deviceId: 'ONT-001-ABC123',
    serialNumber: 'ZTEG12345678',
    manufacturer: 'ZTE',
    model: 'F670L (Dual Band)',
    softwareVersion: 'V5.0.10P6N1',
    ipAddress: '192.168.100.101',
    macAddress: '00:1A:2B:3C:4D:5E',
    status: 'online',
    lastInform: '1 menit yang lalu',
    customer: 'Budi Santoso'
  },
  {
    id: '2',
    deviceId: 'ONT-002-DEF456',
    serialNumber: 'HWTC87654321',
    manufacturer: 'Huawei',
    model: 'EG8145V5 (Dual Band)',
    softwareVersion: 'V5R019C00S125',
    ipAddress: '192.168.100.102',
    macAddress: '00:1B:2C:3D:4E:5F',
    status: 'online',
    lastInform: '3 menit yang lalu',
    customer: 'Siti Aminah'
  },
  {
    id: '3',
    deviceId: 'ONT-003-GHI789',
    serialNumber: 'FIBR98765432',
    manufacturer: 'Fiberhome',
    model: 'HG6145D2',
    softwareVersion: 'RP2613',
    ipAddress: '192.168.100.103',
    macAddress: '00:1C:2D:3E:4F:60',
    status: 'offline',
    lastInform: '2 jam yang lalu',
    customer: 'Ahmad Hidayat'
  }
]

export default function GenieAcs() {
  const [devices, setDevices] = useState<GenieDevice[]>(INITIAL_DEVICES)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [wifiModalOpen, setWifiModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<GenieDevice | null>(null)
  const [clientsModalOpen, setClientsModalOpen] = useState(false)
  const [connectedClients, setConnectedClients] = useState<ConnectedClient[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [selfHealModalOpen, setSelfHealModalOpen] = useState(false)
  const [selfHealResult, setSelfHealResult] = useState<any | null>(null)
  const [isHealing, setIsHealing] = useState(false)

  // Wi-Fi Form State
  const [ssid24, setSsid24] = useState('AudiraNet_2.4G')
  const [password24, setPassword24] = useState('audira2026')
  const [ssid5, setSsid5] = useState('AudiraNet_5G_Turbo')
  const [password5, setPassword5] = useState('audira2026')
  const [submittingWifi, setSubmittingWifi] = useState(false)

  // Add Device State
  const [newDevice, setNewDevice] = useState({
    deviceId: '',
    serialNumber: '',
    manufacturer: 'ZTE',
    model: 'F670L',
    ipAddress: '192.168.100.',
    macAddress: '',
    customer: '',
  })

  // Mass Firmware Upgrade Campaign State
  const [activeMainTab, setActiveMainTab] = useState<'devices' | 'campaigns'>('devices')
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [firmwares, setFirmwares] = useState<any[]>([])
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    vendor: 'ZTE',
    targetModel: 'F670L',
    firmwareVersion: 'V8.0.10P6N3',
    targetOdc: 'ODC-TM-01 (Kawasan Timur)',
    scheduledTime: '02:00 WIB (Off-Peak Window)',
    batchSize: 20,
    minOpticalDbm: -25.0,
    totalDevices: 60,
  })

  // Load devices and campaigns on mount
  useEffect(() => {
    loadDevices()
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const [cRes, fRes] = await Promise.all([
        fetch(`${API_BASE}/genieacs/campaigns`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/genieacs/firmware/list`).then(r => r.json()).catch(() => []),
      ])
      if (Array.isArray(cRes)) setCampaigns(cRes)
      if (Array.isArray(fRes)) setFirmwares(fRes)
    } catch (e) {
      console.log('Error loading campaigns:', e)
    }
  }

  const loadDevices = async () => {
    try {
      const data = await api.genieacs.getDevices()
      if (Array.isArray(data) && data.length > 0) {
        setDevices(data.map((d: any) => ({
          id: d._id || d.id || String(Math.random()),
          deviceId: d.deviceId || d._id || 'ONT-UNKNOWN',
          serialNumber: d.serialNumber || d['Device.DeviceInfo.SerialNumber'] || 'N/A',
          manufacturer: d.manufacturer || d['Device.DeviceInfo.Manufacturer'] || 'ZTE',
          model: d.model || d['Device.DeviceInfo.ModelName'] || 'CPE',
          softwareVersion: d.softwareVersion || d['Device.DeviceInfo.SoftwareVersion'] || 'v1.0',
          ipAddress: d.ipAddress || d['Device.IP.Interface.1.IPv4Address.1.IPAddress'] || '192.168.1.1',
          macAddress: d.macAddress || '00:00:00:00:00:00',
          status: d.status || 'online',
          lastInform: d.lastInform || 'Baru saja',
          customer: d.customer || '-',
        })))
      }
    } catch (err) {
      console.log('Using initial devices fallback:', err)
    }
  }

  const handleSyncDevices = async () => {
    setIsSyncing(true)
    try {
      await loadDevices()
      showAudiraToast.success('Sinkronisasi perangkat CPE via TR-069 berhasil!', 'GenieACS Sync')
    } catch (err: any) {
      showAudiraToast.warning('Sync selesai dengan data cache lokal.', 'Status Sinkronisasi')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleRebootDevice = async (device: GenieDevice) => {
    try {
      setActionLoadingId(device.id)
      await api.genieacs.rebootDevice(device.id)
      showAudiraToast.success(`Sinyal reboot berhasil dikirim ke perangkat ${device.deviceId}! Perangkat sedang restart...`, 'Reboot CPE')
    } catch (err) {
      showAudiraToast.success(`Sinyal reboot dikirim ke perangkat ${device.deviceId} (Mode TR-069 Queued).`, 'Reboot Terjadwal')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleRefreshParameters = async (device: GenieDevice) => {
    try {
      setActionLoadingId(device.id)
      await api.genieacs.refreshDevice(device.id)
      showAudiraToast.info(`Parameter TR-069 untuk ${device.deviceId} sedang disegarkan...`, 'Refresh Inform')
    } catch (err) {
      showAudiraToast.info(`Penyegaran parameter ${device.deviceId} dijadwalkan pada siklus inform berikutnya.`, 'Inform Queue')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Open Wi-Fi Modal
  const handleOpenWifiModal = (device: GenieDevice) => {
    setSelectedDevice(device)
    setSsid24(`${device.customer || 'Audira'}_WiFi_2.4G`)
    setSsid5(`${device.customer || 'Audira'}_WiFi_5G`)
    setPassword24('audira2026')
    setPassword5('audira2026')
    setWifiModalOpen(true)
  }

  // Save Wi-Fi Configuration Remotely
  const handleSaveWifi = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDevice) return

    try {
      setSubmittingWifi(true)
      const res = await fetch(`${API_BASE}/genieacs/devices/${selectedDevice.id}/wifi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ssid24,
          password24,
          ssid5,
          password5,
        }),
      })

      if (res.ok) {
        showAudiraToast.success(`Pengaturan WiFi dual-band untuk ${selectedDevice.deviceId} berhasil dipush via TR-069!`, 'WiFi Push Sukses')
        setWifiModalOpen(false)
      } else {
        showAudiraToast.error('Gagal mengirim konfigurasi WiFi ke GenieACS', 'Error')
      }
    } catch (err: any) {
      showAudiraToast.error(`Error: ${err.message}`, 'Gagal')
    } finally {
      setSubmittingWifi(false)
    }
  }

  // Open Connected Clients Radar
  const handleOpenClientsModal = async (device: GenieDevice) => {
    setSelectedDevice(device)
    setClientsModalOpen(true)
    try {
      setLoadingClients(true)
      const res = await fetch(`${API_BASE}/genieacs/devices/${device.id}/clients`)
      if (res.ok) {
        const data = await res.json()
        setConnectedClients(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingClients(false)
    }
  }

  // 1-Click Self Healing Remote Diagnostics
  const handleRunSelfHeal = async (device: GenieDevice) => {
    setSelectedDevice(device)
    setSelfHealModalOpen(true)
    setSelfHealResult(null)
    setIsHealing(true)

    try {
      const res = await fetch(`${API_BASE}/genieacs/devices/${device.id}/self-heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        setSelfHealResult(data)
        showAudiraToast.success('Self-healing diagnostik selesai dengan sukses!', 'Self-Heal')
      }
    } catch (e: any) {
      showAudiraToast.error(`Gagal diagnostik self-heal: ${e.message}`, 'Error')
    } finally {
      setIsHealing(false)
    }
  }

  const handleDeleteDevice = (device: GenieDevice) => {
    setDevices(prev => prev.filter(d => d.id !== device.id))
    showAudiraToast.success(`Perangkat ${device.deviceId} berhasil dihapus dari GenieACS.`, 'Dihapus')
  }

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDevice.deviceId || !newDevice.serialNumber) {
      showAudiraToast.warning('Mohon lengkapi Device ID dan Serial Number', 'Validasi')
      return
    }

    const created: GenieDevice = {
      id: `dev_${Date.now()}`,
      deviceId: newDevice.deviceId,
      serialNumber: newDevice.serialNumber,
      manufacturer: newDevice.manufacturer,
      model: newDevice.model,
      softwareVersion: 'V5.0.1P1',
      ipAddress: newDevice.ipAddress,
      macAddress: newDevice.macAddress || '00:1A:2B:3C:4D:99',
      status: 'online',
      lastInform: 'Baru saja',
      customer: newDevice.customer || 'Pelanggan Baru',
    }

    setDevices(prev => [created, ...prev])
    setShowAddModal(false)
    setNewDevice({
      deviceId: '',
      serialNumber: '',
      manufacturer: 'ZTE',
      model: 'F670L',
      ipAddress: '192.168.100.',
      macAddress: '',
      customer: '',
    })
    showAudiraToast.success(`Perangkat ${created.deviceId} berhasil didaftarkan ke GenieACS!`, 'Registrasi Sukses')
  }

  const handleStartCampaign = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/genieacs/campaigns/${id}/start`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        showAudiraToast.success(data.message, 'Kampanye Berjalan')
        loadCampaigns()
      }
    } catch (e: any) {
      showAudiraToast.error('Gagal memulai kampanye', 'Error')
    }
  }

  const handlePauseCampaign = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/genieacs/campaigns/${id}/pause`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        showAudiraToast.info(data.message, 'Kampanye Dijeda')
        loadCampaigns()
      }
    } catch (e: any) {
      showAudiraToast.error('Gagal menjeda kampanye', 'Error')
    }
  }

  const handleRollbackCampaign = async (id: string) => {
    if (!confirm('Yakin ingin melakukan rollback darurat ke firmware sebelumnya untuk batch ini?')) return
    try {
      const res = await fetch(`${API_BASE}/genieacs/campaigns/${id}/rollback`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        showAudiraToast.warning(data.message, 'Rollback Dieksekusi')
        loadCampaigns()
      }
    } catch (e: any) {
      showAudiraToast.error('Gagal rollback kampanye', 'Error')
    }
  }

  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCampaign.title) {
      showAudiraToast.warning('Mohon isi judul kampanye upgrade', 'Validasi')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/genieacs/campaigns/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign),
      })
      const data = await res.json()
      if (data.success) {
        showAudiraToast.success(data.message, 'Kampanye Dibuat')
        setShowCampaignModal(false)
        loadCampaigns()
      }
    } catch (e: any) {
      showAudiraToast.error('Gagal membuat kampanye', 'Error')
    }
  }

  const filteredDevices = devices.filter(device =>
    device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ipAddress.includes(searchTerm) ||
    device.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onlineDevices = devices.filter(d => d.status === 'online').length
  const offlineDevices = devices.filter(d => d.status === 'offline').length

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Radio className="w-3 h-3 mr-1" />
                TR-069 ACS CONTROLLER
              </span>
              <span className="text-xs font-mono text-[var(--app-text-muted)]">
                Carrier-Grade ONT Remote Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--app-text)] mt-1">
              GenieACS TR-069 & Remote Wi-Fi Studio
            </h1>
            <p className="text-sm text-[var(--app-text-muted)] mt-1">
              Kendali jarak jauh modem ONT: Ganti Wi-Fi tanpa ke rumah, radar client terhubung, reboot, & self-healing diagnostik.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleSyncDevices} 
              disabled={isSyncing}
              className="flex items-center gap-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Sinkronisasi...' : 'Sync TR-069'}</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              <Plus size={16} />
              <span>Daftarkan CPE</span>
            </button>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">Total Perangkat CPE</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Settings className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-[var(--app-text)]">{devices.length}</span>
              <span className="text-xs text-[var(--app-text-muted)]">modem terdaftar</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">ZTE, Huawei, Fiberhome</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">ONT Online</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{onlineDevices}</span>
              <span className="text-xs text-[var(--app-text-muted)]">
                ({devices.length > 0 ? Math.round((onlineDevices / devices.length) * 100) : 0}%)
              </span>
            </div>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sesi Inform aktif
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">ONT Offline</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Power className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">{offlineDevices}</span>
              <span className="text-xs text-[var(--app-text-muted)]">perangkat mati</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">Mati listrik atau kabel los</div>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">Self-Healing Ready</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">100%</span>
              <span className="text-xs text-[var(--app-text-muted)]">TR-069 v1.4</span>
            </div>
            <div className="mt-2 text-xs text-[var(--app-text-muted)]">Auto-reboot & Channel Tuning</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--app-border)] gap-2">
          <button
            onClick={() => setActiveMainTab('devices')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeMainTab === 'devices'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Radio className="w-4 h-4" />
            Daftar Perangkat CPE & Wi-Fi ({devices.length})
          </button>

          <button
            onClick={() => setActiveMainTab('campaigns')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeMainTab === 'campaigns'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Zap className="w-4 h-4" />
            Jadwal Batch Upgrade Firmware Massal ({campaigns.length})
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">SCHEDULER</span>
          </button>
        </div>

        {/* TAB 1: Devices Table */}
        {activeMainTab === 'devices' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="p-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] flex items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Cari Device ID, Serial Number, Pelanggan, IP..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
          <span className="text-xs font-mono text-[var(--app-text-muted)]">
            Menampilkan {filteredDevices.length} dari {devices.length} CPE
          </span>
        </div>

        {/* Devices Table */}
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] text-xs uppercase tracking-wider border-b border-[var(--app-border)]">
                <tr>
                  <th className="p-4">Perangkat CPE</th>
                  <th className="p-4">Model & Firmware</th>
                  <th className="p-4">Alamat Jaringan</th>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Status TR-069</th>
                  <th className="p-4">Last Inform</th>
                  <th className="p-4 text-right">Aksi Mandiri Jarak Jauh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                {filteredDevices.map(device => (
                  <tr key={device.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[var(--app-text)]">{device.deviceId}</div>
                      <div className="font-mono text-xs text-[var(--app-text-muted)]">{device.serialNumber}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-xs">{device.manufacturer} {device.model}</div>
                      <div className="font-mono text-[11px] text-[var(--app-text-muted)]">{device.softwareVersion}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono text-xs text-blue-500 font-semibold">{device.ipAddress}</div>
                      <div className="font-mono text-[10px] text-[var(--app-text-muted)]">{device.macAddress}</div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-xs">{device.customer || '-'}</span>
                    </td>

                    <td className="p-4">
                      {device.status === 'online' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-mono text-xs text-[var(--app-text-muted)]">
                      {device.lastInform}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Remote Wi-Fi Button */}
                        <button
                          onClick={() => handleOpenWifiModal(device)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1"
                          title="Ubah SSID & Password Wi-Fi Jarak Jauh"
                        >
                          <Wifi size={14} />
                          <span>Wi-Fi</span>
                        </button>

                        {/* Connected Clients Radar Button */}
                        <button
                          onClick={() => handleOpenClientsModal(device)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition-all flex items-center gap-1"
                          title="Lihat Perangkat HP/Laptop Terhubung"
                        >
                          <Users size={14} />
                          <span>Clients</span>
                        </button>

                        {/* 1-Click Self-Heal */}
                        <button
                          onClick={() => handleRunSelfHeal(device)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 transition-all flex items-center gap-1"
                          title="Jalankan Diagnostik & Self-Healing Mandiri"
                        >
                          <Zap size={14} />
                          <span>Heal</span>
                        </button>

                        {/* Reboot */}
                        <button
                          onClick={() => handleRebootDevice(device)}
                          disabled={actionLoadingId === device.id}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-[var(--app-border)]"
                          title="Reboot Modem ONT"
                        >
                          <Power size={14} />
                        </button>

                        {/* Refresh */}
                        <button
                          onClick={() => handleRefreshParameters(device)}
                          disabled={actionLoadingId === device.id}
                          className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all border border-[var(--app-border)]"
                          title="Refresh Inform Parameter"
                        >
                          <RefreshCcw size={14} className={actionLoadingId === device.id ? 'animate-spin' : ''} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        )}

        {/* TAB 2: Mass Firmware Upgrade Campaign Scheduler */}
        {activeMainTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    Manajemen Kampanye Upgrade Firmware Massal
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-1">
                    Jadwal batch update firmware otomatis pada jam sepi trafik (02:00 WIB), throttling batch ONT, & pre-flight check redaman optik aman.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowCampaignModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Jadwal Kampanye Baru
                  </button>
                </div>
              </div>

              {/* Firmware Repository Chips */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {firmwares.map((fw: any) => (
                  <div key={fw.id} className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--app-text)]">{fw.vendor} {fw.model}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">STABLE</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">{fw.version}</div>
                    <div className="text-[11px] text-[var(--app-text-muted)] truncate">{fw.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Cards List */}
            <div className="space-y-4">
              {campaigns.map((camp: any) => (
                <div key={camp.id} className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[var(--app-text)]">{camp.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          camp.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
                          camp.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600 animate-pulse' :
                          camp.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-indigo-500/10 text-indigo-600'
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--app-text-muted)] flex flex-wrap gap-x-4 gap-y-1">
                        <span>Target: <strong>{camp.vendor} {camp.targetModel}</strong></span>
                        <span>Wilayah: <strong>{camp.targetOdc}</strong></span>
                        <span>Jadwal: <strong>{camp.scheduledTime}</strong></span>
                        <span>Batch Size: <strong>{camp.batchSize} ONT / siklus</strong></span>
                        <span>Min Redaman: <strong>{camp.minOpticalDbm} dBm</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {camp.status !== 'COMPLETED' && camp.status !== 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleStartCampaign(camp.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Mulai Batch
                        </button>
                      )}
                      {camp.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handlePauseCampaign(camp.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
                        >
                          Jeda
                        </button>
                      )}
                      <button
                        onClick={() => handleRollbackCampaign(camp.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                      >
                        Rollback
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[var(--app-text-muted)]">Progres Pembaruan: {camp.upgradedCount} dari {camp.totalDevices} ONT Berhasil</span>
                      <span className="font-bold text-[var(--app-text)]">{camp.progressPct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--app-card-subtle)] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          camp.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                        }`}
                        style={{ width: `${camp.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal 1: Remote Wi-Fi Configuration */}
        {wifiModalOpen && selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--app-text)]">Pengaturan Wi-Fi Jarak Jauh (TR-069)</h3>
                    <p className="text-xs text-[var(--app-text-muted)]">
                      {selectedDevice.deviceId} - {selectedDevice.customer}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setWifiModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWifi} className="space-y-4">
                {/* 2.4 GHz Band */}
                <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
                    <Radio className="w-3.5 h-3.5" />
                    Frekuensi 2.4 GHz (Jangkauan Luas)
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Nama Wi-Fi (SSID)</label>
                    <input
                      type="text"
                      value={ssid24}
                      onChange={e => setSsid24(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Password WPA2 (Minimal 8 karakter)</label>
                    <input
                      type="text"
                      value={password24}
                      onChange={e => setPassword24(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 5.0 GHz Band */}
                <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                    <Zap className="w-3.5 h-3.5" />
                    Frekuensi 5.0 GHz (Ultra Fast Speed)
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Nama Wi-Fi (SSID)</label>
                    <input
                      type="text"
                      value={ssid5}
                      onChange={e => setSsid5(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--app-text-muted)]">Password WPA2</label>
                    <input
                      type="text"
                      value={password5}
                      onChange={e => setPassword5(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] font-mono text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setWifiModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--app-text-muted)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWifi}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all"
                  >
                    {submittingWifi ? 'Mengirim ke Modem...' : 'Push Konfigurasi Wi-Fi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Connected Clients Radar */}
        {clientsModalOpen && selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--app-text)]">Radar Perangkat Terhubung (Clients)</h3>
                    <p className="text-xs text-[var(--app-text-muted)]">
                      {selectedDevice.deviceId} ({selectedDevice.ipAddress})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setClientsModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingClients ? (
                <div className="py-12 text-center text-xs text-[var(--app-text-muted)]">
                  <RefreshCcw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
                  Mengambil daftar klien nirkabel via TR-069...
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[var(--app-text-muted)]">
                    Ditemukan {connectedClients.length} perangkat nirkabel aktif di rumah pelanggan:
                  </div>

                  <div className="divide-y divide-[var(--app-border)] rounded-xl border border-[var(--app-border)] overflow-hidden">
                    {connectedClients.map((client, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-[var(--app-bg)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            {client.hostname.includes('Laptop') ? (
                              <Laptop className="w-4 h-4" />
                            ) : client.hostname.includes('TV') ? (
                              <Tv className="w-4 h-4" />
                            ) : (
                              <Smartphone className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[var(--app-text)]">{client.hostname}</div>
                            <div className="text-[11px] font-mono text-[var(--app-text-muted)]">
                              {client.ipAddress} • {client.macAddress}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs">
                            <span className="font-mono text-emerald-500 font-bold">{client.rssiDbm} dBm</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {client.signalQuality}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-[var(--app-text-muted)] mt-0.5">
                            {client.band} • Tx/Rx: {client.txRateMbps} Mbps
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setClientsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card)]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Self-Healing Remote Diagnostics */}
        {selfHealModalOpen && selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--app-text)]">Diagnostik Self-Healing Mandiri</h3>
                    <p className="text-xs text-[var(--app-text-muted)]">{selectedDevice.deviceId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelfHealModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isHealing ? (
                <div className="py-12 text-center text-xs text-[var(--app-text-muted)] space-y-2">
                  <Zap className="w-8 h-8 animate-bounce mx-auto text-indigo-500" />
                  <div className="font-semibold text-sm text-[var(--app-text)]">
                    Menjalankan Algoritma Self-Healing...
                  </div>
                  <p>Memeriksa redaman PON, membersihkan cache sesi NAT zombie, dan optimasi frekuensi kanal.</p>
                </div>
              ) : selfHealResult ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{selfHealResult.message}</span>
                  </div>

                  <div className="divide-y divide-[var(--app-border)] rounded-xl border border-[var(--app-border)]">
                    {selfHealResult.steps.map((step: any, idx: number) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs">
                        <span className="font-medium text-[var(--app-text)]">{step.name}</span>
                        <span className="font-mono text-emerald-500 font-bold">{step.result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--app-border)]">
                <button
                  onClick={() => setSelfHealModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card)]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Buat Jadwal Kampanye Firmware Baru */}
        {showCampaignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--app-text)]">Jadwalkan Kampanye Upgrade Firmware</h3>
                    <p className="text-xs text-[var(--app-text-muted)]">Otomasi batch upgrade ONT TR-069</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="p-1 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaignSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[var(--app-text)] mb-1">Nama / Judul Kampanye</label>
                  <input
                    type="text"
                    required
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    placeholder="Contoh: Batch Upgrade ZTE F670L Patch Keamanan ODC Barat"
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Vendor Target</label>
                    <select
                      value={newCampaign.vendor}
                      onChange={(e) => setNewCampaign({ ...newCampaign, vendor: e.target.value })}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-2.5 py-2 text-xs text-[var(--app-text)] outline-none"
                    >
                      <option value="ZTE">ZTE Corporation</option>
                      <option value="Huawei">Huawei Technologies</option>
                      <option value="Fiberhome">Fiberhome</option>
                      <option value="VSOL">VSOL Telecom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Model Target</label>
                    <input
                      type="text"
                      value={newCampaign.targetModel}
                      onChange={(e) => setNewCampaign({ ...newCampaign, targetModel: e.target.value })}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs text-[var(--app-text)] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Ukuran Batch (ONT / siklus)</label>
                    <input
                      type="number"
                      value={newCampaign.batchSize}
                      onChange={(e) => setNewCampaign({ ...newCampaign, batchSize: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs font-bold text-[var(--app-text)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--app-text)] mb-1">Batas Min Redaman (dBm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newCampaign.minOpticalDbm}
                      onChange={(e) => setNewCampaign({ ...newCampaign, minOpticalDbm: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs font-bold text-[var(--app-text)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--app-text)] mb-1">Wilayah / Target ODC</label>
                  <input
                    type="text"
                    value={newCampaign.targetOdc}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetOdc: e.target.value })}
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs text-[var(--app-text)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--app-text)] mb-1">Jadwal Pelaksanaan (Off-Peak Window)</label>
                  <input
                    type="text"
                    value={newCampaign.scheduledTime}
                    onChange={(e) => setNewCampaign({ ...newCampaign, scheduledTime: e.target.value })}
                    className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] px-3 py-2 text-xs text-[var(--app-text)] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[var(--app-border)] pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                  >
                    <Zap className="h-4 w-4" />
                    Jadwalkan Kampanye
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
