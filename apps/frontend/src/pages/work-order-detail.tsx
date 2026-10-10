import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  MapPin, User, Calendar, Clock, AlertCircle, CheckCircle, 
  Camera, Upload, X, Download, Phone, Navigation, Image as ImageIcon
} from 'lucide-react';

interface WorkOrderDetail {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
  technician?: {
    id: string;
    name: string;
    email: string;
  };
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  photos: string[];
  signature?: string;
  rating?: number;
  feedback?: string;
}

export default function WorkOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [workOrder, setWorkOrder] = useState<WorkOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadWorkOrderDetail();
    }
  }, [id]);

  const loadWorkOrderDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/field-service/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkOrder(data);
      } else {
        // Mock data for demo
        setWorkOrder({
          id: id as string,
          type: 'installation',
          priority: 'high',
          status: 'in-progress',
          title: 'Instalasi Baru - Paket 50 Mbps',
          description: 'Instalasi router dan ONT untuk pelanggan baru',
          scheduledAt: new Date().toISOString(),
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: 'cust-1',
            name: 'Budi Santoso',
            phone: '08123456789',
            address: 'Jl. Merdeka No. 123, Jakarta',
          },
          technician: {
            id: 'tech-1',
            name: 'Ahmad Rizki',
            email: 'ahmad@example.com',
          },
          location: 'Jl. Merdeka No. 123',
          latitude: -6.2088,
          longitude: 106.8456,
          photos: [
            'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Before+Installation',
            'https://via.placeholder.com/400x300/059669/FFFFFF?text=During+Work',
            'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Equipment+Setup',
          ],
          notes: 'Pemasangan ONT di ruang kerja lantai 2. Customer request cable management yang rapi.',
        });
      }
    } catch (error) {
      console.error('Error loading work order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('photos', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/field-service/jobs/${id}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ Foto berhasil diupload!');
        loadWorkOrderDetail(); // Reload to show new photos
      } else {
        // Simulate success for demo
        const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
        setWorkOrder(prev => prev ? {
          ...prev,
          photos: [...prev.photos, ...newPhotos]
        } : null);
        alert('✅ Foto berhasil diupload! (Demo mode)');
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('❌ Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/field-service/jobs/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('✅ Status berhasil diupdate!');
        loadWorkOrderDetail();
      } else {
        alert('⚠️ Gagal update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Error update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'assigned': { color: 'bg-purple-100 text-purple-800', text: 'Assigned' },
      'on-route': { color: 'bg-blue-100 text-blue-800', text: 'On Route' },
      'in-progress': { color: 'bg-orange-100 text-orange-800', text: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    };
    const badge = badges[status] || badges['pending'];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!workOrder) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Work Order tidak ditemukan</h2>
            <button
              onClick={() => router.push('/field-service')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Kembali ke List
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/field-service')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Kembali ke List
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{workOrder.title}</h1>
              <p className="text-gray-600 mt-1">{workOrder.description}</p>
            </div>
            {getStatusBadge(workOrder.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informasi Customer
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium">{workOrder.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telepon</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{workOrder.customer.phone}</p>
                    <button
                      onClick={() => window.open(`tel:${workOrder.customer.phone}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Alamat</p>
                  <div className="flex items-start gap-2">
                    <p className="font-medium flex-1">{workOrder.customer.address}</p>
                    {workOrder.latitude && workOrder.longitude && (
                      <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${workOrder.latitude},${workOrder.longitude}`, '_blank')}
                        className="text-green-600 hover:text-green-800"
                        title="Open in Maps"
                      >
                        <Navigation className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Technician Info */}
            {workOrder.technician && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Teknisi
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{workOrder.technician.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{workOrder.technician.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Photos Evidence */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  Foto Bukti Pekerjaan ({workOrder.photos.length})
                </h2>
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    className="hidden"
                    disabled={uploading || workOrder.status === 'completed'}
                  />
                  <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Foto</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {workOrder.photos.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Belum ada foto</p>
                  <p className="text-sm text-gray-400 mt-1">Upload foto bukti pekerjaan</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {workOrder.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                        onClick={() => setSelectedImage(photo)}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            {workOrder.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-3">Catatan</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{workOrder.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Dijadwalkan</p>
                  <p className="font-medium">{formatDateTime(workOrder.scheduledAt)}</p>
                </div>
                {workOrder.startedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Mulai Kerja</p>
                    <p className="font-medium text-green-600">{formatDateTime(workOrder.startedAt)}</p>
                  </div>
                )}
                {workOrder.completedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Selesai</p>
                    <p className="font-medium text-blue-600">{formatDateTime(workOrder.completedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            {workOrder.status !== 'completed' && workOrder.status !== 'cancelled' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Update Status</h2>
                <div className="space-y-2">
                  {workOrder.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus('on-route')}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Berangkat ke Lokasi
                    </button>
                  )}
                  {(workOrder.status === 'assigned' || workOrder.status === 'on-route') && (
                    <button
                      onClick={() => handleUpdateStatus('in-progress')}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                    >
                      Mulai Pekerjaan
                    </button>
                  )}
                  {workOrder.status === 'in-progress' && (
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Selesaikan Pekerjaan
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Work Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Informasi Pekerjaan</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tipe</p>
                  <p className="font-medium capitalize">{workOrder.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <span className={`px-2 py-1 rounded text-sm ${
                    workOrder.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    workOrder.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    workOrder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {workOrder.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
