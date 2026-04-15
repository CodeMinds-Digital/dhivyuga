'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { account } from '@/lib/appwrite'
import type { Models } from 'appwrite'

interface AuthContextType {
  isAuthenticated: boolean
  user: Models.User<Models.Preferences> | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get()
        setIsAuthenticated(true)
        setUser(currentUser)
      } catch {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const fallbackTimeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      clearTimeout(fallbackTimeout)
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await account.createEmailPasswordSession(email, password)
      const currentUser = await account.get()
      setIsAuthenticated(true)
      setUser(currentUser)
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error?.message || 'Login failed'
      // Provide user-friendly messages for common errors
      if (error?.code === 401) return { success: false, error: 'Invalid email or password' }
      if (error?.code === 429) return { success: false, error: 'Too many attempts. Please wait and try again.' }
      if (error?.type === 'general_unauthorized_scope') return { success: false, error: 'Account not found. Please create an admin account first.' }
      if (message.includes('fetch') || message.includes('network')) return { success: false, error: 'Cannot connect to server. Check your internet connection.' }
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
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
