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
    <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-white/95 border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-playfair font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all">
          Dhivyuga
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/" className={`px-4 py-2 rounded-lg transition-all font-medium ${isHomePage || pathname === '/search' || pathname.startsWith('/mantra')
            ? 'bg-purple-100 text-purple-700 font-semibold shadow-sm'
            : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
            }`}>
            Mantras
          </Link>
          <Link href="/grahas" className={`px-4 py-2 rounded-lg transition-all font-medium ${pathname === '/grahas' || pathname.startsWith('/graha')
            ? 'bg-purple-100 text-purple-700 font-semibold shadow-sm'
            : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
            }`}>
            Grahas
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md transition-colors text-slate-700 hover:bg-slate-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="font-medium transition-all border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 bg-white"
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
            <Link
              href="/grahas"
              className={`block py-3 px-4 rounded-lg transition-all font-medium ${pathname === '/grahas' || pathname.startsWith('/graha')
                  ? 'bg-purple-100 text-purple-700 font-semibold'
                  : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Grahas
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}