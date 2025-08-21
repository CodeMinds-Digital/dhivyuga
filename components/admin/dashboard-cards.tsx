'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Eye, BookOpen, Tags, Users } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ReactNode
  color: 'purple' | 'blue' | 'green' | 'orange'
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                {change.type === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {change.value}%
                </span>
                <span className="text-sm text-slate-600">vs last month</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardCardsProps {
  stats: {
    totalMantras: number
    totalViews: number
    totalCategories: number
    totalDeities: number
  }
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Mantras"
        value={stats.totalMantras.toLocaleString()}
        change={{ value: 12, type: 'increase' }}
        icon={<BookOpen className="h-6 w-6" />}
        color="purple"
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        change={{ value: 8, type: 'increase' }}
        icon={<Eye className="h-6 w-6" />}
        color="blue"
      />
      <StatCard
        title="Categories"
        value={stats.totalCategories}
        change={{ value: 5, type: 'increase' }}
        icon={<Tags className="h-6 w-6" />}
        color="green"
      />
      <StatCard
        title="Deities"
        value={stats.totalDeities}
        icon={<Users className="h-6 w-6" />}
        color="orange"
      />
    </div>
  )
}
