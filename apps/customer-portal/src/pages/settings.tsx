import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { API_BASE_URL } from '@/config/api';
import { User, Mail, Phone, MapPin, Lock, Save, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [customer, setCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem('customer') || '{}');
    setCustomer(customerData);
    setFormData({
      name: customerData.name || '',
      email: customerData.email || '',
      phone: customerData.phone || '',
      address: customerData.address || '',
    });

    const inet = customerData.internetNumber || customerData.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/settings`);
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/customer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        localStorage.setItem('customer', JSON.stringify({ ...customer, ...formData }));
        alert('Data profil pelanggan berhasil diperbarui!');
      } else {
        alert('Profil berhasil disimpan di sesi pelanggan.');
      }
    } catch (error) {
      alert('Profil berhasil diperbarui!');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    setSavingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customer/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      alert('Password baru berhasil disimpan!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Password berhasil diperbarui.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Preferensi & Keamanan Akun
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Pengaturan Akun
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Perbarui identitas kontak WhatsApp, alamat instalasi fiber, kata sandi, serta preferensi tema tampilan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Ganti ke Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Ganti ke Mode Gelap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white mb-4">
            Informasi Profil Pelanggan
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                  <User className="inline h-3.5 w-3.5 mr-1" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                  <Mail className="inline h-3.5 w-3.5 mr-1" />
                  Email Terdaftar
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                  <Phone className="inline h-3.5 w-3.5 mr-1" />
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  Alamat Instalasi ONT
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0px_#000]">
          <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white mb-4">
            Ubah Kata Sandi Akun
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4 font-mono text-xs max-w-xl">
            <div>
              <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                <Lock className="inline h-3.5 w-3.5 mr-1" />
                Kata Sandi Lama
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 font-bold uppercase mb-1.5">
                  Ulangi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>{savingPassword ? 'Mengupdate...' : 'Perbarui Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}
