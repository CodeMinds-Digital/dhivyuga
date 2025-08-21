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
    <div className="flex flex-wrap justify-center gap-4">
      {quickFilters.map((filter) => (
        <Button
          key={filter.key}
          variant="outline"
          onClick={() => handleFilterClick(filter.category)}
          className="px-8 py-4 hero-card rounded-2xl hover:bg-white/20 transition-all duration-300 font-medium text-white border-white/20 hover:border-white/40"
        >
          {filter.category}
        </Button>
      ))}
    </div>
  )
}