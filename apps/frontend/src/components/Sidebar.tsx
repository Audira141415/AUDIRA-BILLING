'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
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
  Target,
  Ticket as TicketIcon,
  Cpu
} from 'lucide-react'
import clsx from 'clsx'

interface MenuItem {
  name: string
  href: string
  icon: any
  subItems?: { name: string; href: string; isNew?: boolean }[]
  roles?: string[]
}

const menuItems: MenuItem[] = [
  // Dashboard
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'BILLING', 'NOC', 'CS', 'TECHNICIAN'] },
  
  // Customer
  { 
    name: 'Customer', 
    href: '/pelanggan', 
    icon: Users, 
    roles: ['ADMIN', 'BILLING', 'CS'],
    subItems: [
      { name: 'Semua Customer', href: '/pelanggan' },
      { name: 'Tambah Customer', href: '/pelanggan/tambah' },
      { name: 'Import Customer', href: '/pelanggan/import' },
      { name: 'Customer Pending', href: '/pelanggan/pending' },
      { name: 'Customer Suspend', href: '/pelanggan/suspend' },
      { name: 'Customer Expired', href: '/pelanggan/expired' },
    ]
  },

  // Package
  { 
    name: 'Package', 
    href: '/packages-admin', 
    icon: Package, 
    roles: ['ADMIN', 'BILLING', 'CS'],
    subItems: [
      { name: 'Semua Package', href: '/packages-admin' },
      { name: 'Tambah Package', href: '/packages-admin/tambah' },
      { name: 'Kategori Package', href: '/packages-admin/kategori' },
      { name: 'Speed Profile', href: '/packages-admin/speed' },
      { name: 'Promo Package', href: '/packages-admin/promo' },
      { name: 'Paket Non Aktif', href: '/packages-admin/non-aktif' },
    ]
  },
  
  // Invoice
  { 
    name: 'Invoice', 
    href: '/invoice', 
    icon: Receipt, 
    roles: ['ADMIN', 'BILLING', 'CS'],
    subItems: [
      { name: 'Dashboard Invoice', href: '/invoice' },
      { name: 'Semua Invoice', href: '/invoice/semua' },
      { name: 'Generate Invoice', href: '/invoice/generate' },
      { name: 'Draft Invoice', href: '/invoice/draft' },
      { name: 'Invoice Berulang', href: '/invoice/recurring' },
      { name: 'Invoice Jatuh Tempo', href: '/invoice/due' },
      { name: 'Invoice Overdue', href: '/invoice/overdue' },
      { name: 'Credit Note', href: '/invoice/credit-note' },
      { name: 'Refund', href: '/invoice/refund' },
      { name: 'Template Invoice', href: '/invoice/templates' },
      { name: 'Pajak & PPN', href: '/invoice/tax' },
      { name: 'Reminder Invoice', href: '/invoice?action=remind' },
      { name: 'Batch Generate', href: '/invoice/batch-generate' },
      { name: 'Batch Send', href: '/invoice/batch-send' },
      { name: 'Riwayat Invoice', href: '/invoice/history' },
      { name: 'Export Invoice', href: '/invoice/export' },
      { name: 'Pengaturan Invoice', href: '/invoice/settings' }
    ]
  },

  { 
    name: 'Payment', 
    href: '/payment', 
    icon: CreditCard, 
    roles: ['ADMIN', 'BILLING'],
    subItems: [
      { name: 'Dashboard Payment', href: '/payment' },
      { name: 'Semua Pembayaran', href: '/transaksi' },
      { name: 'Konfirmasi Manual', href: '/payment/confirmation' },
      { name: 'Metode Pembayaran', href: '/payment/methods' },
      { name: 'Rekonsiliasi', href: '/payment/reconciliation' },
      { name: 'Refund & Void', href: '/payment/refunds' },
      { name: 'Riwayat Payment', href: '/payment/history' },
      { name: 'Pengaturan Payment', href: '/payment/settings' },
    ]
  },

  { 
    name: 'WhatsApp', 
    href: '/whatsapp', 
    icon: MessageSquare, 
    roles: ['ADMIN', 'BILLING', 'CS'],
    subItems: [
      { name: 'Dashboard', href: '/whatsapp' },
      { name: 'Kontak', href: '/whatsapp/contacts' },
      { name: 'Campaign', href: '/whatsapp/campaigns' },
      { name: 'Template Pesan', href: '/whatsapp/templates' },
      { name: 'Quick Reply', href: '/whatsapp/quick-reply' },
      { name: 'Chat', href: '/whatsapp/chat' },
      { name: 'Auto Reply', href: '/whatsapp/auto-reply' },
      { name: 'Label', href: '/whatsapp/label' },
      { name: 'Laporan', href: '/whatsapp/reports' },
      { name: 'Pengaturan', href: '/whatsapp/settings' },
    ]
  },

  // Finance
  { 
    name: 'Finance', 
    href: '/finance/dashboard', 
    icon: DollarSign, 
    roles: ['ADMIN', 'BILLING'],
    subItems: [
      { name: 'Dashboard', href: '/finance/dashboard' },
      { name: 'Pendapatan', href: '/finance/pendapatan' },
      { name: 'Pengeluaran', href: '/finance/pengeluaran' },
      { name: 'Arus Kas', href: '/finance/arus-kas' },
      { name: 'Laba Rugi', href: '/finance/laba-rugi' },
      { name: 'Neraca', href: '/finance/neraca' },
      { name: 'Transaksi', href: '/finance/transaksi' },
      { name: 'Akun', href: '/finance/akun' },
      { name: 'Anggaran', href: '/finance/anggaran' },
      { name: 'Pajak', href: '/finance/pajak', isNew: true },
      { name: 'Laporan Keuangan', href: '/finance/laporan', isNew: true },
      { name: 'Rekonsiliasi', href: '/finance/rekonsiliasi', isNew: true },
      { name: 'Pengaturan Finance', href: '/finance/settings', isNew: true }
    ]
  },

  // Reports
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart3, 
    roles: ['ADMIN', 'BILLING', 'CS'],
    subItems: [
      { name: 'Dashboard Report', href: '/reports' },
      { name: 'Executive Summary', href: '/reports/executive' },
      { name: 'Customer Report', href: '/reports/customer' },
      { name: 'Revenue Report', href: '/reports/revenue' },
      { name: 'Invoice Report', href: '/reports/invoice' },
      { name: 'Payment Report', href: '/reports/payment' },
      { name: 'Subscription Report', href: '/reports/subscription' },
      { name: 'Package Report', href: '/reports/package' },
      { name: 'Sales Report', href: '/reports/sales' },
      { name: 'Marketing Report', href: '/reports/marketing' },
      { name: 'WhatsApp Report', href: '/reports/whatsapp' },
      { name: 'Tax Report', href: '/reports/tax' },
      { name: 'Finance Report', href: '/reports/finance' },
      { name: 'Aging Report', href: '/reports?tab=aging' },
      { name: 'Churn Report', href: '/reports?tab=churn' },
      { name: 'Collection Report', href: '/reports?tab=collection' },
      { name: 'KPI Report', href: '/reports?tab=kpi' },
      { name: 'Scheduled Report', href: '/reports?tab=scheduled' },
      { name: 'Report Builder', href: '/reports?tab=builder' },
      { name: 'Export Center', href: '/reports?tab=export' },
      { name: 'Report Archive', href: '/reports?tab=archive' },
      { name: 'Report Settings', href: '/reports?tab=settings' },
    ]
  },

  // CRM
  { 
    name: 'CRM', 
    href: '/crm', 
    icon: Target, 
    roles: ['ADMIN', 'BILLING', 'CS'],
    subItems: [
      { name: 'Follow Up', href: '/crm?tab=followup' },
    ]
  },

  // Ticket
  { 
    name: 'Ticket', 
    href: '/tickets', 
    icon: TicketIcon, 
    roles: ['ADMIN', 'CS', 'TECHNICIAN'],
    subItems: [
      { name: 'Semua Ticket', href: '/tickets' },
      { name: 'Operational Support', href: '/operational' },
    ]
  },

  // Automation
  { 
    name: 'Automation', 
    href: '/automation', 
    icon: Cpu, 
    roles: ['ADMIN'],
    subItems: [
      { name: 'Sync Mikrotik', href: '/automation?tab=sync' },
    ]
  },

  // Settings
  { 
    name: 'Settings', 
    href: '/pengaturan', 
    icon: Settings, 
    roles: ['ADMIN', 'BILLING', 'NOC', 'CS', 'TECHNICIAN'],
    subItems: [
      { name: 'Pengaturan Umum', href: '/pengaturan' },
      { name: 'Backup Database', href: '/backup' },
      { name: 'Audit Logs', href: '/audit-logs' },
      { name: '🔧 Test API', href: '/debug/test-api' },
    ]
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // Guard to prevent SSR/CSR hydration mismatch on active-state calculations
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-expand menu item if user is browsing any of its subItems
  useEffect(() => {
    if (!isMounted) return
    const activeIts: string[] = []

    menuItems.forEach(item => {
      const isItActive = router.pathname === item.href || (item.subItems && item.subItems.some(sub => router.pathname === sub.href))
      if (isItActive && item.subItems && item.subItems.length > 0) {
        activeIts.push(item.name)
      }
    })

    setExpandedItems(prev => Array.from(new Set([...prev, ...activeIts])))
  }, [router.pathname, isMounted])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  // Only compute active state on client to avoid SSR/CSR mismatch
  const isActive = (href: string) => {
    if (!isMounted) return false
    return router.pathname === href
  }

  const isParentActive = (item: MenuItem) => {
    if (!isMounted) return false
    if (isActive(item.href)) return true
    if (item.subItems) {
      return item.subItems.some(sub => isActive(sub.href))
    }
    return false
  }

  // Filter items based on user role
  const filteredItems = menuItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true
    if (!user) return false
    return item.roles.some(role => role.toUpperCase() === user.role.toUpperCase())
  })

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0d1527] text-white rounded-lg shadow-lg border border-[#1e293b]"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen bg-[#070c19] border-r border-[#131d35] shadow-2xl transition-transform duration-300 z-40 flex flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-64'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#131d35] flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transform -rotate-12 shadow-lg">
              <div className="w-6 h-6 border-2 border-white rounded transform rotate-12"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white tracking-wide">AudiraNET</h1>
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ISP Billing System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-1.5">
            {filteredItems.map((item) => {
              const Icon = item.icon
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isExpanded = expandedItems.includes(item.name)
              const active = isParentActive(item)

              return (
                <li key={item.name}>
                  <div
                    className={clsx(
                      'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer border border-transparent',
                      active
                        ? 'bg-[#0052cc] text-white shadow-lg shadow-blue-900/10 font-bold'
                        : 'text-gray-400 hover:bg-[#121c38]/40 hover:text-white'
                    )}
                    onClick={() => {
                      if (hasSubItems) {
                        toggleExpanded(item.name)
                      } else {
                        router.push(item.href)
                        setIsMobileOpen(false)
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon size={15} />
                      <span>{item.name}</span>
                    </div>
                    {hasSubItems && (
                      <div>
                        {isExpanded ? (
                          <ChevronDown size={13} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={13} className="text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub Items */}
                  {hasSubItems && isExpanded && (
                    <ul className="mt-1 ml-4 space-y-0.5 border-l border-[#131d35] pl-2">
                      {item.subItems!.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={clsx(
                              'block rounded-lg px-3 py-1.5 text-[11px] transition-all font-medium',
                              isActive(subItem.href)
                                ? 'bg-blue-500/10 text-blue-400 font-bold border-l-2 border-blue-500 pl-2.5'
                                : 'text-gray-500 hover:text-gray-300 hover:pl-1 pl-2.5'
                            )}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{subItem.name}</span>
                              {subItem.isNew && (
                                <span className="text-[8px] bg-blue-600 text-white font-extrabold px-1 py-0.5 rounded leading-none scale-90">
                                  NEW
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Total Customer Stats Widget */}
        <div className="p-4 border-t border-[#131d35] space-y-3.5 flex-shrink-0 bg-[#080d19]/40">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <span>Total Customer</span>
            </div>
            <div className="text-lg font-black text-white">3,248</div>
            <div className="w-full bg-[#101935] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-[#0052cc] h-full rounded-full" style={{ width: '84%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 font-bold mt-1">
              <span>Aktif</span>
              <span>84%</span>
            </div>
          </div>
          
          <hr className="border-[#131d35]" />

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{user.role}</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-all border border-[#131d35] hover:border-red-500/20"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
          
          <div className="text-[9px] text-gray-600 mt-2 text-center">
            © 2026 AudiraNET. All rights reserved.
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
