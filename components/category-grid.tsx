'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Tag } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  mantra_count?: number
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      } else {
        // If API fails, show demo data
        setCategories([
          { id: 'demo-1', name: 'Good Fortune', description: 'Mantras for positive energy and luck', mantra_count: 15 },
          { id: 'demo-2', name: 'Protection', description: 'Sacred chants for divine protection', mantra_count: 12 },
          { id: 'demo-3', name: 'Wealth', description: 'Prosperity and abundance mantras', mantra_count: 18 },
          { id: 'demo-4', name: 'Health', description: 'Healing and wellness mantras', mantra_count: 10 },
          { id: 'demo-5', name: 'Wisdom', description: 'Knowledge and enlightenment', mantra_count: 14 },
          { id: 'demo-6', name: 'Love', description: 'Mantras for love and relationships', mantra_count: 8 },
          { id: 'demo-7', name: 'Peace', description: 'Inner peace and tranquility', mantra_count: 11 },
          { id: 'demo-8', name: 'Success', description: 'Achievement and victory mantras', mantra_count: 13 }
        ])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Show demo data on error
      setCategories([
        { id: 'demo-1', name: 'Good Fortune', description: 'Mantras for positive energy and luck', mantra_count: 15 },
        { id: 'demo-2', name: 'Protection', description: 'Sacred chants for divine protection', mantra_count: 12 },
        { id: 'demo-3', name: 'Wealth', description: 'Prosperity and abundance mantras', mantra_count: 18 },
        { id: 'demo-4', name: 'Health', description: 'Healing and wellness mantras', mantra_count: 10 }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse glass-effect rounded-2xl border-0">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/search?category=${category.name}`}>
          <Card className="card-outlined text-center group hover:shadow-lg hover:border-zinc-300 transition-all duration-300 h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <Tag className="w-7 h-7 text-blue-600" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-title font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-body-small text-zinc-600 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
              {category.mantra_count && (
                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <div className="text-label text-zinc-500 font-medium">
                    {category.mantra_count} mantras
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
