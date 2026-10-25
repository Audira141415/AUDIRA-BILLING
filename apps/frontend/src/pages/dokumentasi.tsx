import Link from 'next/link';
import { useState } from 'react'
import Layout from '@/components/Layout'
import { 
  BookOpen, Search, ChevronRight, Code, Terminal, Database, 
  Zap, FileText, Globe, Lock, Users, Settings, HelpCircle,
  ExternalLink, Copy, Check
} from 'lucide-react'

interface DocSection {
  id: string
  title: string
  icon: any
  subsections: {
    id: string
    title: string
    content: string
    code?: string
  }[]
}

export default function Dokumentasi() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [activeSubsection, setActiveSubsection] = useState('intro')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      subsections: [
        {
          id: 'intro',
          title: 'Pengenalan',
          content: `AudiraNET adalah platform manajemen ISP (Internet Service Provider) yang lengkap dan profesional. Platform ini membantu Anda mengelola:

• MikroTik Router & PPPoE Users
• Customer Management & CRM
• Billing & Invoicing otomatis
• Ticketing System
• Network Infrastructure
• Financial Reports

Platform ini dibangun dengan teknologi modern: Next.js, NestJS, PostgreSQL, dan Prisma ORM.`
        },
        {
          id: 'installation',
          title: 'Instalasi',
          content: 'Ikuti langkah-langkah berikut untuk setup AudiraNET:',
          code: `# 1. Clone repository
git clone https://github.com/yourrepo/audiranet.git
cd audiranet

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env

# 4. Setup database
docker-compose up -d
pnpm prisma migrate deploy

# 5. Run development server
pnpm dev

# Frontend: http://localhost:3000
# Backend: http://localhost:4000`
        },
        {
          id: 'first-steps',
          title: 'Langkah Pertama',
          content: `Setelah instalasi selesai:

1. Buka http://localhost:3000
2. Register akun admin pertama
3. Login dengan kredensial yang dibuat
4. Konfigurasi router MikroTik di menu MikroTik
5. Tambahkan paket internet di menu Paket
6. Mulai tambahkan customer pertama Anda!`
        }
      ]
    },
    {
      id: 'api',
      title: 'API Documentation',
      icon: Code,
      subsections: [
        {
          id: 'authentication',
          title: 'Authentication',
          content: 'AudiraNET menggunakan JWT (JSON Web Token) untuk autentikasi. Token berlaku selama 7 hari.',
          code: `// Register
POST http://localhost:4000/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@audiranet.com",
  "password": "password123"
}

// Login
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "email": "admin@audiranet.com",
  "password": "password123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@audiranet.com"
  }
}`
        },
        {
          id: 'mikrotik-api',
          title: 'MikroTik API',
          content: 'Endpoints untuk mengelola router MikroTik:',
          code: `// Get all routers
GET http://localhost:4000/mikrotik

// Get single router
GET http://localhost:4000/mikrotik/:id

// Create router
POST http://localhost:4000/mikrotik
{
  "name": "MT-Central",
  "host": "192.168.1.1",
  "port": 8728,
  "username": "admin",
  "password": "password",
  "location": "Kantor Pusat"
}

// Test connection
POST http://localhost:4000/mikrotik/:id/test-connection

// Update router
PUT http://localhost:4000/mikrotik/:id

// Delete router
DELETE http://localhost:4000/mikrotik/:id`
        },
        {
          id: 'customer-api',
          title: 'Customer API',
          content: 'Endpoints untuk mengelola pelanggan:',
          code: `// Get all customers
GET http://localhost:4000/pelanggan

// Get customer stats
GET http://localhost:4000/pelanggan/stats

// Create customer
POST http://localhost:4000/pelanggan
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jl. Merdeka No. 123",
  "packageId": "package-uuid"
}

// Update customer
PUT http://localhost:4000/pelanggan/:id

// Delete customer
DELETE http://localhost:4000/pelanggan/:id`
        },
        {
          id: 'billing-api',
          title: 'Billing API',
          content: 'Endpoints untuk invoice dan pembayaran:',
          code: `// Get invoices
GET http://localhost:4000/keuangan/invoices

// Create invoice
POST http://localhost:4000/keuangan/invoices
{
  "customerId": "customer-uuid",
  "amount": 500000,
  "dueDate": "2024-12-31",
  "description": "Tagihan Bulan Desember"
}

// Process payment
POST http://localhost:4000/keuangan/payments
{
  "invoiceId": "invoice-uuid",
  "amount": 500000,
  "paymentMethod": "transfer",
  "paymentDate": "2024-12-01"
}

// Get financial stats
GET http://localhost:4000/keuangan/stats`
        }
      ]
    },
    {
      id: 'mikrotik',
      title: 'MikroTik Integration',
      icon: Globe,
      subsections: [
        {
          id: 'setup-mikrotik',
          title: 'Setup MikroTik',
          content: 'Konfigurasi router MikroTik untuk integrasi dengan AudiraNET:',
          code: `# 1. Enable MikroTik API
/ip service
set api address=0.0.0.0/0 disabled=no port=8728

# 2. Create API user
/user add name=audiranet password=SecurePassword123 \\
  group=full comment="AudiraNET API User"

# 3. Setup PPPoE Server
/interface bridge add name=bridge-local
/ip pool add name=pppoe-pool ranges=10.10.10.2-10.10.10.254
/ppp profile add name=default local-address=10.10.10.1 \\
  remote-address=pppoe-pool rate-limit=10M/10M

# 4. Enable PPPoE Server
/interface pppoe-server server
add disabled=no interface=bridge-local service-name=audiranet`
        },
        {
          id: 'pppoe-management',
          title: 'PPPoE User Management',
          content: `Mengelola PPPoE users melalui AudiraNET:

1. Buka menu MikroTik > PPPoE Users
2. Klik "Add User" untuk menambahkan user baru
3. Pilih profile (paket kecepatan)
4. System akan otomatis create secret di MikroTik
5. Customer bisa langsung login dengan username/password

Fitur tersedia:
• Enable/Disable user
• Kick active session
• Change password
• Update profile/speed
• Monitor bandwidth usage
• Session history`
        },
        {
          id: 'hotspot',
          title: 'Hotspot Management',
          content: `Setup Hotspot di MikroTik:`,
          code: `# Setup Hotspot
/ip hotspot setup

# Generate voucher via AudiraNET:
1. Menu MikroTik > Hotspot
2. Klik "Generate Voucher"
3. Pilih template (speed, validity, price)
4. Generate bulk (10, 50, 100 voucher)
5. Print voucher dengan QR code
6. Jual ke customer

Voucher otomatis tersync dengan MikroTik.`
        }
      ]
    },
    {
      id: 'database',
      title: 'Database Schema',
      icon: Database,
      subsections: [
        {
          id: 'models',
          title: 'Database Models',
          content: `AudiraNET menggunakan Prisma ORM dengan 12 models:

1. User - User authentication & roles
2. Customer - Data pelanggan
3. Package - Paket internet
4. Transaction - Riwayat transaksi
5. Mikrotik - Router management
6. GenieAcsDevice - TR-069 CPE
7. Service - Layanan pelanggan
8. Invoice - Tagihan
9. Payment - Pembayaran
10. Ticket - Sistem tiket
11. Technician - Data teknisi
12. ODP - Optical Distribution Point
13. NetworkDevice - Perangkat jaringan`,
          code: `// Example: Customer Model
model Customer {
  id          String    @id @default(uuid())
  name        String
  email       String    @unique
  phone       String
  address     String
  packageId   String
  package     Package   @relation(fields: [packageId], references: [id])
  status      String    // active, suspended, inactive
  balance     Float     @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  invoices    Invoice[]
  services    Service[]
  tickets     Ticket[]
}`
        },
        {
          id: 'migrations',
          title: 'Database Migrations',
          content: 'Menjalankan migrations:',
          code: `# Create new migration
pnpm prisma migrate dev --name add_new_feature

# Apply migrations to production
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset

# Generate Prisma Client
pnpm prisma generate

# Open Prisma Studio (database GUI)
pnpm prisma studio`
        }
      ]
    },
    {
      id: 'features',
      title: 'Fitur Lengkap',
      icon: Settings,
      subsections: [
        {
          id: 'billing',
          title: 'Auto Billing',
          content: `Sistem billing otomatis AudiraNET:

1. Auto-generate invoice setiap tanggal 1
2. Auto-send invoice via email & WhatsApp
3. Payment reminder H-3, H-1, H+1
4. Auto-suspend jika telat 3 hari
5. Auto-unsuspend setelah bayar
6. Denda keterlambatan otomatis
7. Recurring billing bulanan

Konfigurasi:
• Menu Pengaturan > Billing
• Set tanggal generate invoice
• Set grace period (hari toleransi)
• Set late fee (denda)
• Setup payment gateway`
        },
        {
          id: 'notifications',
          title: 'Notifications',
          content: `Multi-channel notifications:

Email:
• Invoice notification
• Payment confirmation
• Service activation/suspension
• Ticket updates

WhatsApp:
• Payment reminder
• Invoice link
• Ticket status update
• Promotional messages

SMS:
• Critical alerts
• OTP verification

Setup di Menu Pengaturan > Notifications.`
        },
        {
          id: 'reports',
          title: 'Reports & Analytics',
          content: `Dashboard & Reports tersedia:

Dashboard:
• Total revenue (today, month, year)
• Active customers
• Pending invoices
• Open tickets
• Network status

Reports:
• Revenue report (daily/monthly/yearly)
• Customer growth
• Churn rate
• Collection rate
• Technician performance
• Network uptime

Export: PDF, Excel, CSV`
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      subsections: [
        {
          id: 'common-issues',
          title: 'Common Issues',
          content: `Masalah umum dan solusi:

❌ Backend tidak bisa connect ke MikroTik
✅ Pastikan API service enabled di MikroTik
✅ Check firewall tidak block port 8728
✅ Verify username/password benar

❌ Invoice tidak auto-generate
✅ Check cron job running
✅ Verify tanggal billing di settings
✅ Check database customer punya packageId

❌ Payment gateway error
✅ Verify API key valid
✅ Check server IP whitelisted
✅ Test mode vs production mode

❌ Email tidak terkirim
✅ Configure SMTP settings
✅ Verify email credentials
✅ Check spam folder`
        },
        {
          id: 'logs',
          title: 'Checking Logs',
          content: 'Monitor application logs untuk debugging:',
          code: `# Backend logs
cd apps/backend
pnpm dev
# Watch terminal output

# Database logs
docker logs audiranet-postgres

# Check error logs
tail -f apps/backend/logs/error.log

# Frontend logs
# Open browser console (F12)
# Check Console tab for errors`
        }
      ]
    }
  ]

  const currentSection = docSections.find(s => s.id === activeSection)
  const currentSubsection = currentSection?.subsections.find(s => s.id === activeSubsection)

  return (
    <Layout>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[var(--app-card)] border-r border-[var(--app-border)] overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--app-muted)]" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <nav className="space-y-1">
              {docSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id)
                      setActiveSubsection(section.subsections[0]?.id)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-[var(--app-text)]/90 hover:bg-[var(--app-bg)]'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </button>
                  {activeSection === section.id && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSubsection(sub.id)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded ${
                            activeSubsection === sub.id
                              ? 'text-blue-700 bg-blue-50'
                              : 'text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-bg)]'
                          }`}
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            {currentSubsection && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--app-text)] mb-2">
                  {currentSubsection.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[var(--app-muted)] mb-6">
                  <BookOpen className="h-4 w-4" />
                  <span>{currentSection?.title}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{currentSubsection.title}</span>
                </div>

                <div className="prose prose-blue max-w-none">
                  <div className="text-[var(--app-text)]/90 whitespace-pre-line leading-relaxed">
                    {currentSubsection.content}
                  </div>

                  {currentSubsection.code && (
                    <div className="mt-6 relative">
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={() => copyToClipboard(currentSubsection.code!, currentSubsection.id)}
                          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === currentSubsection.id ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                        <code className="text-sm">{currentSubsection.code}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-12 pt-6 border-t border-[var(--app-border)] flex justify-between">
                  <div>
                    {currentSection && currentSection.subsections.findIndex(s => s.id === activeSubsection) > 0 && (
                      <button
                        onClick={() => {
                          const currentIndex = currentSection.subsections.findIndex(s => s.id === activeSubsection)
                          setActiveSubsection(currentSection.subsections[currentIndex - 1].id)
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        Previous
                      </button>
                    )}
                  </div>
                  <div>
                    {currentSection && currentSection.subsections.findIndex(s => s.id === activeSubsection) < currentSection.subsections.length - 1 && (
                      <button
                        onClick={() => {
                          const currentIndex = currentSection.subsections.findIndex(s => s.id === activeSubsection)
                          setActiveSubsection(currentSection.subsections[currentIndex + 1].id)
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - On This Page */}
        <div className="hidden xl:block w-64 bg-[var(--app-bg)] border-l border-[var(--app-border)] p-6">
          <h3 className="text-sm font-semibold text-[var(--app-text)] mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm">
            <a href="/test-api" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Terminal className="h-4 w-4" />
              API Test Dashboard
            </a>
            <a href="https://github.com/yourusername/audiranet" target="_blank" className="flex items-center gap-2 text-[var(--app-muted)] hover:text-[var(--app-text)]">
              <ExternalLink className="h-4 w-4" />
              GitHub Repository
            </a>
            <a href="#" className="flex items-center gap-2 text-[var(--app-muted)] hover:text-[var(--app-text)]">
              <FileText className="h-4 w-4" />
              Changelog
            </a>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-[var(--app-text)] mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-[var(--app-card)] p-3 rounded-lg border border-[var(--app-border)]">
                <p className="text-[var(--app-muted)] mb-2">Join our community</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Discord Server →
                </a>
              </div>
              <div className="bg-[var(--app-card)] p-3 rounded-lg border border-[var(--app-border)]">
                <p className="text-[var(--app-muted)] mb-2">Report an issue</p>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  GitHub Issues →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
