import { useState } from 'react'
import Layout from '@/components/Layout'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

interface TestResult {
  endpoint: string
  status: 'success' | 'error' | 'pending'
  message: string
  data?: any
}

export default function TestAPI() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const API_BASE = '${API_BASE_URL}'

  const testEndpoints = async () => {
    setTesting(true)
    setResults([])
    
    const endpoints = [
      { name: 'Health Check', url: '/health', method: 'GET' },
      { name: 'Dashboard Stats', url: '/dashboard/stats', method: 'GET' },
      { name: 'Mikrotik List', url: '/mikrotik', method: 'GET' },
      { name: 'Pelanggan List', url: '/pelanggan', method: 'GET' },
      { name: 'Pelanggan Stats', url: '/pelanggan/stats', method: 'GET' },
      { name: 'Keuangan Invoices', url: '/keuangan/invoices', method: 'GET' },
      { name: 'Keuangan Stats', url: '/keuangan/stats', method: 'GET' },
      { name: 'Operational Tickets', url: '/operational/tickets', method: 'GET' },
      { name: 'Operational Technicians', url: '/operational/technicians', method: 'GET' },
    ]

    const testResults: TestResult[] = []

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE}${endpoint.url}`)
        const data = await response.json()
        
        testResults.push({
          endpoint: endpoint.name,
          status: response.ok ? 'success' : 'error',
          message: response.ok ? `✓ Berhasil (${response.status})` : `✗ Gagal (${response.status})`,
          data: data
        })
      } catch (error: any) {
        testResults.push({
          endpoint: endpoint.name,
          status: 'error',
          message: `✗ Error: ${error.message}`,
        })
      }
      
      setResults([...testResults])
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    setTesting(false)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Test Dashboard</h1>
          <p className="text-gray-600">Test koneksi ke backend AudiraNET API</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={testEndpoints}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <span className="flex items-center gap-2">
                <Loader className="h-5 w-5 animate-spin" />
                Testing...
              </span>
            ) : (
              'Test All Endpoints'
            )}
          </button>

          {results.length > 0 && (
            <div className="mt-6 space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : result.status === 'error'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : result.status === 'error' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Loader className="h-5 w-5 text-slate-500 animate-spin" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{result.endpoint}</p>
                        <p className={`text-sm ${
                          result.status === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {result.data && result.status === 'success' && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && !testing && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900">Test Summary</h3>
              <div className="mt-2 flex gap-6 text-sm">
                <p className="text-green-700">
                  <strong>Passed:</strong> {results.filter(r => r.status === 'success').length}
                </p>
                <p className="text-red-700">
                  <strong>Failed:</strong> {results.filter(r => r.status === 'error').length}
                </p>
                <p className="text-gray-700">
                  <strong>Total:</strong> {results.length}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Catatan Penting:</h3>
          <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
            <li>Pastikan backend berjalan di <code className="bg-yellow-100 px-1 rounded">http://localhost:4000</code></li>
            <li>Jalankan <code className="bg-yellow-100 px-1 rounded">pnpm dev</code> untuk memulai backend</li>
            <li>Database PostgreSQL harus running di port 5433</li>
            <li>Pastikan semua migrations sudah dijalankan</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
