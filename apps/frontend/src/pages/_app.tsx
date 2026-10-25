import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RealtimeProvider } from '@/contexts/RealtimeContext'
import NavigationProgressBar from '@/components/NavigationProgressBar'
import { RealtimeNotificationBanner } from '@/components/RealtimeNotificationBanner'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Standalone routes that do not use the Admin Sidebar layout
  const isStandalone =
    router.pathname.startsWith('/customer') ||
    router.pathname === '/login' ||
    (router.pathname === '/sales/daftar' && (router.query.public === 'true' || router.query.public === '1'))

  return (
    <>
      <Head>
        <title>AUDIRA NET — ISP Billing & Network Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <ThemeProvider>
        <AuthProvider>
          <RealtimeProvider>
            <NavigationProgressBar />
            <RealtimeNotificationBanner />
            {isStandalone ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </RealtimeProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
