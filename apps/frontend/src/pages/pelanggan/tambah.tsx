import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Package,
  CreditCard,
  FileCheck,
  Eye,
  RefreshCw,
  AlertTriangle,
  Info,
  Search
} from 'lucide-react'

// Step definitions
const STEPS = [
  { id: 1, label: 'Informasi Pribadi', icon: User },
  { id: 2, label: 'Paket & Layanan', icon: Package },
  { id: 3, label: 'Billing & Pembayaran', icon: CreditCard },
  { id: 4, label: 'Dokumen', icon: FileText },
  { id: 5, label: 'Konfirmasi', icon: FileCheck },
]

const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'DI Yogyakarta', 'Sumatera Utara', 'Sumatera Selatan', 'Bali', 'Kalimantan Timur'
]

const RELATIONS = ['Suami', 'Istri', 'Anak', 'Orang Tua', 'Saudara', 'Lainnya']

export default function TambahCustomer() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [availablePackages, setAvailablePackages] = useState<any[]>([])

  // ── Step 1: Informasi Pribadi ──────────────────────────────────
  const [namaLengkap, setNamaLengkap] = useState('')
  const [noKtp, setNoKtp] = useState('')
  const [noKk, setNoKk] = useState('')
  const [tempatLahir, setTempatLahir] = useState('')
  const [tanggalLahir, setTanggalLahir] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState<'laki' | 'perempuan'>('laki')
  const [statusPernikahan, setStatusPernikahan] = useState('')
  const [pekerjaan, setPekerjaan] = useState('')
  const [email, setEmail] = useState('')
  const [noTelepon, setNoTelepon] = useState('812-3456-7890')
  const [pendidikan, setPendidikan] = useState('')
  const [penghasilan, setPenghasilan] = useState('')
  const [catatan, setCatatan] = useState('')

  // ── Step 1: Informasi Alamat ───────────────────────────────────
  const [alamatLengkap, setAlamatLengkap] = useState('')
  const [provinsi, setProvinsi] = useState('')
  const [kotaKabupaten, setKotaKabupaten] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [kelurahan, setKelurahan] = useState('')
  const [kodepos, setKodepos] = useState('')
  const [lokasipeta, setLokasiPeta] = useState('')
  const [latitude, setLatitude] = useState('-6.2088')
  const [longitude, setLongitude] = useState('106.8456')

  // ── Step 1: Informasi Tambahan ─────────────────────────────────
  const [sumberCustomer, setSumberCustomer] = useState('')
  const [sales, setSales] = useState('')
  const [area, setArea] = useState('')
  const [referensi, setReferensi] = useState('')
  const [tanggalDaftar, setTanggalDaftar] = useState(new Date().toISOString().split('T')[0])
  const [catatanInternal, setCatatanInternal] = useState('')

  // ── Step 1: Kontak Darurat ─────────────────────────────────────
  const [kontakDaruratNama, setKontakDaruratNama] = useState('')
  const [kontakDaruratHp, setKontakDaruratHp] = useState('812-3456-7890')
  const [kontakDaruratHubungan, setKontakDaruratHubungan] = useState('')

  // ── Step 2: Paket & Layanan ────────────────────────────────────
  const [selectedPackageId, setSelectedPackageId] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [modemType, setModemType] = useState('')
  const [modemSerial, setModemSerial] = useState('')
  const [tanggalMulai, setTanggalMulai] = useState(new Date().toISOString().split('T')[0])
  const [jenisPemasangan, setJenisPemasangan] = useState('new')

  // ── Step 3: Billing ─────────────────────────────────────────────
  const [metodePembayaran, setMetodePembayaran] = useState('transfer')
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState('5')
  const [bankName, setBankName] = useState('')
  const [noRekening, setNoRekening] = useState('')
  const [namaRekening, setNamaRekening] = useState('')
  const [generateFirstInvoice, setGenerateFirstInvoice] = useState(true)

  const fetchPackages = useCallback(async () => {
    try {
      const pkgs = await api.paket.getAll()
      const arr = Array.isArray(pkgs) ? pkgs : []
      setAvailablePackages(arr)
      if (arr.length > 0) setSelectedPackageId(arr[0].id)
    } catch (e) {
      setAvailablePackages([])
    }
  }, [])

  useEffect(() => { fetchPackages() }, [fetchPackages])

  const selectedPkg = availablePackages.find(p => p.id === selectedPackageId)

  // Checklist completion
  const step1Done = namaLengkap.trim().length > 0 && noTelepon.trim().length > 0
  const step2Done = selectedPackageId !== ''
  const step3Done = metodePembayaran !== ''

  const handleSaveDraft = async () => {
    if (!namaLengkap || !noTelepon) {
      alert('Harap isi Nama Lengkap dan No. Telepon terlebih dahulu.')
      return
    }
    try {
      setSaving(true)
      await api.pelanggan.create({
        name: namaLengkap,
        email: email || null,
        phone: `+62${noTelepon}`,
        address: alamatLengkap || null,
        status: 'pending',
        ipAddress: ipAddress || null,
        installedModem: modemType || null,
        modemSerial: modemSerial || null,
      })
      alert('Draft pelanggan berhasil disimpan.')
      router.push('/pelanggan')
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan draft.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!namaLengkap || !noTelepon) {
      alert('Harap lengkapi Nama Lengkap dan No. Telepon terlebih dahulu.')
      return
    }
    try {
      setSaving(true)
      await api.pelanggan.create({
        name: namaLengkap,
        email: email || null,
        phone: `+62${noTelepon}`,
        address: alamatLengkap || null,
        status: 'active',
        ipAddress: ipAddress || null,
        installedModem: modemType || null,
        modemSerial: modemSerial || null,
        installationDate: tanggalMulai ? new Date(tanggalMulai).toISOString() : null,
      })
      if (generateFirstInvoice && selectedPkg) {
        // Invoice generation would go here
      }
      alert('Pelanggan baru berhasil didaftarkan!')
      router.push('/pelanggan')
    } catch (err: any) {
      alert(err.message || 'Gagal mendaftarkan pelanggan.')
    } finally {
      setSaving(false)
    }
  }

  // ── Styled Input Components ─────────────────────────────────────
  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
  const selectCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition appearance-none"
  const labelCls = "block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5"

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] overflow-hidden">

        {/* ── Top Header ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/pelanggan" className="hover:text-[var(--app-text)]">Customer CRM</Link>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Registrasi Pelanggan Baru</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)]">
              Registrasi & Pemasangan Baru
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Formulir aktivasi pelanggan baru dengan integrasi PPPoE Mikrotik, ODP splitter, dan invoice perdana.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pelanggan"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kembali ke Daftar
            </Link>
          </div>
        </div>

        {/* ── Progress Steps ──────────────────────────────────────── */}
        <div className="border-b border-slate-200 px-6 py-4 bg-white/40">
          <div className="flex items-center gap-0">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    step === s.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : s.id < step
                      ? 'text-green-400 hover:text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    step === s.id ? 'bg-white/20' : s.id < step ? 'bg-green-500/20' : 'bg-slate-100'
                  }`}>
                    {s.id < step ? <Check size={12} /> : s.id}
                  </div>
                  <span className="hidden sm:block">{s.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${s.id < step ? 'bg-green-500/40' : 'bg-slate-100'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Page Content ───────────────────────────────────────── */}
        <div className="flex gap-6 p-6">

          {/* ── Main Form Area ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ══ STEP 1: Informasi Pribadi ══════════════════════════ */}
            {step === 1 && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Column 1 — Informasi Pribadi */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                    <User size={16} className="text-blue-400" /> Informasi Pribadi
                  </h3>

                  <div>
                    <label className={labelCls}>Nama Lengkap <span className="text-red-400">*</span></label>
                    <input value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)} placeholder="Masukkan nama lengkap pelanggan" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>No. KTP</label>
                    <input value={noKtp} onChange={e => setNoKtp(e.target.value)} placeholder="Masukkan nomor KTP" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>No. KK</label>
                    <input value={noKk} onChange={e => setNoKk(e.target.value)} placeholder="Masukkan nomor KK" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Tempat Lahir</label>
                    <input value={tempatLahir} onChange={e => setTempatLahir(e.target.value)} placeholder="Masukkan tempat lahir" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Tanggal Lahir <span className="text-red-400">*</span></label>
                      <input type="date" value={tanggalLahir} onChange={e => setTanggalLahir(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Jenis Kelamin <span className="text-red-400">*</span></label>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="gender" checked={jenisKelamin === 'laki'} onChange={() => setJenisKelamin('laki')} className="accent-blue-500" />
                          <span className="text-xs text-slate-600">Laki-laki</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="gender" checked={jenisKelamin === 'perempuan'} onChange={() => setJenisKelamin('perempuan')} className="accent-blue-500" />
                          <span className="text-xs text-slate-600">Perempuan</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Status Pernikahan</label>
                    <div className="relative">
                      <select value={statusPernikahan} onChange={e => setStatusPernikahan(e.target.value)} className={selectCls}>
                        <option value="">Pilih status</option>
                        <option value="single">Belum Menikah</option>
                        <option value="married">Menikah</option>
                        <option value="divorced">Cerai</option>
                        <option value="widowed">Janda/Duda</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Pekerjaan</label>
                    <input value={pekerjaan} onChange={e => setPekerjaan(e.target.value)} placeholder="Masukkan pekerjaan" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Masukkan email" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>No. Telepon / WhatsApp <span className="text-red-400">*</span></label>
                      <div className="flex items-center">
                        <span className="flex items-center justify-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2.5 text-xs text-slate-500 font-bold">+62</span>
                        <input value={noTelepon} onChange={e => setNoTelepon(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Pendidikan Terakhir</label>
                    <div className="relative">
                      <select value={pendidikan} onChange={e => setPendidikan(e.target.value)} className={selectCls}>
                        <option value="">Pilih pendidikan</option>
                        <option value="sd">SD</option>
                        <option value="smp">SMP</option>
                        <option value="sma">SMA/SMK</option>
                        <option value="d3">D3</option>
                        <option value="s1">S1</option>
                        <option value="s2">S2/S3</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Penghasilan Per Bulan</label>
                    <div className="relative">
                      <input value={penghasilan} onChange={e => setPenghasilan(e.target.value)} placeholder="Masukkan penghasilan" className={inputCls} />
                      <span className="absolute right-3 top-2.5 text-slate-400 text-xs">Rp</span>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Catatan</label>
                    <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={3} placeholder="Catatan tentang pelanggan (opsional)" className={inputCls + ' resize-none'} />
                  </div>
                </div>

                {/* Column 2 — Informasi Alamat */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                    <MapPin size={16} className="text-blue-400" /> Informasi Alamat
                  </h3>

                  <div>
                    <label className={labelCls}>Alamat Lengkap <span className="text-red-400">*</span></label>
                    <textarea value={alamatLengkap} onChange={e => setAlamatLengkap(e.target.value)} rows={3} placeholder="Masukkan alamat lengkap" className={inputCls + ' resize-none'} />
                  </div>

                  <div>
                    <label className={labelCls}>Provinsi <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={provinsi} onChange={e => setProvinsi(e.target.value)} className={selectCls}>
                        <option value="">Pilih provinsi</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Kota / Kabupaten <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={kotaKabupaten} onChange={e => setKotaKabupaten(e.target.value)} className={selectCls}>
                        <option value="">Pilih kota / kabupaten</option>
                        <option value="Jakarta Pusat">Jakarta Pusat</option>
                        <option value="Jakarta Selatan">Jakarta Selatan</option>
                        <option value="Jakarta Barat">Jakarta Barat</option>
                        <option value="Jakarta Timur">Jakarta Timur</option>
                        <option value="Jakarta Utara">Jakarta Utara</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Kecamatan <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={kecamatan} onChange={e => setKecamatan(e.target.value)} className={selectCls}>
                        <option value="">Pilih kecamatan</option>
                        <option value="Menteng">Menteng</option>
                        <option value="Tanah Abang">Tanah Abang</option>
                        <option value="Gambir">Gambir</option>
                        <option value="Kemayoran">Kemayoran</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Kelurahan / Desa <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={kelurahan} onChange={e => setKelurahan(e.target.value)} className={selectCls}>
                        <option value="">Pilih kelurahan / desa</option>
                        <option value="Menteng">Menteng</option>
                        <option value="Cikini">Cikini</option>
                        <option value="Pegangsaan">Pegangsaan</option>
                        <option value="Gondangdia">Gondangdia</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Kodepos</label>
                    <input value={kodepos} onChange={e => setKodepos(e.target.value)} placeholder="Masukkan kodepos" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Lokasi (Google Maps)</label>
                    <div className="relative">
                      <input value={lokasipeta} onChange={e => setLokasiPeta(e.target.value)} placeholder="Cari lokasi di peta" className={inputCls + ' pr-10'} />
                      <Search size={14} className="absolute right-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Map Preview */}
                  <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-44 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/10" />
                    <div className="relative text-center space-y-2">
                      <div className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white/20">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">Pilih lokasi pada peta</p>
                      <p className="text-[9px] text-gray-600">Klik untuk memilih koordinat lokasi</p>
                    </div>
                    {/* Mock map tiles bg */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, #3b82f6 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #3b82f6 0px, transparent 1px, transparent 40px)',
                    }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Latitude</label>
                      <input value={latitude} onChange={e => setLatitude(e.target.value)} className={inputCls} readOnly />
                    </div>
                    <div>
                      <label className={labelCls}>Longitude</label>
                      <input value={longitude} onChange={e => setLongitude(e.target.value)} className={inputCls} readOnly />
                    </div>
                  </div>
                </div>

                {/* Column 3 — Informasi Tambahan + Kontak Darurat */}
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                      <Info size={16} className="text-blue-400" /> Informasi Tambahan
                    </h3>

                    <div>
                      <label className={labelCls}>Sumber Customer</label>
                      <div className="relative">
                        <select value={sumberCustomer} onChange={e => setSumberCustomer(e.target.value)} className={selectCls}>
                          <option value="">Pilih sumber</option>
                          <option value="walk_in">Walk In</option>
                          <option value="referral">Referral</option>
                          <option value="online">Online</option>
                          <option value="sales">Tim Sales</option>
                          <option value="medsos">Media Sosial</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Sales / Marketing</label>
                      <div className="relative">
                        <select value={sales} onChange={e => setSales(e.target.value)} className={selectCls}>
                          <option value="">Pilih sales</option>
                          <option value="budi">Budi Santoso</option>
                          <option value="dewi">Dewi Lestari</option>
                          <option value="rina">Rina Marlina</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Area / Cluster</label>
                      <div className="relative">
                        <select value={area} onChange={e => setArea(e.target.value)} className={selectCls}>
                          <option value="">Pilih area / cluster</option>
                          <option value="pusat">Kluster Jakarta Pusat</option>
                          <option value="selatan">Kluster Jakarta Selatan</option>
                          <option value="barat">Kluster Jakarta Barat</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Referensi</label>
                      <input value={referensi} onChange={e => setReferensi(e.target.value)} placeholder="Masukkan nama yang mereferensikan" className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Tanggal Daftar <span className="text-red-400">*</span></label>
                      <input type="date" value={tanggalDaftar} onChange={e => setTanggalDaftar(e.target.value)} className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Catatan Internal</label>
                      <textarea value={catatanInternal} onChange={e => setCatatanInternal(e.target.value)} rows={3} placeholder="Catatan internal (tidak ditampilkan ke customer)" className={inputCls + ' resize-none'} />
                    </div>
                  </div>

                  {/* Kontak Darurat */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                      <Phone size={16} className="text-blue-400" /> Kontak Darurat
                    </h3>

                    <div>
                      <label className={labelCls}>Nama Kontak</label>
                      <input value={kontakDaruratNama} onChange={e => setKontakDaruratNama(e.target.value)} placeholder="Masukkan nama kontak darurat" className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>No. Telepon</label>
                      <div className="flex items-center">
                        <span className="flex items-center justify-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2.5 text-xs text-slate-500 font-bold">+62</span>
                        <input value={kontakDaruratHp} onChange={e => setKontakDaruratHp(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Hubungan</label>
                      <div className="relative">
                        <select value={kontakDaruratHubungan} onChange={e => setKontakDaruratHubungan(e.target.value)} className={selectCls}>
                          <option value="">Pilih hubungan</option>
                          {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ STEP 2: Paket & Layanan ════════════════════════════ */}
            {step === 2 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-200">
                  <Package size={16} className="text-blue-400" /> Paket & Layanan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Paket Internet <span className="text-red-400">*</span></label>
                    <div className="grid grid-cols-1 gap-3 mt-1">
                      {availablePackages.map(pkg => (
                        <label key={pkg.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${selectedPackageId === pkg.id ? 'border-blue-500 bg-blue-600/10' : 'border-slate-200 hover:border-blue-500/40'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="package" checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} className="accent-blue-500" />
                            <div>
                              <p className="text-white text-xs font-bold">{pkg.name}</p>
                              <p className="text-slate-400 text-[10px]">{pkg.speed}</p>
                            </div>
                          </div>
                          <span className="text-green-400 text-xs font-black">Rp {pkg.price.toLocaleString('id-ID')}/bln</span>
                        </label>
                      ))}
                      {availablePackages.length === 0 && (
                        <p className="text-slate-400 text-xs italic">Memuat paket...</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>IP Address</label>
                      <input value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="10.10.10.x" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Username PPPoE</label>
                      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan username" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Password PPPoE</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Jenis Modem/ONT</label>
                      <input value={modemType} onChange={e => setModemType(e.target.value)} placeholder="Misal: ZTE F660, Huawei HG8245" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Serial Number Modem</label>
                      <input value={modemSerial} onChange={e => setModemSerial(e.target.value)} placeholder="Masukkan serial number" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tanggal Mulai Layanan</label>
                      <input type="date" value={tanggalMulai} onChange={e => setTanggalMulai(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Jenis Pemasangan</label>
                      <div className="relative">
                        <select value={jenisPemasangan} onChange={e => setJenisPemasangan(e.target.value)} className={selectCls}>
                          <option value="new">Pemasangan Baru</option>
                          <option value="relocation">Relokasi</option>
                          <option value="upgrade">Upgrade Paket</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ STEP 3: Billing & Pembayaran ═══════════════════════ */}
            {step === 3 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-200">
                  <CreditCard size={16} className="text-blue-400" /> Billing & Pembayaran
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Metode Pembayaran</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'transfer', label: 'Transfer Bank' },
                          { id: 'qris', label: 'QRIS' },
                          { id: 'va', label: 'Virtual Account' },
                          { id: 'tunai', label: 'Tunai' },
                        ].map(m => (
                          <label key={m.id} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition text-xs font-semibold ${metodePembayaran === m.id ? 'border-blue-500 bg-blue-600/10 text-blue-400' : 'border-slate-200 text-slate-500 hover:border-blue-500/40'}`}>
                            <input type="radio" name="metode" checked={metodePembayaran === m.id} onChange={() => setMetodePembayaran(m.id)} className="accent-blue-500" />
                            {m.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Tanggal Jatuh Tempo</label>
                      <div className="relative">
                        <select value={tanggalJatuhTempo} onChange={e => setTanggalJatuhTempo(e.target.value)} className={selectCls}>
                          {['1','5','10','15','20','25'].map(d => (
                            <option key={d} value={d}>Tanggal {d} setiap bulan</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {metodePembayaran === 'transfer' && (
                      <>
                        <div>
                          <label className={labelCls}>Nama Bank</label>
                          <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="BCA, Mandiri, BNI, BRI..." className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>No. Rekening</label>
                          <input value={noRekening} onChange={e => setNoRekening(e.target.value)} placeholder="Masukkan nomor rekening" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Nama Pemilik Rekening</label>
                          <input value={namaRekening} onChange={e => setNamaRekening(e.target.value)} placeholder="Masukkan nama pemilik rekening" className={inputCls} />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-100/40 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-800">Ringkasan Tagihan</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Paket Internet</span>
                          <span className="text-white font-bold">Rp {(selectedPkg?.price || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Biaya Instalasi</span>
                          <span className="text-white font-bold">Rp 0</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                          <span className="text-white">Total Tagihan/Bulan</span>
                          <span className="text-green-400 text-sm">Rp {(selectedPkg?.price || 0).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-blue-500/40 transition">
                      <input type="checkbox" checked={generateFirstInvoice} onChange={e => setGenerateFirstInvoice(e.target.checked)} className="mt-0.5 accent-blue-500" />
                      <div>
                        <p className="text-white text-xs font-bold">Generate Invoice Pertama</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">Invoice pertama akan diterbitkan otomatis setelah pelanggan tersimpan.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ══ STEP 4: Dokumen ════════════════════════════════════ */}
            {step === 4 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-200">
                  <FileText size={16} className="text-blue-400" /> Upload Dokumen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Foto KTP', required: true },
                    { label: 'Foto KK', required: false },
                    { label: 'Foto Rumah', required: false },
                    { label: 'Dokumen Lainnya', required: false },
                  ].map(doc => (
                    <div key={doc.label}>
                      <label className={labelCls}>{doc.label} {doc.required && <span className="text-red-400">*</span>}</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-500/50 transition cursor-pointer">
                        <FileText size={32} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-xs text-slate-400 font-semibold">Klik atau seret file ke sini</p>
                        <p className="text-[10px] text-gray-600 mt-1">PNG, JPG, PDF (Maks 5MB)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ STEP 5: Konfirmasi ═════════════════════════════════ */}
            {step === 5 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-200">
                  <FileCheck size={16} className="text-blue-400" /> Konfirmasi Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-xs">
                  {[
                    { title: 'Informasi Pribadi', items: [['Nama', namaLengkap || '-'], ['No. KTP', noKtp || '-'], ['Telepon', `+62${noTelepon}` || '-'], ['Email', email || '-'], ['Jenis Kelamin', jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan']] },
                    { title: 'Informasi Alamat', items: [['Alamat', alamatLengkap || '-'], ['Provinsi', provinsi || '-'], ['Kota', kotaKabupaten || '-'], ['Kecamatan', kecamatan || '-'], ['Kodepos', kodepos || '-']] },
                    { title: 'Paket & Layanan', items: [['Paket', selectedPkg?.name || '-'], ['Kecepatan', selectedPkg?.speed || '-'], ['IP Address', ipAddress || '-'], ['Mulai', tanggalMulai || '-'], ['Modem', modemType || '-']] },
                    { title: 'Billing', items: [['Metode', metodePembayaran], ['Jatuh Tempo', `Tgl ${tanggalJatuhTempo}`], ['Tagihan', `Rp ${(selectedPkg?.price || 0).toLocaleString('id-ID')}/bln`], ['Invoice Pertama', generateFirstInvoice ? 'Ya' : 'Tidak']] },
                    { title: 'Informasi Tambahan', items: [['Sales', sales || '-'], ['Sumber', sumberCustomer || '-'], ['Area', area || '-'], ['Tanggal Daftar', tanggalDaftar]] },
                    { title: 'Kontak Darurat', items: [['Nama', kontakDaruratNama || '-'], ['Telepon', `+62${kontakDaruratHp}`], ['Hubungan', kontakDaruratHubungan || '-']] },
                  ].map(section => (
                    <div key={section.title} className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-wider mb-3">{section.title}</h4>
                      <div className="space-y-2">
                        {section.items.map(([k, v]) => (
                          <div key={k} className="flex justify-between items-start gap-2">
                            <span className="text-slate-400 flex-shrink-0">{k}</span>
                            <span className="text-white font-semibold text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Bottom Action Bar ─────────────────────────────────── */}
            <div className="flex items-center justify-between py-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
              <button onClick={() => { if (step === 1) router.push('/pelanggan'); else setStep(step - 1); }} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-100 text-slate-600 hover:text-white text-xs font-bold rounded-xl transition border border-slate-200">
                Kembali
              </button>

              <div className="flex items-center gap-3">
                <button onClick={handleSaveDraft} disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-100 text-slate-600 hover:text-white text-xs font-bold rounded-xl transition border border-slate-200">
                  <Save size={14} /> Simpan Draft
                </button>

                {step < 5 ? (
                  <button onClick={() => setStep(step + 1)} className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-lg">
                    Lanjut: {STEPS[step]?.label} <ArrowRight size={14} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition shadow-lg">
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                    Daftarkan Customer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Summary Panel ─────────────────────────────────── */}
          <div className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">
            {/* Customer Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 sticky top-4">
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-3">Ringkasan Customer</h3>

              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600/40 to-indigo-800/40 border-2 border-slate-200 flex items-center justify-center">
                  {namaLengkap ? (
                    <span className="text-2xl font-black text-slate-900">{namaLengkap.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                  ) : (
                    <User size={32} className="text-gray-600" />
                  )}
                </div>
              </div>

              {/* Summary Fields */}
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Nama', value: namaLengkap || '-' },
                  { label: 'No. Telepon', value: noTelepon ? `+62${noTelepon}` : '-' },
                  { label: 'Paket', value: selectedPkg?.name || '-' },
                  { label: 'Biaya Bulanan', value: selectedPkg ? `Rp ${selectedPkg.price.toLocaleString('id-ID')}` : '-' },
                  { label: 'Tanggal Daftar', value: tanggalDaftar ? new Date(tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-start gap-2">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-bold text-slate-800 text-right">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black">Aktif</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Checklist Data</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Informasi Pribadi', done: step1Done },
                    { label: 'Informasi Alamat', done: !!alamatLengkap },
                    { label: 'Paket & Layanan', done: step2Done },
                    { label: 'Billing & Pembayaran', done: step3Done },
                    { label: 'Dokumen (Opsional)', done: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500/20 border border-green-500/30' : 'bg-slate-100 border border-slate-200'}`}>
                        {item.done && <Check size={9} className="text-green-400" />}
                      </div>
                      <span className={`text-[10px] font-semibold ${item.done ? 'text-green-400' : 'text-slate-400'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
