import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  DollarSign, Eye, ArrowUpRight, MoreVertical,
  Bell, Mail, Search, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, AlertTriangle, Clock, Receipt,
  Percent, Hash, Send
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: 'Jan', total: 12200, terbayar: 10400, belumTerbayar: 1400, overdue: 400 },
  { month: 'Feb', total: 13100, terbayar: 11200, belumTerbayar: 1500, overdue: 400 },
  { month: 'Mar', total: 12600, terbayar: 10700, belumTerbayar: 1500, overdue: 400 },
  { month: 'Apr', total: 14200, terbayar: 12100, belumTerbayar: 1700, overdue: 400 },
  { month: 'Mei', total: 13800, terbayar: 11750, belumTerbayar: 1650, overdue: 400 },
  { month: 'Jun', total: 15842, terbayar: 12301, belumTerbayar: 2709, overdue: 757 },
];

const statusData = [
  { name: 'Lunas', value: 12301, pct: '77.7%', color: '#10b981' },
  { name: 'Belum Lunas', value: 2709, pct: '17.1%', color: '#f59e0b' },
  { name: 'Overdue', value: 757, pct: '4.8%', color: '#ef4444' },
  { name: 'Void', value: 75, pct: '0.5%', color: '#6b7280' },
];

const paketBarData = [
  { name: 'Premium', value: 2845 },
  { name: 'Standar', value: 2245 },
  { name: 'Basic', value: 1980 },
  { name: 'Promo', value: 1560 },
  { name: 'Game', value: 1245 },
  { name: 'Bisnis', value: 1120 },
  { name: 'Residensi', value: 945 },
  { name: 'UMKM', value: 780 },
  { name: 'Lite', value: 620 },
  { name: 'Lainnya', value: 502 },
];

const tableData = [
  { no: 1, noInvoice: 'INV/2026/06/00001', tgl: '01/06/2026', customer: 'PT. Maju Bersama', paket: 'Premium 100 Mbps', periode: '01/06 - 30/06/2026', jatuhTempo: '10/06/2026', totalTagihan: 1200000, status: 'Lunas', pembayaran: '01/06/2026', sisaTagihan: 0 },
  { no: 2, noInvoice: 'INV/2026/06/00002', tgl: '01/06/2026', customer: 'Budi Santoso', paket: 'Standar 50 Mbps', periode: '01/06 - 30/06/2026', jatuhTempo: '10/06/2026', totalTagihan: 350000, status: 'Lunas', pembayaran: '01/06/2026', sisaTagihan: 0 },
  { no: 3, noInvoice: 'INV/2026/06/00003', tgl: '01/06/2026', customer: 'CV. Sejahtera', paket: 'Bisnis 200 Mbps', periode: '01/06 - 30/06/2026', jatuhTempo: '10/06/2026', totalTagihan: 1750000, status: 'Belum Lunas', pembayaran: '03/06/2026', sisaTagihan: 1750000 },
  { no: 4, noInvoice: 'INV/2026/06/00004', tgl: '02/06/2026', customer: 'Andi Wijaya', paket: 'Basic 20 Mbps', periode: '02/06 - 01/07/2026', jatuhTempo: '12/06/2026', totalTagihan: 220000, status: 'Lunas', pembayaran: '03/06/2026', sisaTagihan: 0 },
  { no: 5, noInvoice: 'INV/2026/06/00005', tgl: '02/06/2026', customer: 'Siti Nurhaliza', paket: 'Promo Gaming', periode: '02/06 - 01/07/2026', jatuhTempo: '12/06/2026', totalTagihan: 180000, status: 'Overdue', pembayaran: '-', sisaTagihan: 180000 },
  { no: 6, noInvoice: 'INV/2026/06/00006', tgl: '03/06/2026', customer: 'PT. Digital Solusi', paket: 'Premium 100 Mbps', periode: '03/06 - 02/07/2026', jatuhTempo: '13/06/2026', totalTagihan: 1200000, status: 'Lunas', pembayaran: '03/06/2026', sisaTagihan: 0 },
  { no: 7, noInvoice: 'INV/2026/06/00007', tgl: '03/06/2026', customer: 'Rina Kartika', paket: 'Standar 50 Mbps', periode: '03/06 - 02/07/2026', jatuhTempo: '13/06/2026', totalTagihan: 350000, status: 'Belum Lunas', pembayaran: '-', sisaTagihan: 350000 },
  { no: 8, noInvoice: 'INV/2026/06/00008', tgl: '04/06/2026', customer: 'Toko Sumber Rejeki', paket: 'UMKM 30 Mbps', periode: '04/06 - 03/07/2026', jatuhTempo: '14/06/2026', totalTagihan: 275000, status: 'Lunas', pembayaran: '04/06/2026', sisaTagihan: 0 },
  { no: 9, noInvoice: 'INV/2026/06/00009', tgl: '04/06/2026', customer: 'Dewi Lestari', paket: 'Basic 20 Mbps', periode: '04/06 - 03/07/2026', jatuhTempo: '14/06/2026', totalTagihan: 220000, status: 'Lunas', pembayaran: '-', sisaTagihan: 220000 },
  { no: 10, noInvoice: 'INV/2026/06/00010', tgl: '05/06/2026', customer: 'Kantor Desa Sejahtera', paket: 'Lite 10 Mbps', periode: '05/06 - 04/07/2026', jatuhTempo: '15/06/2026', totalTagihan: 150000, status: 'Void', pembayaran: '-', sisaTagihan: 0 },
];

