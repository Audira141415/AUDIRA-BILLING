import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Terminal, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Radio, 
  RefreshCw, 
  Server, 
  Zap, 
  ChevronRight 
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

interface OutageIncident {
  id: string
  odpName: string
  location: string
  affectedCount: number
  customers: string[]
  timestamp: string
  status: string
}

export default function NocCommandCenter() {
  const [outages, setOutages] = useState<OutageIncident[]>([])
  const [loading, setLoading] = useState(false)
  const [cliInput, setCliInput] = useState('/status')
  const [cliLogs, setCliLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'AUDIRA NOC TELEGRAM GATEWAY INITIALIZED\nPerintah tersedia: /status, /ping <ip>, /redaman INT002, /kick <user>, /reboot <user>',
      time: new Date().toLocaleTimeString(),
    },
  ])
  const [isSendingCmd, setIsSendingCmd] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const loadOutages = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/monitoring/telegram/outages`)
      if (res.ok) {
        const data = await res.json()
        setOutages(data || [])
      }
    } catch (err) {
      console.error('Failed to load outages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOutages()
  }, [])

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cliInput.trim()) return

    const cmd = cliInput.trim()
    const now = new Date().toLocaleTimeString()

    setCliLogs((prev) => [...prev, { sender: 'user', text: cmd, time: now }])
    setCliInput('')
    setIsSendingCmd(true)

    try {
      const res = await fetch(`${API_BASE}/monitoring/telegram/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      })

      if (res.ok) {
        const data = await res.json()
        const replyText = data.text || (data.simulated ? 'Perintah berhasil diproses oleh bot gateway.' : JSON.stringify(data, null, 2))
        setCliLogs((prev) => [...prev, { sender: 'bot', text: replyText, time: new Date().toLocaleTimeString() }])
      } else {
        setCliLogs((prev) => [...prev, { sender: 'bot', text: 'Terjadi kesalahan memproses perintah.', time: new Date().toLocaleTimeString() }])
      }
    } catch (err: any) {
      setCliLogs((prev) => [...prev, { sender: 'bot', text: `Error: ${err.message}`, time: new Date().toLocaleTimeString() }])
    } finally {
      setIsSendingCmd(false)
    }
  }

  const handleSimulateOutage = async () => {
    try {
      setIsSimulating(true)
      const res = await fetch(`${API_BASE}/monitoring/telegram/test-outage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        await loadOutages()
        setCliLogs((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: '[ALERT SENT TO NOC TELEGRAM]\nODP ODP-MRD-01 terdeteksi 5 pelanggan drop serentak!\nNotifikasi dikirim ke tim teknisi lapangan.',
            time: new Date().toLocaleTimeString(),
          },
        ])
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header - Crisp Light */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono text-slate-500">Jaringan & NOC</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] font-mono text-blue-600 font-medium">Telegram NOC & Outage Engine</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-blue-600" />
              NOC Command Center & Outage Auto-Detector
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Deteksi korelasi kabel fiber putus per ODP dan konsol CLI Telegram Bot untuk teknisi lapangan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSimulateOutage}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Mengirim...' : 'Simulasi Kabel Putus'}</span>
            </button>

            <button
              onClick={loadOutages}
              disabled={loading}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Outages List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Insiden Gangguan Massal (ODP)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{outages.length} Insiden</span>
              </div>

              <div className="mt-3 space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {outages.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-rose-50/40 border border-rose-200 rounded-lg space-y-2 hover:bg-rose-50/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        {item.odpName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString('id-ID')} WIB
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.affectedCount} Pelanggan Drop Serentak</span>
                    </div>

                    <div className="text-[11px] text-slate-600">{item.location}</div>

                    <div className="pt-2 border-t border-rose-100 text-[10px] text-slate-600 space-y-0.5">
                      <div className="font-semibold text-slate-500 uppercase tracking-wider">Dampak:</div>
                      {item.customers.slice(0, 3).map((c, i) => (
                        <div key={i} className="truncate text-slate-700">• {c}</div>
                      ))}
                      {item.customers.length > 3 && (
                        <div className="text-slate-500 italic">+ {item.customers.length - 3} pelanggan lainnya</div>
                      )}
                    </div>
                  </div>
                ))}

                {outages.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                    <p className="font-semibold text-slate-700">Semua Jalur Distribusi Normal</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tidak ada anomali kabel putus serentak.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Telegram CLI Console (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[560px]">
              {/* Terminal Title Bar */}
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-600 ml-2">Telegram NOC Gateway CLI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-mono text-emerald-700 font-medium">BOT ONLINE</span>
                </div>
              </div>

              {/* Logs output */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-slate-900 text-slate-100">
                {cliLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      log.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5">{log.time}</div>
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed whitespace-pre-wrap ${
                        log.sender === 'user'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* CLI Command Input */}
              <form onSubmit={handleSendCommand} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-mono text-xs font-bold">&gt;</span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder="Ketik perintah (/status, /redaman INT002, /ping 8.8.8.8)..."
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingCmd}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
