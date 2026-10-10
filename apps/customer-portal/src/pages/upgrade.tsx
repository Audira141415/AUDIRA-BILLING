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
      router.push('/');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchPackages(parsed);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Paket</h1>
          <p className="text-gray-600">Tingkatkan kecepatan internet Anda</p>
        </div>

        {/* Current Package */}
        {currentPackage && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">Paket Saat Ini</div>
                <div className="text-2xl font-bold">{currentPackage.name}</div>
                <div className="text-lg mt-1">Rp {currentPackage.price.toLocaleString('id-ID')}/bulan</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentPackage.speed}</div>
                <div className="text-sm opacity-90">Kecepatan</div>
              </div>
            </div>
          </div>
        )}

        {/* Available Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {packages.map((pkg) => {
            const isCurrent = pkg.id === currentPackage?.id;
            const isDowngrade = currentPackage && parseInt(pkg.speed) < parseInt(currentPackage.speed);

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  isCurrent ? 'ring-2 ring-blue-500' : ''
                } ${isDowngrade ? 'opacity-50' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULER
                  </div>
                )}
                {pkg.recommended && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    REKOMENDASI
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                    PAKET AKTIF
                  </div>
                )}

                <div className="p-6">
                  <div className="text-center mb-6">
                    <Wifi className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{pkg.speed}</div>
                    <div className="text-gray-600">
                      Rp {pkg.price.toLocaleString('id-ID')}
                      <span className="text-sm">/bulan</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={isCurrent || !!isDowngrade}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isDowngrade
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCurrent ? 'Paket Aktif' : isDowngrade ? 'Tidak Tersedia' : 'Pilih Paket'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Keuntungan Upgrade Paket
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kecepatan Lebih Tinggi</h3>
              <p className="text-gray-600 text-sm">
                Download lebih cepat, streaming tanpa buffering, dan gaming tanpa lag
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Produktivitas Meningkat</h3>
              <p className="text-gray-600 text-sm">
                Upload file besar lebih cepat, video conference lebih lancar
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prioritas Support</h3>
              <p className="text-gray-600 text-sm">
                Dapatkan layanan customer support dengan prioritas lebih tinggi
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Upgrade</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Paket Lama:</span>
                  <span className="font-semibold">{currentPackage?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Paket Baru:</span>
                  <span className="font-semibold text-blue-600">{selectedPackage.name}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Bulanan:</span>
                    <span className="font-semibold">
                      Rp {selectedPackage.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {currentPackage && (
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Selisih:</span>
                      <span className="text-green-600">
                        +Rp {(selectedPackage.price - currentPackage.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Informasi:</strong> Upgrade akan berlaku pada periode billing berikutnya. 
                  Anda akan menerima notifikasi konfirmasi melalui email dan WhatsApp.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedPackage(null);
                  }}
                  disabled={processing}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  disabled={processing}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Memproses...' : 'Konfirmasi Upgrade'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
