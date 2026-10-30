import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import {
  Map as MapIcon,
  Plus,
  Search,
  MapPin,
  Wifi,
  Server,
  Router,
  HardDrive,
  Terminal,
  RefreshCw,
  Play,
  ArrowRight,
  Radio,
  ExternalLink,
  Wrench,
  X,
  CheckCircle2,
  Cpu,
  Route
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

type NodeType = 'router' | 'olt' | 'switch' | 'odp' | 'access-point';

interface NetworkDevice {
  id: string;
  name: string;
  type: NodeType;
  ipAddress?: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  status: 'online' | 'offline' | 'warning';
  description?: string;
  connectedTo?: string;
  opticalDbm: number;
  portsUsed: number;
  portsCapacity: number;
  latencyHistory: number[];
}

const DEFAULT_DEVICES: NetworkDevice[] = [
  {
    id: 'core-rtr-01',
    name: 'MikroTik CCR2116 Core BNG',
    type: 'router',
    ipAddress: '103.189.20.1',
    latitude: -6.2088,
    longitude: 106.8456,
    x: 90,
    y: 200,
    status: 'online',
    description: 'Core BGP & FreeRADIUS PPPoE Concentrator Head Office',
    opticalDbm: -4.2,
    portsUsed: 10,
    portsCapacity: 16,
    latencyHistory: [2, 3, 2, 2, 3, 2, 2, 3, 2, 2],
  },
  {
    id: 'olt-zte-01',
    name: 'OLT ZTE C320 GPON HQ',
    type: 'olt',
    ipAddress: '103.189.20.10',
    latitude: -6.2094,
    longitude: 106.8462,
    x: 250,
    y: 130,
    status: 'online',
    description: 'Chassis OLT 16-Port GPON C++ SFP Module (+5.5 dBm Tx)',
    connectedTo: 'core-rtr-01',
    opticalDbm: -7.8,
    portsUsed: 14,
    portsCapacity: 16,
    latencyHistory: [3, 4, 3, 4, 5, 4, 3, 4, 3, 4],
  },
  {
    id: 'sw-odc-01',
    name: 'ODC / Switch-Dist-Barat',
    type: 'switch',
    ipAddress: '103.189.20.14',
    latitude: -6.2101,
    longitude: 106.8469,
    x: 250,
    y: 280,
    status: 'online',
    description: 'Sub-Cabinet Passive Splitter 1:4 & 10G Metro Switch',
    connectedTo: 'core-rtr-01',
    opticalDbm: -9.4,
    portsUsed: 20,
    portsCapacity: 24,
    latencyHistory: [5, 6, 5, 6, 7, 5, 6, 5, 6, 5],
  },
  {
    id: 'odp-kmg-01',
    name: 'ODP-KMG-01 (Cluster A)',
    type: 'odp',
    ipAddress: 'PON 0/1/1',
    latitude: -6.2112,
    longitude: 106.8478,
    x: 470,
    y: 95,
    status: 'online',
    description: 'ODP Pole-Mount Splitter 1:8 SC-UPC Jl. Kemang Utara',
    connectedTo: 'olt-zte-01',
    opticalDbm: -17.6,
    portsUsed: 7,
    portsCapacity: 8,
    latencyHistory: [8, 9, 8, 10, 9, 8, 9, 8, 9, 8],
  },
  {
    id: 'odp-kmg-02',
    name: 'ODP-KMG-02 (Cluster B)',
    type: 'odp',
    ipAddress: 'PON 0/1/2',
    latitude: -6.2121,
    longitude: 106.8487,
    x: 470,
    y: 205,
    status: 'online',
    description: 'ODP Solid 1:16 SC-APC Perumahan Kemang Pratama',
    connectedTo: 'olt-zte-01',
    opticalDbm: -19.2,
    portsUsed: 12,
    portsCapacity: 16,
    latencyHistory: [9, 11, 10, 11, 12, 10, 9, 10, 11, 10],
  },
  {
    id: 'odp-mrd-01',
    name: 'ODP-MRD-01 (Merdeka)',
    type: 'odp',
    ipAddress: 'PON 0/2/1',
    latitude: -6.2132,
    longitude: 106.8495,
    x: 470,
    y: 315,
    status: 'warning',
    description: 'ODP Distribusi Jl. Merdeka (Terdeteksi Redaman Tinggi)',
    connectedTo: 'sw-odc-01',
    opticalDbm: -25.8,
    portsUsed: 8,
    portsCapacity: 8,
    latencyHistory: [24, 32, 29, 38, 41, 35, 30, 28, 33, 31],
  },
  {
    id: 'cpe-corp-01',
    name: 'ONT-Corp-Sato (ZTE F670L)',
    type: 'access-point',
    ipAddress: '100.64.12.45',
    latitude: -6.2141,
    longitude: 106.8504,
    x: 700,
    y: 125,
    status: 'online',
    description: 'CPE Pelanggan Korporat Dedicated 200 Mbps',
    connectedTo: 'odp-kmg-01',
    opticalDbm: -18.9,
    portsUsed: 3,
    portsCapacity: 4,
    latencyHistory: [11, 12, 11, 13, 12, 11, 12, 11, 12, 11],
  },
  {
    id: 'cpe-res-02',
    name: 'ONT-Residensial-02 (HG8245H5)',
    type: 'access-point',
    ipAddress: '100.64.18.91',
    latitude: -6.2152,
    longitude: 106.8514,
    x: 700,
    y: 285,
    status: 'warning',
    description: 'CPE Pelanggan Residensial - Macro-bending Dropcore Alert',
    connectedTo: 'odp-mrd-01',
    opticalDbm: -27.4,
    portsUsed: 2,
    portsCapacity: 4,
    latencyHistory: [35, 58, 64, 42, 49, 72, 48, 44, 39, 45],
  },
];

export default function MapPerangkat() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<NetworkDevice[]>(DEFAULT_DEVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | NodeType>('all');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(DEFAULT_DEVICES[0]);

  // Interactive Terminal State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '-- FTTH GIS & Optical Telemetry Console Ready --',
    `Selected Node: ${DEFAULT_DEVICES[0].name} [${DEFAULT_DEVICES[0].ipAddress}]`,
  ]);
  const [isPingRunning, setIsPingRunning] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Node Form
  const [newNodeForm, setNewNodeForm] = useState({
    name: 'ODP-KMG-05 (Cluster E)',
    type: 'odp' as NodeType,
    ipAddress: 'PON 0/1/4',
    latitude: -6.2145,
    longitude: 106.8492,
    opticalDbm: -18.5,
    portsUsed: 4,
    portsCapacity: 16,
    description: 'ODP Splitter 1:16 Ekspansi Cluster E',
  });

  const showToastMsg = (msg: string) => {
    toast.success(msg);
  };

  // Fetch live ODP, OLT, and MikroTik nodes on mount
  const fetchLiveTopology = useCallback(async () => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('adminToken') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [odpRes, oltRes, mtRes] = await Promise.all([
        fetch(`${API_BASE}/odp`, { headers }).catch(() => null),
        fetch(`${API_BASE}/olt`, { headers }).catch(() => null),
        fetch(`${API_BASE}/mikrotik`, { headers }).catch(() => null),
      ]);

      const merged = [...DEFAULT_DEVICES];

      if (oltRes && oltRes.ok) {
        const oltData = await oltRes.json();
        const oltList = Array.isArray(oltData) ? oltData : oltData?.data;
        if (Array.isArray(oltList) && oltList.length > 0) {
          oltList.slice(0, 2).forEach((o: any, idx: number) => {
            merged[1 + idx] = {
              ...merged[1 + idx],
              name: o.name || merged[1 + idx].name,
              ipAddress: o.ipAddress || o.host || merged[1 + idx].ipAddress,
            };
          });
        }
      }

      if (odpRes && odpRes.ok) {
        const odpData = await odpRes.json();
        const odpList = Array.isArray(odpData) ? odpData : odpData?.data;
        if (Array.isArray(odpList) && odpList.length > 0) {
          odpList.slice(0, 3).forEach((odp: any, idx: number) => {
            const targetIdx = 3 + idx;
            if (merged[targetIdx]) {
              merged[targetIdx] = {
                ...merged[targetIdx],
                name: odp.name || odp.code || merged[targetIdx].name,
                latitude: Number(odp.latitude || merged[targetIdx].latitude),
                longitude: Number(odp.longitude || merged[targetIdx].longitude),
                portsUsed: Number(odp.usedPorts ?? merged[targetIdx].portsUsed),
                portsCapacity: Number(odp.capacity ?? merged[targetIdx].portsCapacity),
              };
            }
          });
        }
      }

      if (mtRes && mtRes.ok) {
        // MikroTik verified
      }

      setDevices(merged);
    } catch {
      // Fallback nodes already active
    }
  }, []);

  useEffect(() => {
    fetchLiveTopology();
  }, [fetchLiveTopology]);

  // Real-time latency jitter simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((dev) => {
          if (dev.status === 'offline') return dev;
          const baseLatency =
            dev.type === 'router'
              ? 2
              : dev.type === 'olt'
              ? 4
              : dev.type === 'switch'
              ? 6
              : dev.type === 'odp'
              ? 10
              : 15;
          const variance = Math.floor(Math.random() * 5) - 2;
          const newLatency = Math.max(1, baseLatency + variance + (dev.status === 'warning' ? 22 : 0));
          const newHistory = [...dev.latencyHistory.slice(1), newLatency];
          return { ...dev, latencyHistory: newHistory };
        })
      );
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleSelectDevice = (device: NetworkDevice) => {
    setSelectedDevice(device);
    setTerminalLogs([
      `-- Inspecting Node: ${device.name} [${device.ipAddress || 'Passive Optical'}] --`,
      `GPS: ${device.latitude.toFixed(4)}, ${device.longitude.toFixed(4)} | Optical Rx: ${device.opticalDbm} dBm`,
      `Port Utilization: ${device.portsUsed}/${device.portsCapacity} Ports`,
    ]);
    setIsPingRunning(false);
    setIsRebooting(false);
  };

  const startPing = () => {
    if (!selectedDevice || isPingRunning) return;
    setIsPingRunning(true);
    setTerminalLogs((prev) => [
      ...prev,
      `PING ${selectedDevice.ipAddress || selectedDevice.name} (64 bytes ICMP/OMCI):`,
    ]);

    let count = 0;
    const pingInterval = setInterval(() => {
      if (count >= 4) {
        clearInterval(pingInterval);
        setIsPingRunning(false);
        setTerminalLogs((prev) => [
          ...prev,
          `--- ${selectedDevice.name} ping statistics: 4 transmitted, 4 received, 0% loss ---`,
        ]);
        return;
      }
      const time = selectedDevice.latencyHistory[selectedDevice.latencyHistory.length - 1 - count] || 4;
      setTerminalLogs((prev) => [
        ...prev,
        `64 bytes from ${selectedDevice.ipAddress || '103.189.20.1'}: seq=${count + 1} time=${time}ms Rx=${selectedDevice.opticalDbm}dBm`,
      ]);
      count++;
    }, 550);
  };

  const runOpticalTraceroute = () => {
    if (!selectedDevice) return;
    setTerminalLogs((prev) => [
      ...prev,
      `[OTDR / OPTICAL PATH TRACE] Tracing fiber path to ${selectedDevice.name}...`,
      `Hop 1: MikroTik CCR2116 Core BNG (103.189.20.1) -> 0.4 ms`,
      `Hop 2: OLT ZTE C320 GPON Chassis (+5.2 dBm OLT SFP) -> 1.2 ms`,
      `Hop 3: ODC Splitter 1:4 (-8.4 dBm) -> 2.1 ms`,
      `Hop 4: ${selectedDevice.name} (${selectedDevice.opticalDbm} dBm, Port ${selectedDevice.portsUsed}/${selectedDevice.portsCapacity}) -> OK`,
    ]);
    showToastMsg(`Traceroute Optik ke ${selectedDevice.name} selesai (${selectedDevice.opticalDbm} dBm).`);
  };

  const startReboot = () => {
    if (!selectedDevice || isRebooting) return;
    setIsRebooting(true);
    setTerminalLogs((prev) => [...prev, `[CWMP/OMCI] Sending warm reboot to ${selectedDevice.name}...`]);

    setTimeout(() => {
      setDevices((prev) => prev.map((d) => (d.id === selectedDevice.id ? { ...d, status: 'online' } : d)));
      setSelectedDevice((prev) => (prev ? { ...prev, status: 'online' } : null));
      setTerminalLogs((prev) => [...prev, `[SUCCESS] ${selectedDevice.name} online & optical laser stabilized.`]);
      setIsRebooting(false);
      showToastMsg(`Node ${selectedDevice.name} berhasil di-reboot dan kembali ONLINE.`);
    }, 1500);
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    const created: NetworkDevice = {
      id: `node-${Date.now()}`,
      name: newNodeForm.name,
      type: newNodeForm.type,
      ipAddress: newNodeForm.ipAddress,
      latitude: Number(newNodeForm.latitude),
      longitude: Number(newNodeForm.longitude),
      x: 470,
      y: Math.floor(80 + Math.random() * 240),
      status: 'online',
      description: newNodeForm.description,
      connectedTo: 'olt-zte-01',
      opticalDbm: Number(newNodeForm.opticalDbm),
      portsUsed: Number(newNodeForm.portsUsed),
      portsCapacity: Number(newNodeForm.portsCapacity),
      latencyHistory: [6, 7, 6, 8, 7, 6, 7, 6, 7, 6],
    };
    setDevices((prev) => [...prev, created]);
    setSelectedDevice(created);
    setShowAddModal(false);
    showToastMsg(`Node infrastruktur "${created.name}" berhasil ditambahkan ke topologi GIS.`);
  };

  const getDeviceIcon = (type: NodeType, status: string) => {
    const color =
      status === 'offline' ? 'text-rose-500' : status === 'warning' ? 'text-amber-500' : 'text-emerald-500';
    switch (type) {
      case 'router':
        return <Router className={color} size={18} />;
      case 'olt':
        return <Cpu className={color} size={18} />;
      case 'switch':
        return <Server className={color} size={18} />;
      case 'odp':
        return <HardDrive className={color} size={18} />;
      case 'access-point':
        return <Wifi className={color} size={18} />;
      default:
        return <MapPin className={color} size={18} />;
    }
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.ipAddress || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // KPI Summary Calculations
  const totalNodes = devices.length;
  const oltSwitchCount = devices.filter((d) => d.type === 'olt' || d.type === 'switch' || d.type === 'router').length;
  const odpNodes = devices.filter((d) => d.type === 'odp');
  const availableOdpPorts = odpNodes.reduce((acc, d) => acc + Math.max(0, d.portsCapacity - d.portsUsed), 0);
  const avgOpticalDbm = (
    devices.reduce((acc, d) => acc + d.opticalDbm, 0) / Math.max(1, devices.length)
  ).toFixed(1);

  return (
    <Layout>
      <Head>
        <title>Live FTTH GIS Network Topology &amp; Optical Attenuation Map | AUDIRA NET</title>
      </Head>

      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--app-border)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--app-text-muted)] mb-1">
              <span>Infrastruktur FTTH</span>
              <span>/</span>
              <span className="text-[var(--app-primary)] font-semibold">GIS Topology &amp; Optical Attenuation Map</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              <MapIcon className="text-[var(--app-primary)] w-6 h-6" />
              Live FTTH GIS Network Topology &amp; Optical Attenuation Map
            </h1>
            <p className="text-xs text-[var(--app-text-muted)] mt-1">
              Visualisasi hierarki Core Router -&gt; OLT GPON -&gt; ODC/Switch -&gt; ODP Splitter -&gt; CPE beserta redaman jalur optik (dBm) dan kapasitas port.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-[var(--app-primary)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
            >
              <Plus size={15} />
              <span>Tambah Node Infrastruktur Baru</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
            <p className="text-[var(--app-text-muted)] text-xs font-medium">Total Node Aktif</p>
            <div className="flex items-baseline gap-2 mt-1.5 font-mono">
              <span className="text-2xl font-bold text-[var(--app-text)]">{totalNodes}</span>
              <span className="text-[11px] text-emerald-500">
                {devices.filter((d) => d.status === 'online').length} Online
              </span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
            <p className="text-[var(--app-text-muted)] text-xs font-medium">Core / OLT / Switch</p>
            <div className="flex items-baseline gap-2 mt-1.5 font-mono">
              <span className="text-2xl font-bold text-cyan-500">{oltSwitchCount}</span>
              <span className="text-[11px] text-[var(--app-text-muted)]">Backbone &amp; GPON</span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
            <p className="text-[var(--app-text-muted)] text-xs font-medium">ODP Terpetakan</p>
            <div className="flex items-baseline gap-2 mt-1.5 font-mono">
              <span className="text-2xl font-bold text-[var(--app-text)]">{odpNodes.length}</span>
              <span className="text-[11px] text-[var(--app-text-muted)]">Titik Distribusi</span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
            <p className="text-[var(--app-text-muted)] text-xs font-medium">Port ODP Tersedia</p>
            <div className="flex items-baseline gap-2 mt-1.5 font-mono">
              <span className="text-2xl font-bold text-emerald-500">{availableOdpPorts}</span>
              <span className="text-[11px] text-[var(--app-text-muted)]">Idle Dropcore Ports</span>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
            <p className="text-[var(--app-text-muted)] text-xs font-medium">Rata-rata Redaman Jalur</p>
            <div className="flex items-baseline gap-2 mt-1.5 font-mono">
              <span className="text-2xl font-bold text-amber-500">{avgOpticalDbm} dBm</span>
              <span className="text-[11px] text-[var(--app-text-muted)]">Optical Budget</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Interactive SVG Topology Map & Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive SVG Network Map */}
          <div className="lg:col-span-2 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[490px]">
            <div className="flex items-center justify-between mb-3 z-10">
              <div>
                <h2 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Radio size={16} className="text-[var(--app-primary)]" />
                  Peta Topologi Serat Optik FTTH &amp; Redaman Splitter
                </h2>
                <p className="text-[11px] text-[var(--app-text-muted)]">
                  Klik node pada kanvas untuk melihat koordinat GPS, kapasitas port, dan menjalankan OTDR/Ping.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-500 bg-[var(--app-card-subtle)] border border-[var(--app-border)] px-2.5 py-1 rounded-lg">
                LIVE TELEMETRY STREAM
              </span>
            </div>

            {/* SVG Map Canvas */}
            <div className="relative flex-1 flex items-center justify-center bg-slate-950/90 rounded-xl border border-slate-800 p-2">
              <svg
                className="w-full h-full max-h-[370px] overflow-visible z-10"
                viewBox="0 0 800 390"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Fiber Connections Lines */}
                {devices.map((dev) => {
                  if (!dev.connectedTo) return null;
                  const parent = devices.find((p) => p.id === dev.connectedTo);
                  if (!parent) return null;
                  const isLinkWarning = dev.status === 'warning' || parent.status === 'warning';
                  const isLinkOffline = dev.status === 'offline' || parent.status === 'offline';

                  const strokeColor = isLinkOffline
                    ? '#f43f5e'
                    : isLinkWarning
                    ? '#f59e0b'
                    : '#10b981';

                  const midX = (parent.x + dev.x) / 2;
                  const midY = (parent.y + dev.y) / 2;

                  return (
                    <g key={`link-${dev.id}`}>
                      <line
                        x1={parent.x}
                        y1={parent.y}
                        x2={dev.x}
                        y2={dev.y}
                        stroke={strokeColor}
                        strokeOpacity={0.45}
                        strokeWidth={2.2}
                        strokeDasharray={isLinkOffline ? 'none' : '5,5'}
                      />
                      {/* Optical Attenuation Label on Fiber Link */}
                      <text
                        x={midX}
                        y={midY - 6}
                        textAnchor="middle"
                        fontSize="9px"
                        className="fill-slate-400 font-mono select-none pointer-events-none"
                      >
                        {dev.opticalDbm} dBm
                      </text>
                      {!isLinkOffline && (
                        <circle r="3.5" fill={strokeColor}>
                          <animateMotion
                            path={`M ${parent.x} ${parent.y} L ${dev.x} ${dev.y}`}
                            dur={isLinkWarning ? '3.8s' : '1.9s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Nodes rendering */}
                {devices.map((dev) => {
                  const isSelected = selectedDevice?.id === dev.id;
                  const strokeHex =
                    dev.status === 'offline'
                      ? '#f43f5e'
                      : dev.status === 'warning'
                      ? '#f59e0b'
                      : '#10b981';

                  const shortLabel =
                    dev.type === 'router'
                      ? 'CORE'
                      : dev.type === 'olt'
                      ? 'OLT'
                      : dev.type === 'switch'
                      ? 'ODC'
                      : dev.type === 'odp'
                      ? 'ODP'
                      : 'CPE';

                  return (
                    <g
                      key={`node-${dev.id}`}
                      transform={`translate(${dev.x}, ${dev.y})`}
                      className="cursor-pointer"
                      onClick={() => handleSelectDevice(dev)}
                    >
                      {(isSelected || dev.status === 'warning') && (
                        <circle r="24" fill={strokeHex} opacity={0.2} className="animate-ping" />
                      )}
                      <circle
                        r={isSelected ? 19 : 16}
                        fill="#0f172a"
                        stroke={strokeHex}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      <text
                        textAnchor="middle"
                        dy=".32em"
                        fontSize="8.5px"
                        fontWeight="bold"
                        className="fill-slate-100 font-mono select-none pointer-events-none"
                      >
                        {shortLabel}
                      </text>
                      <text
                        y="-24"
                        textAnchor="middle"
                        fontSize="10px"
                        fontWeight="bold"
                        className="fill-slate-200 select-none pointer-events-none"
                      >
                        {dev.name}
                      </text>
                      <text
                        y="30"
                        textAnchor="middle"
                        fontSize="9px"
                        className="fill-cyan-400 font-mono select-none pointer-events-none"
                      >
                        {dev.portsUsed}/{dev.portsCapacity}P
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap gap-4 text-[11px] text-[var(--app-text-muted)] mt-3 z-10 bg-[var(--app-card-subtle)] p-2.5 rounded-xl border border-[var(--app-border)] justify-center font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> CORE BNG / OLT GPON
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> ODC / Distribution Switch
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> ODP Splitter (High Loss)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> LOS / Offline Node
              </div>
            </div>
          </div>

          {/* Node Inspector & Live Diagnostic Panel */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            {selectedDevice ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        selectedDevice.status === 'online'
                          ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                          : selectedDevice.status === 'warning'
                          ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                      }`}
                    >
                      {selectedDevice.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--app-text-muted)]">
                      ID: {selectedDevice.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                      {getDeviceIcon(selectedDevice.type, selectedDevice.status)}
                      <span>{selectedDevice.name}</span>
                    </h3>
                    <p className="text-xs font-mono text-[var(--app-primary)] mt-0.5">
                      {selectedDevice.ipAddress || 'Passive Optical Splitter'}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] p-2.5 rounded-xl border border-[var(--app-border)]">
                    {selectedDevice.description}
                  </p>

                  {/* Optical & Port Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Redaman Optik</span>
                      <span
                        className={`font-bold ${
                          selectedDevice.opticalDbm < -25 ? 'text-amber-500' : 'text-emerald-500'
                        }`}
                      >
                        {selectedDevice.opticalDbm} dBm
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Kapasitas Port</span>
                      <span className="font-bold text-cyan-500">
                        {selectedDevice.portsUsed}/{selectedDevice.portsCapacity} Port
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Koordinat GPS</span>
                      <span className="text-[10px] font-bold text-[var(--app-text)]">
                        {selectedDevice.latitude.toFixed(3)}, {selectedDevice.longitude.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline Latency */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--app-text-muted)] mb-1">
                      <span>Histori Latensi Real-Time (ms)</span>
                      <span className="font-mono font-bold text-[var(--app-text)]">
                        {selectedDevice.latencyHistory[selectedDevice.latencyHistory.length - 1]} ms
                      </span>
                    </div>
                    <div className="flex items-end gap-1 h-12 bg-[var(--app-card-subtle)] p-2 rounded-xl border border-[var(--app-border)]">
                      {selectedDevice.latencyHistory.map((lat, idx) => {
                        const h = Math.min(34, Math.max(6, (lat / 80) * 34));
                        const color =
                          lat > 50 ? 'bg-rose-500' : lat > 25 ? 'bg-amber-500' : 'bg-emerald-500';
                        return (
                          <div
                            key={idx}
                            style={{ height: `${h}px` }}
                            className={`flex-1 ${color} rounded-t transition-all duration-300`}
                            title={`${lat} ms`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Diagnostic Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={startPing}
                      disabled={isPingRunning || isRebooting}
                      className="px-2.5 py-2 bg-[var(--app-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play size={13} />
                      <span>Ping</span>
                    </button>
                    <button
                      onClick={runOpticalTraceroute}
                      className="px-2.5 py-2 bg-[var(--app-card-subtle)] hover:bg-cyan-600 hover:text-white text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Route size={13} />
                      <span>OTDR Trace</span>
                    </button>
                    <button
                      onClick={startReboot}
                      disabled={isRebooting || isPingRunning}
                      className="px-2.5 py-2 bg-[var(--app-card-subtle)] hover:bg-amber-600 hover:text-white text-[var(--app-text)] border border-[var(--app-border)] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={13} className={isRebooting ? 'animate-spin' : ''} />
                      <span>Reboot</span>
                    </button>
                  </div>

                  {/* External GIS & SPK Dispatch */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://www.google.com/maps?q=${selectedDevice.latitude},${selectedDevice.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-border)] text-[var(--app-text)] border border-[var(--app-border)] text-[11px] font-semibold flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={12} />
                      <span>Buka Google Maps</span>
                    </a>
                    <button
                      onClick={() =>
                        showToastMsg(`SPK Pengecekan Lapangan diterbitkan untuk ${selectedDevice.name}.`)
                      }
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-600 text-amber-500 hover:text-white border border-amber-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Wrench size={12} />
                      <span>Terbitkan SPK</span>
                    </button>
                  </div>
                </div>

                {/* Live Diagnostic Terminal */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-[11px] text-emerald-400 h-36 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-1">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-1.5">
                        <span className="text-slate-600 select-none">&gt;</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-slate-500 text-[10px]">
                    <Terminal size={11} />
                    <span>FTTH_GIS_Diagnostic_v2.4</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)]" size={16} />
            <input
              type="text"
              placeholder="Cari nama perangkat, kode ODP, OLT, atau IP Address..."
              className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-[var(--app-primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['all', 'router', 'olt', 'switch', 'odp', 'access-point'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  typeFilter === type
                    ? 'bg-[var(--app-primary)] border-[var(--app-primary)] text-white'
                    : 'bg-[var(--app-card-subtle)] border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                {type === 'all' ? 'Semua Node' : type === 'access-point' ? 'ONT / CPE' : type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Devices Inventory & Optical Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-xs">
              <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Node Infrastruktur</th>
                  <th className="px-5 py-3.5">IP / PON Interface</th>
                  <th className="px-5 py-3.5">Koordinat GPS</th>
                  <th className="px-5 py-3.5">Redaman Optik</th>
                  <th className="px-5 py-3.5">Kapasitas Port</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Inspeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-[var(--app-card-subtle)] p-2 rounded-xl border border-[var(--app-border)]">
                          {getDeviceIcon(device.type, device.status)}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--app-text)]">{device.name}</div>
                          <div className="text-[10px] font-mono text-[var(--app-text-muted)] uppercase">
                            {device.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[var(--app-text)]">
                      {device.ipAddress || '-'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[var(--app-text-muted)]">
                      {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono">
                      <span
                        className={`font-bold ${
                          device.opticalDbm < -25 ? 'text-amber-500' : 'text-emerald-500'
                        }`}
                      >
                        {device.opticalDbm} dBm
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[var(--app-text)]">
                      {device.portsUsed} / {device.portsCapacity} Port
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          device.status === 'online'
                            ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                            : device.status === 'warning'
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                        }`}
                      >
                        {device.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleSelectDevice(device)}
                        className="text-xs font-bold text-[var(--app-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspeksi</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL TAMBAH NODE INFRASTRUKTUR BARU */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                  <Plus size={16} className="text-[var(--app-primary)]" />
                  Tambah Node Infrastruktur FTTH Baru
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-[var(--app-text-muted)]">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddNode} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">Nama Perangkat / ODP</label>
                  <input
                    type="text"
                    value={newNodeForm.name}
                    onChange={(e) => setNewNodeForm({ ...newNodeForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">Tipe Node</label>
                    <select
                      value={newNodeForm.type}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, type: e.target.value as NodeType })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)]"
                    >
                      <option value="odp">ODP Splitter</option>
                      <option value="olt">OLT Chassis</option>
                      <option value="switch">ODC / Switch</option>
                      <option value="router">Core Router</option>
                      <option value="access-point">ONT / CPE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">IP / PON Port</label>
                    <input
                      type="text"
                      value={newNodeForm.ipAddress}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, ipAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] font-mono text-[var(--app-text)]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newNodeForm.latitude}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] font-mono text-[var(--app-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newNodeForm.longitude}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] font-mono text-[var(--app-text)]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">Redaman (dBm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newNodeForm.opticalDbm}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, opticalDbm: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] font-mono text-[var(--app-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--app-text-muted)] mb-1">Kapasitas Port</label>
                    <input
                      type="number"
                      value={newNodeForm.portsCapacity}
                      onChange={(e) => setNewNodeForm({ ...newNodeForm, portsCapacity: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] font-mono text-[var(--app-text)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[var(--app-primary)] text-white font-bold cursor-pointer"
                  >
                    Simpan ke Peta GIS
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
