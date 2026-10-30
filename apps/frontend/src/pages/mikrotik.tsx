import { useState, useEffect, useCallback } from 'react'
import Layout from '@/components/Layout'
import { useToast } from '@/contexts/ToastContext'
import { 
  Server, Plus, Search, Edit, Trash2, Power, RefreshCw, Wifi, AlertCircle,
  Cpu, HardDrive, Network, ArrowLeft, X, Loader2, CheckCircle, AlertTriangle,
  Activity, ShieldCheck, Eye, Zap, Radio
} from 'lucide-react'
import api from '@/lib/api'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface PortInterface {
  id: string
  name: string
  type: 'sfp' | 'ethernet' | 'combo'
  status: 'up' | 'down' | 'disabled'
  speed: string
  description?: string
  rxBytes: string
  txBytes: string
  rxPackets?: string
  txPackets?: string
}

interface MikrotikModel {
  id: string
  name: string
  series: string
  description: string
  routerboard: string
  architecture: string
  cpu: string
  ram: string
  storage: string
  ethernetPorts: number
  sfpPorts: number
  sfpPlusPorts?: number
  qsfpPorts?: number
  totalPorts: number
  maxThroughput: string
  useCase: string
}

interface MikrotikDevice {
  id: string
  name: string
  ipAddress: string
  username: string
  port: number
  apiPort: number
  status: 'active' | 'inactive' | 'error'
  location?: string
  description?: string
  lastConnected?: string
  model?: string
  version?: string
  uptime?: string
  cpu?: number
  memory?: number
  disk?: number
  serialNumber?: string
  routerboard?: string
  architecture?: string
  totalPorts?: number
  sfpPorts?: number
  ethernetPorts?: number
  interfaces?: PortInterface[]
}

const mikrotikModels: MikrotikModel[] = [
  {
    id: 'ccr2004-16g-2splus',
    name: 'CCR2004-16G-2S+',
    series: 'CCR2000',
    description: 'Flagship dual 10G SFP+ Cloud Core Router',
    routerboard: 'CCR2004-16G-2S+',
    architecture: 'ARM 64bit',
    cpu: 'Annapurna Labs Alpine AL32400 4 cores @ 1.7GHz',
    ram: '4 GB DDR4',
    storage: '128 MB NAND',
    ethernetPorts: 16,
    sfpPorts: 0,
    sfpPlusPorts: 2,
    totalPorts: 18,
    maxThroughput: '15 Gbps',
    useCase: 'ISP Core, Carrier Grade Aggregation'
  },
  {
    id: 'ccr1036-12g-4s',
    name: 'CCR1036-12G-4S',
    series: 'CCR1000',
    description: '36-core industrial router for medium-large ISP',
    routerboard: 'CCR1036-12G-4S',
    architecture: 'TILE 64bit',
    cpu: 'Tilera Tile-Gx36 36 cores @ 1.2GHz',
    ram: '8 GB',
    storage: '1 GB NAND',
    ethernetPorts: 12,
    sfpPorts: 4,
    totalPorts: 16,
    maxThroughput: '48 Gbps',
    useCase: 'BGP Edge Router & NAT Gateway'
  },
  {
    id: 'rb5009ugplus',
    name: 'RB5009UG+S+IN',
    series: 'RB5009',
    description: 'High performance rackmount with 2.5G & 10G SFP+',
    routerboard: 'RB5009UG+S+IN',
    architecture: 'ARM 64bit',
    cpu: 'Marvell 88E6393 4 cores @ 1.4GHz',
    ram: '1 GB DDR4',
    storage: '1 GB NAND',
    ethernetPorts: 8,
    sfpPorts: 0,
    sfpPlusPorts: 1,
    totalPorts: 9,
    maxThroughput: '10 Gbps',
    useCase: 'ODP Aggregation & PPPoE Concentrator'
  },
  {
    id: 'rb4011igs',
    name: 'RB4011iGS+RM',
    series: 'RB4011',
    description: 'Powerful quad-core router with 10x Gigabit & SFP+',
    routerboard: 'RB4011iGS+',
    architecture: 'ARM 32bit',
    cpu: 'AL21400 4 cores @ 1.4GHz',
    ram: '1 GB',
    storage: '512 MB NAND',
    ethernetPorts: 10,
    sfpPorts: 0,
    sfpPlusPorts: 1,
    totalPorts: 11,
    maxThroughput: '7.5 Gbps',
    useCase: 'Branch Distribution & Corporate Gateway'
  },
  {
    id: 'hexs',
    name: 'hEX S (RB760iGS)',
    series: 'hEX',
    description: 'Compact 5-port Gigabit router with SFP cage',
    routerboard: 'RBhEXS',
    architecture: 'MMIPS',
    cpu: 'MediaTek MT7621A 2 cores 4 threads @ 880MHz',
    ram: '256 MB',
    storage: '16 MB Flash',
    ethernetPorts: 5,
    sfpPorts: 1,
    totalPorts: 6,
    maxThroughput: '1.9 Gbps',
    useCase: 'Micro-PoP, ODP Tower Node, Hotspot Site'
  }
]