const SUB_TABS = [
  'Ringkasan', 'Invoice List', 'Invoice Status', 'Invoice Aging',
  'Payment Tracking', 'Tax (PPN)', 'Discount & Adjustment',
  'Void Invoice', 'Proforma Invoice'
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const fmtRpCompact = (n: number) => {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(3).replace('.', ',')} M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(3).replace('.', ',')} Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};
const fmt = (n: number) => n.toLocaleString('id-ID');

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Lunas': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Belum Lunas': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Void': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${map[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
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
        <p className="text-base font-black text-white mt-0.5 leading-tight">{value}</p>
        <p className="text-[8px] text-gray-500 mt-0.5">dari Mei 2026</p>
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ data, total, label, size = 130 }: {
  data: { name: string; value: number; color: string; pct: string }[];
  total: string; label: string; size?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="55%" outerRadius="80%" startAngle={90} endAngle={-270} stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm font-black text-white leading-none">{total}</p>
          <p className="text-[6px] text-gray-500 font-bold uppercase">{label}</p>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[8px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-400 truncate flex-1">{d.name}</span>
            <span className="text-white font-bold shrink-0">{d.pct}</span>
            <span className="text-gray-500 shrink-0 w-12 text-right">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tab ────────────────────────────────────────────────────────────────

function TabRingkasan() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tableData.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.noInvoice.toLowerCase().includes(search.toLowerCase()) ||
    r.paket.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={Receipt} iconBg="bg-blue-500/10" iconColor="#3b82f6" label="Total Invoice" value="15.842" change="12.58%" up={true} />
        <KpiCard icon={DollarSign} iconBg="bg-indigo-500/10" iconColor="#6366f1" label="Total Tagihan" value="Rp 3.125.750.000" change="13.24%" up={true} />
        <KpiCard icon={CheckCircle} iconBg="bg-green-500/10" iconColor="#10b981" label="Terbayar" value="Rp 2.456.880.000" change="11.85%" up={true} />
        <KpiCard icon={Clock} iconBg="bg-yellow-500/10" iconColor="#f59e0b" label="Belum Terbayar" value="Rp 668.870.000" change="18.92%" up={false} />
        <KpiCard icon={AlertTriangle} iconBg="bg-red-500/10" iconColor="#ef4444" label="Overdue" value="Rp 245.680.000" change="21.45%" up={false} />
        <KpiCard icon={XCircle} iconBg="bg-gray-500/10" iconColor="#6b7280" label="Void Invoice" value="87" change="3.46%" up={false} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 9 cols */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: Trend + Status Donut + Paket Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tren Invoice */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Tren Invoice (6 Bulan Terakhir)</h4>
                <select className="bg-[#080d19] border border-[#131d35] text-[8px] py-0.5 px-1.5 rounded text-gray-300 focus:outline-none">
                  <option>6 Bulan Terakhir</option>
                </select>
              </div>
              <div className="flex gap-2 text-[7px] font-bold flex-wrap">
                {[['Total Invoice','#3b82f6'],['Terbayar','#10b981'],['Belum Terbayar','#f59e0b'],['Overdue','#ef4444']].map(([l,c]) => (
                  <span key={l} className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block" style={{ backgroundColor: c }} /><span className="text-gray-400">{l}</span></span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={165}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total Invoice" />
                  <Line type="monotone" dataKey="terbayar" stroke="#10b981" strokeWidth={1.5} dot={false} name="Terbayar" />
                  <Line type="monotone" dataKey="belumTerbayar" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Belum Terbayar" />
                  <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Overdue" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Invoice by Status Donut */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Invoice by Status</h4>
              <DonutChart data={statusData} total="15.842" label="Total Invoice" size={130} />
              <div className="space-y-1.5 border-t border-[#131d35] pt-2">
                {statusData.map((d, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between text-[8px]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-gray-400">{d.name}</span>
                      </span>
                      <span className="text-white font-bold">{d.pct} — {fmt(d.value)}</span>
                    </div>
                    <div className="h-1 bg-[#131d35] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: d.pct, backgroundColor: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice by Paket Bar */}
            <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white">Invoice by Paket</h4>
                <select className="bg-[#080d19] border border-[#131d35] text-[8px] py-0.5 px-1.5 rounded text-gray-300 focus:outline-none">
                  <option>Top 10 Paket</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={paketBarData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131d35" />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 7, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 9 }} />
                  <Bar dataKey="value" name="Invoice" radius={[3, 3, 0, 0]}>
                    {paketBarData.map((d, i) => (
                      <Cell key={i} fill={['#3b82f6','#10b981','#8b5cf6','#f59e0b','#06b6d4','#ef4444','#a855f7','#f97316','#14b8a6','#6b7280'][i % 10]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-bold text-white">Daftar Invoice</h4>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Cari invoice, customer, paket..."
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
                    <th className="px-3 py-2.5">No. Invoice</th>
                    <th className="px-3 py-2.5">Tanggal Invoice</th>
                    <th className="px-3 py-2.5">Customer</th>
                    <th className="px-3 py-2.5">Paket</th>
                    <th className="px-3 py-2.5">Periode</th>
                    <th className="px-3 py-2.5">Jatuh Tempo</th>
                    <th className="px-3 py-2.5 text-right">Total Tagihan</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Pembayaran</th>
                    <th className="px-3 py-2.5 text-right">Sisa Tagihan</th>
                    <th className="px-3 py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131d35]">
                  {filtered.map(row => (
                    <tr key={row.no} className="hover:bg-[#121c38]/40 transition-colors">
                      <td className="px-3 py-2.5 text-gray-500 font-bold">{row.no}</td>
                      <td className="px-3 py-2.5 font-mono text-blue-400 text-[8px]">{row.noInvoice}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.tgl}</td>
                      <td className="px-3 py-2.5 font-bold text-white">{row.customer}</td>
                      <td className="px-3 py-2.5 text-gray-300 text-[8px]">{row.paket}</td>
                      <td className="px-3 py-2.5 text-gray-400 text-[8px]">{row.periode}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.jatuhTempo}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-white">{fmtRp(row.totalTagihan)}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
                      <td className="px-3 py-2.5 text-gray-400">{row.pembayaran}</td>
                      <td className="px-3 py-2.5 text-right font-bold">
                        <span className={row.sisaTagihan > 0 ? 'text-red-400' : 'text-green-400'}>
                          {fmtRp(row.sisaTagihan)}
                        </span>
                      </td>
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
              <p className="text-[9px] text-gray-500">Menampilkan 1 - 10 dari 15.842 data</p>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 bg-[#080d19] border border-[#131d35] rounded-lg text-gray-400"><ChevronLeft size={11} /></button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 text-[9px] rounded-md font-bold transition-all ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-[#080d19] border border-[#131d35] text-gray-400 hover:bg-[#121c38]'}`}>
                    {p}
                  </button>
                ))}
                <span className="text-gray-600 text-[9px]">...</span>
                <button className="w-10 h-6 text-[9px] rounded-md font-bold bg-[#080d19] border border-[#131d35] text-gray-400 hover:bg-[#121c38]">1585</button>
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
          {/* Ringkasan Invoice */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Ringkasan Invoice</h4>
            <div className="space-y-2">
              {[
                { label: 'Total Invoice', value: '15.842', color: 'text-white' },
                { label: 'Total Tagihan', value: 'Rp 3.125.750.000', color: 'text-white' },
                { label: 'Total Terbayar', value: 'Rp 2.456.880.000', color: 'text-green-400' },
                { label: 'Total Belum Terbayar', value: 'Rp 668.870.000', color: 'text-yellow-400' },
                { label: 'Total Overdue', value: 'Rp 245.680.000', color: 'text-red-400' },
                { label: 'Total Discount', value: 'Rp 125.450.000', color: 'text-blue-400' },
                { label: 'Total PPN', value: 'Rp 284.250.000', color: 'text-white' },
                { label: 'Rata-rata Tagihan', value: 'Rp 197.255', color: 'text-white' },
                { label: 'Rasio Collection', value: '85.68%', color: 'text-green-400' },
                { label: 'Rasio Overdue', value: '7.85%', color: 'text-red-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center text-[9px] border-b border-[#131d35] pb-1.5 last:border-0 last:pb-0">
                  <span className="text-gray-400">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Cepat */}
          <div className="bg-[#0b1329] border border-[#131d35] rounded-xl p-4 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Filter Cepat</h4>
            <div className="grid grid-cols-4 gap-1">
              {['Hari Ini', '7 Hari', '30 Hari', 'Bulan Ini'].map((t, i) => (
                <button key={t} className={`text-[7px] font-bold py-1.5 px-0.5 rounded-lg border transition-all text-center ${i === 2 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#080d19] border-[#131d35] text-gray-400 hover:bg-[#121c38]'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: 'Semua Status', color: 'text-gray-300', bg: 'bg-gray-500/10 border-gray-500/20' },
                { label: 'Lunas', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { label: 'Belum Lunas', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                { label: 'Void', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
              ].map(s => (
                <label key={s.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[7px] font-bold cursor-pointer ${s.bg} ${s.color}`}>
                  <input type="checkbox" className="accent-blue-500 w-2.5 h-2.5" defaultChecked />
                  {s.label}
                </label>
              ))}
            </div>
            <div className="space-y-1.5">
              {['Semua Paket', 'Semua Area', 'Semua Metode Pembayaran'].map(f => (
                <select key={f} className="w-full bg-[#080d19] border border-[#131d35] text-[8px] py-1.5 px-2 rounded-lg text-white focus:outline-none">
                  <option>{f}</option>
                </select>
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
              { label: 'Lihat Detail Invoice', icon: Eye, color: 'text-blue-400' },
              { label: 'Download Invoice List', icon: Download, color: 'text-cyan-400' },
              { label: 'Export Invoice List (Excel)', icon: FileSpreadsheet, color: 'text-green-400' },
              { label: 'Export Invoice List (PDF)', icon: FileDown, color: 'text-red-400' },
              { label: 'Kirim Reminder Pembayaran', icon: Send, color: 'text-orange-400' },
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
                { text: "Invoice overdue naik 21.45% dari bulan lalu. Kirim reminder ke 757 invoice overdue.", color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                { text: "Rasio collection 85.68% — masih di bawah target 90%. Tingkatkan follow-up.", color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                { text: "Collection rate terbaik di Premium (93.84%) — jadikan benchmark paket lainnya.", color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
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

export default function InvoiceReportPage() {
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
              <span className="text-blue-400">Invoice Report</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Invoice Report</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Laporan lengkap seluruh invoice yang dibuat, status pembayaran, dan analisis penagihan.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0b1329] border border-[#131d35] px-3 py-1.5 rounded-lg">
              <Calendar size={11} className="text-blue-400" />
              <span className="text-[9px] text-gray-300">01 Jul 2026 · 08:15 WIB</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0b1329] border border-[#131d35] px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">Status Sistem</span>
              <span className="text-[9px] text-gray-400">Normal</span>
            </div>
            <div className="relative hidden lg:block">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari invoice, customer, paket, nomor invoice..."
                className="bg-[#0b1329] border border-[#131d35] text-[9px] pl-8 pr-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-blue-500 w-56" />
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
            { label: 'Tanggal Invoice', opt: 'Semua' },
            { label: 'Tanggal Jatuh Tempo', opt: 'Semua' },
            { label: 'Status Invoice', opt: 'Semua Status' },
            { label: 'Paket', opt: 'Semua Paket' },
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
