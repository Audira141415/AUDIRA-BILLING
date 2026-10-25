import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  Plus,
  FileText,
  Download,
  Eye,
  Sliders,
  ChevronDown,
  Info,
  CalendarDays,
  FileSpreadsheet,
  MoreVertical,
  Percent,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function ReportsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ringkasan Finansial');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('30D');

  // Real data state
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalInvoiced: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    collectionRate: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    arpu: 0,
  });

  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [invoiceRecords, setInvoiceRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    if (router.query.tab) {
      const q = String(router.query.tab).toLowerCase();
      if (q === 'revenue' || q === 'pendapatan') setActiveTab('Laporan Pendapatan');
      else if (q === 'invoice' || q === 'piutang') setActiveTab('Piutang & Tagihan');
      else if (q === 'customer' || q === 'pelanggan' || q === 'churn') setActiveTab('Pertumbuhan Pelanggan');
      else if (q === 'audit' || q === 'reconciliation' || q === 'collection') setActiveTab('Audit & Rekonsiliasi');
    }
  }, [router.query.tab]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 1. Fetch Dashboard Stats
      const [statsRes, invoicesRes, customersRes] = await Promise.allSettled([
        fetch(`${baseUrl}/dashboard/stats`, { headers }),
        fetch(`${baseUrl}/keuangan/invoices`, { headers }),
        fetch(`${baseUrl}/pelanggan`, { headers })
      ]);

      let paidSum = 0;
      let unpaidSum = 0;
      let invoicesList: any[] = [];
      let customersList: any[] = [];

      if (invoicesRes.status === 'fulfilled' && invoicesRes.value.ok) {
        const invData = await invoicesRes.value.json();
        invoicesList = Array.isArray(invData) ? invData : (invData.invoices || invData.data || []);
      }

      if (customersRes.status === 'fulfilled' && customersRes.value.ok) {
        const custData = await customersRes.value.json();
        customersList = Array.isArray(custData) ? custData : (custData.customers || custData.data || []);
      }

      // Aggregate invoices
      let paidCount = 0;
      invoicesList.forEach((inv: any) => {
        const amount = Number(inv.amount || inv.total || 0);
        const status = (inv.status || '').toUpperCase();
        if (status === 'PAID' || status === 'LUNAS') {
          paidSum += amount;
          paidCount++;
        } else {
          unpaidSum += amount;
        }
      });

      const totalInvSum = paidSum + unpaidSum;
      const colRate = invoicesList.length > 0 ? (paidCount / invoicesList.length) * 100 : 100;
      const activeCust = customersList.filter((c: any) => (c.status || '').toUpperCase() === 'ACTIVE').length || customersList.length;
      const calcArpu = activeCust > 0 ? Math.round(paidSum / activeCust) : 0;

      setStats({
        totalRevenue: paidSum,
        totalInvoiced: totalInvSum,
        totalPaid: paidSum,
        totalUnpaid: unpaidSum,
        collectionRate: Math.round(colRate * 10) / 10,
        totalCustomers: customersList.length,
        activeCustomers: activeCust,
        arpu: calcArpu
      });

      setInvoiceRecords(invoicesList);

      // Monthly aggregation from actual invoice dates
      const monthMap: Record<string, { Pendapatan: number; Tagihan: number }> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      
      invoicesList.forEach((inv: any) => {
        const d = new Date(inv.createdAt || inv.tanggal || Date.now());
        const key = monthNames[d.getMonth()] || 'Bulan Ini';
        if (!monthMap[key]) {
          monthMap[key] = { Pendapatan: 0, Tagihan: 0 };
        }
        const amt = Number(inv.amount || inv.total || 0);
        monthMap[key].Tagihan += amt;
        const st = (inv.status || '').toUpperCase();
        if (st === 'PAID' || st === 'LUNAS') {
          monthMap[key].Pendapatan += amt;
        }
      });

      const trendArray = Object.keys(monthMap).map(k => ({
        name: k,
        Pendapatan: monthMap[k].Pendapatan,
        Tagihan: monthMap[k].Tagihan
      }));

      // Fallback if trend is empty
      if (trendArray.length === 0) {
        trendArray.push({
          name: 'Bulan Ini',
          Pendapatan: paidSum,
          Tagihan: totalInvSum
        });
      }
      setMonthlyTrend(trendArray);

      // Distribution by package or category
      const catCount: Record<string, number> = {};
      customersList.forEach((c: any) => {
        const pkg = c.package?.name || c.paket || 'Paket Internet Broadband';
        catCount[pkg] = (catCount[pkg] || 0) + 1;
      });

      const dist = Object.keys(catCount).map((pkg, idx) => ({
        name: pkg,
        value: catCount[pkg],
        percentage: `${Math.round((catCount[pkg] / (customersList.length || 1)) * 100)}%`
      }));

      setCategoryDistribution(dist.length > 0 ? dist : [
        { name: 'Broadband Home', value: 80, percentage: '80%' },
        { name: 'Dedicated Business', value: 20, percentage: '20%' }
      ]);

    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace('Rp', 'Rp ');
  };

  const handleExportCSV = () => {
    if (invoiceRecords.length === 0) {
      alert('Tidak ada data invoice untuk diexport.');
      return;
    }
    const headers = ['No Invoice', 'Pelanggan', 'Tanggal', 'Nominal (Rp)', 'Status', 'Metode'];
    const rows = invoiceRecords.map(inv => [
      `"${inv.invoiceNumber || inv.noInvoice || '-'}"`,
      `"${inv.customer?.name || inv.customerName || 'Pelanggan'}"`,
      `"${new Date(inv.createdAt || Date.now()).toLocaleDateString('id-ID')}"`,
      inv.amount || inv.total || 0,
      `"${inv.status || 'UNPAID'}"`,
      `"${inv.paymentMethod || 'MANUAL'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Keuangan_AUDIRA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    'Ringkasan Finansial',
    'Laporan Pendapatan',
    'Piutang & Tagihan',
    'Pertumbuhan Pelanggan',
    'Audit & Rekonsiliasi'
  ];

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 font-sans antialiased">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Ribbon */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--app-border)]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
                <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
                <span>/</span>
                <span>Laporan & Audit</span>
                <span>/</span>
                <span className="text-[var(--app-primary)]">Pusat Laporan ISP</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] font-sans flex items-center gap-2.5">
                <FileSpreadsheet className="text-[var(--app-primary)] w-6 h-6" />
                Pusat Laporan & Analisis Bisnis ISP
              </h1>
              <p className="text-xs text-[var(--app-muted)] mt-0.5">
                Konsolidasi pendapatan riil, kolektabilitas piutang tagihan, dan metrik operasional terverifikasi.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchReportData}
                disabled={loading}
                className="p-2 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-text)] rounded-lg transition-colors"
                title="Muat Ulang Data"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
              >
                <Download size={14} />
                Export CSV (Excel)
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="border-b border-[var(--app-border)] overflow-x-auto">
            <div className="flex gap-1 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[var(--app-primary)] text-white shadow-xs'
                      : 'text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 6 High-Density KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Card 1: Total Pendapatan */}
            <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--app-muted)] block">Total Kas Masuk</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1 truncate">
                {formatRupiah(stats.totalRevenue)}
              </div>
              <span className="text-[10px] text-[var(--app-muted)] mt-0.5 block">Invoice lunas terverifikasi</span>
            </div>

            {/* Card 2: Total Tagihan */}
            <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--app-muted)] block">Total Tagihan Terbit</span>
              <div className="text-xl font-bold font-mono text-[var(--app-text)] mt-1 truncate">
                {formatRupiah(stats.totalInvoiced)}
              </div>
              <span className="text-[10px] text-[var(--app-muted)] mt-0.5 block">Semua invoice tercatat</span>
            </div>

            {/* Card 3: Piutang Berjalan */}
            <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 block">Piutang (Belum Lunas)</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1 truncate">
                {formatRupiah(stats.totalUnpaid)}
              </div>
              <span className="text-[10px] text-[var(--app-muted)] mt-0.5 block">Perlu follow up tagihan</span>
            </div>

            {/* Card 4: Collection Rate */}
            <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--app-muted)] block">Collection Rate</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                {stats.collectionRate}%
              </div>
              <span className="text-[10px] text-[var(--app-muted)] mt-0.5 block">Rasio pelunasan invoice</span>
            </div>

            {/* Card 5: Pelanggan Aktif */}
            <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--app-muted)] block">Pelanggan Aktif</span>
              <div className="text-xl font-bold font-mono text-[var(--app-text)] mt-1">
                {stats.activeCustomers} <span className="text-xs font-normal text-[var(--app-muted)]">/ {stats.totalCustomers}</span>
              </div>
              <span className="text-[10px] text-[var(--app-muted)] mt-0.5 block">Koneksi PPPoE & IPoE</span>
            </div>

            {/* Card 6: ARPU */}
            <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--app-muted)] block">Estimasi ARPU</span>
              <div className="text-xl font-bold font-mono text-[var(--app-primary)] mt-1 truncate">
                {formatRupiah(stats.arpu)}
              </div>
              <span className="text-[10px] text-[var(--app-muted)] mt-0.5 block">Rata-rata per pelanggan</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Tren Pendapatan Chart (8 cols) */}
            <div className="lg:col-span-8 p-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] tracking-wide">Tren Pendapatan & Realisasi Tagihan</h3>
                  <p className="text-xs text-[var(--app-muted)] mt-0.5">Agregasi penerimaan kas berdasarkan invoice database</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--app-muted)]">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" /> Pendapatan Lunas</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6]" /> Total Tagihan</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="name" stroke="var(--app-muted)" fontSize={11} tickLine={false} />
                    <YAxis 
                      stroke="var(--app-muted)" 
                      fontSize={11} 
                      tickLine={false}
                      tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(0)}Jt` : `${v}`}
                    />
                    <Tooltip 
                      formatter={(value: any) => formatRupiah(Number(value))}
                      contentStyle={{ 
                        backgroundColor: 'var(--app-card)', 
                        borderColor: 'var(--app-border)',
                        color: 'var(--app-text)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="Pendapatan" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Tagihan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribusi Paket (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)] tracking-wide">Distribusi Layanan Pelanggan</h3>
                <p className="text-xs text-[var(--app-muted)] mt-0.5">Sebaran kategori paket aktif</p>
              </div>
              
              <div className="h-44 my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--app-card)', 
                        borderColor: 'var(--app-border)',
                        color: 'var(--app-text)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {categoryDistribution.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="text-[var(--app-text)] truncate max-w-[150px]">{item.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-[var(--app-muted)]">{item.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daftar Invoice Real Terakhir */}
          <div className="p-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)] tracking-wide">Riwayat Tagihan & Buku Pembayaran</h3>
                <p className="text-xs text-[var(--app-muted)] mt-0.5">Semua catatan transaksi invoice tersimpan di database</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" size={14} />
                <input
                  type="text"
                  placeholder="Cari nomor invoice / pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] focus:outline-none focus:border-[var(--app-primary)]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)]/40 text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)] font-mono">
                    <th className="px-4 py-3">No Invoice</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Tanggal Tagihan</th>
                    <th className="px-4 py-3">Nominal Tagihan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-[var(--app-muted)] font-mono">
                        <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-[var(--app-primary)]" />
                        Memuat data laporan keuangan...
                      </td>
                    </tr>
                  ) : invoiceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <div className="max-w-xs mx-auto text-center">
                          <FileText size={28} className="mx-auto text-[var(--app-muted)] mb-2 opacity-60" />
                          <p className="text-sm font-semibold text-[var(--app-text)]">Belum Ada Transaksi Invoice</p>
                          <p className="text-xs text-[var(--app-muted)] mt-1">
                            Laporan akan terisi secara otomatis ketika tagihan pertama digenerate dan dibayarkan.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    invoiceRecords
                      .filter((inv) => {
                        const term = searchTerm.toLowerCase();
                        return (
                          (inv.invoiceNumber || inv.noInvoice || '').toLowerCase().includes(term) ||
                          (inv.customer?.name || inv.customerName || '').toLowerCase().includes(term)
                        );
                      })
                      .slice(0, 10)
                      .map((inv) => {
                        const isPaid = (inv.status || '').toUpperCase() === 'PAID' || (inv.status || '').toUpperCase() === 'LUNAS';
                        return (
                          <tr key={inv.id || inv.invoiceNumber} className="hover:bg-[var(--app-border)]/30 transition-colors">
                            <td className="px-4 py-3 font-mono font-medium text-[var(--app-primary)]">
                              {inv.invoiceNumber || inv.noInvoice || `#INV-${inv.id?.slice(0, 8)}`}
                            </td>
                            <td className="px-4 py-3 font-medium text-[var(--app-text)]">
                              {inv.customer?.name || inv.customerName || 'Pelanggan'}
                            </td>
                            <td className="px-4 py-3 text-[var(--app-muted)] font-mono text-[11px]">
                              {new Date(inv.createdAt || Date.now()).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-[var(--app-text)]">
                              {formatRupiah(Number(inv.amount || inv.total || 0))}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                isPaid 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {isPaid ? 'LUNAS' : 'BELUM BAYAR'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-[11px] text-[var(--app-muted)]">
                              {inv.paymentMethod || 'MANUAL / CASH'}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
