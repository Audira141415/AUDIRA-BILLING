import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft, Mail, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [method, setMethod] = useState<'whatsapp' | 'email'>('whatsapp')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <>
      <Head>
        <title>Pemulihan Akun — AUDIRA NET</title>
      </Head>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xl p-6 sm:p-8">
          
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-500 mb-3">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pemulihan Kata Sandi
            </h1>
            <p className="text-xs sm:text-sm text-[var(--app-muted)] mt-1.5">
              Masukkan nomor WhatsApp atau email terdaftar untuk menerima tautan verifikasi
            </p>
          </div>

          {submitted ? (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <p className="font-semibold text-sm">Instruksi Terkirim!</p>
                <p className="text-xs mt-1 text-[var(--app-muted)]">
                  Kami telah mengirimkan instruksi pemulihan ke <span className="font-mono font-bold text-[var(--app-text)]">{identifier}</span> via {method === 'whatsapp' ? 'WhatsApp Gateway' : 'Email'}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full py-2.5 px-4 bg-[var(--app-bg)] hover:bg-[var(--app-border)]/50 border border-[var(--app-border)] text-xs font-semibold rounded-xl transition"
              >
                Kirim Ulang atau Gunakan Nomor Lain
              </button>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline font-semibold"
                >
                  <ArrowLeft size={14} />
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 p-1 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl">
                <button
                  type="button"
                  onClick={() => setMethod('whatsapp')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                    method === 'whatsapp'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <MessageSquare size={13} />
                  WhatsApp OTP
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                    method === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <Mail size={13} />
                  Email Reset
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                  {method === 'whatsapp' ? 'Nomor WhatsApp Terdaftar' : 'Alamat Email Terdaftar'}
                </label>
                <input
                  type={method === 'whatsapp' ? 'tel' : 'email'}
                  required
                  placeholder={method === 'whatsapp' ? 'Contoh: 081234567890' : 'nama@perusahaan.com'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-sm text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Mengirim Verifikasi...' : 'Kirim Tautan Verifikasi'}
              </button>

              <div className="pt-3 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--app-muted)] hover:text-[var(--app-text)] font-semibold transition"
                >
                  <ArrowLeft size={13} />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </>
  )
}
