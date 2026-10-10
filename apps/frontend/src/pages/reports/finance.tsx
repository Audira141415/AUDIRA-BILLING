import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp,
  DollarSign, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight,
  Percent, Activity, BookOpen, Layers, CreditCard, RefreshCcw
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Jan', pendapatan: 1900000000, pengeluaran: 1050000000, labaBersih: 480000000 },
  { month: 'Feb', pendapatan: 2100000000, pengeluaran: 1140000000, labaBersih: 530000000 },
  { month: 'Mar', pendapatan: 1980000000, pengeluaran: 1090000000, labaBersih: 510000000 },
  { month: 'Apr', pendapatan: 2350000000, pengeluaran: 1280000000, labaBersih: 600000000 },
  { month: 'Mei', pendapatan: 2210000000, pengeluaran: 1190000000, labaBersih: 558000000 },
  { month: 'Jun', pendapatan: 2845750000, pengeluaran: 1235640000, labaBersih: 1245230000 },
];

const distribusiData = [
  { name: 'Internet', value: 2003485000, pct: '70.4%', color: '#3b82f6' },
  { name: 'Installation', value: 350881000, pct: '12.3%', color: '#10b981' },
  { name: 'Maintenance', value: 224765000, pct: '7.9%', color: '#f59e0b' },
  { name: 'Device & Equip.', value: 267300000, pct: '9.4%', color: '#8b5cf6' },
];

const topPengeluaran = [
  { kategori: 'Bandwidth', nilai: 192865000, pct: 26.50 },
  { kategori: 'Device & Equipment', nilai: 231650000, pct: 23.50 },
  { kategori: 'Operational', nilai: 233525000, pct: 18.75 },
  { kategori: 'Marketing', nilai: 156000000, pct: 12.60 },
  { kategori: 'Salaries', nilai: 126000000, pct: 10.20 },
  { kategori: 'Others', nilai: 108416000, pct: 8.80 },
];

const labaRugiData = [
  { label: 'Pendapatan', value: 2845750000, type: 'income' },
  { label: 'Harga Pokok Pendapatan (COGS)', value: -1235640000, type: 'expense' },
  { label: 'Laba Kotor', value: 1610110000, type: 'gross' },
  { label: 'Beban Operasional', value: -364680000, type: 'expense' },
  { label: 'Pendapatan Lain-lain', value: 58450000, type: 'income' },
  { label: 'Laba Sebelum Pajak', value: 1303880000, type: 'gross' },
  { label: 'Pajak', value: -58450000, type: 'expense' },
  { label: 'Laba Bersih', value: 1245230000, type: 'net' },
  { label: 'Margin Laba Bersih', value: 0, strVal: '43.74%', type: 'margin' },
];

const arusKasData = [
  { label: 'Arus Kas Operasional', value: 1156250000, type: 'income' },
  { label: 'Arus Kas Investasi', value: -245600000, type: 'expense' },
  { label: 'Arus Kas Pendanaan', value: 76800000, type: 'income' },
  { label: 'Kenaikan / (Penurunan) Kas', value: 987450000, type: 'gross' },
  { label: 'Kas Awal Periode', value: 2156780000, type: 'neutral' },
  { label: 'Kas Akhir Periode', value: 3144230000, type: 'net' },
];

const neracaData = [
  { label: 'Total Aset', value: 5680450000, type: 'net' },
  { label: 'Total Liabilitas', value: 1892340000, type: 'expense' },
  { label: 'Total Ekuitas', value: 3788110000, type: 'income' },
  { label: 'Current Ratio', strVal: '2.35', value: 0, type: 'margin' },
  { label: 'Debt to Equity Ratio', strVal: '0.50', value: 0, type: 'margin' },
  { label: 'ROA', strVal: '21.91%', value: 0, type: 'margin' },
  { label: 'ROE', strVal: '32.87%', value: 0, type: 'margin' },
];

const realisasiData = [
  { kategori: 'Pendapatan', anggaran: 3000000000, realisasi: 2845750000, pct: 94.85 },
  { kategori: 'Pengeluaran', anggaran: 1400000000, realisasi: 1235640000, pct: 88.25 },
  { kategori: 'Beban Operasional', anggaran: 400000000, realisasi: 364680000, pct: 91.23 },
  { kategori: 'Investasi', anggaran: 300000000, realisasi: 245600000, pct: 81.87 },
];

