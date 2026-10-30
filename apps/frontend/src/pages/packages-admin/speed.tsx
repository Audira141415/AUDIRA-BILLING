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
  Gauge, 
  Zap, 
  Sliders, 
  Layers, 
  Copy, 
  X, 
  Check, 
  Activity, 
  Terminal
} from 'lucide-react';

interface SpeedProfile {
  id: string;
  name: string;
  download: string;
  upload: string;
  type: string;
  status: 'active' | 'inactive';
  usedCount: number;
}

export default function SpeedProfilePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProfileDetail, setSelectedProfileDetail] = useState<SpeedProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<SpeedProfile | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<SpeedProfile | null>(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    download: '50 Mbps',
    upload: '25 Mbps',
    type: 'Simetris',
    priority: 4,
    queueType: 'pcq-upload-default',
    status: 'active' as 'active' | 'inactive'
  });

  // Local state initialized with carrier-grade speed profiles
  const [profiles, setProfiles] = useState<SpeedProfile[]>([
    { id: '1', name: '1 Mbps', download: '1 Mbps', upload: '512 Kbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '2', name: '2 Mbps', download: '2 Mbps', upload: '1 Mbps', type: 'Simetris', status: 'active', usedCount: 3 },
    { id: '3', name: '5 Mbps', download: '5 Mbps', upload: '2 Mbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '4', name: '10 Mbps', download: '10 Mbps', upload: '5 Mbps', type: 'Simetris', status: 'active', usedCount: 4 },
    { id: '5', name: '20 Mbps', download: '20 Mbps', upload: '10 Mbps', type: 'Simetris', status: 'active', usedCount: 3 },
    { id: '6', name: '50 Mbps', download: '50 Mbps', upload: '25 Mbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '7', name: '100 Mbps', download: '100 Mbps', upload: '50 Mbps', type: 'Simetris', status: 'active', usedCount: 2 },
    { id: '8', name: '200 Mbps', download: '200 Mbps', upload: '100 Mbps', type: 'Simetris', status: 'active', usedCount: 1 },
    { id: '9', name: '10 Mbps (Down) / 2 Mbps (Up)', download: '10 Mbps', upload: '2 Mbps', type: 'Asimetris', status: 'active', usedCount: 2 },
    { id: '10', name: '20 Mbps (Down) / 5 Mbps (Up)', download: '20 Mbps', upload: '5 Mbps', type: 'Asimetris', status: 'active', usedCount: 2 }
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPage(1);
  };

  const totalProfiles = profiles.length;
  const activeProfiles = profiles.filter(p => p.status === 'active').length;
  const inactiveProfiles = profiles.filter(p => p.status !== 'active').length;
  const usedProfiles = profiles.filter(p => p.usedCount > 0).length;

  // Filter local logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter(prof => {
      const matchesSearch = prof.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;
      const matchesType = typeFilter === 'all' || prof.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [profiles, search, statusFilter, typeFilter]);

  const paginatedProfiles = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProfiles.slice(start, start + limit);
  }, [filteredProfiles, page, limit]);

  // Handle Create Profile
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Nama speed profile wajib diisi.', 'Validasi Form');
      return;
    }

    const newProfile: SpeedProfile = {
      id: Date.now().toString(),
      name: formData.name,
      download: formData.download,
      upload: formData.upload,
      type: formData.type,
      status: formData.status,
      usedCount: 0
    };

    setProfiles(prev => [newProfile, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Speed Profile ${newProfile.name} berhasil dibuat dan disinkronkan ke Queue.`, 'Profile Dibuat');
    setFormData({
      name: '',
      download: '50 Mbps',
      upload: '25 Mbps',
      type: 'Simetris',
      priority: 4,
      queueType: 'pcq-upload-default',
      status: 'active'
    });
  };

  // Handle Edit Profile
  const handleOpenEdit = (prof: SpeedProfile) => {
    setEditingProfile(prof);
    setFormData({
      name: prof.name,
      download: prof.download,
      upload: prof.upload,
      type: prof.type,
      priority: 4,
      queueType: 'pcq-upload-default',
      status: prof.status
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    setProfiles(prev => prev.map(item => {
      if (item.id === editingProfile.id) {
        return {
          ...item,
          name: formData.name,
          download: formData.download,
          upload: formData.upload,
          type: formData.type,
          status: formData.status
        };
      }
      return item;
    }));

    toast.success(`Perubahan Speed Profile ${formData.name} berhasil disimpan.`, 'Profile Diperbarui');
    setEditingProfile(null);
  };

  // Handle Delete Profile
  const handleDeleteProfile = () => {
    if (!deletingProfile) return;
    setProfiles(prev => prev.filter(p => p.id !== deletingProfile.id));
    toast.success(`Speed Profile ${deletingProfile.name} telah dihapus dari sistem.`, 'Profile Dihapus');
    setDeletingProfile(null);
  };

  // Generate MikroTik Command
  const generateMikrotikCommand = (prof: SpeedProfile) => {
    const cleanUp = prof.upload.replace(/\s+/g, '').replace('Mbps', 'M').replace('Kbps', 'k');
    const cleanDown = prof.download.replace(/\s+/g, '').replace('Mbps', 'M').replace('Kbps', 'k');
    return `/queue simple add name="${prof.name}" max-limit=${cleanUp}/${cleanDown} priority=4/4 queue=default-small/default-small comment="AUDIRA-SPEED-${prof.id}"`;
  };

  const handleCopyMikrotik = (prof: SpeedProfile) => {
    const cmd = generateMikrotikCommand(prof);
    navigator.clipboard.writeText(cmd);
    toast.success('Script MikroTik Queue Simple berhasil disalin ke clipboard!', 'Script Disalin');
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
              <span className="text-blue-500 font-semibold">Speed Profile</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Speed Profile & Rate Limiting Mikrotik
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengaturan batasan kecepatan upload / download, rasio CIR/MIR, dan burst rate queue.
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
            <span>Tambah Speed Profile</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Gauge size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Total Profile</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono">{totalProfiles}</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Profile</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Check size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Profile Aktif</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono text-emerald-400">{activeProfiles}</span>
                <span className="text-[10px] text-emerald-500/80 font-semibold">Tersinkron</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Digunakan Paket</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono text-purple-400">{usedProfiles}</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Terkait</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Sliders size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-muted)]">Non Aktif / Standby</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono text-amber-400">{inactiveProfiles}</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-medium">Draft</span>
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
                placeholder="Cari profil kecepatan atau besaran bandwidth..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Semua Tipe Rasio</option>
                <option value="Simetris">Simetris (1:1)</option>
                <option value="Asimetris">Asimetris</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Non Aktif</option>
              </select>

              {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
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
                  <th className="p-4">NAMA PROFILE</th>
                  <th className="p-4">DOWNLOAD</th>
                  <th className="p-4">UPLOAD</th>
                  <th className="p-4">TIPE RASIO</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">TERKAIT PAKET</th>
                  <th className="p-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                {paginatedProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-[var(--app-text-muted)] font-medium">
                      Tidak ada speed profile yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  paginatedProfiles.map((prof, idx) => {
                    return (
                      <tr key={prof.id} className="hover:bg-[var(--app-surface-2)] transition-colors">
                        <td className="p-4 text-[var(--app-text-muted)] font-mono">{(page - 1) * limit + idx + 1}</td>
                        <td className="p-4">
                          <span className="font-bold text-[var(--app-text)] block font-mono">{prof.name}</span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-emerald-400">{prof.download}</td>
                        <td className="p-4 font-mono font-semibold text-blue-400">{prof.upload}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            prof.type === 'Simetris' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {prof.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            prof.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-slate-500/10 text-[var(--app-text-muted)] border-slate-500/20'
                          }`}>
                            {prof.status === 'active' ? 'Aktif' : 'Non Aktif'}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-[var(--app-text)]">{prof.usedCount} Paket</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              type="button"
                              onClick={() => setSelectedProfileDetail(prof)}
                              title="Lihat Parameter & Script MikroTik"
                              className="p-1.5 hover:bg-[var(--app-surface)] rounded-lg text-[var(--app-text-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleOpenEdit(prof)}
                              title="Edit Speed Profile"
                              className="p-1.5 hover:bg-blue-500/10 rounded-lg text-[var(--app-text-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => setDeletingProfile(prof)}
                              title="Hapus Profile"
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
              totalItems={filteredProfiles.length}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          </div>
        </div>

        {/* Modal: Tambah Speed Profile Baru */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Plus size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Tambah Speed Profile MikroTik</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateProfile} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama Profile *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 30 Mbps Simetris"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Download Rate *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 30 Mbps"
                      value={formData.download}
                      onChange={(e) => setFormData({ ...formData, download: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Upload Rate *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 30 Mbps"
                      value={formData.upload}
                      onChange={(e) => setFormData({ ...formData, upload: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Tipe Rasio</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Simetris">Simetris (1:1)</option>
                      <option value="Asimetris">Asimetris (1:2 atau 1:4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Priority (Queue Tree)</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value={1}>1 (Tertinggi - Korporat / VIP)</option>
                      <option value={4}>4 (Standar Home)</option>
                      <option value={8}>8 (Terendah - Hotspot Publik)</option>
                    </select>
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
                    Simpan Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Detail Profile & MikroTik Script */}
        {selectedProfileDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Terminal size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Profile & Script MikroTik</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfileDetail(null)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-xl">
                    <span className="text-[10px] text-[var(--app-text-muted)] uppercase font-semibold">Max Download</span>
                    <p className="text-base font-mono font-bold text-emerald-400 mt-0.5">{selectedProfileDetail.download}</p>
                  </div>
                  <div className="p-3 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-xl">
                    <span className="text-[10px] text-[var(--app-text-muted)] uppercase font-semibold">Max Upload</span>
                    <p className="text-base font-mono font-bold text-blue-400 mt-0.5">{selectedProfileDetail.upload}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase">Command MikroTik CLI (Queue Simple)</span>
                    <button
                      type="button"
                      onClick={() => handleCopyMikrotik(selectedProfileDetail)}
                      className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-400 font-semibold cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Salin Command</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-950 border border-[var(--app-border)] rounded-xl text-[11px] font-mono text-emerald-400 whitespace-pre-wrap overflow-x-auto select-all">
                    {generateMikrotikCommand(selectedProfileDetail)}
                  </pre>
                </div>

                <div className="flex justify-end pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setSelectedProfileDetail(null)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Speed Profile */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Edit size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Edit Speed Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="p-1.5 text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama Profile *</label>
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
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Download Rate</label>
                    <input
                      type="text"
                      required
                      value={formData.download}
                      onChange={(e) => setFormData({ ...formData, download: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Upload Rate</label>
                    <input
                      type="text"
                      required
                      value={formData.upload}
                      onChange={(e) => setFormData({ ...formData, upload: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Tipe Rasio</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Simetris">Simetris (1:1)</option>
                      <option value="Asimetris">Asimetris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Non Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(null)}
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

        {/* Modal: Konfirmasi Hapus Speed Profile */}
        {deletingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Hapus Speed Profile?</h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5 font-mono">{deletingProfile.name}</p>
                </div>
              </div>

              {deletingProfile.usedCount > 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 space-y-1">
                  <p className="font-semibold">Peringatan: Profile Sedang Digunakan</p>
                  <p className="text-[11px] text-amber-200/80">
                    Profile ini sedang aktif digunakan oleh {deletingProfile.usedCount} paket internet. Pastikan untuk mengalihkan profil paket sebelum menghapusnya.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">
                  Tindakan ini akan menghapus speed profile dari daftar konfigurasi.
                </p>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProfile(null)}
                  className="px-3.5 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-xs text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Hapus Profile
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
