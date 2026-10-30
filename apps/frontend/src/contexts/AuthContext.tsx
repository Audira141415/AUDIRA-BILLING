import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218'

export type UserRole = 'SUPERADMIN' | 'OWNER' | 'ADMIN' | 'BILLING' | 'NOC' | 'CS' | 'TECHNICIAN' | 'CUSTOMER'

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in by calling backend (cookie-based)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('adminToken')) : null
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers,
        credentials: 'include', // Send httpOnly cookies
      })

      if (response.ok) {
        const data = await response.json()
        if (data.role) {
          data.role = data.role.toUpperCase()
        }
        console.log('[Auth] User authenticated:', data.email, 'Role:', data.role)
        setUser(data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data))
        }
      } else {
        // Fallback to cached user in localStorage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('user')
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              setUser(parsed)
              return
            } catch {}
          }
          // Default local dev admin fallback if in development: fetch live JWT token from backend
          if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            try {
              const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@audira.net', password: 'admin123' }),
              });
              if (loginRes.ok) {
                const loginData = await loginRes.json();
                const activeToken = loginData.access_token || loginData.token;
                if (activeToken) {
                  localStorage.setItem('token', activeToken);
                  localStorage.setItem('adminToken', activeToken);
                  const adminUser: User = {
                    id: loginData.user?.id || 'admin-1',
                    email: loginData.user?.email || 'admin@audira.net',
                    name: loginData.user?.name || 'Agus Dwi Rianto',
                    role: 'ADMIN',
                  };
                  setUser(adminUser);
                  localStorage.setItem('user', JSON.stringify(adminUser));
                  return;
                }
              }
            } catch (err) {
              console.warn('Backend auto-login notice:', err);
            }
            const devAdmin: User = {
              id: 'dev-admin-1',
              email: 'admin@audira.net',
              name: 'Agus Dwi Rianto',
              role: 'ADMIN',
            };
            setUser(devAdmin);
            localStorage.setItem('user', JSON.stringify(devAdmin));
          }
        }
      }
    } catch (error) {
      console.warn('Auth check network warning (using fallback session):', error)
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('user')
        if (cached) {
          try {
            setUser(JSON.parse(cached))
            return
          } catch {}
        }
        if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
          const devAdmin: User = {
            id: 'dev-admin-1',
            email: 'admin@audira.net',
            name: 'Agus Dwi Rianto',
            role: 'ADMIN'
          }
          setUser(devAdmin)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send/receive httpOnly cookies
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      
      // Normalize role to uppercase
      const userRole = (data.user.role || 'ADMIN').toUpperCase() as UserRole
      
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: userRole
      }

      console.log('[Auth] Login successful:', userData.email, 'Role:', userData.role)

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setUser(userData)

      // Always redirect to home after login
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const switchRole = (newRole: UserRole) => {
    const roleUpper = newRole.toUpperCase() as UserRole
    const nameMap: Record<string, string> = {
      SUPERADMIN: 'Agus Dwi Rianto (Superadmin)',
      OWNER: 'Agus Dwi Rianto (Owner)',
      ADMIN: 'Agus Dwi Rianto (Admin)',
      NOC: 'Budi Santoso (NOC Engineer)',
      TECHNICIAN: 'Rudi Hartono (Teknisi Lapangan)',
      BILLING: 'Siti Rahmawati (Billing & Kasir)',
      CS: 'Dewi Lestari (Customer Service)',
      CUSTOMER: 'Ahmad Pratama (Pelanggan Mandiri)'
    }

    const updatedUser: User = {
      id: user?.id || 'usr-role-switch',
      email: `${roleUpper.toLowerCase()}@audira.net`,
      name: nameMap[roleUpper] || `${roleUpper} User`,
      role: roleUpper,
    }

    console.log('[Auth] Role switched dynamically to:', roleUpper)
    setUser(updatedUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Send httpOnly cookies
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_info');
      }
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
