import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Server,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  QrCode,
  FileText,
  Lock
} from 'lucide-react'

export default function SubscriptionManagementPage() {
  const [currentPlan, setCurrentPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO')
  const [daysRemaining, setDaysRemaining] = useState<number>(24)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string>('PRO')

  const stats = {
    customerUsed: 248,
    customerLimit: 500,
    routerUsed: 2,
    routerLimit: 3,
    tunnelUsed: 1,
    tunnelLimit: 3,
  }

  const customerPercent = Math.round((stats.customerUsed / stats.customerLimit) * 100)
  const routerPercent = Math.round((stats.routerUsed / stats.routerLimit) * 100)

  return (
    <Layout>
      <Head>
        <title>Status Lisensi &amp; Langganan SaaS — AUDIRA-NET</title>
      </Head>

      <div className="min-h-screen text-[var(--app-text)] p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--app-border)]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
                Status Lisensi &amp; Langganan Platform
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                PAKET PRO AKTIF
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)] mt-1">
              Pantau kuota pelanggan terdaftar, jumlah router terkoneksi, dan kelola perpanjangan masa aktif sistem.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Zap size={14} />
              <span>Perpanjang / Upgrade Paket</span>
            </button>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-white/20 border border-white/30">
                  SaaS Subscription Tier
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-white/90">
                  <Clock size={14} />
                  Sisa {daysRemaining} Hari Aktif
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight mt-4">
                AUDIRA-NET Pro Edition
              </h2>
              <p className="text-xs text-white/80 max-w-xl mt-1">
                Lisensi operasional ISP dengan RADIUS CoA Real-Time, Pemetaan Spasial GIS ODP, Kasir Kolektor Lapangan, dan Dukungan Teknis Prioritas 24/7.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/20 text-xs">
              <div>
                <p className="text-white/70 text-[11px]">Batas Pelanggan</p>
                <p className="text-lg font-black font-mono">500 Akun</p>
              </div>
              <div>
                <p className="text-white/70 text-[11px]">Batas Router BNG</p>
                <p className="text-lg font-black font-mono">3 MikroTik</p>
              </div>
              <div>
                <p className="text-white/70 text-[11px]">Status CoA Port 3799</p>
                <p className="text-lg font-black text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={16} /> Online
                </p>
              </div>
            </div>
          </div>

          {/* Quota Usage Gauge Card */}
          <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">
                Utilisasi Kuota Langganan
              </p>
              <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
                Penggunaan kapasitas lisensi saat ini.
              </p>
            </div>

            <div className="space-y-4">
              {/* Customer Quota */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[var(--app-text)]">Pelanggan Aktif</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {stats.customerUsed} / {stats.customerLimit} ({customerPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--app-bg)] h-2 rounded-full overflow-hidden border border-[var(--app-border)]">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${customerPercent}%` }}
                  />
                </div>
              </div>

              {/* Router Quota */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[var(--app-text)]">Router MikroTik</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {stats.routerUsed} / {stats.routerLimit} ({routerPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--app-bg)] h-2 rounded-full overflow-hidden border border-[var(--app-border)]">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${routerPercent}%` }}
                  />
                </div>
              </div>

              {/* WireGuard Tunnel Quota */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[var(--app-text)]">Cloud Tunnel WireGuard</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {stats.tunnelUsed} / {stats.tunnelLimit} Aktif
                  </span>
                </div>
                <div className="w-full bg-[var(--app-bg)] h-2 rounded-full overflow-hidden border border-[var(--app-border)]">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '33%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/landing#harga"
                className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1"
              >
                <span>Lihat Tabel Paket &amp; Fitur Lengkap</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Upgrade / Billing History */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--app-text)]">
                Riwayat Pembayaran Langganan SaaS
              </h3>
              <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                Kwitansi dan invoice resmi tagihan platform AUDIRA.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--app-text-muted)]">
              Auto-Renewal: Nonaktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-mono text-[11px]">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Paket Layanan</th>
                  <th className="py-2.5 px-3">Periode</th>
                  <th className="py-2.5 px-3">Nominal</th>
                  <th className="py-2.5 px-3">Metode</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    INV-SaaS-202610-092
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--app-text)]">
                    AUDIRA Pro (500 Pelanggan)
                  </td>
                  <td className="py-3 px-3 text-[var(--app-text-muted)] font-mono">
                    24 Okt 2026 - 24 Nov 2026
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[var(--app-text)]">
                    Rp 249.000
                  </td>
                  <td className="py-3 px-3 text-[var(--app-text-muted)]">QRIS Dinamis</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      LUNAS
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    INV-SaaS-202609-041
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--app-text)]">
                    AUDIRA Starter (100 Pelanggan)
                  </td>
                  <td className="py-3 px-3 text-[var(--app-text-muted)] font-mono">
                    24 Sep 2026 - 24 Okt 2026
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[var(--app-text)]">
                    Rp 99.000
                  </td>
                  <td className="py-3 px-3 text-[var(--app-text-muted)]">BCA Virtual Account</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      LUNAS
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Payment / Upgrade */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in-smooth">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--app-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--app-text)]">
                      Perpanjang Langganan SaaS
                    </h3>
                    <p className="text-[11px] text-[var(--app-text-muted)]">
                      Pembayaran otomatis terverifikasi via QRIS Dinamis.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[var(--app-text)]">Paket Pro (30 Hari Tambahan)</p>
                  <p className="text-[11px] text-[var(--app-text-muted)]">Kuota 500 Pelanggan + 3 Router</p>
                </div>
                <p className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
                  Rp 249.000
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800 mb-2">Scan QRIS Dinamis untuk Membayar:</p>
                <div className="w-44 h-44 bg-slate-100 mx-auto rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                  <QrCode size={120} className="text-slate-800" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-2">NMID: ID1029384756192 | PT Audira</p>
              </div>

              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  setDaysRemaining(prev => prev + 30)
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Simulasi Konfirmasi Pembayaran Lunas
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

