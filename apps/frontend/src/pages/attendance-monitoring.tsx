import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  Clock, User, CheckCircle, XCircle, AlertCircle, Calendar, Eye, 
  Edit, Download, Search, Filter, X, MapPin
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
  };
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInPhoto: string | null;
  checkOutPhoto: string | null;
  checkInLat: number | null;
  checkInLong: number | null;
  checkOutLat: number | null;
  checkOutLong: number | null;
  status: string;
  workDuration: number | null;
}

export default function AttendanceMonitoring() {
  const router = useRouter();
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // New states for admin features
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    // Auth check - Only ADMIN can access monitoring
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role.toLowerCase() !== 'admin') {
      alert('Akses ditolak. Hanya Admin yang dapat mengakses monitoring absensi.');
      router.push('/');
      return;
    }

    setIsAuthorized(true);
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  // Apply filters whenever data or filters change
  useEffect(() => {
    let filtered = [...attendances];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(item => item.user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'absent') {
        filtered = filtered.filter(item => !item.checkInTime);
      } else {
        filtered = filtered.filter(item => item.status === statusFilter && item.checkInTime);
      }
    }

    setFilteredAttendances(filtered);
  }, [attendances, searchQuery, roleFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Load attendance data
      const attendanceResponse = await fetch(
        `${API_BASE_URL}/attendance/date/${selectedDate}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      if (attendanceResponse.ok) {
        const data = await attendanceResponse.json();
        setAttendances(data);
      }

      // Load stats
      const statsResponse = await fetch(
        `${API_BASE_URL}/attendance/stats?date=${selectedDate}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const getStatusBadge = (status: string, hasCheckedIn: boolean) => {
    if (!hasCheckedIn) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Absent</span>;
    }
    
    const badges: any = {
      'present': { color: 'bg-green-100 text-green-800', text: 'Hadir' },
      'late': { color: 'bg-orange-100 text-orange-800', text: 'Terlambat' },
      'leave': { color: 'bg-blue-100 text-blue-800', text: 'Izin' },
      'sick': { color: 'bg-purple-100 text-purple-800', text: 'Sakit' },
    };
    const badge = badges[status] || badges['present'];
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>;
  };

  const handleViewDetail = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleEditStatus = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditStatus(record.status);
    setShowEditModal(true);
  };

  const handleSaveStatus = async () => {
    if (!editingRecord) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/attendance/${editingRecord.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: editStatus })
        }
      );

      if (response.ok) {
        alert('Status berhasil diubah');
        setShowEditModal(false);
        loadData();
      } else {
        alert('Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan saat mengubah status');
    }
  };

  const handleExportToExcel = () => {
    // Convert data to CSV
    const headers = ['Nama', 'Email', 'Role', 'Check-In', 'Check-Out', 'Durasi', 'Status'];
    const csvData = [
      headers.join(','),
      ...filteredAttendances.map(item => [
        item.user.name,
        item.user.email,
        item.user.role,
        item.checkInTime ? formatTime(item.checkInTime) : '-',
        item.checkOutTime ? formatTime(item.checkOutTime) : '-',
        formatDuration(item.workDuration),
        item.checkInTime ? item.status : 'absent'
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `absensi-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openGoogleMaps = (lat: number | null, lng: number | null) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  if (!isAuthorized || loading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Absensi Karyawan</h1>
          <p className="text-gray-600">Real-time tracking kehadiran dan absensi</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Karyawan</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="text-gray-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hadir</p>
                  <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                  <p className="text-xs text-gray-500">{stats.attendanceRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terlambat</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-orange-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Absent</p>
                  <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Masih Kerja</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.stillWorking}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Data Absensi</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama/email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="technician">Teknisi</option>
                  <option value="noc">NOC</option>
                  <option value="finance">Finance</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="present">Hadir</option>
                  <option value="late">Terlambat</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Izin</option>
                  <option value="sick">Sakit</option>
                </select>

                {/* Date Picker */}
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-gray-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExportToExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    Search: {searchQuery}
                    <X size={14} className="cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {roleFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    Role: {roleFilter}
                    <X size={14} className="cursor-pointer" onClick={() => setRoleFilter('all')} />
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    Status: {statusFilter}
                    <X size={14} className="cursor-pointer" onClick={() => setStatusFilter('all')} />
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi Check-In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi Check-Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      {attendances.length === 0 
                        ? 'Tidak ada data absensi untuk tanggal ini'
                        : 'Tidak ada data yang sesuai dengan filter'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.user.name}</div>
                          <div className="text-sm text-gray-500">{item.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{item.user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatTime(item.checkInTime)}</div>
                        {item.checkInPhoto && (
                          <img 
                            src={item.checkInPhoto} 
                            alt="Check-in" 
                            className="w-10 h-10 rounded mt-1 object-cover cursor-pointer hover:opacity-75"
                            onClick={() => window.open(item.checkInPhoto!, '_blank')}
                            title="Klik untuk memperbesar"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.checkInLat && item.checkInLong ? (
                          <button
                            onClick={() => openGoogleMaps(item.checkInLat, item.checkInLong)}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100"
                            title={`${item.checkInLat.toFixed(4)}, ${item.checkInLong.toFixed(4)}`}
                          >
                            <MapPin size={12} />
                            Lihat
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatTime(item.checkOutTime)}</div>
                        {item.checkOutPhoto && (
                          <img 
                            src={item.checkOutPhoto} 
                            alt="Check-out" 
                            className="w-10 h-10 rounded mt-1 object-cover cursor-pointer hover:opacity-75"
                            onClick={() => window.open(item.checkOutPhoto!, '_blank')}
                            title="Klik untuk memperbesar"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.checkOutLat && item.checkOutLong ? (
                          <button
                            onClick={() => openGoogleMaps(item.checkOutLat, item.checkOutLong)}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100"
                            title={`${item.checkOutLat.toFixed(4)}, ${item.checkOutLong.toFixed(4)}`}
                          >
                            <MapPin size={12} />
                            Lihat
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDuration(item.workDuration)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status, !!item.checkInTime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditStatus(item)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit Status"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Detail Absensi</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Employee Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informasi Karyawan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nama</p>
                      <p className="font-medium">{selectedRecord.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedRecord.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {selectedRecord.user.role}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telepon</p>
                      <p className="font-medium">{selectedRecord.user.phone || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Attendance Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informasi Absensi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      {getStatusBadge(selectedRecord.status, !!selectedRecord.checkInTime)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Durasi Kerja</p>
                      <p className="font-medium">{formatDuration(selectedRecord.workDuration)}</p>
                    </div>
                  </div>
                </div>

                {/* Check-In Info */}
                {selectedRecord.checkInTime && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Check-In</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Waktu</p>
                          <p className="font-medium">{new Date(selectedRecord.checkInTime).toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Lokasi GPS</p>
                          {selectedRecord.checkInLat && selectedRecord.checkInLong ? (
                            <div className="space-y-1">
                              <p className="font-medium text-sm">
                                {selectedRecord.checkInLat.toFixed(4)}, {selectedRecord.checkInLong.toFixed(4)}
                              </p>
                              <button
                                onClick={() => openGoogleMaps(selectedRecord.checkInLat, selectedRecord.checkInLong)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                <MapPin size={14} />
                                Buka Maps
                              </button>
                            </div>
                          ) : (
                            <p className="font-medium text-sm">-</p>
                          )}
                        </div>
                      </div>
                      {selectedRecord.checkInPhoto && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Foto</p>
                          <img 
                            src={selectedRecord.checkInPhoto} 
                            alt="Check-in" 
                            className="w-48 h-48 rounded-lg object-cover cursor-pointer hover:opacity-75"
                            onClick={() => window.open(selectedRecord.checkInPhoto!, '_blank')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Check-Out Info */}
                {selectedRecord.checkOutTime && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Check-Out</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Waktu</p>
                          <p className="font-medium">{new Date(selectedRecord.checkOutTime).toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Lokasi GPS</p>
                          {selectedRecord.checkOutLat && selectedRecord.checkOutLong ? (
                            <div className="space-y-1">
                              <p className="font-medium text-sm">
                                {selectedRecord.checkOutLat.toFixed(4)}, {selectedRecord.checkOutLong.toFixed(4)}
                              </p>
                              <button
                                onClick={() => openGoogleMaps(selectedRecord.checkOutLat, selectedRecord.checkOutLong)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                <MapPin size={14} />
                                Buka Maps
                              </button>
                            </div>
                          ) : (
                            <p className="font-medium text-sm">-</p>
                          )}
                        </div>
                      </div>
                      {selectedRecord.checkOutPhoto && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Foto</p>
                          <img 
                            src={selectedRecord.checkOutPhoto} 
                            alt="Check-out" 
                            className="w-48 h-48 rounded-lg object-cover cursor-pointer hover:opacity-75"
                            onClick={() => window.open(selectedRecord.checkOutPhoto!, '_blank')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Status Modal */}
        {showEditModal && editingRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Edit Status Absensi</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Karyawan</p>
                  <p className="font-medium text-lg">{editingRecord.user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Absensi
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="present">Hadir</option>
                    <option value="late">Terlambat</option>
                    <option value="leave">Izin</option>
                    <option value="sick">Sakit</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    * Ubah status jika ada koreksi yang diperlukan
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveStatus}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
