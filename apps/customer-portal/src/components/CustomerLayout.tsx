import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  CreditCard, 
  Headphones, 
  Settings, 
  LogOut,
  Menu,
  X,
  Wifi,
  Activity,
  TrendingUp,
  MessageCircle,
  Zap,
  Users,
  Award,
  Hash,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [customer, setCustomer] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const inetParam = router.query.inet as string | undefined;

  useEffect(() => {
    // Check if customer is logged in
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(customerData);
      setCustomer(parsed);

      const activeInet = parsed.internetNumber || parsed.id;
      // Security & sync check: If URL specifies an internet number that doesn't match the logged-in customer, redirect safely
      if (inetParam && inetParam !== activeInet && inetParam !== parsed.id) {
        const pathSegments = router.asPath.split('?')[0].split('/');
        const pageSegment = pathSegments[pathSegments.length - 1] || 'dashboard';
        router.replace(`/c/${activeInet}/${pageSegment}`);
      }
    } catch (e) {
      localStorage.removeItem('customer');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router, inetParam]);

  const handleLogout = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const inetIdentifier = customer?.internetNumber || customer?.id || 'NET-100234';
  const cPrefix = `/c/${inetIdentifier}`;

  const menuItems = [
    { name: 'Dashboard', icon: Home, slug: 'dashboard', href: `${cPrefix}/dashboard` },
    { name: 'Penggunaan', icon: Activity, slug: 'usage', href: `${cPrefix}/usage` },
    { name: 'Speed Test', icon: Zap, slug: 'speedtest', href: `${cPrefix}/speedtest` },
    { name: 'Tagihan', icon: FileText, slug: 'invoices', href: `${cPrefix}/invoices` },
    { name: 'Pembayaran', icon: CreditCard, slug: 'payments', href: `${cPrefix}/payments` },
    { name: 'Upgrade Paket', icon: TrendingUp, slug: 'upgrade', href: `${cPrefix}/upgrade` },
    { name: 'Referral', icon: Users, slug: 'referral', href: `${cPrefix}/referral` },
    { name: 'Loyalty Points', icon: Award, slug: 'loyalty', href: `${cPrefix}/loyalty` },
    { name: 'Live Chat', icon: MessageCircle, slug: 'chat', href: `${cPrefix}/chat` },
    { name: 'Tiket Support', icon: Headphones, slug: 'tickets', href: `${cPrefix}/tickets` },
    { name: 'Pengaturan', icon: Settings, slug: 'settings', href: `${cPrefix}/settings` },
  ];

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs tracking-wider font-semibold">Memverifikasi Akun Pelanggan AudiraNET...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-[#0c1322] border-b border-slate-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Wifi className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
              Audira<span className="text-cyan-500">NET</span>
            </span>
            <span className="block text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold -mt-0.5">
              {inetIdentifier}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-[#111a2e] text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg border border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-[#111a2e] text-slate-700 dark:text-gray-200"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0b1220] border-r border-slate-200 dark:border-gray-800 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-x-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-x-hidden">
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white rounded-xl shadow-sm flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-all">
                <Wifi className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight uppercase text-slate-950 dark:text-white leading-none">
                  Audira<span className="text-cyan-500">NET</span>
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-slate-500 dark:text-gray-400 uppercase mt-0.5">
                  Portal Pelanggan
                </span>
              </div>
            </Link>
          </div>

          {/* Customer Identifier Card */}
          <div className="p-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#070b14]/70 overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-gray-400 font-bold">
                NO. INTERNET (ID)
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-400/40 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(inetIdentifier);
                setCopiedId(true);
                setTimeout(() => setCopiedId(false), 2000);
              }}
              className="w-full px-2.5 py-1.5 rounded-md bg-white dark:bg-[#0e172a] border border-cyan-500/40 hover:border-cyan-500 shadow-sm flex items-center justify-between font-mono overflow-hidden text-left transition-colors group cursor-pointer"
              title={`Klik untuk menyalin: ${inetIdentifier}`}
            >
              <span className="font-bold text-xs text-cyan-600 dark:text-cyan-400 tracking-wider truncate mr-1.5 flex-1 min-w-0">
                {inetIdentifier.length > 18 
                  ? `${inetIdentifier.substring(0, 8)}...${inetIdentifier.substring(inetIdentifier.length - 4)}` 
                  : inetIdentifier}
              </span>
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Hash className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 shrink-0 transition-colors" />
              )}
            </button>

            <div className="mt-3 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{customer.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">{customer.email || customer.phone}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.asPath.includes(`/${item.slug}`) || router.pathname.includes(`/${item.slug}`);

              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-white dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-400/30 shadow-sm -translate-x-0.5'
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2 text-slate-500 dark:text-gray-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                </Link>
              );
            })}
          </nav>

          {/* Theme Switcher & Logout */}
          <div className="p-3 border-t border-slate-200 dark:border-gray-800 space-y-1.5">
            <button
              onClick={toggleTheme}
              title="Klik untuk beralih mode tema (Terang / Gelap)"
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-gray-800 bg-slate-100/70 dark:bg-slate-900/60 text-slate-800 dark:text-gray-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 stroke-2" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 stroke-2" />
                )}
                <span>{theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</span>
              </div>
              <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded shadow-sm ${
                theme === 'dark' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-cyan-500 text-white'
              }`}>
                {theme === 'dark' ? 'DARK' : 'LIGHT'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-2.5 w-full text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
