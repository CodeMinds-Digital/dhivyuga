'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SacredSymbolsBar } from '@/components/sacred-symbols-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingGrid } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-boundary'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Graha {
  id: string
  name: string
  sanskrit_name: string
  description: string
  day_of_week: string
  color: string
  gemstone: string
  metal: string
  element: string
  direction: string
  mantra_count: number
  created_at: string
}

export default function GrahasPage() {
  const [grahas, setGrahas] = useState<Graha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGrahas()
  }, [])

  const fetchGrahas = async () => {
    setLoading(true)
    setError(null)
    try {
      // First get grahas with mantra counts
      const { data: grahasData, error: grahasError } = await supabase
        .from('deities')
        .select(`
          id,
          name,
          sanskrit_name,
          description,
          day_of_week,
          color,
          gemstone,
          metal,
          element,
          direction,
          created_at
        `)
        .ilike('name', '%graha%')
        .or('name.ilike.%sun%,name.ilike.%moon%,name.ilike.%mars%,name.ilike.%mercury%,name.ilike.%jupiter%,name.ilike.%venus%,name.ilike.%saturn%,name.ilike.%rahu%,name.ilike.%ketu%')

      if (grahasError) throw grahasError

      // Get mantra counts for each graha
      const grahasWithCounts = await Promise.all(
        (grahasData || []).map(async (graha) => {
          const { count } = await supabase
            .from('mantras')
            .select('id', { count: 'exact' })
            .contains('deities', [graha.id])

          return {
            ...graha,
            mantra_count: count || 0
          }
        })
      )

      setGrahas(grahasWithCounts)
    } catch (error) {
      console.error('Error fetching grahas:', error)
      setError('Failed to load grahas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getGrahaIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('sun') || lowerName.includes('surya')) return '☀️'
    if (lowerName.includes('moon') || lowerName.includes('chandra')) return '🌙'
    if (lowerName.includes('mars') || lowerName.includes('mangal')) return '🔴'
    if (lowerName.includes('mercury') || lowerName.includes('budh')) return '💫'
    if (lowerName.includes('jupiter') || lowerName.includes('guru') || lowerName.includes('brihaspati')) return '🪐'
    if (lowerName.includes('venus') || lowerName.includes('shukra')) return '💎'
    if (lowerName.includes('saturn') || lowerName.includes('shani')) return '⚫'
    if (lowerName.includes('rahu')) return '🐉'
    if (lowerName.includes('ketu')) return '☄️'
    return '🌟'
  }

  const getColorClass = (color: string) => {
    if (!color) return 'bg-slate-100'
    const lowerColor = color.toLowerCase()
    if (lowerColor.includes('red')) return 'bg-red-100 border-red-200'
    if (lowerColor.includes('blue')) return 'bg-blue-100 border-blue-200'
    if (lowerColor.includes('yellow') || lowerColor.includes('gold')) return 'bg-yellow-100 border-yellow-200'
    if (lowerColor.includes('green')) return 'bg-green-100 border-green-200'
    if (lowerColor.includes('white')) return 'bg-slate-50 border-slate-200'
    if (lowerColor.includes('black')) return 'bg-slate-200 border-slate-300'
    if (lowerColor.includes('orange')) return 'bg-orange-100 border-orange-200'
    if (lowerColor.includes('purple')) return 'bg-purple-100 border-purple-200'
    return 'bg-slate-100 border-slate-200'
  }

  return (
    <div className="min-h-screen flex flex-col surface">
      <SacredSymbolsBar />
      <Header />

      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="hero-section py-20 md:py-28 px-4 relative overflow-hidden">
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
                  <span className="inline-block text-6xl mb-4">🪐</span>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-display bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                    Navagrahas
                  </h1>
                  <p className="text-body-large text-zinc-600 max-w-2xl mx-auto">
                    The Nine Celestial Bodies and Their Sacred Mantras
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-4 section-bg">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <LoadingGrid count={9} />
            ) : error ? (
              <ErrorMessage
                title="Failed to load grahas"
                message={error}
                onRetry={fetchGrahas}
              />
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.05, 0.7, 0.1, 1]
                  }}
                  className="text-center mb-16 space-y-4"
                >
                  <h2 className="text-headline text-zinc-900">
                    The Nine Planetary Deities
                  </h2>
                  <p className="text-body text-zinc-600 max-w-2xl mx-auto">
                    Each graha represents a celestial force that influences our lives.
                    Discover their mantras, attributes, and spiritual significance.
                  </p>
                </motion.div>

                {grahas.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-title-large text-zinc-900 mb-3">
                      No grahas found
                    </h3>
                    <p className="text-body text-zinc-600">
                      The planetary deities data is being prepared
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {grahas.map((graha, index) => (
                      <motion.div
                        key={graha.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.6,
                          ease: [0.05, 0.7, 0.1, 1]
                        }}
                      >
                        <Card className={`card-outlined h-full hover:shadow-lg hover:border-zinc-300 transition-all duration-300 ${getColorClass(graha.color)}`}>
                          <CardHeader className="text-center pb-4">
                            <div className="text-5xl mb-4">
                              {getGrahaIcon(graha.name)}
                            </div>
                            <CardTitle className="text-title-large text-zinc-900">
                              {graha.name}
                            </CardTitle>
                            {graha.sanskrit_name && (
                              <p className="text-body-small text-zinc-600 font-medium">
                                {graha.sanskrit_name}
                              </p>
                            )}
                          </CardHeader>

                          <CardContent className="space-y-6">
                            {graha.description && (
                              <p className="text-body-small text-zinc-700 leading-relaxed">
                                {graha.description.length > 120
                                  ? `${graha.description.substring(0, 120)}...`
                                  : graha.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-label">
                              {graha.day_of_week && (
                                <div>
                                  <span className="font-medium text-zinc-500">Day:</span>
                                  <p className="text-zinc-900 font-medium">{graha.day_of_week}</p>
                                </div>
                              )}
                              {graha.color && (
                                <div>
                                  <span className="font-medium text-zinc-500">Color:</span>
                                  <p className="text-zinc-900 font-medium">{graha.color}</p>
                                </div>
                              )}
                              {graha.gemstone && (
                                <div>
                                  <span className="font-medium text-zinc-500">Gemstone:</span>
                                  <p className="text-zinc-900 font-medium">{graha.gemstone}</p>
                                </div>
                              )}
                              {graha.metal && (
                                <div>
                                  <span className="font-medium text-zinc-500">Metal:</span>
                                  <p className="text-zinc-900 font-medium">{graha.metal}</p>
                                </div>
                              )}
                              {graha.element && (
                                <div>
                                  <span className="font-medium text-zinc-500">Element:</span>
                                  <p className="text-zinc-900 font-medium">{graha.element}</p>
                                </div>
                              )}
                              {graha.direction && (
                                <div>
                                  <span className="font-medium text-zinc-500">Direction:</span>
                                  <p className="text-zinc-900 font-medium">{graha.direction}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                              <Badge variant="secondary" className="text-label bg-zinc-100 text-zinc-700 border-zinc-200">
                                {graha.mantra_count} Mantras
                              </Badge>
                              <button className="text-blue-600 hover:text-blue-700 text-label-large font-medium transition-colors">
                                View Mantras →
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
