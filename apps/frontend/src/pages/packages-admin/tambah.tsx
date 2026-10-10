import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { 
  ArrowLeft, 
  Calendar, 
  Bell, 
  Mail, 
  Maximize2, 
  Check, 
  X, 
  Info,
  Download,
  Upload as UploadIcon,
  ChevronDown,
  Percent,
  Sparkles,
  Search
} from 'lucide-react';

interface PackageFormData {
  name: string;
  category: string;
  type: string;
  description: string;
  downloadSpeed: number;
  downloadUnit: string;
  uploadSpeed: number;
  uploadUnit: string;
  speedType: string;
  quota: string;
  fup: string;
  setupFee: number;
  price: number;
  period: string;
  taxRate: number;
  discount: number;
  isTaxIncluded: boolean;
  status: boolean;
  showOnApp: boolean;
  maxCustomers: number;
  priority: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';

export default function TambahPackagePage() {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    category: 'Internet',
    type: 'Broadband',
    description: '',
    downloadSpeed: 50,
    downloadUnit: 'Mbps',
    uploadSpeed: 50,
    uploadUnit: 'Mbps',
    speedType: 'Simetris (Download = Upload)',
    quota: 'Unlimited',
    fup: '',
    setupFee: 150000,
    price: 375000,
    period: 'Bulanan',
    taxRate: 11,
    discount: 0,
    isTaxIncluded: true,
    status: true,
    showOnApp: true,
    maxCustomers: 0,
    priority: 'Normal'
  });

  // Automatically update upload speed if set to symmetrical
  useEffect(() => {
    if (formData.speedType.startsWith('Simetris')) {
      setFormData(prev => ({
        ...prev,
        uploadSpeed: prev.downloadSpeed,
        uploadUnit: prev.downloadUnit
      }));
    }
  }, [formData.downloadSpeed, formData.downloadUnit, formData.speedType]);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleToggleChange = (name: keyof PackageFormData) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Math Calculations
  const discountAmount = Math.round((formData.price * formData.discount) / 100);
  const priceAfterDiscount = formData.price - discountAmount;
  
  // Tax calculations:
  // If tax is included, total monthly billing is the price after discount.
  // The tax amount is calculated out of that total.
  // If tax is not included, tax is added on top of the price after discount.
  const taxAmount = Math.round(formData.isTaxIncluded 
    ? priceAfterDiscount - (priceAfterDiscount / (1 + formData.taxRate / 100))
    : priceAfterDiscount * (formData.taxRate / 100));

  const totalMonthlyBilling = Math.round(formData.isTaxIncluded 
    ? priceAfterDiscount 
    : priceAfterDiscount + taxAmount);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nama package wajib diisi';
    if (formData.price < 0) errors.price = 'Harga tidak boleh kurang dari 0';
    if (formData.downloadSpeed <= 0) errors.downloadSpeed = 'Kecepatan download harus lebih dari 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      const payload = {
        name: formData.name,
        price: totalMonthlyBilling, // store total monthly billing or base price depending on requirements
        speed: `${formData.downloadSpeed} ${formData.downloadUnit}`,
        description: formData.description || `Kategori: ${formData.category}, Tipe: ${formData.type}`,
        status: formData.status ? 'active' : 'inactive'
      };

      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/packages-admin');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Gagal menyimpan package'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6">
        
        {/* ─── Top Header bar ────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#131d35] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>Home</span>
              <span>&gt;</span>
              <span>Package</span>
              <span>&gt;</span>
              <span className="text-blue-400">Tambah Package</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tambah Package</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Calendar */}
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-2 rounded-xl text-xs text-gray-300">
              <Calendar size={14} className="text-blue-400" />
              <span>01 Juli 2026</span>
              <span className="text-[10px] text-gray-500">08:35 WIB</span>
            </div>
            
            {/* Status Sistem */}
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-2 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-400">Status Sistem</span>
              <span className="text-green-400 font-bold">Normal</span>
            </div>

            {/* Global Search */}
            <div className="relative w-full sm:w-60">
              <SearchIcon />
            </div>

            {/* Icons & Profile */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors">
                <Bell size={16} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">12</span>
              </button>
              <button className="relative p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors">
                <Mail size={16} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full scale-75">8</span>
              </button>
              <button className="p-2 bg-[#0b1329] border border-[#131d35] rounded-xl hover:bg-[#121c38] transition-colors max-sm:hidden">
                <Maximize2 size={16} className="text-gray-400" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-[#131d35]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  <span>AR</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-white">Agus Dwi Rianto</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Back to Package Link ──────────────────────────────────────── */}
        <div className="flex justify-end">
          <button 
            onClick={() => router.push('/packages-admin')}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-[#0b1329] border border-[#131d35] px-4 py-2.5 rounded-xl transition-all"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Package</span>
          </button>
        </div>

        {/* ─── Main Form Grid ────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column forms */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Card 1: Informasi Dasar */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white tracking-wider uppercase border-b border-[#131d35] pb-3">Informasi Dasar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Nama Package <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Home 50 Mbps"
                    className={`w-full bg-[#080d19] border text-xs px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 ${formErrors.name ? 'border-red-500' : 'border-[#131d35]'}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] mt-1.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Kategori <span className="text-red-500">*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Internet">Internet</option>
                    <option value="Combo">Combo</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Tipe Package <span className="text-red-500">*</span></label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Broadband">Broadband</option>
                    <option value="Dedicated">Dedicated</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                  <span>Deskripsi</span>
                  <span className="text-[10px] text-gray-500">{formData.description.length} / 255</span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={255}
                  rows={4}
                  placeholder="Deskripsi package (optional)"
                  className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Card 2: Kecepatan & Kuota */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white tracking-wider uppercase border-b border-[#131d35] pb-3">Kecepatan & Kuota</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Download Speed <span className="text-red-500">*</span></label>
                  <div className="flex border border-[#131d35] rounded-xl overflow-hidden bg-[#080d19]">
                    <input
                      type="number"
                      name="downloadSpeed"
                      value={formData.downloadSpeed}
                      onChange={handleNumberChange}
                      className="w-full bg-transparent text-xs px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
                    />
                    <select
                      name="downloadUnit"
                      value={formData.downloadUnit}
                      onChange={handleInputChange}
                      className="bg-[#0c152a] text-xs text-gray-300 px-3 py-3 border-l border-[#131d35] focus:outline-none"
                    >
                      <option value="Mbps">Mbps</option>
                      <option value="Kbps">Kbps</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Upload Speed <span className="text-red-500">*</span></label>
                  <div className="flex border border-[#131d35] rounded-xl overflow-hidden bg-[#080d19]">
                    <input
                      type="number"
                      name="uploadSpeed"
                      value={formData.uploadSpeed}
                      onChange={handleNumberChange}
                      disabled={formData.speedType.startsWith('Simetris')}
                      className={`w-full bg-transparent text-xs px-4 py-3 text-white placeholder-gray-600 focus:outline-none ${formData.speedType.startsWith('Simetris') ? 'opacity-55 cursor-not-allowed' : ''}`}
                    />
                    <select
                      name="uploadUnit"
                      value={formData.uploadUnit}
                      onChange={handleInputChange}
                      disabled={formData.speedType.startsWith('Simetris')}
                      className={`bg-[#0c152a] text-xs text-gray-300 px-3 py-3 border-l border-[#131d35] focus:outline-none ${formData.speedType.startsWith('Simetris') ? 'opacity-55 cursor-not-allowed' : ''}`}
                    >
                      <option value="Mbps">Mbps</option>
                      <option value="Kbps">Kbps</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Tipe Kecepatan</label>
                  <select
                    name="speedType"
                    value={formData.speedType}
                    onChange={handleInputChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Simetris (Download = Upload)">Simetris (Download = Upload)</option>
                    <option value="Asimetris">Asimetris</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Kuota <span className="text-red-500">*</span></label>
                  <select
                    name="quota"
                    value={formData.quota}
                    onChange={handleInputChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Unlimited">Unlimited</option>
                    <option value="FUP (Fair Usage Policy)">FUP (Fair Usage Policy)</option>
                  </select>
                </div>

                <div className="md:col-span-8">
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                    <span>Fair Usage Policy (Optional)</span>
                    <span className="text-[10px] text-gray-500">{formData.fup.length} / 255</span>
                  </div>
                  <textarea
                    name="fup"
                    value={formData.fup}
                    onChange={handleInputChange}
                    maxLength={255}
                    rows={2}
                    placeholder="Contoh: Setelah 500GB, kecepatan akan diturunkan menjadi 5 Mbps"
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-2.5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Harga & Biaya */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white tracking-wider uppercase border-b border-[#131d35] pb-3">Harga & Biaya</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Biaya Pasang <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="setupFee"
                    value={formData.setupFee}
                    onChange={handleNumberChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Harga / Periode <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Periode <span className="text-red-500">*</span></label>
                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Bulanan">Bulanan</option>
                    <option value="Mingguan">Mingguan</option>
                    <option value="Harian">Harian</option>
                    <option value="Tahunan">Tahunan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">PPN (%)</label>
                  <div className="flex border border-[#131d35] rounded-xl overflow-hidden bg-[#080d19]">
                    <input
                      type="number"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleNumberChange}
                      className="w-full bg-transparent text-xs px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
                    />
                    <span className="bg-[#0c152a] text-xs text-gray-500 px-3 py-3 border-l border-[#131d35] flex items-center">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Diskon (Optional)</label>
                  <div className="flex border border-[#131d35] rounded-xl overflow-hidden bg-[#080d19]">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleNumberChange}
                      className="w-full bg-transparent text-xs px-4 py-3 text-white placeholder-gray-600 focus:outline-none"
                    />
                    <span className="bg-[#0c152a] text-xs text-gray-500 px-3 py-3 border-l border-[#131d35] flex items-center">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Harga Setelah Diskon</label>
                  <input
                    type="text"
                    disabled
                    value={formatCurrency(priceAfterDiscount)}
                    className="w-full bg-[#080d19]/60 border border-[#131d35] text-xs px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => handleToggleChange('isTaxIncluded')}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${formData.isTaxIncluded ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full absolute transition-all ${formData.isTaxIncluded ? 'right-1' : 'left-1'}`} />
                  </button>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-gray-300 block">Pajak Termasuk</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Harga sudah termasuk pajak PPN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Pengaturan */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white tracking-wider uppercase border-b border-[#131d35] pb-3">Pengaturan</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-gray-400">Status Package</span>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleChange('status')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${formData.status ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      <span className={`w-4 h-4 bg-white rounded-full absolute transition-all ${formData.status ? 'right-1' : 'left-1'}`} />
                    </button>
                    <span className="text-xs font-semibold text-gray-300">{formData.status ? 'Aktif' : 'Non Aktif'}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block leading-relaxed">Package dapat digunakan oleh customer</span>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-gray-400">Tampilkan di Web/APP</span>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleChange('showOnApp')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${formData.showOnApp ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      <span className={`w-4 h-4 bg-white rounded-full absolute transition-all ${formData.showOnApp ? 'right-1' : 'left-1'}`} />
                    </button>
                    <span className="text-xs font-semibold text-gray-300">{formData.showOnApp ? 'Ya' : 'Tidak'}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block leading-relaxed">Package dapat ditampilkan di halaman publik</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Maks. Customer (Optional)</label>
                  <input
                    type="number"
                    name="maxCustomers"
                    value={formData.maxCustomers}
                    onChange={handleNumberChange}
                    placeholder="0"
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 block mt-1.5 leading-relaxed">Kosongkan atau 0 untuk tidak ada batasan</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Prioritas</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-[#080d19] border border-[#131d35] text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                  <span className="text-[10px] text-gray-500 block mt-1.5 leading-relaxed">Tinggi, Normal, Rendah</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3.5 border-t border-[#131d35] pt-5">
              <button
                type="button"
                onClick={() => router.push('/packages-admin')}
                className="px-5 py-2.5 border border-[#131d35] hover:bg-[#121c38] rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10"
              >
                {formLoading ? 'Menyimpan...' : 'Simpan Package'}
              </button>
            </div>

          </div>

          {/* ─── Right Column: Preview ─────────────────────────────────────── */}
          <div className="lg:col-span-3 bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 space-y-5">
            <div className="flex justify-between items-center border-b border-[#131d35] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Preview Package</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${formData.status ? 'bg-green-500/10 text-green-400 border border-green-500/25' : 'bg-gray-500/10 text-gray-400'}`}>
                {formData.status ? 'Aktif' : 'Non Aktif'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-black text-white leading-tight break-words">
                  {formData.name || 'Nama Package'}
                </h4>
                <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/25 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2.5">
                  {formData.category}
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed break-words">
                {formData.description || 'Internet cepat dan stabil untuk kebutuhan rumah tangga dan bisnis kecil.'}
              </p>

              {/* Speeds */}
              <div className="grid grid-cols-2 gap-3.5 bg-[#080d19] border border-[#131d35] p-3.5 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Download size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{formData.downloadSpeed} {formData.downloadUnit}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Download</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                    <UploadIcon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{formData.uploadSpeed} {formData.uploadUnit}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Upload</p>
                  </div>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-2.5 border-t border-b border-[#131d35] py-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kuota</span>
                  <span className="font-semibold text-white">{formData.quota}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipe Kecepatan</span>
                  <span className="font-semibold text-white">{formData.speedType.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Periode</span>
                  <span className="font-semibold text-white">{formData.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Biaya Pasang</span>
                  <span className="font-bold text-white">{formatCurrency(formData.setupFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Harga / Bulan</span>
                  <span className="font-bold text-white">{formatCurrency(formData.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PPN ({formData.taxRate}%)</span>
                  <span className="font-bold text-white">{formatCurrency(taxAmount)}</span>
                </div>
              </div>

              {/* Total Card */}
              <div className="bg-[#101935]/40 border border-blue-500/25 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total / Bulan</span>
                <p className="text-2xl font-black text-white">{formatCurrency(totalMonthlyBilling)}</p>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Fitur yang didapatkan</h5>
                <ul className="space-y-2 text-xs">
                  {[
                    'Internet stabil & cepat',
                    'Free maintenance',
                    'Support 24/7',
                    'Akses ke semua layanan'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center scale-90">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      <span className="text-gray-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </form>

      </div>
    </Layout>
  );
}

// Small Search component mock to prevent syntax/import issues
function SearchIcon() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input 
        type="text" 
        placeholder="Cari customer, invoice, tagihan..."
        className="w-full bg-[#0b1329] border border-[#131d35] rounded-xl text-xs pl-9 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
