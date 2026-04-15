'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { SearchBar } from '@/components/search-bar'
import { FilterChips } from '@/components/filter-chips'
import { SearchResultItem } from '@/components/search-result-item'
import { MantraOverlay } from '@/components/mantra-overlay'
import { LanguageSwitcher } from '@/components/language-switcher'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('search')
  const tHome = useTranslations('home')
  const tDeities = useTranslations('deities')
  const tCategories = useTranslations('categories')
  const tTimes = useTranslations('times')

  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const mantraParam = searchParams.get('mantra') || ''

  const [mantras, setMantras] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [activeFilter, setActiveFilter] = useState(categoryParam)
  const [loading, setLoading] = useState(true)
  const [selectedMantra, setSelectedMantra] = useState<any | null>(null)
  const [overlayOpen, setOverlayOpen] = useState(false)

  // Helper to translate a name with fallback to original
  const translateCategory = (name?: string) => {
    if (!name) return undefined
    try { return tCategories(name) } catch { return name }
  }
  const translateDeity = (name?: string) => {
    if (!name) return undefined
    try { return tDeities(name) } catch { return name }
  }
  const translateTime = (name?: string) => {
    if (!name) return undefined
    try { return tTimes(name) } catch { return name }
  }

  // Fetch search results with cancellation
  useEffect(() => {
    const controller = new AbortController()

    const fetchResults = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (activeFilter) params.set('category', activeFilter)
        const res = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
        const data = await res.json()
        setMantras(data.mantras || [])
      } catch (e: any) {
        if (e?.name !== 'AbortError') setMantras([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchResults()
    return () => controller.abort()
  }, [query, activeFilter])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (mantraParam) {
      fetch(`/api/mantras/${mantraParam}`)
        .then(r => r.json())
        .then(d => { setSelectedMantra(d.mantra); setOverlayOpen(true) })
        .catch(() => {})
    }
  }, [mantraParam])

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      if (!params.get('mantra')) {
        setOverlayOpen(false)
        setSelectedMantra(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleResultClick = async (id: string) => {
    try {
      fetch(`/api/mantras/${id}/view`, { method: 'POST' }).catch(() => {})
      const res = await fetch(`/api/mantras/${id}`)
      const data = await res.json()
      setSelectedMantra(data.mantra)
      setOverlayOpen(true)
      const url = new URL(window.location.href)
      url.searchParams.set('mantra', id)
      window.history.pushState({}, '', url.toString())
    } catch {}
  }

  const handleOverlayClose = () => {
    setOverlayOpen(false)
    setSelectedMantra(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('mantra')
    window.history.pushState({}, '', url.toString())
  }

  const handleFilterChange = (id: string) => {
    setActiveFilter(id)
    const url = new URL(window.location.href)
    if (id) url.searchParams.set('category', id)
    else url.searchParams.delete('category')
    url.searchParams.delete('mantra')
    window.history.replaceState({}, '', url.toString())
  }

  // Translate category names for filter chips
  const translatedCategories = categories.map(cat => ({
    id: cat.id,
    name: translateCategory(cat.name) || cat.name,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-white border-b border-neutral-100">
        <a href={`/${locale}`} className="text-lg font-bold text-neutral-900 font-noto-devanagari flex-shrink-0">
          {tHome('logoTitle')}
        </a>
        <div className="flex-1 max-w-[580px]">
          <SearchBar defaultValue={query} />
        </div>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-6 py-3 bg-white border-b border-neutral-100">
        <FilterChips categories={translatedCategories} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      {/* Results meta */}
      {!loading && (
        <div className="px-6 py-3 text-xs text-neutral-500">
          {t('resultsCount', { count: mantras.length, query: query || '' })}
        </div>
      )}

      {/* Results list */}
      <div className="px-6 max-w-[800px]">
        {loading ? (
          <div className="py-12 text-center text-neutral-400 text-sm">{t('loading')}</div>
        ) : mantras.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-base font-semibold text-neutral-900 mb-2">{t('noResults')}</h3>
            <p className="text-sm text-neutral-500">{t('noResultsHint')}</p>
          </div>
        ) : (
          mantras.map((m: any) => {
            // Pick locale-appropriate text for snippet
            const localeTranslation = m.translations?.find((tr: any) => tr.language_code === locale)
            const snippetText = localeTranslation?.meaning || localeTranslation?.text || m.text

            return (
              <SearchResultItem
                key={m.id}
                id={m.id}
                title={m.title}
                text={snippetText}
                deityName={translateDeity(m.deities?.name)}
                categoryName={translateCategory(m.categories?.name)}
                timeName={translateTime(m.recitation_times?.name)}
                countValue={m.recitation_counts?.count_value}
                viewCount={m.view_count || 0}
                onClick={handleResultClick}
              />
            )
          })
        )}
      </div>

      {/* Mantra Overlay */}
      <MantraOverlay mantra={selectedMantra} isOpen={overlayOpen} onClose={handleOverlayClose} />
    </div>
  )
}

export default function SearchPage() {
  const t = useTranslations('search')
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-white to-brand-50 flex items-center justify-center text-neutral-400">{t('loading')}</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
