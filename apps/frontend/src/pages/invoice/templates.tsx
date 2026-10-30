import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext';
import { Pagination } from '@/components/Pagination';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  Upload,
  Plus,
  CheckCircle,
  XCircle,
  Copy,
  Settings,
  X,
  Printer,
  QrCode,
  Layout as LayoutIcon
} from 'lucide-react';

interface TemplateRow {
  id: string;
  name: string;
  category: string;
  categoryType: 'corporate' | 'premium' | 'modern' | 'minimalis' | 'classic' | 'startup';
  createdBy: string;
  isSystem: boolean;
  paperSize: string;
  headerNote: string;
  footerNote: string;
  createdAt: string;
  updatedAt: string;
  status: 'Aktif' | 'Non Aktif';
}

const initialTemplates: TemplateRow[] = [
  {
    id: '1',
    name: 'Corporate Standard',
    category: 'Corporate',
    categoryType: 'corporate',
    createdBy: 'System',
    isSystem: true,
    paperSize: 'A4',
    headerNote: 'AUDIRA MULTIMEDIA DIGITAL - Layanan Internet Fiber Optic Berlisensi Kominfo',
    footerNote: 'Pembayaran wajib dilakukan sebelum tanggal 20 setiap bulannya.',
    createdAt: '01/01/2026 10:00',
    updatedAt: '25/06/2026 14:30',
    status: 'Aktif'
  },
  {
    id: '2',
    name: 'Minimalis Clean',
    category: 'Premium',
    categoryType: 'premium',
    createdBy: 'Andi Pratama',
    isSystem: false,
    paperSize: 'A4',
    headerNote: 'AUDIRA NET - Dedicated Internet Solution',
    footerNote: 'Terima kasih atas kepercayaan Anda menggunakan layanan AUDIRA.',
    createdAt: '05/01/2026 11:20',
    updatedAt: '28/06/2026 09:15',
    status: 'Aktif'
  },
  {
    id: '3',
    name: 'Modern Blue',
    category: 'Modern',
    categoryType: 'modern',
    createdBy: 'Rina Marlina',
    isSystem: false,
    paperSize: 'A4',
    headerNote: 'AUDIRA TELEKOMUNIKASI - Solusi Jaringan Tanpa Batas',
    footerNote: 'Scan QRIS di bawah untuk pembayaran otomatis bebas biaya admin.',
    createdAt: '10/01/2026 09:45',
    updatedAt: '27/06/2026 16:40',
    status: 'Aktif'
  },
  {
    id: '4',
    name: 'Simple Black & White',
    category: 'Minimalis',
    categoryType: 'minimalis',
    createdBy: 'Dewi Lestari',
    isSystem: false,
    paperSize: 'Letter',
    headerNote: 'AUDIRA NET BILLING - Lembar Tagihan Pelanggan',
    footerNote: 'Simpan kuitansi ini sebagai bukti pembayaran yang sah.',
    createdAt: '15/01/2026 14:10',
    updatedAt: '20/06/2026 10:30',
    status: 'Non Aktif'
  },
  {
    id: '5',
    name: 'Elegant Corporate',
    category: 'Corporate',
    categoryType: 'corporate',
    createdBy: 'Agus Dwi Rianto',
    isSystem: false,
    paperSize: 'A4',
    headerNote: 'AUDIRA SUKSES MANDIRI - Enterprise Grade Bandwidth',
    footerNote: 'Faktur ini digenerate secara elektronik dan sah tanpa tanda tangan basah.',
    createdAt: '20/01/2026 08:30',
    updatedAt: '30/06/2026 13:20',
    status: 'Aktif'
  },
  {
    id: '6',
    name: 'Thermal POS 80mm',
    category: 'Startup',
    categoryType: 'startup',
    createdBy: 'Agus Dwi Rianto',
    isSystem: false,
    paperSize: '80mm POS Roll',
    headerNote: 'AUDIRA NET KASIR LAPANGAN',
    footerNote: 'Hotline WA CS: 0821-1200-1600. Terima kasih.',
    createdAt: '25/01/2026 13:50',
    updatedAt: '29/06/2026 17:10',
    status: 'Aktif'
  }
];

