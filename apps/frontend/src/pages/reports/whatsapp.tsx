import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ReportSubTabDetail from '@/components/ReportSubTabDetail';
import { useToast } from '@/contexts/ToastContext';
import {
  Download, Calendar, RefreshCw, Filter, ChevronDown, FileDown,
  FileSpreadsheet, FileText, BarChart2, TrendingUp, TrendingDown,
  Users, DollarSign, MessageSquare, Send, Eye, CheckCircle, XCircle,
  Target, Zap, ArrowUpRight, ArrowDownRight, MoreVertical, Share2,
  Bell, Mail, Search, ChevronLeft, ChevronRight, Info
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area,
  ComposedChart
} from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const monthlyRevenue = [
  { month: 'Jan', revenue: 18500000, cost: 4200000, roi: 340 },
  { month: 'Feb', revenue: 22300000, cost: 4800000, roi: 365 },
  { month: 'Mar', revenue: 19800000, cost: 3900000, roi: 408 },
  { month: 'Apr', revenue: 27500000, cost: 5200000, roi: 429 },
  { month: 'Mei', revenue: 24100000, cost: 4600000, roi: 424 },
  { month: 'Jun', revenue: 31200000, cost: 5800000, roi: 438 },
];

const campaignROI = [
  { campaign: 'Promo Internet 2026', sent: 12845, converted: 2340, revenue: 11700000, roi: 245, cost: 1850000 },
  { campaign: 'Pengingat Pembayaran', sent: 9632, converted: 4210, revenue: 21050000, roi: 412, cost: 980000 },
  { campaign: 'Pelanggan Baru', sent: 7845, converted: 1560, revenue: 7800000, roi: 180, cost: 1230000 },
  { campaign: 'Upgrade Paket', sent: 6215, converted: 890, revenue: 8900000, roi: 310, cost: 680000 },
  { campaign: 'Survey Kepuasan', sent: 4876, converted: 320, revenue: 1600000, roi: 85, cost: 420000 },
];

const conversionFunnel = [
  { stage: 'Terkirim', value: 48765, pct: 100, color: '#3b82f6' },
  { stage: 'Diterima', value: 42328, pct: 86.8, color: '#6366f1' },
  { stage: 'Dibaca', value: 37205, pct: 76.3, color: '#8b5cf6' },
  { stage: 'Dibalas', value: 8945, pct: 18.3, color: '#a855f7' },
  { stage: 'Konversi', value: 9320, pct: 19.1, color: '#10b981' },
];

const churnData = [
  { month: 'Jan', retained: 94.2, churned: 5.8 },
  { month: 'Feb', retained: 95.1, churned: 4.9 },
  { month: 'Mar', retained: 93.8, churned: 6.2 },
  { month: 'Apr', retained: 96.2, churned: 3.8 },
  { month: 'Mei', retained: 95.8, churned: 4.2 },
  { month: 'Jun', retained: 96.9, churned: 3.1 },
];

const channelPerformance = [
  { name: 'WhatsApp Center 1', messages: 18241, conversions: 3420, revenue: 17100000, cac: 5400 },
  { name: 'WhatsApp Center 2', messages: 14320, conversions: 2890, revenue: 14450000, cac: 4950 },
  { name: 'WhatsApp Center 3', messages: 11880, conversions: 2100, revenue: 10500000, cac: 5660 },
  { name: 'WhatsApp Center 4', messages: 4324, conversions: 910, revenue: 4550000, cac: 4750 },
];

const sentimentData = [
  { name: 'Positif', value: 68.4, color: '#10b981' },
  { name: 'Netral', value: 22.3, color: '#f59e0b' },
  { name: 'Negatif', value: 9.3, color: '#ef4444' },
];

const agentRevenueData = [
  { name: 'Budi Santoso', conversions: 842, revenue: 4210000, avgDeal: 5000 },
  { name: 'Siti Aminah', conversions: 760, revenue: 3800000, avgDeal: 5000 },
  { name: 'Andi Pratama', conversions: 610, revenue: 3050000, avgDeal: 5000 },
  { name: 'Dewi Lestari', conversions: 480, revenue: 2400000, avgDeal: 5000 },
  { name: 'Fajar Nugroho', conversions: 390, revenue: 1950000, avgDeal: 5000 },
];

// ─── Helper Components ───────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);
const fmtRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

