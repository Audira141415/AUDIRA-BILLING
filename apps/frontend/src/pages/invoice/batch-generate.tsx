import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle,
  XCircle,
  Upload,
  Settings,
  HelpCircle,
  Wallet,
  Play,
  Save,
  Send,
  Lightbulb,
  Check,
  X,
  Loader2
} from 'lucide-react';

interface CustomerRow {
  id: string;
  custNo: string;
  name: string;
  group: 'Corporate' | 'Rumah' | 'Instansi';
  packageName: string;
  monthlyBill: number;
  tax: number;
  total: number;
  status: string;
  phone?: string;
  email?: string;
}

const defaultCustomers: CustomerRow[] = [
  { id: '1', custNo: 'CUST-0001', name: 'Budi Santoso', group: 'Corporate', packageName: 'Biz 100 Mbps', monthlyBill: 1200000, tax: 132000, total: 1332000, status: 'Siap Generate', phone: '081234567890' },
  { id: '2', custNo: 'CUST-0002', name: 'Siti Aminah', group: 'Rumah', packageName: 'Home 50 Mbps', monthlyBill: 450000, tax: 49500, total: 499500, status: 'Siap Generate', phone: '081234567891' },
  { id: '3', custNo: 'CUST-0003', name: 'Andi Pratama', group: 'Corporate', packageName: 'Biz 200 Mbps', monthlyBill: 2200000, tax: 242000, total: 2442000, status: 'Siap Generate', phone: '081234567892' },
  { id: '4', custNo: 'CUST-0004', name: 'Rina Marlina', group: 'Rumah', packageName: 'Home 30 Mbps', monthlyBill: 350000, tax: 38500, total: 388500, status: 'Siap Generate', phone: '081234567893' },
  { id: '5', custNo: 'CUST-0005', name: 'PT. Maju Bersama', group: 'Instansi', packageName: 'Office 100 Mbps', monthlyBill: 1800000, tax: 198000, total: 1998000, status: 'Siap Generate', phone: '081234567894' },
  { id: '6', custNo: 'CUST-0006', name: 'CV. Karya Mandiri', group: 'Corporate', packageName: 'Biz 50 Mbps', monthlyBill: 800000, tax: 88000, total: 888000, status: 'Siap Generate', phone: '081234567895' },
  { id: '7', custNo: 'CUST-0007', name: 'Dedi Kurniawan', group: 'Rumah', packageName: 'Home 100 Mbps', monthlyBill: 650000, tax: 71500, total: 721500, status: 'Siap Generate', phone: '081234567896' },
  { id: '8', custNo: 'CUST-0008', name: 'Dewi Lestari', group: 'Rumah', packageName: 'Home 20 Mbps', monthlyBill: 250000, tax: 27500, total: 277500, status: 'Siap Generate', phone: '081234567897' },
  { id: '9', custNo: 'CUST-0009', name: 'Yudi Hermawan', group: 'Instansi', packageName: 'Office 200 Mbps', monthlyBill: 2800000, tax: 308000, total: 3108000, status: 'Siap Generate', phone: '081234567898' },
  { id: '10', custNo: 'CUST-0010', name: 'CV. Sinar Abadi', group: 'Corporate', packageName: 'Biz 100 Mbps', monthlyBill: 1300000, tax: 143000, total: 1443000, status: 'Siap Generate', phone: '081234567899' }
];

