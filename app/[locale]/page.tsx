'use client'

import { useState, useEffect } from 'react'
import { SearchHero } from '@/components/search-hero'

export default function HomePage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories((d.categories || []).slice(0, 10)))
      .catch(() => {})
  }, [])

  return <SearchHero categories={categories} showChips={categories.length > 0} />
}
