'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface Deity {
  id: string
  name: string
  description: string
}

export function DeityGrid() {
  const [deities, setDeities] = useState<Deity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeities()
  }, [])

  const fetchDeities = async () => {
    try {
      const response = await fetch('/api/deities')
      if (response.ok) {
        const data = await response.json()
        setDeities(data.deities || [])
      } else {
        // If API fails, show demo data
        setDeities([
          { id: 'demo-1', name: 'Ganesha', description: 'Remover of obstacles' },
          { id: 'demo-2', name: 'Lakshmi', description: 'Goddess of wealth' },
          { id: 'demo-3', name: 'Saraswati', description: 'Goddess of wisdom' },
          { id: 'demo-4', name: 'Hanuman', description: 'Symbol of strength' },
          { id: 'demo-5', name: 'Shiva', description: 'The transformer' },
          { id: 'demo-6', name: 'Vishnu', description: 'The preserver' },
          { id: 'demo-7', name: 'Devi', description: 'Divine mother' },
          { id: 'demo-8', name: 'Krishna', description: 'God of love' }
        ])
      }
    } catch (error) {
      console.error('Error fetching deities:', error)
      // Show demo data on error
      setDeities([
        { id: 'demo-1', name: 'Ganesha', description: 'Remover of obstacles' },
        { id: 'demo-2', name: 'Lakshmi', description: 'Goddess of wealth' },
        { id: 'demo-3', name: 'Saraswati', description: 'Goddess of wisdom' },
        { id: 'demo-4', name: 'Hanuman', description: 'Symbol of strength' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {deities.map((deity) => (
        <Link key={deity.id} href={`/search?deity=${deity.name}`}>
          <Card className="card-outlined text-center group hover:shadow-lg hover:border-zinc-300 transition-all duration-300 h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-sm"></div>
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-title font-semibold text-zinc-900 group-hover:text-purple-600 transition-colors duration-200">
                    {deity.name}
                  </h3>
                  <p className="text-body-small text-zinc-600 line-clamp-2 leading-relaxed">
                    {deity.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}