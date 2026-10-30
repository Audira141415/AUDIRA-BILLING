import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { Terminal, CheckCircle2, XCircle, ArrowLeft, Trash2 } from 'lucide-react'

export default function DebugAuth() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return <div className="p-8 text-xs font-mono text-[var(--app-text-muted)]">Memuat profil sesi...</div>
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono">DEBUG AUTH & RBAC MATRIX</h1>
            <p className="text-xs text-[var(--app-text-muted)]">Inspeksi state sesi pengguna dan izin akses menu</p>
          </div>
        </div>
        
        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] mb-3">Informasi Profil Sesi</h2>
          {user ? (
            <div className="space-y-1.5 text-xs font-mono">
              <p><span className="text-[var(--app-text-muted)]">Nama:</span> <strong className="text-[var(--app-text)]">{user.name}</strong></p>
              <p><span className="text-[var(--app-text-muted)]">Email:</span> <strong className="text-[var(--app-text)]">{user.email}</strong></p>
              <p><span className="text-[var(--app-text-muted)]">Role:</span> <span className="bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">{user.role}</span></p>
              <p><span className="text-[var(--app-text-muted)]">User ID:</span> <span className="text-[var(--app-text)]">{user.id}</span></p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold">
              <XCircle size={15} />
              <span>Tidak ada pengguna yang terautentikasi</span>
            </div>
          )}
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] mb-3">LocalStorage Token Snapshot</h2>
          <pre className="bg-[var(--app-card-subtle)] border border-[var(--app-border)] p-3 rounded-lg text-xs font-mono overflow-auto text-[var(--app-text)]">
            {typeof window !== 'undefined' ? (
              JSON.stringify({
                user: localStorage.getItem('user'),
                token: localStorage.getItem('token') ? 'PRESENT' : 'MISSING'
              }, null, 2)
            ) : 'Server side'}
          </pre>
        </div>

        <div className="bg-[var(--app-card)] border border-[var(--app-border)] rounded-xl shadow-xs p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] mb-3">Evaluasi Akses Role Navigasi</h2>
          <div className="space-y-2">
            {[
              { name: 'Dashboard', roles: ['ADMIN', 'BILLING', 'NOC', 'CS', 'TECHNICIAN'] },
              { name: 'Pelanggan', roles: ['ADMIN', 'BILLING', 'CS'] },
              { name: 'Paket', roles: ['ADMIN', 'BILLING', 'CS'] },
              { name: 'Keuangan', roles: ['ADMIN', 'BILLING'] },
              { name: 'Infrastruktur', roles: ['ADMIN', 'NOC', 'TECHNICIAN'] },
            ].map(item => {
              const hasAccess = user && item.roles.some(role => 
                role.toUpperCase() === user.role.toUpperCase()
              )
              return (
                <div key={item.name} className="flex items-center justify-between p-2.5 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-lg text-xs font-mono">
                  <span className="font-semibold text-[var(--app-text)]">{item.name}</span>
                  <span className={`inline-flex items-center gap-1.5 font-bold ${hasAccess ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {hasAccess ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {hasAccess ? 'DIIZINKAN' : 'DIBATASI'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          >
            <ArrowLeft size={14} />
            <span>Ke Konsol Utama</span>
          </button>
          <button
            onClick={() => {
              localStorage.clear()
              router.push('/login')
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-semibold rounded-lg transition"
          >
            <Trash2 size={14} />
            <span>Reset LocalStorage & Keluar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
