'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { SearchFilters } from '@/components/search-filters'
import { MantraCard } from '@/components/mantra-card'
import { LoadingGrid } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { motion } from 'framer-motion'

interface Mantra {
  id: string
  title: string
  text: string
  view_count: number
  deities?: { name: string }
  categories?: { name: string }
}

function SearchPageContent() {
  const [mantras, setMantras] = useState<Mantra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    deity: '',
    kalam: '',
    timeOfDay: '',
    recitationCount: ''
  })

  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    fetchMantras()
  }, [query, category, filters])

  const fetchMantras = async () => {
    setLoading(true)
    setError(null)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category) params.append('category', category)
      if (filters.deity) params.append('deity', filters.deity)
      if (filters.timeOfDay) params.append('time', filters.timeOfDay)
      if (filters.kalam) params.append('kalam', filters.kalam)

      const response = await fetch(`/api/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setMantras(data.mantras || [])
      } else {
        setError('Failed to fetch mantras. Please try again.')
        setMantras([])
      }
    } catch (error) {
      console.error('Error fetching mantras:', error)
      setError('Network error. Please check your connection and try again.')
      setMantras([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col content-bg">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block text-5xl mb-4">🔍</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-8"
            >
              {query ? `Search Results for "${query}"` : 'Search Mantras'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SearchBar defaultValue={query} />
            </motion.div>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* Results */}
              <div className="lg:col-span-3">
                {loading ? (
                  <LoadingGrid count={6} />
                ) : error ? (
                  <ErrorMessage
                    title="Failed to load mantras"
                    message={error}
                    onRetry={fetchMantras}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-slate-600">
                        {mantras.length} mantras found
                        {query && ` for "${query}"`}
                      </p>
                    </div>

                    {mantras.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          No mantras found
                        </h3>
                        <p className="text-slate-600 mb-4">
                          Try adjusting your search terms or filters
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mantras.map((mantra, index) => (
                          <motion.div
                            key={mantra.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <MantraCard mantra={mantra} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col surface">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <LoadingGrid count={6} />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
