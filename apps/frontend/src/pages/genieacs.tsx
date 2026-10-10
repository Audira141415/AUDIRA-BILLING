import { useState } from 'react'
import Layout from '@/components/Layout'
import { RefreshCcw, Plus, Search, Edit, Trash2, Wifi, WifiOff, CheckCircle, XCircle } from 'lucide-react'

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

export default function GenieAcs() {
  const [devices, setDevices] = useState<GenieDevice[]>([
    {
      id: '1',
      deviceId: 'ONT-001-ABC123',
      serialNumber: 'ZTEG12345678',
      manufacturer: 'ZTE',
      model: 'F670L',
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
      model: 'EG8145V5',
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
  ])

  const [searchTerm, setSearchTerm] = useState('')

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
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GenieACS Management</h1>
            <p className="text-gray-600 mt-1">Manajemen perangkat CPE dengan TR-069</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <RefreshCcw size={20} />
              <span>Sync Devices</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <Plus size={20} />
              <span>Add Device</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Devices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{devices.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <RefreshCcw className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Online</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{onlineDevices}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Wifi className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Offline</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{offlineDevices}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <WifiOff className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Provisioned</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{devices.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan Device ID, Serial Number, IP, atau Customer..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Device Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Inform
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{device.deviceId}</p>
                        <p className="text-sm text-gray-500 font-mono">{device.serialNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{device.manufacturer}</p>
                        <p className="text-sm text-gray-500">{device.model}</p>
                        <p className="text-xs text-gray-400">{device.softwareVersion}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-sm text-gray-900">{device.ipAddress}</p>
                        <p className="font-mono text-xs text-gray-500">{device.macAddress}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{device.customer || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {device.status === 'online' ? (
                          <Wifi className="text-green-500" size={18} />
                        ) : (
                          <WifiOff className="text-red-500" size={18} />
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {device.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{device.lastInform}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <RefreshCcw size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
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
              <RefreshCcw size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada perangkat ditemukan</h3>
              <p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
