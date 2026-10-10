import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

export default function DebugAuth() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Auth & Menu</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">User Info</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> <span className="bg-blue-100 px-2 py-1 rounded">{user.role}</span></p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ No user logged in</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">LocalStorage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {typeof window !== 'undefined' ? (
              JSON.stringify({
                user: localStorage.getItem('user'),
                token: localStorage.getItem('token') ? '✅ Present' : '❌ Missing'
              }, null, 2)
            ) : 'Server side'}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Menu Items Test</h2>
          <div className="space-y-2">
            {[
              { name: 'Dashboard', roles: ['ADMIN', 'BILLING', 'NOC', 'CS', 'TECHNICIAN'] },
              { name: 'Pelanggan', roles: ['ADMIN', 'BILLING', 'CS'] },
              { name: 'Paket', roles: ['ADMIN', 'BILLING', 'CS'] },
              { name: 'Keuangan', roles: ['ADMIN', 'BILLING'] },
              { name: 'Infrastruktur', roles: ['ADMIN', 'NOC', 'TECHNICIAN'] },
            ].map(item => {
              const hasAccess = user && item.roles.some(role => 
                role.toUpperCase() === user.role.toUpperCase()
              )
              return (
                <div key={item.name} className="flex items-center justify-between p-2 border rounded">
                  <span>{item.name}</span>
                  <span className={hasAccess ? 'text-green-600' : 'text-red-600'}>
                    {hasAccess ? '✅ Visible' : '❌ Hidden'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => {
              localStorage.clear()
              router.push('/login')
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear & Logout
          </button>
        </div>
      </div>
    </div>
  )
}
