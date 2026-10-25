import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { Check, X, TrendingUp, Zap, Shield, Wifi } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  speed: string;
  price: number;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
}

export default function UpgradePackage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchPackages(parsed);

    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/upgrade`);
    }
  }, [router]);

  const fetchPackages = async (customerData: any) => {
    setLoading(true);
    try {
      // Mock data (replace with actual API call)
      const mockPackages: Package[] = [
        {
          id: '1',
          name: 'Home 10 Mbps',
          speed: '10 Mbps',
          price: 250000,
          features: ['10 Mbps Download', '5 Mbps Upload', 'Unlimited Quota', '24/7 Support'],
        },
        {
          id: '2',
          name: 'Home 20 Mbps',
          speed: '20 Mbps',
          price: 350000,
          features: ['20 Mbps Download', '10 Mbps Upload', 'Unlimited Quota', '24/7 Support', 'Gratis Instalasi'],
          popular: true,
        },
        {
          id: '3',
          name: 'Home 50 Mbps',
          speed: '50 Mbps',
          price: 500000,
          features: ['50 Mbps Download', '25 Mbps Upload', 'Unlimited Quota', '24/7 Support', 'Gratis Instalasi', 'WiFi Router Premium'],
          recommended: true,
        },
        {
          id: '4',
          name: 'Business 100 Mbps',
          speed: '100 Mbps',
          price: 1000000,
          features: ['100 Mbps Download', '50 Mbps Upload', 'Unlimited Quota', 'Priority Support', 'Static IP', 'SLA 99.9%', 'WiFi Router Enterprise'],
        },
      ];

      // Assume customer currently has "Home 10 Mbps"
      setCurrentPackage(mockPackages[0]);
      setPackages(mockPackages);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg: Package) => {
    if (pkg.id === currentPackage?.id) return;
    setSelectedPackage(pkg);
    setShowConfirmation(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPackage) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Mock API call (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      alert(`Berhasil! Paket Anda akan diupgrade ke ${selectedPackage.name} pada periode billing berikutnya.`);
      setShowConfirmation(false);
      setCurrentPackage(selectedPackage);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Failed to upgrade package:', error);
      alert('Gagal upgrade paket. Silakan coba lagi.');
    } finally {
      setProcessing(false);
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

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Fiber Speed Accelerator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Upgrade Paket Bandwidth
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Tingkatkan kapasitas throughput internet Anda untuk performa ultra streaming 4K, video conference HD, dan low-latency cloud gaming.
            </p>
          </div>

          {currentPackage && (
            <div className="flex flex-col sm:items-end p-3.5 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
              <span className="text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold text-[10px]">
                Paket Aktif Saat Ini
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
                  {currentPackage.name}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  ({currentPackage.speed})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Available Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg) => {
            const isCurrent = pkg.id === currentPackage?.id;
            const isDowngrade = currentPackage && parseInt(pkg.speed) < parseInt(currentPackage.speed);

            return (
              <div
                key={pkg.id}
                className={`relative bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'ring-2 ring-cyan-500 bg-cyan-50/20 dark:bg-cyan-950/20'
                    : 'hover:-translate-x-0.5 hover:-translate-y-0.5'
                } ${isDowngrade ? 'opacity-60' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 right-4 bg-amber-400 text-black border-2 border-black text-[10px] font-mono font-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_#000]">
                    POPULER
                  </div>
                )}
                {pkg.recommended && (
                  <div className="absolute -top-3 right-4 bg-emerald-400 text-black border-2 border-black text-[10px] font-mono font-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_#000]">
                    REKOMENDASI
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-4 bg-cyan-400 text-black border-2 border-black text-[10px] font-mono font-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_#000]">
                    PAKET AKTIF
                  </div>
                )}

                <div>
                  <div className="text-center pt-2 pb-5 border-b border-slate-200 dark:border-gray-800 mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl border-2 border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
                      <Wifi className="h-6 w-6 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
                    </div>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white">
                      {pkg.name}
                    </h3>
                    <div className="text-3xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
                      {pkg.speed}
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-500 dark:text-gray-400 mt-1">
                      Rp {pkg.price.toLocaleString('id-ID')}
                      <span className="text-[10px] font-normal text-slate-400">/bulan</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPackage(pkg)}
                  disabled={isCurrent || !!isDowngrade}
                  className={`w-full min-h-[44px] py-2.5 rounded-lg border-2 border-black font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                    isCurrent
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-gray-400 cursor-not-allowed border-slate-400 dark:border-gray-700'
                      : isDowngrade
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-slate-300 dark:border-gray-700'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black'
                  }`}
                >
                  {isCurrent ? 'Sedang Digunakan' : isDowngrade ? 'Tidak Tersedia' : 'Pilih Upgrade Ini'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000]">
          <h2 className="text-lg sm:text-xl font-black uppercase text-slate-950 dark:text-white mb-6 text-center tracking-tight">
            Keunggulan Layanan Fiber Optik AUDIRA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl border border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
                <Zap className="h-6 w-6 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-sm text-slate-950 dark:text-white mb-1">Kecepatan Simetris 1:1</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Kecepatan upload sama tinggi dengan download, ideal untuk streaming konten kreator dan gaming kompetitif.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl border border-black dark:border-gray-700 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-sm text-slate-950 dark:text-white mb-1">Koneksi Tanpa FUP Kuota</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Akses internet murni unlimited 24 jam sehari tanpa pengurangan kecepatan batas wajar pemakaian.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl border border-black dark:border-gray-700 bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-sm text-slate-950 dark:text-white mb-1">Dukungan NOC 24/7 Priority</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Monitoring proaktif oleh tim Network Operations Center AUDIRA dengan jaminan respon cepat.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedPackage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-[6px_6px_0px_#000]">
              <h3 className="text-lg font-black uppercase text-slate-950 dark:text-white mb-3">
                Konfirmasi Upgrade Paket
              </h3>

              <div className="p-4 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl mb-4 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Paket Saat Ini:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Paket Tujuan:</span>
                  <span className="font-black text-cyan-600 dark:text-cyan-400">{selectedPackage.name}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-gray-800 pt-2 flex justify-between items-baseline">
                  <span className="text-slate-700 dark:text-gray-300 font-bold uppercase text-[11px]">
                    Tarif Bulanan Baru:
                  </span>
                  <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
                    Rp {selectedPackage.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-300 dark:border-cyan-800/50 rounded-xl mb-5 text-xs text-slate-700 dark:text-cyan-200">
                Permintaan upgrade akan disinkronkan langsung ke Mikrotik & RADIUS server pada tagihan periode selanjutnya.
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedPackage(null);
                  }}
                  disabled={processing}
                  className="flex-1 min-h-[44px] py-2.5 rounded-lg border-2 border-black dark:border-gray-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 shadow-[2px_2px_0px_#000] transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  disabled={processing}
                  className="flex-1 min-h-[44px] py-2.5 rounded-lg border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black shadow-[2px_2px_0px_#000] transition-all"
                >
                  {processing ? 'Memproses...' : 'Ya, Upgrade Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
