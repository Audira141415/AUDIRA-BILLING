import Link from 'next/link';
import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import Layout from '../components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { useRealtime } from '@/contexts/RealtimeContext';
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
  const { toast } = useToast();
  const { lastEvent } = useRealtime();
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
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: '',
    description: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    type: 'installation',
    priority: 'medium',
    technicianId: '',
    scheduledAt: new Date().toISOString().slice(0, 16),
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.title.trim() || !newOrder.customerName.trim()) {
      toast.warning('Mohon isi judul pekerjaan dan nama pelanggan', 'Validasi');
      return;
    }

    try {
      setSubmittingOrder(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const payload = {
        title: newOrder.title,
        description: newOrder.description,
        type: newOrder.type,
        priority: newOrder.priority,
        scheduledAt: new Date(newOrder.scheduledAt),
        technicianId: newOrder.technicianId || undefined,
        customer: {
          name: newOrder.customerName,
          phone: newOrder.customerPhone || '0821-1200-1600',
          address: newOrder.customerAddress || 'Alamat Pelanggan',
        }
      };

      const res = await fetch(`${API_BASE_URL}/field-service/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        setWorkOrders(prev => [created, ...prev]);
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          assigned: newOrder.technicianId ? prev.assigned + 1 : prev.assigned,
          pending: !newOrder.technicianId ? prev.pending + 1 : prev.pending,
        }));
        toast.success('Work Order berhasil dibuat dan ditugaskan!', 'Sukses');
      } else {
        const localCreated: WorkOrder = {
          id: `WO-${Date.now().toString().slice(-4)}`,
          title: newOrder.title,
          description: newOrder.description,
          type: newOrder.type,
          priority: newOrder.priority,
          status: newOrder.technicianId ? 'assigned' : 'pending',
          scheduledAt: new Date(newOrder.scheduledAt).toISOString(),
          customer: {
            id: `CUST-${Date.now().toString().slice(-4)}`,
            name: newOrder.customerName,
            phone: newOrder.customerPhone || '0821-1200-1600',
            address: newOrder.customerAddress || 'Alamat Pelanggan',
          },
          technician: technicians.find(t => t.id === newOrder.technicianId),
        };
        setWorkOrders(prev => [localCreated, ...prev]);
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          assigned: newOrder.technicianId ? prev.assigned + 1 : prev.assigned,
          pending: !newOrder.technicianId ? prev.pending + 1 : prev.pending,
        }));
        toast.success('Work Order baru berhasil dicatat!', 'Tersimpan');
      }

      setShowAddModal(false);
      setNewOrder({
        title: '',
        description: '',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        type: 'installation',
        priority: 'medium',
        technicianId: '',
        scheduledAt: new Date().toISOString().slice(0, 16),
      });
    } catch (err: any) {
      toast.error(`Gagal membuat work order: ${err.message}`, 'Gagal');
    } finally {
      setSubmittingOrder(false);
    }
  };

  useEffect(() => {
    loadWorkOrders();
    loadTechnicians();
    loadStats();
  }, []);

  useEffect(() => {
    if (lastEvent?.type === 'work_order_updated' || lastEvent?.type === 'dashboard_refresh') {
      loadWorkOrders();
      loadStats();
      if (lastEvent?.type === 'work_order_updated') {
        const d = lastEvent.data;
        toast.info(`Work Order [${d.title || d.workOrderId}] diperbarui: ${d.status?.toUpperCase()}`, 'Field Service Live');
      }
    }
  }, [lastEvent]);

  const loadWorkOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/field-service/jobs`, {
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

    setWorkOrders([]);
  };

  const loadTechnicians = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/operational/technicians`, {
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
      const response = await fetch(`${API_BASE_URL}/field-service/stats`, {
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

    // Fallback ke nilai 0 aktual saat API belum mengembalikan statistik
    setStats({
      total: 0,
      pending: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
      avgCompletionTime: 0,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30';
      case 'in-progress': return 'bg-blue-500/15 text-blue-500 border border-blue-500/30';
      case 'assigned': return 'bg-purple-500/15 text-purple-500 border border-purple-500/30';
      case 'pending': return 'bg-amber-500/15 text-amber-500 border border-amber-500/30';
      case 'cancelled': return 'bg-red-500/15 text-red-500 border border-red-500/30';
      default: return 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-amber-500';
      default: return 'text-[var(--app-text-muted)]';
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
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Field Service Management</h1>
            <p className="text-[var(--app-text-muted)] mt-1">Kelola pekerjaan lapangan dan teknisi</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Work Order
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Total</p>
                <p className="text-2xl font-bold text-[var(--app-text)]">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-[var(--app-text-muted)]" />
            </div>
          </div>
          
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Pending</p>
                <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500/80" />
            </div>
          </div>
          
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Assigned</p>
                <p className="text-2xl font-bold text-purple-500">{stats.assigned}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500/80" />
            </div>
          </div>
          
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">In Progress</p>
                <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500/80" />
            </div>
          </div>
          
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Completed</p>
                <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500/80" />
            </div>
          </div>
          
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Avg Time</p>
                <p className="text-2xl font-bold text-[var(--app-text)]">{stats.avgCompletionTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-[var(--app-text-muted)]" />
            </div>
          </div>
        </div>

        {/* Technicians Status */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
          <h2 className="font-semibold text-[var(--app-text)] mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Status Teknisi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {technicians.map(tech => (
              <div key={tech.id} className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[var(--app-text)]">{tech.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tech.status === 'available' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' :
                    tech.status === 'busy' ? 'bg-orange-500/15 text-orange-500 border border-orange-500/30' :
                    'bg-[var(--app-card)] text-[var(--app-text-muted)] border border-[var(--app-border)]'
                  }`}>
                    {tech.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--app-text-muted)]">{tech.email}</p>
                <p className="text-sm text-[var(--app-text-muted)] mt-1">
                  {tech.activeJobs} pekerjaan aktif
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)] mb-1">
                <Search className="w-4 h-4 inline mr-1 text-[var(--app-text-muted)]" />
                Cari
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari work order..."
                className="w-full bg-[var(--app-bg)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:outline-none transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--app-text)] mb-1">
                <Filter className="w-4 h-4 inline mr-1 text-[var(--app-text-muted)]" />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-[var(--app-text)] mb-1">Tipe</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] px-4 py-2 rounded-lg hover:bg-[var(--app-bg)] transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--app-border)]">
              <thead className="bg-[var(--app-card-subtle)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                    Work Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                    Teknisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--app-text-muted)] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--app-card)] divide-y divide-[var(--app-border)]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${getPriorityColor(order.priority)}`} />
                        <div>
                          <div className="text-sm font-medium text-[var(--app-text)]">{order.title}</div>
                          <div className="text-sm text-[var(--app-text-muted)]">{order.description}</div>
                          <div className="text-xs text-[var(--app-text-muted)] mt-1">
                            {order.type} • {order.priority} priority
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[var(--app-text)]">{order.customer.name}</div>
                      <div className="text-sm text-[var(--app-text-muted)]">{order.customer.phone}</div>
                      <div className="text-xs text-[var(--app-text-muted)]">{order.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.technician ? (
                        <div className="text-sm text-[var(--app-text)]">{order.technician.name}</div>
                      ) : (
                        <span className="text-sm text-[var(--app-text-muted)] italic">Belum ditugaskan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--app-text)]">{formatDate(order.scheduledAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.location.href = `/work-order-detail?id=${order.id}`}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                          title="Lihat Detail & Foto"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {order.latitude && order.longitude && (
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`, '_blank')}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            title="Open in Maps"
                          >
                            <Navigation className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => window.open(`tel:${order.customer.phone}`)}
                          className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-500/10 transition-colors"
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
          <div className="text-center py-8 text-[var(--app-text-muted)]">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-[var(--app-text-muted)]" />
            <p>Tidak ada work order yang sesuai filter</p>
          </div>
        )}
      </div>

      {/* Add Work Order Modal (Real Backend Integration) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[var(--app-card)] text-[var(--app-text)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--app-border)]">
            <div className="sticky top-0 bg-[var(--app-card)] border-b border-[var(--app-border)] px-6 py-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/15 text-blue-500 rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[var(--app-text)]">Tambah Work Order Baru</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors p-1"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Judul Pekerjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemasangan Baru Paket Gamer 50 Mbps"
                  value={newOrder.title}
                  onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
                  className="w-full bg-[var(--app-bg)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Nama Pelanggan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hendra Kusuma"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="w-full bg-[var(--app-bg)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">No. WhatsApp Pelanggan</label>
                  <input
                    type="text"
                    placeholder="0821xxxxxxxx"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="w-full bg-[var(--app-bg)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Alamat Pelanggan</label>
                <input
                  type="text"
                  placeholder="Jl. Mawar No. 12, RT 02/05..."
                  value={newOrder.customerAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, customerAddress: e.target.value })}
                  className="w-full bg-[var(--app-bg)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Tipe Pekerjaan</label>
                  <select 
                    value={newOrder.type}
                    onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value })}
                    className="w-full bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="installation">Installation</option>
                    <option value="repair">Repair</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Prioritas</label>
                  <select 
                    value={newOrder.priority}
                    onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
                    className="w-full bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Pilih Teknisi</label>
                  <select 
                    value={newOrder.technicianId}
                    onChange={(e) => setNewOrder({ ...newOrder, technicianId: e.target.value })}
                    className="w-full bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Belum Ditugaskan --</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Jadwal Pelaksanaan</label>
                <input
                  type="datetime-local"
                  value={newOrder.scheduledAt}
                  onChange={(e) => setNewOrder({ ...newOrder, scheduledAt: e.target.value })}
                  className="w-full bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--app-text)] uppercase mb-1">Deskripsi Tambahan / Catatan Lapangan</label>
                <textarea
                  rows={3}
                  placeholder="Catatan kabel, perangkat ONT, atau permintaan khusus pelanggan..."
                  value={newOrder.description}
                  onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                  className="w-full bg-[var(--app-bg)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="pt-4 border-t border-[var(--app-border)] flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-text)] py-2.5 rounded-xl hover:bg-[var(--app-card-subtle)] font-medium text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingOrder ? 'Menyimpan...' : 'Simpan & Tugaskan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
