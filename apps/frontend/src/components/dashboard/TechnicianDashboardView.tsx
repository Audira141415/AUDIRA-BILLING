'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@/contexts/ToastContext'
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Radio,
  Camera,
  Boxes,
  FileCheck,
  ChevronRight,
  Send,
  Navigation,
  QrCode,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'
import clsx from 'clsx'

interface WorkOrder {
  id: string
  spkNumber: string
  type: 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE'
  customerName: string
  customerPhone: string
  address: string
  odpName: string
  odpPort: number
  cableLengthMeters: number
  status: 'ASSIGNED' | 'ON_ROUTE' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'URGENT' | 'HIGH' | 'NORMAL'
  scheduledTime: string
  targetRxDbm: string
  notes?: string
}

const INITIAL_SPK_LIST: WorkOrder[] = [
  {
    id: 'spk-01',
    spkNumber: 'SPK/PSB/2026/10/084',
    type: 'INSTALLATION',
    customerName: 'Bpk. Wahyu Hidayat',
    customerPhone: '081277665544',
    address: 'Perumahan Graha Mas Blok B3 No. 12, Batam Center',
    odpName: 'ODP-BC-08',
    odpPort: 5,
    cableLengthMeters: 85,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    scheduledTime: '09:30 WIB',
    targetRxDbm: '-18 s/d -22 dBm',
    notes: 'Pasang Baru 50 Mbps. Modem Huawei HG8245H5 disediakan dari gudang.',
  },
  {
    id: 'spk-02',
    spkNumber: 'SPK/REP/2026/10/085',
    type: 'REPAIR',
    customerName: 'Ibu Ratna Sari',
    customerPhone: '081388990011',
    address: 'Kavling Sambau Blok D No. 44, Nongsa',
    odpName: 'ODP-NG-03',
    odpPort: 2,
    cableLengthMeters: 140,
    status: 'ON_ROUTE',
    priority: 'URGENT',
    scheduledTime: '13:00 WIB',
    targetRxDbm: '-19.5 dBm',
    notes: 'Redaman drop ke -31 dBm akibat tekukan dropcore dekat tiang 3.',
  },
  {
    id: 'spk-03',
    spkNumber: 'SPK/PSB/2026/10/086',
    type: 'INSTALLATION',
    customerName: 'Bpk. Hendra Gunawan',
    customerPhone: '082155443322',
    address: 'Komp. Ruko Nagoya Newton Blok C No. 5',
    odpName: 'ODP-NGY-12',
    odpPort: 8,
    cableLengthMeters: 60,
    status: 'ASSIGNED',
    priority: 'NORMAL',
    scheduledTime: '15:30 WIB',
    targetRxDbm: '-18.5 dBm',
    notes: 'Pasang Baru Paket Corporate DIA 100 Mbps. Penarikan kabel indoor rapi.',
  },
  {
    id: 'spk-04',
    spkNumber: 'SPK/REP/2026/10/082',
    type: 'REPAIR',
    customerName: 'Sdr. Kevin Pratama',
    customerPhone: '087811223344',
    address: 'Taman Baloi Mas Indah No. 18',
    odpName: 'ODP-TBM-01',
    odpPort: 4,
    cableLengthMeters: 45,
    status: 'COMPLETED',
    priority: 'HIGH',
    scheduledTime: '08:00 WIB',
    targetRxDbm: '-19.2 dBm',
    notes: 'Splicing ulang patchcord ODP selesai. Redaman normal -19.1 dBm.',
  },
]

