import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function Custom404() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-bold text-gray-200 leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-6xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <p className="text-sm text-slate-400" suppressHydrationWarning>
            URL: <code className="bg-gray-100 px-2 py-1 rounded" suppressHydrationWarning>{mounted ? router.asPath : ''}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg transition-all font-medium shadow-sm"
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-medium shadow-lg"
          >
            <Home size={20} />
            <span>Ke Halaman Utama</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator sistem.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/dokumentasi"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              📚 Dokumentasi
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/pengaturan"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ⚙️ Pengaturan
            </Link>
            <span className="text-slate-600">•</span>
            <a
              href="mailto:support@audiranet.com"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ✉️ Hubungi Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
