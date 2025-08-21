'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/admin-layout'
import { DashboardCards } from '@/components/admin/dashboard-cards'
import { DataTable } from '@/components/admin/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TrendingUp, Activity, Clock, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalMantras: 0,
    totalViews: 0,
    totalCategories: 0,
    totalDeities: 0
  })

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile && profile.role === 'admin') {
          setUser(user)
          setUserProfile(profile)
        } else {
          setError('Access denied. Admin privileges required.')
          await supabase.auth.signOut()
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profile && profile.role === 'admin') {
          setUser(data.user)
          setUserProfile(profile)
        } else {
          setError('Access denied. Only administrators can access this panel.')
          await supabase.auth.signOut()
        }
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoginLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [mantrasRes, categoriesRes, deitiesRes] = await Promise.all([
        supabase.from('mantras').select('id, view_count'),
        supabase.from('categories').select('id'),
        supabase.from('deities').select('id')
      ])

      const totalViews = mantrasRes.data?.reduce((sum, mantra) => sum + (mantra.view_count || 0), 0) || 0

      setStats({
        totalMantras: mantrasRes.data?.length || 0,
        totalViews,
        totalCategories: categoriesRes.data?.length || 0,
        totalDeities: deitiesRes.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
      setError('')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mandala">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold text-gradient mb-2">
              Dhivyuga Admin
            </h1>
            <p className="text-slate-600 mb-4">
              Sign in to manage mantras and content
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-800 font-medium mb-1">Default Admin Credentials:</p>
              <p className="text-blue-700">Email: admin@dhivyuga.com</p>
              <p className="text-blue-700">Password: DhivyugaAdmin2024!</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dhivyuga.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-danger text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading}
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  // Sample recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'mantra_added' as const,
      title: 'Ganesha Mantra Added',
      description: 'New mantra for removing obstacles',
      time: '2 hours ago',
      user: 'Admin'
    },
    {
      id: '2',
      type: 'mantra_viewed' as const,
      title: 'Lakshmi Mantra',
      description: 'Viewed 45 times today',
      time: '4 hours ago'
    },
    {
      id: '3',
      type: 'category_created' as const,
      title: 'Prosperity Category',
      description: 'New category for wealth mantras',
      time: '1 day ago',
      user: 'Admin'
    }
  ]

  return (
    <AdminLayout>

      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
            <p className="text-slate-600">Here's what's happening with your mantras today.</p>
          </div>
          <Button className="gap-2">
            <Activity className="h-4 w-4" />
            View Analytics
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardCards stats={stats} />

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Mantra Views Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">Chart visualization coming soon</p>
                    <p className="text-sm text-slate-400">Analytics dashboard in development</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <DataTable
              title="Recent Activity"
              data={recentActivity}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/mantras">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <span className="text-2xl">📿</span>
                  <span className="text-sm">Add Mantra</span>
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <span className="text-2xl">🏷️</span>
                  <span className="text-sm">Add Category</span>
                </Button>
              </Link>
              <Link href="/admin/deities">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <span className="text-2xl">🕉️</span>
                  <span className="text-sm">Add Deity</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm">Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
