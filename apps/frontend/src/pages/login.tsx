import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, UserCheck, Activity, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (router.query.registered === 'true') {
      setSuccessMessage('Registrasi berhasil. Silakan masuk menggunakan kredensial akun Anda.')
    }
  }, [router.query])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      setError('Email atau kata sandi tidak valid. Periksa kembali akun Anda.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (selectedEmail: string, selectedPassword: string) => {
    setLoading(true)
    setError('')
    setEmail(selectedEmail)
    setPassword(selectedPassword)

    try {
      await login(selectedEmail, selectedPassword)
    } catch (err) {
      setError('Email atau kata sandi tidak valid. Periksa kembali akun Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Brand Context */}
        <div className="space-y-6 order-2 lg:order-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] font-mono">AUDIRA-NET</h1>
              <p className="text-xs text-[var(--app-text-muted)] font-mono">Carrier-Grade ISP Operations Console</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--app-text)] leading-tight">
              Sistem Penagihan &<br />Manajemen Jaringan ISP
            </h2>
            <p className="text-sm text-[var(--app-text-muted)] max-w-md mx-auto lg:mx-0 leading-relaxed">
              Platform operasional real-time untuk sinkronisasi MikroTik RouterOS, OLT EPON/GPON, penagihan otomatis, dan integrasi WhatsApp Gateway.
            </p>
          </div>

          <div className="pt-4 hidden lg:block">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[var(--app-text)]">Akses Terenkripsi & Terisolasi</h3>
                  <p className="text-[11px] text-[var(--app-text-muted)]">Otorisasi sesi berbasis token JWT dengan kontrol akses granular multi-role.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="order-1 lg:order-2">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[var(--app-text)]">Autentikasi Akun</h3>
              <p className="text-xs text-[var(--app-text-muted)] mt-1">Masukkan kredensial resmi untuk mengakses konsol operasional.</p>
            </div>

            {successMessage && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-[var(--app-text-muted)]" size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] transition"
                    placeholder="admin@audira.net"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-[var(--app-text-muted)]" size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] transition font-mono"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 text-blue-600 border-[var(--app-border)] rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-[var(--app-text-muted)]">Ingat sesi ini</span>
                </label>
                <Link href="/forgot-password" className="text-blue-500 hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition text-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {loading ? (
                  <span>Memproses Masuk...</span>
                ) : (
                  <>
                    <span>Masuk ke Konsol</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-5 border-t border-[var(--app-border)]">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--app-text-muted)] text-center mb-2.5">
                Akses Cepat Pengujian
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@audira.net', 'admin123')}
                  disabled={loading}
                  className="flex items-center gap-2 p-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg transition text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[var(--app-text)] truncate">Admin ISP</p>
                    <p className="text-[10px] font-mono text-[var(--app-text-muted)] truncate">admin@audira.net</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer@example.com', 'customer123')}
                  disabled={loading}
                  className="flex items-center gap-2 p-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg transition text-left"
                >
                  <UserCheck className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[var(--app-text)] truncate">Pelanggan</p>
                    <p className="text-[10px] font-mono text-[var(--app-text-muted)] truncate">customer@example.com</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-5 text-center text-xs text-[var(--app-text-muted)]">
              Belum terdaftar sebagai mitra?{' '}
              <Link href="/register" className="text-blue-500 hover:underline font-semibold">
                Daftar akun baru
              </Link>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--app-border)] text-center text-xs">
              <Link href="/landing" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center justify-center gap-1">
                <span>Lihat Brosur Produk &amp; Paket Harga AUDIRA</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
