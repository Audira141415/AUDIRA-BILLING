import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  MapPin, Clock, CheckCircle, XCircle, Camera, FileSignature, 
  Star, Phone, Navigation, ChevronRight, AlertCircle
} from 'lucide-react';

interface WorkOrder {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  scheduledAt: string;
  location: string;
  latitude?: number;
  longitude?: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  photos: string[];
  signature?: string;
}

export default function TechnicianDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    avgRating: '0.0',
  });
  const [selectedJob, setSelectedJob] = useState<WorkOrder | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);

  // Mock technician ID (replace with actual auth)
  const technicianId = 'tech-1';

  useEffect(() => {
    loadTodayJobs();
    loadStats();
  }, []);

  const loadTodayJobs = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/field-service/technician/${technicianId}/today`);
    // const data = await response.json();
    
    // Mock data
    const mockJobs: WorkOrder[] = [
      {
        id: '1',
        type: 'installation',
        priority: 'high',
        status: 'assigned',
        title: 'Instalasi Baru - Paket 50 Mbps',
        description: 'Instalasi router dan ONT untuk pelanggan baru',
        scheduledAt: new Date().toISOString(),
        location: 'Jl. Merdeka No. 123',
        latitude: -6.2088,
        longitude: 106.8456,
        customer: {
          name: 'Budi Santoso',
          phone: '08123456789',
          address: 'Jl. Merdeka No. 123, Jakarta',
        },
        photos: [],
      },
      {
        id: '2',
        type: 'repair',
        priority: 'urgent',
        status: 'assigned',
        title: 'Perbaikan Koneksi Lambat',
        description: 'Pelanggan melaporkan kecepatan internet sangat lambat',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Jl. Sudirman No. 45',
        latitude: -6.2115,
        longitude: 106.8452,
        customer: {
          name: 'Siti Rahayu',
          phone: '08198765432',
          address: 'Jl. Sudirman No. 45, Jakarta',
        },
        photos: [],
      },
    ];

    setWorkOrders(mockJobs);
  };

  const loadStats = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/field-service/stats?technicianId=${technicianId}`);
    // const data = await response.json();

    setStats({
      total: 25,
      pending: 3,
      inProgress: 1,
      completed: 21,
      avgRating: '4.8',
    });
  };

  const startJob = async (jobId: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        // TODO: Replace with actual API call
        // await fetch(`/api/field-service/jobs/${jobId}/start`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ latitude, longitude }),
        // });

        alert(`Job started at: ${latitude}, ${longitude}`);
        loadTodayJobs();
      });
    }
  };

  const openMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Field Service</h1>
        <p className="text-sm text-blue-100">Teknisi Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          <div className="text-xs text-gray-600">Selesai</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.inProgress}</div>
          <div className="text-xs text-gray-600">Sedang Dikerjakan</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">{stats.avgRating}</span>
          </div>
          <div className="text-xs text-gray-600">Rating Rata-rata</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'today'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Hari Ini ({workOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Semua Pekerjaan
        </button>
      </div>

      {/* Job List */}
      <div className="p-4 space-y-3">
        {workOrders.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Priority Badge */}
            <div className={`px-3 py-1 text-xs font-medium border-b ${getPriorityColor(job.priority)}`}>
              {job.priority.toUpperCase()} PRIORITY
            </div>

            <div className="p-3">
              {/* Job Info */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.customer.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${job.customer.phone}`} className="text-blue-600">
                    {job.customer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatTime(job.scheduledAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {job.latitude && job.longitude && (
                  <button
                    onClick={() => openMaps(job.latitude!, job.longitude!)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-green-700"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </button>
                )}
                
                {job.status === 'assigned' && (
                  <button
                    onClick={() => startJob(job.id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Mulai Pekerjaan
                  </button>
                )}

                {job.status === 'in-progress' && (
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowJobDetail(true);
                    }}
                    className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-700"
                  >
                    Lanjutkan
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {workOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Tidak ada pekerjaan untuk hari ini</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal (placeholder) */}
      {showJobDetail && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">Detail Pekerjaan</h2>
              <button
                onClick={() => setShowJobDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Feature lengkap untuk upload foto, tanda tangan, dan rating akan ditambahkan
              </p>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Foto
                </button>
                
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <FileSignature className="w-5 h-5" />
                  Tanda Tangan Pelanggan
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Selesaikan Pekerjaan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
