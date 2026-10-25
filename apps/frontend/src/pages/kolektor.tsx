import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  Printer, 
  RefreshCw, 
  Search, 
  X, 
  ShieldCheck, 
  MessageSquare,
  AlertCircle,
  Receipt,
  ChevronRight,
  Wallet,
  CreditCard,
  Check,
  Calendar,
  Send,
  UserCheck
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface DueInvoice {
  id: string
  invoiceNumber: string
  amount: number
  dueDate: string
  status: string
  customer?: {
    id: string
    name: string
    phone?: string
    address?: string
    internetNumber?: string
    status?: string
  }
}

interface CollectorShift {
  id: string
  collectorId: string
  collectorName: string
  date: string
  totalCollected: number
  isHandedOver: boolean
}

export default function KolektorPage() {
  const [invoices, setInvoices] = useState<DueInvoice[]>([])
  const [shift, setShift] = useState<CollectorShift | null>(null)
  const [stats, setStats] = useState<any>({ totalCollectedToday: 0, totalCollectedAllTime: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Modal 1: Payment Cash Collection
  const [selectedInvoice, setSelectedInvoice] = useState<DueInvoice | null>(null)
  const [cashAmount, setCashAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modal 2: Thermal Bluetooth Receipt Preview
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null)

  // Modal 3: Shift Handover
  const [showHandoverModal, setShowHandoverModal] = useState(false)
  const [handoverNotes, setHandoverNotes] = useState('')
  const [isHandingOver, setIsHandingOver] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [invRes, shiftRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/collector/due-invoices`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/collector/shift`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/collector/stats`).then(r => r.json()).catch(() => ({ totalCollectedToday: 0, totalCollectedAllTime: 0 })),
      ])

      setInvoices(Array.isArray(invRes) ? invRes : [])
      setShift(shiftRes)
      setStats(statsRes || { totalCollectedToday: 0, totalCollectedAllTime: 0 })
    } catch (err) {
      console.error('Failed to load collector data:', err)
      showNotification('Gagal memuat data kasir kolektor', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCollect = (inv: DueInvoice) => {
    setSelectedInvoice(inv)
    setCashAmount(inv.amount)
  }

  const handleConfirmCollect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return

    try {
      setIsSubmitting(true)
      const res = await fetch(`${API_BASE}/collector/collect-cash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          amount: cashAmount,
          customerPhone: selectedInvoice.customer?.phone,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        showNotification(`Pembayaran Rp ${cashAmount.toLocaleString('id-ID')} berhasil dicatat!`, 'success')
        setSelectedInvoice(null)
        setActiveReceipt(data.receipt || {
          receiptNumber: `RCP-${Date.now()}`,
          customerName: selectedInvoice.customer?.name,
          invoiceNumber: selectedInvoice.invoiceNumber,
          amount: cashAmount,
          paidAt: new Date().toISOString(),
          collectorName: shift?.collectorName || 'Bpk. Ahmad (Kolektor)'
        })
        await loadData()
      } else {
        const err = await res.json()
        showNotification(err.message || 'Gagal memproses setoran kas', 'error')
      }
    } catch (err: any) {
      showNotification(`Terjadi kesalahan: ${err.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendWaReceipt = () => {
    if (!activeReceipt) return
    const phone = activeReceipt.customerPhone || '08123456789'
    let cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1)

    const text = `*BUKTI PEMBAYARAN TAGIHAN AUDIRA NET*\n\n` +
      `No. Kuitansi: *${activeReceipt.receiptNumber}*\n` +
      `Pelanggan: ${activeReceipt.customerName}\n` +
      `No. Invoice: ${activeReceipt.invoiceNumber}\n` +
      `Nominal: Rp ${activeReceipt.amount.toLocaleString('id-ID')}\n` +
      `Metode: Tunai di Tempat (Kolektor)\n` +
      `Petugas: ${activeReceipt.collectorName}\n` +
      `Waktu: ${new Date(activeReceipt.paidAt).toLocaleString('id-ID')}\n\n` +
      `Status: *LUNAS & KONEKSI NORMAL*\n` +
      `Terima kasih telah membayar tepat waktu.`

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleHandoverShift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shift) return

    try {
      setIsHandingOver(true)
      const res = await fetch(`${API_BASE}/collector/shift/handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: shift.id,
          notes: handoverNotes || 'Serah terima setoran kas ke kasir kantor',
        }),
      })

      if (res.ok) {
        showNotification('Serah terima kas berhasil. Shift telah ditutup dan saldo tercatat di kas kantor.', 'success')
        setShowHandoverModal(false)
        await loadData()
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message}`, 'error')
    } finally {
      setIsHandingOver(false)
    }
  }

  const filteredInvoices = invoices.filter(inv =>
    (inv.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.customer?.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, nav, aside, footer, .no-print {
            display: none !important;
          }
          .receipt-print-area {
            display: block !important;
            width: 280px !important;
            margin: 0 auto !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-6 space-y-6">

        {/* Toast */}
        {notification && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> : <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Top Header - No print */}
        <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-theme-border pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-theme-muted font-medium">
              <span>Operasional Lapangan</span>
              <span>/</span>
              <span className="text-theme-primary font-semibold">Kasir Kolektor</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text flex items-center gap-2.5">
              <Wallet className="text-theme-primary" size={26} />
              Kasir Kolektor Lapangan (Door-to-Door Cash)
            </h1>
            <p className="text-xs text-theme-muted">
              Petugas: <b className="text-theme-text">{shift?.collectorName || 'Bpk. Ahmad (Kolektor)'}</b> • Penerimaan Kas, Struk Thermal Bluetooth 58mm & Auto-Unblock RADIUS CoA
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowHandoverModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <ShieldCheck size={16} />
              <span>Serah Terima Kas (Tutup Shift)</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-theme-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-theme-border rounded-xl text-theme-muted hover:text-theme-text transition"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-theme-primary' : ''} />
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards - No print */}
        <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Kas di Tangan Petugas</p>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {(shift?.totalCollected || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-theme-muted mt-0.5">Siap disetor ke kasir kantor</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Total Setoran Hari Ini</p>
              <p className="text-2xl font-black font-mono text-theme-text mt-1">
                Rp {(stats?.totalCollectedToday || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-theme-muted mt-0.5">Akumulasi shift hari ini</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Receipt size={18} />
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Pelanggan Perlu Dikunjungi</p>
              <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">{invoices.length}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Tagihan aktif & menunggak</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <MapPin size={18} />
            </div>
          </div>
        </div>

        {/* Tabel Tagihan Yang Harus Dikunjungi - No print */}
        <div className="no-print bg-theme-card border border-theme-border rounded-xl overflow-hidden shadow-sm space-y-0">
          <div className="p-4 border-b border-theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-theme-text">Daftar Tagihan Pelanggan Lapangan</h3>
              <p className="text-xs text-theme-muted mt-0.5">Prioritaskan penagihan yang telah melewati tanggal jatuh tempo</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-theme-muted" />
              <input
                type="text"
                placeholder="Cari pelanggan, alamat, atau invoice..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-theme-border text-theme-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Pelanggan & Alamat</th>
                  <th className="p-3.5">No. Invoice</th>
                  <th className="p-3.5">Jumlah Tagihan</th>
                  <th className="p-3.5">Jatuh Tempo</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-theme-muted">
                      Tidak ada tagihan yang memerlukan penagihan lapangan saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="font-bold text-theme-text">{inv.customer?.name}</div>
                        <div className="text-[11px] text-theme-muted flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-rose-500" />
                          <span>{inv.customer?.address || 'Alamat belum diatur'}</span>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-theme-muted text-[11px]">
                        {inv.invoiceNumber}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-theme-text">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>

                      <td className="p-3.5 font-mono text-theme-muted text-[11px]">
                        {new Date(inv.dueDate).toLocaleDateString('id-ID')}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenCollect(inv)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                        >
                          <CreditCard size={13} />
                          <span>Terima Kas</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Terima Setoran Kas */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-500" /> Penerimaan Uang Kas di Tempat
                </h3>
                <button onClick={() => setSelectedInvoice(null)} className="text-theme-muted hover:text-theme-text">✕</button>
              </div>

              <form onSubmit={handleConfirmCollect} className="p-5 space-y-4 text-xs">
                <div className="bg-theme-bg border border-theme-border rounded-xl p-3.5 space-y-2">
                  <div>
                    <span className="text-theme-muted text-[10px] uppercase font-bold tracking-wider">Pelanggan</span>
                    <p className="font-bold text-theme-text text-sm">{selectedInvoice.customer?.name}</p>
                    <p className="text-theme-muted text-[11px]">{selectedInvoice.customer?.address}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-theme-border/50 pt-2">
                    <span className="text-theme-muted font-bold">Total Tagihan:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                      Rp {selectedInvoice.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-theme-muted font-bold block">Nominal Tunai Yang Diterima (Rp) *</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={e => setCashAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-theme-text focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl font-semibold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>{isSubmitting ? 'Menyimpan...' : 'Konfirmasi Penerimaan Kas'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Struk Thermal Bluetooth & WhatsApp */}
        {activeReceipt && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="no-print p-4 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
                  <Receipt size={16} className="text-theme-primary" /> Struk Kuitansi Pembayaran
                </h3>
                <button onClick={() => setActiveReceipt(null)} className="text-theme-muted hover:text-theme-text">✕</button>
              </div>

              {/* Printable Receipt Layout */}
              <div className="receipt-print-area p-5 bg-white text-slate-900 font-mono text-center space-y-2 text-xs">
                <div className="font-black text-sm">AUDIRA NET BROADBAND</div>
                <div className="text-[10px] text-slate-500">KUITANSI PENERIMAAN KAS LAPANGAN</div>
                <div className="text-[10px] text-slate-500">0821-1200-1600 • https://audira.my.id</div>
                <div className="border-t border-dashed border-slate-300 my-2" />
                <div className="text-left space-y-1">
                  <div>No. Kuitansi: <b className="float-right">{activeReceipt.receiptNumber}</b></div>
                  <div>Pelanggan: <b className="float-right">{activeReceipt.customerName}</b></div>
                  <div>No. Invoice: <b className="float-right">{activeReceipt.invoiceNumber}</b></div>
                  <div>Waktu: <span className="float-right text-[10px]">{new Date(activeReceipt.paidAt).toLocaleString('id-ID')}</span></div>
                </div>
                <div className="border-t border-dashed border-slate-300 my-2" />
                <div className="flex justify-between items-center text-sm font-black">
                  <span>TOTAL TUNAI:</span>
                  <span>Rp {activeReceipt.amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-dashed border-slate-300 my-2" />
                <div className="text-[10px] text-slate-600">
                  Status: <b>LUNAS / TERBAYAR</b><br />
                  Petugas: {activeReceipt.collectorName}
                </div>
                <div className="text-[9px] text-slate-400 pt-2">Simpan bukti pembayaran ini dengan baik.</div>
              </div>

              <div className="no-print p-4 border-t border-theme-border flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={handleSendWaReceipt}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Kirim Kuitansi via WhatsApp</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full py-2 border border-theme-border hover:bg-slate-100 dark:hover:bg-slate-800 text-theme-text rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>Cetak Struk Thermal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Serah Terima Kas (Tutup Shift) */}
        {showHandoverModal && shift && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
            <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-theme-text flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-500" /> Serah Terima Kas & Tutup Shift
                </h3>
                <button onClick={() => setShowHandoverModal(false)} className="text-theme-muted hover:text-theme-text">✕</button>
              </div>

              <form onSubmit={handleHandoverShift} className="p-5 space-y-4 text-xs">
                <div className="bg-theme-bg border border-theme-border rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Nama Petugas:</span>
                    <span className="font-bold text-theme-text">{shift.collectorName}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-theme-border/50 pt-2">
                    <span className="text-theme-muted font-bold">Total Kas Disetor:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                      Rp {shift.totalCollected.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-theme-muted font-bold block">Catatan Serah Terima (Opsional)</label>
                  <textarea
                    rows={3}
                    value={handoverNotes}
                    onChange={e => setHandoverNotes(e.target.value)}
                    placeholder="Contoh: Setoran uang pecahan 50rb & 100rb diserahkan ke kasir kantor."
                    className="w-full bg-theme-bg border border-theme-border rounded-xl p-3 text-xs text-theme-text focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-4 border-t border-theme-border flex justify-end gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowHandoverModal(false)}
                    className="px-4 py-2 border border-theme-border text-theme-muted hover:text-theme-text rounded-xl font-semibold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isHandingOver}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    {isHandingOver ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    <span>{isHandingOver ? 'Memproses...' : 'Tutup Shift & Setor'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
