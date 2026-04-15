'use client'

import { useTranslations } from 'next-intl'

interface DetailsGridProps {
  deity?: string
  bestTime?: string
  recitationCount?: string
  auspiciousPeriod?: string
  isAuspicious?: boolean
}

export function DetailsGrid({ deity, bestTime, recitationCount, auspiciousPeriod, isAuspicious }: DetailsGridProps) {
  const t = useTranslations('mantra')

  const items = [
    { label: t('deity'), value: deity },
    { label: t('bestTime'), value: bestTime },
    { label: t('recitationCount'), value: recitationCount },
    { label: t('auspiciousPeriod'), value: auspiciousPeriod, isGreen: isAuspicious },
  ].filter(item => item.value)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {items.map((item) => (
        <div key={item.label} className="bg-neutral-50 border border-neutral-100 rounded-lg p-4">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            {item.label}
          </div>
          <div className={`text-sm font-semibold ${item.isGreen ? 'text-green-600' : 'text-neutral-800'}`}>
            {item.value}{item.isGreen ? ' ✓' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}