const transaksiData = [
  { no: 1, tanggal: '30/06/2026', tipe: 'Invoice', noDoc: 'INV/2026/06/789', deskripsi: 'Pembayaran Invoice INV/2026/06/789 - PT Maju Jaya', kategori: 'Pendapatan', debit: 120000000, kredit: null, saldo: 3144230000, costCenter: 'Sales', status: 'Selesai' },
  { no: 2, tanggal: '29/06/2026', tipe: 'Expense', noDoc: 'EXP/2026/04115', deskripsi: 'Pembayaran Bandwidth - Biznet', kategori: 'Bandwidth', debit: null, kredit: 52450000, saldo: 3024230000, costCenter: 'Network', status: 'Selesai' },
  { no: 3, tanggal: '28/06/2026', tipe: 'Receipt', noDoc: 'RCPT/2026/03145', deskripsi: 'Pembayaran Customer - Budi Santoso', kategori: 'Pendapatan', debit: null, kredit: 450000, saldo: 3076680000, costCenter: 'Sales', status: 'Selesai' },
  { no: 4, tanggal: '27/06/2026', tipe: 'Expense', noDoc: 'EXP/2026/04114', deskripsi: 'Pembelian Perangkat Mikrotik', kategori: 'Device', debit: 28750000, kredit: null, saldo: 3076230000, costCenter: 'Network', status: 'Selesai' },
  { no: 5, tanggal: '26/06/2026', tipe: 'Journal', noDoc: 'JV/2026/00125', deskripsi: 'Penyusutan Aset Juni 2026', kategori: 'Penyusutan', debit: 15840000, kredit: null, saldo: 3104980000, costCenter: 'Finance', status: 'Selesai' },
];

