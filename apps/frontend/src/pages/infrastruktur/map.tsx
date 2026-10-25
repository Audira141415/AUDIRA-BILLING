import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Map as MapIcon, Plus, Search, MapPin, Wifi, Server, Router, HardDrive, 
  Terminal, RefreshCw, AlertTriangle, ShieldCheck, Play, ArrowRight 
} from 'lucide-react'

interface NetworkDevice {
  id: string
  name: string
  type: 'router' | 'switch' | 'odp' | 'access-point'
  ipAddress?: string
  latitude: number
  longitude: number
  x: number // X coordinate for SVG map
  y: number // Y coordinate for SVG map
  status: 'online' | 'offline' | 'warning'
  description?: string
  connectedTo?: string // Parent node ID
  latencyHistory: number[]
}

export default function MapPerangkat() {
  const [devices, setDevices] = useState<NetworkDevice[]>([
    {
      id: '1',
      name: 'MikroTik Core Router',
      type: 'router',
      ipAddress: '192.168.1.1',
      latitude: -6.2088,
      longitude: 106.8456,
      x: 100,
      y: 200,
      status: 'online',
      description: 'Router Utama di Head Office',
      latencyHistory: [4, 5, 3, 4, 6, 5, 4, 5, 4, 3]
    },
    {
      id: '2',
      name: 'Switch-Dist-01',
      type: 'switch',
      ipAddress: '192.168.1.10',
      latitude: -6.2098,
      longitude: 106.8466,
      x: 300,
      y: 200,
      status: 'online',
      description: 'Switch Distribusi Area Barat',
      connectedTo: '1',
      latencyHistory: [7, 8, 9, 7, 8, 12, 9, 8, 7, 8]
    },
    {
      id: '3',
      name: 'ODP-Kemang-01',
      type: 'odp',
      latitude: -6.2108,
      longitude: 106.8476,
      x: 500,
      y: 100,
      status: 'online',
      description: 'ODP di perumahan cluster A',
      connectedTo: '2',
      latencyHistory: [12, 14, 15, 13, 11, 14, 15, 12, 11, 13]
    },
    {
      id: '4',
      name: 'ODP-Kemang-02',
      type: 'odp',
      latitude: -6.2118,
      longitude: 106.8486,
      x: 500,
      y: 300,
      status: 'online',
      description: 'ODP di perumahan cluster B',
      connectedTo: '2',
      latencyHistory: [15, 18, 14, 16, 22, 18, 15, 14, 15, 16]
    },
    {
      id: '5',
      name: 'AP-Customer-Sato',
      type: 'access-point',
      ipAddress: '192.168.1.50',
      latitude: -6.2128,
      longitude: 106.8496,
      x: 700,
      y: 100,
      status: 'online',
      description: 'Access Point pelanggan korporat',
      connectedTo: '3',
      latencyHistory: [22, 25, 21, 24, 28, 32, 24, 22, 21, 23]
    },
    {
      id: '6',
      name: 'AP-Customer-Dua',
      type: 'access-point',
      ipAddress: '192.168.1.51',
      latitude: -6.2138,
      longitude: 106.8506,
      x: 700,
      y: 300,
      status: 'warning',
      description: 'Access Point pelanggan residensial',
      connectedTo: '4',
      latencyHistory: [45, 82, 91, 38, 44, 110, 52, 48, 39, 42]
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'router' | 'switch' | 'odp' | 'access-point'>('all')
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  
  // Interactive Terminal State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [isPingRunning, setIsPingRunning] = useState(false)
  const [isRebooting, setIsRebooting] = useState(false)

  // Auto update active stats to simulate real-time latency
  useEffect(() => {
    const timer = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(dev => {
          if (dev.status === 'offline') return dev
          const baseLatency = dev.type === 'router' ? 4 : dev.type === 'switch' ? 8 : dev.type === 'odp' ? 12 : 25
          const variance = Math.floor(Math.random() * 6) - 3 // -3 to +3 ms
          const newLatency = Math.max(1, baseLatency + variance + (dev.status === 'warning' ? 30 : 0))
          const newHistory = [...dev.latencyHistory.slice(1), newLatency]
          return { ...dev, latencyHistory: newHistory }
        })
      )
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Handle click on device node
  const handleSelectDevice = (device: NetworkDevice) => {
    setSelectedDevice(device)
    setTerminalLogs([`-- System initialized for ${device.name} [IP: ${device.ipAddress || 'N/A'}] --`])
    setIsPingRunning(false)
    setIsRebooting(false)
  }

  // Filtered devices
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.ipAddress || '').includes(searchTerm)
    const matchesType = typeFilter === 'all' || device.type === typeFilter
    return matchesSearch && matchesType
  })

  // Start ping simulation
  const startPing = () => {
    if (!selectedDevice || isPingRunning) return
    setIsPingRunning(true)
    setTerminalLogs(prev => [...prev, `PING ${selectedDevice.ipAddress || '127.0.0.1'} with 32 bytes of data:`])
    
    let count = 0
    const pingInterval = setInterval(() => {
      if (count >= 5) {
        clearInterval(pingInterval)
        setIsPingRunning(false)
        setTerminalLogs(prev => [...prev, `Ping stats: Packets Sent = 5, Received = 5, Lost = 0 (0% loss)`])
        return
      }
      
      const time = selectedDevice.latencyHistory[selectedDevice.latencyHistory.length - 1 - count] || 5
      setTerminalLogs(prev => [
        ...prev, 
        `Reply from ${selectedDevice.ipAddress || '127.0.0.1'}: bytes=32 time=${time}ms TTL=64`
      ])
      count++
    }, 800)
  }

  // Start reboot simulation
  const startReboot = () => {
    if (!selectedDevice || isRebooting) return
    setIsRebooting(true)
    setTerminalLogs(prev => [...prev, `[SYSTEM] Sending reboot command to ${selectedDevice.name}...`])
    
    // Step 1: Device goes offline
    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'offline' } : d))
      setTerminalLogs(prev => [...prev, `[WARN] Connection lost with host ${selectedDevice.ipAddress || '127.0.0.1'}`])
    }, 1500)

    // Step 2: Device booting (warning)
    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'warning' } : d))
      setTerminalLogs(prev => [...prev, `[INFO] Host ${selectedDevice.ipAddress || '127.0.0.1'} is online. Booting services...`])
    }, 4500)

    // Step 3: Online again
    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'online' } : d))
      setTerminalLogs(prev => [...prev, `[SUCCESS] Reboot successful. All services running normal.`])
      setIsRebooting(false)
      // Update selected device info state
      setSelectedDevice(prev => prev ? { ...prev, status: 'online' } : null)
    }, 7000)
  }

  const getDeviceIcon = (type: string, status: string) => {
    const color = status === 'offline' ? 'text-red-500' : status === 'warning' ? 'text-orange-500' : 'text-green-500'
    switch (type) {
      case 'router':
        return <Router className={color} size={20} />
      case 'switch':
        return <Server className={color} size={20} />
      case 'odp':
        return <HardDrive className={color} size={20} />
      case 'access-point':
        return <Wifi className={color} size={20} />
      default:
        return <MapPin className={color} size={20} />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-400 border border-green-500/20'
      case 'offline':
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
      case 'warning':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
      default:
        return 'bg-gray-500/10 text-slate-500'
    }
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-8 text-[var(--app-text)]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)] flex items-center gap-2">
              <MapIcon className="text-blue-500 animate-pulse" />
              NOC Cyber-Map Dashboard
            </h1>
            <p className="text-[var(--app-text-muted)] mt-1">Sistem visualisasi infrastruktur jaringan dan distribusi ODP real-time</p>
          </div>
          <div className="flex bg-[var(--app-card)] border border-[var(--app-border)] p-1.5 rounded-lg text-sm shadow-sm">
            <div className="flex items-center gap-1.5 px-3 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-semibold text-[var(--app-text)]">Live Network Stream Active</span>
            </div>
          </div>
        </div>

        {/* Top Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 hover:border-[var(--app-border-strong)] transition-colors shadow-sm">
            <p className="text-[var(--app-text-muted)] text-xs font-medium uppercase tracking-wider">Total Perangkat</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[var(--app-text)]">{devices.length}</span>
              <span className="text-xs text-[var(--app-text-dim)]">Nodes</span>
            </div>
          </div>
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 hover:border-[var(--app-border-strong)] transition-colors shadow-sm">
            <p className="text-[var(--app-text-muted)] text-xs font-medium uppercase tracking-wider">Online</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-green-500">
                {devices.filter(d => d.status === 'online').length}
              </span>
              <span className="text-xs text-[var(--app-text-dim)]">Normal</span>
            </div>
          </div>
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 hover:border-[var(--app-border-strong)] transition-colors shadow-sm">
            <p className="text-[var(--app-text-muted)] text-xs font-medium uppercase tracking-wider">Warning State</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-orange-500">
                {devices.filter(d => d.status === 'warning').length}
              </span>
              <span className="text-xs text-[var(--app-text-dim)]">Latency High</span>
            </div>
          </div>
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-5 hover:border-[var(--app-border-strong)] transition-colors shadow-sm">
            <p className="text-[var(--app-text-muted)] text-xs font-medium uppercase tracking-wider">Offline State</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-red-500">
                {devices.filter(d => d.status === 'offline').length}
              </span>
              <span className="text-xs text-[var(--app-text-dim)]">No Ping</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Interactive Map & Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Interactive SVG Network Map */}
          <div className="lg:col-span-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[450px] shadow-sm">
            <div className="absolute inset-0 bg-[var(--app-card-subtle)]/50 bg-[linear-gradient(to_right,rgba(100,116,139,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 z-10">
              <h2 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                <Wifi size={18} className="text-blue-500" />
                Topologi Jaringan & Distribusi ODP
              </h2>
              <span className="text-xs text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] border border-[var(--app-border)] px-2.5 py-1 rounded-md">
                Klik perangkat untuk menguji
              </span>
            </div>

            {/* Map Canvas */}
            <div className="relative flex-1 flex items-center justify-center">
              <svg className="w-full h-full max-h-[350px] overflow-visible z-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                
                {/* Connections Lines */}
                {devices.map(dev => {
                  if (!dev.connectedTo) return null
                  const parent = devices.find(p => p.id === dev.connectedTo)
                  if (!parent) return null
                  const isLinkWarning = dev.status === 'warning' || parent.status === 'warning'
                  const isLinkOffline = dev.status === 'offline' || parent.status === 'offline'
                  
                  let strokeColor = 'stroke-green-500/40'
                  let dashArray = '5,5'
                  let strokeWidth = 2

                  if (isLinkOffline) {
                    strokeColor = 'stroke-red-500/20'
                    dashArray = 'none'
                  } else if (isLinkWarning) {
                    strokeColor = 'stroke-orange-500/50'
                    dashArray = '4,4'
                  }

                  return (
                    <g key={`link-${dev.id}`}>
                      {/* Base Connection line */}
                      <line 
                        x1={parent.x} 
                        y1={parent.y} 
                        x2={dev.x} 
                        y2={dev.y} 
                        className={`${strokeColor} transition-all duration-500`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={dashArray}
                      />
                      {/* Animated Flow Dot */}
                      {!isLinkOffline && (
                        <circle r="4" className={dev.status === 'warning' ? 'fill-orange-400' : 'fill-green-400'}>
                          <animateMotion 
                            path={`M ${parent.x} ${parent.y} L ${dev.x} ${dev.y}`} 
                            dur={dev.status === 'warning' ? "4s" : "2s"} 
                            repeatCount="indefinite" 
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}

                {/* Nodes rendering */}
                {devices.map(dev => {
                  const isSelected = selectedDevice?.id === dev.id
                  let nodeColor = 'fill-slate-900 stroke-green-500'
                  let pulseColor = 'fill-green-500'
                  
                  if (dev.status === 'offline') {
                    nodeColor = 'fill-slate-900 stroke-red-500'
                    pulseColor = 'fill-red-500'
                  } else if (dev.status === 'warning') {
                    nodeColor = 'fill-slate-900 stroke-orange-500'
                    pulseColor = 'fill-orange-500'
                  }

                  return (
                    <g 
                      key={`node-${dev.id}`}
                      transform={`translate(${dev.x}, ${dev.y})`}
                      className="cursor-pointer group"
                      onClick={() => handleSelectDevice(dev)}
                    >
                      {/* Pulsing ring if selected or warning */}
                      {(isSelected || dev.status === 'warning') && (
                        <circle r="22" className={`${pulseColor} opacity-20 animate-ping`} />
                      )}
                      
                      {/* Main node circle */}
                      <circle 
                        r={isSelected ? 18 : 15} 
                        className={`${nodeColor} transition-all duration-300 hover:scale-110`}
                        strokeWidth={isSelected ? 3 : 2}
                      />

                      {/* Icon type shorthand in SVG */}
                      <text 
                        textAnchor="middle" 
                        dy=".3em" 
                        fontSize="9px" 
                        fontWeight="bold" 
                        className="fill-slate-200 select-none pointer-events-none"
                      >
                        {dev.type === 'router' ? 'RTR' : dev.type === 'switch' ? 'SW' : dev.type === 'odp' ? 'ODP' : 'AP'}
                      </text>

                      {/* Tooltip Name label */}
                      <text 
                        y="-26" 
                        textAnchor="middle" 
                        className="fill-slate-200 text-[11px] font-semibold bg-slate-50/80 pointer-events-none select-none"
                      >
                        {dev.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            
            {/* Map Legend */}
            <div className="flex gap-4 text-xs text-slate-400 mt-2 z-10 bg-slate-50/40 p-2 rounded-lg border border-slate-800/50 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Router Central
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Switch Distribusi
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> ODP Box
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Access Point (AP)
              </div>
            </div>
          </div>

          {/* Interactive Control & Details Side Panel */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            {selectedDevice ? (
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Details Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedDevice.status)}`}>
                      {selectedDevice.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-[var(--app-text-dim)]">ID: {selectedDevice.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[var(--app-text)] flex items-center gap-2 mb-1">
                    {getDeviceIcon(selectedDevice.type, selectedDevice.status)}
                    {selectedDevice.name}
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] font-mono mb-4">{selectedDevice.ipAddress || 'IP: N/A'}</p>
                  <p className="text-sm text-[var(--app-text)] bg-[var(--app-card-subtle)] p-3 rounded-lg border border-[var(--app-border)] mb-4">
                    {selectedDevice.description}
                  </p>

                  {/* Sparkline Latency simulation */}
                  <div className="mb-4">
                    <p className="text-xs text-[var(--app-text-muted)] mb-2 font-semibold">Latency Real-Time (Last 10 pings)</p>
                    <div className="flex items-end gap-1 h-14 bg-[var(--app-card-subtle)] p-2 rounded-lg border border-[var(--app-border)]">
                      {selectedDevice.latencyHistory.map((lat, idx) => {
                        const maxH = 40
                        const h = Math.min(maxH, (lat / 120) * maxH)
                        const color = lat > 80 ? 'bg-red-500' : lat > 40 ? 'bg-orange-500' : 'bg-green-500'
                        return (
                          <div 
                            key={idx} 
                            style={{ height: `${h}px` }} 
                            className={`flex-1 ${color} rounded-t transition-all duration-300`} 
                            title={`${lat} ms`}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Interactive Operations Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                      onClick={startPing}
                      disabled={isPingRunning || isRebooting || selectedDevice.status === 'offline'}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                      <Play size={16} />
                      Ping Test
                    </button>
                    <button 
                      onClick={startReboot}
                      disabled={isRebooting || isPingRunning}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-hover)] disabled:opacity-50 text-[var(--app-text)] rounded-lg text-sm font-semibold border border-[var(--app-border)] transition-colors shadow-sm"
                    >
                      <RefreshCw size={14} className={isRebooting ? 'animate-spin' : ''} />
                      Reboot Node
                    </button>
                  </div>
                </div>

                {/* Cyber Console Terminal */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-emerald-400 h-44 overflow-y-auto flex flex-col justify-between shadow-inner">
                  <div className="space-y-1">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-1.5">
                        <span className="text-slate-600 select-none">&gt;</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-slate-500">
                    <Terminal size={12} />
                    <span>NOC_Terminal_v1.0.4</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <MapPin className="text-[var(--app-text-dim)] animate-bounce mb-4" size={48} />
                <h3 className="text-lg font-bold text-[var(--app-text)] mb-2">Pilih Perangkat</h3>
                <p className="text-[var(--app-text-muted)] text-sm max-w-[250px]">
                  Klik salah satu node di peta untuk memuat data monitoring, statistik ping, dan kontrol perangkat.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Filters & Search */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-text-dim)]" size={18} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama perangkat atau IP address..."
                className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-[var(--app-primary)] focus:ring-1 focus:ring-[var(--app-primary)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(['all', 'router', 'switch', 'odp', 'access-point'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    typeFilter === type 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm' 
                      : 'bg-[var(--app-card-subtle)] border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-card-hover)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {type === 'all' ? 'Semua' : type === 'access-point' ? 'Access Point' : type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Devices List Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-[var(--app-border)]">
            <thead className="bg-[var(--app-card-subtle)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Perangkat</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Koordinat</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--app-border)] bg-[var(--app-card)]">
              {filteredDevices.map(device => (
                <tr key={device.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-[var(--app-card-subtle)] p-2 rounded-lg border border-[var(--app-border)]">
                        {getDeviceIcon(device.type, device.status)}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--app-text)]">{device.name}</div>
                        <div className="text-xs text-[var(--app-text-dim)] uppercase">{device.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[var(--app-text)]">
                    {device.ipAddress || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-[var(--app-text-muted)]">
                    {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      device.status === 'online' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : device.status === 'warning'
                        ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {device.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleSelectDevice(device)}
                      className="text-xs font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      Diagnostik <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--app-text-dim)] text-sm">
                    Tidak ada perangkat yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}
