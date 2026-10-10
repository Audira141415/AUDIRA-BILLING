import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { TrendingUp, TrendingDown, Calendar, Package } from 'lucide-react';

export default function Usage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchUsageData(parsed.id, period);
  }, [router, period]);

  const fetchUsageData = async (customerId: string, period: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mock data (replace with actual API call to RADIUS accounting)
      const mockData = {
        currentPeriod: {
          download: (Math.random() * 100 + 50).toFixed(2), // GB
          upload: (Math.random() * 50 + 20).toFixed(2), // GB
          total: 0,
        },
        quota: {
          limit: 500, // GB
          used: 0,
          remaining: 0,
        },
        dailyUsage: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
          }),
          download: Math.random() * 20 + 5,
          upload: Math.random() * 10 + 2,
        })).reverse(),
        peakHours: [
          { hour: '00:00-03:00', usage: Math.random() * 5 },
          { hour: '03:00-06:00', usage: Math.random() * 3 },
          { hour: '06:00-09:00', usage: Math.random() * 15 },
          { hour: '09:00-12:00', usage: Math.random() * 20 },
          { hour: '12:00-15:00', usage: Math.random() * 18 },
          { hour: '15:00-18:00', usage: Math.random() * 25 },
          { hour: '18:00-21:00', usage: Math.random() * 30 },
          { hour: '21:00-24:00', usage: Math.random() * 28 },
        ],
      };

      mockData.currentPeriod.total = parseFloat(mockData.currentPeriod.download) + parseFloat(mockData.currentPeriod.upload);
      mockData.quota.used = mockData.currentPeriod.total;
      mockData.quota.remaining = mockData.quota.limit - mockData.quota.used;

      setUsageData(mockData);
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  const usagePercentage = (usageData.quota.used / usageData.quota.limit) * 100;

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Penggunaan Internet</h1>
          <p className="text-gray-600">Monitor penggunaan bandwidth Anda</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p === 'week' ? 'Minggu Ini' : p === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
            </button>
          ))}
        </div>

        {/* Current Usage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingDown className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Download</span>
            </div>
            <div className="text-3xl font-bold mb-1">{usageData.currentPeriod.download} GB</div>
            <div className="text-sm opacity-90">Total download</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Upload</span>
            </div>
            <div className="text-3xl font-bold mb-1">{usageData.currentPeriod.upload} GB</div>
            <div className="text-sm opacity-90">Total upload</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold mb-1">{usageData.currentPeriod.total.toFixed(2)} GB</div>
            <div className="text-sm opacity-90">Penggunaan total</div>
          </div>
        </div>

        {/* Quota Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Kuota Bulanan</h2>
            <span className="text-sm text-gray-600">
              {usageData.quota.remaining.toFixed(0)} GB tersisa
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className={`h-4 rounded-full transition-all ${
                usagePercentage > 90
                  ? 'bg-red-500'
                  : usagePercentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{usageData.quota.used.toFixed(0)} GB digunakan</span>
            <span>{usageData.quota.limit} GB limit</span>
          </div>
          {usagePercentage > 90 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ⚠️ Kuota Anda hampir habis! Pertimbangkan untuk upgrade paket.
              </p>
            </div>
          )}
        </div>

        {/* Daily Usage Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Penggunaan Harian</h2>
          <div className="space-y-4">
            {usageData.dailyUsage.map((day: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{day.date}</span>
                  <span className="text-sm text-gray-600">
                    {(day.download + day.upload).toFixed(1)} GB
                  </span>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-blue-500 rounded"
                    style={{ width: `${(day.download / 30) * 100}%` }}
                    title={`Download: ${day.download.toFixed(1)} GB`}
                  />
                  <div
                    className="bg-green-500 rounded"
                    style={{ width: `${(day.upload / 30) * 100}%` }}
                    title={`Upload: ${day.upload.toFixed(1)} GB`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Upload</span>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Waktu Penggunaan Tertinggi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageData.peakHours.map((peak: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">{peak.hour}</div>
                <div className="text-lg font-semibold">{peak.usage.toFixed(1)} GB</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(peak.usage / 30) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
