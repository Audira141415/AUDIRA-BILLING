import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RealtimeProvider } from '@/contexts/RealtimeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import NavigationProgressBar from '@/components/NavigationProgressBar'
import { RealtimeNotificationBanner } from '@/components/RealtimeNotificationBanner'
import Layout from '@/components/Layout'
import RoleSwitcherBar from '@/components/RoleSwitcherBar'

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const pathname = router.pathname || ''
  const asPath = (router.asPath || '').split('?')[0].split('#')[0]

  const isStandalone =
    pathname === '/landing' ||
    asPath === '/landing' ||
    asPath.startsWith('/landing') ||
    pathname.startsWith('/customer') ||
    asPath.startsWith('/customer') ||
    pathname.startsWith('/invoice/public') ||
    asPath.startsWith('/invoice/public') ||
    pathname === '/login' ||
    asPath === '/login' ||
    pathname === '/forgot-password' ||
    asPath === '/forgot-password' ||
    pathname === '/register' ||
    asPath === '/register' ||
    pathname === '/terms' ||
    asPath === '/terms' ||
    pathname === '/privacy' ||
    asPath === '/privacy' ||
    (pathname === '/sales/daftar' && (router.query.public === 'true' || router.query.public === '1')) ||
    (asPath === '/sales/daftar' && (router.query.public === 'true' || router.query.public === '1'))

  // Route protection: If unauthenticated on protected routes, redirect cleanly
  useEffect(() => {
    if (!isLoading && !user && !isStandalone) {
      if (pathname === '/') {
        router.replace('/landing')
      } else {
        router.replace(`/login?redirect=${encodeURIComponent(asPath)}`)
      }
    }
  }, [user, isLoading, isStandalone, pathname, asPath, router])

  // Standalone pages (landing, login, register, customer portal, etc.)
  if (isStandalone) {
    return <Component {...pageProps} />
  }

  // Unauthenticated or loading state on protected route: do NOT flash admin sidebar
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-[var(--app-text-muted)]">Memuat konsol AUDIRA-NET...</p>
        </div>
      </div>
    )
  }

  // Authenticated Admin / Staff with Layout
  return (
    <>
      <RealtimeNotificationBanner />
      <RoleSwitcherBar />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>AUDIRA NET - ISP Billing & Network Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <ThemeProvider>
        <AuthProvider>
          <RealtimeProvider>
            <ToastProvider>
              <NavigationProgressBar />
              <AppContent {...props} />
            </ToastProvider>
          </RealtimeProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
