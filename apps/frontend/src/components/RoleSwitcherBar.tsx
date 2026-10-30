'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth, UserRole } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { 
  Activity, 
  Wrench, 
  Wallet, 
  User as UserIcon, 
  Crown,
  Zap,
  Minimize2
} from 'lucide-react'
import clsx from 'clsx'

interface RoleOption {
  role: UserRole
  label: string
  shortLabel: string
  icon: any
  activeClass: string
  inactiveClass: string
  description: string
  badgeText: string
}

const ROLES: RoleOption[] = [
  {
    role: 'SUPERADMIN',
    label: 'Superadmin / Owner',
    shortLabel: 'Superadmin',
    icon: Crown,
    activeClass: 'bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border-amber-400/80 shadow-[0_0_18px_rgba(245,158,11,0.35)]',
    inactiveClass: 'text-amber-400/70 hover:text-amber-200 hover:bg-amber-500/10 border-amber-500/20',
    description: 'Akses penuh tanpa batas: Keuangan, Core BGP, OLT, Gaji, Audit.',
    badgeText: 'FULL ACCESS',
  },
  {
    role: 'NOC',
    label: 'NOC Engineer',
    shortLabel: 'NOC Core',
    icon: Activity,
    activeClass: 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.35)]',
    inactiveClass: 'text-cyan-400/70 hover:text-cyan-200 hover:bg-cyan-500/10 border-cyan-500/20',
    description: 'Fokus Jaringan & Outage: MRTG 10G, BGP DDoS, Radar TR-069. (Finance terkunci).',
    badgeText: 'NETWORK',
  },
  {
    role: 'TECHNICIAN',
    label: 'Teknisi Lapangan',
    shortLabel: 'Teknisi',
    icon: Wrench,
    activeClass: 'bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-300 border-emerald-400/80 shadow-[0_0_18px_rgba(16,185,129,0.35)]',
    inactiveClass: 'text-emerald-400/70 hover:text-emerald-200 hover:bg-emerald-500/10 border-emerald-500/20',
    description: 'SPK Pasang Baru, Presensi GPS, Kalkulator OTDR, ODP. (Finance terkunci).',
    badgeText: 'FIELD OPS',
  },
  {
    role: 'BILLING',
    label: 'Billing & Kasir',
    shortLabel: 'Billing',
    icon: Wallet,
    activeClass: 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-300 border-purple-400/80 shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    inactiveClass: 'text-purple-400/70 hover:text-purple-200 hover:bg-purple-500/10 border-purple-500/20',
    description: 'Kasir, Invoice, Bayar QRIS, Tagihan Jatuh Tempo, Notifikasi WA.',
    badgeText: 'FINANCE OPS',
  },
  {
    role: 'CUSTOMER',
    label: 'Pelanggan Mandiri',
    shortLabel: 'Pelanggan',
    icon: UserIcon,
    activeClass: 'bg-gradient-to-r from-blue-500/25 to-indigo-500/25 text-blue-300 border-blue-400/80 shadow-[0_0_18px_rgba(59,130,246,0.35)]',
    inactiveClass: 'text-blue-400/70 hover:text-blue-200 hover:bg-blue-500/10 border-blue-500/20',
    description: 'Self-Care Portal: Cek Redaman Optik, Bayar QRIS, Speedtest, Live Chat CS.',
    badgeText: 'SELF-CARE',
  },
]

export default function RoleSwitcherBar() {
  const { user, switchRole } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isMinimized, setIsMinimized] = useState(false)

  const currentRole = (user?.role || 'ADMIN').toUpperCase() as UserRole
  const isSuperRole = currentRole === 'SUPERADMIN' || currentRole === 'OWNER' || currentRole === 'ADMIN'
  const activeRoleOption = isSuperRole ? ROLES[0] : (ROLES.find(r => r.role === currentRole) || ROLES[0])

  const handleSelectRole = (option: RoleOption) => {
    if (option.role === currentRole) return

    switchRole(option.role)

    // Route adaptation
    if (option.role === 'CUSTOMER') {
      if (!router.pathname.startsWith('/customer')) {
        router.push('/customer/dashboard')
      }
    } else {
      if (router.pathname.startsWith('/customer')) {
        router.push('/')
      }
    }

    toast.info(
      `Mode Aktif: [${option.label}] — ${option.description}`
    )
  }

  // If minimized, display a small floating pill at bottom-center
  if (isMinimized) {
    const Icon = activeRoleOption.icon
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] select-none animate-fade-in-smooth">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-cyan-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-cyan-400 transition-all cursor-pointer group"
          title="Klik untuk membuka Bilah Peran Penuh"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Icon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            Peran: <span className="text-cyan-300 font-bold">{activeRoleOption.shortLabel}</span>
          </span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded ml-1 font-mono">
            UBAH ▾
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] select-none max-w-[96vw] animate-fade-in-smooth">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/95 dark:bg-slate-950/95 text-white border border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl ring-1 ring-white/10">
        
        {/* Leading Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-200">SWITCHER:</span>
        </div>

        {/* 5 Prominent Quick Role Buttons - Directly Clickable ("Nempel Biar Enak Pencet-pencetnya") */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {ROLES.map((opt) => {
            const Icon = opt.icon
            const isSelected = isSuperRole ? opt.role === 'SUPERADMIN' : opt.role === currentRole

            return (
              <button
                key={opt.role}
                type="button"
                onClick={() => handleSelectRole(opt)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap active:scale-95',
                  isSelected
                    ? opt.activeClass
                    : opt.inactiveClass
                )}
                title={opt.description}
              >
                <Icon className={clsx('w-3.5 h-3.5', isSelected ? 'scale-110' : 'opacity-80')} />
                <span className="text-[11.5px] font-sans font-bold">{opt.shortLabel}</span>
                {isSelected && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            )
          })}
        </div>

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ml-0.5 cursor-pointer"
          title="Perkecil ke tombol pill"
          aria-label="Perkecil Switcher"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
