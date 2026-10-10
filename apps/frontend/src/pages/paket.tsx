import { useState } from 'react'
import Layout from '@/components/Layout'
import { Zap, Star, Check, Crown, MessageCircle, Mail, Play, User, X, Info } from 'lucide-react'

interface PackageItem {
  id: string
  name: string
  price: number
  priceText: string
  icon: any
  color: string
  bgGradient: string
  features: string[]
  ctaText: string
  ctaColor: string
  isBadge?: boolean
  badgeText?: string
}

export default function Paket() {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  const handlePackageClick = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setShowPackageModal(true);
  };

  const packages: PackageItem[] = [
    {
      id: '1',
      name: 'Trial',
      price: 0,
      priceText: 'Rp 0',
      icon: Zap,
      color: 'purple',
      bgGradient: 'from-purple-600 to-purple-800',
      ctaText: 'Coba Gratis',
      ctaColor: 'bg-white text-purple-600 hover:bg-gray-100',
      features: [
        'Hingga 50 pelanggan aktif',
        'Aktif selama 14 hari',
        'Integrasi Mikrotik via API',
        'Billing otomatis',
        'Loket (kasir) max. 1',
        'Komisi Loket otomatis',
        'Integrasi ODP & Map Perangkat',
        'Modul Tiket + Teknisian',
        'Aplikasi Mobile (Android Playstore)',
        'Modul KeepOn (Bandwidth on Demand)',
        'Integrasi GenieACS (TR-069) untuk provisioning perangkat CPE'
      ]
    },
    {
      id: '2',
      name: 'Starter',
      price: 150000,
      priceText: 'Rp 150.000',
      icon: Star,
      color: 'pink',
      bgGradient: 'from-pink-500 to-pink-700',
      ctaText: 'Berlangganan',
      ctaColor: 'bg-white text-pink-600 hover:bg-gray-100',
      features: [
        'Hingga 500 pelanggan aktif',
        'Integrasi Mikrotik via API',
        'Billing otomatis',
        'Loket (kasir) max. 2',
        'Komisi Loket otomatis',
        'Tersedia payment gateway',
        'Integrasi ODP & Map Perangkat',
        'Modul Tiket + Teknisian',
        'Aplikasi Mobile (Android Playstore)',
        'Modul KeepOn (Bandwidth on Demand)'
      ]
    },
    {
      id: '3',
      name: 'Paket Essential',
      price: 200000,
      priceText: 'Rp 200.000',
      icon: Check,
      color: 'teal',
      bgGradient: 'from-teal-500 to-teal-700',
      ctaText: 'Berlangganan',
      ctaColor: 'bg-white text-teal-600 hover:bg-gray-100',
      features: [
        'Hingga 200 pelanggan aktif',
        'Integrasi Mikrotik via API',
        'Billing otomatis',
        'Maksimal 2 Loket',
        'Komisi Loket otomatis',
        'Tersedia payment gateway',
        'Integrasi ODP & Map Perangkat',
        'Modul Tiket + Teknisian',
        'Aplikasi Mobile (Android Playstore)',
        'Modul KeepOn (Bandwidth on Demand)',
        'Integrasi GenieACS (TR-069) untuk provisioning perangkat CPE'
      ]
    },
    {
      id: '4',
      name: 'Standart',
      price: 300000,
      priceText: 'Rp 300.000',
      icon: Crown,
      color: 'blue',
      bgGradient: 'from-blue-600 to-blue-800',
      ctaText: 'Berlangganan',
      ctaColor: 'bg-white text-blue-600 hover:bg-gray-100',
      isBadge: true,
      badgeText: 'TERLARIS',
      features: [
        'Hingga 800 pelanggan aktif',
        'Integrasi Mikrotik via API',
        'Billing otomatis',
        'Multi Loket',
        'Komisi Loket otomatis',
        'Tersedia payment gateway',
        'Integrasi ODP & Map Perangkat',
        'Modul Tiket + Teknisian',
        'Aplikasi Mobile (Android Playstore)',
        'Modul KeepOn (Bandwidth on Demand)',
        'Integrasi GenieACS (TR-069) untuk provisioning perangkat CPE'
      ]
    },
    {
      id: '5',
      name: 'Pro',
      price: 600000,
      priceText: 'Rp 600.000',
      icon: Zap,
      color: 'purple',
      bgGradient: 'from-purple-600 to-purple-800',
      ctaText: 'Berlangganan',
      ctaColor: 'bg-white text-purple-600 hover:bg-gray-100',
      features: [
        'Hingga 2.500 pelanggan aktif',
        'Integrasi Mikrotik via API',
        'Billing otomatis',
        'Multi Loket',
        'Komisi Loket otomatis',
        'Tersedia payment gateway',
        'Integrasi ODP & Map Perangkat',
        'Modul Tiket + Teknisian',
        'Aplikasi Mobile (Android Playstore)',
        'Modul KeepOn (Bandwidth on Demand)',
        'Integrasi GenieACS (TR-069) untuk provisioning perangkat CPE'
      ]
    },
    {
      id: '6',
      name: 'Custom',
      price: 0,
      priceText: 'Custom',
      icon: MessageCircle,
      color: 'dark',
      bgGradient: 'from-gray-800 to-gray-900',
      ctaText: 'Hubungi Kami',
      ctaColor: 'bg-orange-500 text-white hover:bg-orange-600',
      features: [
        '> 2500 pelanggan aktif',
        'Semua fitur pro',
        'Whitelist domain (custom domain brand ISP)',
        'Dedicated support (SLA khusus)',
        'Fitur enterprise (multi-tenant, laporan advance)',
        'Konsultasi & integrasi custom sesuai kebutuhan'
      ]
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-white mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <button className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali</span>
              </button>
              <span className="text-blue-300">→ Solusi Terpercaya untuk ISP</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Paket Billing ISP</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Solusi premium untuk manajemen billing dan pelanggan ISP Anda dengan fitur terbaik, sesuai skala bisnis.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              <MessageCircle size={20} />
              <span>Chat WhatsApp</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              <Mail size={20} />
              <span>Email Kami</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              <Play size={20} />
              <span>Play Store</span>
            </button>
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30">
              <Check size={16} />
              <span className="text-sm font-medium">Terpercaya</span>
              <span className="text-xs">Ratusan ISP</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
              <Check size={16} />
              <span className="text-sm font-medium">Berkualitas</span>
              <span className="text-xs">Support 24/7</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full border border-purple-500/30">
              <Check size={16} />
              <span className="text-sm font-medium">Populer</span>
              <span className="text-xs">Banyak digunakan</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const Icon = pkg.icon
            return (
              <div
                key={pkg.id}
                onClick={() => handlePackageClick(pkg)}
                className={`bg-gradient-to-br ${pkg.bgGradient} rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 relative overflow-hidden cursor-pointer ${
                  pkg.id === '4' || pkg.id === '5' ? 'xl:col-span-1' : ''
                }`}
              >
                {pkg.isBadge && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
                    {pkg.badgeText}
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 ${pkg.color === 'dark' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-white/20'} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={32} className={pkg.color === 'dark' ? 'text-orange-400' : 'text-white'} />
                </div>

                {/* Package Name */}
                <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold">{pkg.priceText}</p>
                  {pkg.price > 0 && <p className="text-sm opacity-80">/ Bulan</p>}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check size={18} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full ${pkg.ctaColor} font-semibold py-3 rounded-xl transition-all transform hover:scale-105`}>
                  {pkg.ctaText}
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom Section - Pro & Custom */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* This section is now integrated above */}
        </div>
      </div>

      {/* Package Detail Modal */}
      {showPackageModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedPackage.bgGradient} text-white p-6 rounded-t-2xl relative`}>
              <button
                onClick={() => setShowPackageModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  {(() => {
                    const Icon = selectedPackage.icon;
                    return <Icon size={32} />;
                  })()}
                </div>
                <div>
                  <p className="text-sm opacity-90">Detail Paket</p>
                  <h2 className="text-2xl font-bold">{selectedPackage.name}</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Price */}
              <div className="text-center pb-4 border-b">
                <p className="text-5xl font-bold text-gray-900">{selectedPackage.priceText}</p>
                {selectedPackage.price > 0 && <p className="text-gray-600 mt-1">per Bulan</p>}
                {selectedPackage.price === 0 && <p className="text-green-600 font-semibold mt-1">Gratis selama 14 hari</p>}
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                  <Info className="text-blue-600" size={20} />
                  <span>Fitur yang Termasuk</span>
                </h3>
                <ul className="space-y-2">
                  {selectedPackage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Check size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">Keuntungan Berlangganan</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ Setup dan implementasi gratis</p>
                  <p>✓ Training penggunaan sistem</p>
                  <p>✓ Support teknis 24/7</p>
                  <p>✓ Update fitur secara berkala</p>
                  <p>✓ Data aman dan backup otomatis</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowPackageModal(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button className={`px-6 py-2.5 ${selectedPackage.ctaColor} font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl`}>
                  {selectedPackage.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

