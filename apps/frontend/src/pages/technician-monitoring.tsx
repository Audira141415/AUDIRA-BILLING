import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  MapPin, Clock, User, Phone, CheckCircle, XCircle,
  Activity, Calendar, Navigation, Eye, Filter
} from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeJob?: {
    id: string;
    title: string;
    customer: {
      name: string;
      address: string;
    };
    startedAt: string;
    latitude?: number;
    longitude?: number;
  };
  todayStats: {
    total: number;
    completed: number;
    inProgress: number;
  };
}

interface CheckInHistory {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  technicianName: string;
  customerName: string;
  startedAt: string;
  completedAt?: string;
  latitude?: number;
  longitude?: number;
  duration?: string;
  status: string;
}

export default function TechnicianMonitoring() {
  const router = useRouter();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [checkInHistory, setCheckInHistory] = useState<CheckInHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Load all work orders to get unique technicians
      const workOrdersResponse = await fetch('${API_BASE_URL}/field-service/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (workOrdersResponse.ok) {
        const allWorkOrders = await workOrdersResponse.json();
        
        // Group by technician
        const techMap = new Map<string, any>();
        
        allWorkOrders.forEach((wo: any) => {
          if (wo.technician) {
            const techId = wo.technician.id;
            
            if (!techMap.has(techId)) {
              techMap.set(techId, {
                id: techId,
                name: wo.technician.name,
                email: wo.technician.email || `${wo.technician.name.toLowerCase().replace(' ', '.')}@audira.net`,
                phone: wo.technician.phone || '-',
                todayStats: { total: 0, completed: 0, inProgress: 0 }
              });
            }
          }
        });
        
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Calculate stats for each technician
        const enrichedTechnicians = Array.from(techMap.values()).map(tech => {
          const techJobs = allWorkOrders.filter((wo: any) => 
            wo.technician?.id === tech.id &&
            new Date(wo.scheduledAt) >= today &&
            new Date(wo.scheduledAt) < tomorrow
          );
          
          const activeJob = techJobs.find((j: any) => j.status === 'in-progress');
          const completed = techJobs.filter((j: any) => j.status === 'completed').length;
          const inProgress = techJobs.filter((j: any) => j.status === 'in-progress').length;
          
          return {
            ...tech,
            activeJob: activeJob ? {
              id: activeJob.id,
              title: activeJob.title,
              customer: activeJob.customer || { name: 'Unknown', address: '-' },
              startedAt: activeJob.startedAt,
              latitude: activeJob.latitude,
              longitude: activeJob.longitude,
            } : undefined,
            todayStats: {
              total: techJobs.length,
              completed,
              inProgress
            }
          };
        });
        
        setTechnicians(enrichedTechnicians);
      }
      
      // Load check-in history
      const historyResponse = await fetch(
        `${API_BASE_URL}/field-service/check-in-history?date=${selectedDate}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setCheckInHistory(historyData);
      }
      
    } catch (error) {
      console.error('Error loading monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Sedang berlangsung';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'in-progress': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Teknisi</h1>
          <p className="text-gray-600">Real-time tracking teknisi lapangan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Teknisi</p>
                <p className="text-3xl font-bold text-gray-900">{technicians.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sedang Bekerja</p>
                <p className="text-3xl font-bold text-green-600">
                  {technicians.filter(t => t.activeJob).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pekerjaan Selesai</p>
                <p className="text-3xl font-bold text-blue-600">
                  {technicians.reduce((sum, t) => sum + t.todayStats.completed, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Hari Ini</p>
                <p className="text-3xl font-bold text-gray-900">
                  {technicians.reduce((sum, t) => sum + t.todayStats.total, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'live'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Live Status
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History Check-In
              </button>
            </div>
          </div>

          {/* Live Status Tab */}
          {activeTab === 'live' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.map((tech) => (
                  <div key={tech.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    {/* Technician Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{tech.name}</h3>
                          <p className="text-sm text-gray-600">{tech.email}</p>
                        </div>
                      </div>
                      {tech.activeJob ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <Activity size={16} />
                          Active
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Idle</span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-lg font-bold text-gray-900">{tech.todayStats.total}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-xs text-gray-600">Selesai</p>
                        <p className="text-lg font-bold text-green-600">{tech.todayStats.completed}</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-600">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{tech.todayStats.inProgress}</p>
                      </div>
                    </div>

                    {/* Active Job */}
                    {tech.activeJob ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-900 mb-2">
                          {tech.activeJob.title}
                        </p>
                        <div className="space-y-1 text-sm text-green-800">
                          <p className="flex items-center gap-1">
                            <User size={14} />
                            {tech.activeJob.customer.name}
                          </p>
                          <p className="flex items-center gap-1">
                            <Clock size={14} />
                            Check-in: {formatTime(tech.activeJob.startedAt)}
                          </p>
                          {tech.activeJob.latitude && tech.activeJob.longitude && (
                            <button
                              onClick={() => window.open(
                                `https://www.google.com/maps/search/?api=1&query=${tech.activeJob!.latitude},${tech.activeJob!.longitude}`,
                                '_blank'
                              )}
                              className="flex items-center gap-1 text-green-700 hover:text-green-900 underline"
                            >
                              <MapPin size={14} />
                              Lihat Lokasi
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => router.push(`/work-order-detail?id=${tech.activeJob!.id}`)}
                          className="w-full mt-3 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye size={16} />
                          Lihat Detail
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm">
                        Tidak ada pekerjaan aktif
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-6">
              {/* Date Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* History Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Teknisi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pekerjaan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check-In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Foto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check-Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Durasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {checkInHistory.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                          Tidak ada data check-in untuk tanggal ini
                        </td>
                      </tr>
                    ) : (
                      checkInHistory.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.technicianName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.workOrderTitle}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.customerName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatTime(item.startedAt)}
                          </td>
                          <td className="px-6 py-4">
                            {item.checkInPhoto ? (
                              <img 
                                src={item.checkInPhoto} 
                                alt="Check-in" 
                                className="w-12 h-12 rounded object-cover cursor-pointer hover:opacity-75"
                                onClick={() => window.open(item.checkInPhoto, '_blank')}
                                title="Klik untuk memperbesar"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.completedAt ? formatTime(item.completedAt) : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDuration(item.startedAt, item.completedAt)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status === 'in-progress' ? 'Berlangsung' : 'Selesai'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => router.push(`/work-order-detail?id=${item.workOrderId}`)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Eye size={16} />
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
