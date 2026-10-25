import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { Activity, Wifi, Download, Upload } from 'lucide-react';

export default function SpeedTest() {
  const router = useRouter();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem('customer');
    if (!raw) {
      router.push('/login');
      return;
    }
    const customer = JSON.parse(raw);
    const inet = customer.internetNumber || customer.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/speedtest`);
    }
  }, [router]);

  const runSpeedTest = async () => {
    setTesting(true);
    setProgress(0);
    setResults(null);

    try {
      // Simulate speed test progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Simulate API call to speed test server
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Mock results (replace with actual LibreSpeed or Ookla API)
      const mockResults = {
        download: (Math.random() * 50 + 50).toFixed(2), // 50-100 Mbps
        upload: (Math.random() * 30 + 20).toFixed(2), // 20-50 Mbps
        ping: (Math.random() * 20 + 10).toFixed(0), // 10-30 ms
        jitter: (Math.random() * 5 + 1).toFixed(1), // 1-6 ms
        server: 'Jakarta - Indonesia',
        timestamp: new Date().toISOString(),
      };

      setResults(mockResults);
      setTesting(false);
      clearInterval(interval);
    } catch (error) {
      console.error('Speed test failed:', error);
      setTesting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Fiber Latency & Bandwidth Telemetry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Speed Test Diagnostik
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Ukur throughput bandwidth download/upload real-time, latensi ping ke gateway NOC, dan kestabilan jitter koneksi Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
            <span className="text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">
              Server:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              NOC JKT-IX (Direct Fiber)
            </span>
          </div>
        </div>

        {/* Speed Test Panel */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000]">
          {!results && !testing && (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-2xl border-2 border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center mx-auto mb-5 shadow-[3px_3px_0px_#000]">
                <Activity className="h-10 w-10 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white mb-2">
                Mulai Pengujian Kecepatan
              </h2>
              <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Sistem akan memancarkan paket uji multithread untuk mengukur kecepatan fiber optik murni ke router Mikrotik dan upstream gateway.
              </p>
              <button
                onClick={runSpeedTest}
                className="min-h-[48px] px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                Jalankan Test Sekarang
              </button>
            </div>
          )}

          {testing && (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-2xl border-2 border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center mx-auto mb-5 shadow-[3px_3px_0px_#000] animate-pulse">
                <Wifi className="h-10 w-10 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white mb-2">
                Mengukur Throughput Fiber...
              </h2>
              <div className="max-w-md mx-auto mb-3">
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg h-4 p-0.5 border border-black dark:border-gray-700">
                  <div
                    className="bg-cyan-400 h-full rounded transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {progress}% Proses Diagnostik
              </p>
            </div>
          )}

          {results && !testing && (
            <div>
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-500/40 mb-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  DIAGNOSTIK SELESAI
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-950 dark:text-white">
                  Hasil Pengujian Sambungan
                </h2>
              </div>

              {/* Speeds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-5 rounded-xl border-2 border-black dark:border-gray-700 bg-cyan-50 dark:bg-cyan-950/20 shadow-[3px_3px_0px_#000]">
                  <div className="flex items-center gap-2 mb-2 text-cyan-700 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Download className="h-4 w-4 stroke-[2.5]" />
                    <span>Download Speed</span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white">
                    {results.download}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-gray-400">
                    Mbps (Simetris Fiber)
                  </span>
                </div>

                <div className="p-5 rounded-xl border-2 border-black dark:border-gray-700 bg-emerald-50 dark:bg-emerald-950/20 shadow-[3px_3px_0px_#000]">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Upload className="h-4 w-4 stroke-[2.5]" />
                    <span>Upload Speed</span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white">
                    {results.upload}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-gray-400">
                    Mbps (Simetris Fiber)
                  </span>
                </div>
              </div>

              {/* Ping & Jitter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 font-mono text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl">
                  <div className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-0.5">
                    Latensi Ping
                  </div>
                  <div className="text-xl font-black text-slate-950 dark:text-white">
                    {results.ping} ms
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl">
                  <div className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-0.5">
                    Stabilitas Jitter
                  </div>
                  <div className="text-xl font-black text-slate-950 dark:text-white">
                    {results.jitter} ms
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl">
                  <div className="text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold mb-0.5">
                    Waktu Pengujian
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {new Date(results.timestamp).toLocaleTimeString('id-ID')} WIB
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={runSpeedTest}
                  className="min-h-[44px] px-6 py-2.5 rounded-lg border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Uji Ulang Sambungan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Technical Tips */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white mb-3">
            Tips Akurasi Pengujian Kecepatan:
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span>Gunakan kabel LAN UTP Cat6 langsung ke router untuk menghindari interferensi sinyal radio Wi-Fi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span>Hentikan sementara aplikasi unduhan background (Torrent, update OS, cloud drive sync) selama tes berlangsung.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span>Jika hasil latensi lebih tinggi dari 20ms, Anda dapat membuat tiket diagnostik NOC langsung melalui portal.</span>
            </li>
          </ul>
        </div>
      </div>
    </CustomerLayout>
  );
}
