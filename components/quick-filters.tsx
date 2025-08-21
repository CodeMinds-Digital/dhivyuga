'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function QuickFilters() {
  const router = useRouter()

  const quickFilters = [
    { key: 'wealth', category: 'Wealth' },
    { key: 'protection', category: 'Protection' },
    { key: 'health', category: 'Health' },
    { key: 'wisdom', category: 'Wisdom' },
  ]

  const handleFilterClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`)
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {quickFilters.map((filter) => (
        <Button
          key={filter.key}
          variant="outline"
          onClick={() => handleFilterClick(filter.category)}
          className="px-6 py-2.5 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          {filter.category}
        </Button>
      ))}
    </div>
  )
}