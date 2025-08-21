'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Suggestion {
  text: string
  type: 'mantra' | 'deity' | 'category'
}

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        try {
          const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        } catch (error) {
          console.error('Failed to fetch suggestions:', error)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          handleSearch(suggestions[selectedIndex].text)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mantra': return '🕉️'
      case 'deity': return '🙏'
      case 'category': return '📿'
      default: return '🔍'
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="relative card-outlined p-1 shadow-lg hover:shadow-xl transition-all duration-300">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search mantras, deities, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-12 pr-28 h-14 text-body rounded-lg border-0 focus:outline-none bg-transparent placeholder:text-zinc-400 font-medium focus:ring-0"
          />
          <Button
            type="submit"
            size="default"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 rounded-lg font-medium shadow-sm"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 card-outlined shadow-xl z-50 mt-3 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-3.5 hover:bg-zinc-50 flex items-center gap-3 transition-all duration-150 first:rounded-t-lg last:rounded-b-lg ${index === selectedIndex ? 'bg-zinc-50' : ''
                }`}
              onClick={() => handleSearch(suggestion.text)}
            >
              <span className="text-base">{getTypeIcon(suggestion.type)}</span>
              <span className="flex-1 font-medium text-zinc-900">{suggestion.text}</span>
              <span className="text-label text-zinc-500 capitalize bg-zinc-100 px-2.5 py-1 rounded-full">
                {suggestion.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}