import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import {
  Users,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  Copy,
  Share2,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Send,
  Building,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';

interface Partner {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  zone?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  balance: number;
  pendingBalance: number;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  createdAt: string;
  _count?: {
    leads: number;
    commissions: number;
    withdrawals: number;
  };
}

interface Withdrawal {
  id: string;
  salesPartnerId: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  transferReceipt?: string;
  notes?: string;
  createdAt: string;
  salesPartner: {
    id: string;
    name: string;
    phone: string;
    code: string;
    balance: number;
  };
}

interface LedgerItem {
  id: string;
  salesPartnerId: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  salesPartner?: {
    name: string;
    code: string;
    phone: string;
  };
}

export default function AdminSalesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mitra' | 'approval' | 'payout' | 'ledger'>('mitra');

  useEffect(() => {
    if (router.query.tab) {
      const t = String(router.query.tab).toLowerCase();
      if (['mitra', 'approval', 'payout', 'ledger'].includes(t)) {
        setActiveTab(t as any);
      }
    }
  }, [router.query.tab]);

  const switchTab = (tab: 'mitra' | 'approval' | 'payout' | 'ledger') => {
    setActiveTab(tab);
    router.replace({ pathname: '/admin/sales', query: { tab } }, undefined, { shallow: true });
  };
  const [stats, setStats] = useState({
    pendingPartners: 0,
    pendingWithdrawals: 0,
    activePartners: 0,
    totalBalanceHeld: 0,
    totalCommissionsPaid: 0,
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modals state
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('adminToken')
      : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Stats
      const statsRes = await fetch(`${API_URL}/sales/admin/stats`, {
        headers: getAuthHeaders(),
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }

      // 2. Load Partners
      const partnersRes = await fetch(
        `${API_URL}/sales/admin/partners?status=${statusFilter}&search=${encodeURIComponent(search)}`,
        { headers: getAuthHeaders() }
      );
      if (partnersRes.ok) {
        const pData = await partnersRes.json();
        if (pData.success) setPartners(pData.data);
      }

      // 3. Load Withdrawals
      const withRes = await fetch(`${API_URL}/sales/admin/withdrawals`, {
        headers: getAuthHeaders(),
      });
      if (withRes.ok) {
        const wData = await withRes.json();
        if (wData.success) setWithdrawals(wData.data);
      }

      // 4. Load Ledger
      const ledRes = await fetch(`${API_URL}/sales/admin/ledger`, {
        headers: getAuthHeaders(),
      });
      if (ledRes.ok) {
        const lData = await ledRes.json();
        if (lData.success) setLedgers(lData.data);
      }
    } catch (err) {
      console.error('Failed to load sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const [registrationLink, setRegistrationLink] = useState('https://audira.my.id/sales/daftar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRegistrationLink(`${window.location.origin}/sales/daftar`);
    }
  }, []);

  const copyRegistrationLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo! Bergabunglah menjadi Mitra Sales AUDIRA Digital Network dan dapatkan komisi menarik untuk setiap instalasi internet baru di wilayah Anda.\n\nDaftar sekarang di: ${registrationLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleUpdatePartnerStatus = async (partnerId: string, status: string) => {
    if (!confirm(`Konfirmasi ubah status mitra menjadi ${status}?`)) return;
    try {
      const res = await fetch(`${API_URL}/sales/admin/partners/${partnerId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        loadData();
      } else {
        alert(data.message || 'Gagal memperbarui status');
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    }
  };

  const handleApprovePayout = async () => {
    if (!selectedWithdrawal) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/sales/admin/withdrawals/${selectedWithdrawal.id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          transferReceipt: receiptUrl,
          notes: approvalNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Pencairan komisi berhasil disetujui!');
        setSelectedWithdrawal(null);
        setReceiptUrl('');
        setApprovalNotes('');
        loadData();
      } else {
        alert(data.message || 'Gagal menyetujui pencairan');
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayout = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert('Wajib mengisi alasan penolakan pencairan');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/sales/admin/withdrawals/${selectedWithdrawal.id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Pengajuan pencairan telah ditolak dan saldo dikembalikan.');
        setSelectedWithdrawal(null);
        setRejectionReason('');
        loadData();
      } else {
        alert(data.message || 'Gagal menolak pencairan');
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Sales & Partner Ecosystem — AUDIRA NET BILLING</title>
      </Head>

      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-2">
          <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
          <span>/</span>
          <Link href="/pengaturan" className="hover:text-[var(--app-text)]">Sistem & Pengaturan</Link>
          <span>/</span>
          <span className="text-blue-500 font-semibold">Sales Performance</span>
        </div>
        {/* Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-400" />
              Sales Partner & Referral Ecosystem
            </h1>
            <p className="text-sm text-[var(--app-muted)]">
              Kelola kemitraan sales freelance, verifikasi pendaftaran mandiri, pencairan komisi (E-Wallet), dan histori audit mutasi.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
        </div>

        {/* Shareable Link Banner (Inspired by KelolaNet) */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-slate-500/5 to-indigo-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-emerald-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">Tautan Pendaftaran Mandiri Mitra Sales</div>
              <div className="text-sm font-mono text-slate-800 dark:text-slate-300 break-all select-all" suppressHydrationWarning>
                {registrationLink}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={copyRegistrationLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 transition shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Tersalin!' : 'Salin Tautan'}
            </button>
            <button
              onClick={shareToWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <a
              href="/sales/daftar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Form
            </a>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Menunggu Konfirmasi */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-400 uppercase tracking-wide">Menunggu Konfirmasi</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">{stats.pendingPartners}</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Calon mitra perlu persetujuan</p>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Penarikan Menunggu */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-rose-400 uppercase tracking-wide">Penarikan Menunggu</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">{stats.pendingWithdrawals}</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Permintaan payout saldo</p>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Sales Aktif */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Sales Aktif</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">{stats.activePartners}</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Mitra aktif mencari pelanggan</p>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Total Saldo Tertahan */}
          <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">Total Saldo Dompet</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">
                  Rp {stats.totalBalanceHeld.toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Akumulasi komisi mitra di dompet</p>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-6">
          <button
            onClick={() => switchTab('mitra')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'mitra'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Mitra Sales ({partners.length})
          </button>

          <button
            onClick={() => switchTab('approval')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition relative ${
              activeTab === 'approval'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Persetujuan Pendaftaran
            {stats.pendingPartners > 0 && (
               <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {stats.pendingPartners}
              </span>
            )}
          </button>

          <button
            onClick={() => switchTab('payout')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition relative ${
              activeTab === 'payout'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Pencairan Saldo (Payout)
            {stats.pendingWithdrawals > 0 && (
               <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {stats.pendingWithdrawals}
              </span>
            )}
          </button>

          <button
            onClick={() => switchTab('ledger')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'ledger'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Riwayat Mutasi (Ledger)
          </button>
        </div>

        {/* Tab 1: Mitra Sales */}
        {activeTab === 'mitra' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--app-muted)]" />
                <input
                  type="text"
                  placeholder="Cari nama, kode referral, telepon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </form>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[var(--app-muted)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 px-3 py-2 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="ACTIVE">Aktif (ACTIVE)</option>
                  <option value="PENDING">Menunggu (PENDING)</option>
                  <option value="SUSPENDED">Ditangguhkan (SUSPENDED)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-[var(--app-muted)] uppercase font-semibold text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Mitra & Kontak</th>
                      <th className="px-4 py-3">Kode Referral</th>
                      <th className="px-4 py-3">Wilayah</th>
                      <th className="px-4 py-3 text-center">Pelanggan (PSB)</th>
                      <th className="px-4 py-3 text-right">Saldo Dompet</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {partners.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[var(--app-muted)]">
                          Belum ada data mitra sales.
                        </td>
                      </tr>
                    ) : (
                      partners.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-white">{p.name}</div>
                            <div className="text-[11px] text-[var(--app-muted)] flex items-center gap-1 mt-0.5">
                              <a
                                href={`https://wa.me/${p.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline inline-flex items-center gap-0.5"
                              >
                                {p.phone}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                              {p.code}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[var(--app-muted)]">{p.zone || '-'}</td>
                          <td className="px-4 py-3.5 text-center font-bold text-[var(--app-text)]">
                            {p._count?.leads || 0}
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-emerald-400">
                            Rp {p.balance.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.status === 'ACTIVE'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : p.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1">
                            {p.status === 'ACTIVE' ? (
                              <button
                                onClick={() => handleUpdatePartnerStatus(p.id, 'SUSPENDED')}
                                className="px-2 py-1 text-[11px] rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdatePartnerStatus(p.id, 'ACTIVE')}
                                className="px-2 py-1 text-[11px] rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
                              >
                                Aktifkan
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Persetujuan Pendaftaran */}
        {activeTab === 'approval' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-[var(--app-muted)] uppercase font-semibold text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Calon Mitra</th>
                      <th className="px-4 py-3">WhatsApp & Email</th>
                      <th className="px-4 py-3">Wilayah Cover</th>
                      <th className="px-4 py-3">Rekening Bank / E-Wallet</th>
                      <th className="px-4 py-3">Tanggal Daftar</th>
                      <th className="px-4 py-3 text-right">Keputusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {partners.filter((p) => p.status === 'PENDING').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[var(--app-muted)]">
                          Tidak ada calon mitra yang menunggu persetujuan.
                        </td>
                      </tr>
                    ) : (
                      partners
                        .filter((p) => p.status === 'PENDING')
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40 transition">
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-white">{p.name}</div>
                              <span className="text-[10px] font-mono text-emerald-400">
                                Usulan Kode: {p.code}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div>{p.phone}</div>
                              <div className="text-[11px] text-[var(--app-muted)]">{p.email || '-'}</div>
                            </td>
                            <td className="px-4 py-3.5">{p.zone || '-'}</td>
                            <td className="px-4 py-3.5">
                              <div className="font-medium text-slate-200">
                                {p.bankName ? `${p.bankName} - ${p.bankAccount}` : '-'}
                              </div>
                              <div className="text-[11px] text-[var(--app-muted)]">{p.bankAccountName || ''}</div>
                            </td>
                            <td className="px-4 py-3.5 text-[var(--app-muted)]">
                              {new Date(p.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="px-4 py-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleUpdatePartnerStatus(p.id, 'ACTIVE')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition inline-flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Setujui
                              </button>
                              <button
                                onClick={() => handleUpdatePartnerStatus(p.id, 'SUSPENDED')}
                                className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-medium transition inline-flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Tolak
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Pencairan Saldo (Payout) */}
        {activeTab === 'payout' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-[var(--app-muted)] uppercase font-semibold text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Nama Mitra</th>
                      <th className="px-4 py-3">Nominal Penarikan</th>
                      <th className="px-4 py-3">Tujuan Bank / E-Wallet</th>
                      <th className="px-4 py-3">Waktu Pengajuan</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[var(--app-muted)]">
                          Belum ada data pengajuan pencairan saldo.
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-white">{w.salesPartner?.name}</div>
                            <div className="text-[11px] text-[var(--app-muted)] font-mono">
                              {w.salesPartner?.code} ({w.salesPartner?.phone})
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[var(--app-text)] text-sm">
                            Rp {w.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-200">
                              {w.bankName} — {w.bankAccount}
                            </div>
                            <div className="text-[11px] text-[var(--app-muted)]">a.n {w.bankAccountName}</div>
                          </td>
                          <td className="px-4 py-3.5 text-[var(--app-muted)]">
                            {new Date(w.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                w.status === 'APPROVED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : w.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {w.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {w.status === 'PENDING' ? (
                              <button
                                onClick={() => setSelectedWithdrawal(w)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition inline-flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Proses Payout
                              </button>
                            ) : (
                              <span className="text-[11px] text-[var(--app-muted)] italic">Selesai diproses</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Riwayat Mutasi (Ledger) */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-[var(--app-muted)] uppercase font-semibold text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Mitra Sales</th>
                      <th className="px-4 py-3">Tipe Mutasi</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3 text-right">Nominal</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {ledgers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[var(--app-muted)]">
                          Belum ada transaksi di buku kas komisi.
                        </td>
                      </tr>
                    ) : (
                      ledgers.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3.5 text-[var(--app-muted)] whitespace-nowrap">
                            {new Date(l.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-white">
                            {l.salesPartner?.name} ({l.salesPartner?.code})
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                l.type.startsWith('CREDIT')
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {l.type}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-300">{l.description}</td>
                          <td
                            className={`px-4 py-3.5 text-right font-bold whitespace-nowrap ${
                              l.type.startsWith('CREDIT') ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {l.type.startsWith('CREDIT') ? '+' : '-'} Rp {l.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payout Modal Dialog */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Proses Pencairan Komisi Mitra
              </h3>
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="text-[var(--app-muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-4 space-y-2 border border-slate-700 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--app-muted)]">Nama Mitra:</span>
                <span className="font-semibold text-white">{selectedWithdrawal.salesPartner?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-muted)]">Kode Referral:</span>
                <span className="font-mono text-emerald-400">{selectedWithdrawal.salesPartner?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-muted)]">Bank / E-Wallet:</span>
                <span className="font-semibold text-white">{selectedWithdrawal.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-muted)]">Nomor Rekening:</span>
                <span className="font-mono text-white select-all">{selectedWithdrawal.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-muted)]">Nama Penerima:</span>
                <span className="font-semibold text-white">{selectedWithdrawal.bankAccountName}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2 text-sm">
                <span className="text-slate-300 font-bold">Nominal Transfer:</span>
                <span className="text-emerald-400 font-extrabold text-base">
                  Rp {selectedWithdrawal.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Input Bukti Transfer & Catatan */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--app-text)] mb-1 font-medium">
                  URL Bukti Transfer / Resi (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="https://... atau upload link resi"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[var(--app-text)] mb-1 font-medium">
                  Catatan Admin / Referensi Transfer:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Trf via BCA KlikBisnis ref #92182"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-rose-400 mb-1 font-medium">
                  Alasan Penolakan (Hanya jika ingin menolak):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nomor rekening tidak cocok dengan nama akun"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] border border-rose-900/60 rounded-lg text-rose-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleRejectPayout}
                disabled={actionLoading}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition"
              >
                Tolak Payout
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWithdrawal(null)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleApprovePayout}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                >
                  {actionLoading ? 'Memproses...' : 'Konfirmasi Berhasil Transfer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
