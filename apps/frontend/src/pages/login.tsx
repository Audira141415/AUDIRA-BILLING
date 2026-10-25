import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
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
    // Check if user just registered
    if (router.query.registered === 'true') {
      setSuccessMessage('Registrasi berhasil! Silakan login dengan akun Anda.')
    }
  }, [router.query])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      setError('Email atau password salah. Silakan coba lagi.')
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
      setError('Email atau password salah. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center transform -rotate-12">
              <div className="w-10 h-10 border-4 border-white rounded-xl transform rotate-12"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AudiraNET</h1>
              <p className="text-sm text-gray-600">Powered by MySemesta</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Era Baru<br />Konektivitas
            </h2>
            <p className="text-xl text-gray-600">
              Platform Cerdas untuk ISP Masa Depan.
            </p>
          </div>

          <div className="pt-8 hidden lg:block">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Manajemen ISP Terpadu</h3>
                  <p className="text-sm text-gray-600">Kelola semua aspek bisnis ISP Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-4xl">👋🏻</span>
                <h3 className="text-2xl font-bold text-gray-900">Halo, Selamat Datang!</h3>
              </div>
              <p className="text-gray-600">Silahkan masuk untuk melanjutkan</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-500" size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-slate-500" size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="text-slate-500 hover:text-gray-600" size={20} />
                    ) : (
                      <Eye className="text-slate-500 hover:text-gray-600" size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Quick Login / Demo Access */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
                Akses Cepat (Tinggal Klik)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@audira.net', 'admin123')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <span className="text-xl mb-1">👑</span>
                  <span className="text-xs font-bold text-blue-900">Login Admin</span>
                  <span className="text-[10px] text-blue-600">admin@audira.net</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer@example.com', 'customer123')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <span className="text-xl mb-1">👤</span>
                  <span className="text-xs font-bold text-purple-900">Login Customer</span>
                  <span className="text-[10px] text-purple-600">customer@example.com</span>
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Belum punya akun?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Daftar di sini
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-slate-400">
                © 2025 AudiraNET. Platform ISP Management System.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
