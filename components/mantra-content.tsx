'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SacredTextBlock } from '@/components/sacred-text-block'
import { DetailsGrid } from '@/components/details-grid'
import { LanguageTabs } from '@/components/language-tabs'

interface Translation {
  id: string
  language_id: string
  text: string
  transliteration?: string
  pronunciation_guide?: string
  meaning?: string
  benefits?: string
  usage_notes?: string
  languages?: {
    id: string
    code: string
    name: string
    native_name: string
    direction?: string
    sort_order?: number
  }
}

interface MantraContentProps {
  mantra: {
    id: string
    title: string
    text: string
    view_count: number
    deities?: { id: string; name: string; description?: string } | null
    categories?: { id: string; name: string; description?: string } | null
    recitation_counts?: { id: string; count_value: number; description?: string } | null
    recitation_times?: { id: string; name: string; description?: string } | null
    kalams?: { id: string; name: string; description?: string; is_auspicious?: boolean } | null
    time_ranges?: { id: string; start_time: string; end_time: string } | null
    translations?: Translation[]
  }
}

export function MantraContent({ mantra }: MantraContentProps) {
  const t = useTranslations('mantra')
  const translations = mantra.translations || []

  const availableLanguages = translations
    .filter(tr => tr.languages)
    .map(tr => ({
      code: tr.languages!.code,
      name: tr.languages!.name,
      nativeName: tr.languages!.native_name,
    }))

  const [activeLang, setActiveLang] = useState(
    availableLanguages.find(l => l.code === 'ta')?.code || availableLanguages[0]?.code || ''
  )

  const activeTranslation = translations.find(tr => tr.languages?.code === activeLang)

  const bestTime = mantra.recitation_times
    ? `${mantra.recitation_times.name}${mantra.time_ranges ? ` (${mantra.time_ranges.start_time} – ${mantra.time_ranges.end_time})` : ''}`
    : undefined

  const recitationCount = mantra.recitation_counts
    ? `${mantra.recitation_counts.count_value} times${mantra.recitation_counts.description ? ` (${mantra.recitation_counts.description})` : ''}`
    : undefined

  let benefitsList: string[] = []
  if (activeTranslation?.benefits) {
    try {
      const parsed = JSON.parse(activeTranslation.benefits)
      benefitsList = Array.isArray(parsed) ? parsed : [activeTranslation.benefits]
    } catch {
      benefitsList = activeTranslation.benefits.split('\n').filter(Boolean)
    }
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8 pb-16">
      <div className="text-center pb-6 border-b border-neutral-100 mb-6">
        <h1 className="text-2xl md:text-[31px] font-bold text-neutral-900 tracking-tight leading-tight mb-3">
          {mantra.title}
        </h1>
        <div className="flex gap-2 justify-center flex-wrap">
          {mantra.deities && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-brand-50 text-brand-700">
              {mantra.deities.name}
            </span>
          )}
          {mantra.categories && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700">
              {mantra.categories.name}
            </span>
          )}
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-600">
            {mantra.view_count} views
          </span>
        </div>
      </div>

      {availableLanguages.length > 0 && (
        <LanguageTabs
          languages={availableLanguages}
          activeCode={activeLang}
          onTabChange={setActiveLang}
        />
      )}

      <SacredTextBlock
        text={activeTranslation?.text || mantra.text}
        transliteration={activeTranslation?.transliteration}
      />

      <DetailsGrid
        deity={mantra.deities?.name}
        bestTime={bestTime}
        recitationCount={recitationCount}
        auspiciousPeriod={mantra.kalams?.name}
        isAuspicious={mantra.kalams?.is_auspicious}
      />

      {activeTranslation?.meaning && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-100 mb-3">
            {t('meaning')}
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">{activeTranslation.meaning}</p>
        </section>
      )}

      {benefitsList.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-100 mb-3">
            {t('benefits')}
          </h2>
          <ul className="flex flex-col gap-2">
            {benefitsList.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0 mt-[7px]" />
                {benefit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeTranslation?.usage_notes && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-100 mb-3">
            {t('howToChant')}
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">{activeTranslation.usage_notes}</p>
        </section>
      )}
    </div>
  )
}
