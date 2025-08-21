'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Share2, Eye, User, Tag } from 'lucide-react'
import { motion } from 'framer-motion'

interface MantraDetail {
  id: string
  title: string
  text: string
  meaning: string
  transliteration: string
  nativeScript: string
  view_count: number
  deity: string
  category: string
  recitationCount: string
  bestTime: string
  benefits: string[]
}

export default function MantraDetailPage() {
  const [mantra, setMantra] = useState<MantraDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeScript, setActiveScript] = useState('transliteration')

  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    fetchMantraDetail()
  }, [id])

  const fetchMantraDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/mantras/${id}`)
      if (response.ok) {
        const data = await response.json()
        const mantraData = data.mantra

        // Transform API data to match component interface
        setMantra({
          id: mantraData.id,
          title: mantraData.title,
          text: mantraData.text,
          meaning: 'Detailed meaning and significance of this sacred mantra...',
          transliteration: mantraData.title, // Use title as transliteration for now
          nativeScript: mantraData.text,
          view_count: mantraData.view_count || 0,
          deity: mantraData.deities?.name || 'Unknown',
          category: mantraData.categories?.name || 'General',
          recitationCount: mantraData.recitation_counts?.count_value ? `${mantraData.recitation_counts.count_value} times` : '108 times',
          bestTime: mantraData.recitation_times?.name || 'Morning',
          benefits: [
            'Spiritual growth and inner peace',
            'Divine blessings and protection',
            'Positive energy and harmony',
            'Mental clarity and focus',
            'Overall well-being'
          ]
        })

        // Track view
        fetch(`/api/mantras/${id}/view`, { method: 'POST' })
      } else {
        console.error('Failed to fetch mantra')
        setMantra(null)
      }
    } catch (error) {
      console.error('Error fetching mantra:', error)
      setMantra(null)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mantra?.title,
        text: mantra?.meaning,
        url: window.location.href
      })
    }
  }

  const handlePlay = () => {
    // Future: Implement audio playback
    console.log('Play audio for:', mantra?.title)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col surface">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!mantra) {
    return (
      <div className="min-h-screen flex flex-col surface">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-title-large text-zinc-900 mb-4">Mantra not found</h1>
            <p className="text-body text-zinc-600">The requested mantra could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col surface">
      <Header />

      <main className="flex-1">
        {/* Modern Hero Section */}
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
                <h1 className="text-display bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                  {mantra.title}
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
                >
                  <Button onClick={handlePlay} className="px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <Play className="h-4 w-4 mr-2" />
                    Play Audio
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="px-6 py-3 rounded-lg border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap justify-center items-center gap-6 text-zinc-600"
                >
                  <span className="flex items-center gap-2 text-body">
                    <Eye className="h-4 w-4" />
                    {mantra.view_count} views
                  </span>
                  <span className="flex items-center gap-2 text-body">
                    <User className="h-4 w-4" />
                    {mantra.deity}
                  </span>
                  <span className="flex items-center gap-2 text-body">
                    <Tag className="h-4 w-4" />
                    {mantra.category}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Modern Content Section */}
        <section className="py-24 px-4 section-bg">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="card-outlined mb-8 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-title text-zinc-900">
                      Mantra Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeScript} onValueChange={setActiveScript}>
                      <TabsList className="grid w-full grid-cols-2 bg-zinc-100">
                        <TabsTrigger value="transliteration" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900">Transliteration</TabsTrigger>
                        <TabsTrigger value="devanagari" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900">Devanagari</TabsTrigger>
                      </TabsList>
                      <TabsContent value="transliteration" className="mt-6">
                        <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-zinc-100">
                          <p className="text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed">
                            {mantra.transliteration}
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="devanagari" className="mt-6">
                        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-zinc-100">
                          <p className="text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed">
                            {mantra.text}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="card-outlined shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-title text-zinc-900">
                      Meaning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body text-zinc-700 leading-relaxed">
                      {mantra.meaning}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="card-outlined shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-title text-zinc-900">
                      Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-label-large font-medium text-zinc-600">Deity</label>
                      <p className="text-zinc-900 font-medium">{mantra.deity}</p>
                    </div>
                    <div>
                      <label className="text-label-large font-medium text-zinc-600">Category</label>
                      <p className="text-zinc-900 font-medium">{mantra.category}</p>
                    </div>
                    <div>
                      <label className="text-label-large font-medium text-zinc-600">Recitation Count</label>
                      <p className="text-zinc-900 font-medium">{mantra.recitationCount}</p>
                    </div>
                    <div>
                      <label className="text-label-large font-medium text-zinc-600">Best Time</label>
                      <p className="text-zinc-900 font-medium">{mantra.bestTime}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mantra.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
