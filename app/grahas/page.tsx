'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
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
    <div className="min-h-screen flex flex-col content-bg">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 py-24 px-4 relative overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block text-6xl mb-4">🪐</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight"
            >
              Navagrahas
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              The Nine Celestial Bodies and Their Sacred Mantras
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
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
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-playfair font-bold text-slate-800 mb-4">
                    The Nine Planetary Deities
                  </h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Each graha represents a celestial force that influences our lives. 
                    Discover their mantras, attributes, and spiritual significance.
                  </p>
                </div>

                {grahas.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      No grahas found
                    </h3>
                    <p className="text-slate-600 mb-4">
                      The planetary deities data is being prepared
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {grahas.map((graha, index) => (
                      <motion.div
                        key={graha.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`h-full hover:shadow-xl transition-all duration-300 ${getColorClass(graha.color)}`}>
                          <CardHeader className="text-center pb-4">
                            <div className="text-4xl mb-3">
                              {getGrahaIcon(graha.name)}
                            </div>
                            <CardTitle className="text-xl font-playfair text-slate-800">
                              {graha.name}
                            </CardTitle>
                            {graha.sanskrit_name && (
                              <p className="text-sm text-slate-600 font-medium">
                                {graha.sanskrit_name}
                              </p>
                            )}
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {graha.description && (
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {graha.description.length > 120 
                                  ? `${graha.description.substring(0, 120)}...` 
                                  : graha.description}
                              </p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {graha.day_of_week && (
                                <div>
                                  <span className="font-medium text-slate-600">Day:</span>
                                  <p className="text-slate-800">{graha.day_of_week}</p>
                                </div>
                              )}
                              {graha.color && (
                                <div>
                                  <span className="font-medium text-slate-600">Color:</span>
                                  <p className="text-slate-800">{graha.color}</p>
                                </div>
                              )}
                              {graha.gemstone && (
                                <div>
                                  <span className="font-medium text-slate-600">Gemstone:</span>
                                  <p className="text-slate-800">{graha.gemstone}</p>
                                </div>
                              )}
                              {graha.metal && (
                                <div>
                                  <span className="font-medium text-slate-600">Metal:</span>
                                  <p className="text-slate-800">{graha.metal}</p>
                                </div>
                              )}
                              {graha.element && (
                                <div>
                                  <span className="font-medium text-slate-600">Element:</span>
                                  <p className="text-slate-800">{graha.element}</p>
                                </div>
                              )}
                              {graha.direction && (
                                <div>
                                  <span className="font-medium text-slate-600">Direction:</span>
                                  <p className="text-slate-800">{graha.direction}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                              <Badge variant="secondary" className="text-xs">
                                {graha.mantra_count} Mantras
                              </Badge>
                              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
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