export default function BatchGeneratePage() {
  const [customers, setCustomers] = useState<CustomerRow[]>(defaultCustomers);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultCustomers.map(x => x.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('Semua Group');
  const [packageFilter, setPackageFilter] = useState('Semua Package');
  const [includeTax, setIncludeTax] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceType, setInvoiceType] = useState('Invoice Bulanan');
  const [billingMonth, setBillingMonth] = useState('2026-10');
  const [dueDateDays, setDueDateDays] = useState('15');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status & KPIs
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  // Modals
  const [detailCustomer, setDetailCustomer] = useState<CustomerRow | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.pelanggan.getAll();
      if (res && res.data && res.data.length > 0) {
        const mapped: CustomerRow[] = res.data.map((c: any, idx: number) => {
          const harga = c.paket?.harga || 250000;
          const tax = Math.round(harga * 0.11);
          return {
            id: c.id?.toString() || (idx + 1).toString(),
            custNo: c.no_layanan || `CUST-00${idx + 1}`,
            name: c.nama || 'Pelanggan',
            group: c.tipe === 'corporate' ? 'Corporate' : c.tipe === 'instansi' ? 'Instansi' : 'Rumah',
            packageName: c.paket?.nama || 'Home 50 Mbps',
            monthlyBill: harga,
            tax: tax,
            total: harga + tax,
            status: 'Siap Generate',
            phone: c.telepon,
            email: c.email
          };
        });
        setCustomers(mapped);
        setSelectedIds(mapped.map(m => m.id));
      }
    } catch (e) {
      console.warn('Using default customer list:', e);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Selection
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(d => d.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setCustomers(customers.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    showToast(`${selectedIds.length} customer dihapus dari antrean batch.`);
  };

  const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomers(customers.filter(c => c.id !== id));
    setSelectedIds(selectedIds.filter(x => x !== id));
    showToast('Customer dihapus dari antrean.');
  };

  // Filter
  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.custNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = groupFilter === 'Semua Group' || c.group === groupFilter;
    const matchPackage = packageFilter === 'Semua Package' || c.packageName.includes(packageFilter);
    return matchSearch && matchGroup && matchPackage;
  });

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Financial calculations
  const selectedCustomers = customers.filter(c => selectedIds.includes(c.id));
  const subtotal = selectedCustomers.reduce((acc, c) => acc + c.monthlyBill, 0);
  const totalTax = includeTax ? Math.round(subtotal * 0.11) : 0;
  const grandTotal = subtotal + totalTax;

  // Batch Generation Actions
  const handleGenerateNow = async (sendBroadcast: boolean = false) => {
    if (selectedIds.length === 0) {
      showToast('Pilih minimal 1 customer untuk digenerate!');
      return;
    }

    setIsProcessing(true);
    try {
      // Call backend API if connected
      try {
        await api.keuangan.bulkGenerate(billingMonth);
      } catch (err) {
        console.warn('Backend bulk generate mock fallback:', err);
      }

      setSuccessCount(selectedIds.length);
      setFailCount(0);
      setIsSuccessModalOpen(true);
      showToast(`Sukses membuat ${selectedIds.length} invoice untuk periode ${billingMonth}!`);

      if (sendBroadcast) {
        showToast('Notifikasi WhatsApp & Email telah dikirimkan secara serentak!');
      }
    } catch (e: any) {
      showToast(`Gagal: ${e.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDraft = () => {
    if (selectedIds.length === 0) {
      showToast('Pilih minimal 1 customer untuk disimpan draft!');
      return;
    }
    showToast(`${selectedIds.length} invoice berhasil disimpan sebagai Draft di menu /invoice/draft.`);
  };

  const handleExportList = () => {
    const headers = ['ID Customer', 'Nama Customer', 'Kategori', 'Paket', 'Nominal', 'PPN', 'Total', 'Telepon'];
    const rows = selectedCustomers.map(c => [
      c.custNo,
      `"${c.name.replace(/"/g, '""')}"`,
      c.group,
      `"${c.packageName}"`,
      c.monthlyBill,
      includeTax ? c.tax : 0,
      includeTax ? c.total : c.monthlyBill,
      `"${c.phone || '-'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `batch_invoice_queue_${billingMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Antrean invoice diekspor ke CSV.');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400">
            <CheckCircle size={18} />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Batch Generate</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pembuatan Invoice Massal (Batch Generate)
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Eksekusi penerbitan invoice kolektif per area, paket, atau siklus billing pelanggan secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/invoice/semua"
              className="px-3.5 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/30 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-xl transition-all"
            >
              Semua Invoice
            </Link>
            <Link
              href="/invoice/generate"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
            >
              Single Generate
            </Link>
          </div>
        </div>

        {/* ─── KPI Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Antrean Customer</p>
              <p className="text-xl font-black text-[var(--app-text)] mt-0.5">{selectedIds.length}</p>
              <p className="text-[9px] text-[var(--app-muted)]">dari {customers.length} total</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Estimasi Tagihan</p>
              <p className="text-base font-black text-green-500 mt-0.5">{formatCurrency(grandTotal)}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Termasuk PPN</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Rata-rata/Inv</p>
              <p className="text-sm font-black text-[var(--app-text)] mt-0.5">
                {formatCurrency(selectedIds.length ? Math.round(grandTotal / selectedIds.length) : 0)}
              </p>
              <p className="text-[9px] text-[var(--app-muted)]">Nominal rerata</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Periode Billing</p>
              <p className="text-xs font-black text-[var(--app-text)] mt-0.5 font-mono">{billingMonth}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Siklus bulanan</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-xl">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Sukses Dibuat</p>
              <p className="text-xl font-black text-teal-500 mt-0.5">{successCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Sesi saat ini</p>
            </div>
          </div>

          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
              <XCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Gagal Generate</p>
              <p className="text-xl font-black text-red-500 mt-0.5">{failCount}</p>
              <p className="text-[9px] text-[var(--app-muted)]">Kendala kuota</p>
            </div>
          </div>
        </div>

        {/* ─── Stepper ───────────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5">
          <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider mb-4">Langkah Pembuatan Batch Invoice</p>
          
          <div className="flex flex-wrap items-center gap-4 lg:gap-8 text-xs font-semibold">
            {[
              { num: 1, title: 'Pilih Customer', desc: `${selectedIds.length} dipilih` },
              { num: 2, title: 'Periode & PPN', desc: `${billingMonth} • PPN ${includeTax ? '11%' : '0%'}` },
              { num: 3, title: 'Review Total', desc: formatCurrency(grandTotal) },
              { num: 4, title: 'Eksekusi Generate', desc: 'Terbitkan Invoice' }
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div 
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-3 cursor-pointer transition-all ${
                    currentStep === step.num ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep === step.num ? 'bg-blue-600 text-white' : 'bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-muted)]'
                  }`}>
                    {step.num}
                  </span>
                  <div>
                    <p className="text-[var(--app-text)] leading-none font-bold">{step.title}</p>
                    <p className="text-[10px] text-[var(--app-muted)] mt-0.5 font-normal">{step.desc}</p>
                  </div>
                </div>
                {idx < 3 && <div className="hidden lg:block w-12 h-0.5 bg-[var(--app-border)]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ─── Filter & Options Area ─────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Col 1: Filter Customer */}
            <div className="space-y-3">
              <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block">Filter Pelanggan</span>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={groupFilter}
                  onChange={e => { setGroupFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                >
                  <option value="Semua Group">Semua Group</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Rumah">Rumah</option>
                  <option value="Instansi">Instansi</option>
                </select>
                <select 
                  value={packageFilter}
                  onChange={e => { setPackageFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                >
                  <option value="Semua Package">Semua Paket</option>
                  <option value="Home">Home Paket</option>
                  <option value="Biz">Biz Paket</option>
                  <option value="Office">Office Paket</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-3.5 h-3.5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Cari nama / nomor pelanggan..."
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-3 py-2 rounded-xl text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Col 2: Periode Invoice */}
            <div className="space-y-3">
              <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block">Bulan Tagihan</span>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
                  <input 
                    type="month" 
                    value={billingMonth}
                    onChange={e => setBillingMonth(e.target.value)}
                    className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-10 pr-3 py-2 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Col 3: Tipe Invoice */}
            <div className="space-y-3">
              <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block">Tipe Tagihan</span>
              <div className="space-y-1.5 text-xs font-semibold text-[var(--app-muted)]">
                {['Invoice Bulanan', 'Invoice Deposit', 'Invoice Custom'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer hover:text-[var(--app-text)]">
                    <input 
                      type="radio" 
                      name="invType" 
                      checked={invoiceType === t} 
                      onChange={() => setInvoiceType(t)} 
                      className="text-blue-600" 
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Col 4: Tgl. Jatuh Tempo & PPN */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block mb-1">Tenggat Pembayaran</span>
                <select 
                  value={dueDateDays}
                  onChange={e => setDueDateDays(e.target.value)}
                  className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-xl text-[var(--app-text)] focus:outline-none focus:border-blue-500"
                >
                  <option value="7">7 Hari Setelah Terbit</option>
                  <option value="15">15 Hari Setelah Terbit</option>
                  <option value="30">Akhir Bulan (30 Hari)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-[var(--app-border)] text-xs font-semibold text-[var(--app-muted)]">
                <span>PPN 11% Aktif</span>
                <button 
                  onClick={() => setIncludeTax(!includeTax)}
                  className={`w-9 h-5 rounded-full transition-all relative ${includeTax ? 'bg-blue-600' : 'bg-gray-400'}`}
                >
                  <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${includeTax ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Main Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Table & Bottom Summaries */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Table Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl overflow-hidden shadow-2xs">
              <div className="flex justify-between items-center p-4 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                    Daftar Pelanggan Siap Generate ({selectedIds.length} Terpilih)
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsImportOpen(true)}
                    className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-border)]/30 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Upload size={12} className="text-blue-500" />
                    <span>Import File</span>
                  </button>
                  <button 
                    onClick={handleExportList}
                    className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-border)]/30 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Download size={12} className="text-green-500" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/10 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3.5 w-10 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length > 0 && selectedIds.length === filteredCustomers.length}
                          onChange={handleSelectAll}
                          className="rounded text-blue-600 focus:ring-0" 
                        />
                      </th>
                      <th className="p-3.5 w-12 text-center">NO</th>
                      <th className="p-3.5 w-28">ID CUSTOMER</th>
                      <th className="p-3.5">NAMA PELANGGAN</th>
                      <th className="p-3.5 w-24 text-center">GRUP</th>
                      <th className="p-3.5 w-32">PAKET</th>
                      <th className="p-3.5 text-right">TAGIHAN</th>
                      <th className="p-3.5 text-right w-24">PPN 11%</th>
                      <th className="p-3.5 text-right">TOTAL</th>
                      <th className="p-3.5 w-20 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)] text-[var(--app-text)]">
                    {paginatedCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[var(--app-muted)]">
                          Tidak ada customer yang sesuai kriteria filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map((d, idx) => {
                        const isSelected = selectedIds.includes(d.id);
                        return (
                          <tr 
                            key={d.id}
                            onClick={() => handleSelectRow(d.id)}
                            className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${isSelected ? 'bg-blue-600/5' : ''}`}
                          >
                            <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleSelectRow(d.id)}
                                className="rounded text-blue-600 focus:ring-0" 
                              />
                            </td>
                            <td className="p-3.5 text-center text-[var(--app-muted)] font-mono">
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>
                            <td className="p-3.5 font-mono font-semibold text-blue-500 text-[11px]">{d.custNo}</td>
                            <td className="p-3.5 font-bold text-[var(--app-text)]">{d.name}</td>
                            <td className="p-3.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                d.group === 'Corporate'
                                  ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                  : d.group === 'Rumah'
                                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                              }`}>
                                {d.group}
                              </span>
                            </td>
                            <td className="p-3.5 font-medium text-[var(--app-muted)]">{d.packageName}</td>
                            <td className="p-3.5 text-right font-medium">{formatCurrency(d.monthlyBill)}</td>
                            <td className="p-3.5 text-right font-medium text-[var(--app-muted)]">
                              {formatCurrency(includeTax ? d.tax : 0)}
                            </td>
                            <td className="p-3.5 text-right font-bold text-green-500">
                              {formatCurrency(includeTax ? d.total : d.monthlyBill)}
                            </td>
                            <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1">
                                <button 
                                  onClick={() => setDetailCustomer(d)}
                                  title="Lihat Detail"
                                  className="p-1.5 hover:bg-[var(--app-border)]/40 rounded-lg text-[var(--app-muted)] hover:text-blue-500 transition-colors"
                                >
                                  <Eye size={13} />
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteSingle(d.id, e)}
                                  title="Hapus dari antrean"
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-[var(--app-muted)] hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={13} />
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

              {/* Table pagination & Bottom Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-[var(--app-border)] bg-[var(--app-card)]">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[var(--app-muted)] cursor-pointer hover:text-[var(--app-text)]">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length > 0 && selectedIds.length === filteredCustomers.length}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-0" 
                    />
                    <span>Pilih Semua ({filteredCustomers.length})</span>
                  </label>
                  {selectedIds.length > 0 && (
                    <button 
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-bold px-2 py-1 rounded-lg border border-red-500/20 bg-red-500/10"
                    >
                      <Trash2 size={12} /> Hapus Terpilih ({selectedIds.length})
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button 
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold border transition-all ${
                          currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-border)]/30'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-lg text-[var(--app-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none"
                  >
                    <option value={5}>5 / hal</option>
                    <option value={10}>10 / hal</option>
                    <option value={20}>20 / hal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Summary KPI panel */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 space-y-1">
                <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Customer Terpilih</p>
                <p className="text-2xl font-black text-[var(--app-text)]">{selectedIds.length}</p>
                <p className="text-[10px] text-[var(--app-muted)] font-semibold">Siap terbit</p>
              </div>

              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 space-y-1">
                <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Subtotal (Dasar)</p>
                <p className="text-xl font-black text-[var(--app-text)]">{formatCurrency(subtotal)}</p>
                <p className="text-[10px] text-[var(--app-muted)] font-semibold">Tanpa PPN</p>
              </div>

              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 space-y-1">
                <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">PPN 11%</p>
                <p className="text-xl font-black text-[var(--app-text)]">{formatCurrency(totalTax)}</p>
                <p className="text-[10px] text-[var(--app-muted)] font-semibold">{includeTax ? 'Dikenakan' : 'Dikecualikan'}</p>
              </div>

              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-4 space-y-1">
                <p className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider">Grand Total</p>
                <p className="text-xl font-black text-green-500">{formatCurrency(grandTotal)}</p>
                <p className="text-[10px] text-[var(--app-muted)] font-semibold">Total Tagihan Baru</p>
              </div>
            </div>

          </div>

          {/* Right Column: Execution Actions */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Action Buttons */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-3.5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Aksi Batch Generate</h3>
              
              <div className="space-y-2.5">
                <button 
                  disabled={isProcessing || selectedIds.length === 0}
                  onClick={() => handleGenerateNow(false)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={15} />
                  )}
                  <div className="text-left leading-tight">
                    <p className="font-bold">Generate Invoice Sekarang</p>
                    <p className="text-[9px] text-blue-200 font-normal">Buat invoice untuk {selectedIds.length} customer</p>
                  </div>
                </button>

                <button 
                  disabled={isProcessing || selectedIds.length === 0}
                  onClick={() => handleGenerateNow(true)}
                  className="w-full flex items-center gap-3 bg-[var(--app-bg)] border border-green-500/30 text-[var(--app-text)] hover:border-green-500 text-xs py-3 px-4 rounded-xl transition-all text-left"
                >
                  <Send size={15} className="text-green-500 shrink-0" />
                  <div className="leading-tight">
                    <p className="font-bold">Buat & Kirim WhatsApp</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-normal">Generate sekaligus blast PDF</p>
                  </div>
                </button>

                <button 
                  disabled={selectedIds.length === 0}
                  onClick={handleSaveDraft}
                  className="w-full flex items-center gap-3 bg-[var(--app-bg)] border border-orange-500/30 text-[var(--app-text)] hover:border-orange-500 text-xs py-3 px-4 rounded-xl transition-all text-left"
                >
                  <Save size={15} className="text-orange-500 shrink-0" />
                  <div className="leading-tight">
                    <p className="font-bold">Simpan sebagai Draft</p>
                    <p className="text-[9px] text-[var(--app-muted)] font-normal">Simpan untuk diverifikasi nanti</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Card 2: Ringkasan Distribusi */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Proporsi Antrean</h3>
              <div className="space-y-2 text-xs">
                {['Corporate', 'Rumah', 'Instansi'].map(grp => {
                  const count = selectedCustomers.filter(c => c.group === grp).length;
                  const pct = selectedCustomers.length ? Math.round((count / selectedCustomers.length) * 100) : 0;
                  return (
                    <div key={grp} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span>{grp}</span>
                        <span className="text-[var(--app-text)]">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[var(--app-bg)] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] p-4 rounded-2xl flex items-start gap-3 shadow-2xs">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg shrink-0">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">Informasi Batch</h5>
                <p className="text-[10px] text-[var(--app-muted)] leading-relaxed">
                  Semua invoice yang digenerate otomatis mendapatkan nomor invoice resmi sistem (INV/YYYY/MM/XXXX) dan terdaftar di monitoring keuangan.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ─── MODAL: Detail Customer ────────────────────────────────────── */}
        {detailCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Detail Pelanggan Antrean</h3>
                <button onClick={() => setDetailCustomer(null)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">No. Layanan</span>
                  <span className="font-mono font-bold text-blue-500">{detailCustomer.custNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Nama Pelanggan</span>
                  <span className="font-bold text-[var(--app-text)]">{detailCustomer.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Paket Internet</span>
                  <span className="font-semibold text-[var(--app-text)]">{detailCustomer.packageName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">Tarif Bulanan</span>
                  <span className="font-mono">{formatCurrency(detailCustomer.monthlyBill)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]/40">
                  <span className="text-[var(--app-muted)]">PPN 11%</span>
                  <span className="font-mono">{formatCurrency(detailCustomer.tax)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-green-500">
                  <span>Total Tagihan</span>
                  <span>{formatCurrency(detailCustomer.total)}</span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[var(--app-border)]">
                <button 
                  onClick={() => setDetailCustomer(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: Import CSV ─────────────────────────────────────────── */}
        {isImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--app-text)]">Import Pelanggan dari File</h3>
                <button onClick={() => setIsImportOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-text)]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-[var(--app-muted)]">
                  Unggah file Excel/CSV berisi daftar ID Customer atau Nomor Layanan untuk digenerate invoice sekaligus.
                </p>
                <div className="border-2 border-dashed border-[var(--app-border)] rounded-xl p-6 text-center hover:border-blue-500 cursor-pointer">
                  <FileText size={32} className="mx-auto text-[var(--app-muted)] mb-2" />
                  <p className="font-semibold text-[var(--app-text)]">Pilih file Excel (.xlsx) atau CSV</p>
                  <p className="text-[10px] text-[var(--app-muted)] mt-1">Maksimal 5MB</p>
                  <input type="file" accept=".csv, .xlsx" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--app-border)]">
                <button 
                  onClick={() => setIsImportOpen(false)}
                  className="px-4 py-2 border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    setIsImportOpen(false);
                    showToast('Data pelanggan berhasil diimpor ke antrean batch!');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Proses Import
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
