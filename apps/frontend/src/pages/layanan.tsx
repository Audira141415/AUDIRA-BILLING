import { useState } from 'react'
import Layout from '@/components/Layout'
import { showAudiraToast } from '@/contexts/ToastContext'
import { Server, Plus, Search, Edit, Trash2, PlayCircle, PauseCircle, StopCircle, CheckCircle, X, User, Package, Calendar, Info, XCircle } from 'lucide-react'

interface Service {
  id: string
  serviceName: string
  serviceType: string
  customerName: string
  packageName: string
  status: 'active' | 'suspended' | 'terminated'
  activationDate: string
  expiryDate: string
  autoRenew: boolean
}

export default function Layanan() {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceData, setNewServiceData] = useState({
    serviceName: '',
    serviceType: 'Residential Internet',
    customerName: '',
    packageName: 'Paket 50 Mbps',
    autoRenew: true,
  });

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleToggleSuspend = (service: Service) => {
    const isActivating = service.status !== 'active';
    const updatedStatus: 'active' | 'suspended' = isActivating ? 'active' : 'suspended';
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, status: updatedStatus } : s));
    if (selectedService && selectedService.id === service.id) {
      setSelectedService({ ...selectedService, status: updatedStatus });
    }
    if (isActivating) {
      showAudiraToast.success(`Layanan ${service.serviceName} berhasil diaktifkan kembali!`, 'Layanan Aktif');
    } else {
      showAudiraToast.warning(`Layanan ${service.serviceName} telah disuspend.`, 'Layanan Ditangguhkan');
    }
  };

  const handleDeleteService = (service: Service) => {
    if (!confirm(`Hapus layanan ${service.serviceName}?`)) return;
    setServices(prev => prev.filter(s => s.id !== service.id));
    if (selectedService && selectedService.id === service.id) {
      setShowServiceModal(false);
      setSelectedService(null);
    }
    showAudiraToast.success(`Layanan ${service.serviceName} berhasil dihapus.`, 'Dihapus');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceData.serviceName || !newServiceData.customerName) {
      showAudiraToast.warning('Mohon lengkapi nama layanan dan nama pelanggan', 'Validasi');
      return;
    }

    const created: Service = {
      id: `SRV-${Date.now().toString().slice(-4)}`,
      serviceName: newServiceData.serviceName,
      serviceType: newServiceData.serviceType,
      customerName: newServiceData.customerName,
      packageName: newServiceData.packageName,
      status: 'active',
      activationDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      autoRenew: newServiceData.autoRenew,
    };

    setServices(prev => [created, ...prev]);
    setShowAddServiceModal(false);
    setNewServiceData({
      serviceName: '',
      serviceType: 'Residential Internet',
      customerName: '',
      packageName: 'Paket 50 Mbps',
      autoRenew: true,
    });
    showAudiraToast.success(`Layanan ${created.serviceName} berhasil diaktifkan untuk pelanggan!`, 'Layanan Baru Aktif');
  };

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      serviceName: 'Dedicated Internet - PT Cipta Karya',
      serviceType: 'Corporate Internet',
      customerName: 'PT Cipta Karya Sentosa',
      packageName: 'Corporate 1 Gbps',
      status: 'active',
      activationDate: '05 Jan 2023',
      expiryDate: '05 Jan 2026',
      autoRenew: true
    },
    {
      id: '2',
      serviceName: 'Business Internet - Game Zone',
      serviceType: 'Business Internet',
      customerName: 'Warnet Game Zone',
      packageName: 'Business 300 Mbps',
      status: 'active',
      activationDate: '12 Mar 2023',
      expiryDate: '12 Mar 2026',
      autoRenew: true
    },
    {
      id: '3',
      serviceName: 'Shared Internet - Kost Harapan',
      serviceType: 'Residential Internet',
      customerName: 'Rumah Kost Mahasiswa Harapan',
      packageName: 'Paket 100 Mbps',
      status: 'active',
      activationDate: '08 Jul 2023',
      expiryDate: '08 Jul 2026',
      autoRenew: true
    },
    {
      id: '4',
      serviceName: 'Home Internet - Keluarga Sutrisno',
      serviceType: 'Residential Internet',
      customerName: 'Keluarga Bapak Sutrisno',
      packageName: 'Paket 50 Mbps',
      status: 'active',
      activationDate: '20 Sep 2024',
      expiryDate: '20 Sep 2025',
      autoRenew: false
    },
    {
      id: '5',
      serviceName: 'Business Internet - Fashion Store',
      serviceType: 'Business Internet',
      customerName: 'Toko Online Fashion Store',
      packageName: 'Business 200 Mbps',
      status: 'suspended',
      activationDate: '15 Jan 2024',
      expiryDate: '15 Jan 2025',
      autoRenew: false
    },
    {
      id: '6',
      serviceName: 'Home Internet - Keluarga Ratna',
      serviceType: 'Residential Internet',
      customerName: 'Keluarga Ibu Ratna Dewi',
      packageName: 'Paket 20 Mbps',
      status: 'active',
      activationDate: '10 Feb 2024',
      expiryDate: '10 Feb 2025',
      autoRenew: true
    },
    {
      id: '7',
      serviceName: 'Business WiFi - Cafe Nusantara',
      serviceType: 'Business Internet + WiFi',
      customerName: 'Cafe Kopi Nusantara',
      packageName: 'Business 100 Mbps',
      status: 'active',
      activationDate: '22 Jun 2024',
      expiryDate: '22 Jun 2025',
      autoRenew: true
    },
    {
      id: '8',
      serviceName: 'Home Internet - Bapak Hendro',
      serviceType: 'Residential Internet',
      customerName: 'Bapak Hendro Wijaya',
      packageName: 'Paket 30 Mbps',
      status: 'terminated',
      activationDate: '05 May 2024',
      expiryDate: '15 Sep 2025',
      autoRenew: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'terminated'>('all')

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const activeServices = services.filter(s => s.status === 'active').length
  const suspendedServices = services.filter(s => s.status === 'suspended').length
  const terminatedServices = services.filter(s => s.status === 'terminated').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'suspended':
        return 'bg-orange-100 text-orange-700'
      case 'terminated':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'suspended':
        return 'Suspended'
      case 'terminated':
        return 'Terminated'
      default:
        return status
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Manajemen Layanan</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola aktivasi dan status layanan pelanggan</p>
          </div>
          <button onClick={() => setShowAddServiceModal(true)} className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]">
            <Plus size={20} />
            <span>Tambah Layanan</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Total Layanan</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">{services.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-950/50 p-3 rounded-lg">
                <Server className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Layanan Aktif</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{activeServices}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-950/50 p-3 rounded-lg">
                <PlayCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Suspended</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{suspendedServices}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-950/50 p-3 rounded-lg">
                <PauseCircle className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Terminated</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{terminatedServices}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-950/50 p-3 rounded-lg">
                <StopCircle className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 md:mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama layanan, pelanggan, atau paket..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setStatusFilter('suspended')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'suspended' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Nama Layanan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Tanggal Aktif
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Tanggal Expired
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Auto Renew
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredServices.map((service) => (
                  <tr 
                    key={service.id} 
                    onClick={() => handleServiceClick(service)}
                    className="hover:bg-orange-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-slate-100">{service.serviceName}</p>
                        <p className="text-sm text-slate-400">{service.serviceType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-slate-100">{service.customerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-slate-100">{service.packageName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)}`}>
                        {getStatusText(service.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-slate-400">{service.activationDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-slate-400">{service.expiryDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      {service.autoRenew ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm">Ya</span>
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">Tidak</span>
                      )}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {service.status === 'active' ? (
                          <button onClick={() => handleToggleSuspend(service)} className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors" title="Suspend Layanan">
                            <PauseCircle size={18} />
                          </button>
                        ) : (
                          <button onClick={() => handleToggleSuspend(service)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors" title="Aktivasi Layanan">
                            <PlayCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => { setSelectedService(service); setShowServiceModal(true); }} className="p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Edit / Detail">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteService(service)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors" title="Hapus Layanan">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Server size={64} className="mx-auto text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">Tidak ada layanan ditemukan</h3>
              <p className="text-gray-600 dark:text-slate-400">Coba ubah kata kunci pencarian atau filter Anda</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Detail Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-white p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowServiceModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Tutup modal"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <Server size={32} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Detail Layanan</p>
                  <h2 className="text-2xl font-bold">{selectedService.serviceName}</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedService.status)}`}>
                  {getStatusText(selectedService.status)}
                </span>
                <div className="flex items-center space-x-2">
                  {selectedService.autoRenew ? (
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3 py-1 rounded-full">
                      <CheckCircle size={16} className="mr-1" />
                      <span className="text-sm font-semibold">Auto Renew Aktif</span>
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">Manual Renew</span>
                  )}
                </div>
              </div>

              {/* Service Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="text-blue-600 dark:text-blue-400" size={20} />
                    <h3 className="font-bold text-gray-900 dark:text-slate-100">Pelanggan</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">{selectedService.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Tipe: {selectedService.serviceType}</p>
                </div>

                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-green-200/50 dark:border-emerald-900/40 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package className="text-emerald-600 dark:text-emerald-400" size={20} />
                    <h3 className="font-bold text-gray-900 dark:text-slate-100">Paket</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">{selectedService.packageName}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                  <h3 className="font-bold text-gray-900 dark:text-slate-100">Informasi Tanggal</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Tanggal Aktivasi</p>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{selectedService.activationDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Tanggal Expired</p>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{selectedService.expiryDate}</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Info className="text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Catatan</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedService.status === 'active' && 'Layanan sedang aktif dan berjalan normal.'}
                      {selectedService.status === 'suspended' && 'Layanan ditangguhkan. Harap selesaikan pembayaran untuk mengaktifkan kembali.'}
                      {selectedService.status === 'terminated' && 'Layanan telah dihentikan.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-800">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                >
                  Tutup
                </button>
                {selectedService.status === 'active' ? (
                  <button onClick={() => { handleToggleSuspend(selectedService); }} className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                    <PauseCircle className="inline mr-2" size={18} />
                    Suspend Layanan
                  </button>
                ) : (
                  <button onClick={() => { handleToggleSuspend(selectedService); }} className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
                    <PlayCircle className="inline mr-2" size={18} />
                    Aktivasi Layanan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800">
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/60">
              <h3 className="font-bold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <Plus size={18} className="text-orange-600 dark:text-orange-400" />
                Tambah Layanan Pelanggan Baru
              </h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]" aria-label="Tutup dialog">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateService} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Nama Layanan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dedicated Internet - Kantor Cabang"
                  value={newServiceData.serviceName}
                  onChange={e => setNewServiceData({ ...newServiceData, serviceName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sumber Rezeki Mandiri"
                  value={newServiceData.customerName}
                  onChange={e => setNewServiceData({ ...newServiceData, customerName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Tipe Layanan</label>
                  <select
                    value={newServiceData.serviceType}
                    onChange={e => setNewServiceData({ ...newServiceData, serviceType: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Residential Internet">Residential Internet</option>
                    <option value="Business Internet">Business Internet</option>
                    <option value="Corporate Internet">Corporate Internet</option>
                    <option value="Dedicated Bandwidth">Dedicated Bandwidth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Pilihan Paket</label>
                  <select
                    value={newServiceData.packageName}
                    onChange={e => setNewServiceData({ ...newServiceData, packageName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Paket 20 Mbps">Paket 20 Mbps - Rp 175.000</option>
                    <option value="Paket 50 Mbps">Paket 50 Mbps - Rp 250.000</option>
                    <option value="Paket 100 Mbps">Paket 100 Mbps - Rp 375.000</option>
                    <option value="Business 200 Mbps">Business 200 Mbps - Rp 750.000</option>
                    <option value="Corporate 1 Gbps">Corporate 1 Gbps - Rp 2.500.000</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={newServiceData.autoRenew}
                  onChange={e => setNewServiceData({ ...newServiceData, autoRenew: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                />
                <label htmlFor="autoRenew" className="text-xs text-gray-700 dark:text-slate-300 font-medium cursor-pointer">
                  Aktifkan Auto-Renew tagihan bulanan
                </label>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-slate-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  Aktifkan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
