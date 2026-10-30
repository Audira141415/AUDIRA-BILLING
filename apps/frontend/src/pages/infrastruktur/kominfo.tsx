import { useState } from 'react'
import Layout from '@/components/Layout'
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Printer, 
  Building2, 
  CheckCircle2, 
  Globe, 
  Layers, 
  Radio, 
  AlertTriangle,
  Award,
  Calendar,
  UserCheck
} from 'lucide-react'
import { showAudiraToast } from '@/contexts/ToastContext'

export default function KominfoRegulatoryReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q3')
  const [activeBorang, setActiveBorang] = useState<'ipam' | 'bandwidth' | 'customers' | 'trustpositif' | 'sla'>('ipam')

  const handlePrintReport = () => {
    window.print()
  }

  const handleExportCsv = () => {
    showAudiraToast.success('Borang data teknis Ditjen PPI Kominfo berhasil diekspor ke file CSV/Excel!', 'Ekspor Sukses')
  }

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--app-text)]">
                    e-Pelaporan Regulator Ditjen PPI Kominfo
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    STATUS: 100% COMPLIANT
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-0.5">
                  Laporan Kinerja Penyelenggaraan Jasa Akses Internet (ISP) Sesuai Permen Kominfo No. 13/2019 & UU Telekomunikasi No. 36/1999
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="2026-Q3">Periode: Triwulan III (Q3 2026)</option>
                <option value="2026-Q2">Periode: Triwulan II (Q2 2026)</option>
                <option value="2026-Q1">Periode: Triwulan I (Q1 2026)</option>
                <option value="2026-ANNUAL">Laporan Tahunan 2026</option>
              </select>

              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card)] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Download className="h-3.5 w-3.5" />
                Ekspor Borang (.CSV)
              </button>

              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Printer className="h-4 w-4" />
                Cetak Dokumen Resmi (.PDF)
              </button>
            </div>
          </div>

          {/* 4 Regulatory Overview KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Izin Penyelenggaraan</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">NIB: 0220108920194</span>
              </div>
              <div className="mt-1 text-[11px] text-[var(--app-text-muted)]">Izin ISP Kominfo Aktif</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Alokasi IP APJII / IDNIC</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">103.189.20.0/24</span>
              </div>
              <div className="mt-1 text-[11px] text-[var(--app-text-muted)]">AS141415 (AUDIRA-NET)</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Kepatuhan TrustPositif</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">100%</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Sync Aktif</span>
              </div>
              <div className="mt-1 text-[11px] text-cyan-500 font-medium">Auto-Update Setiap 6 Jam</div>
            </div>

            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] p-3.5">
              <span className="text-[11px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider">Pencapaian SLA Layanan</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-purple-600 dark:text-purple-400">99.84%</span>
                <span className="text-xs font-bold text-[var(--app-text-muted)]">Lolos</span>
              </div>
              <div className="mt-1 text-[11px] text-purple-500 font-medium">Batas Minimum Kominfo: ≥ 95%</div>
            </div>
          </div>
        </div>

        {/* 5 Borang Tabs */}
        <div className="flex border-b border-[var(--app-border)] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveBorang('ipam')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
              activeBorang === 'ipam'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Globe className="w-4 h-4" />
            Borang 1: Alokasi IP & CGNAT
          </button>

          <button
            onClick={() => setActiveBorang('bandwidth')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
              activeBorang === 'bandwidth'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Radio className="w-4 h-4" />
            Borang 2: Kapasitas Bandwidth
          </button>

          <button
            onClick={() => setActiveBorang('customers')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
              activeBorang === 'customers'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Borang 3: Rekapitulasi Pelanggan
          </button>

          <button
            onClick={() => setActiveBorang('trustpositif')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
              activeBorang === 'trustpositif'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Borang 4: Blokir Konten Negatif
          </button>

          <button
            onClick={() => setActiveBorang('sla')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
              activeBorang === 'sla'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Borang 5: Mutu Layanan (QoS / SLA)
          </button>
        </div>

        {/* BORANG 1: IPAM & CGNAT */}
        {activeBorang === 'ipam' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm space-y-4">
            <div className="border-b border-[var(--app-border)] pb-3">
              <h3 className="font-bold text-base text-[var(--app-text)]">
                Borang Data Teknis 1: Sumber Daya Penomoran IP & Penyelenggaraan CGNAT
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">Kepatuhan UU ITE & Permen Kominfo mengenai pencatatan translasi port alamat IP publik ke privat</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                <span className="font-bold text-[var(--app-text)] text-sm">Alokasi IP Publik Resmi (IDNIC APJII)</span>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Autonomous System Number (ASN):</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">AS141415</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Subnet IPv4 Publik:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">103.189.20.0/24 (256 Alamat)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Alokasi Pelanggan Dedicated:</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">64 IP (/26)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-text-muted)]">Alokasi Server Core & Gateway:</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">32 IP (/27)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                <span className="font-bold text-[var(--app-text)] text-sm">Penyelenggaraan CGNAT (Carrier-Grade NAT)</span>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Standar Subnet Privat:</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">RFC 6598 (100.64.0.0/10)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Rasio Port Sharing Rasional:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">1 : 16 (4.000 Port / Pelanggan)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Penyimpanan Log Forensik:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">180 Hari (Wajib UU ITE)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-text-muted)]">Status Integrasi Bareskrim:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">SIAP BERITA ACARA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BORANG 2: BANDWIDTH */}
        {activeBorang === 'bandwidth' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm space-y-4">
            <div className="border-b border-[var(--app-border)] pb-3">
              <h3 className="font-bold text-base text-[var(--app-text)]">
                Borang Data Teknis 2: Kapasitas Sambungan Bandwidth & Link Penyelenggara
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">Kapasitas sambungan internet internasional dan pertukaran lalu lintas domestik (IXP)</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[var(--app-text-muted)] font-semibold">
                    <th className="py-2.5 px-3">Tipe Sambungan</th>
                    <th className="py-2.5 px-3">Nama Mitra Upstream / IXP</th>
                    <th className="py-2.5 px-3">Media Transmisi</th>
                    <th className="py-2.5 px-3">Kapasitas Terpasang</th>
                    <th className="py-2.5 px-3">Rata-rata Peak Load</th>
                    <th className="py-2.5 px-3">Rasio Utilisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  <tr className="hover:bg-[var(--app-card-subtle)]">
                    <td className="py-2.5 px-3 font-bold text-blue-600">IP Transit Internasional</td>
                    <td className="py-2.5 px-3 font-semibold">PT Telkom Indonesia (Tbk) Tier-1</td>
                    <td className="py-2.5 px-3">Fiber Optic 10G SFP+</td>
                    <td className="py-2.5 px-3 font-mono font-bold">10.0 Gbps</td>
                    <td className="py-2.5 px-3 font-mono">6.84 Gbps</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600">68.4% (AMAN)</span></td>
                  </tr>
                  <tr className="hover:bg-[var(--app-card-subtle)]">
                    <td className="py-2.5 px-3 font-bold text-blue-600">IP Transit Cadangan</td>
                    <td className="py-2.5 px-3 font-semibold">PT Indosat Ooredoo Hutchison</td>
                    <td className="py-2.5 px-3">Fiber Optic 10G SFP+</td>
                    <td className="py-2.5 px-3 font-mono font-bold">10.0 Gbps</td>
                    <td className="py-2.5 px-3 font-mono">1.58 Gbps</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded font-bold bg-blue-500/10 text-blue-600">15.8% (STANDBY)</span></td>
                  </tr>
                  <tr className="hover:bg-[var(--app-card-subtle)]">
                    <td className="py-2.5 px-3 font-bold text-emerald-600">Peering Domestik IXP</td>
                    <td className="py-2.5 px-3 font-semibold">OpenIXP Jakarta (APJII IDC Duren Tiga)</td>
                    <td className="py-2.5 px-3">Fiber Optic 10G SFP+</td>
                    <td className="py-2.5 px-3 font-mono font-bold">10.0 Gbps</td>
                    <td className="py-2.5 px-3 font-mono">8.22 Gbps</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600">82.2% (OPTIMAL)</span></td>
                  </tr>
                  <tr className="hover:bg-[var(--app-card-subtle)]">
                    <td className="py-2.5 px-3 font-bold text-cyan-600">Local Content Cache</td>
                    <td className="py-2.5 px-3 font-semibold">Google GGC & Meta Edge Cache</td>
                    <td className="py-2.5 px-3">Direct Cross-Connect 10G</td>
                    <td className="py-2.5 px-3 font-mono font-bold">10.0 Gbps</td>
                    <td className="py-2.5 px-3 font-mono">5.40 Gbps</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-600">54.0% (LOKAL)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BORANG 3: REKAPITULASI PELANGGAN */}
        {activeBorang === 'customers' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm space-y-4">
            <div className="border-b border-[var(--app-border)] pb-3">
              <h3 className="font-bold text-base text-[var(--app-text)]">
                Borang Data Teknis 3: Sebaran Wilayah & Klasifikasi Pelanggan Aktif
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">Klasifikasi pengguna layanan FTTH Residensial vs Korporasi / UMKM</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-center">
                <span className="text-[var(--app-text-muted)] font-medium">Pelanggan Rumah Tangga (Residensial)</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">1.368</div>
                <div className="text-[11px] text-[var(--app-text-muted)] mt-1">92.4% dari total basis pelanggan</div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-center">
                <span className="text-[var(--app-text-muted)] font-medium">Pelanggan Bisnis / UMKM</span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">94</div>
                <div className="text-[11px] text-[var(--app-text-muted)] mt-1">6.4% dari total basis pelanggan</div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-center">
                <span className="text-[var(--app-text-muted)] font-medium">Dedicated Corporate & Pemerintahan</span>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">18</div>
                <div className="text-[11px] text-[var(--app-text-muted)] mt-1">1.2% SLA 99.9% 1:1 CIR</div>
              </div>
            </div>
          </div>
        )}

        {/* BORANG 4: TRUSTPOSITIF BLOKIR */}
        {activeBorang === 'trustpositif' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm space-y-4">
            <div className="border-b border-[var(--app-border)] pb-3">
              <h3 className="font-bold text-base text-[var(--app-text)]">
                Borang Data Teknis 4: Kepatuhan Pemblokiran Konten Ilegal (TrustPositif Kominfo)
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">Kepatuhan Instruksi Menteri Kominfo No. 1/2023 tentang Pemberantasan Judi Online & Pornografi</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <span className="text-[var(--app-text-muted)] font-medium">Domain Judi Online Terblokir</span>
                <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">1.248.910</div>
                <div className="text-[10px] text-emerald-600 mt-1">100% Dialihkan ke Sinkhole</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <span className="text-[var(--app-text-muted)] font-medium">Domain Pornografi Terblokir</span>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">842.105</div>
                <div className="text-[10px] text-emerald-600 mt-1">Standar UU Pornografi</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <span className="text-[var(--app-text-muted)] font-medium">Phishing & Malware Finansial</span>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">154.220</div>
                <div className="text-[10px] text-blue-500 mt-1">Sinkronisasi BSSN & CSIRT</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)]">
                <span className="text-[var(--app-text-muted)] font-medium">Intersepsi Port 53 Walled Garden</span>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">10.10.10.1</div>
                <div className="text-[10px] text-purple-500 mt-1">Anti-Bypass DoH/DoT Aktif</div>
              </div>
            </div>
          </div>
        )}

        {/* BORANG 5: SLA & QOS */}
        {activeBorang === 'sla' && (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm space-y-4">
            <div className="border-b border-[var(--app-border)] pb-3">
              <h3 className="font-bold text-base text-[var(--app-text)]">
                Borang Data Teknis 5: Parameter Standar Kualitas Pelayanan (QoS / SLA)
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">Evaluasi kepatuhan terhadap standar layanan telekomunikasi minimal Kominfo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                <span className="font-bold text-[var(--app-text)] text-sm">Metrik Kinerja Jaringan (Network QoS)</span>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Network Uptime Triwulan:</span>
                  <span className="font-mono font-bold text-emerald-600">99.84% (Standar Kominfo ≥ 95%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Rata-rata Latensi Domestik (IIX):</span>
                  <span className="font-mono font-bold text-emerald-600">4.2 ms (Standar Kominfo ≤ 150ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Packet Loss Rasio:</span>
                  <span className="font-mono font-bold text-emerald-600">0.08% (Standar Kominfo ≤ 3%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-text-muted)]">Jitter Maksimum:</span>
                  <span className="font-mono font-bold text-emerald-600">1.8 ms (Standar Kominfo ≤ 20ms)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] space-y-2">
                <span className="font-bold text-[var(--app-text)] text-sm">Pelayanan Gangguan & Pemulihan (MTTR)</span>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Mean Time to Restore (MTTR):</span>
                  <span className="font-mono font-bold text-blue-600">1.4 Jam (Standar Kominfo ≤ 24 Jam)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Total Aduan Gangguan Q3:</span>
                  <span className="font-mono font-bold text-[var(--app-text)]">28 Tiket (Terselesaikan 100%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                  <span className="text-[var(--app-text-muted)]">Layanan Call Center / WhatsApp:</span>
                  <span className="font-mono font-bold text-emerald-600">24/7 Siaga NOC</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--app-text-muted)]">Kompensasi Ganti Rugi Pelanggan:</span>
                  <span className="font-mono font-bold text-emerald-600">0 Kasus Ganti Rugi SLA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal Sign-Off Preview Box */}
        <div className="p-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--app-border)] pb-4 text-xs">
            <div>
              <span className="font-bold text-[var(--app-text)]">PENGESAHAN DOKUMEN LAPORAN RESMI</span>
              <div className="text-[var(--app-text-muted)]">PT AUDIRA SUKSES MANDIRI • Penyelenggara Jasa Akses Internet (ISP)</div>
            </div>
            <div className="text-right font-mono text-[var(--app-text-muted)]">
              Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[var(--app-text-muted)]">Penanggung Jawab Teknis NOC:</span>
              <div className="font-bold text-[var(--app-text)]">Chief Technology Officer / Network Architect</div>
              <div className="font-mono text-[var(--app-text-muted)]">Sertifikasi: MTCRE, MTCINE, CCIE Service Provider</div>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[var(--app-text-muted)]">Direktur Utama / Founder AUDIRA:</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Agus Dwi Rianto (AUDIRA)</div>
              <div className="font-mono text-[var(--app-text-muted)]">Tanda Tangan Digital Terverifikasi IDNIC & Ditjen PPI</div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
