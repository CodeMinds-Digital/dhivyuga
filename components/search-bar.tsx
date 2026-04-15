'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Search } from 'lucide-react'

interface Suggestion {
  text: string
  type: 'mantra' | 'deity' | 'category'
}

const typeIcons: Record<string, string> = {
  mantra: '🕉️',
  deity: '🙏',
  category: '📿',
}

export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue)

  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('home')

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return }
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setShowSuggestions(true)
    } catch { setSuggestions([]) }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, fetchSuggestions])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (searchQuery?: string) => {
    const q = searchQuery || query
    if (q.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(q.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSubmit(suggestions[selectedIndex].text)
      } else {
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full max-w-[640px] relative" role="search">
      <div className="flex items-center gap-3 bg-white border-[1.5px] border-neutral-200 rounded-full px-5 py-3 shadow-[var(--shadow-search)] transition-all duration-200 hover:border-neutral-300 hover:shadow-md focus-within:border-brand-400 focus-within:shadow-[var(--shadow-search-focus)]">
        <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-transparent border-none outline-none text-base text-neutral-800 placeholder:text-neutral-400 min-w-0 font-sans"
          aria-label={t('searchPlaceholder')}
          autoComplete="off"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={`${s.type}-${s.text}`}
              onClick={() => handleSubmit(s.text)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                i === selectedIndex ? 'bg-neutral-50' : 'hover:bg-neutral-50'
              }`}
            >
              <span className="text-sm">{typeIcons[s.type]}</span>
              <span className="text-sm text-neutral-800 flex-1">{s.text}</span>
              <span className="text-[10px] font-medium text-neutral-400 uppercase">{s.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
