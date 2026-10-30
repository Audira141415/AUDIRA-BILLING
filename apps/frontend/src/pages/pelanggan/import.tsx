import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import api from '@/lib/api'
import { Pagination } from '@/components/Pagination'
import { useToast } from '@/contexts/ToastContext'
import {
  Upload, FileText, CheckCircle, AlertTriangle, Download, ArrowRight,
  RefreshCw, X, HelpCircle, ChevronRight, Check, ArrowLeft, Play, Save, Edit2, Calendar
} from 'lucide-react'

interface CustomerRow {
  no: number
  nama: string
  no_ktp: string
  no_hp: string
  email: string
  paket: string
  alamat: string
  tanggal_daftar: string
}

interface ValidationResult {
  row: CustomerRow
  isValid: boolean
  errors: {
    nama?: string
    no_ktp?: string
    no_hp?: string
    email?: string
    paket?: string
    alamat?: string
    tanggal_daftar?: string
  }
}

const INITIAL_MOCK_DATA: CustomerRow[] = []

export default function ImportCustomer() {
  const router = useRouter()
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [previewPage, setPreviewPage] = useState(1)
  const [previewPageSize, setPreviewPageSize] = useState(10)
  
  // File state
  const [file, setFile] = useState<{ name: string; size: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Data states
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<any[]>([])
  const [availablePackages, setAvailablePackages] = useState<any[]>([])
  
  // Step 2: Mapping states
  const [mappings, setMappings] = useState<Record<string, string>>({
    nama: 'nama',
    no_ktp: 'no_ktp',
    no_hp: 'no_hp',
    email: 'email',
    paket: 'paket',
    alamat: 'alamat',
    tanggal_daftar: 'tanggal_daftar'
  })

  // Step 3: Validation states
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editingRowData, setEditingRowData] = useState<CustomerRow | null>(null)

  // Step 4: Import Settings states
  const [duplicateAction, setDuplicateAction] = useState('skip')
  const [initialStatus, setInitialStatus] = useState('active')
  const [sendWelcomeWA, setSendWelcomeWA] = useState(true)

  // Step 5: Execution states
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)

  // Load packages for validation and mapping
  useEffect(() => {
    const fetchPkgs = async () => {
      try {
        const pkgs = await api.paket.getAll()
        setAvailablePackages(Array.isArray(pkgs) ? pkgs : [])
      } catch (err) {
        console.error('Gagal memuat daftar paket:', err)
      }
    }
    fetchPkgs()
  }, [])

  // Auto validate data when mappings change or parsedData changes
  useEffect(() => {
    const results = parsedData.map((row, index) => {
      const getVal = (targetField: string) => {
        const mappedCol = mappings[targetField]
        return mappedCol ? String(row[mappedCol] || '').trim() : ''
      }

      const valRow: CustomerRow = {
        no: row.no || index + 1,
        nama: getVal('nama'),
        no_ktp: getVal('no_ktp'),
        no_hp: getVal('no_hp'),
        email: getVal('email'),
        paket: getVal('paket'),
        alamat: getVal('alamat'),
        tanggal_daftar: getVal('tanggal_daftar')
      }

      const errors: ValidationResult['errors'] = {}
      if (!valRow.nama) errors.nama = 'Nama lengkap wajib diisi'
      if (!valRow.no_ktp) {
        errors.no_ktp = 'Nomor KTP wajib diisi'
      } else if (valRow.no_ktp.length !== 16) {
        errors.no_ktp = 'Nomor KTP harus terdiri dari 16 digit'
      }
      
      if (!valRow.no_hp) {
        errors.no_hp = 'Nomor HP wajib diisi'
      } else if (!valRow.no_hp.startsWith('62') && !valRow.no_hp.startsWith('08')) {
        errors.no_hp = 'Nomor HP harus diawali dengan 62 atau 08'
      }

      if (valRow.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valRow.email)) {
        errors.email = 'Format email tidak valid'
      }

      if (!valRow.paket) {
        errors.paket = 'Paket wajib diisi'
      }

      if (!valRow.alamat) {
        errors.alamat = 'Alamat wajib diisi'
      }

      if (!valRow.tanggal_daftar) {
        errors.tanggal_daftar = 'Tanggal daftar wajib diisi'
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(valRow.tanggal_daftar)) {
        errors.tanggal_daftar = 'Format tanggal harus YYYY-MM-DD'
      }

      const isValid = Object.keys(errors).length === 0

      return {
        row: valRow,
        isValid,
        errors
      }
    })
    setValidationResults(results)
  }, [parsedData, mappings, availablePackages])

  // Handle Custom File Upload (CSV parsing)
  const handleFilePick = (pickedFile: File) => {
    setFile({
      name: pickedFile.name,
      size: `${(pickedFile.size / 1024).toFixed(1)} KB`
    })

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
      if (lines.length > 0) {
        const delimiter = text.includes(';') ? ';' : ','
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())
        setRawHeaders(headers)
        
        // Parse rows
        const rows = lines.slice(1).map((line, idx) => {
          const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''))
          const rowData: any = { no: idx + 1 }
          headers.forEach((header, colIdx) => {
            rowData[header] = cols[colIdx] || ''
          })
          return rowData
        })

        // Auto map headers
        const newMappings = { ...mappings }
        const targetFields = ['nama', 'no_ktp', 'no_hp', 'email', 'paket', 'alamat', 'tanggal_daftar']
        targetFields.forEach(field => {
          const matched = headers.find(h => h.includes(field) || field.includes(h))
          if (matched) newMappings[field] = matched
        })
        setMappings(newMappings)
        setParsedData(rows)
      }
    }
    reader.readAsText(pickedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) {
      handleFilePick(f)
    }
  }

  const downloadTemplate = () => {
    const csvContent = "nama,no_ktp,no_hp,email,paket,alamat,tanggal_daftar\nJohn Doe,3201020304050607,628123456789,john.doe@email.com,Home 50 Mbps,Jl. Raya Contoh No. 123,2026-07-02"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "template_import_customer.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Template CSV berhasil diunduh.')
  }

  const handleSaveInlineEdit = () => {
    if (editingRowIndex !== null && editingRowData) {
      const updatedParsed = [...parsedData]
      updatedParsed[editingRowIndex] = {
        ...updatedParsed[editingRowIndex],
        ...editingRowData
      }
      setParsedData(updatedParsed)
      setEditingRowIndex(null)
      setEditingRowData(null)
      toast.success('Perubahan baris berhasil disimpan dan divalidasi ulang.')
    }
  }

  const startImportProcess = async () => {
    setImporting(true)
    setImportProgress(0)
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      const validRows = validationResults.filter(r => r.isValid).map(r => r.row)
      let success = 0
      let failed = 0

      // Call API sequentially or in batches
      for (const row of validRows) {
        try {
          // Find matching package ID from package list or default to new
          const matchedPkg = availablePackages.find(p => p.name.toLowerCase().includes(row.paket.toLowerCase()))
          
          await api.pelanggan.create({
            name: row.nama,
            email: row.email || null,
            phone: row.no_hp,
            address: row.alamat || null,
            status: initialStatus,
            packageIds: matchedPkg ? [matchedPkg.id] : [],
            internetNumber: `CUST-2026-${Math.floor(1000 + Math.random() * 9000)}`
          })
          success++
        } catch (error) {
          console.error('Gagal import baris:', row, error)
          failed++
        }
      }

      clearInterval(interval)
      setImportProgress(100)
      setImportResult({ success, failed: failed + (validationResults.length - validRows.length) })
      toast.success(`Import selesai: ${success} pelanggan berhasil ditambahkan.`)
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat memproses import pelanggan.')
    } finally {
      setImporting(false)
    }
  }

  const totalValid = validationResults.filter(r => r.isValid).length
  const totalErrors = validationResults.filter(r => !r.isValid).length

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--app-border)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--app-muted)] font-mono mb-1">
              <Link href="/" className="hover:text-[var(--app-text)]">AUDIRA</Link>
              <span>/</span>
              <Link href="/pelanggan" className="hover:text-[var(--app-text)]">Customer CRM</Link>
              <span>/</span>
              <span className="text-[var(--app-primary)]">Import Data</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--app-text)] flex items-center gap-2.5">
              Import & Migrasi Data Pelanggan
            </h1>
            <p className="text-xs text-[var(--app-muted)]">
              Upload file CSV atau Excel (XLSX) untuk mengimpor data pelanggan massal ke dalam sistem.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/pelanggan"
              className="px-4 py-2 border border-[var(--app-border)] bg-[var(--app-card)] hover:bg-[var(--app-border)] text-[var(--app-text)] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              Kembali ke Customer
            </Link>
          </div>
        </div>

        {/* Wizard Multi-Step Progress Bar */}
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:px-8">
            {[
              { stepNum: 1, title: 'Upload File' },
              { stepNum: 2, title: 'Pemetaan Data' },
              { stepNum: 3, title: 'Validasi Data' },
              { stepNum: 4, title: 'Pengaturan' },
              { stepNum: 5, title: 'Konfirmasi' }
            ].map((s, index) => (
              <div key={s.stepNum} className="flex-1 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                  currentStep === s.stepNum 
                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20 border-2 border-blue-400' 
                    : currentStep > s.stepNum
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-[var(--app-bg)] text-[var(--app-text-muted)] border border-[var(--app-border)]'
                }`}>
                  {currentStep > s.stepNum ? <Check size={14} /> : s.stepNum}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold leading-none ${currentStep >= s.stepNum ? 'text-[var(--app-text)]' : 'text-[var(--app-text-muted)]'}`}>
                    {s.title}
                  </span>
                  <span className="text-[9px] text-[var(--app-text-muted)] mt-1 hidden md:inline">Langkah {s.stepNum}</span>
                </div>
                {index < 4 && <ChevronRight size={14} className="text-[var(--app-text-muted)] hidden md:block ml-auto mr-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Area */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left Column: File Upload Area */}
              <div className="xl:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] mb-1">1. Upload File</h3>
                  <p className="text-xs text-[var(--app-text-muted)] mb-4">Upload file Excel/CSV berisi data customer yang akan diimport</p>
                  
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      dragOver ? 'border-blue-500 bg-blue-600/10' : 'border-[var(--app-border)] hover:border-blue-500/50 hover:bg-[var(--app-bg)]'
                    }`}
                  >
                    <input ref={fileRef} type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={e => e.target.files?.[0] && handleFilePick(e.target.files[0])} />
                    <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                      <Upload size={20} className="text-blue-400" />
                    </div>
                    <p className="text-sm font-bold text-[var(--app-text)]">Drag & drop file Excel/CSV di sini</p>
                    <p className="text-xs text-[var(--app-text-muted)] my-1">atau</p>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        fileRef.current?.click()
                      }}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition"
                    >
                      Pilih File
                    </button>
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-4">Format yang didukung: .xlsx, .xls, .csv · Ukuran maksimal file: 10 MB</p>
                  </div>
                </div>

                {file && (
                  <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center justify-center">
                        <FileText size={18} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--app-text)] max-w-[200px] truncate">{file.name}</p>
                        <p className="text-[10px] font-mono text-[var(--app-text-muted)] mt-0.5">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                        <Check size={10} /> Valid
                      </span>
                      <button onClick={() => { setFile(null); setParsedData([]) }} className="text-xs text-red-400 hover:text-red-300 font-semibold">
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Middle Column: Format File Column Reference */}
              <div className="xl:col-span-4 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--app-text)] mb-1">Contoh Format File</h3>
                      <p className="text-xs text-[var(--app-text-muted)]">Pastikan susunan kolom file sesuai template</p>
                    </div>
                    <button onClick={downloadTemplate} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] rounded-lg text-[10px] text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition">
                      <Download size={12} /> Download Template Excel
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[var(--app-border)] text-[10px] text-[var(--app-text-muted)] uppercase tracking-wider font-bold">
                          <th className="py-2 pr-4">Kolom Wajib</th>
                          <th className="py-2">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--app-border)]">
                        {[
                          { name: 'nama', desc: 'Nama lengkap customer' },
                          { name: 'no_ktp', desc: 'Nomor KTP customer' },
                          { name: 'no_hp', desc: 'Nomor handphone/WhatsApp' },
                          { name: 'email', desc: 'Email customer (opsional)' },
                          { name: 'paket', desc: 'Nama paket/layanan' },
                          { name: 'alamat', desc: 'Alamat lengkap' },
                          { name: 'tanggal_daftar', desc: 'Tanggal daftar (format: YYYY-MM-DD)' }
                        ].map(col => (
                          <tr key={col.name}>
                            <td className="py-2.5 font-mono font-bold text-blue-400 text-[11px]">{col.name}</td>
                            <td className="py-2.5 text-[var(--app-text-muted)] text-[11px]">{col.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Tips & Help */}
              <div className="xl:col-span-3 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Tips Import</h3>
                  <ul className="space-y-3">
                    {[
                      'Pastikan file tidak memiliki password',
                      'Gunakan format tanggal YYYY-MM-DD',
                      'Nomor HP diawali dengan kode negara (62)',
                      'Pastikan nama paket sudah tersedia',
                      'Hindari data duplikat (No. KTP/No. HP)'
                    ].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--app-text-muted)]">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--app-text)]">Butuh bantuan?</h4>
                      <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Lihat panduan lengkap cara melakukan import customer</p>
                    </div>
                  </div>
                  <button onClick={() => toast.info("Panduan Impor Pelanggan: Pastikan format file .xlsx/.csv sesuai template dengan kolom nama, no_hp, alamat, dan paket.")} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] rounded-lg text-[10px] text-[var(--app-text)] transition font-bold">
                    Buka Panduan
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Preview Data Table */}
            {parsedData.length > 0 && (
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Preview Data <span className="text-xs font-normal text-[var(--app-text-muted)]">(10 baris pertama)</span></h3>
                  <span className="text-[10px] font-mono text-[var(--app-text-muted)] font-bold bg-[var(--app-bg)] border border-[var(--app-border)] px-2 py-1 rounded">Total: {parsedData.length} baris terdeteksi</span>
                </div>

                <div className="border border-[var(--app-border)] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] uppercase tracking-wider font-bold">
                          <th className="p-3 w-12 text-center">No</th>
                          <th className="p-3">Nama</th>
                          <th className="p-3">No. KTP</th>
                          <th className="p-3">No. HP</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Paket</th>
                          <th className="p-3">Alamat</th>
                          <th className="p-3">Tanggal Daftar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--app-border)]">
                        {parsedData.slice((previewPage - 1) * previewPageSize, previewPage * previewPageSize).map((row, i) => (
                          <tr key={i} className="hover:bg-[var(--app-card-hover)] transition">
                            <td className="p-3 text-center text-[var(--app-text-muted)] font-mono font-semibold flex items-center justify-center gap-1.5">
                              <CheckCircle size={12} className="text-green-500" />
                              <span>{row.no || (previewPage - 1) * previewPageSize + i + 1}</span>
                            </td>
                            <td className="p-3 font-bold text-[var(--app-text)]">{row.nama || row.name || '-'}</td>
                            <td className="p-3 text-[var(--app-text-muted)] font-mono font-semibold">{row.no_ktp || '-'}</td>
                            <td className="p-3 text-[var(--app-text-muted)] font-mono font-semibold">{row.no_hp || row.phone || '-'}</td>
                            <td className="p-3 text-[var(--app-text-muted)]">{row.email || '-'}</td>
                            <td className="p-3 text-[var(--app-text)] font-semibold">{row.paket || '-'}</td>
                            <td className="p-3 text-[var(--app-text-muted)] truncate max-w-xs">{row.alamat || row.address || '-'}</td>
                            <td className="p-3 text-[var(--app-text-muted)] font-mono font-semibold">{row.tanggal_daftar || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Pagination
                  currentPage={previewPage}
                  totalPages={Math.max(1, Math.ceil(parsedData.length / previewPageSize))}
                  totalItems={parsedData.length}
                  pageSize={previewPageSize}
                  onPageChange={setPreviewPage}
                  onPageSizeChange={(newSize) => {
                    setPreviewPageSize(newSize);
                    setPreviewPage(1);
                  }}
                />
              </div>
            )}

            {/* Step 1 Footer Actions */}
            <div className="flex justify-between items-center border-t border-[var(--app-border)] pt-5 mt-4">
              <button onClick={() => router.push('/pelanggan')} className="px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                Batal
              </button>
              <div className="flex gap-3">
                <button onClick={() => toast.success("Draft proses import berhasil disimpan ke penyimpanan lokal!")} className="px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                  Simpan Draft
                </button>
                <button
                  onClick={() => parsedData.length > 0 && setCurrentStep(2)}
                  disabled={parsedData.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg transition"
                >
                  Lanjut: Pemetaan Data <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Mapping Controls */}
              <div className="lg:col-span-7 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] mb-1">Hubungkan Kolom File dengan Field Database</h3>
                  <p className="text-xs text-[var(--app-text-muted)]">Sistem mendeteksi kolom otomatis. Anda dapat mengubah pemetaan secara manual jika ada ketidaksesuaian.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'nama', label: 'Nama Lengkap', required: true, description: 'Nama lengkap pelanggan sesuai KTP/Identitas' },
                    { key: 'no_ktp', label: 'Nomor KTP', required: true, description: 'Nomor Induk Kependudukan (16 digit)' },
                    { key: 'no_hp', label: 'Nomor HP/WhatsApp', required: true, description: 'Nomor handphone untuk notifikasi penagihan' },
                    { key: 'email', label: 'Email', required: false, description: 'Alamat surel aktif pelanggan' },
                    { key: 'paket', label: 'Paket Layanan', required: true, description: 'Paket internet yang didaftarkan' },
                    { key: 'alamat', label: 'Alamat Lengkap', required: true, description: 'Alamat lengkap lokasi pemasangan' },
                    { key: 'tanggal_daftar', label: 'Tanggal Daftar', required: true, description: 'Tanggal aktif layanan (YYYY-MM-DD)' }
                  ].map(field => (
                    <div key={field.key} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[var(--app-bg)] border border-[var(--app-border)] p-4 rounded-xl">
                      <div className="md:col-span-5 space-y-1">
                        <label className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5">
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <p className="text-[10px] text-[var(--app-text-muted)] leading-tight">{field.description}</p>
                      </div>
                      
                      <div className="md:col-span-7">
                        <select
                          value={mappings[field.key] || ''}
                          onChange={e => setMappings({ ...mappings, [field.key]: e.target.value })}
                          className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-3 py-2 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                        >
                          <option value="">-- Lewati Field Ini --</option>
                          {rawHeaders.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Helper / Reference Card */}
              <div className="lg:col-span-5 bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Panduan Pemetaan</h3>
                  <div className="space-y-3.5 text-xs text-[var(--app-text-muted)]">
                    <div className="bg-blue-600/5 border border-blue-500/20 p-3.5 rounded-xl space-y-2">
                      <h4 className="font-bold text-[var(--app-text)] flex items-center gap-1.5 text-xs">
                        <CheckCircle size={14} className="text-blue-400" /> Deteksi Otomatis Aktif
                      </h4>
                      <p className="text-[11px] leading-relaxed text-[var(--app-text-muted)]">
                        Kolom file yang memiliki nama mirip dengan field sistem akan secara otomatis dicocokkan oleh sistem.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-[var(--app-text)]">Ketentuan Tipe Data:</h4>
                      <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px]">
                        <li><strong className="text-[var(--app-text)]">Nama:</strong> Teks alfanumerik bebas.</li>
                        <li><strong className="text-[var(--app-text)]">No. KTP:</strong> Hanya angka, wajib 16 karakter.</li>
                        <li><strong className="text-[var(--app-text)]">No. HP:</strong> Format nomor telepon lokal/internasional.</li>
                        <li><strong className="text-[var(--app-text)]">Tanggal:</strong> Format ISO-8601 (YYYY-MM-DD).</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-400" />
                    <span className="text-[11px] text-[var(--app-text)] font-semibold">Total field terhubung:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--app-text)] bg-blue-600/20 border border-blue-500/20 px-2 py-1 rounded">
                    {Object.values(mappings).filter(Boolean).length} / 7 Field
                  </span>
                </div>
              </div>

            </div>

            {/* Step 2 Footer Actions */}
            <div className="flex justify-between items-center border-t border-[var(--app-border)] pt-5 mt-4">
              <button onClick={() => setCurrentStep(1)} className="flex items-center gap-1.5 px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                <ArrowLeft size={14} /> Kembali
              </button>
              <div className="flex gap-3">
                <button onClick={() => toast.success("Draft proses import berhasil disimpan ke penyimpanan lokal!")} className="px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                  Simpan Draft
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl shadow-lg transition"
                >
                  Lanjut: Validasi Data <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            
            {/* Summary metrics header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Total Baris</p>
                  <p className="text-2xl font-black font-mono text-[var(--app-text)] mt-1">{validationResults.length}</p>
                </div>
                <div className="p-3 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-[var(--app-text-muted)]">
                  <FileText size={20} />
                </div>
              </div>

              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Data Valid</p>
                  <p className="text-2xl font-black font-mono text-green-400 mt-1">{totalValid}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
                  <CheckCircle size={20} />
                </div>
              </div>

              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[var(--app-text-muted)] font-bold uppercase tracking-wider">Data Error / Warning</p>
                  <p className="text-2xl font-black font-mono text-red-400 mt-1">{totalErrors}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </div>

            {/* Validation Table & Inline Editor */}
            <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)] mb-1">Hasil Validasi Data Pelanggan</h3>
                <p className="text-xs text-[var(--app-text-muted)]">Anda dapat langsung mengoreksi data yang salah dengan mengklik tombol edit di setiap baris.</p>
              </div>

              {/* Inline editor panel if active */}
              {editingRowIndex !== null && editingRowData && (
                <div className="bg-[var(--app-bg)] border border-blue-500/40 rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-[var(--app-text)] flex items-center gap-1.5">
                      <Edit2 size={12} className="text-blue-400" /> Edit Data Baris ke-{editingRowIndex + 1}
                    </h4>
                    <button onClick={() => { setEditingRowIndex(null); setEditingRowData(null) }} className="text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">Nama Lengkap</label>
                      <input
                        type="text"
                        value={editingRowData.nama}
                        onChange={e => setEditingRowData({ ...editingRowData, nama: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">No. KTP</label>
                      <input
                        type="text"
                        value={editingRowData.no_ktp}
                        onChange={e => setEditingRowData({ ...editingRowData, no_ktp: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">No. HP</label>
                      <input
                        type="text"
                        value={editingRowData.no_hp}
                        onChange={e => setEditingRowData({ ...editingRowData, no_hp: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">Email</label>
                      <input
                        type="text"
                        value={editingRowData.email}
                        onChange={e => setEditingRowData({ ...editingRowData, email: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">Paket</label>
                      <input
                        type="text"
                        value={editingRowData.paket}
                        onChange={e => setEditingRowData({ ...editingRowData, paket: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">Alamat</label>
                      <input
                        type="text"
                        value={editingRowData.alamat}
                        onChange={e => setEditingRowData({ ...editingRowData, alamat: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[var(--app-text-muted)] block font-bold">Tanggal Daftar</label>
                      <input
                        type="text"
                        value={editingRowData.tanggal_daftar}
                        onChange={e => setEditingRowData({ ...editingRowData, tanggal_daftar: e.target.value })}
                        className="w-full bg-[var(--app-card)] border border-[var(--app-border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => { setEditingRowIndex(null); setEditingRowData(null) }}
                      className="px-4 py-1.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-lg transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveInlineEdit}
                      className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition"
                    >
                      <Save size={12} /> Simpan Perubahan
                    </button>
                  </div>
                </div>
              )}

              {/* Data Validation Table */}
              <div className="border border-[var(--app-border)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] uppercase tracking-wider font-bold">
                        <th className="p-3 w-16 text-center">Status</th>
                        <th className="p-3">Nama</th>
                        <th className="p-3">KTP</th>
                        <th className="p-3">No. HP</th>
                        <th className="p-3">Paket</th>
                        <th className="p-3">Alamat</th>
                        <th className="p-3">Pesan Validasi</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)]">
                      {validationResults.map((result, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-[var(--app-card-hover)] transition ${
                            !result.isValid ? 'bg-red-500/5' : ''
                          }`}
                        >
                          <td className="p-3 text-center">
                            {result.isValid ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400" title="Valid">
                                <Check size={12} />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400" title="Error">
                                <X size={12} />
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-[var(--app-text)]">{result.row.nama || '-'}</td>
                          <td className="p-3 text-[var(--app-text-muted)] font-mono font-semibold">{result.row.no_ktp || '-'}</td>
                          <td className="p-3 text-[var(--app-text-muted)] font-mono font-semibold">{result.row.no_hp || '-'}</td>
                          <td className="p-3 text-[var(--app-text)] font-semibold">{result.row.paket || '-'}</td>
                          <td className="p-3 text-[var(--app-text-muted)] truncate max-w-xs">{result.row.alamat || '-'}</td>
                          <td className="p-3 text-xs">
                            {result.isValid ? (
                              <span className="text-green-400 font-semibold">Siap Diimport</span>
                            ) : (
                              <span className="text-red-400 font-semibold leading-tight">
                                {Object.values(result.errors).filter(Boolean).join(', ')}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setEditingRowIndex(i)
                                setEditingRowData({ ...result.row })
                              }}
                              className="p-1 text-[var(--app-text-muted)] hover:text-blue-400 hover:bg-[var(--app-bg)] rounded transition"
                              title="Edit Baris"
                            >
                              <Edit2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Step 3 Footer Actions */}
            <div className="flex justify-between items-center border-t border-[var(--app-border)] pt-5 mt-4">
              <button onClick={() => setCurrentStep(2)} className="flex items-center gap-1.5 px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                <ArrowLeft size={14} /> Kembali
              </button>
              <div className="flex gap-3">
                <button onClick={() => toast.success("Draft proses import berhasil disimpan ke penyimpanan lokal!")} className="px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                  Simpan Draft
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl shadow-lg transition"
                >
                  Lanjut: Pengaturan <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Configuration Controls */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--app-text)] mb-1">Pengaturan Import</h3>
                  <p className="text-xs text-[var(--app-text-muted)]">Atur preferensi sistem mengenai penanganan data dan aktivasi customer yang akan diunggah.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--app-text)] block">Tindakan untuk Duplikasi Data</label>
                    <p className="text-[10px] text-[var(--app-text-muted)]">Gunakan opsi ini jika ditemukan customer dengan No. KTP atau No. HP yang sudah terdaftar di sistem.</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'skip', title: 'Lewati (Skip)', desc: 'Jangan import data' },
                        { id: 'overwrite', title: 'Perbarui (Update)', desc: 'Timpa data yang ada' },
                        { id: 'duplicate', title: 'Buat Baru', desc: 'Tetap buat record baru' }
                      ].map(opt => (
                        <div
                          key={opt.id}
                          onClick={() => setDuplicateAction(opt.id)}
                          className={`p-3 border rounded-xl cursor-pointer transition text-center ${
                            duplicateAction === opt.id
                              ? 'border-blue-500 bg-blue-500/10 text-[var(--app-text)]'
                              : 'border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:border-blue-400/50'
                          }`}
                        >
                          <p className="text-xs font-bold">{opt.title}</p>
                          <p className="text-[9px] text-[var(--app-text-muted)] mt-1 leading-tight">{opt.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--app-text)] block">Status Awal Customer Baru</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'active', title: 'Aktif', color: 'text-green-400' },
                        { id: 'pending', title: 'Pending', color: 'text-yellow-400' },
                        { id: 'trial', title: 'Trial', color: 'text-blue-400' },
                        { id: 'inactive', title: 'Nonaktif', color: 'text-[var(--app-text-muted)]' }
                      ].map(opt => (
                        <div
                          key={opt.id}
                          onClick={() => setInitialStatus(opt.id)}
                          className={`p-2.5 border rounded-xl cursor-pointer transition text-center ${
                            initialStatus === opt.id
                              ? 'border-blue-500 bg-blue-500/10 text-[var(--app-text)]'
                              : 'border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-text-muted)] hover:border-blue-400/50'
                          }`}
                        >
                          <p className={`text-xs font-bold ${opt.color}`}>{opt.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl">
                    <div className="space-y-0.5 max-w-[80%]">
                      <label className="text-xs font-bold text-[var(--app-text)] block">Kirim Notifikasi Aktivasi WhatsApp</label>
                      <p className="text-[10px] text-[var(--app-text-muted)] leading-normal">
                        Kirim pesan otomatis via WhatsApp web/gateway kepada nomor HP customer yang valid begitu proses import selesai.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendWelcomeWA}
                        onChange={e => setSendWelcomeWA(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[var(--app-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-200 after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Status Reference Info */}
              <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl p-6 shadow-2xs space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Panduan Pengaturan</h3>
                  <div className="space-y-3.5 text-xs text-[var(--app-text-muted)] leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="font-bold text-[var(--app-text)] text-xs">Penanganan Duplikat</h4>
                      <p className="text-[11px]">
                        Sistem mencocokkan field No. KTP dan No. HP dengan database. Jika memilih <strong className="text-[var(--app-text)]">Lewati</strong>, baris duplikat akan dilewati dengan status error. Jika memilih <strong className="text-[var(--app-text)]">Perbarui</strong>, data lama customer di database akan ditimpa dengan data baru dari file Excel/CSV.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-[var(--app-text)] text-xs">Status Customer</h4>
                      <p className="text-[11px]">
                        Customer baru yang dibuat dapat langsung diset menjadi <strong className="text-[var(--app-text)]">Aktif</strong> agar langsung mendapat invoice aktif berikutnya, atau diset <strong className="text-[var(--app-text)]">Pending</strong> jika masih membutuhkan aktivasi fisik/teknisi lapangan di lokasi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-400" />
                    <span className="text-[11px] text-[var(--app-text)] font-semibold">Tindakan duplikat disetel ke:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--app-text)] uppercase bg-blue-600/20 border border-blue-500/20 px-2.5 py-1 rounded">
                    {duplicateAction}
                  </span>
                </div>
              </div>

            </div>

            {/* Step 4 Footer Actions */}
            <div className="flex justify-between items-center border-t border-[var(--app-border)] pt-5 mt-4">
              <button onClick={() => setCurrentStep(3)} className="flex items-center gap-1.5 px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                <ArrowLeft size={14} /> Kembali
              </button>
              <div className="flex gap-3">
                <button onClick={() => toast.success("Draft proses import berhasil disimpan ke penyimpanan lokal!")} className="px-6 py-2.5 bg-[var(--app-card)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition">
                  Simpan Draft
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl shadow-lg transition"
                >
                  Lanjut: Konfirmasi <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            {!importResult ? (
              <div className="max-w-2xl mx-auto bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-8 space-y-6 text-center">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full border border-blue-500/25 flex items-center justify-center mx-auto">
                  <Play size={24} className="text-blue-500 ml-1" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[var(--app-text)]">Konfirmasi & Mulai Proses Import</h3>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Mohon tinjau ringkasan di bawah ini sebelum memproses data ke database. Tindakan ini tidak dapat dibatalkan secara otomatis.
                  </p>
                </div>

                {/* Configuration Summary Card */}
                <div className="grid grid-cols-2 gap-4 text-left border-y border-[var(--app-border)] py-5 my-2">
                  <div className="space-y-3 pl-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Total Data Terdeteksi</span>
                      <span className="text-sm font-mono font-bold text-[var(--app-text)]">{validationResults.length} Baris</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Data Valid (Akan Diproses)</span>
                      <span className="text-sm font-mono font-bold text-green-400">{totalValid} Customer</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Data Error (Akan Dilewati)</span>
                      <span className="text-sm font-mono font-bold text-red-400">{totalErrors} Customer</span>
                    </div>
                  </div>

                  <div className="space-y-3 pl-4 border-l border-[var(--app-border)]">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Status Awal Customer</span>
                      <span className="text-sm font-bold text-[var(--app-text)] capitalize">{initialStatus}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Penanganan Duplikat</span>
                      <span className="text-sm font-bold text-[var(--app-text)] capitalize">{duplicateAction === 'skip' ? 'Lewati (Skip)' : duplicateAction === 'overwrite' ? 'Perbarui (Update)' : 'Buat Baru'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-[var(--app-text-muted)] block">Notifikasi WhatsApp</span>
                      <span className="text-sm font-bold text-[var(--app-text)]">{sendWelcomeWA ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                  </div>
                </div>

                {importing ? (
                  <div className="space-y-3.5 py-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--app-text-muted)] font-semibold">Mengimpor data customer...</span>
                      <span className="text-blue-400 font-mono font-bold">{importProgress}%</span>
                    </div>
                    <div className="w-full bg-[var(--app-bg)] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] border border-[var(--app-border)] text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] rounded-xl transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={startImportProcess}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl shadow-lg transition"
                    >
                      Mulai Import Data ({totalValid} Valid)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Success / Result Screen */
              <div className="max-w-md mx-auto bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-2xs p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-[var(--app-text)]">Import Selesai!</h3>
                  <p className="text-[var(--app-text-muted)] text-xs mt-1.5 leading-relaxed">
                    Proses import massal data pelanggan Anda telah selesai diproses oleh sistem.
                  </p>
                </div>

                <div className="bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl p-4 divide-y divide-[var(--app-border)] text-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-[var(--app-text-muted)]">Total Berhasil di-import:</span>
                    <span className="font-bold font-mono text-green-400">{importResult.success} Customer</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[var(--app-text-muted)]">Total Gagal / Dilewati:</span>
                    <span className="font-bold font-mono text-red-400">{importResult.failed} Customer</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3.5 pt-2">
                  <button
                    onClick={() => {
                      setCurrentStep(1)
                      setFile(null)
                      setParsedData([])
                      setImportResult(null)
                    }}
                    className="flex-1 px-4 py-2.5 bg-[var(--app-bg)] hover:bg-[var(--app-card-hover)] text-[var(--app-text)] text-xs font-bold rounded-xl border border-[var(--app-border)] transition"
                  >
                    Import Lagi
                  </button>
                  <button
                    onClick={() => router.push('/pelanggan')}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
                  >
                    Lihat Semua Customer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  )
}

