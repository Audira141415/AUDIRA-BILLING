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
  RefreshCcw
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard NOC</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.name} (Admin NOC)</p>
        </div>

        {/* Network Status Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6 mb-8">
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
              <span className="text-xs text-gray-500">
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
              <span className="text-xs text-gray-500">
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
            <p className="text-sm text-gray-500">Perlu segera ditangani</p>
          </div>

          {/* Bandwidth Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Bandwidth Usage</h3>
              <Activity className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.bandwidth.percentage}%</p>
            <p className="text-sm text-gray-500">{stats.bandwidth.used} / {stats.bandwidth.total}</p>
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
              onClick={() => router.push('/infrastruktur')}
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
