import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1993'

export type UserRole = 'ADMIN' | 'BILLING' | 'NOC' | 'CS' | 'TECHNICIAN'

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
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Send httpOnly cookies
      })

      if (response.ok) {
        const data = await response.json()
        // Normalize role to uppercase
        if (data.role) {
          data.role = data.role.toUpperCase()
        }
        console.log('👤 User authenticated:', data.email, 'Role:', data.role)
        setUser(data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
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

      console.log('✅ Login successful:', userData.email, 'Role:', userData.role)

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
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