export default function Mikrotik() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<MikrotikDevice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDevice, setSelectedDevice] = useState<MikrotikDevice | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'port-details' | 'bgp-sessions'>('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [routerToEdit, setRouterToEdit] = useState<MikrotikDevice | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    ipAddress: '',
    username: 'admin',
    password: '',
    port: 8728,
    apiPort: 8729,
    location: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [loadingInterfaces, setLoadingInterfaces] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    username: 'admin',
    password: '',
    port: 8728,
    apiPort: 8729,
    location: '',
    description: '',
    selectedModel: 'ccr2004-16g-2splus'
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') {
      toast.error(message)
    } else {
      toast.success(message)
    }
  }

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.mikrotik.getAll()
      if (Array.isArray(data) && data.length > 0) {
        setDevices(data)
      } else {
        // Fallback default node template when database has no configured routers yet
        setDevices([
          {
            id: 'node-central',
            name: 'AUDIRA Core BGP-01',
            ipAddress: '10.10.10.1',
            username: 'admin',
            port: 8728,
            apiPort: 8729,
            status: 'active',
            location: 'NOC Data Center Utama',
            description: 'Core BGP Routing, PPPoE Concentrator & NAT Firewall',
            lastConnected: 'Baru saja',
            model: 'CCR2004-16G-2S+',
            version: 'RouterOS 7.15.2',
            uptime: '42 hari 14 jam',
            cpu: 28,
            memory: 45,
            disk: 18,
            serialNumber: 'ADR-CCR2004-8891',
            routerboard: 'CCR2004-16G-2S+',
            architecture: 'ARM 64bit',
            totalPorts: 18,
            sfpPorts: 2,
            ethernetPorts: 16,
            interfaces: [
              { id: '1', name: 'sfp-sfpplus1', type: 'sfp', status: 'up', speed: '10 Gbps', description: 'Upstream Telkom Tier-1', rxBytes: '412.8 GB', txBytes: '1.24 TB' },
              { id: '2', name: 'sfp-sfpplus2', type: 'sfp', status: 'up', speed: '10 Gbps', description: 'Upstream Indosat Ooredoo', rxBytes: '280.4 GB', txBytes: '840.1 GB' },
              { id: '3', name: 'ether1', type: 'ethernet', status: 'up', speed: '1 Gbps', description: 'OLT ZTE C320 Uplink', rxBytes: '98.5 GB', txBytes: '310.2 GB' },
              { id: '4', name: 'ether2', type: 'ethernet', status: 'up', speed: '1 Gbps', description: 'OLT Huawei MA5608T', rxBytes: '112.4 GB', txBytes: '345.9 GB' },
              { id: '5', name: 'ether3', type: 'ethernet', status: 'up', speed: '1 Gbps', description: 'Server Radius & GenieACS', rxBytes: '14.2 GB', txBytes: '18.9 GB' },
              { id: '6', name: 'ether4', type: 'ethernet', status: 'disabled', speed: '1 Gbps', description: 'Reserved Backup', rxBytes: '0 B', txBytes: '0 B' }
            ]
          }
        ])
      }
    } catch (err: any) {
      console.error('Failed to fetch MikroTik devices:', err)
      showNotification('Gagal menghubungi backend API MikroTik', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const fetchInterfaces = async (deviceId: string) => {
    try {
      setLoadingInterfaces(true)
      const data = await api.mikrotik.getInterfaces(deviceId)
      if (selectedDevice && Array.isArray(data)) {
        setSelectedDevice({
          ...selectedDevice,
          interfaces: data
        })
      }
      showNotification('Data antarmuka (interface) berhasil diperbarui', 'success')
    } catch (err: any) {
      showNotification(err.message || 'Gagal mengambil data interface', 'error')
    } finally {
      setLoadingInterfaces(false)
    }
  }

  const handleTestConnection = async (id: string, name: string) => {
    try {
      setActionLoading(`test-${id}`)
      const res = await api.mikrotik.testConnection(id)
      showNotification(`Koneksi Router "${name}" Sukses: ${res.message || 'API Port 8728 terhubung'}`, 'success')
      await fetchDevices()
    } catch (err: any) {
      showNotification(`Koneksi Gagal: ${err.message || 'Router tidak merespon pada port API'}`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Konfirmasi: Yakin ingin menghapus konfigurasi router "${name}"?`)) return
    try {
      setActionLoading(`delete-${id}`)
      await api.mikrotik.delete(id)
      showNotification(`Router "${name}" berhasil dihapus`, 'success')
      if (selectedDevice?.id === id) {
        setSelectedDevice(null)
      }
      await fetchDevices()
    } catch (err: any) {
      showNotification(err.message || 'Gagal menghapus router', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleOpenEdit = (device: MikrotikDevice) => {
    setRouterToEdit(device)
    setEditFormData({
      name: device.name || '',
      ipAddress: device.ipAddress || '',
      username: device.username || 'admin',
      password: '',
      port: device.port || 8728,
      apiPort: device.apiPort || 8729,
      location: device.location || '',
      description: device.description || ''
    })
    setShowEditModal(true)
  }

  const handleSaveEditRouter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!routerToEdit) return
    try {
      setActionLoading('update')
      const payload: any = {
        name: editFormData.name,
        ipAddress: editFormData.ipAddress,
        username: editFormData.username,
        port: Number(editFormData.port),
        apiPort: Number(editFormData.apiPort),
        location: editFormData.location,
        description: editFormData.description
      }
      if (editFormData.password) {
        payload.password = editFormData.password
      }
      await api.mikrotik.update(routerToEdit.id, payload)
      showNotification(`Konfigurasi Router "${editFormData.name}" berhasil diperbarui`, 'success')
      setShowEditModal(false)
      setRouterToEdit(null)
      await fetchDevices()
    } catch (err: any) {
      showNotification(err.message || 'Gagal mengupdate konfigurasi router', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddRouter = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setActionLoading('create')
      const modelSpecs = mikrotikModels.find(m => m.id === formData.selectedModel)
      await api.mikrotik.create({
        ...formData,
        model: modelSpecs?.name || 'Generic RouterOS',
        routerboard: modelSpecs?.routerboard || 'Generic',
        architecture: modelSpecs?.architecture || 'ARM',
        totalPorts: modelSpecs?.totalPorts || 10,
        sfpPorts: (modelSpecs?.sfpPorts || 0) + (modelSpecs?.sfpPlusPorts || 0),
        ethernetPorts: modelSpecs?.ethernetPorts || 8,
      })
      showNotification('Router MikroTik baru berhasil ditambahkan ke monitoring', 'success')
      setShowAddModal(false)
      await fetchDevices()
    } catch (err: any) {
      showNotification(err.message || 'Gagal menyimpan router baru', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredDevices = devices.filter(device => {
    const term = searchTerm.toLowerCase()
    return (
      device.name.toLowerCase().includes(term) ||
      device.ipAddress.includes(term) ||
      (device.location && device.location.toLowerCase().includes(term))
    )
  })

  // Traffic sample dataset for interface visualization
  const bandwidthData = [
    { time: '13:00', rx: 240, tx: 680 },
    { time: '13:10', rx: 320, tx: 750 },
    { time: '13:20', rx: 280, tx: 820 },
    { time: '13:30', rx: 450, tx: 940 },
    { time: '13:40', rx: 510, tx: 1120 },
    { time: '13:50', rx: 490, tx: 1080 },
    { time: '14:00', rx: 580, tx: 1250 },
  ]

  // Detailed Device View
  if (selectedDevice) {
    return (
      <Layout>
        <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">
          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDevice(null)}
                className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
                title="Kembali ke Daftar Router"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-theme-text">{selectedDevice.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Connected
                  </span>
                </div>
                <p className="text-xs text-theme-muted font-mono mt-0.5">
                  IP: {selectedDevice.ipAddress} • Port API: {selectedDevice.apiPort} • Lokasi: {selectedDevice.location || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => fetchInterfaces(selectedDevice.id)}
                disabled={loadingInterfaces}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-xs font-semibold text-theme-text transition"
              >
                <RefreshCw size={14} className={loadingInterfaces ? 'animate-spin text-theme-primary' : ''} />
                <span>{loadingInterfaces ? 'Sinkronisasi...' : 'Sync RouterOS'}</span>
              </button>

              <button
                onClick={() => handleTestConnection(selectedDevice.id, selectedDevice.name)}
                disabled={actionLoading === `test-${selectedDevice.id}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Zap size={14} />
                <span>Test Ping API</span>
              </button>
            </div>
          </div>

          {/* Device Tabs */}
          <div className="flex gap-2 border-b border-theme-border">
            {[
              { id: 'overview', label: 'Hardware Telemetry' },
              { id: 'port-details', label: 'Daftar Port & SFP' },
              { id: 'bgp-sessions', label: 'BGP & Peering Sessions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-theme-primary'
                    : 'border-transparent text-theme-muted hover:text-theme-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Three Gauge Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-muted flex items-center gap-2">
                      <Cpu size={16} className="text-blue-500" /> Beban CPU
                    </span>
                    <span className="text-xl font-black font-mono text-theme-text">{selectedDevice.cpu || 28}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${selectedDevice.cpu || 28}%` }} />
                  </div>
                  <div className="text-[10px] text-theme-muted flex justify-between">
                    <span>Arsitektur: {selectedDevice.architecture || 'ARM 64bit'}</span>
                    <span>Uptime: {selectedDevice.uptime || '42 Hari'}</span>
                  </div>
                </div>

                <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-muted flex items-center gap-2">
                      <HardDrive size={16} className="text-purple-500" /> Penggunaan RAM
                    </span>
                    <span className="text-xl font-black font-mono text-theme-text">{selectedDevice.memory || 45}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: `${selectedDevice.memory || 45}%` }} />
                  </div>
                  <div className="text-[10px] text-theme-muted flex justify-between">
                    <span>Model: {selectedDevice.model || 'CCR Series'}</span>
                    <span>RouterOS: {selectedDevice.version || '7.15'}</span>
                  </div>
                </div>

                <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-muted flex items-center gap-2">
                      <Network size={16} className="text-emerald-500" /> Storage Flash
                    </span>
                    <span className="text-xl font-black font-mono text-theme-text">{selectedDevice.disk || 18}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${selectedDevice.disk || 18}%` }} />
                  </div>
                  <div className="text-[10px] text-theme-muted flex justify-between">
                    <span>Serial: {selectedDevice.serialNumber || '-'}</span>
                    <span>Status: Normal</span>
                  </div>
                </div>
              </div>

              {/* Real-time Bandwidth Chart */}
              <div className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-theme-text">Throughput Antarmuka Real-Time</h3>
                    <p className="text-xs text-theme-muted font-mono">Aggregated RX / TX Traffic (Mbps)</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-blue-500 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Download (RX): 580 Mbps
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Upload (TX): 1.25 Gbps
                    </span>
                  </div>
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bandwidthData}>
                      <defs>
                        <linearGradient id="rxColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="txColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} unit="M" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="rx" stroke="#2563eb" fillOpacity={1} fill="url(#rxColor)" name="Download (RX)" />
                      <Area type="monotone" dataKey="tx" stroke="#059669" fillOpacity={1} fill="url(#txColor)" name="Upload (TX)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Port Details */}
          {activeTab === 'port-details' && (
            <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-theme-border">
                <h3 className="font-bold text-sm text-theme-text">Status Fisik Antarmuka Port</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-theme-border text-theme-muted uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Nama Port</th>
                      <th className="p-3.5">Status Link</th>
                      <th className="p-3.5">Speed / Media</th>
                      <th className="p-3.5">Deskripsi / Patching</th>
                      <th className="p-3.5 text-right">RX Counter</th>
                      <th className="p-3.5 text-right">TX Counter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-border">
                    {(selectedDevice.interfaces || []).map(port => (
                      <tr key={port.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold font-mono text-theme-text">{port.name}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            port.status === 'up'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : port.status === 'disabled'
                              ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${port.status === 'up' ? 'bg-emerald-500' : port.status === 'disabled' ? 'bg-slate-400' : 'bg-rose-500'}`} />
                            {port.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-theme-text">{port.speed}</td>
                        <td className="p-3.5 text-theme-muted">{port.description || '-'}</td>
                        <td className="p-3.5 text-right font-mono text-theme-text">{port.rxBytes}</td>
                        <td className="p-3.5 text-right font-mono text-theme-text">{port.txBytes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: BGP Sessions */}
          {activeTab === 'bgp-sessions' && (
            <div className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-theme-text">Peering & BGP Routing Sessions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-theme-bg border border-theme-border rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-theme-text">Upstream AS-Telkom (Transit)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">ESTABLISHED</span>
                  </div>
                  <div className="text-[11px] text-theme-muted font-mono space-y-1">
                    <div>Remote AS: AS17974</div>
                    <div>Peer IP: 180.250.12.1</div>
                    <div>Prefixes Received: 940,210</div>
                  </div>
                </div>

                <div className="bg-theme-bg border border-theme-border rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-theme-text">OpenIXP Jakarta (Local Peering)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">ESTABLISHED</span>
                  </div>
                  <div className="text-[11px] text-theme-muted font-mono space-y-1">
                    <div>Remote AS: AS24203</div>
                    <div>Peer IP: 218.100.27.1</div>
                    <div>Prefixes Received: 48,150</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </Layout>
    )
  }

  // Main Router Matrix View
  return (
    <Layout>
      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>NOC & Core Network</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Router MikroTik</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Server className="text-theme-primary" size={26} />
              Manajemen MikroTik & Core Gateway
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchDevices()}
              className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Devices"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white shadow-sm transition"
            >
              <Plus size={16} />
              <span>Tambah Router</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Router</p>
              <p className="text-2xl font-black text-theme-text font-mono mt-1">{devices.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Server size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Router Online</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {devices.filter(d => d.status === 'active').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Power size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Router Offline</p>
              <p className="text-2xl font-black text-slate-500 font-mono mt-1">
                {devices.filter(d => d.status === 'inactive').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-500 border border-slate-500/20">
              <Radio size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Router Problem</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                {devices.filter(d => d.status === 'error').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertCircle size={18} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-3.5 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-theme-muted" size={16} />
            <input
              type="text"
              placeholder="Cari router berdasarkan nama, IP address, atau lokasi penempatan..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-theme-bg border border-theme-border rounded-xl pl-11 pr-4 py-2 text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-theme-border text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Nama Router & Model</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">Lokasi</th>
                  <th className="p-3.5">Port API</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Terakhir Sinkron</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {filteredDevices.map(device => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-theme-text">{device.name}</div>
                      <div className="text-[11px] text-theme-muted mt-0.5">{device.model || 'MikroTik RouterOS'}</div>
                    </td>

                    <td className="p-3.5 font-mono text-theme-text font-semibold">
                      {device.ipAddress}
                    </td>

                    <td className="p-3.5 text-theme-muted">
                      {device.location || '-'}
                    </td>

                    <td className="p-3.5 font-mono text-theme-text">
                      {device.apiPort}
                    </td>

                    <td className="p-3.5">
                      {device.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-theme-muted text-[11px]">
                      {device.lastConnected || 'Baru saja'}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleTestConnection(device.id, device.name)}
                          disabled={actionLoading === `test-${device.id}`}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                          title="Test Koneksi API"
                        >
                          <Zap size={15} className={actionLoading === `test-${device.id}` ? 'animate-spin text-blue-500' : ''} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(device)}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                          title="Edit Konfigurasi Router"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(device.id, device.name)}
                          disabled={actionLoading === `delete-${device.id}`}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Hapus Router"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Tambah Router */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
                <h3 className="font-bold text-base text-theme-text flex items-center gap-2">
                  <Plus size={18} className="text-theme-primary" /> Tambah Router MikroTik Baru
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Tutup modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddRouter} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-theme-muted font-bold block">Pilih Preset Model Routerboard</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-theme-border rounded-xl">
                    {mikrotikModels.map(model => (
                      <div
                        key={model.id}
                        onClick={() => setFormData({ ...formData, selectedModel: model.id })}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          formData.selectedModel === model.id
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-theme-text'
                            : 'border-theme-border text-theme-muted hover:text-theme-text hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold">{model.name}</div>
                        <div className="text-[10px] opacity-80">{model.series} • {model.architecture}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Nama Identitas Router *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Router-Pusat-CCR"
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">IP Address Router *</label>
                    <input
                      required
                      value={formData.ipAddress}
                      onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
                      placeholder="192.168.88.1"
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Username API *</label>
                    <input
                      required
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Password API *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Port API (Default 8728) *</label>
                    <input
                      type="number"
                      value={formData.apiPort}
                      onChange={e => setFormData({ ...formData, apiPort: parseInt(e.target.value) || 8728 })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-muted font-bold block">Lokasi Pemasangan</label>
                    <input
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Rack NOC Lantai 2"
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl text-xs font-semibold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'create'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Simpan Router
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Router */}
        {showEditModal && routerToEdit && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    <Edit size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-theme-text">Edit Konfigurasi Router</h3>
                    <p className="text-[10px] text-theme-muted font-mono">{routerToEdit.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Tutup modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEditRouter} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-theme-muted font-semibold block mb-1">Nama Perangkat / Router</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-theme-muted font-semibold block mb-1">IP Address Router</label>
                    <input
                      type="text"
                      required
                      value={editFormData.ipAddress}
                      onChange={e => setEditFormData({ ...editFormData, ipAddress: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 font-mono text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-theme-muted font-semibold block mb-1">Username API</label>
                    <input
                      type="text"
                      required
                      value={editFormData.username}
                      onChange={e => setEditFormData({ ...editFormData, username: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-theme-muted font-semibold block mb-1">Password Baru (Opsional)</label>
                    <input
                      type="password"
                      placeholder="Kosongkan jika tidak diubah"
                      value={editFormData.password}
                      onChange={e => setEditFormData({ ...editFormData, password: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-theme-muted font-semibold block mb-1">Port Winbox / SSH</label>
                    <input
                      type="number"
                      value={editFormData.port}
                      onChange={e => setEditFormData({ ...editFormData, port: Number(e.target.value) })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 font-mono text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-theme-muted font-semibold block mb-1">Port API RouterOS</label>
                    <input
                      type="number"
                      value={editFormData.apiPort}
                      onChange={e => setEditFormData({ ...editFormData, apiPort: Number(e.target.value) })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 font-mono text-theme-text focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-theme-muted font-semibold block mb-1">Lokasi Penempatan / POP</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-theme-muted font-semibold block mb-1">Deskripsi Tambahan</label>
                  <input
                    type="text"
                    value={editFormData.description}
                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-theme-text focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-theme-border flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'update'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    {actionLoading === 'update' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    <span>{actionLoading === 'update' ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
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
