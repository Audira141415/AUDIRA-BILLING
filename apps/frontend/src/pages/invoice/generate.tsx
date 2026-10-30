import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import {
  Search,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb,
  Calendar,
  Bell,
  Mail,
  Maximize2,
  Phone,
  MapPin,
  CheckCircle,
  FileText,
  Percent,
  ShieldCheck,
  Send,
  Printer,
  ArrowLeft,
  Check,
  Zap,
  Tag,
  CreditCard
} from 'lucide-react';

interface CustomerRow {
  id: string;
  name: string;
  customerNo: string;
  area: string;
  activePackage: string;
  speed: string;
  price: number;
  nextBilling: string;
  status: string;
  phone: string;
  address: string;
}

const mockCustomers: CustomerRow[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    customerNo: 'CUST-0001',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 50 Mbps',
    speed: '50 Mbps',
    price: 375000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7890',
    address: 'Jl. Merdeka No. 10, Yogyakarta'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    customerNo: 'CUST-0002',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 20 Mbps',
    speed: '20 Mbps',
    price: 250000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7891',
    address: 'Jl. Malioboro No. 45, Yogyakarta'
  },
  {
    id: '3',
    name: 'Andi Pratama',
    customerNo: 'CUST-0003',
    area: 'Sleman',
    activePackage: 'Dedicated 100 Mbps',
    speed: '100 Mbps',
    price: 1500000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7892',
    address: 'Jl. Kaliurang Km 5, Sleman'
  },
  {
    id: '4',
    name: 'Rina Marlina',
    customerNo: 'CUST-0004',
    area: 'Bantul',
    activePackage: 'Home 30 Mbps',
    speed: '30 Mbps',
    price: 300000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7893',
    address: 'Jl. Bantul Km 7, Bantul'
  },
  {
    id: '5',
    name: 'Dewi Lestari',
    customerNo: 'CUST-0005',
    area: 'Sleman',
    activePackage: 'Home 50 Mbps',
    speed: '50 Mbps',
    price: 375000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7894',
    address: 'Jl. Gejayan No. 12, Sleman'
  },
  {
    id: '6',
    name: 'Eko Prasetyo',
    customerNo: 'CUST-0006',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 20 Mbps',
    speed: '20 Mbps',
    price: 250000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7895',
    address: 'Jl. Kusumanegara No. 88, Yogyakarta'
  },
  {
    id: '7',
    name: 'Agus Wijaya',
    customerNo: 'CUST-0007',
    area: 'Sleman',
    activePackage: 'Corporate 200 Mbps',
    speed: '200 Mbps',
    price: 2500000,
    nextBilling: '1/11/2026',
    status: 'Aktif',
    phone: '0812-3456-7896',
    address: 'Jl. Ringroad Utara, Sleman'
  },
  {
    id: '8',
    name: 'Mega Utami',
    customerNo: 'CUST-0008',
    area: 'Bantul',
    activePackage: 'Home 30 Mbps',
    speed: '30 Mbps',
    price: 300000,
    nextBilling: '01/06/2026',
    status: 'Aktif',
    phone: '0812-3456-7899',
    address: 'Jl. Parangtritis Km 4, Bantul'
  },
  {
    id: '9',
    name: 'Yudi Hermawan',
    customerNo: 'CUST-0009',
    area: 'Bantul',
    activePackage: 'Corporate 50 Mbps',
    speed: '50 Mbps',
    price: 500000,
    nextBilling: '01/06/2026',
    status: 'Aktif',
    phone: '0812-3456-7897',
    address: 'Jl. Ringroad Selatan, Bantul'
  },
  {
    id: '10',
    name: 'Eva Apriyani',
    customerNo: 'CUST-0010',
    area: 'Yogyakarta Kota',
    activePackage: 'Home 100 Mbps',
    speed: '100 Mbps',
    price: 375000,
    nextBilling: '01/06/2026',
    status: 'Aktif',
    phone: '0812-3456-7898',
    address: 'Jl. Solo Km 7, Yogyakarta'
  }
];