export default function TemplateInvoicePage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TemplateRow[]>(initialTemplates);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRow | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateRow | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: 'Corporate',
    paperSize: 'A4',
    headerNote: 'AUDIRA MULTIMEDIA DIGITAL - Layanan Internet Fiber Optic Berlisensi Kominfo',
    footerNote: 'Pembayaran wajib dilakukan sebelum tanggal 20 setiap bulannya.',
    status: 'Aktif' as 'Aktif' | 'Non Aktif'
  });

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === templates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(templates.map(d => d.id));
    }
  };

  const getCategoryClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'corporate': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'premium': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'modern': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'minimalis': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'classic': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'startup': return 'bg-blue-600/10 text-blue-500 border border-blue-600/20';
      default: return 'bg-slate-500/10 text-[var(--app-text-muted)] border border-slate-500/20';
    }
  };

  // Filtered
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'Semua' || t.category === categoryFilter;
      const matchStatus = statusFilter === 'Semua' || t.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [templates, searchTerm, categoryFilter, statusFilter]);

  const paginatedTemplates = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredTemplates.slice(start, start + limit);
  }, [filteredTemplates, page, limit]);

  // Create
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning('Nama template wajib diisi.', 'Validasi Form');
      return;
    }

    const newTemplate: TemplateRow = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      categoryType: (form.category.toLowerCase() as any) || 'modern',
      createdBy: 'Agus Dwi Rianto',
      isSystem: false,
      paperSize: form.paperSize,
      headerNote: form.headerNote,
      footerNote: form.footerNote,
      createdAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: form.status
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Template invoice "${newTemplate.name}" berhasil dibuat.`, 'Template Dibuat');
    setForm({
      name: '',
      category: 'Corporate',
      paperSize: 'A4',
      headerNote: 'AUDIRA MULTIMEDIA DIGITAL - Layanan Internet Fiber Optic Berlisensi Kominfo',
      footerNote: 'Pembayaran wajib dilakukan sebelum tanggal 20 setiap bulannya.',
      status: 'Aktif'
    });
  };

  // Open Edit
  const handleOpenEdit = (t: TemplateRow) => {
    setEditingTemplate(t);
    setForm({
      name: t.name,
      category: t.category,
      paperSize: t.paperSize,
      headerNote: t.headerNote,
      footerNote: t.footerNote,
      status: t.status
    });
  };

  const handleUpdateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setTemplates(prev => prev.map(item => {
      if (item.id === editingTemplate.id) {
        return {
          ...item,
          name: form.name,
          category: form.category,
          paperSize: form.paperSize,
          headerNote: form.headerNote,
          footerNote: form.footerNote,
          status: form.status,
          updatedAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return item;
    }));

    toast.success(`Template invoice "${form.name}" berhasil diperbarui.`, 'Template Diperbarui');
    setEditingTemplate(null);
  };

  // Delete
  const handleDeleteTemplate = (id: string, name: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success(`Template "${name}" telah dihapus.`, 'Template Dihapus');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Template', 'Kategori', 'Pembuat', 'Ukuran Kertas', 'Status', 'Dibuat', 'Diperbarui'];
    const rows = filteredTemplates.map(t => [
      `"${t.id}"`,
      `"${t.name}"`,
      `"${t.category}"`,
      `"${t.createdBy}"`,
      `"${t.paperSize}"`,
      `"${t.status}"`,
      `"${t.createdAt}"`,
      `"${t.updatedAt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `template_invoice_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Daftar template invoice berhasil diekspor ke format CSV.', 'Ekspor CSV');
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
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Template Cetak Invoice</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Kustomisasi Desain & Template Invoice
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Pengaturan kop surat perusahaan, logo AUDIRA, catatan kaki rekening bank, QR Code validasi, dan styling cetak thermal/A4.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPreviewTemplate(templates[0])}
              className="px-3.5 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] hover:bg-[var(--app-surface)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Eye size={13} />
              <span>Pratinjau Standar</span>
            </button>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <LayoutIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Total Template</p>
              <p className="text-2xl font-black text-[var(--app-text)] mt-0.5">{templates.length}</p>
              <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-medium">Desain Terdaftar</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Template Aktif</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{templates.filter(t => t.status === 'Aktif').length}</p>
              <p className="text-[10px] text-emerald-500/80 mt-0.5 font-medium">Siap Digunakan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Settings size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Template Bawaan</p>
              <p className="text-2xl font-black text-blue-400 mt-0.5">{templates.filter(t => t.isSystem).length}</p>
              <p className="text-[10px] text-blue-500/80 mt-0.5 font-medium">System Core</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <Printer size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Format Thermal POS</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">{templates.filter(t => t.paperSize.includes('POS')).length}</p>
              <p className="text-[10px] text-amber-500/80 mt-0.5 font-medium">Printer Kasir</p>
            </div>
          </div>
        </div>

        {/* Filter & Action Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari template invoice..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs pl-10 pr-4 py-2.5 rounded-xl text-[var(--app-text)] placeholder:text-[var(--app-muted)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Corporate">Corporate</option>
              <option value="Premium">Premium</option>
              <option value="Modern">Modern</option>
              <option value="Minimalis">Minimalis</option>
              <option value="Startup">Startup / POS</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[var(--app-surface-2)] border border-[var(--app-border)] text-xs py-2.5 px-3 rounded-xl text-[var(--app-text)] focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>

            <button 
              type="button"
              onClick={() => { setSearchTerm(''); setCategoryFilter('Semua'); setStatusFilter('Semua'); setPage(1); }}
              className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] px-3 py-2.5 rounded-xl border border-[var(--app-border)] hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
            >
              Reset
            </button>

            <button 
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Buat Template</span>
            </button>

            <button 
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] hover:bg-[var(--app-surface)] text-[var(--app-text)] text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download size={14} className="text-[var(--app-muted)]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Template Table */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedIds.length === templates.length && templates.length > 0}
                      className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 cursor-pointer" 
                    />
                  </th>
                  <th className="p-4">NAMA TEMPLATE</th>
                  <th className="p-4">KATEGORI</th>
                  <th className="p-4">UKURAN KERTAS</th>
                  <th className="p-4">DIBUAT OLEH</th>
                  <th className="p-4">DIBUAT</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]">
                {paginatedTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-[var(--app-muted)] font-medium">
                      Tidak ada template invoice yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedTemplates.map((d) => {
                    const isSelected = selectedIds.includes(d.id);
                    return (
                      <tr 
                        key={d.id} 
                        className={`hover:bg-[var(--app-surface-2)] transition-colors ${isSelected ? 'bg-blue-500/5' : ''}`}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleSelectRow(d.id)}
                            className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 cursor-pointer" 
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--app-text)]">{d.name}</span>
                            {d.isSystem && (
                              <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono font-semibold">
                                Bawaan
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold border ${getCategoryClass(d.categoryType)}`}>
                            {d.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[var(--app-muted)]">{d.paperSize}</td>
                        <td className="p-4 text-[var(--app-muted)] font-medium">{d.createdBy}</td>
                        <td className="p-4 text-[var(--app-muted)] font-mono text-[11px]">{d.createdAt}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            d.status === 'Aktif' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-slate-500/10 text-[var(--app-muted)] border-slate-500/20'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              type="button"
                              onClick={() => setPreviewTemplate(d)}
                              title="Pratinjau Desain Invoice"
                              className="p-1.5 hover:bg-[var(--app-surface)] rounded-lg text-[var(--app-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleOpenEdit(d)}
                              title="Edit Template"
                              className="p-1.5 hover:bg-blue-500/10 rounded-lg text-[var(--app-muted)] hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            {!d.isSystem && (
                              <button 
                                type="button"
                                onClick={() => handleDeleteTemplate(d.id, d.name)}
                                title="Hapus Template"
                                className="p-1.5 hover:bg-rose-500/10 rounded-lg text-[var(--app-muted)] hover:text-rose-400 transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
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
              totalItems={filteredTemplates.length}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>
        </div>

        {/* Modal: Tambah Template Baru */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Plus size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Buat Template Invoice Baru</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateTemplate} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama Template *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Faktur Bisnis Gold"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Kategori Desain</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Premium">Premium</option>
                      <option value="Modern">Modern</option>
                      <option value="Minimalis">Minimalis</option>
                      <option value="Startup">Startup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Ukuran Kertas</label>
                    <select
                      value={form.paperSize}
                      onChange={(e) => setForm({ ...form, paperSize: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="A4">A4 (Standar PDF/Print)</option>
                      <option value="Letter">Letter</option>
                      <option value="80mm POS Roll">Thermal 80mm (Struk Kasir)</option>
                      <option value="58mm POS Roll">Thermal 58mm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Teks Header / Kop Surat</label>
                  <textarea
                    rows={2}
                    value={form.headerNote}
                    onChange={(e) => setForm({ ...form, headerNote: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Catatan Kaki Rekening / Syarat</label>
                  <textarea
                    rows={2}
                    value={form.footerNote}
                    onChange={(e) => setForm({ ...form, footerNote: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Simpan Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Template */}
        {editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Edit2 size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Edit Template Invoice</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateTemplate} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Nama Template *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Kategori Desain</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Premium">Premium</option>
                      <option value="Modern">Modern</option>
                      <option value="Minimalis">Minimalis</option>
                      <option value="Startup">Startup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--app-text)]">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as 'Aktif' | 'Non Aktif' })}
                      className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non Aktif">Non Aktif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Teks Header / Kop Surat</label>
                  <textarea
                    rows={2}
                    value={form.headerNote}
                    onChange={(e) => setForm({ ...form, headerNote: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--app-text)]">Catatan Kaki Rekening / Syarat</label>
                  <textarea
                    rows={2}
                    value={form.footerNote}
                    onChange={(e) => setForm({ ...form, footerNote: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--app-surface-2)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--app-border)]">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
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

        {/* Modal: Pratinjau Desain Invoice */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[var(--app-border)] bg-[var(--app-surface-2)]">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Pratinjau Desain: {previewTemplate.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {previewTemplate.paperSize}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg hover:bg-[var(--app-surface)] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Rendered Invoice Paper Container */}
              <div className="p-6 overflow-y-auto bg-slate-900/60 flex justify-center">
                <div className="w-full max-w-xl bg-white text-slate-900 rounded-xl p-6 shadow-xl space-y-5 text-xs font-sans">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-base font-black tracking-tight text-blue-700">AUDIRA MULTIMEDIA DIGITAL</h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">{previewTemplate.headerNote}</p>
                      <p className="text-[10px] text-slate-400 mt-1">NPWP: 01.234.567.8-901.000 | Izin ISP: No. 128/KOMINFO/2026</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-widest block">FAKTUR TAGIHAN</span>
                      <span className="font-mono text-xs font-bold text-blue-600 block mt-1">INV/2026/10/AUD-00923</span>
                    </div>
                  </div>

                  {/* Customer & Period Info */}
                  <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Pelanggan</p>
                      <p className="font-bold text-slate-800 mt-0.5">Agus Dwi Rianto</p>
                      <p className="text-slate-600">ID: AUD-9921 | Paket: Dedicated 100 Mbps</p>
                      <p className="text-slate-500">Jl. Telekomunikasi No. 8, Jakarta Selatan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Periode & Jatuh Tempo</p>
                      <p className="font-semibold text-slate-700 mt-0.5">01 Nov 2026 - 30 Nov 2026</p>
                      <p className="font-bold text-rose-600 mt-0.5">Jatuh Tempo: 20 Nov 2026</p>
                      <p className="text-emerald-600 font-semibold mt-0.5">Status: MENUNGGU PEMBAYARAN</p>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b-2 border-slate-300 text-slate-600 font-bold">
                        <th className="py-2">DESKRIPSI LAYANAN</th>
                        <th className="py-2 text-center w-16">QTY</th>
                        <th className="py-2 text-right">HARGA (IDR)</th>
                        <th className="py-2 text-right">TOTAL (IDR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2.5 font-medium text-slate-800">
                          Internet Dedicated Broadband Fiber 100 Mbps (SLA 99.8%)
                        </td>
                        <td className="py-2.5 text-center text-slate-600 font-mono">1</td>
                        <td className="py-2.5 text-right font-mono text-slate-700">450.000</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-900">450.000</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-slate-800">
                          Sewa Router Wi-Fi 6 Gigabit Dual Band (Managed CPE)
                        </td>
                        <td className="py-2.5 text-center text-slate-600 font-mono">1</td>
                        <td className="py-2.5 text-right font-mono text-slate-700">0</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-900">0</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-300">
                        <td colSpan={3} className="pt-2 text-right font-semibold text-slate-600">Subtotal:</td>
                        <td className="pt-2 text-right font-mono font-bold text-slate-900">Rp 450.000</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right text-slate-500">PPN 11%:</td>
                        <td className="text-right font-mono text-slate-700">Rp 49.500</td>
                      </tr>
                      <tr className="text-sm font-bold text-blue-700">
                        <td colSpan={3} className="pt-1 text-right">Total Tagihan:</td>
                        <td className="pt-1 text-right font-mono font-black text-base text-blue-700">Rp 499.500</td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Payment Info & QR */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 bg-slate-50 p-3 rounded-lg">
                    <div className="space-y-1 text-[10px]">
                      <p className="font-bold text-slate-700">Metode Pembayaran Transfer Bank:</p>
                      <p className="text-slate-600 font-mono">Bank Mandiri: 123-00-9876543-1 a.n AUDIRA</p>
                      <p className="text-slate-600 font-mono">Bank BCA: 882-019-2831 a.n AUDIRA</p>
                      <p className="text-slate-500 italic mt-1">{previewTemplate.footerNote}</p>
                    </div>
                    <div className="text-center pl-3 border-l border-slate-200">
                      <div className="w-16 h-16 bg-white border border-slate-300 rounded flex items-center justify-center text-slate-800">
                        <QrCode size={48} />
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 block">QRIS RESMI</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-surface-2)] flex justify-between items-center">
                <span className="text-xs text-[var(--app-muted)]">
                  Pratinjau render otomatis sesuai standar cetak {previewTemplate.paperSize}.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success(`Mencetak dokumen menggunakan template "${previewTemplate.name}"...`, 'Cetak Invoice');
                      setPreviewTemplate(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Cetak Sekarang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(null)}
                    className="px-4 py-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] hover:text-[var(--app-text)] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
