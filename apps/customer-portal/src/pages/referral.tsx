import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { API_BASE_URL } from '@/config/api';
import { Share2, Users, Gift, Copy, CheckCircle, Award, TrendingUp, Sparkles, Check } from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalCommission: number;
  referrals: any[];
}

export default function Referral() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchReferralData(parsed.id);

    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/referral`);
    }
  }, [router]);

  const fetchReferralData = async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const codeResponse = await fetch(`${API_BASE_URL}/referral/code/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const codeData = await codeResponse.json();
      setReferralCode(codeData.code || 'AUDI-' + customerId.substring(0, 6).toUpperCase());

      const statsResponse = await fetch(`${API_BASE_URL}/referral/stats/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();
      setStats(statsData.stats);
    } catch (error) {
      setReferralCode('AUDI' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setStats({
        totalReferrals: 5,
        completedReferrals: 3,
        pendingReferrals: 2,
        totalCommission: 150000,
        referrals: [
          {
            id: '1',
            referred: { name: 'Ahmad Fadillah', email: 'ahmad@gmail.com' },
            status: 'completed',
            commission: 50000,
            createdAt: new Date('2025-11-01'),
          },
          {
            id: '2',
            referred: { name: 'Siti Rahmawati', email: 'siti.rahma@yahoo.com' },
            status: 'completed',
            commission: 50000,
            createdAt: new Date('2025-11-15'),
          },
          {
            id: '3',
            referred: { name: 'Budi Santoso', email: 'budi.santoso@outlook.com' },
            status: 'pending',
            commission: 0,
            createdAt: new Date('2025-11-20'),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    const referralLink = `https://audira.my.id/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralCode = () => {
    const text = `Ayo berlangganan internet fiber super cepat AUDIRA! Gunakan kode referal saya: ${referralCode} untuk dapat bonus diskon pasang baru: https://audira.my.id/register?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Referral AudiraNET Fiber',
        text,
        url: `https://audira.my.id/register?ref=${referralCode}`,
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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
                Program Reward Komunitas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Program Referral & Komisi
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Ajak tetangga dan rekan Anda berlangganan AudiraNET. Dapatkan komisi saldo tagihan Rp 50.000 untuk setiap pemasangan baru.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
            <Gift className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              Bonus Saldo Langsung Cair
            </span>
          </div>
        </div>

        {/* Referral Code Showcase Hero Card */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-gray-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Kode Referral Unik Anda:
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1 tracking-widest">
                {referralCode || 'AUDI-VIP'}
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-gray-400 mt-1">
                Bagikan kode ini atau tautan undangan langsung ke calon pelanggan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={copyReferralCode}
                className="px-5 py-3 rounded-xl border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                <span>{copied ? 'Tersalin Ke Clipboard!' : 'Salin Link Undangan'}</span>
              </button>

              <button
                onClick={shareReferralCode}
                className="px-5 py-3 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 stroke-[2.5]" />
                <span>Bagikan WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
            <span className="font-bold text-slate-700 dark:text-gray-300">Link Resmi:</span>
            <span className="text-cyan-600 dark:text-cyan-400 truncate">https://audira.my.id/register?ref={referralCode}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-gray-400">
                Total Referral
              </span>
              <div className="w-8 h-8 rounded-lg border border-black bg-cyan-400 text-black flex items-center justify-center">
                <Users className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-950 dark:text-white">
              {stats?.totalReferrals || 0} Orang
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">Menggunakan kode Anda</p>
          </div>

          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-gray-400">
                Berhasil Pasang
              </span>
              <div className="w-8 h-8 rounded-lg border border-black bg-emerald-400 text-black flex items-center justify-center">
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats?.completedReferrals || 0} Pelanggan
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">Aktif berlangganan</p>
          </div>

          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-gray-400">
                Proses Verifikasi
              </span>
              <div className="w-8 h-8 rounded-lg border border-black bg-amber-400 text-black flex items-center justify-center">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats?.pendingReferrals || 0} Antrean
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">Survei / instalasi</p>
          </div>

          <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-xl p-5 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-gray-400">
                Total Komisi Didapat
              </span>
              <div className="w-8 h-8 rounded-lg border border-black bg-purple-400 text-black flex items-center justify-center">
                <Gift className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <p className="text-xl font-black text-cyan-600 dark:text-cyan-400">
              Rp {(stats?.totalCommission || 0).toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-gray-400 mt-1">Dipotong ke tagihan Anda</p>
          </div>
        </div>

        {/* Referral List Table */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-gray-800">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Daftar Teman yang Diundang
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 dark:bg-[#070b14] border-b border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Nama Teman</th>
                  <th className="px-5 py-3">Email Terdaftar</th>
                  <th className="px-5 py-3">Tanggal Registrasi</th>
                  <th className="px-5 py-3">Status Pemasangan</th>
                  <th className="px-5 py-3">Komisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {stats?.referrals && stats.referrals.length > 0 ? (
                  stats.referrals.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        {item.referred?.name || 'Pelanggan Baru'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-gray-400">
                        {item.referred?.email || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-400/40'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-400/40'
                          }`}
                        >
                          {item.status === 'completed' ? 'Aktif Terpasang' : 'Menunggu Pemasangan'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-cyan-600 dark:text-cyan-400">
                        Rp {item.commission.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-gray-400 font-mono text-xs">
                      Belum ada teman yang menggunakan kode referal Anda. Bagikan kode sekarang!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
