import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { Award, Star, Gift, TrendingUp, Trophy, Zap } from 'lucide-react';

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
  const [redeemPoints, setRedeemPoints] = useState(0);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchLoyaltyData(parsed.id);
  }, [router]);

  const fetchLoyaltyData = async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch loyalty summary
      const summaryResponse = await fetch(`http://localhost:4000/referral/loyalty/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);

      // Fetch leaderboard
      const leaderboardResponse = await fetch('http://localhost:4000/referral/leaderboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData.leaderboard);
    } catch (error) {
      console.error('Failed to fetch loyalty data:', error);
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
            description: 'Payment of Rp 350000',
            createdAt: new Date('2025-11-30'),
          },
          {
            id: '2',
            points: 200,
            source: 'referral',
            description: 'Referral completed: customer-123',
            createdAt: new Date('2025-11-25'),
          },
        ],
      });

      setLeaderboard([
        { name: 'John Doe', totalPoints: 5000, tier: 'gold' },
        { name: 'Jane Smith', totalPoints: 3500, tier: 'silver' },
        { name: customer?.name || 'You', totalPoints: 1250, tier: 'silver' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: {
        name: 'Bronze',
        color: 'from-orange-400 to-orange-600',
        icon: Award,
        minPoints: 0,
        benefits: ['Diskon 5%', 'Poin 1x'],
      },
      silver: {
        name: 'Silver',
        color: 'from-gray-300 to-gray-500',
        icon: Star,
        minPoints: 2000,
        benefits: ['Diskon 10%', 'Poin 1.5x', 'Priority Support'],
      },
      gold: {
        name: 'Gold',
        color: 'from-yellow-400 to-yellow-600',
        icon: Trophy,
        minPoints: 5000,
        benefits: ['Diskon 15%', 'Poin 2x', 'Free Instalasi', 'Priority Support'],
      },
      platinum: {
        name: 'Platinum',
        color: 'from-blue-400 to-purple-600',
        icon: Zap,
        minPoints: 10000,
        benefits: ['Diskon 20%', 'Poin 3x', 'Free Upgrade', 'Dedicated Support', 'Exclusive Gifts'],
      },
    };
    
    type TierKey = keyof typeof tiers;
    return tiers[tier as TierKey] || tiers.bronze;
  };

  const handleRedeem = async () => {
    if (redeemPoints <= 0 || redeemPoints > (summary?.totalPoints || 0)) {
      alert('Jumlah poin tidak valid');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/referral/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: customer.id,
          points: redeemPoints,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Berhasil! Anda mendapat diskon Rp ${data.result.discountValue.toLocaleString('id-ID')}`);
        setShowRedeemModal(false);
        fetchLoyaltyData(customer.id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to redeem points:', error);
      alert('Gagal menukarkan poin');
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  const tierInfo = getTierInfo(summary?.tier || 'bronze');
  const TierIcon = tierInfo.icon;

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Points</h1>
          <p className="text-gray-600">Kumpulkan poin dan dapatkan reward menarik</p>
        </div>

        {/* Tier Card */}
        <div className={`bg-gradient-to-r ${tierInfo.color} rounded-lg p-8 mb-8 text-white`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm opacity-90 mb-2">Tier Anda</div>
              <div className="text-4xl font-bold">{tierInfo.name}</div>
            </div>
            <TierIcon className="h-20 w-20 opacity-80" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-3xl font-bold">{summary?.totalPoints || 0}</div>
              <div className="text-sm opacity-90">Total Poin</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {Math.floor((summary?.totalPoints || 0) / 100)}
              </div>
              <div className="text-sm opacity-90">Poin Tersedia (Rp)</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{tierInfo.minPoints}</div>
              <div className="text-sm opacity-90">Min. Poin Tier</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {summary?.tier === 'platinum' ? '∞' : 
                  summary?.tier === 'gold' ? 10000 :
                  summary?.tier === 'silver' ? 5000 : 2000}
              </div>
              <div className="text-sm opacity-90">Next Tier</div>
            </div>
          </div>

          <button
            onClick={() => setShowRedeemModal(true)}
            className="w-full bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Gift className="inline h-5 w-5 mr-2" />
            Tukar Poin
          </button>
        </div>

        {/* Benefits & Points Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Benefit Tier {tierInfo.name}</h2>
            <ul className="space-y-3">
              {tierInfo.benefits.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Points by Source */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sumber Poin</h2>
            <div className="space-y-3">
              {summary && Object.entries(summary.pointsBySource).map(([source, points]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{source}</span>
                  <span className="font-semibold text-gray-900">{points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Points History */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Riwayat Poin Terbaru</h2>
          {summary && summary.recentPoints.length > 0 ? (
            <div className="space-y-3">
              {summary.recentPoints.map((point) => (
                <div key={point.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium text-gray-900">{point.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(point.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div className={`font-bold ${point.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {point.points > 0 ? '+' : ''}{point.points} pts
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Belum ada riwayat poin</p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            Leaderboard
          </h2>
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => {
              const entryTierInfo = getTierInfo(entry.tier);
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.name === customer?.name ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${
                      idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{entry.name}</div>
                      <div className={`text-sm bg-gradient-to-r ${entryTierInfo.color} bg-clip-text text-transparent font-bold`}>
                        {entryTierInfo.name}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">{entry.totalPoints} pts</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tukar Poin</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Poin (100 poin = Rp 10.000)
                </label>
                <input
                  type="number"
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(parseInt(e.target.value) || 0)}
                  max={summary?.totalPoints || 0}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jumlah poin"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Tersedia: {summary?.totalPoints || 0} poin
                </div>
              </div>

              {redeemPoints > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="text-sm text-blue-900">
                    <strong>Nilai Diskon:</strong> Rp {((redeemPoints / 100) * 10000).toLocaleString('id-ID')}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={redeemPoints <= 0 || redeemPoints > (summary?.totalPoints || 0)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tukar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
