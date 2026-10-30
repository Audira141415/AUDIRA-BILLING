import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/Pagination';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Gift, 
  Check, 
  X, 
  Copy,
  Tag,
  Percent
} from 'lucide-react';

interface Promo {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  code: string;
  packageName: string;
  discount: string;
  period: string;
  dateRange: string;
  status: 'active' | 'upcoming' | 'ended';
  used: string;
}

export default function PromoPackagePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPromoDetail, setSelectedPromoDetail] = useState<Promo | null>(null);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<Promo | null>(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    tag: 'Spesial',
    packageName: 'Home 50 Mbps',
    discountType: 'percent',
    discountValue: '20',
    nominalValue: '50000',
    period: 'Bulanan',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    maxQuota: '100',
    status: 'active' as 'active' | 'upcoming' | 'ended'
  });
  
  // Local state initialized with carrier-grade promos
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: '1',
      name: 'Promo Merdeka 2026',
      tag: 'Spesial',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
      code: 'MERDEKA26',
      packageName: 'Home 50 Mbps',
      discount: '20% (Rp 100.000)',
      period: 'Bulanan',
      dateRange: '01/06/2026 - 31/08/2026',
      status: 'active',
      used: '45 / 100'
    },
    {
      id: '2',
      name: 'Lebaran Sale 2026',
      tag: 'Musiman',
      tagColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      code: 'LEBARAN26',
      packageName: 'Home 20 Mbps',
      discount: '15% (Rp 50.000)',
      period: 'Bulanan',
      dateRange: '15/04/2026 - 15/05/2026',
      status: 'ended',
      used: '120 / 120'
    },
    {
      id: '3',
      name: 'Tahun Baru 2026',
      tag: 'Spesial',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
      code: 'TAHUNBARU26',
      packageName: 'Home 100 Mbps',
      discount: '25% (Rp 200.000)',
      period: 'Bulanan',
      dateRange: '01/01/2026 - 31/01/2026',
      status: 'active',
      used: '32 / 200'
    },
    {
      id: '4',
      name: 'Promo Weekend',
      tag: 'Reguler',
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      code: 'WEEKEND26',
      packageName: 'Semua Package',
      discount: '10% (Rp 25.000)',
      period: 'Bulanan',
      dateRange: 'Setiap Sabtu - Minggu',
      status: 'active',
      used: '210 / 500'
    },
    {
      id: '5',
      name: 'Back to School',
      tag: 'Edukasi',
      tagColor: 'bg-green-500/10 text-green-400 border border-green-500/20',
      code: 'SCHOOL26',
      packageName: 'Home 20 Mbps',
      discount: '20% (Rp 75.000)',
      period: 'Bulanan',
      dateRange: '01/07/2026 - 31/07/2026',
      status: 'upcoming',
      used: '0 / 150'
    },
    {
      id: '6',
      name: 'Ramadan Berkah',
      tag: 'Musiman',
      tagColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      code: 'RAMADAN26',
      packageName: 'Home 50 Mbps',
      discount: '30% (Rp 150.000)',
      period: 'Bulanan',
      dateRange: '01/03/2026 - 30/03/2026',
      status: 'ended',
      used: '300 / 300'
    },
    {
      id: '7',
      name: 'Gratis Instalasi',
      tag: 'Reguler',
      tagColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      code: 'GRATISINSTAL',
      packageName: 'Semua Package',
      discount: 'Gratis Instalasi',
      period: 'Sekali Bayar',
      dateRange: '01/01/2026 - 31/12/2026',
      status: 'active',
      used: '85 / 1000'
    },
    {
      id: '8',
      name: 'Diskon Setengah Tahun',
      tag: 'Spesial',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
      code: '6BULAN26',
      packageName: 'Home 100 Mbps',
      discount: '10% (Rp 150.000)',
      period: '6 Bulan',
      dateRange: '01/06/2026 - 30/11/2026',
      status: 'active',
      used: '18 / 100'
    }
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(1);
  };

  const totalPromo = promos.length;
  const activePromo = promos.filter(p => p.status === 'active').length;
  const upcomingPromo = promos.filter(p => p.status === 'upcoming').length;
  const totalDiscountValue = 24750000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter local logic
  const filteredPromos = useMemo(() => {
    return promos.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.code.toLowerCase().includes(search.toLowerCase()) ||
                            p.packageName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [promos, search, statusFilter]);

  const paginatedPromos = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPromos.slice(start, start + limit);
  }, [filteredPromos, page, limit]);

  // Handle Save New Promo
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.warning('Nama promo dan kode promo wajib diisi.', 'Validasi Form');
      return;
    }

    const tagColorMap: Record<string, string> = {
      'Spesial': 'bg-red-500/10 text-red-400 border border-red-500/20',
      'Musiman': 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      'Reguler': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      'Edukasi': 'bg-green-500/10 text-green-400 border border-green-500/20'
    };

    const discountText = formData.discountType === 'percent'
      ? `${formData.discountValue}%`
      : formatCurrency(Number(formData.nominalValue) || 0);

    const newPromo: Promo = {
      id: Date.now().toString(),
      name: formData.name,
      tag: formData.tag,
      tagColor: tagColorMap[formData.tag] || tagColorMap['Spesial'],
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      packageName: formData.packageName,
      discount: discountText,
      period: formData.period,
      dateRange: `${formData.startDate} - ${formData.endDate}`,
      status: formData.status,
      used: `0 / ${formData.maxQuota || '100'}`
    };

    setPromos(prev => [newPromo, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Promo ${newPromo.name} (${newPromo.code}) berhasil ditambahkan ke katalog.`, 'Promo Baru');
    // Reset form
    setFormData({
      name: '',
      code: '',
      tag: 'Spesial',
      packageName: 'Home 50 Mbps',
      discountType: 'percent',
      discountValue: '20',
      nominalValue: '50000',
      period: 'Bulanan',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      maxQuota: '100',
      status: 'active'
    });
  };

  // Handle Edit Promo
  const handleOpenEdit = (p: Promo) => {
    setEditingPromo(p);
    setFormData({
      name: p.name,
      code: p.code,
      tag: p.tag,
      packageName: p.packageName,
      discountType: p.discount.includes('%') ? 'percent' : 'nominal',
      discountValue: p.discount.replace(/[^0-9]/g, '') || '20',
      nominalValue: '50000',
      period: p.period,
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      maxQuota: p.used.split('/')[1]?.trim() || '100',
      status: p.status
    });
  };

  const handleUpdatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    const discountText = formData.discountType === 'percent'
      ? `${formData.discountValue}%`
      : formatCurrency(Number(formData.nominalValue) || 0);

    setPromos(prev => prev.map(item => {
      if (item.id === editingPromo.id) {
        return {
          ...item,
          name: formData.name,
          code: formData.code.toUpperCase(),
          packageName: formData.packageName,
          tag: formData.tag,
          discount: discountText,
          status: formData.status
        };
      }
      return item;
    }));

    toast.success(`Perubahan promo ${formData.name} berhasil disimpan.`, 'Promo Diperbarui');
    setEditingPromo(null);
  };

  // Handle Delete Promo
  const handleDeletePromo = () => {
    if (!deletingPromo) return;
    setPromos(prev => prev.filter(p => p.id !== deletingPromo.id));
    toast.success(`Promo ${deletingPromo.name} (${deletingPromo.code}) telah dihapus dari sistem.`, 'Promo Dihapus');
    setDeletingPromo(null);
  };

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kode promo ${code} berhasil disalin ke clipboard!`, 'Disalin');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Top Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/packages-admin" className="hover:text-[var(--app-text)]">Paket & Layanan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Promo & Diskon</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Manajemen Promo, Kupon & Potongan Harga
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengaturan kode promo registrasi pelanggan baru dan diskon musiman tagihan internet.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/packages-admin"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>

        {/* Action Header Button */}
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Promo</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Tag size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Total Promo</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono">{totalPromo}</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Kupon</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Check size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Promo Aktif</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono text-emerald-400">{activePromo}</span>
                <span className="text-[10px] text-emerald-500/80 font-semibold">Tersedia</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Akan Datang</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono text-amber-400">{upcomingPromo}</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Musiman</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Percent size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Total Diskon Diberikan</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-black font-mono text-purple-400">{formatCurrency(totalDiscountValue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Cari promo, kode voucher, atau nama paket..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="upcoming">Akan Datang</option>
                <option value="ended">Berakhir</option>
              </select>

              {(search || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-2)] text-xs text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4 w-12 font-mono">NO</th>
                  <th className="p-4">NAMA PROMO</th>
                  <th className="p-4">KODE VOUCHER</th>
                  <th className="p-4">BERLAKU UNTUK</th>
                  <th className="p-4">NILAI DISKON</th>
                  <th className="p-4">PERIODE</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">TERPAKAI</th>
                  <th className="p-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                {paginatedPromos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-[var(--app-text-muted)] font-medium">
                      Tidak ada kupon atau promo yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedPromos.map((p, idx) => {
                    return (
                      <tr key={p.id} className="hover:bg-[var(--app-surface-2)] transition-colors">
                        <td className="p-4 text-[var(--app-text-muted)] font-mono">{(page - 1) * limit + idx + 1}</td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="font-bold text-[var(--app-text)] block">{p.name}</span>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${p.tagColor}`}>
                              {p.tag}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(p.code)}
                            title="Klik untuk salin kode"
                            className="flex items-center gap-1.5 font-mono font-semibold px-2 py-1 rounded bg-[var(--app-surface-2)] hover:bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] transition-colors cursor-pointer group"
                          >
                            <span>{p.code}</span>
                            <Copy size={11} className="text-[var(--app-text-muted)] group-hover:text-blue-500" />
                          </button>
                        </td>
                        <td className="p-4 text-[var(--app-text-muted)] font-medium">{p.packageName}</td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-[var(--app-text)] block">{p.discount}</span>
                        </td>
                        <td className="p-4 text-[var(--app-text-muted)] font-mono text-[11px]">{p.dateRange}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            p.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : p.status === 'upcoming'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-slate-500/10 text-[var(--app-text-muted)] border-slate-500/20'
                          }`}>
                            {p.status === 'active' ? 'Aktif' : p.status === 'upcoming' ? 'Akan Datang' : 'Berakhir'}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-[var(--app-text)]">{p.used}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              type="button"
                              onClick={() => setSelectedPromoDetail(p)}
                              title="Lihat Detail"
                              className="p-1.5 hover:bg-[var(--app-surface)] rounded-lg text-[var(--app-text-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              title="Edit Promo"
                              className="p-1.5 hover:bg-blue-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => setDeletingPromo(p)}
                              title="Hapus Promo"
                              className="p-1.5 hover:bg-rose-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination */}
          <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-surface-2)]">
            <Pagination
              currentPage={page}
              totalItems={filteredPromos.length}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          </div>
        </div>

        {/* Modal: Tambah Promo Baru */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Plus size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Tambah Promo & Diskon Baru</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreatePromo} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama Promo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Promo Akhir Tahun 2026"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Kode Kupon *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: MERDEKA26"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Kategori Tag</label>
                    <select
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Spesial">Spesial</option>
                      <option value="Musiman">Musiman</option>
                      <option value="Reguler">Reguler</option>
                      <option value="Edukasi">Edukasi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Paket Berlaku</label>
                    <select
                      value={formData.packageName}
                      onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Semua Package">Semua Paket</option>
                      <option value="Home 20 Mbps">Home 20 Mbps</option>
                      <option value="Home 50 Mbps">Home 50 Mbps</option>
                      <option value="Home 100 Mbps">Home 100 Mbps</option>
                      <option value="Bisnis 100 Mbps">Bisnis 100 Mbps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Maksimal Kuota Klaim</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={formData.maxQuota}
                      onChange={(e) => setFormData({ ...formData, maxQuota: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Tipe Diskon</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="percent">Persentase (%)</option>
                      <option value="nominal">Nominal Tunai (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">
                      {formData.discountType === 'percent' ? 'Besaran Diskon (%)' : 'Potongan Tunai (Rp)'}
                    </label>
                    <input
                      type="number"
                      placeholder={formData.discountType === 'percent' ? '20' : '50000'}
                      value={formData.discountType === 'percent' ? formData.discountValue : formData.nominalValue}
                      onChange={(e) => {
                        if (formData.discountType === 'percent') {
                          setFormData({ ...formData, discountValue: e.target.value });
                        } else {
                          setFormData({ ...formData, nominalValue: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Mulai Berlaku</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Selesai Berlaku</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Simpan Promo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Detail Promo */}
        {selectedPromoDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Gift size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Kupon Promo</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPromoDetail(null)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--app-surface-2)] border border-[var(--app-border)] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase tracking-wider">Kode Kupon</p>
                    <p className="text-base font-mono font-black text-blue-500 mt-0.5">{selectedPromoDetail.code}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedPromoDetail.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Salin</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Nama Promo</span>
                    <p className="font-semibold text-[var(--app-text)] mt-0.5">{selectedPromoDetail.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Tag Kategori</span>
                    <p className="font-semibold text-[var(--app-text)] mt-0.5">{selectedPromoDetail.tag}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Nilai Diskon</span>
                    <p className="font-mono font-bold text-emerald-400 mt-0.5">{selectedPromoDetail.discount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Paket Berlaku</span>
                    <p className="font-semibold text-[var(--app-text)] mt-0.5">{selectedPromoDetail.packageName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Masa Berlaku</span>
                    <p className="font-mono text-[11px] text-[var(--app-text)] mt-0.5">{selectedPromoDetail.dateRange}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Penggunaan Kuota</span>
                    <p className="font-mono font-bold text-[var(--app-text)] mt-0.5">{selectedPromoDetail.used}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setSelectedPromoDetail(null)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Promo */}
        {editingPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Edit size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Edit Promo & Diskon</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPromo(null)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdatePromo} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama Promo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Kode Kupon *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Status Kupon</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'upcoming' | 'ended' })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="active">Aktif</option>
                      <option value="upcoming">Akan Datang</option>
                      <option value="ended">Berakhir</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Paket Berlaku</label>
                    <select
                      value={formData.packageName}
                      onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Semua Package">Semua Paket</option>
                      <option value="Home 20 Mbps">Home 20 Mbps</option>
                      <option value="Home 50 Mbps">Home 50 Mbps</option>
                      <option value="Home 100 Mbps">Home 100 Mbps</option>
                      <option value="Bisnis 100 Mbps">Bisnis 100 Mbps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Tag Kategori</label>
                    <select
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Spesial">Spesial</option>
                      <option value="Musiman">Musiman</option>
                      <option value="Reguler">Reguler</option>
                      <option value="Edukasi">Edukasi</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setEditingPromo(null)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Konfirmasi Hapus Promo */}
        {deletingPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Hapus Kupon Promo?</h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5 font-mono">{deletingPromo.name} ({deletingPromo.code})</p>
                </div>
              </div>

              <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                Tindakan ini akan menonaktifkan kode promo dan menghapusnya dari katalog. Pelanggan tidak akan dapat menggunakan kupon ini lagi.
              </p>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPromo(null)}
                  className="px-3.5 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-xs text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeletePromo}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Hapus Promo
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
