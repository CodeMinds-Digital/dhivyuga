'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Search
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Mantras', href: '/admin/mantras', icon: BookOpen },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Deities', href: '/admin/deities', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    // Add logout logic here
    window.location.href = '/'
  }

  return (
    <div className="admin-theme min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 admin-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-playfair font-bold admin-text-gradient">
                Dhivyuga Admin
              </span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-admin-primary/10 text-admin-primary border border-admin-primary/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-admin-primary' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 admin-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Admin</p>
                <p className="text-xs text-slate-500 truncate">admin@dhivyuga.com</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-zinc-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">
                {navigation.find(item => item.href === pathname)?.name || 'Admin'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                />
              </div>
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
                ← Back to site
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 bg-zinc-50">
          {children}
        </main>
      </div>
    </div>
  )
}
