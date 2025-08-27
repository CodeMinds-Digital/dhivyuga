'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-title-large font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-transparent hover:from-zinc-800 hover:to-zinc-600 transition-all duration-200">
          <div className="flex flex-col items-start">
            <span className="text-lg leading-tight">திவ்யுகா</span>
            <span className="text-xs text-zinc-500 font-normal leading-tight">दिव्युगा • Dhivyuga</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/" className={`px-4 py-2.5 rounded-lg transition-all font-medium text-label-large ${isHomePage || pathname === '/search' || pathname.startsWith('/mantra')
            ? 'bg-zinc-900 text-white shadow-sm'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}>
            Mantras
          </Link>
          {/* Grahas link hidden */}
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="font-medium border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
            >
              Admin
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            <Link
              href="/"
              className={`block py-3 px-4 rounded-lg transition-all font-medium ${isHomePage || pathname === '/search' || pathname.startsWith('/mantra')
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mantras
            </Link>
            {/* Grahas link hidden from mobile menu */}
          </div>
        </div>
      )}
    </header>
  )
}