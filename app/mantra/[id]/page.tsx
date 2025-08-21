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
      <div className="min-h-screen flex flex-col content-bg">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!mantra) {
    return (
      <div className="min-h-screen flex flex-col content-bg">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-700 mb-4">Mantra not found</h1>
            <p className="text-slate-500">The requested mantra could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col content-bg">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6"
            >
              {mantra.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-4 mb-8"
            >
              <Button onClick={handlePlay} className="bg-white text-purple-700 hover:bg-white/90">
                <Play className="h-4 w-4 mr-2" />
                Play Audio
              </Button>
              <Button onClick={handleShare} variant="outline" className="border-white text-white hover:bg-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center gap-6 text-white/80"
            >
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {mantra.view_count} views
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {mantra.deity}
              </span>
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {mantra.category}
              </span>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="glass-effect rounded-2xl border-0 mb-8">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Mantra Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeScript} onValueChange={setActiveScript}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="transliteration">Transliteration</TabsTrigger>
                        <TabsTrigger value="devanagari">Devanagari</TabsTrigger>
                      </TabsList>
                      <TabsContent value="transliteration" className="mt-6">
                        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                          <p className="text-2xl md:text-3xl font-playfair text-purple-800">
                            {mantra.transliteration}
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="devanagari" className="mt-6">
                        <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                          <p className="text-2xl md:text-3xl font-playfair text-purple-800">
                            {mantra.text}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="glass-effect rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Meaning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {mantra.meaning}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="glass-effect rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Deity</label>
                      <p className="text-slate-800 font-medium">{mantra.deity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Category</label>
                      <p className="text-slate-800 font-medium">{mantra.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Recitation Count</label>
                      <p className="text-slate-800 font-medium">{mantra.recitationCount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Best Time</label>
                      <p className="text-slate-800 font-medium">{mantra.bestTime}</p>
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
