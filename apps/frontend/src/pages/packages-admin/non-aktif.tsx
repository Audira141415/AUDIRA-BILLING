import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import {
  Plus,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Trash2,
  Gift,
  X,
  Info,
  Clock,
  ChevronLeft,
  ChevronRight,
  Percent,
  Sliders,
} from 'lucide-react';

interface InactivePackage {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  type: string;
  speed: string;
  price: number;
  reason: string;
  reasonDetail: string;
  date: string;
  status: string;
}

export default function PaketNonAktifPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [inactivePackages, setInactivePackages] = useState<InactivePackage[]>([
    {
      id: '1',
      name: 'Promo Ramadhan 50M',
      tag: 'Promo',
      tagColor: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20',
      type: 'Internet',
      speed: '50 Mbps / 50 Mbps',
      price: 150000,
      reason: 'Kadaluarsa',
      reasonDetail: 'Periode promo musiman berakhir',
      date: '01/10/2026 10:30 WIB',
      status: 'expired',
    },
    {
      id: '2',
      name: 'Paket Trial FTTH 7 Hari',
      tag: 'Trial',
      tagColor: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20',
      type: 'Internet',
      speed: '20 Mbps / 20 Mbps',
      price: 0,
      reason: 'Kadaluarsa',
      reasonDetail: 'Periode evaluasi trial berakhir',
      date: '12/10/2026 17:15 WIB',
      status: 'expired',
    },
    {
      id: '3',
      name: 'Paket Corporate Legacy',
      tag: 'Corporate',
      tagColor: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20',
      type: 'Internet',
      speed: '100 Mbps / 100 Mbps',
      price: 500000,
      reason: 'Dihentikan Customer',
      reasonDetail: 'Migrasi ke Dedicated Ultra Fiber',
      date: '18/10/2026 09:45 WIB',
      status: 'stopped',
    },
    {
      id: '4',
      name: 'Paket Home Basic 10M',
      tag: 'Internet',
      tagColor: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20',
      type: 'Internet',
      speed: '10 Mbps / 10 Mbps',
      price: 100000,
      reason: 'Dihentikan Customer',
      reasonDetail: 'Upgrade massal ke 20 Mbps',
      date: '20/10/2026 14:20 WIB',
      status: 'stopped',
    },
    {
      id: '5',
      name: 'Paket Event Pameran',
      tag: 'Event',
      tagColor: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20',
      type: 'Internet',
      speed: '30 Mbps / 30 Mbps',
      price: 75000,
      reason: 'Tidak Digunakan',
      reasonDetail: 'Tidak ada pelanggan aktif',
      date: '22/10/2026 11:05 WIB',
      status: 'unused',
    },
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setReasonFilter('all');
    toast.info('Filter paket non-aktif telah direset.');
  };

  const totalInactive = inactivePackages.length;
  const expiredCount = inactivePackages.filter((p) => p.status === 'expired').length;
  const stoppedCount = inactivePackages.filter((p) => p.status === 'stopped').length;
  const unusedCount = inactivePackages.filter((p) => p.status === 'unused').length;
  const totalRevenueLost = 3450000;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const filteredPackages = inactivePackages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reason.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase());
    const matchesReason =
      reasonFilter === 'all' || p.reason.toLowerCase().includes(reasonFilter.toLowerCase());
    return matchesSearch && matchesReason;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / limit));
  const paginatedPackages = filteredPackages.slice((page - 1) * limit, page * limit);

  const handleReactivate = (pkg: InactivePackage) => {
    setInactivePackages((prev) => prev.filter((item) => item.id !== pkg.id));
    toast.success(`Paket "${pkg.name}" berhasil diaktifkan kembali ke katalog utama!`);
  };

  const handleDelete = (pkg: InactivePackage) => {
    setInactivePackages((prev) => prev.filter((item) => item.id !== pkg.id));
    toast.warning(`Arsip paket "${pkg.name}" telah dihapus permanen.`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        {/* Top Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">
                AUDIRA
              </Link>
              <span>/</span>
              <Link href="/packages-admin" className="hover:text-[var(--app-text)]">
                Paket &amp; Layanan
              </Link>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Paket Arsip / Non-Aktif</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Arsip Paket Internet Non-Aktif
            </h1>
            <p className="text-xs text-[var(--app-text-muted)]">
              Daftar paket lama yang telah didepresiasi atau tidak lagi dijual untuk pendaftaran pelanggan baru.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/packages-admin"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-surface-2)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Total Arsip
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {totalInactive}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Semua paket non aktif</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Kadaluarsa
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {expiredCount}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Periode berakhir</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <Sliders size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Dihentikan
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {stoppedCount}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Migrasi paket</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-slate-500/10 text-[var(--app-text-muted)] border border-[var(--app-border)] rounded-xl">
              <X size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Tidak Digunakan
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {unusedCount}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">0 pelanggan aktif</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="p-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl">
              <Percent size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Dampak MRR
              </p>
              <p className="text-base font-black font-mono text-[var(--app-text)] mt-0.5">
                {formatCurrency(totalRevenueLost)}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Dialihkan ke paket baru</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama paket, tipe, keterangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2.5 px-4 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 min-w-[160px]"
            >
              <option value="all">Semua Alasan</option>
              <option value="kadaluarsa">Kadaluarsa</option>
              <option value="customer">Dihentikan Customer</option>
              <option value="tidak digunakan">Tidak Digunakan</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all ml-auto"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() =>
                toast.success(`Filter diterapkan: ${filteredPackages.length} paket arsip ditemukan.`)
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Main Two-Column Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-12">NO</th>
                      <th className="p-4 w-52">NAMA PAKET</th>
                      <th className="p-4 w-24">TIPE</th>
                      <th className="p-4 w-36">KECEPATAN</th>
                      <th className="p-4 w-28">HARGA</th>
                      <th className="p-4 w-52">ALASAN NON AKTIF</th>
                      <th className="p-4">TANGGAL</th>
                      <th className="p-4 w-28">STATUS</th>
                      <th className="p-4 w-28 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                    {paginatedPackages.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-12 text-center text-[var(--app-text-muted)] font-semibold">
                          Tidak ada paket non aktif ditemukan
                        </td>
                      </tr>
                    ) : (
                      paginatedPackages.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-[var(--app-surface-2)] transition-colors">
                          <td className="p-4 text-[var(--app-text-muted)] font-mono">{(page - 1) * limit + idx + 1}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="font-bold text-[var(--app-text)] block">{p.name}</span>
                              <span
                                className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${p.tagColor}`}
                              >
                                {p.tag}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-[var(--app-text-muted)] font-medium">{p.type}</td>
                          <td className="p-4 font-mono font-semibold text-[var(--app-text)]">{p.speed}</td>
                          <td className="p-4 font-mono font-bold text-[var(--app-text)]">
                            {formatCurrency(p.price)}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-[var(--app-text)] block">{p.reason}</span>
                            <span className="text-[10px] text-[var(--app-text-muted)] block mt-0.5">
                              {p.reasonDetail}
                            </span>
                          </td>
                          <td className="p-4 text-[var(--app-text-muted)] font-mono text-[11px]">{p.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                p.status === 'expired'
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                  : p.status === 'stopped'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                  : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              }`}
                            >
                              {p.status === 'expired'
                                ? 'Kadaluarsa'
                                : p.status === 'stopped'
                                ? 'Dihentikan'
                                : 'Arsip'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  toast.info(`${p.name} (${p.speed}) - ${p.reasonDetail}`)
                                }
                                className="p-1.5 hover:bg-[var(--app-bg)] rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                                title="Detail"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReactivate(p)}
                                className="p-1.5 hover:bg-blue-500/10 rounded-lg text-blue-500"
                                title="Aktifkan Kembali"
                              >
                                <RefreshCw size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p)}
                                className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500"
                                title="Hapus Permanen"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-bg)]">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={filteredPackages.length}
                  pageSize={limit}
                  onPageChange={setPage}
                  onPageSizeChange={(newLimit: number) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">
                Informasi Arsip Paket
              </h3>
              <div className="space-y-3 text-xs text-[var(--app-text-muted)]">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Paket non-aktif tetap tercatat pada histori faktur lama demi integritas audit.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg mt-0.5">
                    <Plus size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Klik ikon Refresh pada baris tabel untuk mengaktifkan kembali paket ke katalog penjualan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
