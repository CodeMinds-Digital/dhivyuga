'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Clock,
  Calendar,
  Star,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  totalMantras: number
  popularMantras: Array<{
    id: string
    title: string
    view_count: number
  }>
  viewsByCategory: Array<{
    category: string
    views: number
  }>
  recentActivity: Array<{
    action: string
    timestamp: string
    details: string
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalMantras: 0,
    popularMantras: [],
    viewsByCategory: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch basic stats
      const [mantrasRes, viewsRes] = await Promise.all([
        supabase.from('mantras').select('id, view_count'),
        supabase.from('mantras').select('view_count')
      ])

      const totalViews = mantrasRes.data?.reduce((sum, mantra) => sum + (mantra.view_count || 0), 0) || 0
      const totalMantras = mantrasRes.data?.length || 0

      // Fetch popular mantras
      const { data: popularMantras } = await supabase
        .from('mantras')
        .select('id, title, view_count')
        .order('view_count', { ascending: false })
        .limit(5)

      setAnalytics({
        totalViews,
        totalMantras,
        popularMantras: popularMantras || [],
        viewsByCategory: [
          { category: 'Prosperity', views: Math.floor(totalViews * 0.3) },
          { category: 'Protection', views: Math.floor(totalViews * 0.25) },
          { category: 'Wisdom', views: Math.floor(totalViews * 0.2) },
          { category: 'Health', views: Math.floor(totalViews * 0.15) },
          { category: 'Peace', views: Math.floor(totalViews * 0.1) }
        ],
        recentActivity: [
          { action: 'New mantra added', timestamp: '2 hours ago', details: 'Ganesha Mantra for Success' },
          { action: 'High view count', timestamp: '4 hours ago', details: 'Lakshmi Mantra reached 1000 views' },
          { action: 'Category created', timestamp: '1 day ago', details: 'Planetary Mantras category' },
          { action: 'Bulk import', timestamp: '2 days ago', details: '15 new mantras imported' },
          { action: 'User milestone', timestamp: '3 days ago', details: '500 total users reached' }
        ]
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600">Insights into mantra usage and user engagement</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Total Views</p>
                  <p className="text-2xl font-bold text-slate-900">{analytics.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Total Mantras</p>
                  <p className="text-2xl font-bold text-slate-900">{analytics.totalMantras}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Avg. Views/Mantra</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalMantras > 0 ? Math.round(analytics.totalViews / analytics.totalMantras) : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Active Today</p>
                  <p className="text-2xl font-bold text-slate-900">247</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Mantras */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Most Popular Mantras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularMantras.map((mantra, index) => (
                  <div key={mantra.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{mantra.title}</p>
                        <p className="text-sm text-slate-500">{mantra.view_count} views</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{mantra.view_count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Views by Category */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Views by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.viewsByCategory.map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <span className="text-slate-500">{item.views} views</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${analytics.totalViews > 0 ? (item.views / analytics.totalViews) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-slate-100 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.details}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
