'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
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

  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const mantraParam = searchParams.get('mantra') || ''

  const [mantras, setMantras] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [activeFilter, setActiveFilter] = useState(categoryParam)
  const [loading, setLoading] = useState(true)
  const [selectedMantra, setSelectedMantra] = useState<any | null>(null)
  const [overlayOpen, setOverlayOpen] = useState(false)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (activeFilter) params.set('category', activeFilter)
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setMantras(data.mantras || [])
    } catch {
      setMantras([])
    } finally {
      setLoading(false)
    }
  }, [query, activeFilter])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => { fetchResults() }, [fetchResults])

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
      // Track view
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-white border-b border-neutral-100">
        <a href={`/${locale}`} className="text-lg font-bold text-neutral-900 font-noto-devanagari flex-shrink-0">
          திவ்யுகா
        </a>
        <div className="flex-1 max-w-[580px]">
          <SearchBar defaultValue={query} showLangSwitcher={false} />
        </div>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-6 py-3 bg-white border-b border-neutral-100">
        <FilterChips categories={categories} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      {/* Results meta */}
      {!loading && (
        <div className="px-6 py-3 text-xs text-neutral-500">
          {mantras.length} {t('resultsFor')} {query ? `"${query}"` : ''}
        </div>
      )}

      {/* Results list */}
      <div className="px-6 max-w-[800px]">
        {loading ? (
          <div className="py-12 text-center text-neutral-400 text-sm">Loading...</div>
        ) : mantras.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-base font-semibold text-neutral-900 mb-2">{t('noResults')}</h3>
            <p className="text-sm text-neutral-500">{t('noResultsHint')}</p>
          </div>
        ) : (
          mantras.map((m: any) => (
            <SearchResultItem
              key={m.id}
              id={m.id}
              title={m.title}
              text={m.text}
              deityName={m.deities?.name}
              categoryName={m.categories?.name}
              timeName={m.recitation_times?.name}
              countValue={m.recitation_counts?.count_value}
              viewCount={m.view_count || 0}
              onClick={handleResultClick}
            />
          ))
        )}
      </div>

      {/* Mantra Overlay */}
      <MantraOverlay mantra={selectedMantra} isOpen={overlayOpen} onClose={handleOverlayClose} />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-400">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
