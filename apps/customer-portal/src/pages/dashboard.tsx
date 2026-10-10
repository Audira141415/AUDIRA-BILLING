import { useEffect, useState } from 'react';
import CustomerLayout from '@/components/CustomerLayout';
import { 
  Wifi, 
  DollarSign, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    currentInvoice: 0,
    totalPaid: 0,
    activeTickets: 0,
    bandwidth: '100 Mbps',
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const customer = JSON.parse(localStorage.getItem('customer') || '{}');

      // Fetch invoices
      const response = await fetch(`http://localhost:4000/api/customer/${customer.id}/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentInvoices(data.slice(0, 5));
        
        // Calculate stats
        const currentInvoice = data.find((inv: any) => inv.status === 'PENDING');
        const paidInvoices = data.filter((inv: any) => inv.status === 'PAID');
        
        setStats({
          currentInvoice: currentInvoice?.amount || 0,
          totalPaid: paidInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0),
          activeTickets: 0, // TODO: fetch from tickets API
          bandwidth: '100 Mbps',
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tagihan Bulan Ini',
      value: `Rp ${stats.currentInvoice.toLocaleString('id-ID')}`,
      icon: FileText,
      color: 'bg-blue-500',
      change: stats.currentInvoice > 0 ? 'Belum Dibayar' : 'Lunas',
    },
    {
      title: 'Total Pembayaran',
      value: `Rp ${stats.totalPaid.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: 'Tahun ini',
    },
    {
      title: 'Bandwidth',
      value: stats.bandwidth,
      icon: Activity,
      color: 'bg-purple-500',
      change: 'Aktif',
    },
    {
      title: 'Tiket Aktif',
      value: stats.activeTickets,
      icon: AlertCircle,
      color: 'bg-orange-500',
      change: 'Support',
    },
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Selamat datang di portal pelanggan AudiraNET</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Tagihan Terbaru</h2>
              <a href="/invoices" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua →
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {invoice.month || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rp {invoice.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.status === 'PAID' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Lunas
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Belum ada tagihan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/invoices"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <FileText className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lihat Tagihan</h3>
            <p className="text-sm text-gray-600">Cek semua tagihan dan riwayat pembayaran Anda</p>
          </a>

          <a
            href="/tickets"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <AlertCircle className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Buat Tiket</h3>
            <p className="text-sm text-gray-600">Laporkan masalah atau minta bantuan support</p>
          </a>

          <a
            href="/settings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade Paket</h3>
            <p className="text-sm text-gray-600">Tingkatkan kecepatan internet Anda</p>
          </a>
        </div>
      </div>
    </CustomerLayout>
  );
}
