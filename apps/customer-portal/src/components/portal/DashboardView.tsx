import { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomerLayout from '@/components/CustomerLayout';
import { API_BASE_URL } from '@/config/api';
import { 
  Wifi, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Hash,
  Download,
  Upload
} from 'lucide-react';

export default function DashboardView() {
  const [customer, setCustomer] = useState<any>(null);
  const [stats, setStats] = useState({
    currentInvoice: 0,
    totalPaid: 0,
    activeTickets: 0,
    bandwidth: '50 Mbps',
    downloadSpeed: 50,
    uploadSpeed: 50,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('customer');
    if (raw) {
      setCustomer(JSON.parse(raw));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/customer/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentInvoices(data.invoices?.recent || []);
        
        const speedVal = data.package?.speed ? parseInt(data.package.speed) : 50;
        setStats({
          currentInvoice: data.invoices?.totalUnpaidAmount || 0,
          totalPaid: 0,
          activeTickets: data.tickets?.open || 0,
          bandwidth: `${speedVal} Mbps Simetris`,
          downloadSpeed: speedVal,
          uploadSpeed: speedVal,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const inetIdentifier = customer?.internetNumber || customer?.id || 'NET-100234';
  const cPrefix = `/c/${inetIdentifier}`;

  const statCards = [
    {
      title: 'Tagihan Berjalan',
      value: `Rp ${stats.currentInvoice.toLocaleString('id-ID')}`,
      icon: FileText,
      color: 'bg-cyan-500 text-black',
      status: stats.currentInvoice > 0 ? 'Belum Dibayar' : 'Semua Lunas',
      isAlert: stats.currentInvoice > 0,
    },
    {
      title: 'Paket Berlangganan',
      value: stats.bandwidth,
      icon: Activity,
      color: 'bg-emerald-500 text-black',
      status: 'Fiber Optic Simetris 1:1',
      isAlert: false,
    },
    {
      title: 'Tiket Pengaduan',
      value: `${stats.activeTickets} Tiket`,
      icon: AlertCircle,
      color: 'bg-amber-400 text-black',
      status: stats.activeTickets > 0 ? 'Sedang Ditangani NOC' : 'Tidak Ada Kendala',
      isAlert: stats.activeTickets > 0,
    },
    {
      title: 'Status Sambungan',
      value: 'Online',
      icon: Wifi,
      color: 'bg-sky-400 text-black',
      status: 'Latensi Rendah (1-2 ms)',
      isAlert: false,
    },
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64 font-mono text-xs text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat Data Dashboard Pelanggan...</span>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Personalized Customer Welcome Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Layanan Internet Fiber Aktif
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Halo, {customer?.name || 'Pelanggan Setia'}!
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Kelola langganan, bayar tagihan, pantau traffic bandwidth, dan buat tiket gangguan secara terpadu.
            </p>
          </div>

          <div className="flex flex-col sm:items-end p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono max-w-full overflow-hidden">
            <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">
              ID Pelanggan / No. Internet
            </span>
            <div className="flex items-center gap-2 mt-1 max-w-full">
              <span 
                className="text-base sm:text-lg font-black text-cyan-600 dark:text-cyan-400 tracking-wider truncate"
                title={inetIdentifier}
              >
                {inetIdentifier.length > 20 
                  ? `${inetIdentifier.substring(0, 10)}...${inetIdentifier.substring(inetIdentifier.length - 4)}` 
                  : inetIdentifier}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-400/30 shrink-0">
                RESMI
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                    {stat.title}
                  </span>
                  <div className={`w-8 h-8 rounded-lg border border-black flex items-center justify-center font-bold ${stat.color}`}>
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className={`text-[11px] font-mono mt-1 ${stat.isAlert ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-gray-400'}`}>
                    {stat.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`${cPrefix}/invoices`}
            className="p-5 rounded-xl border-2 border-black dark:border-gray-800 bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100 dark:hover:bg-cyan-950/40 shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start justify-between"
          >
            <div>
              <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mb-2 stroke-[2.5]" />
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white">
                Bayar & Cek Tagihan
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                Unduh PDF invoice & bayar instan via QRIS.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href={`${cPrefix}/tickets`}
            className="p-5 rounded-xl border-2 border-black dark:border-gray-800 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start justify-between"
          >
            <div>
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2 stroke-[2.5]" />
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white">
                Tiket Pengaduan NOC
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                Lapor kendala koneksi internet ke teknisi 24/7.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href={`${cPrefix}/upgrade`}
            className="p-5 rounded-xl border-2 border-black dark:border-gray-800 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-start justify-between"
          >
            <div>
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 stroke-[2.5]" />
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 dark:text-white">
                Upgrade Bandwidth
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                Tingkatkan kecepatan fiber ke paket ultra gamer/streamer.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>
        </div>

        {/* Recent Invoices Table */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Tagihan Terbaru
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-gray-400">
                Riwayat invoice yang diterbitkan untuk akun ini
              </p>
            </div>
            <Link
              href={`${cPrefix}/invoices`}
              className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 dark:bg-[#070b14] border-b border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Nomor Invoice</th>
                  <th className="px-5 py-3">Periode</th>
                  <th className="px-5 py-3">Jatuh Tempo</th>
                  <th className="px-5 py-3">Total Tagihan</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-gray-400">
                        {inv.month || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-gray-400">
                        {new Date(inv.dueDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-400/40'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-400/40'
                          }`}
                        >
                          {inv.status === 'PAID' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {inv.status === 'PAID' ? 'Lunas' : 'Belum Dibayar'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-gray-400 font-mono text-xs">
                      Belum ada tagihan tertunggak untuk nomor internet ini. Seluruh layanan aktif normal.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