const SUB_TABS = [
  'Ringkasan', 'Profit & Loss', 'Arus Kas', 'Neraca',
  'Pendapatan', 'Pengeluaran', 'Anggaran vs Realisasi',
  'Cash Flow Forecast', 'Rekonsiliasi', 'Aging', 'Transaksi', 'Activity Log'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => `Rp ${Math.abs(n).toLocaleString('id-ID')}`;
const fmtRpCompact = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1000000000) return `Rp ${(abs / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (abs >= 1000000) return `Rp ${(abs / 1000000).toFixed(0)} Jt`;
  return `Rp ${abs.toLocaleString('id-ID')}`;
};

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ tipe }: { tipe: string }) {
  const map: Record<string, string> = {
    'Invoice': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Expense': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Receipt': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Journal': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold border ${map[tipe] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {tipe}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-1.5 py-0.5 rounded text-[7px] font-bold border bg-green-500/10 text-green-400 border-green-500/20">
      {status}
    </span>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, iconColor, iconBg, label, value, change, up }: {
  icon: any; iconColor: string; iconBg: string;
  label: string; value: string; change: string; up: boolean;
}) {
  return (
    <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-3 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg border ${iconBg}`} style={{ borderColor: iconColor + '25' }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {up ? '▲' : '▼'} {change}
        </span>
      </div>
      <div>
        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-black text-white mt-0.5 leading-tight">{value}</p>
        <p className="text-[8px] text-gray-500 mt-0.5">dari Mei 2026</p>
      </div>
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = transaksiData.filter(r =>
    r.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
    r.kategori.toLowerCase().includes(search.toLowerCase()) ||
    r.noDoc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={DollarSign} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Pendapatan" value="Rp 2.845.750.000" change="12.85%" up={true} />
        <KpiCard icon={CreditCard} iconBg="bg-red-500/10" iconColor="#ef4444" label="Total Pengeluaran" value="Rp 1.235.640.000" change="8.62%" up={false} />
        <KpiCard icon={TrendingUp} iconBg="bg-green-500/10" iconColor="#10b981" label="Laba Kotor" value="Rp 1.610.110.000" change="16.92%" up={true} />
        <KpiCard icon={Activity} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Laba Bersih" value="Rp 1.245.230.000" change="18.31%" up={true} />
        <KpiCard icon={Layers} iconBg="bg-cyan-500/10" iconColor="#06b6d4" label="Arus Kas Bersih" value="Rp 987.450.000" change="22.14%" up={true} />
        <KpiCard icon={Percent} iconBg="bg-purple-500/10" iconColor="#8b5cf6" label="Current Ratio" value="2.35" change="5.23%" up={true} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Trend + Distribusi + Top Pengeluaran */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tren Pendapatan vs Pengeluaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Tren Pendapatan vs Pengeluaran</h4>
                <select className="bg-[#080d19] border border-[#131d35] text-[8px] py-0.5 px-1.5 rounded text-gray-300 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                {[['Pendapatan','#3b82f6'],['Pengeluaran','#ef4444'],['Laba Bersih','#10b981']].map(([l,c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block" style={{ backgroundColor: c }} /><span className="text-gray-400">{l}</span></span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={175}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${(v / 1000000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any) => [fmtRp(v)]} />
                  <Line type="monotone" dataKey="pendapatan" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.5, fill: '#3b82f6' }} name="Pendapatan" />
                  <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 2, fill: '#ef4444' }} name="Pengeluaran" />
                  <Line type="monotone" dataKey="labaBersih" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2, fill: '#10b981' }} name="Laba Bersih" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribusi Pendapatan */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Distribusi Pendapatan</h4>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distribusiData} dataKey="value" innerRadius="55%" outerRadius="82%" startAngle={90} endAngle={-270} stroke="none">
                        {distribusiData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[9px] font-black text-white leading-none">Rp 2,845 M</p>
                    <p className="text-[6px] text-gray-500 font-bold uppercase">Total</p>
                  </div>
                </div>
                <div className="space-y-1.5 flex-1">
                  {distribusiData.map((d, i) => (
                    <div key={i} className="text-[8px]">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-gray-400">{d.name}</span>
                        </span>
                        <span className="text-white font-bold">{d.pct}</span>
                      </div>
                      <div className="h-1 bg-[#131d35] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: d.pct, backgroundColor: d.color }} />
                      </div>
                      <p className="text-[7px] text-gray-500 text-right mt-0.5">{fmtRpCompact(d.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Pengeluaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Top Pengeluaran <span className="text-gray-500 font-normal">(by Category)</span></h4>
              <div className="space-y-2">
                {topPengeluaran.map((p, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between text-[8px]">
                      <span className="text-gray-400">{p.kategori}</span>
                      <span className="font-bold text-white">{p.pct}% — {fmtRpCompact(p.nilai)}</span>
                    </div>
                    <div className="h-1.5 bg-[#131d35] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${p.pct / 30 * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Laba Rugi + Arus Kas + Neraca + Realisasi Anggaran */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ringkasan Laba Rugi */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Ringkasan Laba Rugi</h4>
              <p className="text-[7px] text-gray-500 font-bold uppercase">Juni 2026</p>
              <div className="space-y-1.5">
                {labaRugiData.map((r, i) => {
                  const isGross = r.type === 'gross' || r.type === 'net';
                  const color = r.type === 'income' ? 'text-green-400' : r.type === 'expense' ? 'text-red-400' : r.type === 'net' ? 'text-blue-400' : r.type === 'margin' ? 'text-yellow-400' : 'text-white';
                  const val = r.strVal ?? (r.value < 0 ? '-' + fmtRpCompact(-r.value) : fmtRpCompact(r.value));
                  return (
                    <div key={i} className={`flex justify-between text-[8px] ${isGross ? 'border-t border-[#131d35] pt-1.5 font-black' : ''}`}>
                      <span className={isGross ? 'text-gray-200' : 'text-gray-400'}>{r.label}</span>
                      <span className={`font-bold ${color}`}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan Arus Kas */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Ringkasan Arus Kas</h4>
              <p className="text-[7px] text-gray-500 font-bold uppercase">Juni 2026</p>
              <div className="space-y-1.5">
                {arusKasData.map((r, i) => {
                  const isKey = r.type === 'gross' || r.type === 'net';
                  const color = r.type === 'income' ? 'text-green-400' : r.type === 'expense' ? 'text-red-400' : r.type === 'net' ? 'text-blue-400' : 'text-white';
                  const val = r.value < 0 ? '-' + fmtRpCompact(-r.value) : fmtRpCompact(r.value);
                  return (
                    <div key={i} className={`flex justify-between text-[8px] ${isKey ? 'border-t border-[#131d35] pt-1.5 font-black' : ''}`}>
                      <span className={isKey ? 'text-gray-200' : 'text-gray-400'}>{r.label}</span>
                      <span className={`font-bold ${color}`}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ringkasan Neraca */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Ringkasan Neraca</h4>
              <p className="text-[7px] text-gray-500 font-bold uppercase">Per 30 Juni 2026</p>
              <div className="space-y-1.5">
                {neracaData.map((r, i) => {
                  const color = r.type === 'income' ? 'text-green-400' : r.type === 'expense' ? 'text-red-400' : r.type === 'net' ? 'text-blue-400' : r.type === 'margin' ? 'text-yellow-400' : 'text-white';
                  const val = r.strVal ?? fmtRpCompact(r.value);
                  const isMeta = r.type === 'margin';
                  return (
                    <div key={i} className={`flex justify-between text-[8px] ${isMeta ? 'border-t border-[#131d35] pt-1.5' : ''}`}>
                      <span className={isMeta ? 'text-gray-300 font-bold' : 'text-gray-400'}>{r.label}</span>
                      <span className={`font-bold ${color}`}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Realisasi Anggaran */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Realisasi Anggaran</h4>
              <p className="text-[7px] text-gray-500 font-bold uppercase">Juni 2026</p>
              <div className="overflow-x-auto">
                <table className="w-full text-[7px] min-w-[200px]">
                  <thead>
                    <tr className="text-gray-500 font-bold uppercase border-b border-[#131d35]">
                      <th className="py-1 text-left">Kategori</th>
                      <th className="py-1 text-right">Anggaran</th>
                      <th className="py-1 text-right">Realisasi</th>
                      <th className="py-1 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131d35]">
                    {realisasiData.map((r, i) => (
                      <tr key={i} className="hover:bg-[#121c38]/30">
                        <td className="py-1.5 text-gray-400">{r.kategori}</td>
                        <td className="py-1.5 text-right text-gray-400">{fmtRpCompact(r.anggaran)}</td>
                        <td className="py-1.5 text-right text-white font-bold">{fmtRpCompact(r.realisasi)}</td>
                        <td className="py-1.5 text-right">
                          <span className={`font-bold ${r.pct >= 90 ? 'text-green-400' : r.pct >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {r.pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Realisasi bar mini chart */}
              <ResponsiveContainer width="100%" height={70}>
                <BarChart data={realisasiData} barSize={14} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="kategori" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }}
                    formatter={(v: any) => [`${v}%`, 'Realisasi']} />
                  <Bar dataKey="pct" name="%" radius={[0, 3, 3, 0]}>
                    {realisasiData.map((r, i) => <Cell key={i} fill={r.pct >= 90 ? '#10b981' : r.pct >= 80 ? '#f59e0b' : '#ef4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaksi Table */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-white">Transaksi Keuangan Terbaru</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Cari deskripsi, dokumen, kategori..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-[#080d19] border border-[#131d35] text-[9px] pl-7 pr-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-blue-500 w-48" />
                </div>
                <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                  <Filter size={10} /> Filter
                </button>
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400 hover:bg-[#121c38]"><BarChart2 size={12} /></button>
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400 hover:bg-[#121c38]"><FileText size={12} /></button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#131d35]">
              <table className="w-full text-left border-collapse text-[9px] text-gray-300 min-w-[1100px]">
                <thead>
                  <tr className="border-b border-[#131d35] bg-[#101935]/60 text-gray-400 font-bold uppercase">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Tanggal</th>
                    <th className="px-3 py-2.5">Tipe</th>
                    <th className="px-3 py-2.5">No Dokumen</th>
                    <th className="px-3 py-2.5">Deskripsi</th>
                    <th className="px-3 py-2.5">Kategori</th>
                    <th className="px-3 py-2.5 text-right">Debit (Rp)</th>
                    <th className="px-3 py-2.5 text-right">Kredit (Rp)</th>
                    <th className="px-3 py-2.5 text-right">Saldo (Rp)</th>
                    <th className="px-3 py-2.5">Cost Center</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131d35]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[#121c38]/40 transition-colors">
                      <td className="px-3 py-2.5 text-gray-500 font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.tanggal}</td>
                      <td className="px-3 py-2.5"><TypeBadge tipe={row.tipe} /></td>
                      <td className="px-3 py-2.5 font-mono text-blue-400 text-[8px]">{row.noDoc}</td>
                      <td className="px-3 py-2.5 text-gray-300 text-[8px] max-w-[220px] truncate">{row.deskripsi}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[7px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold">{row.kategori}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-400">{row.debit ? fmtRp(row.debit) : '-'}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-red-400">{row.kredit ? fmtRp(row.kredit) : '-'}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-white">{fmtRp(row.saldo)}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.costCenter}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1 hover:bg-[#1a2a4a] rounded text-gray-400 hover:text-blue-400 transition-colors"><Eye size={11} /></button>
                          <button className="p-1 hover:bg-[#1a2a4a] rounded text-gray-400 hover:text-green-400 transition-colors"><Download size={11} /></button>
                          <button className="p-1 hover:bg-[#1a2a4a] rounded text-gray-400 transition-colors"><MoreVertical size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[9px] text-gray-500">Menampilkan 1 - {filtered.length} dari 245 data</p>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400"><ChevronLeft size={11} /></button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[#080d19] border border-[#131d35] text-gray-400 hover:bg-[#121c38]'}`}>
                    {p}
                  </button>
                ))}
                <span className="text-gray-600 text-[9px]">...</span>
                <button className="w-8 h-6 text-[9px] rounded-md font-bold bg-[#080d19] border border-[#131d35] text-gray-400 hover:bg-[#121c38]">49</button>
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400"><ChevronRight size={11} /></button>
                <select className="bg-[#080d19] border border-[#131d35] text-[9px] py-1.5 px-2 rounded-lg text-gray-300 focus:outline-none">
                  <option>10 / halaman</option>
                  <option>25 / halaman</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Cepat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Filter Cepat</h4>
            <div className="grid grid-cols-3 gap-1">
              {['Hari Ini', '7 Hari', '30 Hari', '3 Bulan', '6 Bulan', 'Tahun Ini'].map((t, i) => (
                <button key={t} className={`text-[7px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center ${i === 4 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#080d19] border-[#131d35] text-gray-400 hover:bg-[#121c38]'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Periode', val: 'Juni 2026' },
                { label: 'Dibandingkan Dengan', val: 'Mei 2026' },
                { label: 'Basis Akuntansi', val: 'Accrual' },
                { label: 'Area / Region', val: 'Semua Area' },
                { label: 'Cost Center', val: 'Semua Cost Center' },
              ].map(f => (
                <div key={f.label} className="space-y-0.5">
                  <span className="text-[7px] text-gray-500 font-bold uppercase">{f.label}</span>
                  <select className="w-full bg-[#080d19] border border-[#131d35] text-[8px] py-1.5 px-2 rounded-lg text-white focus:outline-none">
                    <option>{f.val}</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold py-2 rounded-lg transition-colors">
              Terapkan Filter
            </button>
          </div>

          {/* Aksi Cepat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-2">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Aksi Cepat</h4>
            {[
              { label: 'Lihat Profit & Loss', icon: TrendingUp, color: 'text-green-400' },
              { label: 'Lihat Arus Kas', icon: Activity, color: 'text-blue-400' },
              { label: 'Lihat Neraca', icon: BookOpen, color: 'text-purple-400' },
              { label: 'Export Finance Report (Excel)', icon: FileSpreadsheet, color: 'text-emerald-400' },
              { label: 'Export Finance Report (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'Export Ledger Summary', icon: FileText, color: 'text-cyan-400' },
              { label: 'Rekonsiliasi Bank', icon: RefreshCcw, color: 'text-orange-400' },
            ].map(a => (
              <button key={a.label} className="w-full flex items-center justify-between gap-2 bg-[#080d19] border border-[#131d35] hover:bg-[#121c38] p-2 rounded-lg text-[8px] font-semibold text-gray-300 transition-all group">
                <span className="flex items-center gap-2">
                  <a.icon size={11} className={a.color} />
                  <span className="text-left">{a.label}</span>
                </span>
                <ChevronDown size={9} className="text-gray-600 -rotate-90 shrink-0" />
              </button>
            ))}
          </div>

          {/* Insight */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Insight & Rekomendasi</h4>
            <div className="space-y-2">
              {[
                { text: "Pendapatan naik 12.85% dibanding periode sebelumnya.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { text: "Laba bersih meningkat 18.31% dengan margin 43.74%.", color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { text: "Perhatikan pengeluaran bandwidth yang naik 15.2%.", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              ].map((ins, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${ins.bg}`}>
                  <p className={`text-[8px] font-semibold ${ins.color} leading-relaxed`}>{ins.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-[9px] font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 border-t border-[#131d35] pt-2">
              Lihat Insight Lengkap <ArrowUpRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-3">
      <BarChart2 size={40} className="text-gray-700" />
      <p className="text-sm font-bold">Tab <span className="text-blue-400">{name}</span> sedang dalam pengembangan</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FinanceReportPage() {
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-5 space-y-4">

        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-3 border-b border-[#131d35] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold mb-1">
              <span>Finance</span><span className="text-gray-600">›</span>
              <span>Reports</span><span className="text-gray-600">›</span>
              <span className="text-blue-400">Finance Report</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Finance Report</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Laporan keuangan komprehensif mencakup pendapatan, pengeluaran, arus kas, laba rugi dan posisi keuangan.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-1.5 rounded-lg">
              <Calendar size={11} className="text-blue-400" />
              <span className="text-[9px] text-gray-300">01 Jul 2026 · 08:35 WIB</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">Status Sistem</span>
              <span className="text-[9px] text-gray-400">Normal</span>
            </div>
            <div className="relative hidden lg:block">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari invoice, customer, paket, nomor invoice..."
                className="bg-[#0b1329] border border-[#131d35] text-[9px] pl-8 pr-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-blue-500 w-52" />
            </div>
            <button className="relative p-1.5 bg-[#0b1329] border border-[#131d35] rounded-lg text-gray-400">
              <Bell size={13} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[7px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">13</span>
            </button>
            <button className="relative p-1.5 bg-[#0b1329] border border-[#131d35] rounded-lg text-gray-400">
              <Mail size={13} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[7px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">5</span>
            </button>
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#131d35]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[9px]">AR</div>
              <div className="hidden md:block">
                <div className="text-[9px] font-bold text-white leading-none">Agus Dwi Rianto</div>
                <div className="text-[8px] text-gray-500 font-bold uppercase">Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowExport(v => !v)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                <Download size={12} /> Export <ChevronDown size={9} className={`transition-transform ${showExport ? 'rotate-180' : ''}`} />
              </button>
              {showExport && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-[#0b1329] border border-[#131d35] rounded-xl shadow-xl overflow-hidden w-44">
                  {[
                    { label: 'Export PDF', icon: FileDown, color: 'text-red-400' },
                    { label: 'Export Excel', icon: FileSpreadsheet, color: 'text-green-400' },
                    { label: 'Export CSV', icon: FileText, color: 'text-blue-400' },
                  ].map(e => (
                    <button key={e.label} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-gray-300 hover:bg-[#121c38]">
                      <e.icon size={12} className={e.color} />{e.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Calendar size={11} className="text-blue-400" /> Jadwalkan Laporan
            </button>
            <button className="p-1.5 bg-[#0b1329] border border-[#131d35] rounded-lg hover:bg-[#121c38] text-gray-400"><MoreVertical size={13} /></button>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-gray-400">
            <RefreshCw size={11} className="text-gray-500" />
            <span>Data diperbarui: 01/07/2026 08:30 WIB</span>
            <span className="text-gray-600">|</span>
            <span>Auto-Update</span>
            {isMounted && (
              <button onClick={() => setAutoUpdate(v => !v)}
                className={`relative w-8 h-4 rounded-full transition-all ${autoUpdate ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoUpdate ? 'left-4' : 'left-0.5'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-0.5 border-b border-[#131d35] pb-px overflow-x-auto">
          {SUB_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-[9px] font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Primary Filters */}
        <div className="flex flex-wrap items-end gap-2">
          {[
            { label: 'Periode', opt: 'Juni 2026' },
            { label: 'Dibandingkan Dengan', opt: 'Mei 2026' },
            { label: 'Basis Akuntansi', opt: 'Accrual' },
            { label: 'Area / Region', opt: 'Semua Area' },
            { label: 'Cost Center', opt: 'Semua Cost Center' },
            { label: 'Mata Uang', opt: 'IDR (Rupiah)' },
          ].map(f => (
            <div key={f.label} className="space-y-0.5">
              <span className="text-[7px] text-gray-500 font-bold uppercase px-0.5">{f.label}</span>
              <select className="bg-[#0b1329] border border-[#131d35] text-[9px] py-1.5 px-2.5 rounded-lg text-white focus:outline-none hover:border-blue-500/50 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <div className="flex gap-1.5 self-end">
            <button className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] hover:bg-[#121c38] text-gray-300 text-[9px] font-bold px-3 py-1.5 rounded-lg">
              <Filter size={10} /> Filter Lainnya
            </button>
            <button className="text-[9px] font-bold text-gray-400 hover:text-white px-2 py-1.5 border border-[#131d35] rounded-lg hover:bg-[#121c38] bg-[#0b1329]">
              Reset
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Ringkasan' ? <TabRingkasan /> : <TabPlaceholder name={activeTab} />}
      </div>
    </Layout>
  );
}
