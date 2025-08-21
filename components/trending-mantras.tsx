'use client'

import { useEffect, useState } from 'react'
import { MantraCard } from '@/components/mantra-card'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface Mantra {
  id: string
  title: string
  text: string
  view_count: number
  deities?: { name: string }
  categories?: { name: string }
}

export function TrendingMantras() {
  const [mantras, setMantras] = useState<Mantra[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingMantras()
  }, [])

  const fetchTrendingMantras = async () => {
    try {
      const response = await fetch('/api/mantras/trending')
      if (response.ok) {
        const data = await response.json()
        setMantras(data.mantras || [])
      } else {
        // If API fails, show demo data
        setMantras([
          {
            id: 'demo-1',
            title: 'Om Gam Ganapataye Namaha',
            text: 'Salutations to Lord Ganesha, remover of obstacles',
            view_count: 150,
            deities: { name: 'Ganesha' },
            categories: { name: 'Obstacle Removal' }
          },
          {
            id: 'demo-2',
            title: 'Om Shreem Mahalakshmiyei Namaha',
            text: 'Salutations to Goddess Lakshmi for wealth and prosperity',
            view_count: 120,
            deities: { name: 'Lakshmi' },
            categories: { name: 'Wealth' }
          },
          {
            id: 'demo-3',
            title: 'Om Aim Saraswatyai Namaha',
            text: 'Salutations to Goddess Saraswati for wisdom and knowledge',
            view_count: 95,
            deities: { name: 'Saraswati' },
            categories: { name: 'Wisdom' }
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching trending mantras:', error)
      // Show demo data on error
      setMantras([
        {
          id: 'demo-1',
          title: 'Om Gam Ganapataye Namaha',
          text: 'Salutations to Lord Ganesha, remover of obstacles',
          view_count: 150,
          deities: { name: 'Ganesha' },
          categories: { name: 'Obstacle Removal' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mantras.map((mantra, index) => (
        <motion.div
          key={mantra.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MantraCard mantra={mantra} />
        </motion.div>
      ))}
    </div>
  )
}