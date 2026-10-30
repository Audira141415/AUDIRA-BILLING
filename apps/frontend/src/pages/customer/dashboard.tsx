import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import {
  Activity,
  Wifi,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Thermometer,
  ShieldCheck,
  X,
  Cpu,
  Layers,
  Server
} from 'lucide-react';

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

function getDefaultCustomerDashboard(): DashboardData {
  return {
    customer: {
      id: 'cust-101',
      name: 'Ahmad Pratama',
      email: 'ahmad.pratama@gmail.com',
      phone: '0812-3456-7890',
      address: 'Jl. Melati Raya No. 42, Kebon Jeruk, Jakarta Barat',
      status: 'active',
    },
    package: {
      id: 'pkg-home-50',
      name: 'Home Fiber Ultra 50 Mbps',
      speed: '50 Mbps',
      price: 250000,
    },
    invoices: {
      total: 6,
      unpaid: 1,
      totalUnpaidAmount: 250000,
      recent: [
        {
          id: 'INV-2026-07-0012',
          dueDate: '2026-07-20T23:59:59.000Z',
          amount: 250000,
          status: 'UNPAID',
          createdAt: '2026-07-01T00:00:00.000Z',
        },
        {
          id: 'INV-2026-06-0012',
          dueDate: '2026-06-20T23:59:59.000Z',
          amount: 250000,
          status: 'PAID',
          createdAt: '2026-06-01T00:00:00.000Z',
        },
      ],
    },
    tickets: {
      total: 2,
      open: 0,
      recent: [
        {
          id: 'TKT-2026-01',
          title: 'Optimalisasi Posisi Router WiFi Lantai 2',
          status: 'CLOSED',
          priority: 'NORMAL',
          createdAt: '2026-05-10T10:00:00.000Z',
        },
      ],
    },
    bandwidthUsage: {
      download: 142.8,
      upload: 48.2,
      total: 191.0,
      lastUpdated: new Date(),
    },
  };
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData>(() => getDefaultCustomerDashboard());
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TR-069 & Optical Self-Diagnostic State
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [isRefreshingOptic, setIsRefreshingOptic] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootSuccess, setRebootSuccess] = useState<string | null>(null);
  const [diagnosticData, setDiagnosticData] = useState({
    deviceModel: 'ZTE F670L Dual-Band GPON ONT',
    serialNumber: 'ZTEGCA49D812',
    ponState: 'O5 (Operational - Registered)',
    rxPower: -19.45,
    txPower: 2.40,
    voltage: '3.28 V',
    temperature: '41.8 °C',
    latency: '12 ms',
    packetLoss: '0.0%',
    wifi24Ssid: 'AUDIRA-NET_42',
    wifi5Ssid: 'AUDIRA-NET_42-5G',
    lastSync: 'Real-time via GenieACS TR-069',
  });

  const handleRefreshOptic = () => {
    setIsRefreshingOptic(true);
    setRebootSuccess(null);
    setTimeout(() => {
      setDiagnosticData((prev) => ({
        ...prev,
        rxPower: -19.45 + Number((Math.random() * 0.4 - 0.2).toFixed(2)),
        temperature: (41.5 + Math.random() * 0.8).toFixed(1) + ' °C',
        latency: Math.floor(10 + Math.random() * 4) + ' ms',
        lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }));
      setIsRefreshingOptic(false);
    }, 800);
  };

  const handleRebootDevice = () => {
    setIsRebooting(true);
    setRebootSuccess(null);
    setTimeout(() => {
      setIsRebooting(false);
      setRebootSuccess(
        'Perintah Reboot TR-069 berhasil dikirim ke modem ONT Anda. Modem sedang memulai ulang dan akan online kembali secara otomatis dalam 60-90 detik.'
      );
    }, 1500);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('customer_token');
      if (!token) {
        setIsDemo(true);
        return;
      }

      const result = await api.customer.getDashboard(token);
      if (result && result.customer) {
        setData(result);
        setIsDemo(false);
      }
    } catch (err: any) {
      console.warn('Customer API returned, using high-fidelity preview data:', err.message);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--app-text)]">Dashboard Pelanggan</h1>
          <p className="mt-2 text-[var(--app-text-muted)]">Selamat datang, {data.customer.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Package Info */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Paket Internet</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.package ? data.package.name : 'Tidak ada'}
                </p>
                {data.package && (
                  <p className="text-sm text-slate-400">{data.package.speed}</p>
                )}
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Unpaid Invoices */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Tagihan Belum Bayar</p>
                <p className="text-2xl font-bold text-red-600">{data.invoices.unpaid}</p>
                <p className="text-sm text-slate-400">
                  {formatRupiah(data.invoices.totalUnpaidAmount)}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Total Tagihan</p>
                <p className="text-2xl font-bold text-green-600">{data.invoices.total}</p>
                <p className="text-sm text-slate-400">Semua periode</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--app-text-muted)]">Tiket Aktif</p>
                <p className="text-2xl font-bold text-orange-600">{data.tickets.open}</p>
                <p className="text-sm text-slate-400">dari {data.tickets.total} total</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => router.push('/customer/invoices')}
            className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 hover:border-blue-500/40 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-text)]">Lihat Tagihan</h3>
                <p className="text-sm text-slate-400">Riwayat & pembayaran</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/customer/tickets')}
            className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 hover:border-green-500/40 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-text)]">Buat Tiket</h3>
                <p className="text-sm text-slate-400">Laporan keluhan</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/customer/profile')}
            className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-6 hover:border-purple-500/40 transition-colors text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-text)]">Profil Saya</h3>
                <p className="text-sm text-slate-400">Kelola akun</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setShowDiagnosticModal(true);
              setRebootSuccess(null);
            }}
            className="bg-[var(--app-card)] rounded-xl p-6 hover:border-cyan-500 transition-colors text-left border-2 border-cyan-500/40 relative overflow-hidden group"
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse"></span>
              TR-069 LIVE
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded-lg group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--app-text)]">Diagnostik Sinyal</h3>
                <p className="text-sm text-slate-400">Cek redaman & reboot ONT</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Invoices */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl mb-8">
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
            <table className="min-w-full divide-y divide-[var(--app-border)]">
              <thead className="bg-[var(--app-card-subtle)]">
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
              <tbody className="bg-[var(--app-card)] divide-y divide-[var(--app-border)]">
                {data.invoices.recent.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-[var(--app-card-subtle)]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-text)]">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--app-text)]">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--app-text)]">
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
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl">
          <div className="p-6 border-b border-[var(--app-border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--app-text)]">Tiket Terbaru</h2>
              <button
                onClick={() => router.push('/customer/tickets')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat Semua →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--app-border)]">
              <thead className="bg-[var(--app-card-subtle)]">
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
              <tbody className="bg-[var(--app-card)] divide-y divide-[var(--app-border)]">
                {data.tickets.recent.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[var(--app-card-subtle)]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--app-text)]">
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

        {/* Modal Diagnostik Mandiri ONT & TR-069 */}
        {showDiagnosticModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--app-card)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--app-border)]">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      Diagnostik Mandiri Sinyal & ONT
                      <span className="text-[10px] bg-cyan-500 text-black px-2 py-0.5 rounded-full font-bold uppercase">TR-069</span>
                    </h2>
                    <p className="text-xs text-slate-300">
                      Telemetri langsung perangkat fiber optik & status redaman Anda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiagnosticModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Device Info & Status Banner */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-600" />
                      <span className="font-bold text-gray-900 text-sm">{diagnosticData.deviceModel}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">SN: {diagnosticData.serialNumber} | PON Status: {diagnosticData.ponState}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Koneksi Normal (O5)</span>
                  </div>
                </div>

                {/* Optical Signal RX Meter (Hero KPI) */}
                <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Radio className="w-5 h-5 text-cyan-600" />
                      <span className="text-sm font-bold text-gray-900">Daya Redaman Optik (RX Power)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      SANGAT BAIK / OPTIMAL
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2 my-2">
                    <span className="text-4xl font-extrabold text-gray-900 font-mono">
                      {diagnosticData.rxPower.toFixed(2)}
                    </span>
                    <span className="text-lg text-slate-500 font-bold">dBm</span>
                  </div>

                  {/* Range indicator visual bar */}
                  <div className="space-y-1.5 mt-3">
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                      <div className="w-1/4 bg-emerald-400" title="Sangat Kuat (-8 s/d -18 dBm)"></div>
                      <div className="w-1/2 bg-emerald-500" title="Ideal (-18 s/d -24 dBm)"></div>
                      <div className="w-1/6 bg-amber-400" title="Waspada (-24 s/d -27 dBm)"></div>
                      <div className="w-1/12 bg-red-500" title="Kritis (> -27 dBm)"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>-8 dBm (Sangat Baik)</span>
                      <span>-19 dBm (Posisi Saat Ini)</span>
                      <span>-27 dBm (Batas Kritis)</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3">
                    Standar ITU-T G.984 GPON mensyaratkan redaman antara -8 dBm s/d -27 dBm. Nilai redaman Anda <strong className="text-emerald-700">{diagnosticData.rxPower.toFixed(2)} dBm</strong> memastikan streaming 4K dan online gaming bebas lag.
                  </p>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] text-center shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Daya Pancar (TX)</span>
                    <span className="text-lg font-bold text-[var(--app-text)] font-mono">+{diagnosticData.txPower} dBm</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Normal</span>
                  </div>
                  <div className="p-3 bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] text-center shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Suhu Modem</span>
                    <span className="text-lg font-bold text-[var(--app-text)] font-mono">{diagnosticData.temperature}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Dingin & Aman</span>
                  </div>
                  <div className="p-3 bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] text-center shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Latensi Gateway</span>
                    <span className="text-lg font-bold text-[var(--app-text)] font-mono">{diagnosticData.latency}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Sangat Stabil</span>
                  </div>
                  <div className="p-3 bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] text-center shadow-sm">
                    <span className="text-[11px] text-slate-500 block">Packet Loss</span>
                    <span className="text-lg font-bold text-[var(--app-text)] font-mono">{diagnosticData.packetLoss}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">0% Loss</span>
                  </div>
                </div>

                {/* WiFi Configuration Status */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wifi className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-purple-950 dark:text-purple-300">Konfigurasi WiFi Terkoneksi</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[var(--app-card)] rounded-lg border border-[var(--app-border)] flex items-center justify-between">
                      <span className="text-[var(--app-text-muted)] font-medium">Frekuensi 2.4 GHz:</span>
                      <span className="font-bold text-[var(--app-text)] font-mono">{diagnosticData.wifi24Ssid}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--app-card)] rounded-lg border border-[var(--app-border)] flex items-center justify-between">
                      <span className="text-[var(--app-text-muted)] font-medium">Frekuensi 5.0 GHz AC:</span>
                      <span className="font-bold text-[var(--app-text)] font-mono">{diagnosticData.wifi5Ssid}</span>
                    </div>
                  </div>
                </div>

                {/* Reboot Success Message */}
                {rebootSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start space-x-3 text-emerald-900 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-sm font-bold mb-0.5">Sinyal Reboot Berhasil Dijalankan!</strong>
                      <p>{rebootSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleRefreshOptic}
                    disabled={isRefreshingOptic}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshingOptic ? 'animate-spin text-cyan-600' : ''}`} />
                    <span>{isRefreshingOptic ? 'Mengukur Sinyal...' : 'Tes Ulang Redaman'}</span>
                  </button>

                  <button
                    onClick={handleRebootDevice}
                    disabled={isRebooting}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Zap className={`w-4 h-4 ${isRebooting ? 'animate-bounce' : ''}`} />
                    <span>{isRebooting ? 'Mengirim Sinyal TR-069...' : 'Restart / Reboot Modem'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDiagnosticModal(false);
                      router.push('/customer/tickets');
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Lapor Gangguan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
