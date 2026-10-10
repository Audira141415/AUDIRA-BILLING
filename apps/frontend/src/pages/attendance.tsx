import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { API_ENDPOINTS } from '../config/api';
import { 
  Clock, Camera, MapPin, CheckCircle, User, Calendar
} from 'lucide-react';

export default function AttendanceCheckIn() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [checkInOut, setCheckInOut] = useState<'in' | 'out'>('in');
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(userData);
    
    // Admin tidak perlu check-in, redirect ke monitoring
    if (parsed.role.toLowerCase() === 'admin') {
      router.push('/attendance-monitoring');
      return;
    }
    
    // Staff roles can check-in
    const allowedRoles = ['billing', 'noc', 'cs', 'technician'];
    if (!allowedRoles.includes(parsed.role.toLowerCase())) {
      alert('Anda tidak memiliki akses ke halaman ini');
      router.push('/');
      return;
    }

    setUser(parsed);
    loadAttendanceStatus(parsed.id);
  }, [router]);

  const loadAttendanceStatus = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ATTENDANCE.STATUS(userId), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
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
      alert('❌ Tidak bisa akses kamera');
    }
  };

  const stopCamera = () => {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCheckInOutClick = (type: 'in' | 'out') => {
    setCheckInOut(type);
    setShowCamera(true);
    setTimeout(() => startCamera(), 100);
  };

  const confirmCheckInOut = async () => {
    if (!user || !capturedPhoto) return;

    try {
      const coords = await getLocation();
      const token = localStorage.getItem('token');
      const endpoint = checkInOut === 'in' ? API_ENDPOINTS.ATTENDANCE.CHECKIN : API_ENDPOINTS.ATTENDANCE.CHECKOUT;
      const photoField = checkInOut === 'in' ? 'checkInPhoto' : 'checkOutPhoto';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          [photoField]: capturedPhoto,
          latitude: coords.lat,
          longitude: coords.lng
        })
      });

      if (response.ok) {
        const action = checkInOut === 'in' ? 'Check-in' : 'Check-out';
        alert(`✅ ${action} berhasil! Selamat ${checkInOut === 'in' ? 'bekerja' : 'istirahat'} 😊`);
        setShowCamera(false);
        setCapturedPhoto(null);
        stopCamera();
        loadAttendanceStatus(user.id);
      } else {
        const error = await response.json();
        alert(`⚠️ ${error.message || 'Gagal melakukan absensi'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || '❌ Gagal melakukan absensi');
    }
  };

  const cancelCamera = () => {
    stopCamera();
    setShowCamera(false);
    setCapturedPhoto(null);
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
              <p className="text-blue-100">{user?.role || 'Employee'}</p>
              <p className="text-sm text-blue-200">{user?.email}</p>
            </div>
          </div>

          {/* Current Time */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar size={20} />
              <span className="text-sm">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="text-4xl font-bold">{currentTime}</div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Status Absensi Hari Ini</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Check-In Status */}
            <div className={`p-4 rounded-lg border-2 ${
              attendance?.hasCheckedIn 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Check-In</span>
                {attendance?.hasCheckedIn && (
                  <CheckCircle className="text-green-600" size={20} />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(attendance?.checkInTime)}
              </div>
              {attendance?.status === 'late' && (
                <span className="text-xs text-red-600 font-medium">Terlambat</span>
              )}
            </div>

            {/* Check-Out Status */}
            <div className={`p-4 rounded-lg border-2 ${
              attendance?.hasCheckedOut 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Check-Out</span>
                {attendance?.hasCheckedOut && (
                  <CheckCircle className="text-blue-600" size={20} />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(attendance?.checkOutTime)}
              </div>
            </div>
          </div>

          {/* Duration */}
          {attendance?.workDuration > 0 && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Durasi Kerja</span>
                <Clock className="text-purple-600" size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {formatDuration(attendance.workDuration)}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!attendance?.hasCheckedIn && (
            <button
              onClick={() => handleCheckInOutClick('in')}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 flex items-center justify-center gap-3 shadow-lg"
            >
              <Camera size={24} />
              <span>Check-In - Masuk Kerja</span>
            </button>
          )}

          {attendance?.hasCheckedIn && !attendance?.hasCheckedOut && (
            <button
              onClick={() => handleCheckInOutClick('out')}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 flex items-center justify-center gap-3 shadow-lg"
            >
              <Camera size={24} />
              <span>Check-Out - Pulang Kerja</span>
            </button>
          )}

          {attendance?.hasCheckedIn && attendance?.hasCheckedOut && (
            <div className="bg-gray-100 text-gray-600 px-6 py-4 rounded-lg text-center">
              <CheckCircle className="inline-block mr-2" size={20} />
              <span className="font-medium">Absensi hari ini sudah lengkap</span>
            </div>
          )}
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-xl font-bold mb-4">
                Foto Selfie {checkInOut === 'in' ? 'Check-In' : 'Check-Out'}
              </h3>
              
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
                      onClick={cancelCamera}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                  <p className="text-sm text-gray-600 text-center">
                    Pastikan wajah Anda terlihat jelas
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCapturedPhoto(null)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Ulangi
                    </button>
                    <button
                      onClick={confirmCheckInOut}
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
                          <span>Konfirmasi</span>
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
