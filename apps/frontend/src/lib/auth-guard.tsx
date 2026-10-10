import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/404']

// Routes that should redirect to login if not authenticated
const PROTECTED_ROUTES = [
  '/',
  '/pelanggan',
  '/paket',
  '/layanan',
  '/keuangan',
  '/transaksi',
  '/operational',
  '/infrastruktur',
  '/mikrotik',
  '/genieacs',
  '/field-service',
  '/technician',
  '/analytics',
  '/franchise',
  '/pengaturan',
  '/dokumentasi',
  '/test-api'
]

export function useAuthGuard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return

    const currentPath = router.pathname

    // Allow public routes
    if (PUBLIC_ROUTES.includes(currentPath)) {
      // If user is already logged in and tries to access login page, redirect to home
      if (currentPath === '/login' && user) {
        router.push('/')
      }
      return
    }

    // Check if current route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      currentPath === route || currentPath.startsWith(`${route}/`)
    )

    // Redirect to login if trying to access protected route without authentication
    if (isProtectedRoute && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}

// HOC (Higher Order Component) for protecting pages
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuthGuard()

    // Show loading state
    if (isLoading || !user) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    // Render the protected component
    return <Component {...props} />
  }
}
