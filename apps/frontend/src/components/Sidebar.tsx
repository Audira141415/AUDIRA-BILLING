'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  LayoutDashboard, 
  TrendingUp,
  Package, 
  Users, 
  Server, 
  Activity, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Menu,
  LogOut,
  Receipt,
  CreditCard,
  MessageSquare,
  DollarSign,
  BarChart3,
  Ticket as TicketIcon,
  Cpu,
  Wifi,
  MapPin,
  Briefcase,
  Boxes,
  Wrench,
  ShieldCheck,
  Search,
  Radio,
  FileText,
  Zap,
  Globe,
  Sliders,
  Wallet,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'

export interface MenuItem {
  name: string
  href: string
  icon: any
  subItems?: { name: string; href: string; isNew?: boolean; isExternal?: boolean }[]
  roles?: string[]
}

export interface MenuGroup {
  groupName: string
  items: MenuItem[]
}

export const navigationGroups: MenuGroup[] = [
  // 1. RINGKASAN UTAMA
  {
    groupName: 'Ringkasan Utama',
    items: [
      { 
        name: 'Dashboard Overview', 
        href: '/', 
        icon: LayoutDashboard, 
        roles: ['ADMIN', 'BILLING', 'NOC', 'CS', 'TECHNICIAN'] 
      },
      { 
        name: 'Business Analytics', 
        href: '/analytics', 
        icon: TrendingUp, 
        roles: ['ADMIN', 'BILLING'] 
      },
    ]
  },

  // 2. BILLING & PELANGGAN
  {
    groupName: 'Billing & Pelanggan',
    items: [
      { 
        name: 'Customer CRM', 
        href: '/pelanggan', 
        icon: Users, 
        roles: ['ADMIN', 'BILLING', 'CS'],
        subItems: [
          { name: 'Semua Customer', href: '/pelanggan' },
          { name: 'Tambah Customer Baru', href: '/pelanggan/tambah' },
          { name: 'Customer Pending', href: '/pelanggan/pending' },
          { name: 'Customer Suspend (Isolir)', href: '/pelanggan/suspend' },
          { name: 'Customer Expired', href: '/pelanggan/expired' },
          { name: 'Import Data Customer', href: '/pelanggan/import' },
        ]
      },
      { 
        name: 'Paket & Speed Profile', 
        href: '/packages-admin', 
        icon: Package, 
        roles: ['ADMIN', 'BILLING', 'CS'],
        subItems: [
          { name: 'Katalog Paket Internet', href: '/packages-admin' },
          { name: 'Tambah Paket Baru', href: '/packages-admin/tambah' },
          { name: 'Kategori Paket', href: '/packages-admin/kategori' },
          { name: 'Speed Profile Mikrotik', href: '/packages-admin/speed' },
          { name: 'Promo & Diskon', href: '/packages-admin/promo' },
          { name: 'Paket Non-Aktif', href: '/packages-admin/non-aktif' },
          { name: 'Turbo Speed Booster', href: '/booster', isNew: true },
        ]
      },
      { 
        name: 'Billing & Invoice', 
        href: '/invoice', 
        icon: Receipt, 
        roles: ['ADMIN', 'BILLING', 'CS'],
        subItems: [
          { name: 'Dashboard Invoice', href: '/invoice' },
          { name: 'Semua Tagihan (Invoice)', href: '/invoice/semua' },
          { name: 'Generate Tagihan Otomatis', href: '/invoice/generate' },
          { name: 'Batch Generate Invoice', href: '/invoice/batch-generate' },
          { name: 'Invoice Jatuh Tempo', href: '/invoice/due' },
          { name: 'Invoice Menunggak (Overdue)', href: '/invoice/overdue' },
          { name: 'Batch Send WhatsApp', href: '/invoice/batch-send' },
          { name: '🤖 WhatsApp Billing Scheduler', href: '/whatsapp/billing-scheduler', isNew: true },
          { name: 'Riwayat Invoice', href: '/invoice/history' },
          { name: 'Template Invoice & PDF', href: '/invoice/templates' },
          { name: 'Pengaturan Billing', href: '/invoice/settings' },
        ]
      },
      { 
        name: 'Kasir & Pembayaran', 
        href: '/payment', 
        icon: CreditCard, 
        roles: ['ADMIN', 'BILLING'],
        subItems: [
          { name: 'Dashboard Pembayaran', href: '/payment' },
          { name: 'Semua Transaksi Masuk', href: '/transaksi' },
          { name: 'Kasir Kolektor Lapangan', href: '/kolektor', isNew: true },
          { name: 'Konfirmasi Manual', href: '/payment/confirmation' },
          { name: 'Metode Pembayaran & QRIS', href: '/payment/methods' },
          { name: 'Rekonsiliasi Bank & Kas', href: '/payment/reconciliation' },
          { name: 'Pengembalian Dana (Refunds)', href: '/payment/refunds' },
          { name: 'Riwayat Setoran Kas', href: '/payment/history' },
          { name: 'Pengaturan Kasir', href: '/payment/settings' },
        ]
      },
      { 
        name: 'Sales & Mitra Partner', 
        href: '/admin/sales', 
        icon: Briefcase, 
        roles: ['ADMIN', 'BILLING'],
        subItems: [
          { name: 'Dashboard Mitra & Reseller', href: '/admin/sales' },
          { name: 'Persetujuan Mitra Baru', href: '/admin/sales?tab=approval' },
          { name: 'Pencairan Komisi', href: '/admin/sales?tab=payout' },
          { name: 'Buku Kas & Ledger Komisi', href: '/admin/sales?tab=ledger' },
          { name: 'Registrasi Mitra Sales', href: '/sales/daftar', isNew: true },
          { name: 'Kemitraan Franchise', href: '/franchise' },
        ]
      },
      { 
        name: 'Keuangan & Akuntansi', 
        href: '/finance/dashboard', 
        icon: DollarSign, 
        roles: ['ADMIN', 'BILLING'],
        subItems: [
          { name: 'Dashboard Keuangan', href: '/finance/dashboard' },
          { name: 'Pendapatan Kas', href: '/finance/pendapatan' },
          { name: 'Pengeluaran Operasional', href: '/finance/pengeluaran' },
          { name: 'Laporan Arus Kas', href: '/finance/arus-kas' },
          { name: 'Laporan Laba Rugi', href: '/finance/laba-rugi' },
          { name: 'Neraca Keuangan', href: '/finance/neraca' },
          { name: 'Bagan Akun (Chart of Accounts)', href: '/finance/akun' },
          { name: 'Anggaran Belanja', href: '/finance/anggaran' },
          { name: 'Rekonsiliasi Bank', href: '/finance/rekonsiliasi' },
          { name: 'Pajak & PPN', href: '/finance/pajak', isNew: true },
        ]
      },
    ]
  },

  // 3. JARINGAN & INFRASTRUKTUR
  {
    groupName: 'Jaringan & Infrastruktur',
    items: [
      { 
        name: 'Infrastruktur Fiber & GIS', 
        href: '/infrastruktur/olt', 
        icon: MapPin, 
        roles: ['ADMIN', 'NOC', 'TECHNICIAN'],
        subItems: [
          { name: 'OLT & Zero-Touch ONU', href: '/infrastruktur/olt', isNew: true },
          { name: 'Kapasitas Port ODP', href: '/infrastruktur/odp' },
          { name: 'Peta Jaringan GIS (FTTH)', href: '/infrastruktur/map' },
        ]
      },
      { 
        name: 'Core Router & CPE', 
        href: '/mikrotik', 
        icon: Server, 
        roles: ['ADMIN', 'NOC'],
        subItems: [
          { name: 'Mikrotik PPPoE & Queue', href: '/mikrotik' },
          { name: 'Manajemen Layanan PPPoE', href: '/services-admin' },
          { name: 'GenieACS TR-069 Server', href: '/genieacs' },
          { name: 'Monitoring Status ONT Modem', href: '/modem-monitor' },
        ]
      },
      { 
        name: 'NOC & Outage Engine', 
        href: '/noc', 
        icon: Activity, 
        roles: ['ADMIN', 'NOC'],
        subItems: [
          { name: 'NOC Telegram Bot & Outage', href: '/noc', isNew: true },
          { name: 'Sync PPPoE & CoA Otomatis', href: '/automation?tab=sync' },
        ]
      },
      { 
        name: 'Hotspot Voucher Studio', 
        href: '/hotspot', 
        icon: Wifi, 
        roles: ['ADMIN', 'BILLING'],
        subItems: [
          { name: 'Studio & Stok Voucher', href: '/hotspot' },
          { name: 'Generate Voucher Massal', href: '/hotspot?action=generate' },
          { name: 'Cetak Template QR Barcode', href: '/hotspot?action=print' },
        ]
      },
    ]
  },

  // 4. OPERASIONAL & LAPANGAN
  {
    groupName: 'Operasional & Lapangan',
    items: [
      { 
        name: 'Helpdesk & Tiket CS', 
        href: '/tickets', 
        icon: TicketIcon, 
        roles: ['ADMIN', 'CS', 'TECHNICIAN'],
        subItems: [
          { name: 'Tiket Gangguan Pelanggan', href: '/tickets' },
          { name: 'Dukungan Operasional NOC', href: '/operational' },
        ]
      },
      { 
        name: 'Layanan Teknisi Lapangan', 
        href: '/field-service', 
        icon: Wrench, 
        roles: ['ADMIN', 'NOC', 'TECHNICIAN'],
        subItems: [
          { name: 'Surat Perintah Kerja (SPK)', href: '/field-service' },
          { name: 'Monitoring Lokasi Teknisi', href: '/technician-monitoring' },
          { name: 'Presensi Lapangan Teknisi', href: '/technician-checkin' },
        ]
      },
      { 
        name: 'Gudang & Inventaris', 
        href: '/inventory', 
        icon: Boxes, 
        roles: ['ADMIN', 'BILLING', 'TECHNICIAN'],
      },
      { 
        name: 'WhatsApp Automation', 
        href: '/whatsapp', 
        icon: MessageSquare, 
        roles: ['ADMIN', 'BILLING', 'CS'],
        subItems: [
          { name: 'Dashboard Gateway & Status', href: '/whatsapp' },
          { name: '🤖 Billing Scheduler (Fonnte)', href: '/whatsapp/billing-scheduler', isNew: true },
          { name: 'Broadcast & Campaign', href: '/whatsapp/campaigns' },
          { name: 'Template Pesan Interaktif', href: '/whatsapp/templates' },
          { name: 'Live Chat CS & Inbound', href: '/whatsapp/chat' },
          { name: 'Buku Kontak Pelanggan', href: '/whatsapp/contacts' },
          { name: 'Auto-Reply & Bot Rules', href: '/whatsapp/auto-reply' },
          { name: 'Quick Reply FAQ', href: '/whatsapp/quick-reply' },
          { name: 'Label Kontak Pelanggan', href: '/whatsapp/label' },
          { name: 'Laporan Delivery Pesan', href: '/whatsapp/reports' },
          { name: 'Pengaturan Gateway Fonnte', href: '/whatsapp/settings' },
        ]
      },
    ]
  },

  // 5. HRM & MANAJEMEN SDM
  {
    groupName: 'HRM & Karyawan',
    items: [
      { 
        name: 'Manajemen Karyawan', 
        href: '/hrm-dashboard', 
        icon: Users, 
        roles: ['ADMIN'],
        subItems: [
          { name: 'Dashboard HRM', href: '/hrm-dashboard' },
          { name: 'Daftar Karyawan & Teknisi', href: '/karyawan' },
          { name: 'Presensi & Absensi', href: '/attendance' },
          { name: 'Monitoring Kehadiran Realtime', href: '/attendance-monitoring' },
          { name: 'Jadwal Shift Kerja', href: '/jadwal-kerja' },
          { name: 'Pengajuan Cuti', href: '/cuti' },
          { name: 'Penggajian (Payroll)', href: '/gaji' },
          { name: 'Penilaian Kinerja (KPI)', href: '/kinerja' },
        ]
      },
    ]
  },

  // 6. LAPORAN & AUDIT
  {
    groupName: 'Laporan & Audit',
    items: [
      { 
        name: 'Pusat Laporan ISP', 
        href: '/reports', 
        icon: BarChart3, 
        roles: ['ADMIN', 'BILLING', 'CS'],
        subItems: [
          { name: 'Dashboard Ringkasan Laporan', href: '/reports' },
          { name: 'Laporan Pendapatan (Revenue)', href: '/reports/revenue' },
          { name: 'Laporan Pertumbuhan Customer', href: '/reports/customer' },
          { name: 'Laporan Tagihan & Piutang', href: '/reports/invoice' },
          { name: 'Laporan Pembayaran & Kas', href: '/reports/payment' },
          { name: 'Laporan Paket & Berlangganan', href: '/reports/package' },
          { name: 'Laporan Perpajakan PPN', href: '/reports/tax' },
          { name: 'Laporan Kinerja Sales & Komisi', href: '/reports/sales' },
          { name: 'Laporan Campaign WhatsApp', href: '/reports/whatsapp' },
          { name: 'Laporan Eksekutif Bulanan', href: '/reports/executive' },
        ]
      },
    ]
  },

  // 7. SISTEM & KONFIGURASI
  {
    groupName: 'Sistem & Konfigurasi',
    items: [
      { 
        name: 'Pengaturan Sistem', 
        href: '/pengaturan', 
        icon: Settings, 
        roles: ['ADMIN', 'BILLING', 'NOC', 'CS', 'TECHNICIAN'],
        subItems: [
          { name: 'Pengaturan Umum Perusahaan', href: '/pengaturan' },
          { name: 'Backup & Restore Database', href: '/backup' },
          { name: 'Audit Log Aktivitas Admin', href: '/audit-logs' },
          { name: 'Dokumentasi Sistem', href: '/dokumentasi' },
          { name: 'Test & Diagnostik API', href: '/debug/test-api' },
        ]
      },
    ]
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-expand menu item if user is browsing any of its subItems
  useEffect(() => {
    if (!isMounted) return
    const activeIts: string[] = []

    navigationGroups.forEach(group => {
      group.items.forEach(item => {
        const isItActive = 
          router.pathname === item.href ||
          (item.subItems && item.subItems.some(sub => {
            if (sub.href.includes('?')) {
              return router.asPath === sub.href
            }
            return router.pathname === sub.href
          }))

        if (isItActive && item.subItems && item.subItems.length > 0) {
          activeIts.push(item.name)
        }
      })
    })

    setExpandedItems(prev => Array.from(new Set([...prev, ...activeIts])))
  }, [router.pathname, router.asPath, isMounted])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (!isMounted) return false
    if (href.includes('?')) {
      return router.asPath === href
    }
    return router.pathname === href && !router.asPath.includes('?')
  }

  const isParentActive = (item: MenuItem) => {
    if (!isMounted) return false
    if (router.pathname === item.href) return true
    if (item.subItems) {
      return item.subItems.some(sub => {
        if (sub.href.includes('?')) {
          return router.asPath === sub.href
        }
        return router.pathname === sub.href
      })
    }
    return false
  }

  // Filter groups and items based on role and search query
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return navigationGroups.map(group => {
      const roleFilteredItems = group.items.filter(item => {
        if (!user) return true
        return item.roles.some(role => role.toUpperCase() === user.role.toUpperCase())
      })

      if (!query) {
        return {
          ...group,
          items: roleFilteredItems
        }
      }

      const searchedItems = roleFilteredItems.filter(item => {
        const matchItem = item.name.toLowerCase().includes(query)
        const matchSub = item.subItems && item.subItems.some(sub => sub.name.toLowerCase().includes(query))
        return matchItem || matchSub
      })

      return {
        ...group,
        items: searchedItems
      }
    }).filter(group => group.items.length > 0)
  }, [user, searchQuery])

  // When searching, auto-expand items that match
  useEffect(() => {
    if (searchQuery.trim()) {
      const matchedNames: string[] = []
      filteredGroups.forEach(g => {
        g.items.forEach(item => {
          if (item.subItems && item.subItems.length > 0) {
            matchedNames.push(item.name)
          }
        })
      })
      setExpandedItems(matchedNames)
    }
  }, [searchQuery, filteredGroups])

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-[var(--app-surface)] text-[var(--app-text)] hover:text-[var(--app-primary)] rounded-lg shadow-md border border-[var(--app-border)] transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container - Adaptive Theme */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen bg-[var(--app-surface)] border-r border-[var(--app-border)] shadow-sm transition-all duration-200 z-40 flex flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-72'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[var(--app-border)] flex-shrink-0 flex items-center justify-between bg-[var(--app-surface)]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8.5 h-8.5 rounded-lg bg-[var(--app-primary)] flex items-center justify-center text-[var(--app-primary-text)] font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Server className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-[var(--app-text)] font-heading">
                  AUDIRA<span className="text-[var(--app-primary)]">NET</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--app-primary-soft)] text-[var(--app-primary)] border border-[var(--app-primary-border)] font-semibold leading-none">
                  ERP
                </span>
              </div>
              <p className="text-[11px] text-[var(--app-text-muted)] font-medium tracking-tight mt-0.5">ISP Management Suite</p>
            </div>
          </Link>
        </div>

        {/* Quick Search */}
        <div className="px-3.5 pt-3 pb-1.5 flex-shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--app-text-dim)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari modul atau menu..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-7 py-1.5 bg-[var(--app-card-subtle)] border border-[var(--app-border)] focus:bg-[var(--app-surface)] focus:border-[var(--app-primary)] focus:ring-1 focus:ring-[var(--app-primary)] rounded-lg text-xs text-[var(--app-text)] placeholder-[var(--app-text-dim)] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Groups List */}
        <nav className="py-2.5 px-3 flex-1 overflow-y-auto space-y-4 scrollbar-thin scroll-smooth">
          {filteredGroups.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--app-text-dim)]">
              Menu tidak ditemukan.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.groupName} className="space-y-0.5">
                {/* Group Category Header */}
                <div className="px-2 pt-3 pb-1 text-[10.5px] font-bold tracking-wider text-[var(--app-text-dim)] uppercase flex items-center justify-between">
                  <span className="truncate pr-2">{group.groupName}</span>
                  <span className="text-[10px] font-mono text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded-full font-semibold border border-[var(--app-border)] flex-shrink-0">
                    {group.items.length}
                  </span>
                </div>

                {/* Items in this group */}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const hasSubItems = item.subItems && item.subItems.length > 0
                    const isExpanded = expandedItems.includes(item.name)
                    const active = isParentActive(item)

                    return (
                      <li key={item.name}>
                        <button
                          type="button"
                          className={clsx(
                            'group w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 ease-out text-left cursor-pointer border select-none',
                            active
                              ? 'bg-[var(--app-primary-soft)] text-[var(--app-primary)] border-[var(--app-primary-border)] font-semibold shadow-xs'
                              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)] hover:text-[var(--app-text)] hover:border-[var(--app-border)] border-transparent'
                          )}
                          onMouseEnter={() => {
                            if (item.href && router.asPath !== item.href) {
                              router.prefetch(item.href)
                            }
                          }}
                          onClick={() => {
                            if (hasSubItems) {
                              if (!expandedItems.includes(item.name)) {
                                setExpandedItems(prev => [...prev, item.name])
                              }
                            }
                            if (item.href && router.asPath !== item.href && router.pathname !== item.href) {
                              router.push(item.href)
                              setIsMobileOpen(false)
                            }
                          }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-1">
                            <Icon 
                              size={16} 
                              className={clsx(
                                'transition-colors duration-150 flex-shrink-0',
                                active ? 'text-[var(--app-primary)]' : 'text-[var(--app-text-dim)] group-hover:text-[var(--app-text)]'
                              )} 
                            />
                            <span className="truncate text-xs font-medium tracking-tight" title={item.name}>{item.name}</span>
                          </div>
                          {hasSubItems && (
                            <div 
                              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[var(--app-text-dim)] group-hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors -mr-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExpanded(item.name)
                              }}
                              title="Buka/Tutup Submenu"
                            >
                              <ChevronRight
                                size={14}
                                className={clsx(
                                  'transition-transform duration-200 transform',
                                  isExpanded
                                    ? 'rotate-90 text-[var(--app-primary)]'
                                    : 'rotate-0'
                                )}
                              />
                            </div>
                          )}
                        </button>

                        {/* Sub Items (Smooth Accordion Grid) */}
                        {hasSubItems && (
                          <div
                            className={clsx(
                              'grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                              isExpanded
                                ? 'grid-rows-[1fr] opacity-100 mt-1'
                                : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                            )}
                          >
                            <div className="overflow-hidden">
                              <ul className="ml-3.5 space-y-0.5 border-l-2 border-[var(--app-border)] pl-2.5 py-1 my-0.5">
                                {item.subItems!.map((subItem) => {
                                  const isSubActive = isActive(subItem.href)
                                  return (
                                    <li key={subItem.name}>
                                      <Link
                                        href={subItem.href}
                                        title={subItem.name}
                                        target={subItem.isExternal ? '_blank' : undefined}
                                        rel={subItem.isExternal ? 'noopener noreferrer' : undefined}
                                        className={clsx(
                                          'group/sub flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors',
                                          isSubActive
                                            ? 'bg-[var(--app-primary-soft)] text-[var(--app-primary)] font-semibold shadow-xs'
                                            : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-subtle)]'
                                        )}
                                        onMouseEnter={() => {
                                          if (!subItem.isExternal && subItem.href && router.asPath !== subItem.href) {
                                            router.prefetch(subItem.href)
                                          }
                                        }}
                                        onClick={() => {
                                          if (!subItem.isExternal) setIsMobileOpen(false)
                                        }}
                                      >
                                        <div className="flex items-center gap-2 min-w-0 flex-1 mr-1.5">
                                          <span
                                            className={clsx(
                                              'w-1.5 h-1.5 rounded-full transition-all flex-shrink-0',
                                              isSubActive
                                                ? 'bg-[var(--app-primary)] ring-2 ring-[var(--app-primary-soft)]'
                                                : 'bg-[var(--app-border-strong)] group-hover/sub:bg-[var(--app-text-dim)]'
                                            )}
                                          />
                                          <span className="truncate">{subItem.name}</span>
                                          {subItem.isExternal && (
                                            <ExternalLink className="w-3 h-3 text-[var(--app-text-dim)] flex-shrink-0" />
                                          )}
                                        </div>
                                        {subItem.isNew && (
                                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 leading-none flex-shrink-0 ml-1.5">
                                            BARU
                                          </span>
                                        )}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </nav>

        {/* Theme Mode Toggle (Enterprise Minimalist) */}
        <div className="px-3.5 py-2.5 border-t border-[var(--app-border)] flex items-center justify-between bg-[var(--app-card-subtle)] flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-medium">
            {resolvedTheme === 'dark' ? (
              <Moon size={14} className="text-blue-400" />
            ) : (
              <Sun size={14} className="text-amber-500" />
            )}
            <span className="text-xs">{resolvedTheme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            title={resolvedTheme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            aria-label="Toggle theme mode"
          >
            {resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* User Footer Card */}
        <div className="p-3 pb-4 border-t border-[var(--app-border)] flex-shrink-0 bg-[var(--app-surface)]">
          {user && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--app-card-subtle)] border border-[var(--app-border)] shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                <div className="w-7 h-7 rounded-md bg-[var(--app-primary)] flex items-center justify-center text-xs font-bold text-[var(--app-primary-text)] flex-shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[var(--app-text)] truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                    <span className="text-[10px] text-[var(--app-text-dim)] font-medium uppercase tracking-wider truncate">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Keluar"
                className="p-1.5 text-[var(--app-text-dim)] hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
          
          <div className="text-[10px] text-[var(--app-text-dim)] mt-2 text-center font-mono tracking-wider select-none">
            AUDIRA NET & BILLING • v3.4
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
