import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Server, Plus, Search, Edit, Trash2, Power, RefreshCw, Wifi, AlertCircle,
  Cpu, HardDrive, Network, ArrowLeft, X, Loader2
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

export default function Mikrotik() {
  // Mock data untuk fallback
  const mockDevices: MikrotikDevice[] = [
    {
      id: '1',
      name: 'MikroTik Central',
      ipAddress: '192.168.1.1',
      username: 'admin',
      port: 8728,
      apiPort: 8729,
      status: 'active',
      location: 'Kantor Pusat',
      description: 'Router utama untuk manajemen pelanggan',
      lastConnected: '2 menit yang lalu',
      model: 'RB4011iGS+',
      version: 'RouterOS 7.12',
      uptime: '15 hari 8 jam',
      cpu: 45,
      memory: 62,
      disk: 28,
      serialNumber: 'D4F50E123456',
      routerboard: 'RB4011iGS+',
      architecture: 'ARM 64bit',
      totalPorts: 48,
      sfpPorts: 32,
      ethernetPorts: 16,
      interfaces: [
        { id: '1', name: 'Ethernet1', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-01', rxBytes: '98.18 GB', txBytes: '88.98 GB', rxPackets: '125.4M', txPackets: '118.2M' },
        { id: '2', name: 'Ethernet2', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-02', rxBytes: '42.66 GB', txBytes: '64.68 GB', rxPackets: '95.2M', txPackets: '102.8M' },
        { id: '3', name: 'Ethernet3', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-03', rxBytes: '22.72 GB', txBytes: '68.13 GB', rxPackets: '78.5M', txPackets: '88.9M' },
        { id: '4', name: 'Ethernet4', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-04', rxBytes: '32.10 GB', txBytes: '20.03 GB', rxPackets: '65.3M', txPackets: '55.7M' },
        { id: '5', name: 'Ethernet5', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-05', rxBytes: '15.44 GB', txBytes: '42.18 GB', rxPackets: '42.1M', txPackets: '68.3M' },
        { id: '6', name: 'Ethernet6', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-06', rxBytes: '28.90 GB', txBytes: '35.22 GB', rxPackets: '52.8M', txPackets: '61.4M' },
        { id: '7', name: 'Ethernet7', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-07', rxBytes: '18.65 GB', txBytes: '29.44 GB', rxPackets: '38.2M', txPackets: '48.9M' },
        { id: '8', name: 'Ethernet8', type: 'sfp', status: 'up', speed: '400G', description: 'Spine-08', rxBytes: '44.33 GB', txBytes: '51.77 GB', rxPackets: '72.6M', txPackets: '85.1M' },
        { id: '9', name: 'Ethernet9', type: 'sfp', status: 'disabled', speed: '400G', description: 'Spine-09', rxBytes: '0 GB', txBytes: '0 GB', rxPackets: '0', txPackets: '0' },
        { id: '10', name: 'Ethernet10', type: 'sfp', status: 'disabled', speed: '400G', description: 'Spine-10', rxBytes: '0 GB', txBytes: '0 GB', rxPackets: '0', txPackets: '0' },
        { id: '11', name: 'Ethernet11', type: 'ethernet', status: 'up', speed: '100G', description: 'Eth33', rxBytes: '12.45 GB', txBytes: '18.92 GB', rxPackets: '28.4M', txPackets: '35.2M' },
        { id: '12', name: 'Ethernet12', type: 'ethernet', status: 'up', speed: '100G', description: 'Eth34', rxBytes: '8.22 GB', txBytes: '11.54 GB', rxPackets: '19.8M', txPackets: '24.1M' },
        { id: '13', name: 'Ethernet13', type: 'ethernet', status: 'down', speed: '100G', description: 'Eth35', rxBytes: '0 GB', txBytes: '0 GB', rxPackets: '0', txPackets: '0' },
        { id: '14', name: 'Ethernet14', type: 'ethernet', status: 'down', speed: '100G', description: 'Eth36', rxBytes: '0 GB', txBytes: '0 GB', rxPackets: '0', txPackets: '0' },
        { id: '15', name: 'Ethernet15', type: 'ethernet', status: 'up', speed: '10G', description: 'Eth37', rxBytes: '5.88 GB', txBytes: '7.33 GB', rxPackets: '12.5M', txPackets: '15.8M' },
        { id: '16', name: 'Ethernet16', type: 'ethernet', status: 'up', speed: '10G', description: 'Eth38', rxBytes: '3.44 GB', txBytes: '4.92 GB', rxPackets: '8.2M', txPackets: '10.1M' }
      ]
    },
    {
      id: '2',
      name: 'MikroTik Area 2',
      ipAddress: '192.168.2.1',
      username: 'admin',
      port: 8728,
      apiPort: 8729,
      status: 'active',
      location: 'Area Perumahan',
      description: 'Router area perumahan cluster A',
      lastConnected: '5 menit yang lalu',
      model: 'hEX S',
      version: 'RouterOS 7.11',
      uptime: '8 hari 3 jam',
      cpu: 32,
      memory: 48,
      disk: 15,
      serialNumber: 'A2B48F789012',
      routerboard: 'RBhEXS',
      architecture: 'ARM 32bit',
      totalPorts: 5,
      sfpPorts: 1,
      ethernetPorts: 4,
      interfaces: [
        { id: '1', name: 'ether1', type: 'ethernet', status: 'up', speed: '1000Mbps', description: 'WAN', rxBytes: '125.8 GB', txBytes: '89.4 GB' },
        { id: '2', name: 'ether2', type: 'ethernet', status: 'up', speed: '1000Mbps', description: 'LAN', rxBytes: '45.2 GB', txBytes: '78.9 GB' },
        { id: '3', name: 'ether3', type: 'ethernet', status: 'up', speed: '1000Mbps', description: 'LAN2', rxBytes: '32.1 GB', txBytes: '54.6 GB' },
        { id: '4', name: 'ether4', type: 'ethernet', status: 'disabled', speed: '1000Mbps', description: 'Reserved', rxBytes: '0 GB', txBytes: '0 GB' },
        { id: '5', name: 'sfp1', type: 'sfp', status: 'up', speed: '1000Mbps', description: 'Uplink', rxBytes: '98.5 GB', txBytes: '102.3 GB' }
      ]
    },
    {
      id: '3',
      name: 'MikroTik Area 3',
      ipAddress: '192.168.3.1',
      username: 'admin',
      port: 8728,
      apiPort: 8729,
      status: 'inactive',
      location: 'Area Komersial',
      description: 'Router area gedung perkantoran',
      lastConnected: '2 jam yang lalu',
      model: 'CCR1036-12G-4S',
      version: 'RouterOS 7.10',
      uptime: '0 hari 0 jam',
      cpu: 0,
      memory: 0,
      disk: 0,
      serialNumber: 'C9D72E345678',
      routerboard: 'CCR1036-12G-4S',
      architecture: 'TILE 64bit',
      totalPorts: 16,
      sfpPorts: 4,
      ethernetPorts: 12,
      interfaces: []
    }
  ];

  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<MikrotikDevice | null>(null);
  const [bandwidthData, setBandwidthData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'port-details' | 'bgp-sessions'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingInterfaces, setLoadingInterfaces] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    username: 'admin',
    password: '',
    port: 8728,
    apiPort: 8729,
    location: '',
    description: '',
    selectedModel: ''
  });

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      setLoading(true)
      const data = await api.mikrotik.getAll()
      // Jika API return empty array, gunakan mock data
      if (data && data.length > 0) {
        setDevices(data)
      } else {
        setDevices(mockDevices)
      }
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data MikroTik')
      console.error('Error fetching devices:', err)
      // Jika error, tetap tampilkan mock data
      setDevices(mockDevices)
    } finally {
      setLoading(false)
    }
  }

  // Bandwidth simulation / real-time updates
  useEffect(() => {
    if (!selectedDevice || selectedDevice.status !== 'active') {
      setBandwidthData([]);
      return;
    }

    // Initialize with 10 data points
    const now = new Date();
    const initialData = Array.from({ length: 10 }).map((_, i) => {
      const timeStr = new Date(now.getTime() - (10 - i) * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        time: timeStr,
        Download: Math.floor(Math.random() * 150) + 50,
        Upload: Math.floor(Math.random() * 80) + 20
      };
    });
    setBandwidthData(initialData);

    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const download = Math.floor(Math.random() * 350) + 50;  // 50-400 Mbps
      const upload = Math.floor(Math.random() * 150) + 20;    // 20-170 Mbps
      
      setBandwidthData(prev => {
        const next = [...prev.slice(1), { time: timeStr, Download: download, Upload: upload }];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedDevice]);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus router ini?')) return
    
    try {
      await api.mikrotik.delete(id)
      await fetchDevices()
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus router')
    }
  }

  const handleTestConnection = async (id: string) => {
    try {
      const result = await api.mikrotik.testConnection(id)
      alert(`Connection test: ${result.success ? 'Success' : 'Failed'}`)
    } catch (err: any) {
      alert(err.message || 'Test koneksi gagal')
    }
  }

  const fetchInterfaces = async (deviceId: string) => {
    try {
      setLoadingInterfaces(true);
      const interfaces = await api.mikrotik.getInterfaces(deviceId);
      
      // Update selected device with real interface data
      setSelectedDevice(prev => {
        if (prev && prev.id === deviceId) {
          return { ...prev, interfaces };
        }
        return prev;
      });
    } catch (err: any) {
      console.error('Error fetching interfaces:', err);
      // Keep using mock data if API fails
    } finally {
      setLoadingInterfaces(false);
    }
  }

  const handleDeviceClick = async (device: MikrotikDevice) => {
    setSelectedDevice(device);
    // Fetch real interface data if device is active
    if (device.status === 'active') {
      await fetchInterfaces(device.id);
    }
  }

  const mikrotikModels: MikrotikModel[] = [
    // Cloud Core Router (CCR) Series - High Performance
    {
      id: 'ccr2116-12g-4s',
      name: 'CCR2116-12G-4S+',
      series: 'CCR2100',
      description: 'Cloud Core Router with Amazon Annapurna Alpine v3 CPU',
      routerboard: 'CCR2116-12G-4S+',
      architecture: 'ARM 64bit',
      cpu: 'AL73400 16 cores @ 2GHz',
      ram: '16 GB',
      storage: '128 MB NAND',
      ethernetPorts: 12,
      sfpPorts: 0,
      sfpPlusPorts: 4,
      totalPorts: 16,
      maxThroughput: '100 Gbps',
      useCase: 'ISP Core, Data Center'
    },
    {
      id: 'ccr2216-1g-12xs-2xq',
      name: 'CCR2216-1G-12XS-2XQ+',
      series: 'CCR2200',
      description: 'Flagship router with 100G QSFP ports',
      routerboard: 'CCR2216-1G-12XS-2XQ+',
      architecture: 'ARM 64bit',
      cpu: 'AL73400 16 cores @ 2GHz',
      ram: '16 GB',
      storage: '128 MB NAND',
      ethernetPorts: 1,
      sfpPorts: 0,
      sfpPlusPorts: 12,
      qsfpPorts: 2,
      totalPorts: 15,
      maxThroughput: '200 Gbps',
      useCase: 'ISP Core, High-speed Backbone'
    },
    {
      id: 'ccr1072-1g-8s',
      name: 'CCR1072-1G-8S+',
      series: 'CCR1000',
      description: 'Powerful 72-core router',
      routerboard: 'CCR1072-1G-8S+',
      architecture: 'TILE 64bit',
      cpu: 'Tilera Tile-Gx72 72 cores @ 1GHz',
      ram: '16 GB',
      storage: '128 MB NAND',
      ethernetPorts: 1,
      sfpPorts: 0,
      sfpPlusPorts: 8,
      totalPorts: 9,
      maxThroughput: '80 Gbps',
      useCase: 'ISP Core, Carrier Grade'
    },
    {
      id: 'ccr1036-12g-4s',
      name: 'CCR1036-12G-4S',
      series: 'CCR1000',
      description: '36-core router for medium ISP',
      routerboard: 'CCR1036-12G-4S',
      architecture: 'TILE 64bit',
      cpu: 'Tilera Tile-Gx36 36 cores @ 1.2GHz',
      ram: '12 GB',
      storage: '128 MB NAND',
      ethernetPorts: 12,
      sfpPorts: 4,
      totalPorts: 16,
      maxThroughput: '48 Gbps',
      useCase: 'ISP Distribution, Medium Network'
    },
    
    // RB Series - Rackmount
    {
      id: 'rb5009ugplus',
      name: 'RB5009UG+S+IN',
      series: 'RB5009',
      description: 'Latest generation rackmount with 2.5G ports',
      routerboard: 'RB5009UG+S+IN',
      architecture: 'ARM 64bit',
      cpu: 'Marvell 98DX226S 4 cores @ 1.4GHz',
      ram: '1 GB',
      storage: '1 GB NAND',
      ethernetPorts: 7,
      sfpPorts: 0,
      sfpPlusPorts: 1,
      totalPorts: 8,
      maxThroughput: '10 Gbps',
      useCase: 'Small ISP, Enterprise Edge'
    },
    {
      id: 'rb4011igs',
      name: 'RB4011iGS+',
      series: 'RB4011',
      description: 'Popular enterprise router with SFP+',
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
      useCase: 'Branch Office, SMB'
    },
    {
      id: 'rb3011uias',
      name: 'RB3011UiAS-RM',
      series: 'RB3011',
      description: 'Affordable 10-port rackmount',
      routerboard: 'RB3011UiAS-RM',
      architecture: 'ARM 32bit',
      cpu: 'AL21400 2 cores @ 1.4GHz',
      ram: '1 GB',
      storage: '128 MB NAND',
      ethernetPorts: 10,
      sfpPorts: 1,
      totalPorts: 11,
      maxThroughput: '5 Gbps',
      useCase: 'Small Office, Branch'
    },
    {
      id: 'rb1100ahx4',
      name: 'RB1100AHx4',
      series: 'RB1100',
      description: 'Proven 13-port enterprise router',
      routerboard: 'RB1100AHx4',
      architecture: 'ARM 32bit',
      cpu: 'AL21400 4 cores @ 1.4GHz',
      ram: '1 GB',
      storage: '512 MB NAND',
      ethernetPorts: 13,
      sfpPorts: 0,
      totalPorts: 13,
      maxThroughput: '7.5 Gbps',
      useCase: 'Enterprise, Medium ISP'
    },
    
    // hEX Series - Desktop/Small Office
    {
      id: 'hexs',
      name: 'hEX S',
      series: 'hEX',
      description: 'Popular desktop router with SFP',
      routerboard: 'RBhEXS',
      architecture: 'ARM 32bit',
      cpu: 'QCA9531 650MHz',
      ram: '256 MB',
      storage: '16 MB',
      ethernetPorts: 5,
      sfpPorts: 1,
      totalPorts: 6,
      maxThroughput: '1 Gbps',
      useCase: 'Small Office, Home'
    },
    {
      id: 'hex',
      name: 'hEX',
      series: 'hEX',
      description: 'Compact 5-port router',
      routerboard: 'RBhEX',
      architecture: 'ARM 32bit',
      cpu: 'QCA9531 880MHz',
      ram: '256 MB',
      storage: '16 MB',
      ethernetPorts: 5,
      sfpPorts: 0,
      totalPorts: 5,
      maxThroughput: '1 Gbps',
      useCase: 'Small Office, SOHO'
    },
    {
      id: 'hexlite',
      name: 'hEX lite',
      series: 'hEX',
      description: 'Budget-friendly desktop router',
      routerboard: 'RBhEX lite',
      architecture: 'MIPS 32bit',
      cpu: 'QCA9531 650MHz',
      ram: '64 MB',
      storage: '16 MB',
      ethernetPorts: 5,
      sfpPorts: 0,
      totalPorts: 5,
      maxThroughput: '500 Mbps',
      useCase: 'Home, Small Office'
    },
    
    // CRS Series - Cloud Router Switch
    {
      id: 'crs326-24g-2splus',
      name: 'CRS326-24G-2S+',
      series: 'CRS3xx',
      description: '24-port switch with RouterOS',
      routerboard: 'CRS326-24G-2S+',
      architecture: 'ARM 32bit',
      cpu: 'Marvell 98DX3236 800MHz',
      ram: '512 MB',
      storage: '16 MB',
      ethernetPorts: 24,
      sfpPorts: 0,
      sfpPlusPorts: 2,
      totalPorts: 26,
      maxThroughput: '18 Gbps',
      useCase: 'Access Layer, Small Campus'
    },
    {
      id: 'crs328-24p-4splus',
      name: 'CRS328-24P-4S+',
      series: 'CRS3xx',
      description: '24-port PoE switch',
      routerboard: 'CRS328-24P-4S+',
      architecture: 'ARM 32bit',
      cpu: 'Marvell 98DX3257 800MHz',
      ram: '512 MB',
      storage: '16 MB',
      ethernetPorts: 24,
      sfpPorts: 0,
      sfpPlusPorts: 4,
      totalPorts: 28,
      maxThroughput: '32 Gbps',
      useCase: 'PoE Access Layer, IP Camera'
    },
    {
      id: 'crs354-48g-4splus',
      name: 'CRS354-48G-4S+2Q+',
      series: 'CRS3xx',
      description: '48-port enterprise switch',
      routerboard: 'CRS354-48G-4S+2Q+',
      architecture: 'ARM 64bit',
      cpu: 'Marvell 98DX3257 800MHz',
      ram: '1 GB',
      storage: '128 MB',
      ethernetPorts: 48,
      sfpPorts: 0,
      sfpPlusPorts: 4,
      qsfpPorts: 2,
      totalPorts: 54,
      maxThroughput: '120 Gbps',
      useCase: 'Enterprise Core, Large Campus'
    },
    
    // Wireless/LTE
    {
      id: 'chateau5g',
      name: 'Chateau 5G',
      series: 'LTE',
      description: '5G home router',
      routerboard: 'Chateau 5G',
      architecture: 'ARM 32bit',
      cpu: 'IPQ-4019 717MHz',
      ram: '256 MB',
      storage: '128 MB NAND',
      ethernetPorts: 3,
      sfpPorts: 0,
      totalPorts: 3,
      maxThroughput: '1 Gbps',
      useCase: 'Home 5G, Backup WAN'
    },
    {
      id: 'ltehg',
      name: 'LtAP mini LTE',
      series: 'LTE',
      description: 'Compact LTE router',
      routerboard: 'RBLtAP-2HnD',
      architecture: 'MIPS 32bit',
      cpu: 'QCA9531 650MHz',
      ram: '64 MB',
      storage: '16 MB',
      ethernetPorts: 2,
      sfpPorts: 0,
      totalPorts: 2,
      maxThroughput: '300 Mbps',
      useCase: 'Mobile, Backup Connection'
    }
  ]

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ipAddress.includes(searchTerm) ||
    device.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-gray-400'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'inactive':
        return 'Nonaktif'
      case 'error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  const handleAddRouter = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedModel = getModelSpecs(formData.selectedModel)
    if (!selectedModel) return

    try {
      const deviceData = {
        name: formData.name,
        ipAddress: formData.ipAddress,
        username: formData.username,
        password: formData.password,
        port: formData.port,
        apiPort: formData.apiPort,
        location: formData.location,
        description: formData.description,
        model: selectedModel.name,
        routerboard: selectedModel.routerboard,
        architecture: selectedModel.architecture,
        totalPorts: selectedModel.totalPorts,
        sfpPorts: selectedModel.sfpPorts || 0,
        ethernetPorts: selectedModel.ethernetPorts
      }

      await api.mikrotik.create(deviceData)
      await fetchDevices()
      setShowAddModal(false)
      setFormData({
        name: '',
        ipAddress: '',
        username: 'admin',
        password: '',
        port: 8728,
        apiPort: 8729,
        location: '',
        description: '',
        selectedModel: ''
      })
      alert('Router berhasil ditambahkan!')
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan router')
    }
  }

  const getModelSpecs = (modelId: string) => {
    return mikrotikModels.find(m => m.id === modelId)
  }

  // Detail View
  if (selectedDevice) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedDevice(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{selectedDevice.name}</h1>
              <p className="text-gray-600">{selectedDevice.ipAddress} • {selectedDevice.location}</p>
            </div>
            <button 
              onClick={() => fetchInterfaces(selectedDevice.id)}
              disabled={loadingInterfaces}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              <RefreshCw className={`h-4 w-4 ${loadingInterfaces ? 'animate-spin' : ''}`} />
              {loadingInterfaces ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('port-details')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'port-details'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Port Details
                </button>
                <button
                  onClick={() => setActiveTab('bgp-sessions')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'bgp-sessions'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  BGP Sessions
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content - Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

          {/* System Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-semibold">{selectedDevice.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">RouterBoard</p>
                <p className="font-semibold">{selectedDevice.routerboard}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Architecture</p>
                <p className="font-semibold">{selectedDevice.architecture}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">RouterOS Version</p>
                <p className="font-semibold">{selectedDevice.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serial Number</p>
                <p className="font-mono text-sm">{selectedDevice.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="font-semibold">{selectedDevice.uptime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ports</p>
                <p className="font-semibold">{selectedDevice.totalPorts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SFP Ports</p>
                <p className="font-semibold text-blue-600">{selectedDevice.sfpPorts} / Ethernet: {selectedDevice.ethernetPorts}</p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  CPU
                </h3>
                <span className="text-2xl font-bold">{selectedDevice.cpu}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${selectedDevice.cpu}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                  Memory
                </h3>
                <span className="text-2xl font-bold">{selectedDevice.memory}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${selectedDevice.memory}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Network className="h-5 w-5 text-green-600" />
                  Disk
                </h3>
                <span className="text-2xl font-bold">{selectedDevice.disk}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${selectedDevice.disk}%` }}
                />
              </div>
            </div>
          </div>

          {/* Live Bandwidth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Live Bandwidth Monitoring (Real-time Upload/Download)
            </h2>
            {bandwidthData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bandwidthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis unit=" Mbps" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="Download" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDownload)" name="Download (Rx)" />
                    <Area type="monotone" dataKey="Upload" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUpload)" name="Upload (Tx)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-500">
                Hubungkan perangkat atau pastikan perangkat aktif untuk melacak traffic bandwidth.
              </div>
            )}
          </div>

          {/* Network Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BGP Sessions (Mock data for demonstration) */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="h-6 w-6" />
                <h3 className="text-lg font-semibold">BGP Sessions</h3>
              </div>
              <div className="text-5xl font-bold mb-2">
                {selectedDevice.interfaces?.filter(i => i.status === 'up').length || 0} / {selectedDevice.interfaces?.length || 0}
              </div>
              <p className="text-purple-100">All sessions established</p>
            </div>

            {/* Active Ports Utilization */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Network className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Active Ports</h3>
              </div>
              <div className="text-5xl font-bold mb-2">
                {selectedDevice.interfaces?.filter(i => i.status === 'up').length || 0} / {selectedDevice.totalPorts || 0}
              </div>
              <p className="text-blue-100">
                {Math.round(((selectedDevice.interfaces?.filter(i => i.status === 'up').length || 0) / (selectedDevice.totalPorts || 1)) * 100)}% utilization
              </p>
            </div>
          </div>

          {/* Hardware Specifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Hardware Specifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-2xl">⚡</span>
                  <span className="font-medium">Power Supply</span>
                </div>
                <span className="font-semibold text-gray-900">DC 10-57V (PoE-In)</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3 text-gray-700">
                  <Server className="h-5 w-5" />
                  <span className="font-medium">Form Factor</span>
                </div>
                <span className="font-semibold text-gray-900">Desktop / Rack Mount</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3 text-gray-700">
                  <Network className="h-5 w-5" />
                  <span className="font-medium">Max Throughput</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {selectedDevice.interfaces?.reduce((sum, i) => {
                    const speed = parseInt(i.speed.replace(/[^0-9]/g, '')) || 0;
                    return sum + speed;
                  }, 0) || 0} Mbps
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3 text-gray-700">
                  <HardDrive className="h-5 w-5" />
                  <span className="font-medium">RAM Size</span>
                </div>
                <span className="font-semibold text-purple-600">4 GB DDR4</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-xl">🔢</span>
                  <span className="font-medium">Serial Number</span>
                </div>
                <span className="font-mono font-semibold text-gray-900">{selectedDevice.serialNumber}</span>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Tab Content - Port Details */}
          {activeTab === 'port-details' && selectedDevice.interfaces && selectedDevice.interfaces.length > 0 && (
            <div className="space-y-6">
              {/* Port Configuration Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Port Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(() => {
                    const portsByType = {
                      '1G': selectedDevice.interfaces?.filter(i => i.speed.includes('1000') || i.speed.includes('1G')).length || 0,
                      '10G': selectedDevice.interfaces?.filter(i => i.speed.includes('10G') || i.speed.includes('10000')).length || 0,
                      'SFP': selectedDevice.interfaces?.filter(i => i.type === 'sfp' && !i.speed.includes('10G')).length || 0,
                      'SFP+': selectedDevice.interfaces?.filter(i => i.type === 'sfp' && i.speed.includes('10G')).length || 0
                    };
                    return (
                      <>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600 mb-2">1G Ports</p>
                          <p className="text-4xl font-bold text-green-600">{portsByType['1G']}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600 mb-2">10G Ports</p>
                          <p className="text-4xl font-bold text-orange-600">{portsByType['10G']}</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600 mb-2">SFP Ports</p>
                          <p className="text-4xl font-bold text-cyan-600">{portsByType['SFP']}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600 mb-2">SFP+ Ports</p>
                          <p className="text-4xl font-bold text-indigo-600">{portsByType['SFP+']}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Port Map */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Port Map</h2>
                <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-3 mb-6">
                  {selectedDevice.interfaces.map((port, index) => (
                    <div 
                      key={port.id}
                      className={`p-3 rounded-lg border-2 text-center ${
                        port.status === 'up' 
                          ? 'bg-blue-50 border-blue-300' 
                          : port.status === 'disabled'
                          ? 'bg-gray-100 border-gray-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <p className="font-bold text-sm">P{index + 1}</p>
                      <p className="text-xs text-gray-600 mt-1">{port.description || port.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{port.type}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
                    <span>Trunk/Uplink</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                    <span>Down/Inactive</span>
                  </div>
                </div>
              </div>

              {/* Port Details Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Port Details</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Port</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Speed</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">RX</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">TX</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedDevice.interfaces.map((port) => (
                        <tr key={port.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{port.name}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              port.status === 'up' 
                                ? 'bg-green-100 text-green-700' 
                                : port.status === 'disabled'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                port.status === 'up' ? 'bg-green-500' : port.status === 'disabled' ? 'bg-gray-400' : 'bg-red-500'
                              }`}></span>
                              {port.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">{port.speed}</td>
                          <td className="px-6 py-4 text-gray-600">{port.description || '-'}</td>
                          <td className="px-6 py-4 text-right font-mono text-sm">{port.rxBytes}</td>
                          <td className="px-6 py-4 text-right font-mono text-sm">{port.txBytes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - BGP Sessions */}
          {activeTab === 'bgp-sessions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">BGP Sessions</h2>
                
                {/* BGP Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Established</p>
                        <p className="text-3xl font-bold text-green-600">8</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <Wifi className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Idle</p>
                        <p className="text-3xl font-bold text-yellow-600">2</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Peers</p>
                        <p className="text-3xl font-bold text-blue-600">10</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Network className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BGP Peers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Peer Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Remote AS</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Remote Address</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uptime</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Prefixes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'Upstream-ISP1', asn: '65001', ip: '203.0.113.1', status: 'Established', uptime: '15d 8h', prefixes: 850234 },
                        { name: 'Upstream-ISP2', asn: '65002', ip: '203.0.113.2', status: 'Established', uptime: '12d 4h', prefixes: 823156 },
                        { name: 'Peer-IX-Jakarta', asn: '65010', ip: '10.10.1.1', status: 'Established', uptime: '8d 2h', prefixes: 45678 },
                        { name: 'Peer-IX-Surabaya', asn: '65011', ip: '10.10.1.2', status: 'Established', uptime: '5d 12h', prefixes: 38921 },
                        { name: 'Customer-Corp1', asn: '65100', ip: '192.168.1.1', status: 'Established', uptime: '3d 6h', prefixes: 128 },
                        { name: 'Customer-Corp2', asn: '65101', ip: '192.168.1.2', status: 'Established', uptime: '2d 18h', prefixes: 256 },
                        { name: 'Customer-ISP-Small', asn: '65102', ip: '192.168.1.3', status: 'Established', uptime: '1d 5h', prefixes: 512 },
                        { name: 'Backup-Transit', asn: '65003', ip: '203.0.113.3', status: 'Established', uptime: '22h 15m', prefixes: 789345 },
                        { name: 'Regional-Peer1', asn: '65020', ip: '10.20.1.1', status: 'Idle', uptime: '0h 0m', prefixes: 0 },
                        { name: 'Regional-Peer2', asn: '65021', ip: '10.20.1.2', status: 'Idle', uptime: '0h 0m', prefixes: 0 }
                      ].map((peer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{peer.name}</td>
                          <td className="px-6 py-4 font-mono text-sm text-gray-600">AS{peer.asn}</td>
                          <td className="px-6 py-4 font-mono text-sm text-gray-600">{peer.ip}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              peer.status === 'Established'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                peer.status === 'Established' ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></span>
                              {peer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm text-gray-600">{peer.uptime}</td>
                          <td className="px-6 py-4 text-right font-mono text-sm text-gray-600">
                            {peer.prefixes.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat data MikroTik...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen MikroTik</h1>
                <p className="text-gray-600">Kelola router MikroTik dan koneksi API</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="h-5 w-5" />
                Tambah Router
              </button>
            </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Router</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{devices.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Server className="text-blue-600 h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Router Aktif</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {devices.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Power className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Router Offline</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {devices.filter(d => d.status === 'inactive').length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <AlertCircle className="text-gray-600 h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Router Error</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {devices.filter(d => d.status === 'error').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Wifi className="text-red-600 h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, IP address, atau lokasi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Router
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Port API
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Connected
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr 
                    key={device.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleDeviceClick(device)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`} />
                        <div>
                          <p className="font-semibold text-gray-900">{device.name}</p>
                          <p className="text-sm text-gray-500">{device.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{device.ipAddress}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{device.location || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{device.apiPort}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        device.status === 'active' ? 'bg-green-100 text-green-700' :
                        device.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {getStatusText(device.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{device.lastConnected || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTestConnection(device.id)
                          }}
                          title="Test Connection"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(device.id)
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-12">
              <Server className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada router ditemukan</h3>
              <p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Add Router Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Tambah Router MikroTik</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRouter} className="p-6">
              {/* Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Pilih Model MikroTik *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2 border rounded-lg">
                  {mikrotikModels.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => setFormData({...formData, selectedModel: model.id})}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.selectedModel === model.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{model.name}</h3>
                          <p className="text-xs text-gray-500">{model.series}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          model.series.includes('CCR') ? 'bg-purple-100 text-purple-700' :
                          model.series.includes('RB') ? 'bg-blue-100 text-blue-700' :
                          model.series.includes('CRS') ? 'bg-green-100 text-green-700' :
                          model.series.includes('hEX') ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {model.series}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">CPU:</span>
                          <p className="font-medium text-gray-700">{model.cpu}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">RAM:</span>
                          <p className="font-medium text-gray-700">{model.ram}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Ports:</span>
                          <p className="font-medium text-gray-700">
                            {model.ethernetPorts}× GbE
                            {model.sfpPorts ? ` + ${model.sfpPorts}× SFP` : ''}
                            {model.sfpPlusPorts ? ` + ${model.sfpPlusPorts}× SFP+` : ''}
                            {model.qsfpPorts ? ` + ${model.qsfpPorts}× QSFP+` : ''}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Max:</span>
                          <p className="font-medium text-gray-700">{model.maxThroughput}</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <span className="text-xs text-gray-500">Use Case:</span>
                        <p className="text-xs font-medium text-blue-600">{model.useCase}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Model Info */}
              {formData.selectedModel && getModelSpecs(formData.selectedModel) && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Model Terpilih:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Model:</span>
                      <p className="font-bold">{getModelSpecs(formData.selectedModel)?.name}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Architecture:</span>
                      <p className="font-semibold">{getModelSpecs(formData.selectedModel)?.architecture}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Total Ports:</span>
                      <p className="font-semibold">{getModelSpecs(formData.selectedModel)?.totalPorts}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Throughput:</span>
                      <p className="font-semibold">{getModelSpecs(formData.selectedModel)?.maxThroughput}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Connection Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Router *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MikroTik Central"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IP Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="admin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SSH Port
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    API Port
                  </label>
                  <input
                    type="number"
                    value={formData.apiPort}
                    onChange={(e) => setFormData({...formData, apiPort: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Kantor Pusat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Router utama untuk..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formData.selectedModel}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Tambah Router
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
