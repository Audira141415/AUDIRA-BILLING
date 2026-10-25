import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { TrendingUp, TrendingDown, Calendar, Package, Download, Upload, AlertTriangle, Activity } from 'lucide-react';

export default function Usage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchUsageData(parsed.id, period);

    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/usage`);
    }
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
        <div className="flex items-center justify-center h-64 font-mono text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat Data Pemakaian Bandwidth...</span>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const usagePercentage = (usageData.quota.used / usageData.quota.limit) * 100;

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                RADIUS Accounting & Bandwidth Meter
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Monitoring Kuota & Traffic
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Pantau akumulasi volume download/upload, distribusi jam sibuk, dan utilisasi kuota akun fiber optik Anda.
            </p>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
            {[
              { id: 'week', label: 'Minggu Ini' },
              { id: 'month', label: 'Bulan Ini' },
              { id: 'year', label: 'Tahun Ini' },
            ].map((p) => {
              const isActive = period === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    isActive
                      ? 'bg-cyan-400 text-black border-black shadow-[2px_2px_0px_#000]'
                      : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Usage Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl border-2 border-black dark:border-gray-800 bg-white dark:bg-[#0c1322] shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-3 text-cyan-700 dark:text-cyan-400">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Volume Download</span>
              <div className="w-8 h-8 rounded-lg border border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
                <Download className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-950 dark:text-white">
              {usageData.currentPeriod.download} <span className="text-sm font-bold text-slate-500">GB</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1 block">
              Total trafik unduhan periode ini
            </span>
          </div>

          <div className="p-5 rounded-xl border-2 border-black dark:border-gray-800 bg-white dark:bg-[#0c1322] shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-3 text-emerald-700 dark:text-emerald-400">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Volume Upload</span>
              <div className="w-8 h-8 rounded-lg border border-black dark:border-gray-700 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Upload className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-950 dark:text-white">
              {usageData.currentPeriod.upload} <span className="text-sm font-bold text-slate-500">GB</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1 block">
              Total trafik unggahan periode ini
            </span>
          </div>

          <div className="p-5 rounded-xl border-2 border-black dark:border-gray-800 bg-white dark:bg-[#0c1322] shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-3 text-purple-700 dark:text-purple-400">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Akumulasi Total</span>
              <div className="w-8 h-8 rounded-lg border border-black dark:border-gray-700 bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Activity className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-950 dark:text-white">
              {usageData.currentPeriod.total.toFixed(2)} <span className="text-sm font-bold text-slate-500">GB</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1 block">
              Total penggunaan bandwidth gabungan
            </span>
          </div>
        </div>

        {/* Quota Progress Panel */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black uppercase text-slate-950 dark:text-white">
              Status Kuota Bandwidth Bulanan
            </h2>
            <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {usageData.quota.remaining.toFixed(0)} GB Tersisa
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-4 p-0.5 border border-black dark:border-gray-700 mb-2.5">
            <div
              className={`h-full rounded transition-all duration-300 ${
                usagePercentage > 90
                  ? 'bg-rose-500'
                  : usagePercentage > 70
                  ? 'bg-amber-400'
                  : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-slate-500 dark:text-gray-400">
            <span>{usageData.quota.used.toFixed(0)} GB Terpakai ({usagePercentage.toFixed(1)}%)</span>
            <span>Limit Akun: {usageData.quota.limit} GB</span>
          </div>
          {usagePercentage > 90 && (
            <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-500/50 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-300 font-mono">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 stroke-[2.5]" />
              <span>Peringatan: Pemakaian Anda telah melampaui 90% kuota. Pertimbangkan upgrade ke paket ultra tanpa batas.</span>
            </div>
          )}
        </div>

        {/* Daily Usage Chart */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h2 className="text-base font-black uppercase text-slate-950 dark:text-white mb-5">
            Distribusi Trafik Harian
          </h2>
          <div className="space-y-4">
            {usageData.dailyUsage.map((day: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{day.date}</span>
                  <span className="text-slate-500 dark:text-gray-400">
                    {(day.download + day.upload).toFixed(1)} GB Total
                  </span>
                </div>
                <div className="flex gap-1 h-6 bg-slate-100 dark:bg-slate-900 p-0.5 rounded border border-slate-300 dark:border-gray-800">
                  <div
                    className="bg-cyan-500 rounded"
                    style={{ width: `${(day.download / 30) * 100}%` }}
                    title={`Download: ${day.download.toFixed(1)} GB`}
                  />
                  <div
                    className="bg-emerald-500 rounded"
                    style={{ width: `${(day.upload / 30) * 100}%` }}
                    title={`Upload: ${day.upload.toFixed(1)} GB`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-gray-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded"></div>
              <span className="text-slate-600 dark:text-gray-400">Trafik Download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-slate-600 dark:text-gray-400">Trafik Upload</span>
            </div>
          </div>
        </div>

        {/* Peak Hours Grid */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h2 className="text-base font-black uppercase text-slate-950 dark:text-white mb-5">
            Analisis Jam Sibuk (Peak Hours)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {usageData.peakHours.map((peak: any, index: number) => (
              <div key={index} className="bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl p-3.5 font-mono text-xs">
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase mb-1">
                  {peak.hour}
                </div>
                <div className="text-base font-black text-slate-950 dark:text-white">
                  {peak.usage.toFixed(1)} GB
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full"
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
