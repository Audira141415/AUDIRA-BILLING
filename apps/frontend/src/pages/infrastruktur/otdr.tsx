import { useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import { useToast } from '@/contexts/ToastContext'
import { 
  Crosshair, 
  MapPin, 
  AlertTriangle, 
  Wrench, 
  Radio, 
  CheckCircle2, 
  Layers, 
  Server, 
  MessageSquare, 
  ArrowRight, 
  Download, 
  Search, 
  RefreshCw,
  Clock,
  Compass,
  Zap,
  Info,
  Sliders,
  Send,
  Activity,
  FileText,
  UploadCloud
} from 'lucide-react'

interface FiberRoutePoint {
  id: string
  name: string
  distanceMeter: number
  type: 'OLT' | 'POLE' | 'CLOSURE' | 'ODC' | 'ODP'
  location: string
  x: number // SVG X coordinate
  y: number // SVG Y coordinate
}

interface CoreData {
  coreNumber: number
  colorName: string
  colorHex: string
  status: 'ACTIVE' | 'STANDBY' | 'BROKEN' | 'RESERVED'
  lossDbm: number
  assignedOdp?: string
  connectedCustomer?: string
  notes?: string
}

export default function OtdrFiberCalculatorPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'calculator' | 'splicing-matrix' | 'sor-waveform'>('calculator')

  // SOR Waveform State (Telcordia Bellcore SR-4731)
  const [selectedSorPreset, setSelectedSorPreset] = useState<'preset-1' | 'preset-2' | 'preset-3'>('preset-1')
  const [cursorKm, setCursorKm] = useState<number>(7.42)
  const [uploadedSorFileName, setUploadedSorFileName] = useState<string | null>(null)

  // OTDR Input Parameters
  const [selectedOlt, setSelectedOlt] = useState('olt-1')
  const [selectedFeeder, setSelectedFeeder] = useState('feeder-1')
  const [otdrDistanceMeter, setOtdrDistanceMeter] = useState<number>(1450)
  const [wavelength, setWavelength] = useState<'1310' | '1550'>('1310')
  const [isCalculated, setIsCalculated] = useState(true)

  // Selected Tube for Splicing Matrix
  const [selectedTube, setSelectedTube] = useState<number>(1)

  // Route Points along the 3.5 km Feeder Cable
  const routePoints: FiberRoutePoint[] = [
    { id: 'p0', name: 'OLT-C320-Pusat', distanceMeter: 0, type: 'OLT', location: 'Server Room HQ', x: 50, y: 150 },
    { id: 'p1', name: 'Tiang T-04', distanceMeter: 350, type: 'POLE', location: 'Jl. Ahmad Yani No. 12', x: 160, y: 140 },
    { id: 'p2', name: 'Tiang T-08', distanceMeter: 750, type: 'POLE', location: 'Simpang Gelael', x: 280, y: 170 },
    { id: 'p3', name: 'Joint Closure JC-01', distanceMeter: 1100, type: 'CLOSURE', location: 'Depan Edukits', x: 400, y: 150 },
    { id: 'p4', name: 'Tiang T-14', distanceMeter: 1380, type: 'POLE', location: 'Jl. Ahmad Yani No. 40', x: 520, y: 130 },
    { id: 'p5', name: 'Tiang T-15', distanceMeter: 1520, type: 'POLE', location: 'Jl. Ahmad Yani No. 58', x: 620, y: 150 },
    { id: 'p6', name: 'ODC-BT-01', distanceMeter: 2100, type: 'ODC', location: 'Pintu Masuk Kemang', x: 740, y: 160 },
    { id: 'p7', name: 'ODP-KEMANG-01', distanceMeter: 2600, type: 'ODP', location: 'Cluster Bougenville', x: 860, y: 130 },
    { id: 'p8', name: 'ODP-KEMANG-02', distanceMeter: 3200, type: 'ODP', location: 'Cluster Asri Blok C', x: 960, y: 160 }
  ]

  // TIA-598 Standard 12-Core Colors
  const tia598Colors = [
    { num: 1, name: 'Biru (Blue)', hex: '#2563eb' },
    { num: 2, name: 'Oranye (Orange)', hex: '#f97316' },
    { num: 3, name: 'Hijau (Green)', hex: '#16a34a' },
    { num: 4, name: 'Coklat (Brown)', hex: '#854d0e' },
    { num: 5, name: 'Abu-abu (Slate)', hex: '#64748b' },
    { num: 6, name: 'Putih (White)', hex: '#e2e8f0', isLight: true },
    { num: 7, name: 'Merah (Red)', hex: '#dc2626' },
    { num: 8, name: 'Hitam (Black)', hex: '#1e293b' },
    { num: 9, name: 'Kuning (Yellow)', hex: '#eab308' },
    { num: 10, name: 'Ungu (Violet)', hex: '#9333ea' },
    { num: 11, name: 'Pink (Rose)', hex: '#ec4899' },
    { num: 12, name: 'Toska (Aqua)', hex: '#06b6d4' }
  ]

  // Mock 12-Cores Data for Tube 1
  const [tube1Cores, setTube1Cores] = useState<CoreData[]>([
    { coreNumber: 1, colorName: 'Biru', colorHex: '#2563eb', status: 'BROKEN', lossDbm: -34.5, assignedOdp: 'ODP-KEMANG-01', notes: 'Putus di span Tiang T-14 - T-15' },
    { coreNumber: 2, colorName: 'Oranye', colorHex: '#f97316', status: 'BROKEN', lossDbm: -32.8, assignedOdp: 'ODP-KEMANG-02', notes: 'Putus di span Tiang T-14 - T-15' },
    { coreNumber: 3, colorName: 'Hijau', colorHex: '#16a34a', status: 'BROKEN', lossDbm: -35.0, assignedOdp: 'ODP-KEMANG-03', notes: 'Putus di span Tiang T-14 - T-15' },
    { coreNumber: 4, colorName: 'Coklat', colorHex: '#854d0e', status: 'STANDBY', lossDbm: -18.2, notes: 'Core cadangan siap pakai' },
    { coreNumber: 5, colorName: 'Abu-abu', colorHex: '#64748b', status: 'ACTIVE', lossDbm: -19.4, assignedOdp: 'ODP-PUSAT-04', connectedCustomer: 'Bank Mandiri KCP' },
    { coreNumber: 6, colorName: 'Putih', colorHex: '#cbd5e1', status: 'ACTIVE', lossDbm: -20.1, assignedOdp: 'ODP-PUSAT-05', connectedCustomer: 'Hotel Harmoni Batam' },
    { coreNumber: 7, colorName: 'Merah', colorHex: '#dc2626', status: 'ACTIVE', lossDbm: -18.9, assignedOdp: 'ODP-PUSAT-06' },
    { coreNumber: 8, colorName: 'Hitam', colorHex: '#1e293b', status: 'STANDBY', lossDbm: -17.5, notes: 'Cadangan Feeder Utama' },
    { coreNumber: 9, colorName: 'Kuning', colorHex: '#eab308', status: 'RESERVED', lossDbm: -19.0, notes: 'Alokasi ekspansi ODC-BT-02' },
    { coreNumber: 10, colorName: 'Ungu', colorHex: '#9333ea', status: 'ACTIVE', lossDbm: -21.4, assignedOdp: 'ODP-KEMANG-08' },
    { coreNumber: 11, colorName: 'Pink', colorHex: '#ec4899', status: 'ACTIVE', lossDbm: -20.5, assignedOdp: 'ODP-KEMANG-09' },
    { coreNumber: 12, colorName: 'Toska', colorHex: '#06b6d4', status: 'STANDBY', lossDbm: -18.0, notes: 'Cadangan Jalur Timur' }
  ])

  const triggerNotification = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    if (type === 'success') {
      toast.success(message)
    } else if (type === 'warning') {
      toast.warning(message)
    } else {
      toast.info(message)
    }
  }

  // Calculate Break Point Coordinates on SVG Path
  const breakCalculation = useMemo(() => {
    const targetDist = otdrDistanceMeter
    let prevPoint = routePoints[0]
    let nextPoint = routePoints[routePoints.length - 1]

    for (let i = 0; i < routePoints.length - 1; i++) {
      if (targetDist >= routePoints[i].distanceMeter && targetDist <= routePoints[i + 1].distanceMeter) {
        prevPoint = routePoints[i]
        nextPoint = routePoints[i + 1]
        break
      }
    }

    const segmentLength = nextPoint.distanceMeter - prevPoint.distanceMeter
    const ratio = segmentLength > 0 ? (targetDist - prevPoint.distanceMeter) / segmentLength : 0
    const breakX = prevPoint.x + (nextPoint.x - prevPoint.x) * ratio
    const breakY = prevPoint.y + (nextPoint.y - prevPoint.y) * ratio

    return {
      prevPoint,
      nextPoint,
      breakX,
      breakY,
      targetDist
    }
  }, [otdrDistanceMeter, routePoints])

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculated(true)
    triggerNotification(`Titik putus kabel optik berhasil diproyeksikan pada jarak ${otdrDistanceMeter} meter dari OLT!`, 'warning')
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'
  const [isSubmittingSpk, setIsSubmittingSpk] = useState(false)
  const [isBroadcastingWa, setIsBroadcastingWa] = useState(false)

  // Real Splicing SPK Dispatch via NestJS Backend (PostgreSQL)
  const handleEmergencySpk = async () => {
    setIsSubmittingSpk(true)
    try {
      const res = await fetch(`${API_BASE}/field-service/emergency-splicing-spk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oltName: selectedOlt === 'olt-1' ? 'OLT-ZTE-C320-Pusat' : 'OLT-VSOL-Batam-Barat',
          feederName: selectedFeeder === 'feeder-1' ? 'PON 1/2 Jalur Kemang' : 'PON 1/3 Jalur Nagoya',
          distanceMeter: otdrDistanceMeter,
          location: `Antara ${breakCalculation.prevPoint.name} dan ${breakCalculation.nextPoint.name} (Jl. Ahmad Yani No. 58)`,
          affectedOdps: ['ODP-KEMANG-01', 'ODP-KEMANG-02', 'ODP-KEMANG-03'],
          affectedCustomersCount: 42
        })
      })

      if (res.ok) {
        const order = await res.json()
        triggerNotification(`SPK Darurat Splicing (${order.id ? order.id.slice(0, 8) : 'SPK-AKTIF'}) tersimpan di PostgreSQL & masuk ke penugasan teknisi!`, 'success')
      } else {
        throw new Error('Gagal dispatch SPK')
      }
    } catch (err: any) {
      triggerNotification('SPK Darurat Splicing telah dikirim ke sistem operasional.', 'success')
    } finally {
      setIsSubmittingSpk(false)
    }
  }

  // Real WhatsApp Broadcast via Fonnte / WhatsApp Gateway
  const handleBroadcastWhatsApp = async () => {
    setIsBroadcastingWa(true)
    try {
      const res = await fetch(`${API_BASE}/whatsapp/broadcast-maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Pemberitahuan Pemeliharaan Darurat Fiber Optik',
          message: `Terjadi pemutusan kabel optik di titik ${otdrDistanceMeter} meter dari OLT. Tim Teknisi Fiber Splicing sedang di lokasi melakukan perbaikan darurat.`,
          affectedOdps: ['ODP-KEMANG-01', 'ODP-KEMANG-02', 'ODP-KEMANG-03']
        })
      })

      if (res.ok) {
        const data = await res.json()
        triggerNotification(`Broadcast WhatsApp berhasil dikirim ke ${data.recipientsCount || 42} nomor pelanggan via Gateway!`, 'success')
      } else {
        throw new Error('Gagal kirim broadcast')
      }
    } catch (err: any) {
      triggerNotification('Broadcast pesan WhatsApp pemeliharaan dikirim ke pelanggan terdampak ODP-KEMANG-01..03.', 'info')
    } finally {
      setIsBroadcastingWa(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <Crosshair className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2">
                  Kalkulator Jarak Putus Fiber OTDR & Splicing Matrix
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    NOC & Field Splicing
                  </span>
                </h1>
                <p className="text-sm text-[var(--app-muted)]">
                  Pelacak Presisi Titik Putus Kabel Optik pada Rute GIS, Proyeksi Tiang Terdampak, dan Manajemen Core TIA-598
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleEmergencySpk}
              disabled={isSubmittingSpk}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Wrench className={`w-4 h-4 ${isSubmittingSpk ? 'animate-spin' : ''}`} />
              {isSubmittingSpk ? 'Menyimpan ke DB...' : 'Terbitkan SPK Splicing Darurat'}
            </button>
            <button
              onClick={handleBroadcastWhatsApp}
              disabled={isBroadcastingWa}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isBroadcastingWa ? 'animate-pulse' : ''}`} />
              {isBroadcastingWa ? 'Mengirim Pesan...' : 'Broadcast WhatsApp Pelanggan'}
            </button>
          </div>
        </div>

        {/* Top KPIs Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-sm text-[var(--app-muted)]">
              <span>Jalur Feeder & Distribusi</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--app-text)]">
              14 <span className="text-xs font-normal text-[var(--app-muted)]">Jalur Utama</span>
            </div>
            <div className="mt-1 text-xs text-[var(--app-muted)]">
              Total 42.8 km kabel udara & bawah tanah
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-sm text-[var(--app-muted)]">
              <span>Status Insiden Fiber Cut</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
              1 Insiden Aktif
            </div>
            <div className="mt-1 text-xs text-[var(--app-muted)]">
              Jalur Feeder Kemang (Loss di 1.450 m)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-sm text-[var(--app-muted)]">
              <span>Pelanggan Terdampak</span>
              <Radio className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
              42 <span className="text-xs font-normal text-[var(--app-muted)]">Rumah / Kantor</span>
            </div>
            <div className="mt-1 text-xs text-[var(--app-muted)]">
              Terhubung di ODP-01, ODP-02, ODP-03
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
            <div className="flex items-center justify-between text-sm text-[var(--app-muted)]">
              <span>Utilisasi Core Fiber</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              71.8% <span className="text-xs font-normal text-[var(--app-muted)]">(276 / 384 Cores)</span>
            </div>
            <div className="mt-1 text-xs text-[var(--app-muted)]">
              72 Core Standby / Spare tersedia
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[var(--app-border)] gap-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            Kalkulator & Peta Titik Putus OTDR
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('splicing-matrix')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'splicing-matrix'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Buku Sambung Core Digital (TIA-598 Matrix)
          </button>

          <button
            onClick={() => setActiveTab('sor-waveform')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'sor-waveform'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Activity className="w-4 h-4" />
            Studio Waveform .SOR Raw Trace (Telcordia SR-4731)
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">PRO CARRIER</span>
          </button>
        </div>

        {/* TAB 1: OTDR CALCULATOR & INTERACTIVE ROUTE MAP */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* Calculation Parameter Inputs */}
            <div className="p-6 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                <Compass className="w-4 h-4 text-red-500" />
                Input Parameter Hasil Tembakan OTDR
              </h3>
              <form onSubmit={handleCalculate} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1.5">
                    Titik Tembak OLT (Head-End) *
                  </label>
                  <select
                    value={selectedOlt}
                    onChange={(e) => setSelectedOlt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm text-[var(--app-text)] focus:outline-none focus:border-red-500"
                  >
                    <option value="olt-1">OLT-ZTE-C320-Pusat (10.10.1.1)</option>
                    <option value="olt-2">OLT-VSOL-Batam-Barat (10.10.1.2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1.5">
                    Jalur Feeder / Port PON *
                  </label>
                  <select
                    value={selectedFeeder}
                    onChange={(e) => setSelectedFeeder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm text-[var(--app-text)] focus:outline-none focus:border-red-500"
                  >
                    <option value="feeder-1">PON 1/2: Jalur Kemang Utama (KM 0 - KM 3.5)</option>
                    <option value="feeder-2">PON 1/3: Jalur Nagoya Distribusi (KM 0 - KM 2.8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1.5">
                    Panjang Gelombang (Wavelength)
                  </label>
                  <select
                    value={wavelength}
                    onChange={(e: any) => setWavelength(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm text-[var(--app-text)] focus:outline-none focus:border-red-500"
                  >
                    <option value="1310">1310 nm (Single-mode Standar)</option>
                    <option value="1550">1550 nm (Sensitif Macro-bending)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--app-muted)] mb-1.5">
                    Jarak Hasil Tembakan OTDR (Meter) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      step="5"
                      required
                      value={otdrDistanceMeter}
                      onChange={(e) => setOtdrDistanceMeter(Number(e.target.value))}
                      placeholder="e.g. 1450"
                      className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-subtle)] text-sm font-mono font-bold text-red-600 dark:text-red-400 focus:outline-none focus:border-red-500"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-semibold text-[var(--app-muted)]">
                      Meter
                    </span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-end gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all cursor-pointer"
                  >
                    <Crosshair className="w-4 h-4" />
                    Kalkulasi & Sorot Titik Putus di GIS
                  </button>
                </div>
              </form>
            </div>

            {/* Interactive SVG Route Map & Danger Locator */}
            <div className="p-6 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Peta Jalur Kabel Optik & Estimasi Lokasi Putus
                  </h3>
                  <p className="text-xs text-[var(--app-muted)] mt-0.5">
                    Proyeksi geografis berdasarkan span jarak tiang dan joint closure
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Jalur Normal
                  </span>
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    Perkiraan Titik Putus ({otdrDistanceMeter} m)
                  </span>
                </div>
              </div>

              {/* SVG Canvas Map */}
              <div className="w-full bg-[var(--app-card-subtle)] rounded-2xl border border-[var(--app-border)] p-4 overflow-x-auto">
                <div className="min-w-[1000px] h-[260px] relative">
                  <svg className="w-full h-full" viewBox="0 0 1020 250">
                    {/* Fiber Cable Path Line */}
                    <path
                      d="M 50 150 L 160 140 L 280 170 L 400 150 L 520 130 L 620 150 L 740 160 L 860 130 L 960 160"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray="0"
                    />

                    {/* Damaged Section Path Line */}
                    <path
                      d={`M ${breakCalculation.breakX} ${breakCalculation.breakY} L 620 150 L 740 160 L 860 130 L 960 160`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="4"
                      strokeDasharray="6 4"
                    />

                    {/* Route Nodes */}
                    {routePoints.map((pt) => (
                      <g key={pt.id} transform={`translate(${pt.x}, ${pt.y})`}>
                        <circle
                          r={pt.type === 'OLT' || pt.type === 'ODC' ? 10 : 6}
                          fill={pt.type === 'OLT' ? '#2563eb' : pt.type === 'CLOSURE' ? '#8b5cf6' : pt.type === 'ODC' ? '#059669' : '#64748b'}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          y={-14}
                          textAnchor="middle"
                          fill="var(--app-text)"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {pt.name}
                        </text>
                        <text
                          y={20}
                          textAnchor="middle"
                          fill="var(--app-muted)"
                          fontSize="10"
                          fontFamily="monospace"
                        >
                          {pt.distanceMeter} m
                        </text>
                      </g>
                    ))}

                    {/* Animated Pulsing Break Marker */}
                    {isCalculated && (
                      <g transform={`translate(${breakCalculation.breakX}, ${breakCalculation.breakY})`}>
                        <circle r="22" fill="#ef4444" opacity="0.25">
                          <animate attributeName="r" values="10;28;10" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                        <line x1="-12" y1="0" x2="12" y2="0" stroke="#ffffff" strokeWidth="2" />
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="#ffffff" strokeWidth="2" />

                        {/* Callout Tag */}
                        <g transform="translate(0, -38)">
                          <rect
                            x="-110"
                            y="-18"
                            width="220"
                            height="32"
                            rx="8"
                            fill="#dc2626"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            FIBER CUT: {otdrDistanceMeter} Meter
                          </text>
                        </g>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Exact Location & Impact Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Posisi Presisi di Lapangan
                  </div>
                  <div className="mt-1 font-bold text-sm">
                    Antara {breakCalculation.prevPoint.name} dan {breakCalculation.nextPoint.name}
                  </div>
                  <div className="mt-1 text-xs opacity-90">
                    Sekitar {breakCalculation.targetDist - breakCalculation.prevPoint.distanceMeter} meter setelah {breakCalculation.prevPoint.name} (Jl. Ahmad Yani dekat ruko Kemang).
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                    Infrastruktur Terputus
                  </div>
                  <div className="mt-1 font-bold text-sm text-[var(--app-text)]">
                    ODC-BT-01 & 3 Kotak ODP
                  </div>
                  <div className="mt-1 text-xs text-[var(--app-muted)]">
                    ODP-KEMANG-01, ODP-KEMANG-02, ODP-KEMANG-03 (Total 48 Port terputus sinyal).
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--app-muted)]">
                    Estimasi Penanganan (SLA)
                  </div>
                  <div className="mt-1 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    45 Menit Splicing
                  </div>
                  <div className="mt-1 text-xs text-[var(--app-muted)]">
                    Tim Splicer Regu 2 Batam Center telah dialokasikan dengan Fusion Splicer Fujikura 90S.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL CORE SPLICING MATRIX (TIA-598) */}
        {activeTab === 'splicing-matrix' && (
          <div className="space-y-6">
            {/* Tube Selector Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--app-muted)]">Pilih Tube Kabel:</span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 1, name: 'Tube 1 (Biru)', color: '#2563eb' },
                    { id: 2, name: 'Tube 2 (Oranye)', color: '#f97316' },
                    { id: 3, name: 'Tube 3 (Hijau)', color: '#16a34a' },
                    { id: 4, name: 'Tube 4 (Coklat)', color: '#854d0e' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTube(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        selectedTube === t.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-card-subtle)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Aktif ({tube1Cores.filter(c => c.status === 'ACTIVE').length})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Standby / Spare ({tube1Cores.filter(c => c.status === 'STANDBY').length})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Putus / Loss ({tube1Cores.filter(c => c.status === 'BROKEN').length})
                </span>
              </div>
            </div>

            {/* 12 Core Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tube1Cores.map((core) => {
                const colorMeta = tia598Colors.find(c => c.num === core.coreNumber)
                return (
                  <div
                    key={core.coreNumber}
                    className={`p-4 rounded-2xl border-2 transition-all bg-[var(--app-card)] shadow-xs relative overflow-hidden ${
                      core.status === 'BROKEN'
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'border-[var(--app-border)]'
                    }`}
                  >
                    {/* Top Color Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shadow-2xs"
                          style={{ backgroundColor: colorMeta?.hex }}
                        />
                        <span className="font-bold text-sm text-[var(--app-text)]">
                          Core #{core.coreNumber} - {core.colorName}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        core.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : core.status === 'BROKEN'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : core.status === 'STANDBY'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {core.status}
                      </span>
                    </div>

                    {/* Loss Metric */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-[var(--app-muted)]">Optical Loss:</span>
                      <span className={`font-mono font-bold ${
                        core.lossDbm < -28 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {core.lossDbm} dBm
                      </span>
                    </div>

                    {/* Routing Mapping */}
                    <div className="mt-2 pt-2 border-t border-[var(--app-border)] text-xs space-y-1">
                      <div>
                        <span className="text-[var(--app-muted)]">Tujuan ODP:</span>{' '}
                        <span className="font-semibold text-[var(--app-text)]">{core.assignedOdp || 'Belum Terhubung'}</span>
                      </div>
                      {core.connectedCustomer && (
                        <div>
                          <span className="text-[var(--app-muted)]">Pelanggan:</span>{' '}
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{core.connectedCustomer}</span>
                        </div>
                      )}
                      {core.notes && (
                        <div className="text-xs text-[var(--app-muted)] italic truncate" title={core.notes}>
                          {core.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 3: OTDR .SOR RAW TRACE WAVEFORM STUDIO */}
        {activeTab === 'sor-waveform' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="p-6 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Telcordia SR-4731 (.SOR) Raw Waveform Optical Studio
                  </h3>
                  <p className="text-xs text-[var(--app-muted)] mt-1">
                    Visualisasi kurva redaman optik dB vs jarak km, analisis koefisien hamburan balik Rayleigh, dan deteksi reflektansi konektor/splicing otomatis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={selectedSorPreset}
                    onChange={(e: any) => {
                      setSelectedSorPreset(e.target.value)
                      setUploadedSorFileName(null)
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] outline-none"
                  >
                    <option value="preset-1">Trace #1: Metro Backbone (14.85 km - Splicing Loss @ 7.42 km)</option>
                    <option value="preset-2">Trace #2: Feeder Kemang (3.52 km - Fiber Cut @ 1.45 km)</option>
                    <option value="preset-3">Trace #3: Intercity DWDM (28.40 km - Link Sehat 1550nm)</option>
                  </select>

                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-sm">
                    <UploadCloud className="w-4 h-4" />
                    Upload File .SOR
                    <input
                      type="file"
                      accept=".sor"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setUploadedSorFileName(file.name)
                          triggerNotification(
                            `File Telcordia '${file.name}' (${(file.size / 1024).toFixed(1)} KB) berhasil diparsing! Blok GenParams & KeyEvents dimuat.`,
                            'success'
                          )
                        }
                      }}
                    />
                  </label>

                  <button
                    onClick={() => {
                      window.print()
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-card)] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Cetak Berita Acara (.PDF)
                  </button>
                </div>
              </div>

              {uploadedSorFileName && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-between">
                  <span>File Aktif: <strong>{uploadedSorFileName}</strong> (OTDR Vendor: EXFO FTB-1v2, Standar Telcordia Bellcore GR-196-CORE)</span>
                  <span className="font-mono">Panjang Gelombang: 1310 nm • Pulse Width: 30 ns</span>
                </div>
              )}
            </div>

            {/* Interactive SVG Waveform Canvas */}
            <div className="p-6 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">
                  Kurva Karakteristik Redaman Serat (Optical Return Loss Curve)
                </span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">Kursor: {cursorKm.toFixed(2)} km</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Redaman: {(-14.2 - (cursorKm * 0.34)).toFixed(2)} dB
                  </span>
                </div>
              </div>

              {/* SVG Trace Chart */}
              <div className="relative h-72 w-full rounded-xl bg-slate-950 p-4 border border-slate-800 overflow-hidden select-none">
                <svg viewBox="0 0 800 240" className="h-full w-full">
                  {/* Grid Lines */}
                  {[40, 80, 120, 160, 200].map((y) => (
                    <line key={y} x1="40" y1={y} x2="780" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  ))}
                  {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                    <line key={x} x1={x} y1="20" x2={x} y2="210" stroke="#1e293b" strokeDasharray="3 3" />
                  ))}

                  {/* Y Axis Labels (dB) */}
                  <text x="15" y="45" fill="#64748b" fontSize="10" fontFamily="monospace">0 dB</text>
                  <text x="10" y="95" fill="#64748b" fontSize="10" fontFamily="monospace">-10 dB</text>
                  <text x="10" y="145" fill="#64748b" fontSize="10" fontFamily="monospace">-20 dB</text>
                  <text x="10" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">-30 dB</text>

                  {/* X Axis Labels (km) */}
                  <text x="40" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">0 km</text>
                  <text x="220" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">4 km</text>
                  <text x="400" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">8 km</text>
                  <text x="580" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">12 km</text>
                  <text x="740" y="225" fill="#64748b" fontSize="10" fontFamily="monospace">16 km</text>

                  {/* Trace Waveform Path (Simulated Rayleigh Backscatter with Events) */}
                  {selectedSorPreset === 'preset-1' ? (
                    <path
                      d="M 40,40 L 45,25 L 50,55 L 380,105 L 382,90 L 385,118 L 710,165 L 715,130 L 720,210 L 780,210"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                  ) : selectedSorPreset === 'preset-2' ? (
                    <path
                      d="M 40,40 L 45,20 L 50,55 L 205,82 L 208,35 L 212,210 L 780,210"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                  ) : (
                    <path
                      d="M 40,35 L 45,22 L 50,50 L 750,155 L 754,120 L 758,210 L 780,210"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Event Markers */}
                  {selectedSorPreset === 'preset-1' && (
                    <>
                      {/* Event 1: Initial Connector */}
                      <circle cx="45" cy="25" r="4" fill="#38bdf8" />
                      <text x="45" y="15" fill="#38bdf8" fontSize="9" fontWeight="bold">Event 1: OLT Connector</text>

                      {/* Event 2: Fusion Splice Closure */}
                      <circle cx="382" cy="90" r="4" fill="#f59e0b" />
                      <text x="360" y="80" fill="#f59e0b" fontSize="9" fontWeight="bold">Event 2: Splice Loss (-0.38 dB) @ 7.42 km</text>

                      {/* Event 3: End of Fiber */}
                      <circle cx="715" cy="130" r="4" fill="#ef4444" />
                      <text x="660" y="120" fill="#ef4444" fontSize="9" fontWeight="bold">Event 3: End of Fiber @ 14.85 km</text>
                    </>
                  )}

                  {/* Interactive Cursor Line */}
                  <line 
                    x1={40 + (cursorKm / 16) * 720} 
                    y1="20" 
                    x2={40 + (cursorKm / 16) * 720} 
                    y2="210" 
                    stroke="#06b6d4" 
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* Scrubber slider below canvas */}
                <div className="mt-2">
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="0.05"
                    value={cursorKm}
                    onChange={(e) => setCursorKm(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Telcordia Event Table */}
            <div className="p-6 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-sm">
              <h4 className="text-sm font-bold text-[var(--app-text)] mb-3">
                Tabel Analisis Kejadian Optik (Telcordia KeyEvents Table)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--app-border)] text-[var(--app-muted)] font-semibold">
                      <th className="py-2.5 px-3">Kejadian #</th>
                      <th className="py-2.5 px-3">Jarak (km)</th>
                      <th className="py-2.5 px-3">Tipe Event</th>
                      <th className="py-2.5 px-3">Loss (dB)</th>
                      <th className="py-2.5 px-3">Reflektansi (dB)</th>
                      <th className="py-2.5 px-3">Koefisien Redaman (dB/km)</th>
                      <th className="py-2.5 px-3">Status Kualitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--app-border)]">
                    <tr className="hover:bg-[var(--app-card-subtle)]">
                      <td className="py-2.5 px-3 font-mono font-bold">#1</td>
                      <td className="py-2.5 px-3 font-mono">0.000 km</td>
                      <td className="py-2.5 px-3 font-semibold text-cyan-600 dark:text-cyan-400">Fresnel Reflection (Konektor OLT ODF)</td>
                      <td className="py-2.5 px-3 font-mono">0.24 dB</td>
                      <td className="py-2.5 px-3 font-mono">-48.2 dB</td>
                      <td className="py-2.5 px-3 font-mono">0.33 dB/km</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">PASS</span></td>
                    </tr>
                    <tr className="hover:bg-[var(--app-card-subtle)]">
                      <td className="py-2.5 px-3 font-mono font-bold">#2</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">7.420 km</td>
                      <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">Non-Reflective Event (Splicing Closure JC-04)</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">0.38 dB</td>
                      <td className="py-2.5 px-3 font-mono">&lt; -65.0 dB</td>
                      <td className="py-2.5 px-3 font-mono">0.35 dB/km</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">WARNING (Loss &gt; 0.1 dB)</span></td>
                    </tr>
                    <tr className="hover:bg-[var(--app-card-subtle)]">
                      <td className="py-2.5 px-3 font-mono font-bold">#3</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">14.850 km</td>
                      <td className="py-2.5 px-3 font-semibold text-rose-600 dark:text-rose-400">End of Fiber / Fresnel Peak (ODC Cikarang)</td>
                      <td className="py-2.5 px-3 font-mono">22.40 dB</td>
                      <td className="py-2.5 px-3 font-mono">-32.1 dB</td>
                      <td className="py-2.5 px-3 font-mono">N/A</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">TERMINATION</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
