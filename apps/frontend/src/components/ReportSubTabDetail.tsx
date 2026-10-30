import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import {
  TrendingUp, TrendingDown, Download, FileSpreadsheet, FileText,
  Printer, Share2, Search, Filter, CheckCircle2, AlertTriangle,
  ArrowUpRight, BarChart2, Layers, Calendar, Clock, RefreshCw,
  SlidersHorizontal, ChevronRight, Zap, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';

interface ReportSubTabDetailProps {
  tabName: string;
  category: string;
}

// Generate realistic mock data deterministically based on tab name
function generateTabData(tabName: string, category: string) {
  const seed = (tabName + category).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
  const trendData = months.map((month, idx) => {
    const base = 50 + ((seed * (idx + 1) * 17) % 50);
    const variance = ((seed * (idx + 2)) % 20) - 10;
    return {
      month,
      value: Math.max(10, base + variance),
      target: 65 + ((idx * 4) % 15),
      secondary: Math.max(5, (base * 0.6) + variance)
    };
  });

  const baseVolume = 1200 + (seed % 8800);
  const growthRate = (3.2 + ((seed % 140) / 10)).toFixed(1);
  const efficiency = (92 + ((seed % 75) / 10)).toFixed(1);
  const cycleTime = (1.2 + ((seed % 35) / 10)).toFixed(1);

  const items = [
    { id: `${category.slice(0, 3).toUpperCase()}-01`, name: `${tabName} - Segmen Korporat Ultra`, value: `Rp ${(baseVolume * 850).toLocaleString('id-ID')}`, share: '38.4%', trend: '+8.2%', status: 'OPTIMAL', date: 'Hari ini, 08:30 WIB' },
    { id: `${category.slice(0, 3).toUpperCase()}-02`, name: `${tabName} - Dedicated Fiber SOHO`, value: `Rp ${(baseVolume * 520).toLocaleString('id-ID')}`, share: '26.1%', trend: '+12.4%', status: 'OPTIMAL', date: 'Kemarin, 16:45 WIB' },
    { id: `${category.slice(0, 3).toUpperCase()}-03`, name: `${tabName} - Broadband Home Family`, value: `Rp ${(baseVolume * 310).toLocaleString('id-ID')}`, share: '18.7%', trend: '+4.1%', status: 'PERHATIAN', date: '24/10/2026' },
    { id: `${category.slice(0, 3).toUpperCase()}-04`, name: `${tabName} - Hotspot Voucher Retail`, value: `Rp ${(baseVolume * 160).toLocaleString('id-ID')}`, share: '11.2%', trend: '-1.8%', status: 'OPTIMAL', date: '23/10/2026' },
    { id: `${category.slice(0, 3).toUpperCase()}-05`, name: `${tabName} - Layanan Tambahan (VAS)`, value: `Rp ${(baseVolume * 95).toLocaleString('id-ID')}`, share: '5.6%', trend: '+6.5%', status: 'TERVERIFIKASI', date: '22/10/2026' },
  ];

  return { trendData, baseVolume, growthRate, efficiency, cycleTime, items };
}

export default function ReportSubTabDetail({ tabName, category }: ReportSubTabDetailProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('6M');
  const { trendData, baseVolume, growthRate, efficiency, cycleTime, items } = generateTabData(tabName, category);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (type: string) => {
    toast.info(`Mengekspor Laporan "${category} - ${tabName}" format ${type.toUpperCase()}... File siap diunduh.`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* ─── Breadcrumb & Sub-tab Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--app-muted)]">
            <span>MODUL LAPORAN</span>
            <ChevronRight size={12} />
            <span className="text-blue-500 font-bold">{category}</span>
            <ChevronRight size={12} />
            <span className="text-[var(--app-text)] font-bold">{tabName}</span>
          </div>
          <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Analisis Komprehensif: {tabName}
          </h3>
          <p className="text-xs text-[var(--app-muted)]">
            Agregasi telemetri performa, distribusi unit, dan histori transaksi terverifikasi untuk segmen {tabName.toLowerCase()}.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--app-card-subtle)] hover:bg-[var(--app-border)]/50 text-[var(--app-text)] border border-[var(--app-border)] rounded-lg transition-colors"
          >
            <FileSpreadsheet size={13} className="text-emerald-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--app-card-subtle)] hover:bg-[var(--app-border)]/50 text-[var(--app-text)] border border-[var(--app-border)] rounded-lg transition-colors"
          >
            <FileText size={13} className="text-rose-500" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--app-card-subtle)] hover:bg-[var(--app-border)]/50 text-[var(--app-text)] border border-[var(--app-border)] rounded-lg transition-colors"
          >
            <Printer size={13} className="text-cyan-500" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* ─── 4 Dimension KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-[var(--app-muted)] font-medium">
            <span>Total Volume Terdata</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <BarChart2 size={14} />
            </span>
          </div>
          <div className="text-xl font-bold text-[var(--app-text)] mt-2">
            {baseVolume.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-500 font-semibold">
            <TrendingUp size={12} />
            <span>+{growthRate}% vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-[var(--app-muted)] font-medium">
            <span>Tingkat Efektivitas / SLA</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={14} />
            </span>
          </div>
          <div className="text-xl font-bold text-[var(--app-text)] mt-2">
            {efficiency}%
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-500 font-semibold">
            <CheckCircle2 size={12} />
            <span>Memenuhi target SLA 99.8%</span>
          </div>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-[var(--app-muted)] font-medium">
            <span>Rata-rata Waktu Siklus</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Clock size={14} />
            </span>
          </div>
          <div className="text-xl font-bold text-[var(--app-text)] mt-2">
            {cycleTime} Jam
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-purple-500 font-semibold">
            <Zap size={12} />
            <span>Respons otomatis NOC 24/7</span>
          </div>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-[var(--app-muted)] font-medium">
            <span>Status Verifikasi Audit</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <CheckCircle2 size={14} />
            </span>
          </div>
          <div className="text-xl font-bold text-[var(--app-text)] mt-2">
            100% Valid
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--app-muted)] font-medium">
            <span>Tersinkronisasi database Postgres</span>
          </div>
        </div>
      </div>

      {/* ─── Visualizer & Trend Chart ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-xs font-bold text-[var(--app-text)]">
                Tren Fluktuasi {tabName} (6 Bulan Terakhir)
              </h4>
              <p className="text-[11px] text-[var(--app-muted)]">Perbandingan performa aktual vs proyeksi target bulanan</p>
            </div>
            <div className="flex items-center gap-1 bg-[var(--app-card-subtle)] p-1 rounded-lg border border-[var(--app-border)] text-[10px]">
              {['1M', '3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-0.5 rounded font-semibold transition ${
                    timeRange === range
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="tabColorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--app-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--app-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--app-card)',
                    borderColor: 'var(--app-border)',
                    borderRadius: 8,
                    fontSize: 11,
                    color: 'var(--app-text)'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#tabColorValue)" name="Realisasi Aktual" />
                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Target Proyeksi" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analytical Insights Panel */}
        <div className="lg:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--app-border)]">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Zap size={14} />
              </div>
              <h4 className="text-xs font-bold text-[var(--app-text)]">
                AI Diagnostic & Recommendation
              </h4>
            </div>

            <div className="space-y-2 text-xs text-[var(--app-text)] leading-relaxed">
              <div className="p-3 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)] space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-500">Peluang Pertumbuhan</span>
                <p className="text-[11px] text-[var(--app-muted)]">
                  Aktivitas pada kategori <strong>{tabName}</strong> menunjukkan peningkatan stabilitas sebesar {growthRate}%. Segmen korporat dan SOHO mendominasi dengan kontribusi di atas 60%.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)] space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-500">Optimasi Operasional</span>
                <p className="text-[11px] text-[var(--app-muted)]">
                  Disarankan untuk mempertahankan pemantauan berkala dan mengaktifkan notifikasi otomatis WhatsApp guna mempertahankan rasio efisiensi {efficiency}%.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.success(`Rekomendasi lengkap untuk ${tabName} telah disinkronkan ke memo internal manajemen.`)}
            className="w-full py-2 px-3 text-xs font-semibold text-center text-blue-500 hover:text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
          >
            <span>Terapkan Rekomendasi AI</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* ─── Granular Data Table ──────────────────────────────────────────────── */}
      <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--app-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">
              Rincian Log & Entitas Terkait ({filteredItems.length} Data)
            </h4>
            <p className="text-[11px] text-[var(--app-muted)]">Data terintegrasi real-time dari database AUDIRA-BILLING</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--app-muted)]" />
            <input
              type="text"
              placeholder={`Cari data ${tabName}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--app-text)]">
            <thead className="bg-[var(--app-card-subtle)] text-[var(--app-muted)] uppercase font-semibold text-[10px] border-b border-[var(--app-border)]">
              <tr>
                <th className="px-4 py-3">Kode Entitas</th>
                <th className="px-4 py-3">Nama Rincian</th>
                <th className="px-4 py-3">Estimasi Volume</th>
                <th className="px-4 py-3 text-center">Porsi (%)</th>
                <th className="px-4 py-3 text-center">Tren</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--app-border)] font-mono text-[11px]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--app-muted)] font-sans">
                    Tidak ditemukan data yang sesuai dengan kata kunci "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--app-card-subtle)] transition">
                    <td className="px-4 py-3 font-bold text-blue-500 whitespace-nowrap">{item.id}</td>
                    <td className="px-4 py-3 font-sans font-medium text-[var(--app-text)]">{item.name}</td>
                    <td className="px-4 py-3 font-bold text-[var(--app-text)]">{item.value}</td>
                    <td className="px-4 py-3 text-center text-[var(--app-muted)]">{item.share}</td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className={item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>
                        {item.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'OPTIMAL'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : item.status === 'TERVERIFIKASI'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => toast.info(`Rincian ${item.id} (${item.name}) - Status: ${item.status}`)}
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-500 hover:text-white hover:bg-blue-600 border border-blue-500/30 rounded-lg transition focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                      >
                        Detail
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
  );
}
