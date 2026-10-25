import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import Layout from '@/components/Layout';
import { Package, Plus, Search, Filter, Edit, Trash2, User, Calendar, AlertCircle } from 'lucide-react';

export default function Inventory() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'ONT',
    serialNumber: '',
    brand: '',
    model: '',
    macAddress: '',
    vendor: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [filterType, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch equipment
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);
      
      const equipmentRes = await fetch(`${API_BASE_URL}/inventory/equipment?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const equipmentData = await equipmentRes.json();
      setEquipment(equipmentData.equipment || []);

      // Fetch statistics
      const statsRes = await fetch(`${API_BASE_URL}/inventory/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Mock data
      setEquipment([
        {
          id: '1',
          type: 'ONT',
          serialNumber: 'ONT001',
          brand: 'Huawei',
          model: 'HG8145V5',
          status: 'assigned',
          customer: { name: 'John Doe', email: 'john@email.com' },
          purchaseDate: new Date('2024-01-15'),
        },
        {
          id: '2',
          type: 'Router',
          serialNumber: 'RTR001',
          brand: 'MikroTik',
          model: 'RB750Gr3',
          status: 'available',
          customer: null,
          purchaseDate: new Date('2024-02-20'),
        },
      ]);
      setStats({
        total: 50,
        available: 20,
        assigned: 25,
        maintenance: 3,
        damaged: 2,
        expiringWarranty: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/inventory/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          purchaseDate: new Date(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Equipment berhasil ditambahkan!');
        setShowAddModal(false);
        setFormData({
          type: 'ONT',
          serialNumber: '',
          brand: '',
          model: '',
          macAddress: '',
          vendor: '',
          location: '',
          notes: '',
        });
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Gagal menambahkan equipment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus equipment ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/inventory/equipment/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Equipment berhasil dihapus!');
        fetchData();
      }
    } catch (error) {
      alert('Gagal menghapus equipment');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      damaged: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredEquipment = equipment.filter((item) =>
    item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory & Asset Management</h1>
            <p className="text-gray-600">Kelola perangkat dan aset perusahaan</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Tambah Equipment
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Equipment</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-green-700">Available</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
              <div className="text-sm text-blue-700">Assigned</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
              <div className="text-sm text-yellow-700">Maintenance</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">{stats.damaged}</div>
              <div className="text-sm text-red-700">Damaged</div>
            </div>
            <div className="bg-orange-50 rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.expiringWarranty}</div>
              <div className="text-sm text-orange-700">Warranty Expiring</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="ONT">ONT</option>
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="Cable">Cable</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Serial Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Brand/Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Purchase Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEquipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-slate-500 mr-2" />
                          <span className="font-medium text-gray-900">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.serialNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.brand} {item.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.customer ? (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {item.customer.name}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
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
          )}
        </div>

        {/* Add Equipment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tambah Equipment</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="ONT">ONT</option>
                    <option value="Router">Router</option>
                    <option value="Switch">Switch</option>
                    <option value="Cable">Cable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MAC Address</label>
                  <input
                    type="text"
                    value={formData.macAddress}
                    onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddEquipment}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Tambah Equipment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
