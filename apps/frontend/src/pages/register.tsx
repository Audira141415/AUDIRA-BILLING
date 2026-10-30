import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Mail, Lock, User, Phone, Eye, EyeOff, Building2, Activity, ArrowRight } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok')
      setLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: 'BILLING',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal diproses oleh server')
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--app-text)] font-mono">AUDIRA-NET</h1>
              <p className="text-[11px] text-[var(--app-text-muted)] font-mono">Pendaftaran Mitra Baru</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[var(--app-text)]">Buat Akun ISP Billing</h2>
          <p className="text-xs text-[var(--app-text-muted)] mt-0.5">Lengkapi profil operasional untuk mengaktifkan lisensi manajemen jaringan.</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                  placeholder="Nama Penanggung Jawab"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                  placeholder="admin@ispanda.id"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                  placeholder="081234567890"
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Nama Usaha / Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                  <Building2 size={16} />
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                  placeholder="PT Jaringan Mandiri"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-9 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] font-mono"
                  placeholder="Minimal 8 karakter"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Ulangi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                  <Lock size={16} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-9 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] font-mono"
                  placeholder="Ulangi kata sandi"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 mt-0.5 text-blue-600 border-[var(--app-border)] rounded focus:ring-blue-500"
              required
            />
            <label className="ml-2 text-xs text-[var(--app-text-muted)]">
              Saya menyetujui{' '}
              <Link href="/terms" className="text-blue-500 hover:underline">
                Syarat & Ketentuan Lisensi
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-blue-500 hover:underline">
                Kebijakan Privasi Data
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition text-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {loading ? (
              <span>Mendaftarkan Akun...</span>
            ) : (
              <>
                <span>Daftar Akun Baru</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--app-text-muted)] space-y-2">
          <div>
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-blue-500 hover:underline font-semibold">
              Masuk di sini
            </Link>
          </div>
          <div className="pt-2 border-t border-[var(--app-border)]">
            <Link href="/landing" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center justify-center gap-1">
              <span>Bandingkan Fitur &amp; Simulasi Biaya di Landing Page</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
