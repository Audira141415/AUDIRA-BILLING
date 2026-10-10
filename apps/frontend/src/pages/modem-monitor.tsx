import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Wifi, WifiOff, Activity, RefreshCw, Router, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ModemInfo {
  customerId: string;
  customerName: string;
  internetNumber: string;
  ipAddress: string;
  modemType: string;
  modemSerial: string;
  status: 'online' | 'offline' | 'unknown';
  responseTime?: number;
  installationDate?: string;
}

interface ModemStats {
  total: number;
  online: number;
  offline: number;
  unknown: number;
  onlinePercentage: number;
  byType: Record<string, number>;
  avgResponseTime: number;
}

export default function ModemMonitor() {
  const [modems, setModems] = useState<ModemInfo[]>([]);
  const [stats, setStats] = useState<ModemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchModems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modem/list`);
      setModems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch modems:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modem/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchModems();
    fetchStats();

    // Auto refresh every 60 seconds
    const interval = setInterval(() => {
      fetchModems();
      fetchStats();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchModems();
    await fetchStats();
  };

  const filteredModems = modems.filter((modem) => {
    const matchesFilter =
      filter === 'all' ||
      modem.status === filter;

    const matchesSearch =
      searchTerm === '' ||
      (modem.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (modem.ipAddress || '').includes(searchTerm) ||
      (modem.internetNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Modem Monitoring</h1>
              <p className="text-gray-600">Real-time status monitoring semua modem pelanggan</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Modem</h3>
              <Router className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Online</h3>
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.online}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.onlinePercentage}% uptime</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Offline</h3>
              <WifiOff className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.offline}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              <Activity className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats.avgResponseTime.toFixed(1)} ms</p>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'all' ? 'bg-white text-gray-800 shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'online' ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'offline' ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Offline
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari nama, IP, atau nomor internet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Modem Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Internet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Modem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredModems.map((modem) => (
              <tr key={modem.customerId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{modem.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{modem.internetNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{modem.ipAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{modem.modemType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(modem.status)}`}>
                    {getStatusIcon(modem.status)}
                    {modem.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {modem.status === 'online' ? `${modem.responseTime || 0} ms` : '-'}
                </td>
              </tr>
            ))}
            {filteredModems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                  Tidak ada modem yang cocok dengan filter pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
