import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  Award
} from 'lucide-react';

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if customer is logged in
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/');
    } else {
      setCustomer(JSON.parse(customerData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('token');
    router.push('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Penggunaan', icon: Activity, href: '/usage' },
    { name: 'Speed Test', icon: Zap, href: '/speedtest' },
    { name: 'Tagihan', icon: FileText, href: '/invoices' },
    { name: 'Pembayaran', icon: CreditCard, href: '/payments' },
    { name: 'Upgrade Paket', icon: TrendingUp, href: '/upgrade' },
    { name: 'Referral', icon: Users, href: '/referral' },
    { name: 'Loyalty Points', icon: Award, href: '/loyalty' },
    { name: 'Live Chat', icon: MessageCircle, href: '/chat' },
    { name: 'Tiket Support', icon: Headphones, href: '/tickets' },
    { name: 'Pengaturan', icon: Settings, href: '/settings' },
  ];

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900">AudiraNET</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AudiraNET</h1>
              <p className="text-xs text-gray-500">Portal Pelanggan</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-4 border-b bg-blue-50">
            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
            <p className="text-xs text-gray-600">{customer.email}</p>
            <p className="text-xs text-gray-600">{customer.phone}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
              customer.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {customer.status === 'active' ? 'Aktif' : 'Suspended'}
            </span>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
