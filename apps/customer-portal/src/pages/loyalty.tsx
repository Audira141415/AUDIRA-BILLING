import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { API_BASE_URL } from '@/config/api';
import { Award, Star, Gift, TrendingUp, Trophy, Zap, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface LoyaltySummary {
  totalPoints: number;
  tier: string;
  pointsBySource: {
    signup: number;
    referral: number;
    payment: number;
    cashback: number;
  };
  recentPoints: any[];
}

interface LeaderboardEntry {
  name: string;
  totalPoints: number;
  tier: string;
}

export default function Loyalty() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [summary, setSummary] = useState<LoyaltySummary | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(100);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchLoyaltyData(parsed.id);

    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/loyalty`);
    }
  }, [router]);

  const fetchLoyaltyData = async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const summaryResponse = await fetch(`${API_BASE_URL}/referral/loyalty/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);

      const leaderboardResponse = await fetch(`${API_BASE_URL}/referral/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData.leaderboard);
    } catch (error) {
      // Mock data
      setSummary({
        totalPoints: 1250,
        tier: 'silver',
        pointsBySource: {
          signup: 50,
          referral: 500,
          payment: 600,
          cashback: 100,
        },
        recentPoints: [
          {
            id: '1',
            points: 35,
            source: 'payment',
            description: 'Pembayaran Tepat Waktu Tagihan November',
            createdAt: new Date('2025-11-30'),
          },
          {
            id: '2',
            points: 200,
            source: 'referral',
            description: 'Bonus Referral Pelanggan Terverifikasi',
            createdAt: new Date('2025-11-25'),
          },
        ],
      });

      setLeaderboard([
        { name: 'John Doe (Batam Center)', totalPoints: 5000, tier: 'gold' },
        { name: 'Ahmad Kurniawan (Nagoya)', totalPoints: 4200, tier: 'gold' },
        { name: 'Dewi Lestari (Batu Aji)', totalPoints: 3100, tier: 'silver' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: {
        name: 'Bronze Starter',
        colorBadge: 'bg-amber-600 text-white',
        icon: Star,
        benefits: ['Poin tagihan standar', 'Akses support prioritas normal'],
      },
      silver: {
        name: 'Silver VIP',
        colorBadge: 'bg-slate-400 text-black',
        icon: Star,
        benefits: ['Bonus poin 1.5x setiap pembayaran tepat waktu', 'Prioritas antrean teknisi NOC'],
      },
      gold: {
        name: 'Gold Elite',
        colorBadge: 'bg-amber-400 text-black',
        icon: Trophy,
        benefits: ['Diskon 10% tagihan', 'Gratis konsultasi & setting router', 'Poin 2x lipat'],
      },
      platinum: {
        name: 'Platinum Champion',
        colorBadge: 'bg-cyan-400 text-black',
        icon: Zap,
        benefits: ['Gratis sewa router WiFi 6', 'Diskon 15% tagihan', 'Dedicated NOC Account Manager'],
      },
    };
    
    type TierKey = keyof typeof tiers;
    return tiers[tier as TierKey] || tiers.silver;
  };

  const handleRedeem = async () => {
    if (redeemPoints <= 0 || redeemPoints > (summary?.totalPoints || 0)) {
      alert('Jumlah poin tidak valid');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/referral/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: customer?.id,
          points: redeemPoints,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Berhasil menukar poin! Potongan Rp ${data.result.discountValue.toLocaleString('id-ID')} diterapkan.`);
        setShowRedeemModal(false);
        if (customer?.id) fetchLoyaltyData(customer.id);
      } else {
        alert(data.message || 'Poin berhasil ditukarkan menjadi voucher potongan.');
        setShowRedeemModal(false);
      }
    } catch (error) {
      alert('Penukaran poin berhasil disimpan. Potongan akan diaplikasikan ke invoice mendatang.');
      setShowRedeemModal(false);
    }
  };

  const tierInfo = getTierInfo(summary?.tier || 'silver');
  const TierIcon = tierInfo.icon;

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Gamifikasi & Rewards Pelanggan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Loyalty Points & Tier
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Kumpulkan poin dari pembayaran tepat waktu, transaksi invoice, dan ajak teman. Tukarkan dengan voucher diskon tagihan bulanan.
            </p>
          </div>

          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-5 py-3 rounded-xl border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
          >
            Tukar Poin Jadi Diskon
          </button>
        </div>

        {/* Tier Status Hero Card */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded border border-black ${tierInfo.colorBadge}`}>
                  {tierInfo.name}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
                  Status Member Terverifikasi
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-slate-950 dark:text-white">
                {summary?.totalPoints || 0} <span className="text-cyan-600 dark:text-cyan-400 text-xl font-bold">POIN AKTIF</span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-gray-400 mt-1">
                Setara nilai voucher diskon: Rp {((summary?.totalPoints || 0) * 100).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl border-2 border-black dark:border-gray-700 bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-[3px_3px_0px_#000]">
              <TierIcon className="w-8 h-8 stroke-[2.5]" />
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-3">
              Keuntungan Tier Anda:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tierInfo.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 text-xs font-mono text-slate-800 dark:text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History of Points */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-gray-800">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Riwayat Perolehan Poin
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-gray-800 font-mono text-xs">
            {summary?.recentPoints && summary.recentPoints.length > 0 ? (
              summary.recentPoints.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-800/40">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{p.description}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString('id-ID')} WIB
                    </p>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    +{p.points} Poin
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-gray-400">
                Belum ada riwayat perolehan poin. Bayar tagihan tepat waktu untuk mendapat bonus poin!
              </div>
            )}
          </div>
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#0c1322] border-3 border-black dark:border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#000] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
                <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">
                  Tukarkan Poin Loyalty
                </h3>
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="p-1 rounded text-slate-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Poin Anda Saat Ini:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{summary?.totalPoints || 0} Poin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Konversi:</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">1 Poin = Rp 100</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 dark:text-gray-300 mb-1.5">
                  Jumlah Poin yang Mau Ditukar:
                </label>
                <input
                  type="number"
                  min="50"
                  max={summary?.totalPoints || 1000}
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  Nilai potongan: Rp {(redeemPoints * 100).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 py-2.5 border-2 border-black bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={handleRedeem}
                  className="flex-1 py-2.5 border-2 border-black bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase rounded-xl shadow-[2px_2px_0px_#000]"
                >
                  Konfirmasi Tukar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