export default function GenerateInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(['1']);
  
  // Filters & Search for Step 1
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Step 2 Configuration State
  const [customAddon, setCustomAddon] = useState(0);
  const [isPublicIpIncluded, setIsPublicIpIncluded] = useState(false);

  // Step 3 Period & Due Date
  const [billingPeriod, setBillingPeriod] = useState('November 2026');
  const [invoiceDate, setInvoiceDate] = useState('2026-11-01');
  const [dueDate, setDueDate] = useState('2026-11-10');
  const [gracePeriodDays, setGracePeriodDays] = useState(5);

  // Step 4 Discount & Tax
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPpnEnabled, setIsPpnEnabled] = useState(true);

  // Step 6 Generation Processing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendWhatsAppDirectly, setSendWhatsAppDirectly] = useState(true);

  const filteredCustomers = mockCustomers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === 'Semua' || c.area === areaFilter;
    const matchesStatus = statusFilter === 'Semua' || c.status === statusFilter;
    return matchesSearch && matchesArea && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  // Calculations for summary based on selected rows
  const selectedCustomers = mockCustomers.filter(c => selectedIds.includes(c.id));
  const baseTagihan = selectedCustomers.reduce((sum, c) => sum + c.price, 0);
  const addonTotal = (customAddon * 50000) + (isPublicIpIncluded ? 75000 * selectedCustomers.length : 0);
  const totalTagihan = baseTagihan + addonTotal;
  const totalDiskon = discountAmount;
  const taxableAmount = Math.max(0, totalTagihan - totalDiskon);
  const totalPPN = isPpnEnabled ? Math.round(taxableAmount * 0.11) : 0;
  const materai = totalTagihan >= 5000000 ? 10000 : 0;
  const totalAkhir = taxableAmount + totalPPN + materai;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const primaryCustomer = selectedCustomers[0] || mockCustomers[0];

  const handleFinalGenerate = () => {
    if (selectedCustomers.length === 0) {
      toast.error('Pilih minimal 1 pelanggan untuk membuat invoice!');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Berhasil menerbitkan ${selectedCustomers.length} invoice untuk periode ${billingPeriod}!`);
      if (sendWhatsAppDirectly) {
        toast.info(`Notifikasi WhatsApp & PDF telah dijadwalkan ke ${selectedCustomers.length} pelanggan.`);
      }
      router.push('/invoice/history');
    }, 1200);
  };

  const stepsList = [
    { step: 1, label: 'Pilih Customer' },
    { step: 2, label: 'Pilih Package' },
    { step: 3, label: 'Periode & Jatuh Tempo' },
    { step: 4, label: 'Diskon & Pajak' },
    { step: 5, label: 'Preview Invoice' },
    { step: 6, label: 'Generate Invoice' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/invoice" className="hover:text-[var(--app-text)]">Billing & Tagihan</Link>
              <span>/</span>
              <span className="text-blue-500 font-semibold">Generate Single & Batch</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Pembuatan Invoice Layanan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Wizard pembuatan tagihan layanan internet perorangan atau korporat terintegrasi langsung dengan database pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/invoice/semua" className="px-3 py-2 bg-[var(--app-card)] hover:bg-[var(--app-border)]/20 border border-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all">Daftar Invoice</Link>
            <Link href="/invoice/batch-generate" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all shadow-xs">Batch Generate</Link>
          </div>
        </div>

        {/* ─── Wizard Steps Bar ────────────────────────────────────────────── */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4 flex flex-wrap items-center justify-between gap-4">
          {stepsList.map((s, idx, arr) => (
            <React.Fragment key={s.step}>
              <button 
                onClick={() => setCurrentStep(s.step)}
                className="flex items-center gap-3 text-left focus:outline-none"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === s.step 
                    ? 'bg-[#0052cc] text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/40' 
                    : currentStep > s.step
                    ? 'bg-green-600 text-white'
                    : 'bg-[var(--app-bg)] text-[var(--app-muted)] border border-[var(--app-border)]'
                }`}>
                  {currentStep > s.step ? <Check size={14} /> : s.step}
                </div>
                <span className={`text-xs font-semibold ${
                  currentStep === s.step ? 'text-white font-bold' : 'text-[var(--app-muted)]'
                }`}>
                  {s.label}
                </span>
              </button>
              {idx < arr.length - 1 && (
                <div className="hidden lg:block flex-1 h-[1px] bg-[var(--app-border)]/20 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── Main Form Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side: Step Content Card */}
          <div className="lg:col-span-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-6">
            
            {/* STEP 1: PILIH CUSTOMER */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--app-text)]">Step 1 - Pilih Customer</h2>
                  <p className="text-xs text-[var(--app-muted)]">Pilih customer yang akan dibuatkan invoice atau terapkan filter area</p>
                </div>

                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-4 bg-[var(--app-border)]/10 border border-[var(--app-border)] p-4 rounded-xl">
                  <select 
                    value={areaFilter}
                    onChange={(e) => {
                      setAreaFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-lg text-[var(--app-text)] focus:outline-none min-w-[120px]"
                  >
                    <option value="Semua">Semua Area</option>
                    <option value="Yogyakarta Kota">Yogyakarta Kota</option>
                    <option value="Sleman">Sleman</option>
                    <option value="Bantul">Bantul</option>
                  </select>

                  <select 
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-[var(--app-bg)] border border-[var(--app-border)] text-xs py-2 px-3 rounded-lg text-[var(--app-text)] focus:outline-none min-w-[120px]"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Suspend">Suspend</option>
                  </select>

                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--app-muted)] w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Cari customer, no CUST, nomor telepon..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs pl-9 pr-4 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setAreaFilter('Semua');
                      setStatusFilter('Semua');
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-[var(--app-muted)] hover:text-white"
                  >
                    Reset
                  </button>
                </div>

                {/* Table wrapper */}
                <div className="border border-[var(--app-border)] rounded-xl overflow-hidden">
                  <div className="bg-[var(--app-border)]/10 border-b border-[var(--app-border)] p-3 flex justify-between items-center text-[10px] font-bold text-[var(--app-muted)]">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length > 0 && selectedIds.length === filteredCustomers.length}
                        onChange={handleSelectAll}
                        className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 w-3.5 h-3.5" 
                      />
                      <span>{selectedIds.length} customer dipilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleSelectAll}
                        className="text-blue-400 hover:underline"
                      >
                        {selectedIds.length === filteredCustomers.length ? 'Batalkan Semua' : 'Pilih Semua'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/5 text-[var(--app-muted)] text-[10px] font-bold uppercase tracking-wider">
                          <th className="p-4 w-10"></th>
                          <th className="p-4">CUSTOMER</th>
                          <th className="p-4">NO. CUSTOMER</th>
                          <th className="p-4">AREA</th>
                          <th className="p-4">PACKAGE AKTIF</th>
                          <th className="p-4">TAGIHAN BERIKUTNYA</th>
                          <th className="p-4">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--app-border)] text-xs text-[var(--app-text)]/80">
                        {paginatedCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-sm text-[var(--app-muted)]">
                              Tidak ada pelanggan yang cocok dengan parameter filter.
                            </td>
                          </tr>
                        ) : (
                          paginatedCustomers.map((c) => {
                            const isSelected = selectedIds.includes(c.id);
                            return (
                              <tr 
                                key={c.id}
                                onClick={() => handleSelectRow(c.id)}
                                className={`hover:bg-[var(--app-border)]/20 transition-colors cursor-pointer ${isSelected ? 'bg-[var(--app-border)]/20/60' : ''}`}
                              >
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => handleSelectRow(c.id)}
                                    className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 w-3.5 h-3.5" 
                                  />
                                </td>
                                <td className="p-4 font-bold text-[var(--app-text)]">{c.name}</td>
                                <td className="p-4 font-semibold text-[var(--app-muted)]">{c.customerNo}</td>
                                <td className="p-4 text-[var(--app-muted)] font-medium">{c.area}</td>
                                <td className="p-4 text-[var(--app-text)]/80 font-medium">{c.activePackage}</td>
                                <td className="p-4 text-[var(--app-muted)] font-medium">{c.nextBilling}</td>
                                <td className="p-4">
                                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {c.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredCustomers.length}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={(newSize: number) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => router.push('/invoice')} 
                    className="px-5 py-2.5 bg-transparent border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-xl text-xs font-bold transition-all"
                  >
                    Batal
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (selectedIds.length === 0) {
                        toast.error('Pilih minimal 1 pelanggan untuk melanjutkan!');
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <span>Lanjut ke Step 2 (Pilih Package)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PILIH PACKAGE & ADDONS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--app-text)]">Step 2 - Konfigurasi Paket & Add-on Layanan</h2>
                  <p className="text-xs text-[var(--app-muted)]">Verifikasi paket aktif dan tambahkan add-on bandwidth atau IP Publik untuk tagihan ini</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Add-on Bandwidth Turbo</span>
                      <span className="text-xs font-bold text-blue-400">Rp 50.000 / +10 Mbps</span>
                    </div>
                    <p className="text-[11px] text-[var(--app-muted)]">Tambahkan kuota kecepatan boost untuk siklus tagihan berjalan.</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCustomAddon(Math.max(0, customAddon - 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-white font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-white">+{customAddon * 10} Mbps ({customAddon} slot)</span>
                      <button
                        type="button"
                        onClick={() => setCustomAddon(customAddon + 1)}
                        className="w-8 h-8 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)] text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Static Public IP Addon</span>
                      <span className="text-xs font-bold text-blue-400">Rp 75.000 / IP</span>
                    </div>
                    <p className="text-[11px] text-[var(--app-muted)]">Alokasikan 1 alamat IP Publik statis khusus untuk pelanggan ini.</p>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={isPublicIpIncluded}
                        onChange={(e) => setIsPublicIpIncluded(e.target.checked)}
                        className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-white">Sertakan Static IP Publik</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--app-border)]">
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white rounded-xl text-xs font-bold"
                  >
                    <ChevronLeft size={14} />
                    <span>Kembali ke Step 1</span>
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                  >
                    <span>Lanjut ke Step 3 (Periode & Jatuh Tempo)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PERIODE & JATUH TEMPO */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--app-text)]">Step 3 - Periode & Jatuh Tempo Tagihan</h2>
                  <p className="text-xs text-[var(--app-muted)]">Atur tanggal penerbitan invoice, batas pembayaran, dan grace period isolir otomatis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--app-muted)] block mb-1">Periode Penagihan</label>
                    <input
                      type="text"
                      value={billingPeriod}
                      onChange={(e) => setBillingPeriod(e.target.value)}
                      placeholder="Contoh: November 2026"
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-2.5 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--app-muted)] block mb-1">Tanggal Terbit Invoice</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-2.5 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--app-muted)] block mb-1">Tanggal Jatuh Tempo (Due Date)</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-2.5 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--app-muted)] block mb-1">Grace Period Isolir Otomatis (Hari)</label>
                    <input
                      type="number"
                      value={gracePeriodDays}
                      onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-2.5 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-400">
                  Pelanggan akan otomatis menerima notifikasi pengingat H-3 sebelum jatuh tempo, dan isolir otomatis aktif pada hari ke-{gracePeriodDays} setelah jatuh tempo jika belum lunas.
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--app-border)]">
                  <button 
                    onClick={() => setCurrentStep(2)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white rounded-xl text-xs font-bold"
                  >
                    <ChevronLeft size={14} />
                    <span>Kembali ke Step 2</span>
                  </button>
                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                  >
                    <span>Lanjut ke Step 4 (Diskon & Pajak)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DISKON & PAJAK */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--app-text)]">Step 4 - Diskon & Pajak Pertambahan Nilai</h2>
                  <p className="text-xs text-[var(--app-muted)]">Berikan potongan promosi atau sesuaikan penerapan PPN 11% sesuai jenis pelanggan</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--app-muted)] block mb-1">Nominal Diskon Promo (IDR)</label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-[var(--app-bg)] border border-[var(--app-border)] text-xs p-2.5 rounded-xl text-white font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="p-4 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Terapkan Pajak Pertambahan Nilai (PPN 11%)</p>
                      <p className="text-[10px] text-[var(--app-muted)]">Otomatis mencantumkan PPN 11% dan menghasilkan faktur pajak standar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPpnEnabled}
                        onChange={(e) => setIsPpnEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {totalTagihan >= 5000000 && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-400">
                      Total tagihan mencapai Rp 5.000.000 atau lebih. Bea Materai elektronik senilai <strong>Rp 10.000</strong> akan otomatis ditambahkan sesuai UU Bea Meterai.
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--app-border)]">
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white rounded-xl text-xs font-bold"
                  >
                    <ChevronLeft size={14} />
                    <span>Kembali ke Step 3</span>
                  </button>
                  <button 
                    onClick={() => setCurrentStep(5)}
                    className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                  >
                    <span>Lanjut ke Step 5 (Preview Invoice)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PREVIEW INVOICE */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--app-text)]">Step 5 - Pratinjau Invoice Digital</h2>
                  <p className="text-xs text-[var(--app-muted)]">Periksa rincian sebelum menerbitkan dokumen tagihan resmi ke sistem</p>
                </div>

                {/* Digital Invoice Preview Mock */}
                <div className="p-6 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-2xl space-y-4">
                  <div className="flex justify-between items-start border-b border-[var(--app-border)] pb-4">
                    <div>
                      <h3 className="text-lg font-black text-white">AUDIRA NETWORK</h3>
                      <p className="text-xs text-[var(--app-muted)]">Layanan Internet & Jaringan Berkecepatan Tinggi</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-bold">
                        PROFORMA DRAFT
                      </span>
                      <p className="text-xs font-mono font-bold text-white mt-1">INV/2026/11/{Math.floor(1000 + Math.random() * 9000)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] text-[var(--app-muted)] uppercase font-bold">Ditujukan Kepada</p>
                      <p className="font-bold text-white mt-0.5">{primaryCustomer.name}</p>
                      <p className="text-[var(--app-muted)]">{primaryCustomer.customerNo}</p>
                      <p className="text-[var(--app-muted)]">{primaryCustomer.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[var(--app-muted)] uppercase font-bold">Informasi Penagihan</p>
                      <p className="font-bold text-white mt-0.5">Periode: {billingPeriod}</p>
                      <p className="text-[var(--app-muted)]">Tgl Terbit: {invoiceDate}</p>
                      <p className="text-red-400 font-bold">Jatuh Tempo: {dueDate}</p>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="border border-[var(--app-border)] rounded-xl overflow-hidden mt-3">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[var(--app-border)]/20 border-b border-[var(--app-border)] text-[10px] font-bold text-[var(--app-muted)] uppercase">
                          <th className="p-3">DESKRIPSI ITEM</th>
                          <th className="p-3 text-right">JUMLAH</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--app-border)]">
                        <tr>
                          <td className="p-3 text-white font-medium">Langganan Internet: {primaryCustomer.activePackage} ({primaryCustomer.speed})</td>
                          <td className="p-3 text-right font-bold text-white">{formatCurrency(primaryCustomer.price)}</td>
                        </tr>
                        {customAddon > 0 && (
                          <tr>
                            <td className="p-3 text-white font-medium">Addon Bandwidth Turbo (+{customAddon * 10} Mbps)</td>
                            <td className="p-3 text-right font-bold text-white">{formatCurrency(customAddon * 50000)}</td>
                          </tr>
                        )}
                        {isPublicIpIncluded && (
                          <tr>
                            <td className="p-3 text-white font-medium">Addon Static Public IP</td>
                            <td className="p-3 text-right font-bold text-white">{formatCurrency(75000)}</td>
                          </tr>
                        )}
                        {discountAmount > 0 && (
                          <tr>
                            <td className="p-3 text-green-400 font-medium">Potongan Diskon Promo</td>
                            <td className="p-3 text-right font-bold text-green-400">-{formatCurrency(discountAmount)}</td>
                          </tr>
                        )}
                        {isPpnEnabled && (
                          <tr>
                            <td className="p-3 text-[var(--app-muted)] font-medium">Pajak Pertambahan Nilai (PPN 11%)</td>
                            <td className="p-3 text-right font-bold text-[var(--app-muted)]">{formatCurrency(totalPPN)}</td>
                          </tr>
                        )}
                        {materai > 0 && (
                          <tr>
                            <td className="p-3 text-[var(--app-muted)] font-medium">Bea Materai Lunas</td>
                            <td className="p-3 text-right font-bold text-[var(--app-muted)]">{formatCurrency(materai)}</td>
                          </tr>
                        )}
                        <tr className="bg-blue-500/10 font-black text-sm">
                          <td className="p-3 text-white">TOTAL PEMBAYARAN</td>
                          <td className="p-3 text-right text-blue-400">{formatCurrency(totalAkhir)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--app-border)]">
                  <button 
                    onClick={() => setCurrentStep(4)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white rounded-xl text-xs font-bold"
                  >
                    <ChevronLeft size={14} />
                    <span>Kembali ke Step 4</span>
                  </button>
                  <button 
                    onClick={() => setCurrentStep(6)}
                    className="flex items-center gap-2 bg-[#0052cc] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                  >
                    <span>Lanjut ke Step 6 (Final Generate)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: GENERATE INVOICE */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--app-text)]">Step 6 - Terbitkan & Kirim Invoice</h2>
                  <p className="text-xs text-[var(--app-muted)]">Eksekusi penerbitan invoice resmi dan otomatisasi pengiriman ke pelanggan</p>
                </div>

                <div className="p-6 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-2xl text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mx-auto flex items-center justify-center">
                    <Zap size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Siap Menerbitkan {selectedCustomers.length} Dokumen Invoice</h3>
                    <p className="text-xs text-[var(--app-muted)] max-w-md mx-auto">
                      Invoice akan otomatis tercatat di modul billing, menghasilkan virtual account pembayaran, dan memperbarui riwayat tagihan pelanggan.
                    </p>
                  </div>

                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2.5 p-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendWhatsAppDirectly}
                        onChange={(e) => setSendWhatsAppDirectly(e.target.checked)}
                        className="rounded bg-[var(--app-bg)] border-[var(--app-border)] text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-white">
                        Kirim notifikasi tagihan via WhatsApp & link PDF secara otomatis
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--app-border)]">
                  <button 
                    onClick={() => setCurrentStep(5)} 
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--app-border)] text-[var(--app-muted)] hover:text-white rounded-xl text-xs font-bold"
                  >
                    <ChevronLeft size={14} />
                    <span>Kembali ke Step 5</span>
                  </button>
                  <button 
                    onClick={handleFinalGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl text-xs font-bold shadow-lg shadow-green-600/20 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span>Memproses Penerbitan Invoice...</span>
                    ) : (
                      <>
                        <Zap size={14} />
                        <span>Terbitkan & Generate Invoice Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Side: Sidebar Ringkasan */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Ringkasan Customer */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                Ringkasan Customer ( {selectedIds.length} Dipilih )
              </h3>

              {primaryCustomer && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div className="space-y-1.5 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[var(--app-text)] text-sm">{primaryCustomer.name}</p>
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                        Aktif
                      </span>
                    </div>
                    <p className="font-semibold text-[var(--app-muted)]">{primaryCustomer.customerNo}</p>
                    <p className="text-[var(--app-muted)] font-medium flex items-center gap-1.5"><Phone size={11} className="shrink-0" /><span>{primaryCustomer.phone}</span></p>
                    <p className="text-[var(--app-muted)] leading-relaxed flex items-center gap-1.5"><MapPin size={11} className="shrink-0" /><span>{primaryCustomer.address}</span></p>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Informasi Package */}
            {primaryCustomer && (
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--app-border)] pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider block">Informasi Package</span>
                    <h4 className="font-bold text-[var(--app-text)] text-xs">{primaryCustomer.activePackage}</h4>
                  </div>
                  <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    Home
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[var(--app-muted)] font-medium">
                    <span>Kecepatan Dasar</span>
                    <span className="text-[var(--app-text)] font-bold">{primaryCustomer.speed}</span>
                  </div>
                  {customAddon > 0 && (
                    <div className="flex justify-between text-blue-400 font-medium">
                      <span>Addon Bandwidth</span>
                      <span className="font-bold">+{customAddon * 10} Mbps</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--app-muted)] font-medium">
                    <span>IP Publik Statis</span>
                    <span className="text-[var(--app-text)] font-bold">{isPublicIpIncluded ? 'Ya (Aktif)' : 'Tidak'}</span>
                  </div>
                  <div className="flex justify-between text-[#a0aec0] font-medium border-t border-[var(--app-border)]/60 pt-2.5">
                    <span>Biaya Dasar Bulanan</span>
                    <span className="text-[var(--app-text)] font-bold">{formatCurrency(primaryCustomer.price)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--app-muted)] font-medium">
                    <span>Tagihan Berikutnya</span>
                    <span className="text-[var(--app-text)] font-bold">{primaryCustomer.nextBilling}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: Ringkasan Generate */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">Ringkasan Generate</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[var(--app-muted)] font-medium">
                  <span>Jumlah Customer</span>
                  <span className="text-[var(--app-text)] font-bold">{selectedIds.length}</span>
                </div>
                <div className="flex justify-between text-[var(--app-muted)] font-medium">
                  <span>Total Tagihan Layanan</span>
                  <span className="text-[var(--app-text)] font-bold">{formatCurrency(totalTagihan)}</span>
                </div>
                {totalDiskon > 0 && (
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Total Diskon</span>
                    <span className="font-bold">-{formatCurrency(totalDiskon)}</span>
                  </div>
                )}
                {isPpnEnabled && (
                  <div className="flex justify-between text-[var(--app-muted)] font-medium">
                    <span>Total PPN (11%)</span>
                    <span className="text-[var(--app-text)] font-bold">{formatCurrency(totalPPN)}</span>
                  </div>
                )}
                {materai > 0 && (
                  <div className="flex justify-between text-[var(--app-muted)] font-medium">
                    <span>Bea Materai Elektronik</span>
                    <span className="text-[var(--app-text)] font-bold">{formatCurrency(materai)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white font-extrabold border-t border-[var(--app-border)] pt-3 mt-1 text-sm">
                  <span>Total Akhir</span>
                  <span className="text-blue-400 text-base font-black">{formatCurrency(totalAkhir)}</span>
                </div>
              </div>
            </div>

            {/* Warning Message Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 text-blue-400 leading-relaxed">
              <Info size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold">
                Setelah semua step selesai, invoice akan dibuat dan diterbitkan langsung ke sistem penagihan pelanggan AUDIRA.
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-4.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-[#0052cc]/10 text-[#0052cc] rounded-lg">
                <Lightbulb size={16} />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-[var(--app-text)]">Tips Fleksibilitas</h5>
                <p className="text-[10px] text-[var(--app-muted)] font-medium leading-relaxed">
                  Anda dapat memilih multiple customer dengan mencentang kotak pelanggan sekaligus untuk penerbitan batch invoice.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}