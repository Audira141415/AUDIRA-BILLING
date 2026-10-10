import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import Layout from '../components/Layout';
import { 
  MapPin, Users, Calendar, Clock, AlertCircle, CheckCircle, 
  XCircle, Plus, Search, Filter, Phone, Navigation, Eye
} from 'lucide-react';

interface WorkOrder {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  scheduledAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
  technician?: {
    id: string;
    name: string;
  };
  location?: string;
  latitude?: number;
  longitude?: number;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  activeJobs: number;
  status: 'available' | 'busy' | 'offline';
}

export default function FieldServiceManagement() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    avgCompletionTime: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWorkOrders();
    loadTechnicians();
    loadStats();
  }, []);

  const loadWorkOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_BASE_URL}/field-service/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkOrders(data);
        return;
      }
    } catch (error) {
      console.error('Error loading work orders:', error);
    }

    // Fallback to mock data
    const mockData: WorkOrder[] = [
      {
        id: '1',
        type: 'installation',
        priority: 'high',
        status: 'assigned',
        title: 'Instalasi Baru - Paket 50 Mbps',
        description: 'Instalasi router dan ONT untuk pelanggan baru',
        scheduledAt: new Date().toISOString(),
        customer: {
          id: 'cust-1',
          name: 'Budi Santoso',
          phone: '08123456789',
          address: 'Jl. Merdeka No. 123, Jakarta',
        },
        technician: {
          id: 'tech-1',
          name: 'Ahmad Rizki',
        },
        location: 'Jl. Merdeka No. 123',
        latitude: -6.2088,
        longitude: 106.8456,
      },
      {
        id: '2',
        type: 'repair',
        priority: 'urgent',
        status: 'pending',
        title: 'Perbaikan Koneksi Lambat',
        description: 'Pelanggan melaporkan kecepatan internet sangat lambat',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        customer: {
          id: 'cust-2',
          name: 'Siti Rahayu',
          phone: '08198765432',
          address: 'Jl. Sudirman No. 45, Jakarta',
        },
        location: 'Jl. Sudirman No. 45',
      },
      {
        id: '3',
        type: 'maintenance',
        priority: 'medium',
        status: 'in-progress',
        title: 'Maintenance Rutin - ONT Check',
        description: 'Pemeriksaan rutin perangkat ONT',
        scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        customer: {
          id: 'cust-3',
          name: 'Andi Wijaya',
          phone: '08156781234',
          address: 'Jl. Gatot Subroto No. 78, Jakarta',
        },
        technician: {
          id: 'tech-2',
          name: 'Rudi Hartono',
        },
        location: 'Jl. Gatot Subroto No. 78',
      },
    ];

    setWorkOrders(mockData);
  };

  const loadTechnicians = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_BASE_URL}/operational/technicians', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTechnicians(data.map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          activeJobs: 0,
          status: 'available'
        })));
        return;
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
    }

    // Fallback to mock data
    const mockTechnicians: Technician[] = [
      { id: 'tech-1', name: 'Ahmad Rizki', email: 'ahmad@example.com', activeJobs: 2, status: 'busy' },
      { id: 'tech-2', name: 'Rudi Hartono', email: 'rudi@example.com', activeJobs: 1, status: 'busy' },
      { id: 'tech-3', name: 'Eko Prasetyo', email: 'eko@example.com', activeJobs: 0, status: 'available' },
    ];

    setTechnicians(mockTechnicians);
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_BASE_URL}/field-service/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        return;
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }

    // Fallback
    setStats({
      total: 156,
      pending: 12,
      assigned: 8,
      inProgress: 5,
      completed: 131,
      avgCompletionTime: 45,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredOrders = workOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Field Service Management</h1>
            <p className="text-gray-600 mt-1">Kelola pekerjaan lapangan dan teknisi</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Tambah Work Order
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-purple-600">{stats.assigned}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompletionTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Technicians Status */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Status Teknisi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {technicians.map(tech => (
              <div key={tech.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{tech.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tech.status === 'available' ? 'bg-green-100 text-green-800' :
                    tech.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tech.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tech.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {tech.activeJobs} pekerjaan aktif
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="w-4 h-4 inline mr-1" />
                Cari
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari work order..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="w-4 h-4 inline mr-1" />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="on-route">On Route</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Tipe</option>
                <option value="installation">Installation</option>
                <option value="repair">Repair</option>
                <option value="maintenance">Maintenance</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                  setSearchTerm('');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${getPriorityColor(order.priority)}`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.title}</div>
                          <div className="text-sm text-gray-500">{order.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {order.type} • {order.priority} priority
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                      <div className="text-xs text-gray-400">{order.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.technician ? (
                        <div className="text-sm text-gray-900">{order.technician.name}</div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Belum ditugaskan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.scheduledAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.location.href = `/work-order-detail?id=${order.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Lihat Detail & Foto"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {order.latitude && order.longitude && (
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`, '_blank')}
                            className="text-green-600 hover:text-green-900"
                            title="Open in Maps"
                          >
                            <Navigation className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => window.open(`tel:${order.customer.phone}`)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Call Customer"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Tidak ada work order yang sesuai filter</p>
          </div>
        )}
      </div>

      {/* Add Work Order Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Tambah Work Order</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">Form untuk membuat work order baru akan ditambahkan di sini</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Installation</option>
                    <option>Repair</option>
                    <option>Maintenance</option>
                    <option>Inspection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
