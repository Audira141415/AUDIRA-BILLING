/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218',
  },
  async redirects() {
    return [
      {
        source: '/infrastruktur',
        destination: '/infrastruktur/olt',
        permanent: false,
      },
      {
        source: '/settings',
        destination: '/pengaturan',
        permanent: false,
      },
      {
        source: '/admin/dashboard',
        destination: '/',
        permanent: false,
      },
      {
        source: '/payment/transactions',
        destination: '/transaksi',
        permanent: false,
      },
      {
        source: '/test-api',
        destination: '/debug/test-api',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig

