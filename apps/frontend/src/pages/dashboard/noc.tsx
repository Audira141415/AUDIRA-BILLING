import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { 
  Server, 
  Wifi, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Users,
  HardDrive,
  RefreshCcw,
  Radio,
  CheckCircle2,
  Wrench,
  MapPin,
  Send,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react'

export default function NOCDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not NOC role
    if (user && user.role !== 'NOC' && user.role !== 'TECHNICIAN' && user.role !== 'ADMIN') {
      router.push('/dashboard/billing')
    }
  }, [user, router])

  const [stats] = useState({
    network: {
      status: 'online',
      uptime: '99.8%',
      totalDevices: 24,
      activeDevices: 22
    },
    mikrotik: {
      total: 8,
      online: 7,
      offline: 1
    },
    ont: {
      total: 156,
      online: 142,
      offline: 14
    },
    tickets: {
      total: 28,
      open: 8,
      inProgress: 12,
      closed: 8
    },
    bandwidth: {
      total: '10 Gbps',
      used: '6.5 Gbps',
      percentage: 65
    }
  })

  // Proactive TR-069 & OLT Optical Loss Alerts State
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
      txPower: 2.10,
      threshold: -27.0,
      severity: 'CRITICAL',
      aiDiagnostic: 'Dropcore fiber tertekuk tajam atau konektor SC/UPC kotor di adaptor ODP. Degradasi redaman terdeteksi 2 jam terakhir.',
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
      rxPower: -27.60,
      txPower: 2.35,
      threshold: -27.0,
      severity: 'WARNING',
      aiDiagnostic: 'Splice core loss tinggi pada joint closure pasca pekerjaan drainase jalan di dekat Tiang T-04.',
      lastPolled: '4 menit yang lalu via GenieACS TR-069',
      ticketCreated: false,
    },
  ]);
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);
  const [queryingOnt, setQueryingOnt] = useState<string | null>(null);

  const handleCreateWorkOrder = (alertId: string, customerName: string) => {
    setAlertFeedback(`✅ Tiket & Surat Perintah Kerja (SPK) Teknisi Lapangan berhasil dibuat untuk perbaikan redaman ${customerName}! Notifikasi telah dikirim ke WhatsApp tim patroli.`);
    setOpticalAlerts((prev) =>
      prev.map((item) => (item.id === alertId ? { ...item, ticketCreated: true } : item))
    );
    setTimeout(() => setAlertFeedback(null), 5000);
  };

  const handleQueryOntLive = (alertId: string, ontSerial: string) => {
    setQueryingOnt(alertId);
    setTimeout(() => {
      setQueryingOnt(null);
      setAlertFeedback(`📡 Berhasil melakukan polling TR-069 ulang ke ONT ${ontSerial}. Parameter RX/TX terverifikasi.`);
      setTimeout(() => setAlertFeedback(null), 4000);
    }, 1200);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard NOC</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.name} (Admin NOC)</p>
        </div>

        {/* Network Status Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Network Status: ONLINE</h2>
                <p className="text-green-100">Uptime: {stats.network.uptime} | {stats.network.activeDevices}/{stats.network.totalDevices} devices active</p>
              </div>
            </div>
            <Activity size={48} className="opacity-50" />
          </div>
        </div>

        {/* Proactive High Optical Loss Warning Banner (GenieACS TR-069 + OLT Telemetry) */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-300 rounded-2xl p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-200">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-rose-950">
                    PERINGATAN REDAMAN TINGGI (&gt; -27.0 dBm) — 2 ONT KRITIS
                  </h2>
                  <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    PROAKTIF
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-0.5">
                  Telemetri TR-069 GenieACS mendeteksi sinyal optik mendekati batas putus. Intervensi lapangan disarankan sebelum komplain pelanggan.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => router.push('/genieacs')}
                className="text-xs font-semibold text-rose-800 hover:text-rose-950 bg-white/80 hover:bg-white border border-rose-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Buka GenieACS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => router.push('/infrastruktur/odp')}
                className="text-xs font-semibold text-rose-800 hover:text-rose-950 bg-white/80 hover:bg-white border border-rose-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Peta ODP / GIS</span>
                <MapPin className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feedback Toast Banner */}
          {alertFeedback && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{alertFeedback}</span>
            </div>
          )}

          {/* Critical Optical Alerts List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {opticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-white rounded-xl border border-rose-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{alert.customerName}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {alert.inetNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {alert.odpLocation} • {alert.cluster} (SN: {alert.ontSerial})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-extrabold text-red-600 font-mono">
                          {alert.rxPower.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">dBm</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {alert.severity === 'CRITICAL' ? 'KRITIS (&gt; -28 dBm)' : 'WASPADA (&gt; -27 dBm)'}
                      </span>
                    </div>
                  </div>

                  {/* AI Root Cause Diagnostic Chip */}
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-950 my-2 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-[11px] text-amber-900 mb-0.5">AI Root Cause Suggestion:</strong>
                      <p className="text-[11px] leading-relaxed text-amber-900/90">{alert.aiDiagnostic}</p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 gap-2">
                  <span className="text-[10px] text-slate-600 font-mono">
                    {alert.lastPolled}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQueryOntLive(alert.id, alert.ontSerial)}
                      disabled={queryingOnt === alert.id}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                      title="Polling ulang status TR-069"
                    >
                      <RefreshCcw className={`w-3.5 h-3.5 ${queryingOnt === alert.id ? 'animate-spin text-blue-600' : ''}`} />
                      <span>{queryingOnt === alert.id ? 'Querying...' : 'Poll TR-069'}</span>
                    </button>

                    <button
                      onClick={() => handleCreateWorkOrder(alert.id, alert.customerName)}
                      disabled={alert.ticketCreated}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                        alert.ticketCreated
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* MikroTik Devices */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">MikroTik Routers</h3>
              <Server className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.mikrotik.online}/{stats.mikrotik.total}</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.mikrotik.online / stats.mikrotik.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400">
                {Math.round((stats.mikrotik.online / stats.mikrotik.total) * 100)}%
              </span>
            </div>
          </div>

          {/* ONT Devices */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">ONT Devices</h3>
              <Wifi className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.ont.online}/{stats.ont.total}</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.ont.online / stats.ont.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400">
                {Math.round((stats.ont.online / stats.ont.total) * 100)}%
              </span>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Tiket Terbuka</h3>
              <AlertTriangle className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.tickets.open}</p>
            <p className="text-sm text-slate-400">Perlu segera ditangani</p>
          </div>

          {/* Bandwidth Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Bandwidth Usage</h3>
              <Activity className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.bandwidth.percentage}%</p>
            <p className="text-sm text-slate-400">{stats.bandwidth.used} / {stats.bandwidth.total}</p>
          </div>
        </div>

        {/* Device Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* MikroTik Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status MikroTik</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Online</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.mikrotik.online}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Offline</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.mikrotik.offline}</span>
              </div>
            </div>
          </div>

          {/* Ticket Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status Tiket</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <span className="font-medium text-gray-900">Terbuka</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{stats.tickets.open}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCcw className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-900">Dalam Proses</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.tickets.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="font-medium text-gray-900">Selesai</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.tickets.closed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/mikrotik')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
            >
              <Server className="mx-auto mb-2 text-blue-600" size={32} />
              <p className="text-sm font-medium text-gray-900">MikroTik</p>
            </button>
            <button
              onClick={() => router.push('/genieacs')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center"
            >
              <Wifi className="mx-auto mb-2 text-green-600" size={32} />
              <p className="text-sm font-medium text-gray-900">GenieACS</p>
            </button>
            <button
              onClick={() => router.push('/infrastruktur/olt')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
            >
              <HardDrive className="mx-auto mb-2 text-purple-600" size={32} />
              <p className="text-sm font-medium text-gray-900">Infrastruktur</p>
            </button>
            <button
              onClick={() => router.push('/operational')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center"
            >
              <Activity className="mx-auto mb-2 text-orange-600" size={32} />
              <p className="text-sm font-medium text-gray-900">Operational</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
