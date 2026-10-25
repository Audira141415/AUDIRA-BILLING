'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'audira_theme_preference'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setThemeState(saved)
      } else {
        // Default to light for optimal daytime data readability
        setThemeState('light')
      }
    } catch {
      setThemeState('light')
    }
    setMounted(true)
  }, [])

  // Resolve and apply theme
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    let activeMode: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      activeMode = prefersDark ? 'dark' : 'light'
    } else {
      activeMode = theme
    }

    setResolvedTheme(activeMode)
    root.setAttribute('data-theme', activeMode)

    if (activeMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  // Listen for OS color scheme change if in system mode
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const activeMode = e.matches ? 'dark' : 'light'
      setResolvedTheme(activeMode)
      const root = document.documentElement
      root.setAttribute('data-theme', activeMode)
      if (activeMode === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
