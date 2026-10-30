import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RealtimeProvider } from '@/contexts/RealtimeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import NavigationProgressBar from '@/components/NavigationProgressBar'
import { RealtimeNotificationBanner } from '@/components/RealtimeNotificationBanner'
import Layout from '@/components/Layout'
import RoleSwitcherBar from '@/components/RoleSwitcherBar'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

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
              {!isStandalone && <RealtimeNotificationBanner />}
              {!isStandalone && <RoleSwitcherBar />}
              {isStandalone ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </ToastProvider>
          </RealtimeProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