const KpiCard = ({
  icon: Icon, iconBg, iconColor, label, value, sub, trend, trendUp
}: {
  icon: any; iconBg: string; iconColor: string;
  label: string; value: string; sub: string; trend: string; trendUp: boolean;
}) => (
  <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className={`p-2.5 rounded-xl border ${iconBg}`} style={{ borderColor: `${iconColor}30` }}>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <span className={`flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {trendUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {trend}
      </span>
    </div>
    <div>
      <p className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-[var(--app-text)] mt-1 leading-none">{value}</p>
      <p className="text-[9px] text-[var(--app-muted)] mt-1">{sub}</p>
    </div>
  </div>
);

const TABS = ['Ringkasan Eksekutif', 'ROI & Konversi', 'Performa Campaign', 'Performa Agent', 'Churn & Retensi', 'Analisis Sentimen'];

// ─── Tab: Ringkasan Eksekutif ─────────────────────────────────────────────────

function TabExecSummary() {
  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign} iconBg="bg-green-500/10" iconColor="#10b981"
          label="Total Revenue dari WA" value="Rp 31,2 Jt" sub="Juni 2026"
          trend="+29.5% vs Mei" trendUp={true} />
        <KpiCard icon={Target} iconBg="bg-blue-500/10" iconColor="#3b82f6"
          label="Total Konversi" value="9.320" sub="dari 48.765 pesan terkirim"
          trend="+18.3% vs Mei" trendUp={true} />
        <KpiCard icon={BarChart2} iconBg="bg-purple-500/10" iconColor="#8b5cf6"
          label="ROI WhatsApp" value="438%" sub="(Revenue / Biaya Campaign)"
          trend="+14 poin vs Mei" trendUp={true} />
        <KpiCard icon={Users} iconBg="bg-orange-500/10" iconColor="#f97316"
          label="Customer Dipertahankan" value="96.9%" sub="Retention rate Juni 2026"
          trend="+1.1% vs Mei" trendUp={true} />
      </div>

      {/* Revenue + ROI Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-[var(--app-text)]">Tren Revenue & Biaya (6 Bulan)</h4>
              <p className="text-[9px] text-[var(--app-muted)]">Revenue yang dihasilkan via WhatsApp Campaign</p>
            </div>
            <select className="bg-[var(--app-bg)] border border-[var(--app-border)] text-[9px] py-1 px-2 rounded-lg text-[var(--app-text)]/80 focus:outline-none">
              <option>6 Bulan Terakhir</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000000).toFixed(0)}Jt`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 10 }}
                formatter={(v: any, name: string) => name === 'roi' ? [`${v}%`, 'ROI'] : [fmtRp(v), name === 'revenue' ? 'Revenue' : 'Biaya']} />
              <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 9 }} />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#10b981" opacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar yAxisId="left" dataKey="cost" name="Biaya" fill="#ef4444" opacity={0.6} radius={[3, 3, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI %" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">Funnel Konversi WhatsApp</h4>
            <p className="text-[9px] text-[var(--app-muted)]">Alur dari pesan terkirim hingga konversi pelanggan</p>
          </div>
          <div className="space-y-2 mt-2">
            {conversionFunnel.map((stage, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-[var(--app-muted)] font-semibold">{stage.stage}</span>
                  <span className="text-[var(--app-text)] font-bold">{fmt(stage.value)} <span className="text-[var(--app-muted)] font-normal">({stage.pct}%)</span></span>
                </div>
                <div className="h-5 bg-[var(--app-border)]/20 rounded-md overflow-hidden relative">
                  <div className="h-full rounded-md transition-all duration-500" style={{ width: `${stage.pct}%`, backgroundColor: stage.color }} />
                  <span className="absolute inset-0 flex items-center pl-2 text-[8px] text-[var(--app-text)] font-bold">{stage.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Churn + Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">Retensi vs Churn Pelanggan</h4>
            <p className="text-[9px] text-[var(--app-muted)]">Dampak komunikasi WhatsApp terhadap retensi</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={churnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 10 }}
                formatter={(v: any, name: string) => [`${v}%`, name === 'retained' ? 'Dipertahankan' : 'Churn']} />
              <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 9 }} />
              <Area type="monotone" dataKey="retained" name="retained" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="churned" name="churned" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">Sentimen Pelanggan via WA</h4>
            <p className="text-[9px] text-[var(--app-muted)]">Analisis sentimen dari percakapan Juni 2026</p>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={sentimentData} dataKey="value" innerRadius={35} outerRadius={55} startAngle={90} endAngle={-270}>
                  {sentimentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {sentimentData.map((d, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[9px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--app-muted)]">{d.name}</span>
                    </span>
                    <span className="text-[var(--app-text)] font-bold">{d.value}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--app-border)]/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Performa Campaign ───────────────────────────────────────────────────

function TabCampaignROI() {
  const { toast } = useToast();
  return (
    <div className="space-y-5">
      <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">ROI per Campaign</h4>
            <p className="text-[9px] text-[var(--app-muted)]">Performa bisnis setiap campaign WhatsApp</p>
          </div>
          <button onClick={() => toast.success("Mengunduh laporan performa campaign...")} className="flex items-center gap-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors">
            <Download size={11} /> Export
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
          <table className="w-full text-left border-collapse text-[9px] text-[var(--app-text)]/80 min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                <th className="px-3 py-2.5">Campaign</th>
                <th className="px-3 py-2.5 text-center">Pesan Terkirim</th>
                <th className="px-3 py-2.5 text-center">Konversi</th>
                <th className="px-3 py-2.5 text-center">Conversion Rate</th>
                <th className="px-3 py-2.5 text-center">Revenue</th>
                <th className="px-3 py-2.5 text-center">Biaya</th>
                <th className="px-3 py-2.5 text-center">ROI</th>
                <th className="px-3 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--app-border)]">
              {campaignROI.map((row, i) => {
                const cvr = ((row.converted / row.sent) * 100).toFixed(1);
                const roiGood = row.roi >= 300;
                return (
                  <tr key={i} className="hover:bg-[var(--app-border)]/20 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.campaign}</td>
                    <td className="px-3 py-2.5 text-center text-[var(--app-text)]/80">{fmt(row.sent)}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-[var(--app-text)]">{fmt(row.converted)}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-blue-400">{cvr}%</td>
                    <td className="px-3 py-2.5 text-center font-bold text-green-400">{fmtRp(row.revenue)}</td>
                    <td className="px-3 py-2.5 text-center text-[var(--app-muted)]">{fmtRp(row.cost)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-black text-sm ${roiGood ? 'text-green-400' : 'text-yellow-400'}`}>{row.roi}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${roiGood ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {roiGood ? 'Excellent' : 'Good'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar chart ROI */}
      <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-[var(--app-text)]">Perbandingan ROI per Campaign</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={campaignROI} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="campaign" tick={{ fontSize: 8, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 10 }}
              formatter={(v: any) => [`${v}%`, 'ROI']} />
            <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
              {campaignROI.map((d, i) => <Cell key={i} fill={d.roi >= 300 ? '#10b981' : '#f59e0b'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Tab: Performa Agent (Revenue) ───────────────────────────────────────────

function TabAgentRevenue() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">Revenue per Agent</h4>
            <p className="text-[9px] text-[var(--app-muted)]">Kontribusi revenue setiap CS Agent dari WhatsApp</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agentRevenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000000).toFixed(0)}Jt`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: '#0b1329', border: '1px solid #131d35', borderRadius: 8, fontSize: 10 }}
                formatter={(v: any) => [fmtRp(v), 'Revenue']} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-[var(--app-text)]">Tabel Performa Agent</h4>
            <p className="text-[9px] text-[var(--app-muted)]">Konversi dan revenue yang dihasilkan per agent</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
            <table className="w-full text-left border-collapse text-[9px]">
              <thead>
                <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                  <th className="px-3 py-2">Agent</th>
                  <th className="px-3 py-2 text-center">Konversi</th>
                  <th className="px-3 py-2 text-center">Revenue</th>
                  <th className="px-3 py-2 text-center">Avg Deal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {agentRevenueData.map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--app-border)]/20 transition-colors">
                    <td className="px-3 py-2 font-bold text-[var(--app-text)]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[7px] font-black text-[var(--app-text)]">
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {row.name}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-bold text-[var(--app-text)]">{fmt(row.conversions)}</td>
                    <td className="px-3 py-2 text-center font-bold text-green-400">{fmtRp(row.revenue)}</td>
                    <td className="px-3 py-2 text-center text-[var(--app-muted)]">{fmtRp(row.avgDeal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl p-4 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-[var(--app-text)]">Performa Revenue per Channel / Nomor WA</h4>
          <p className="text-[9px] text-[var(--app-muted)]">Perbandingan revenue dan CAC antar nomor WhatsApp Business</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
          <table className="w-full text-left border-collapse text-[9px] min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--app-border)] bg-[var(--app-border)]/20 text-[var(--app-muted)] font-bold uppercase">
                <th className="px-3 py-2.5">Channel / Nomor</th>
                <th className="px-3 py-2.5 text-center">Pesan</th>
                <th className="px-3 py-2.5 text-center">Konversi</th>
                <th className="px-3 py-2.5 text-center">Revenue</th>
                <th className="px-3 py-2.5 text-center">CAC (Cost/Konversi)</th>
                <th className="px-3 py-2.5 text-center">Efisiensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--app-border)]">
              {channelPerformance.map((row, i) => {
                const efficiency = row.cac < 5000 ? 'Tinggi' : row.cac < 5500 ? 'Sedang' : 'Rendah';
                const effColor = efficiency === 'Tinggi' ? 'text-green-400 bg-green-500/10 border-green-500/20' : efficiency === 'Sedang' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
                return (
                  <tr key={i} className="hover:bg-[var(--app-border)]/20 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-[var(--app-text)]">{row.name}</td>
                    <td className="px-3 py-2.5 text-center text-[var(--app-text)]/80">{fmt(row.messages)}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-[var(--app-text)]">{fmt(row.conversions)}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-green-400">{fmtRp(row.revenue)}</td>
                    <td className="px-3 py-2.5 text-center text-[var(--app-text)]/80">{fmtRp(row.cac)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${effColor}`}>{efficiency}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder ─────────────────────────────────────────────────────────────

// TabPlaceholder replaced by ReportSubTabDetail

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportsWhatsappPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Ringkasan Eksekutif');
  const [showExport, setShowExport] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'Ringkasan Eksekutif': return <TabExecSummary />;
      case 'ROI & Konversi':
      case 'Performa Campaign': return <TabCampaignROI />;
      case 'Performa Agent': return <TabAgentRevenue />;
      default: return <ReportSubTabDetail tabName={activeTab} category="WhatsApp" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">

        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-3 border-b border-[var(--app-border)] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-[var(--app-muted)] font-semibold mb-1">
              <span>Reports</span><span className="text-gray-600">›</span>
              <span className="text-blue-400">WhatsApp Report</span>
            </div>
            <h1 className="text-xl font-black text-[var(--app-text)] tracking-tight">WhatsApp Report</h1>
            <p className="text-[10px] text-[var(--app-muted)] mt-0.5">
              Laporan bisnis & eksekutif: ROI campaign, konversi, churn, dan analisis revenue dari WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] px-3 py-1.5 rounded-lg">
              <Calendar size={11} className="text-blue-400" />
              <span className="text-[9px] text-[var(--app-text)]/80">01 Jun - 30 Jun 2026</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowExport(v => !v)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                <Download size={11} /> Export <ChevronDown size={9} className={showExport ? 'rotate-180' : ''} />
              </button>
              {showExport && (
                <div className="absolute right-0 top-full mt-1 z-10 bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xl overflow-hidden w-40">
                  {[
                    { label: 'Export PDF', icon: FileDown, color: 'text-red-400' },
                    { label: 'Export Excel', icon: FileSpreadsheet, color: 'text-green-400' },
                    { label: 'Export CSV', icon: FileText, color: 'text-blue-400' },
                  ].map(e => (
                    <button key={e.label} onClick={() => { if (e.label === "Export PDF") { window.print(); } else { toast.success(`${e.label} berhasil diekspor.`); } setShowExport(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-[var(--app-text)]/80 hover:bg-[var(--app-border)]/30 transition-colors">
                      <e.icon size={12} className={e.color} />{e.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => toast.success("Menjadwalkan laporan otomatis berkala via WhatsApp...")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-text)]/80 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
              <Calendar size={11} className="text-blue-400" /> Jadwalkan
            </button>
            <button onClick={() => { toast.info("Menyegarkan analitik pesan..."); window.location.reload(); }} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-border)]/30 text-[var(--app-muted)] text-[10px] px-2.5 py-1.5 rounded-lg transition-colors">
              <RefreshCw size={11} />
            </button>
          </div>
        </div>

        {/* ─── Filters ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end gap-2.5">
          {[
            { label: 'Periode', opt: 'Juni 2026' },
            { label: 'Dibandingkan', opt: 'Mei 2026' },
            { label: 'Channel / Nomor', opt: 'Semua Nomor' },
            { label: 'Campaign', opt: 'Semua Campaign' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <span className="text-[10px] text-[var(--app-text-muted)] font-semibold uppercase px-0.5">{f.label}</span>
              <select className="bg-[var(--app-card)] border border-[var(--app-border)] text-xs py-1.5 px-2.5 rounded-lg text-[var(--app-text)] focus:outline-none focus:border-blue-500 transition-colors">
                <option>{f.opt}</option>
              </select>
            </div>
          ))}
          <button onClick={() => toast.info("Membuka filter lanjutan & kustomisasi periode...")} className="flex items-center gap-1.5 bg-[var(--app-card)] border border-[var(--app-border)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs"><Filter size={12} /> Filter Lainnya</button>
        </div>

        {/* ─── Info Banner ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-2.5">
          <Info size={14} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            <span className="font-semibold">Halaman ini</span> menampilkan laporan bisnis &amp; eksekutif WhatsApp: mencakup ROI campaign, analisis konversi, revenue, churn rate, dan performa per channel.
            Untuk laporan operasional harian (pengiriman pesan, status, response time), gunakan menu{' '}
            <span className="font-semibold text-[var(--app-text)]">WhatsApp → Laporan</span>.
          </p>
        </div>

        {/* ─── Sub-tabs ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 border-b border-[var(--app-border)] pb-px overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─────────────────────────────────────────────── */}
        {renderTab()}

      </div>
    </Layout>
  );
}
