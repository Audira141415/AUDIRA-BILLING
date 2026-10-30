import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Phone,
  Lock,
  Mail,
  MapPin,
  Building,
  CreditCard,
  LayoutDashboard,
  ArrowLeft,
  Copy,
  ExternalLink,
  Share2,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function SalesRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    zone: '',
    bankName: 'BCA',
    bankAccount: '',
    bankAccountName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    code: string;
    name: string;
    phone: string;
  } | null>(null);

  const [publicLink, setPublicLink] = useState('https://audira.my.id/sales/daftar?public=true');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPublicLink(`${window.location.origin}/sales/daftar?public=true`);
    }
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  // Check if opened as standalone public form via query param
  const isPublic = router.isReady && (router.query.public === 'true' || router.query.public === '1');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo! Bergabunglah menjadi Mitra Sales AUDIRA Digital Network dan dapatkan komisi menarik untuk setiap instalasi internet baru di wilayah Anda.\n\nDaftar sekarang di: ${publicLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi sederhana
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Nama lengkap dan nomor WhatsApp wajib diisi');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/sales/partners/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          password: formData.password,
          zone: formData.zone.trim() || undefined,
          bankName: formData.bankName,
          bankAccount: formData.bankAccount.trim() || undefined,
          bankAccountName: formData.bankAccountName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegisteredData({
          code: data.data?.referralCode || data.data?.code || 'SALES-AUDIRA',
          name: formData.name,
          phone: formData.phone,
        });
      } else {
        setError(data.message || 'Pendaftaran gagal diproses. Silakan coba kembali.');
      }
    } catch (err: any) {
      setError(`Terjadi kesalahan jaringan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRegisteredData(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      zone: '',
      bankName: 'BCA',
      bankAccount: '',
      bankAccountName: '',
    });
    setError(null);
  };

  // The actual Registration Form component
  const formComponent = (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bagian 1: Data Identitas Diri */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border-b border-[var(--app-border)] pb-2">
            <Users className="w-4 h-4" />
            1. Data Identitas Mitra
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Contoh: 081234567890"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
              <span className="text-[10px] text-[var(--app-text-dim)] mt-1 block">
                Notifikasi komisi dan kode referral akan dikirimkan ke nomor ini.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Alamat Email (Opsional)
              </label>
              <input
                type="email"
                name="email"
                placeholder="budi@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Wilayah Cover / Domisili
              </label>
              <input
                type="text"
                name="zone"
                placeholder="Contoh: Batam Kota, Sekupang, Batu Aji"
                value={formData.zone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Bagian 2: Akun Keamanan */}
        <div className="space-y-4 pt-2">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border-b border-[var(--app-border)] pb-2">
            <Lock className="w-4 h-4" />
            2. Kata Sandi Portal Mitra
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Ulangi Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Ketik ulang sandi"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Bagian 3: Rekening Pencairan Komisi */}
        <div className="space-y-4 pt-2">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border-b border-[var(--app-border)] pb-2">
            <CreditCard className="w-4 h-4" />
            3. Rekening Pencairan Komisi (E-Wallet / Bank)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Bank / E-Wallet
              </label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              >
                <option value="BCA">BCA (Bank Central Asia)</option>
                <option value="Mandiri">Bank Mandiri</option>
                <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                <option value="BNI">BNI (Bank Negara Indonesia)</option>
                <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                <option value="DANA">DANA E-Wallet</option>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Nomor Rekening / No. E-Wallet
              </label>
              <input
                type="text"
                name="bankAccount"
                placeholder="Contoh: 1234567890"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                Atas Nama Rekening
              </label>
              <input
                type="text"
                name="bankAccountName"
                placeholder="Sesuai buku tabungan / e-wallet"
                value={formData.bankAccountName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-dim)] text-sm focus:outline-none focus:border-emerald-500 transition shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Memproses Pendaftaran...
              </>
            ) : (
              <>
                Daftarkan Sebagai Mitra Sales AUDIRA
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-[var(--app-text-muted)] mt-3">
            Dengan mendaftar, mitra menyetujui syarat & ketentuan kemitraan komisi AUDIRA Digital Network.
          </p>
        </div>
      </form>
    </div>
  );

  // Success State Component
  const successComponent = registeredData && (
    <div className="bg-[var(--app-card)] border border-emerald-500/30 rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--app-text)]">
          Pendaftaran Mitra Berhasil!
        </h2>
        <p className="text-[var(--app-text-muted)] text-sm mt-2 max-w-lg mx-auto">
          Terima kasih <strong className="text-[var(--app-text)]">{registeredData.name}</strong>. Permohonan kemitraan telah berhasil didaftarkan ke sistem AUDIRA.
        </p>
      </div>

      {/* Referral Code Box */}
      <div className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl p-6 max-w-md mx-auto space-y-2">
        <div className="text-xs uppercase tracking-wider text-[var(--app-text-muted)] font-semibold">
          Kode Referral Mitra
        </div>
        <div className="text-3xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
          {registeredData.code}
        </div>
        <div className="text-xs text-[var(--app-text-dim)]">
          Kode ini digunakan untuk melacak setiap pelanggan yang didaftarkan oleh mitra.
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <p className="text-xs text-[var(--app-text-muted)]">
          Nomor WhatsApp terdaftar: <strong className="text-emerald-600 dark:text-emerald-400">{registeredData.phone}</strong>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin/sales?tab=approval"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30 transition text-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Buka Tab Approval Mitra
          </Link>
          <button
            onClick={resetForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-hover)] text-[var(--app-text)] font-semibold transition text-sm border border-[var(--app-border)]"
          >
            <Users className="w-4 h-4" />
            Daftarkan Mitra Baru Lainnya
          </button>
        </div>
      </div>
    </div>
  );

  // 1. STANDALONE PUBLIC VIEW (when explicitly accessed with ?public=true)
  if (isPublic) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col justify-between transition-colors duration-200">
        <Head>
          <title>Pendaftaran Mitra Sales & Agen - AUDIRA Digital Network</title>
          <meta
            name="description"
            content="Bergabung menjadi Mitra Sales Freelance AUDIRA Digital Network. Dapatkan komisi instan untuk setiap pemasangan internet baru di wilayah Anda."
          />
        </Head>

        {/* Navigation Header */}
        <header className="border-b border-[var(--app-border)] bg-[var(--app-surface)]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">
                A
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider text-[var(--app-text)]">AUDIRA</span>
                <span className="text-xs uppercase ml-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                  PARTNER
                </span>
              </div>
            </Link>

            <a
              href="https://wa.me/6282112001600"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--app-text-muted)] hover:text-emerald-500 transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Bantuan Hotline
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12">
          {registeredData ? (
            successComponent
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Peluang Penghasilan Kemitraan
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--app-text)] tracking-tight">
                  Daftar Mitra Sales & Agen Freelance
                </h1>
                <p className="text-sm text-[var(--app-text-muted)] max-w-xl mx-auto">
                  Bantu warga dan bisnis di wilayah Anda menikmati internet fiber optik berkecepatan tinggi dari AUDIRA. Dapatkan komisi langsung di setiap instalasi aktif!
                </p>
              </div>

              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
                {formComponent}
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-[var(--app-border)] py-6 text-center text-xs text-[var(--app-text-muted)]">
          © {new Date().getFullYear()} AUDIRA Multimedia Digital / Audira Sukses Mandiri. Hak Cipta Dilindungi.
        </footer>
      </div>
    );
  }

  // 2. DEFAULT ADMIN DASHBOARD VIEW (With Full Sidebar & Layout)
  return (
    <Layout>
      <Head>
        <title>Registrasi Mitra Sales Baru - AUDIRA NET BILLING</title>
      </Head>

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)]">
          <Link href="/admin/sales" className="hover:text-[var(--app-primary)] transition">
            Sales & Mitra Partner
          </Link>
          <span>/</span>
          <span className="text-[var(--app-primary)] font-semibold">Registrasi Mitra Sales Baru</span>
        </div>

        {/* Page Title & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Users className="w-6 h-6" />
              </div>
              Registrasi Mitra Sales Baru
            </h1>
            <p className="text-sm text-[var(--app-text-muted)] mt-1">
              Formulir input data kemitraan sales freelance & reseller resmi AUDIRA Digital Network.
            </p>
          </div>

          <Link
            href="/admin/sales"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-hover)] text-[var(--app-text)] border border-[var(--app-border)] transition shadow-xs self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard Sales
          </Link>
        </div>

        {/* Share Public Link Banner */}
        <div className="bg-[var(--app-card)] border border-emerald-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                Tautan Pendaftaran Mandiri Calon Mitra (Publik)
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all select-all mt-0.5" suppressHydrationWarning>
                {publicLink}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={copyPublicLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 transition shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Tersalin!' : 'Salin Tautan'}
            </button>
            <button
              onClick={shareToWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <a
              href="/sales/daftar?public=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Form Publik
            </a>
          </div>
        </div>

        {/* Main Card with Form or Success */}
        {registeredData ? (
          successComponent
        ) : (
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
            {formComponent}
          </div>
        )}
      </div>
    </Layout>
  );
}
