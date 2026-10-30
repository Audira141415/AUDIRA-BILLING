import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
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
  FileText,
  X
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
  const { toast } = useToast();
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
    toast.success('Tautan pendaftaran mitra sales disalin ke clipboard.', 'Tersalin');
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
        toast.success(data.message || `Status mitra berhasil diubah menjadi ${status}.`, 'Status Diperbarui');
        loadData();
      } else {
        toast.error(data.message || 'Gagal memperbarui status', 'Gagal');
      }
    } catch (err: any) {
      toast.error(`Terjadi kesalahan: ${err.message}`, 'Kesalahan Jaringan');
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
        toast.success('Pencairan komisi berhasil disetujui!', 'Payout Disetujui');
        setSelectedWithdrawal(null);
        setReceiptUrl('');
        setApprovalNotes('');
        loadData();
      } else {
        toast.error(data.message || 'Gagal menyetujui pencairan', 'Gagal');
      }
    } catch (err: any) {
      toast.error(`Terjadi kesalahan: ${err.message}`, 'Kesalahan Jaringan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayout = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      toast.warning('Wajib mengisi alasan penolakan pencairan', 'Validasi Gagal');
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
        toast.info('Pengajuan pencairan telah ditolak dan saldo dikembalikan.', 'Payout Ditolak');
        setSelectedWithdrawal(null);
        setRejectionReason('');
        loadData();
      } else {
        toast.error(data.message || 'Gagal menolak pencairan', 'Gagal');
      }
    } catch (err: any) {
      toast.error(`Terjadi kesalahan: ${err.message}`, 'Kesalahan Jaringan');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Sales & Partner Ecosystem - AUDIRA NET BILLING</title>
      </Head>

      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono mb-2">
          <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
          <span>/</span>
          <Link href="/pengaturan" className="hover:text-[var(--app-text)]">Sistem & Pengaturan</Link>
          <span>/</span>
          <span className="text-blue-500 font-semibold">Sales Performance</span>
        </div>
        {/* Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-500" />
              Sales Partner & Referral Ecosystem
            </h1>
            <p className="text-sm text-[var(--app-text-muted)]">
              Kelola kemitraan sales freelance, verifikasi pendaftaran mandiri, pencairan komisi (E-Wallet), dan histori audit mutasi.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border border-[var(--app-border)] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
        </div>

        {/* Shareable Link Banner (Inspired by KelolaNet) */}
        <div className="bg-[var(--app-card)] border border-emerald-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex-shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-500">Tautan Pendaftaran Mandiri Mitra Sales</div>
              <div className="text-sm font-mono text-[var(--app-text)] break-all select-all" suppressHydrationWarning>
                {registrationLink}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={copyRegistrationLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-bg)] text-[var(--app-text)] border border-[var(--app-border)] transition shadow-sm"
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
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Form
            </a>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Menunggu Konfirmasi */}
          <div className="bg-[var(--app-card)] border border-amber-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-500 dark:text-amber-400 uppercase tracking-wide">Menunggu Konfirmasi</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">{stats.pendingPartners}</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Calon mitra perlu persetujuan</p>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl border border-amber-500/20">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Penarikan Menunggu */}
          <div className="bg-[var(--app-card)] border border-rose-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-rose-500 dark:text-rose-400 uppercase tracking-wide">Penarikan Menunggu</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">{stats.pendingWithdrawals}</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Permintaan payout saldo</p>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl border border-rose-500/20">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Sales Aktif */}
          <div className="bg-[var(--app-card)] border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Sales Aktif</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">{stats.activePartners}</p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Mitra aktif mencari pelanggan</p>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Total Saldo Tertahan */}
          <div className="bg-[var(--app-card)] border border-blue-500/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total Saldo Dompet</p>
                <p className="text-2xl font-bold text-[var(--app-text)] mt-1">
                  Rp {stats.totalBalanceHeld.toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-[var(--app-muted)] mt-1">Akumulasi komisi mitra di dompet</p>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[var(--app-border)] flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => switchTab('mitra')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'mitra'
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Users className="w-4 h-4" />
            Mitra Sales ({partners.length})
          </button>

          <button
            onClick={() => switchTab('approval')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition relative whitespace-nowrap ${
              activeTab === 'approval'
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
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
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition relative whitespace-nowrap ${
              activeTab === 'payout'
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
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
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
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
                <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--app-text-muted)]" />
                <input
                  type="text"
                  placeholder="Cari nama, kode referral, telepon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-emerald-500"
                />
              </form>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[var(--app-text-muted)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] px-3 py-2 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="ACTIVE">Aktif (ACTIVE)</option>
                  <option value="PENDING">Menunggu (PENDING)</option>
                  <option value="SUSPENDED">Ditangguhkan (SUSPENDED)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--app-text)]">
                  <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold text-[11px] border-b border-[var(--app-border)]">
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
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {partners.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[var(--app-text-muted)]">
                          Belum ada data mitra sales.
                        </td>
                      </tr>
                    ) : (
                      partners.map((p) => (
                        <tr key={p.id} className="hover:bg-[var(--app-card-subtle)] transition">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-[var(--app-text)]">{p.name}</div>
                            <div className="text-[11px] text-[var(--app-text-muted)] flex items-center gap-1 mt-0.5">
                              <a
                                href={`https://wa.me/${p.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-500 hover:underline inline-flex items-center gap-0.5"
                              >
                                {p.phone}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono bg-[var(--app-card-subtle)] text-emerald-500 px-2 py-0.5 rounded border border-[var(--app-border)] font-semibold">
                              {p.code}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[var(--app-text-muted)]">{p.zone || '-'}</td>
                          <td className="px-4 py-3.5 text-center font-bold text-[var(--app-text)]">
                            {p._count?.leads || 0}
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-emerald-500">
                            Rp {p.balance.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.status === 'ACTIVE'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                  : p.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1">
                            {p.status === 'ACTIVE' ? (
                              <button
                                onClick={() => handleUpdatePartnerStatus(p.id, 'SUSPENDED')}
                                className="px-2 py-1 text-[11px] rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 transition"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdatePartnerStatus(p.id, 'ACTIVE')}
                                className="px-2 py-1 text-[11px] rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
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
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--app-text)]">
                  <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold text-[11px] border-b border-[var(--app-border)]">
                    <tr>
                      <th className="px-4 py-3">Calon Mitra</th>
                      <th className="px-4 py-3">WhatsApp & Email</th>
                      <th className="px-4 py-3">Wilayah Cover</th>
                      <th className="px-4 py-3">Rekening Bank / E-Wallet</th>
                      <th className="px-4 py-3">Tanggal Daftar</th>
                      <th className="px-4 py-3 text-right">Keputusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {partners.filter((p) => p.status === 'PENDING').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[var(--app-text-muted)]">
                          Tidak ada calon mitra yang menunggu persetujuan.
                        </td>
                      </tr>
                    ) : (
                      partners
                        .filter((p) => p.status === 'PENDING')
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-[var(--app-card-subtle)] transition">
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-[var(--app-text)]">{p.name}</div>
                              <span className="text-[10px] font-mono text-emerald-500">
                                Usulan Kode: {p.code}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div>{p.phone}</div>
                              <div className="text-[11px] text-[var(--app-text-muted)]">{p.email || '-'}</div>
                            </td>
                            <td className="px-4 py-3.5">{p.zone || '-'}</td>
                            <td className="px-4 py-3.5">
                              <div className="font-medium text-[var(--app-text)]">
                                {p.bankName ? `${p.bankName} - ${p.bankAccount}` : '-'}
                              </div>
                              <div className="text-[11px] text-[var(--app-text-muted)]">{p.bankAccountName || ''}</div>
                            </td>
                            <td className="px-4 py-3.5 text-[var(--app-text-muted)]">
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
                                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-medium transition inline-flex items-center gap-1"
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
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--app-text)]">
                  <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold text-[11px] border-b border-[var(--app-border)]">
                    <tr>
                      <th className="px-4 py-3">Nama Mitra</th>
                      <th className="px-4 py-3">Nominal Penarikan</th>
                      <th className="px-4 py-3">Tujuan Bank / E-Wallet</th>
                      <th className="px-4 py-3">Waktu Pengajuan</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[var(--app-text-muted)]">
                          Belum ada data pengajuan pencairan saldo.
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-[var(--app-card-subtle)] transition">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-[var(--app-text)]">{w.salesPartner?.name}</div>
                            <div className="text-[11px] text-[var(--app-text-muted)] font-mono">
                              {w.salesPartner?.code} ({w.salesPartner?.phone})
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[var(--app-text)] text-sm">
                            Rp {w.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-[var(--app-text)]">
                              {w.bankName} - {w.bankAccount}
                            </div>
                            <div className="text-[11px] text-[var(--app-text-muted)]">a.n {w.bankAccountName}</div>
                          </td>
                          <td className="px-4 py-3.5 text-[var(--app-text-muted)]">
                            {new Date(w.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                w.status === 'APPROVED'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                  : w.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
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
                              <span className="text-[11px] text-[var(--app-text-muted)] italic">Selesai diproses</span>
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
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--app-text)]">
                  <thead className="bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] uppercase font-semibold text-[11px] border-b border-[var(--app-border)]">
                    <tr>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Mitra Sales</th>
                      <th className="px-4 py-3">Tipe Mutasi</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3 text-right">Nominal</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    {ledgers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[var(--app-text-muted)]">
                          Belum ada transaksi di buku kas komisi.
                        </td>
                      </tr>
                    ) : (
                      ledgers.map((l) => (
                        <tr key={l.id} className="hover:bg-[var(--app-card-subtle)] transition">
                          <td className="px-4 py-3.5 text-[var(--app-text-muted)] whitespace-nowrap">
                            {new Date(l.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-[var(--app-text)]">
                            {l.salesPartner?.name} ({l.salesPartner?.code})
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                l.type.startsWith('CREDIT')
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                              }`}
                            >
                              {l.type}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[var(--app-text-muted)]">{l.description}</td>
                          <td
                            className={`px-4 py-3.5 text-right font-bold whitespace-nowrap ${
                              l.type.startsWith('CREDIT') ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {l.type.startsWith('CREDIT') ? '+' : '-'} Rp {l.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]">
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
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                Proses Pencairan Komisi Mitra
              </h3>
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="text-[var(--app-text-muted)] hover:text-[var(--app-text)] p-1 rounded-lg hover:bg-[var(--app-card-subtle)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[var(--app-card-subtle)] rounded-lg p-4 space-y-2 border border-[var(--app-border)] text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--app-text-muted)]">Nama Mitra:</span>
                <span className="font-semibold text-[var(--app-text)]">{selectedWithdrawal.salesPartner?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-text-muted)]">Kode Referral:</span>
                <span className="font-mono text-emerald-500">{selectedWithdrawal.salesPartner?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-text-muted)]">Bank / E-Wallet:</span>
                <span className="font-semibold text-[var(--app-text)]">{selectedWithdrawal.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-text-muted)]">Nomor Rekening:</span>
                <span className="font-mono text-[var(--app-text)] select-all">{selectedWithdrawal.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--app-text-muted)]">Nama Penerima:</span>
                <span className="font-semibold text-[var(--app-text)]">{selectedWithdrawal.bankAccountName}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--app-border)] pt-2 text-sm">
                <span className="text-[var(--app-text)] font-bold">Nominal Transfer:</span>
                <span className="text-emerald-500 font-extrabold text-base">
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
                  className="w-full px-3 py-2 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-emerald-500 transition-colors"
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
                  className="w-full px-3 py-2 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-rose-500 mb-1 font-medium">
                  Alasan Penolakan (Hanya jika ingin menolak):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nomor rekening tidak cocok dengan nama akun"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--app-bg)] border border-rose-500/40 rounded-lg text-rose-500 placeholder-[var(--app-text-muted)] focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--app-border)]">
              <button
                onClick={handleRejectPayout}
                disabled={actionLoading}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 transition"
              >
                Tolak Payout
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWithdrawal(null)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] transition"
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
