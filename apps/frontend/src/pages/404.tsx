import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Home, ArrowLeft, Search, BookOpen, Settings, Mail } from 'lucide-react'

export default function Custom404() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-[130px] md:text-[180px] font-mono font-black text-[var(--app-border)] select-none leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-600/10 border-2 border-blue-500/40 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg">
                <Search className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--app-text)] mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm md:text-base text-[var(--app-text-muted)] mb-3 max-w-md mx-auto">
            Halaman rute yang Anda tuju tidak terdaftar atau telah dipindahkan ke segmen modul lain.
          </p>
          <p className="text-xs font-mono text-[var(--app-text-muted)]" suppressHydrationWarning>
            Rute: <code className="bg-[var(--app-card)] border border-[var(--app-border)] px-2.5 py-1 rounded-md text-[var(--app-primary)]" suppressHydrationWarning>{mounted ? router.asPath : ''}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-surface-2)] text-[var(--app-text)] border border-[var(--app-border)] rounded-lg transition-colors font-medium text-sm focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Home size={16} />
            <span>Ke Halaman Utama</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-10 p-5 bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] text-left">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--app-text)] mb-1">Pusat Bantuan & Navigasi</h3>
          <p className="text-xs text-[var(--app-text-muted)] mb-4">
            Bila rute seharusnya aktif dalam konfigurasi ISP Billing, silakan periksa rute menu atau hubungi administrator:
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dokumentasi"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--app-primary)] hover:underline font-medium"
            >
              <BookOpen size={13} />
              <span>Dokumentasi Sistem</span>
            </Link>
            <span className="text-[var(--app-border)]">•</span>
            <Link
              href="/pengaturan"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--app-primary)] hover:underline font-medium"
            >
              <Settings size={13} />
              <span>Pengaturan Rute</span>
            </Link>
            <span className="text-[var(--app-border)]">•</span>
            <a
              href="mailto:support@audiranet.com"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--app-primary)] hover:underline font-medium"
            >
              <Mail size={13} />
              <span>Hubungi Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