export default function TechnicianDashboardView() {
  const router = useRouter()
  const { toast } = useToast()
  const [spkList, setSpkList] = useState<WorkOrder[]>(INITIAL_SPK_LIST)
  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE')
  const [selectedSpk, setSelectedSpk] = useState<WorkOrder | null>(null)
  const [measuredDbm, setMeasuredDbm] = useState('-19.4')

  const totalAssigned = spkList.length
  const completedCount = spkList.filter(s => s.status === 'COMPLETED').length
  const inProgressCount = spkList.filter(s => s.status === 'IN_PROGRESS' || s.status === 'ON_ROUTE').length
  const pendingCount = spkList.filter(s => s.status === 'ASSIGNED').length

  const handleUpdateStatus = (spkId: string, nextStatus: WorkOrder['status']) => {
    setSpkList(prev => prev.map(s => {
      if (s.id === spkId) {
        return { ...s, status: nextStatus }
      }
      return s
    }))
    const statusLabels: Record<string, string> = {
      ON_ROUTE: 'Menuju Lokasi Pelanggan (On-Route)',
      IN_PROGRESS: 'Pengerjaan Dimulai (In-Progress)',
      COMPLETED: 'SPK Tuntas & BAST Diterbitkan (Completed)',
    }
    toast.info(`Status SPK berhasil diperbarui ke: ${statusLabels[nextStatus]}`)
  }

  const filteredSpk = spkList.filter(s => {
    if (filterType === 'ACTIVE') return s.status !== 'COMPLETED'
    if (filterType === 'COMPLETED') return s.status === 'COMPLETED'
    return true
  })

  return (
    <div className="space-y-6">
      {/* ─── 1. Header & Identity Staf Teknisi Lapangan ─────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--app-text)] font-sans">
                Terminal Operasional Teknisi Lapangan
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Shift Pagi: ON DUTY
              </span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
              Kelola penugasan pasang baru (PSB), perbaikan gangguan fiber optik, dan presensi GPS lapangan.
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => router.push('/technician-checkin')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Presensi GPS Selfie</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/infrastruktur/otdr')}
            className="px-3 py-1.5 rounded-lg bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-[var(--app-text)] border border-[var(--app-border)] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-500" />
            <span>Kalkulator OTDR</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Metric KPI Cards (Teknisi Field Workload) ─────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Total Tugas Hari Ini</span>
            <Wrench className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--app-text)]">{totalAssigned}</span>
            <span className="text-xs text-[var(--app-text-muted)]">SPK</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-dim)] mt-1">Target harian standar: 4-6 SPK</p>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Sedang Dikerjakan</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-500">{inProgressCount}</span>
            <span className="text-xs text-[var(--app-text-muted)]">SPK Aktif</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-dim)] mt-1">1 On-Route, 1 In-Progress</p>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Tuntas Selesai (BAST)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-500">{completedCount}</span>
            <span className="text-xs text-[var(--app-text-muted)]">SPK Tuntas</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-dim)] mt-1">Insentif terhitung: Rp 150.000</p>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
            <span>Stok Material di Tas</span>
            <Boxes className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--app-text)]">2 ONT</span>
            <span className="text-xs text-[var(--app-text-muted)]">| 185m Kabel</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-dim)] mt-1">Ready stock untuk pasang baru</p>
        </div>
      </div>

      {/* ─── 3. Quick Toolbox Strip (Peralatan Lapangan) ────────────────────── */}
      <div className="p-4 rounded-xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--app-primary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text)]">
              Toolbox Mandiri Teknisi Fiber Optik
            </h3>
          </div>
          <span className="text-[11px] text-[var(--app-text-muted)] font-mono">Standar K3 & ITU-T G.984</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/infrastruktur/otdr')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 text-cyan-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Hitung Titik Putus</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Konversi meteran OTDR ke tiang ODP</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/infrastruktur/map')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-emerald-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Peta GIS FTTH</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Cari letak tiang ODP terdekat</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/inventory')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <Boxes className="w-4 h-4 text-amber-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Gudang & Material</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Cek ketersediaan ONT & fast connector</p>
          </button>

          <button
            type="button"
            onClick={() => router.push('/tickets')}
            className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-subtle)] hover:bg-[var(--app-surface)] text-left transition-colors cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-purple-500 mb-1.5" />
            <p className="text-xs font-bold text-[var(--app-text)]">Tiket Gangguan</p>
            <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Lihat eskalasi keluhan pelanggan</p>
          </button>
        </div>
      </div>

      {/* ─── 4. Daftar SPK / Work Order Kanban-List ─────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--app-border)]">
          <div>
            <h2 className="text-sm font-bold text-[var(--app-text)] font-sans">
              Daftar Surat Perintah Kerja (SPK) Lapangan
            </h2>
            <p className="text-xs text-[var(--app-text-muted)]">
              Urutan tugas berdasarkan prioritas SLA penanganan gangguan & jadwal janji temu pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[var(--app-card-subtle)] p-1 rounded-lg border border-[var(--app-border)]">
            <button
              type="button"
              onClick={() => setFilterType('ACTIVE')}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
                filterType === 'ACTIVE'
                  ? 'bg-[var(--app-primary)] text-[var(--app-primary-text)] font-semibold shadow-xs'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              )}
            >
              Aktif ({inProgressCount + pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('COMPLETED')}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
                filterType === 'COMPLETED'
                  ? 'bg-[var(--app-primary)] text-[var(--app-primary-text)] font-semibold shadow-xs'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              )}
            >
              Selesai ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
                filterType === 'ALL'
                  ? 'bg-[var(--app-primary)] text-[var(--app-primary-text)] font-semibold shadow-xs'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              )}
            >
              Semua ({totalAssigned})
            </button>
          </div>
        </div>

        {/* List of SPKs */}
        <div className="space-y-3">
          {filteredSpk.map((spk) => {
            const isCompleted = spk.status === 'COMPLETED'
            const isInProgress = spk.status === 'IN_PROGRESS'
            const isOnRoute = spk.status === 'ON_ROUTE'

            return (
              <div
                key={spk.id}
                className={clsx(
                  'p-4 rounded-xl border transition-all space-y-3',
                  isInProgress
                    ? 'bg-amber-500/5 border-amber-500/40 shadow-xs'
                    : isCompleted
                    ? 'bg-[var(--app-card-subtle)] border-[var(--app-border)] opacity-85'
                    : 'bg-[var(--app-card)] border-[var(--app-border)] hover:border-[var(--app-primary-border)]'
                )}
              >
                {/* SPK Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border',
                      spk.type === 'INSTALLATION'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    )}>
                      {spk.type === 'INSTALLATION' ? '🔌 Pasang Baru' : '🚨 Perbaikan Gangguan'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--app-text)]">
                      {spk.spkNumber}
                    </span>
                    {spk.priority === 'URGENT' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                        URGENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--app-text-muted)] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--app-text-dim)]" />
                      {spk.scheduledTime}
                    </span>

                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center gap-1',
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : isInProgress
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : isOnRoute
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    )}>
                      <span className={clsx(
                        'w-1.5 h-1.5 rounded-full',
                        isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                      )} />
                      {spk.status === 'COMPLETED' ? 'Tuntas Selesai' :
                       spk.status === 'IN_PROGRESS' ? 'Sedang Dikerjakan' :
                       spk.status === 'ON_ROUTE' ? 'Menuju Lokasi' : 'Ditugaskan'}
                    </span>
                  </div>
                </div>

                {/* Customer & Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5">
                      <span>{spk.customerName}</span>
                    </p>
                    <p className="text-xs text-[var(--app-text-muted)] flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{spk.address}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[var(--app-card-subtle)] p-2.5 rounded-lg border border-[var(--app-border)]">
                    <div>
                      <span className="text-[var(--app-text-dim)] block text-[10px]">Alokasi ODP / Port:</span>
                      <span className="font-bold text-[var(--app-text)]">{spk.odpName} (Port {spk.odpPort})</span>
                    </div>
                    <div>
                      <span className="text-[var(--app-text-dim)] block text-[10px]">Estimasi Dropcore:</span>
                      <span className="font-bold text-[var(--app-text)]">± {spk.cableLengthMeters} Meter</span>
                    </div>
                    <div>
                      <span className="text-[var(--app-text-dim)] block text-[10px]">Target Redaman:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{spk.targetRxDbm}</span>
                    </div>
                    <div>
                      <span className="text-[var(--app-text-dim)] block text-[10px]">Kontak WhatsApp:</span>
                      <a
                        href={`https://wa.me/${spk.customerPhone.replace(/^0/, '62')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>{spk.customerPhone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {spk.notes && (
                  <p className="text-xs text-[var(--app-text-muted)] italic bg-[var(--app-bg)] px-2.5 py-1.5 rounded border border-[var(--app-border)]">
                    Catatan Dispatcher: &ldquo;{spk.notes}&rdquo;
                  </p>
                )}

                {/* SPK Action Buttons */}
                {!isCompleted && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--app-border)]">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spk.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-md text-xs font-medium border border-[var(--app-border)] hover:bg-[var(--app-surface)] text-[var(--app-text)] flex items-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-emerald-500" />
                        <span>Buka Google Maps</span>
                      </a>

                      <a
                        href={`https://wa.me/${spk.customerPhone.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo Bpk/Ibu ${spk.customerName}, saya teknisi AUDIRA NET bertugas mengerjakan instalasi/perbaikan internet di alamat Anda.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-md text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp Pelanggan</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {spk.status === 'ASSIGNED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(spk.id, 'ON_ROUTE')}
                          className="px-3.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Berangkat Menuju Lokasi</span>
                        </button>
                      )}

                      {spk.status === 'ON_ROUTE' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(spk.id, 'IN_PROGRESS')}
                          className="px-3.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>Tiba di Lokasi &amp; Mulai</span>
                        </button>
                      )}

                      {spk.status === 'IN_PROGRESS' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(spk.id, 'COMPLETED')}
                          className="px-3.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selesaikan Tugas &amp; BAST</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
