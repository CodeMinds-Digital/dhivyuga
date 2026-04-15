'use client'

interface DetailsGridProps {
  deityLabel?: string
  deity?: string
  bestTimeLabel?: string
  bestTime?: string
  recitationCountLabel?: string
  recitationCount?: string
  auspiciousPeriodLabel?: string
  auspiciousPeriod?: string
  isAuspicious?: boolean
}

export function DetailsGrid({
  deityLabel = 'Deity',
  deity,
  bestTimeLabel = 'Best Time',
  bestTime,
  recitationCountLabel = 'Recitation Count',
  recitationCount,
  auspiciousPeriodLabel = 'Auspicious Period',
  auspiciousPeriod,
  isAuspicious,
}: DetailsGridProps) {
  const items = [
    { label: deityLabel, value: deity },
    { label: bestTimeLabel, value: bestTime },
    { label: recitationCountLabel, value: recitationCount },
    { label: auspiciousPeriodLabel, value: auspiciousPeriod, isGreen: isAuspicious },
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
