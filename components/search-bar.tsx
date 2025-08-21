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
    <div className="w-full max-w-3xl mx-auto mb-12 relative">
      <form onSubmit={handleSubmit}>
        <div className="relative hero-card rounded-2xl p-3 glow-effect">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/70 h-6 w-6" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search mantras, deities, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-16 pr-32 h-18 text-lg rounded-xl border-0 focus:outline-none bg-transparent placeholder:text-white/60 font-medium text-white"
          />
          <Button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-purple-700 px-8 py-3 rounded-xl hover:bg-white/90 transition-all duration-300 font-medium border-0 shadow-lg"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 hero-card rounded-2xl shadow-xl z-50 mt-3 max-h-60 overflow-y-auto border-0"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`w-full text-left px-6 py-4 hover:bg-white/20 flex items-center gap-4 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl ${index === selectedIndex ? 'bg-white/20' : ''
                }`}
              onClick={() => handleSearch(suggestion.text)}
            >
              <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
              <span className="flex-1 font-medium text-white">{suggestion.text}</span>
              <span className="text-xs text-white/70 capitalize bg-white/20 px-2 py-1 rounded-full">
                {suggestion.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}