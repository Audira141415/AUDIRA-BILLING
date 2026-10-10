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
    const customer = localStorage.getItem('customer');
    if (!customer) {
      router.push('/');
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Speed Test</h1>
          <p className="text-gray-600">Test kecepatan internet Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {!results && !testing && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                <Activity className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Mulai Speed Test</h2>
              <p className="text-gray-600 mb-8">
                Klik tombol di bawah untuk mengukur kecepatan download dan upload
              </p>
              <button
                onClick={runSpeedTest}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Mulai Test
              </button>
            </div>
          )}

          {testing && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6 animate-pulse">
                <Wifi className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Testing...</h2>
              <div className="max-w-md mx-auto mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-600">{progress}% Complete</p>
            </div>
          )}

          {results && !testing && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold">Test Selesai!</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Download className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Download Speed</span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{results.download}</div>
                  <div className="text-sm opacity-90">Mbps</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Upload className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Upload Speed</span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{results.upload}</div>
                  <div className="text-sm opacity-90">Mbps</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Ping</div>
                  <div className="text-2xl font-semibold">{results.ping} ms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Jitter</div>
                  <div className="text-2xl font-semibold">{results.jitter} ms</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">Server</div>
                <div className="font-medium">{results.server}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(results.timestamp).toLocaleString('id-ID')}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={runSpeedTest}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Ulang
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Tips untuk Speed Test Akurat:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Tutup aplikasi lain yang menggunakan internet</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Gunakan koneksi kabel (bukan WiFi) untuk hasil terbaik</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Pastikan tidak ada download/upload yang sedang berjalan</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Lakukan test beberapa kali untuk hasil rata-rata</span>
            </li>
          </ul>
        </div>
      </div>
    </CustomerLayout>
  );
}
