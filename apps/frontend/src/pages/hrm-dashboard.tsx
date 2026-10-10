import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { 
  Users, DollarSign, Calendar, TrendingUp, Award, Clock, 
  FileText, CheckCircle, XCircle, AlertCircle, BarChart3, MapPin 
} from 'lucide-react';

export default function HRMDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    employee: null,
    salary: null,
    leave: null,
    performance: null,
    attendance: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadAllStats();
  }, [router]);

  const loadAllStats = async () => {
    try {
      setLoading(true);
      const [employeeStats, salaryStats, leaveStats, performanceStats, attendanceStats] = await Promise.all([
        api.employee.getStats(),
        api.salary.getStats(),
        api.leave.getStats(),
        api.performance.getStats(),
        api.attendance.getStats(),
      ]);
      setStats({
        employee: employeeStats,
        salary: salaryStats,
        leave: leaveStats,
        performance: performanceStats,
        attendance: attendanceStats,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={36} />
            HRM Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Overview Human Resource Management</p>
        </div>

        {/* Employee Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Statistik Karyawan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Total Karyawan</p>
                <Users size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.employee?.total || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Aktif</p>
                <CheckCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.employee?.active || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-100 text-sm">Tidak Aktif</p>
                <XCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.employee?.inactive || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-red-100 text-sm">Resign</p>
                <AlertCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.employee?.resigned || 0}</h3>
            </div>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={24} className="text-blue-600" />
            Kehadiran Hari Ini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Hadir</p>
                <CheckCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.attendance?.present || 0}</h3>
              <p className="text-green-200 text-xs mt-1">dari {stats.attendance?.totalEmployees || 0} karyawan</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-yellow-100 text-sm">Terlambat</p>
                <AlertCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.attendance?.late || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-red-100 text-sm">Tidak Hadir</p>
                <XCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.attendance?.absent || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Sedang Bekerja</p>
                <Clock size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.attendance?.stillWorking || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100 text-sm">Tingkat Kehadiran</p>
                <BarChart3 size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.attendance?.attendanceRate || 0}%</h3>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/attendance-monitoring')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <MapPin size={20} />
              <span>Lihat Pelacakan Langsung</span>
            </button>
          </div>
        </div>

        {/* Salary Stats */}
        <div className="mb-8">"
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-green-600" />
            Statistik Gaji
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm mb-2">Total Gaji</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.salary?.totalAmount || 0)}</h3>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm mb-2">Sudah Dibayar</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.salary?.paidAmount || 0)}</h3>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-yellow-100 text-sm mb-2">Pending</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.salary?.pendingAmount || 0)}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm mb-2">Total Slip</p>
              <h3 className="text-4xl font-bold">{stats.salary?.total || 0}</h3>
            </div>
          </div>
        </div>

        {/* Leave Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-orange-600" />
            Statistik Cuti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Total Pengajuan</p>
                <FileText size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.leave?.total || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-yellow-100 text-sm">Pending</p>
                <Clock size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.leave?.pending || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Approved</p>
                <CheckCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.leave?.approved || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-red-100 text-sm">Rejected</p>
                <XCircle size={24} className="opacity-80" />
              </div>
              <h3 className="text-4xl font-bold">{stats.leave?.rejected || 0}</h3>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-purple-600" />
            Statistik Kinerja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm mb-2">Total Review</p>
              <h3 className="text-4xl font-bold">{stats.performance?.total || 0}</h3>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Rata-rata Skor</p>
                  <h3 className="text-4xl font-bold mt-2">{Math.round(stats.performance?.averageScores?.overall || 0)}</h3>
                </div>
                <Award size={40} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm mb-2">Produktivitas</p>
              <h3 className="text-4xl font-bold">{Math.round(stats.performance?.averageScores?.productivity || 0)}</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm mb-2">Kualitas</p>
              <h3 className="text-4xl font-bold">{Math.round(stats.performance?.averageScores?.quality || 0)}</h3>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => router.push('/karyawan')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
            >
              <Users size={32} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Data Karyawan</span>
            </button>
            <button
              onClick={() => router.push('/gaji')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
            >
              <DollarSign size={32} className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">Gaji & Payroll</span>
            </button>
            <button
              onClick={() => router.push('/cuti')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-400 transition-all"
            >
              <Calendar size={32} className="text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Pengajuan Cuti</span>
            </button>
            <button
              onClick={() => router.push('/jadwal-kerja')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all"
            >
              <Clock size={32} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Jadwal Kerja</span>
            </button>
            <button
              onClick={() => router.push('/kinerja')}
              className="flex flex-col items-center gap-2 p-4 border-2 border-pink-200 rounded-lg hover:bg-pink-50 hover:border-pink-400 transition-all"
            >
              <TrendingUp size={32} className="text-pink-600" />
              <span className="text-sm font-medium text-gray-700">Kinerja</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
