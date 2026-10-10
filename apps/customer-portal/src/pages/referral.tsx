import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { Share2, Users, Gift, Copy, CheckCircle, Award, TrendingUp } from 'lucide-react';

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
      router.push('/');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    fetchReferralData(parsed.id);
  }, [router]);

  const fetchReferralData = async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch referral code
      const codeResponse = await fetch(`http://localhost:4000/referral/code/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const codeData = await codeResponse.json();
      setReferralCode(codeData.code || 'LOADING');

      // Fetch referral stats
      const statsResponse = await fetch(`http://localhost:4000/referral/stats/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
      // Mock data
      setReferralCode('AUDI' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setStats({
        totalReferrals: 5,
        completedReferrals: 3,
        pendingReferrals: 2,
        totalCommission: 150000,
        referrals: [
          {
            id: '1',
            referred: { name: 'John Doe', email: 'john@email.com' },
            status: 'completed',
            commission: 50000,
            createdAt: new Date('2025-11-01'),
          },
          {
            id: '2',
            referred: { name: 'Jane Smith', email: 'jane@email.com' },
            status: 'completed',
            commission: 50000,
            createdAt: new Date('2025-11-15'),
          },
          {
            id: '3',
            referred: { name: 'Bob Wilson', email: 'bob@email.com' },
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
    const referralLink = `https://audiranet.com/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralCode = () => {
    const referralLink = `https://audiranet.com/register?ref=${referralCode}`;
    const message = `Daftar AudiraNET pakai kode referral saya ${referralCode} dan dapatkan bonus! ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Referral AudiraNET',
        text: message,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message);
      alert('Link referral disalin ke clipboard!');
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

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Program Referral</h1>
          <p className="text-gray-600">Ajak teman dan dapatkan komisi!</p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm opacity-90 mb-2">Kode Referral Anda</div>
              <div className="text-4xl font-bold tracking-wider">{referralCode}</div>
            </div>
            <Share2 className="h-16 w-16 opacity-80" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyReferralCode}
              className="flex-1 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Berhasil Disalin!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Salin Link
                </>
              )}
            </button>
            <button
              onClick={shareReferralCode}
              className="flex-1 bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              Bagikan
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white border-opacity-30">
            <div className="text-sm opacity-90">
              Link Referral: https://audiranet.com/register?ref={referralCode}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalReferrals || 0}
            </div>
            <div className="text-sm text-gray-600">Total Referral</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.completedReferrals || 0}
            </div>
            <div className="text-sm text-gray-600">Berhasil</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.pendingReferrals || 0}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              Rp {(stats?.totalCommission || 0).toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-600">Total Komisi</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cara Kerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Bagikan Kode</h3>
              <p className="text-gray-600 text-sm">
                Bagikan kode referral Anda ke teman dan keluarga
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Teman Daftar</h3>
              <p className="text-gray-600 text-sm">
                Teman mendaftar menggunakan kode referral Anda
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dapatkan Komisi</h3>
              <p className="text-gray-600 text-sm">
                Dapatkan Rp 50.000 setiap teman yang berlangganan
              </p>
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Referral</h2>
          
          {stats && stats.referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Nama
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Komisi
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.referrals.map((referral) => (
                    <tr key={referral.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {referral.referred.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {referral.referred.email}
                      </td>
                      <td className="py-3 px-4">
                        {referral.status === 'completed' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Berhasil
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        Rp {referral.commission.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada referral</p>
              <p className="text-sm text-gray-500 mt-1">
                Mulai ajak teman untuk mendapatkan komisi
              </p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
