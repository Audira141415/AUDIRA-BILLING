import Link from 'next/link';
import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  MapPin, Clock, CheckCircle, Camera, Navigation, 
  AlertCircle, User, Phone, Calendar, Play, Square
} from 'lucide-react';

interface TechnicianJob {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  scheduledAt: string;
  startedAt?: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  latitude?: number;
  longitude?: number;
}

export default function TechnicianCheckIn() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<TechnicianJob[]>([]);
  const [activeJob, setActiveJob] = useState<TechnicianJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [pendingCheckIn, setPendingCheckIn] = useState<TechnicianJob | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      loadTodayJobs(parsed.id);
    }
  }, []);

  const loadTodayJobs = async (technicianId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/field-service/technician/${technicianId}/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        
        // Find active job
        const active = data.find((j: TechnicianJob) => j.status === 'in-progress');
        if (active) {
          setActiveJob(active);
        }
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      setGettingLocation(true);
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        setGettingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          setGettingLocation(false);
          resolve(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoData);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      const video = document.getElementById('camera-video') as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('❌ Tidak bisa akses kamera. Pastikan izin kamera diaktifkan.');
    }
  };

  const stopCamera = () => {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCheckIn = async (job: TechnicianJob) => {
    setPendingCheckIn(job);
    setShowCamera(true);
    setTimeout(() => startCamera(), 100);
  };

  const confirmCheckIn = async () => {
    if (!pendingCheckIn || !capturedPhoto) return;

    try {
      // Get location
      const coords = await getLocation();
      
      const token = localStorage.getItem('token');
      
      // Check-in dengan lokasi dan foto selfie
      const response = await fetch(`${API_BASE_URL}/field-service/jobs/${pendingCheckIn.id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: coords.lat,
          longitude: coords.lng,
          checkInPhoto: capturedPhoto // Foto selfie langsung disimpan di checkInPhoto field
        })
      });

      if (response.ok) {
        alert('✅ Check-in berhasil! Lokasi dan foto terekam.');
        setActiveJob(pendingCheckIn);
        setShowCamera(false);
        setCapturedPhoto(null);
        setPendingCheckIn(null);
        stopCamera();
        if (user) {
          loadTodayJobs(user.id);
        }
      } else {
        alert('⚠️ Check-in gagal. Coba lagi.');
      }
    } catch (error) {
      console.error('Error check-in:', error);
      alert('❌ Gagal check-in. Pastikan GPS dan kamera aktif.');
    }
  };

  const cancelCheckIn = () => {
    stopCamera();
    setShowCamera(false);
    setCapturedPhoto(null);
    setPendingCheckIn(null);
  };

  const handleCheckOut = async (job: TechnicianJob) => {
    if (!confirm('Selesaikan pekerjaan ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/field-service/jobs/${job.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: 'Pekerjaan selesai'
        })
      });

      if (response.ok) {
        alert('✅ Check-out berhasil! Pekerjaan selesai.');
        setActiveJob(null);
        if (user) {
          loadTodayJobs(user.id);
        }
      } else {
        alert('⚠️ Check-out gagal.');
      }
    } catch (error) {
      console.error('Error check-out:', error);
      alert('❌ Gagal check-out');
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Belum Mulai' },
      'assigned': { color: 'bg-blue-100 text-blue-800', text: 'Ditugaskan' },
      'in-progress': { color: 'bg-green-100 text-green-800', text: 'Sedang Dikerjakan' },
      'completed': { color: 'bg-gray-100 text-[var(--app-text)]', text: 'Selesai' },
    };
    const badge = badges[status] || badges['pending'];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
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
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-[var(--app-card)] rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-text)]">{user?.name || 'Teknisi'}</h1>
              <p className="text-[var(--app-muted)]">{user?.email}</p>
              <p className="text-sm text-[var(--app-muted)] flex items-center gap-2 mt-1">
                <Calendar size={16} />
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Active Job */}
        {activeJob && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Play size={24} />
                Pekerjaan Aktif
              </h2>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span className="text-lg font-semibold">
                  {activeJob.startedAt ? formatTime(activeJob.startedAt) : '-'}
                </span>
              </div>
            </div>
            
            <div className="bg-[var(--app-card)] bg-opacity-20 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">{activeJob.title}</h3>
              <p className="text-sm opacity-90 mb-3">{activeJob.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{activeJob.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <a href={`tel:${activeJob.customer.phone}`} className="underline">
                    {activeJob.customer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="flex-1">{activeJob.customer.address}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {activeJob.latitude && activeJob.longitude && (
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeJob.latitude},${activeJob.longitude}`, '_blank')}
                  className="flex-1 bg-[var(--app-card)] text-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <Navigation size={20} />
                  Navigasi
                </button>
              )}
              <button
                onClick={() => router.push(`/work-order-detail?id=${activeJob.id}`)}
                className="flex-1 bg-[var(--app-card)] text-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Upload Foto
              </button>
              <button
                onClick={() => handleCheckOut(activeJob)}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <Square size={20} />
                Check Out
              </button>
            </div>
          </div>
        )}

        {/* Today's Jobs */}
        <div className="bg-[var(--app-card)] rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[var(--app-text)] flex items-center gap-2">
              <Calendar size={24} className="text-blue-600" />
              Jadwal Hari Ini ({jobs.length})
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center text-[var(--app-muted)]">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-[var(--app-muted)]" />
              <p>Tidak ada jadwal untuk hari ini</p>
            </div>
          ) : (
            <div className="divide-y">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-[var(--app-bg)]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--app-text)] mb-1">{job.title}</h3>
                      <p className="text-sm text-[var(--app-muted)] mb-2">{job.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-[var(--app-muted)] mb-2">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTime(job.scheduledAt)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-[var(--app-text)]'
                        }`}>
                          {job.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-sm text-gray-700">
                        <p className="font-medium">{job.customer.name}</p>
                        <p className="text-[var(--app-muted)]">{job.customer.address}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {getStatusBadge(job.status)}
                    </div>
                  </div>

                  {job.status === 'assigned' && !activeJob && (
                    <button
                      onClick={() => handleCheckIn(job)}
                      disabled={gettingLocation}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      {gettingLocation ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Mendapatkan Lokasi...</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={20} />
                          <span>Check In - Mulai Pekerjaan</span>
                        </>
                      )}
                    </button>
                  )}

                  {job.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle size={16} />
                      <span>Pekerjaan selesai</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-lg max-w-lg w-full p-6">
              <h3 className="text-xl font-bold mb-4">Foto Selfie Check-In</h3>
              
              {!capturedPhoto ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
                    <video
                      id="camera-video"
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Camera size={20} />
                      Ambil Foto
                    </button>
                    <button
                      onClick={cancelCheckIn}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-[var(--app-bg)]"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={capturedPhoto} alt="Preview" className="w-full" />
                  </div>
                  <p className="text-sm text-[var(--app-muted)] text-center">
                    Pastikan wajah Anda terlihat jelas
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCapturedPhoto(null)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-[var(--app-bg)]"
                    >
                      Ulangi
                    </button>
                    <button
                      onClick={confirmCheckIn}
                      disabled={gettingLocation}
                      className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      {gettingLocation ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Proses...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Konfirmasi Check-In</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
