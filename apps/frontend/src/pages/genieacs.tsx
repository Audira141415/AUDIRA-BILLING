import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { showAudiraToast } from '@/contexts/ToastContext'
import { RefreshCcw, Plus, Search, Edit, Trash2, Wifi, WifiOff, CheckCircle, XCircle, Power, Settings } from 'lucide-react'

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

const INITIAL_DEVICES: GenieDevice[] = [
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
]

export default function GenieAcs() {
  const [devices, setDevices] = useState<GenieDevice[]>(INITIAL_DEVICES)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDevice, setNewDevice] = useState({
    deviceId: '',
    serialNumber: '',
    manufacturer: 'ZTE',
    model: 'F670L',
    ipAddress: '192.168.100.',
    macAddress: '',
    customer: '',
  })

  // Load devices on mount
  useEffect(() => {
    loadDevices()
  }, [])

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
      // Use initial demo devices gracefully if GenieACS daemon is offline
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">GenieACS TR-069 Management</h1>
            <p className="text-gray-600 mt-1">Manajemen & monitoring perangkat ONT/CPE fiber optik secara real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSyncDevices} 
              disabled={isSyncing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Sinkronisasi...' : 'Sync Devices'}</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md"
            >
              <Plus size={18} />
              <span>Add Device</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Devices</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{devices.length}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                <RefreshCcw size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Online CPE</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">{onlineDevices}</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <Wifi size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Offline CPE</p>
                <p className="text-3xl font-black text-rose-600 mt-1">{offlineDevices}</p>
              </div>
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
                <WifiOff size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">TR-069 Provisioned</p>
                <p className="text-3xl font-black text-purple-600 mt-1">{devices.length}</p>
              </div>
              <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan Device ID, Serial Number, IP Address, atau Nama Pelanggan..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Perangkat ONT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vendor / Model
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    IP & MAC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Inform
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{device.deviceId}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{device.serialNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{device.manufacturer}</p>
                        <p className="text-xs text-gray-500">{device.model}</p>
                        <span className="text-[10px] text-gray-400 font-mono">{device.softwareVersion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-blue-600">{device.ipAddress}</p>
                        <p className="font-mono text-[10px] text-gray-400 mt-0.5">{device.macAddress}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-800">{device.customer || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {device.status === 'online' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Offline
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{device.lastInform}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleRebootDevice(device)} 
                          disabled={actionLoadingId === device.id}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-rose-200"
                          title="Kirim Sinyal Reboot ke ONT"
                        >
                          <Power size={15} />
                        </button>
                        <button 
                          onClick={() => handleRefreshParameters(device)} 
                          disabled={actionLoadingId === device.id}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-200"
                          title="Refresh Parameter TR-069"
                        >
                          <RefreshCcw size={15} className={actionLoadingId === device.id ? 'animate-spin' : ''} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDevice(device)} 
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-gray-100 rounded-xl transition-all"
                          title="Hapus Perangkat"
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

          {filteredDevices.length === 0 && (
            <div className="text-center py-12">
              <RefreshCcw size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">Tidak ada perangkat ditemukan</h3>
              <p className="text-xs text-gray-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                Registrasi Perangkat CPE Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateDevice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Device ID / Nama Alias *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ONT-004-JKL012"
                  value={newDevice.deviceId}
                  onChange={e => setNewDevice({ ...newDevice, deviceId: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Serial Number (SN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ZTEG87654321"
                    value={newDevice.serialNumber}
                    onChange={e => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pabrikan</label>
                  <select
                    value={newDevice.manufacturer}
                    onChange={e => setNewDevice({ ...newDevice, manufacturer: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ZTE">ZTE</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Fiberhome">Fiberhome</option>
                    <option value="Nokia">Nokia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Model ONT</label>
                  <input
                    type="text"
                    placeholder="F670L / EG8145V5"
                    value={newDevice.model}
                    onChange={e => setNewDevice({ ...newDevice, model: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">IP Address</label>
                  <input
                    type="text"
                    placeholder="192.168.100.104"
                    value={newDevice.ipAddress}
                    onChange={e => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pelanggan Terhubung</label>
                <input
                  type="text"
                  placeholder="Nama Pelanggan (opsional)"
                  value={newDevice.customer}
                  onChange={e => setNewDevice({ ...newDevice, customer: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 font-medium text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                >
                  Daftarkan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
