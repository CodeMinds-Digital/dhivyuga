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
  const deity = searchParams.get('deity') || ''

  // Update filters when URL parameters change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: category,
      deity: deity
    }))
  }, [category, deity])

  useEffect(() => {
    fetchMantras()
  }, [query, category, deity, filters])

  const fetchMantras = async () => {
    setLoading(true)
    setError(null)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category) params.append('category', category)
      if (deity || filters.deity) params.append('deity', deity || filters.deity)
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
    <div className="min-h-screen flex flex-col surface">
      <Header />

      <main className="flex-1">
        {/* Modern Search Header */}
        <section className="hero-section py-20 md:py-24 px-4 relative overflow-hidden">
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px, 40px 40px'
            }}></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6"
                >
                  <span className="inline-block text-6xl mb-4">🔍</span>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-display bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                    {query ? `Search Results for "${query}"` :
                      category ? `${category} Mantras` :
                        deity ? `${deity.charAt(0).toUpperCase() + deity.slice(1)} Mantras` :
                          'Search Mantras'}
                  </h1>
                  <p className="text-body-large text-zinc-600 max-w-2xl mx-auto">
                    {query ? `Showing results for "${query}"` :
                      category ? `Explore mantras in the ${category} category` :
                        deity ? `Discover sacred mantras dedicated to ${deity.charAt(0).toUpperCase() + deity.slice(1)}` :
                          'Discover sacred mantras and spiritual practices'}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                  ease: [0.05, 0.7, 0.1, 1]
                }}
              >
                <SearchBar defaultValue={query} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Modern Search Results */}
        <section className="py-24 px-4 section-bg">
          <div className="max-w-6xl mx-auto">
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="flex justify-between items-center mb-8"
                    >
                      <h2 className="text-title-large text-zinc-900">
                        {mantras.length} mantras found
                        {query && ` for "${query}"`}
                      </h2>
                    </motion.div>

                    {mantras.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center py-16"
                      >
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-title-large text-zinc-900 mb-3">
                          No mantras found
                        </h3>
                        <p className="text-body text-zinc-600 mb-6">
                          Try adjusting your search terms or filters
                        </p>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mantras.map((mantra, index) => (
                          <motion.div
                            key={mantra.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                              delay: index * 0.1,
                              duration: 0.6,
                              ease: [0.05, 0.7, 0.1, 1]
                            }}
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
