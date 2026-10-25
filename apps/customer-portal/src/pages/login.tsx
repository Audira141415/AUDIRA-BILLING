import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Eye, EyeOff, Wifi, ArrowLeft, ShieldCheck, Lock, Sun, Moon } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useTheme } from '@/contexts/ThemeContext';

export default function Login() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If already logged in, redirect directly to personalized customer dashboard
    const existingToken = localStorage.getItem('token');
    const existingCustomer = localStorage.getItem('customer');
    if (existingToken && existingCustomer) {
      try {
        const parsed = JSON.parse(existingCustomer);
        const inet = parsed.internetNumber || parsed.id || 'NET-100234';
        router.replace(`/c/${inet}/dashboard`);
        return;
      } catch {
        localStorage.removeItem('customer');
        localStorage.removeItem('token');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('customer', JSON.stringify(data.customer));
        localStorage.setItem('token', data.access_token);
        const inet = data.customer?.internetNumber || data.customer?.id || 'NET-100234';
        router.push(`/c/${inet}/dashboard`);
      } else {
        setError(data.message || 'Login gagal, periksa email dan password Anda');
      }
    } catch (err) {
      setError('Terjadi kendala koneksi ke server backend. Pastikan server aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Masuk Portal Pelanggan | AudiraNET ISP</title>
        <meta name="description" content="Login ke self-service portal pelanggan AudiraNET untuk cek tagihan, bayar online, dan cek kuota." />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="w-9 h-9 rounded-lg border-2 border-black dark:border-gray-700 bg-white dark:bg-[#0e1626] shadow-[2px_2px_0px_#000] flex items-center justify-center text-slate-800 dark:text-cyan-300"
            >
              {mounted && theme === 'light' ? (
                <Moon className="w-4 h-4 fill-slate-800" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-400 border-2 border-black shadow-[3px_3px_0px_#000] rounded-lg flex items-center justify-center text-black font-black text-xl">
              <Wifi className="w-7 h-7 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white uppercase">
                Audira<span className="text-cyan-500 dark:text-cyan-400">NET</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">PORTAL PELANGGAN RESMI</p>
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-gray-200">
            Masuk ke Akun Pelanggan
          </h2>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            Kelola tagihan, cek pemakaian bandwidth, dan buka tiket bantuan.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="bg-white dark:bg-[#0e1626] border-2 border-black dark:border-gray-800 rounded-xl p-8 shadow-[8px_8px_0px_#000] relative">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-950/60 border-2 border-red-500 text-red-800 dark:text-red-300 text-sm flex items-start gap-3">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5 font-bold">
                  Email Terdaftar / ID Pelanggan
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm font-sans transition-colors"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 font-bold">
                    Kata Sandi
                  </label>
                  <a
                    href="https://wa.me/6282112001600?text=Halo%20Admin%20AudiraNET,%20saya%20lupa%20kata%20sandi%20portal%20pelanggan"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline font-medium"
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-slate-50 dark:bg-[#070b14] border-2 border-slate-300 dark:border-gray-700 rounded-lg px-4 py-3 pr-11 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm font-sans transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-sm rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  {loading ? 'Memverifikasi...' : 'Masuk ke Portal'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-gray-800 text-center">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono mb-2">AKUN DEMO PELANGGAN (KLIK UNTUK ISI OTOMATIS):</p>
              <button
                type="button"
                onClick={() => {
                  setEmail('customer@demo.com');
                  setPassword('demo123');
                }}
                className="w-full bg-slate-100 hover:bg-cyan-50 dark:bg-[#070b14] dark:hover:bg-cyan-950/30 p-2.5 rounded border border-slate-300 dark:border-gray-800 hover:border-cyan-400 dark:hover:border-cyan-500 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-bold transition-all cursor-pointer text-center"
              >
                customer@demo.com | demo123
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Koneksi Aman Terenkripsi SSL 256-bit</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Belum berlangganan AudiraNET?{' '}
              <Link href="/#paket" className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 underline">
                Daftar Pasang Baru Di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
