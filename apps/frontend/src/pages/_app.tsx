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

  const isStandalone =
    router.pathname === '/landing' ||
    router.pathname.startsWith('/customer') ||
    router.pathname.startsWith('/invoice/public') ||
    router.pathname === '/login' ||
    router.pathname === '/forgot-password' ||
    router.pathname === '/register' ||
    router.pathname === '/terms' ||
    router.pathname === '/privacy' ||
    (router.pathname === '/sales/daftar' && (router.query.public === 'true' || router.query.public === '1'))

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
