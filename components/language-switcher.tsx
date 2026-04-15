'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const locales = [
  { code: 'ta', label: 'TA', name: 'தமிழ்' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'HI', name: 'हिंदी' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const current = locales.find(l => l.code === locale) || locales[0]

  const handleChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-full hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-150 cursor-pointer whitespace-nowrap">
          {current.label}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleChange(l.code)}
            className={`cursor-pointer ${locale === l.code ? 'bg-brand-50 text-brand-700 font-semibold' : ''}`}
          >
            <span className="font-medium mr-2">{l.label}</span>
            <span className="text-xs text-neutral-500">{l.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
