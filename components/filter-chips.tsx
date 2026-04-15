'use client'

import { useTranslations } from 'next-intl'

interface FilterChipsProps {
  categories: { id: string; name: string }[]
  activeFilter: string
  onFilterChange: (id: string) => void
}

export function FilterChips({ categories, activeFilter, onFilterChange }: FilterChipsProps) {
  const t = useTranslations('search')

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onFilterChange('')}
        className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
          activeFilter === ''
            ? 'border-brand-400 text-brand-700 bg-brand-50'
            : 'border-neutral-200 text-neutral-600 bg-white hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'
        }`}
      >
        {t('allFilter')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
            activeFilter === cat.id
              ? 'border-brand-400 text-brand-700 bg-brand-50'
              : 'border-neutral-200 text-neutral-600 bg-white hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
