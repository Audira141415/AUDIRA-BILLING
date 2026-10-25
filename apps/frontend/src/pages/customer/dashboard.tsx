import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface DashboardData {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
  };
  package: {
    id: string;
    name: string;
    speed: string;
    price: number;
  } | null;
  invoices: {
    total: number;
    unpaid: number;
    totalUnpaidAmount: number;
    recent: Array<{
      id: string;
      dueDate: string;
      amount: number;
      status: string;
      createdAt: string;
    }>;
  };
  tickets: {
    total: number;
    open: number;
    recent: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      createdAt: string;
    }>;
  };
  bandwidthUsage: {
    download: number;
    upload: number;
    total: number;
    lastUpdated: Date;
  };
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('customer_token');
      if (!token) {
        router.push('/customer/login');
        return;
      }

      const result = await api.customer.getDashboard(token);
      setData(result);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        localStorage.removeItem('customer_token');
        router.push('/customer/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pelanggan</h1>
          <p className="mt-2 text-gray-600">Selamat datang, {data.customer.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Package Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paket Internet</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.package ? data.package.name : 'Tidak ada'}
                </p>
                {data.package && (
                  <p className="text-sm text-slate-400">{data.package.speed}</p>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Unpaid Invoices */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tagihan Belum Bayar</p>
                <p className="text-2xl font-bold text-red-600">{data.invoices.unpaid}</p>
                <p className="text-sm text-slate-400">
                  {formatRupiah(data.invoices.totalUnpaidAmount)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tagihan</p>
                <p className="text-2xl font-bold text-green-600">{data.invoices.total}</p>
                <p className="text-sm text-slate-400">Semua periode</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiket Aktif</p>
                <p className="text-2xl font-bold text-orange-600">{data.tickets.open}</p>
                <p className="text-sm text-slate-400">dari {data.tickets.total} total</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/customer/invoices')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lihat Tagihan</h3>
                <p className="text-sm text-slate-400">Riwayat & pembayaran</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/customer/tickets')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Buat Tiket</h3>
                <p className="text-sm text-slate-400">Laporan keluhan</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/customer/profile')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profil Saya</h3>
                <p className="text-sm text-slate-400">Kelola akun</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Tagihan Terbaru</h2>
              <button
                onClick={() => router.push('/customer/invoices')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat Semua →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.invoices.recent.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatRupiah(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'unpaid'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.status === 'paid' ? 'Lunas' : invoice.status === 'unpaid' ? 'Belum Bayar' : invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.invoices.recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-400">
                      Tidak ada tagihan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Tiket Terbaru</h2>
              <button
                onClick={() => router.push('/customer/tickets')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat Semua →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.tickets.recent.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.priority === 'high' ? 'Tinggi' : ticket.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === 'open'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.status === 'open' ? 'Buka' : ticket.status === 'in_progress' ? 'Proses' : 'Selesai'}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.tickets.recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-400">
                      Tidak ada tiket
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
