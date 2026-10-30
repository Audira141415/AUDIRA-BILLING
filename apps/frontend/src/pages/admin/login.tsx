import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Shield, Lock, Mail, ArrowRight, Activity } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'admin@audira.net',
    password: 'admin123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          type: 'user',
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('adminToken', data.access_token);
        router.push('/admin/customers');
      } else {
        setError(data.message || 'Autentikasi admin gagal. Periksa email dan sandi.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Gagal menghubungi gateway autentikasi. Pastikan backend aktif di port 3218.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-4">
      <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[var(--app-text)] font-mono">AUDIRA ADMIN PORTAL</h1>
          <p className="text-xs text-[var(--app-text-muted)] mt-1">Konsol Akses Manajemen Pelanggan & Jaringan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--app-text-muted)]">
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {loading ? (
              <span>Memvalidasi Kredensial...</span>
            ) : (
              <>
                <span>Masuk Administrator</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 p-3 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-center">
          <p className="text-[10px] text-[var(--app-text-muted)] uppercase tracking-wider font-semibold">Kredensial Default Staging</p>
          <p className="font-mono text-xs text-[var(--app-primary)] font-semibold mt-0.5">admin@audira.net : admin123</p>
        </div>
      </div>
    </div>
  );
}
