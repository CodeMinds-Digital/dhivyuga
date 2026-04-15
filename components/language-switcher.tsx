'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const locales = [
  { code: 'ta', name: 'தமிழ்' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'sa', name: 'संस्कृதम்' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = locales.find(l => l.code === locale) || locales[0]

  const handleChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    const qs = searchParams.toString()
    router.push(qs ? `${newPath}?${qs}` : newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap">
          <Globe className="w-4 h-4 text-neutral-500" />
          {current.name}
          <ChevronDown className="h-3 w-3 text-neutral-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleChange(l.code)}
            className={`cursor-pointer text-sm ${locale === l.code ? 'bg-brand-50 text-brand-700 font-semibold' : ''}`}
          >
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
