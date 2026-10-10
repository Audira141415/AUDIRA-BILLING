import { useState } from 'react'
import Layout from '@/components/Layout'
import { HardDrive, Plus, Search, Edit, Trash2, MapPin, Activity } from 'lucide-react'

interface ODP {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  capacity: number
  usedPorts: number
  status: 'active' | 'inactive' | 'maintenance'
  description?: string
}

export default function ODPManagement() {
  const [odps, setOdps] = useState<ODP[]>([
    {
      id: '1',
      name: 'ODP-001-A',
      location: 'Jl. Merdeka No. 123, Jakarta',
      latitude: -6.2088,
      longitude: 106.8456,
      capacity: 16,
      usedPorts: 12,
      status: 'active',
      description: 'ODP area perumahan cluster A'
    },
    {
      id: '2',
      name: 'ODP-002-B',
      location: 'Jl. Sudirman No. 456, Jakarta',
      latitude: -6.2128,
      longitude: 106.8498,
      capacity: 16,
      usedPorts: 8,
      status: 'active',
      description: 'ODP area gedung perkantoran'
    },
    {
      id: '3',
      name: 'ODP-003-C',
      location: 'Jl. Ahmad Yani No. 789, Jakarta',
      latitude: -6.2168,
      longitude: 106.8540,
      capacity: 8,
      usedPorts: 8,
      status: 'maintenance',
      description: 'ODP area ruko komersial'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredOdps = odps.filter(odp =>
    odp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odp.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCapacity = odps.reduce((sum, odp) => sum + odp.capacity, 0)
  const totalUsed = odps.reduce((sum, odp) => sum + odp.usedPorts, 0)
  const utilizationRate = Math.round((totalUsed / totalCapacity) * 100)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'inactive':
        return 'bg-gray-100 text-gray-700'
      case 'maintenance':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getUtilizationColor = (used: number, capacity: number) => {
    const rate = (used / capacity) * 100
    if (rate >= 90) return 'text-red-600'
    if (rate >= 70) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen ODP</h1>
            <p className="text-gray-600 mt-1">Kelola Optical Distribution Point</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            <Plus size={20} />
            <span>Tambah ODP</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total ODP</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{odps.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <HardDrive className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Kapasitas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCapacity}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Port Terpakai</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{totalUsed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPin className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Utilisasi</p>
                <p className={`text-3xl font-bold mt-1 ${utilizationRate >= 90 ? 'text-red-600' : utilizationRate >= 70 ? 'text-orange-600' : 'text-green-600'}`}>
                  {utilizationRate}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${utilizationRate >= 90 ? 'bg-red-100' : utilizationRate >= 70 ? 'bg-orange-100' : 'bg-green-100'}`}>
                <Activity className={utilizationRate >= 90 ? 'text-red-600' : utilizationRate >= 70 ? 'text-orange-600' : 'text-green-600'} size={24} />
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
              placeholder="Cari berdasarkan nama ODP atau lokasi..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ODP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOdps.map((odp) => {
            const availablePorts = odp.capacity - odp.usedPorts
            const utilizationPercent = Math.round((odp.usedPorts / odp.capacity) * 100)
            
            return (
              <div key={odp.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <HardDrive className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{odp.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(odp.status)}`}>
                          {odp.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start text-sm text-gray-600 mb-3">
                      <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{odp.location}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kapasitas</span>
                        <span className="font-semibold text-gray-900">{odp.capacity} port</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Terpakai</span>
                        <span className="font-semibold text-gray-900">{odp.usedPorts} port</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tersedia</span>
                        <span className={`font-semibold ${availablePorts === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {availablePorts} port
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Utilisasi</span>
                        <span className={`font-semibold ${getUtilizationColor(odp.usedPorts, odp.capacity)}`}>
                          {utilizationPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            utilizationPercent >= 90 ? 'bg-red-600' :
                            utilizationPercent >= 70 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${utilizationPercent}%` }}
                        />
                      </div>
                    </div>

                    {odp.description && (
                      <p className="text-sm text-gray-500 mt-3">{odp.description}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <MapPin size={16} />
                      <span>Lihat Map</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredOdps.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <HardDrive size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada ODP ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian Anda</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
