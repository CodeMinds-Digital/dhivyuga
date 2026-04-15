'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/auth-context'
import { AuthGuard } from '@/components/admin/auth-guard'

// Pages that don't require authentication
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/setup']

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicPage = PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))

  return (
    <AuthProvider>
      {isPublicPage ? children : <AuthGuard>{children}</AuthGuard>}
    </AuthProvider>
  )
}
