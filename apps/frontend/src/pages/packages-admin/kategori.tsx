import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Check,
  X,
  Info,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
  packageCount: number;
  status: string;
}

export default function KategoriPackagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Internet',
      badgeColor: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20',
      description: 'Paket layanan internet fiber optik untuk kebutuhan rumah tangga dan SOHO',
      packageCount: 24,
      status: 'active',
    },
    {
      id: '2',
      name: 'Combo',
      badgeColor: 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20',
      description: 'Paket kombinasi internet FTTH dan IPTV / layanan hiburan tambahan',
      packageCount: 2,
      status: 'active',
    },
    {
      id: '3',
      name: 'Corporate',
      badgeColor: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20',
      description: 'Paket dedicated simetris 1:1 SLA 99.8% untuk korporasi dan instansi',
      packageCount: 2,
      status: 'active',
    },
    {
      id: '4',
      name: 'Non Aktif',
      badgeColor: 'bg-slate-500/10 text-[var(--app-text-muted)] border border-[var(--app-border)]',
      description: 'Kategori tidak aktif / arsip paket lama',
      packageCount: 0,
      status: 'inactive',
    },
  ]);

  const handleResetFilters = () => {
    setSearch('');
    toast.info('Filter pencarian kategori direset.');
  };

  const formatPercent = (count: number, total: number) => {
    if (total === 0) return '0%';
    return `${((count / total) * 100).toFixed(1)}%`;
  };

  const totalPackages = categories.reduce((sum, item) => sum + item.packageCount, 0);
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === 'active').length;
  const inactiveCategories = categories.filter((c) => c.status === 'inactive').length;

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / limit));
  const paginatedCategories = filteredCategories.slice((page - 1) * limit, page * limit);

  const handleToggleCategoryStatus = (cat: Category) => {
    const nextStatus = cat.status === 'active' ? 'inactive' : 'active';
    setCategories((prev) =>
      prev.map((item) => (item.id === cat.id ? { ...item, status: nextStatus } : item))
    );
    toast.warning(
      `Status kategori "${cat.name}" diubah menjadi ${nextStatus === 'active' ? 'Aktif' : 'Non Aktif'}.`
    );
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
              <span className="text-[var(--app-primary)]">Kategori Paket</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Kategori Layanan &amp; Pengelompokan Paket
            </h1>
            <p className="text-xs text-[var(--app-text-muted)]">
              Segmentasi paket internet (Home Broadband, Bisnis Dedicated, SOHO, dan Voucher Hotspot).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/packages-admin"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-surface-2)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kembali ke Katalog
            </Link>
            <button
              type="button"
              onClick={() =>
                toast.info('Gunakan halaman Katalog Paket utama untuk membuat kategori baru.')
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Plus size={15} />
              <span>Tambah Kategori</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <FolderOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Total Kategori
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {totalCategories}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Semua kategori paket</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
              <Check size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Aktif
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {activeCategories}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Kategori aktif</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
              <X size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Non Aktif
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {inactiveCategories}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Kategori arsip</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <FolderOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">
                Total Package
              </p>
              <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-0.5">
                {totalPackages}
              </p>
              <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Menggunakan kategori</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Cari kategori package..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[var(--app-text-muted)] hover:text-[var(--app-text)] px-4 py-2.5 rounded-xl border border-transparent hover:border-[var(--app-border)] transition-all ml-auto"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => toast.success(`Filter diterapkan: ${filteredCategories.length} kategori ditampilkan.`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Main Two-Column Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Categories list */}
          <div className="lg:col-span-9 space-y-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 w-16">NO</th>
                      <th className="p-4 w-52">NAMA KATEGORI</th>
                      <th className="p-4">DESKRIPSI</th>
                      <th className="p-4 w-36 text-center">JUMLAH PACKAGE</th>
                      <th className="p-4 w-32">STATUS</th>
                      <th className="p-4 w-32 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                    {paginatedCategories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-[var(--app-text-muted)] font-semibold">
                          Tidak ada kategori package ditemukan
                        </td>
                      </tr>
                    ) : (
                      paginatedCategories.map((cat, idx) => (
                        <tr key={cat.id} className="hover:bg-[var(--app-surface-2)] transition-colors">
                          <td className="p-4 text-[var(--app-text-muted)] font-mono font-medium">{(page - 1) * limit + idx + 1}</td>
                          <td className="p-4">
                            <div className="space-y-1.5">
                              <span className="font-bold text-[var(--app-text)] block">{cat.name}</span>
                              <span
                                className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${cat.badgeColor}`}
                              >
                                {cat.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-[var(--app-text-muted)] leading-relaxed max-w-sm">
                            {cat.description}
                          </td>
                          <td className="p-4 text-center font-bold font-mono text-[var(--app-text)] text-sm">
                            {cat.packageCount}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                cat.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-slate-500/10 text-[var(--app-text-muted)] border border-[var(--app-border)]'
                              }`}
                            >
                              {cat.status === 'active' ? 'Aktif' : 'Non Aktif'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  toast.info(`Kategori ${cat.name}: ${cat.packageCount} paket terdaftar.`)
                                }
                                className="p-1.5 hover:bg-[var(--app-bg)] rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => router.push('/packages-admin')}
                                className="p-1.5 hover:bg-[var(--app-bg)] rounded-lg text-blue-500 hover:text-blue-400 transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryStatus(cat)}
                                className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500 hover:text-rose-400 transition-colors"
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
                  totalItems={filteredCategories.length}
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

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">
                Distribusi Package per Kategori
              </h3>

              <div className="relative flex justify-center py-2">
                <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="4.5" />
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="4.5"
                    strokeDasharray={`${(24 / 28) * 100} ${100 - (24 / 28) * 100}`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth="4.5"
                    strokeDasharray={`${(2 / 28) * 100} ${100 - (2 / 28) * 100}`}
                    strokeDashoffset={`${100 - (24 / 28) * 100}`}
                  />
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#f97316"
                    strokeWidth="4.5"
                    strokeDasharray={`${(2 / 28) * 100} ${100 - (2 / 28) * 100}`}
                    strokeDashoffset={`${100 - (26 / 28) * 100}`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-black font-mono text-[var(--app-text)]">{totalPackages}</p>
                  <p className="text-[9px] text-[var(--app-text-muted)] font-bold uppercase">Total</p>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" />
                    <span>Internet</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">
                    24 ({formatPercent(24, totalPackages)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" />
                    <span>Combo</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">
                    2 ({formatPercent(2, totalPackages)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" />
                    <span>Corporate</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--app-text)]">
                    2 ({formatPercent(2, totalPackages)})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)]">
                Informasi
              </h3>
              <div className="space-y-3 text-xs text-[var(--app-text-muted)]">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg mt-0.5">
                    <Info size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Kategori digunakan untuk mengelompokkan profil bandwidth dan penagihan.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg mt-0.5">
                    <Clock size={12} />
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Perubahan kategori otomatis disinkronkan ke katalog paket pelanggan.
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
