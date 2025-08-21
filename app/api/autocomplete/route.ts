import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    // Get autocomplete suggestions from mantras, deities, and categories
    const [mantrasResult, deitiesResult, categoriesResult] = await Promise.all([
      // Mantra titles
      supabase
        .from('mantras')
        .select('title')
        .ilike('title', `${query}%`)
        .limit(limit),
      
      // Deity names
      supabase
        .from('deities')
        .select('name')
        .ilike('name', `${query}%`)
        .limit(limit),
      
      // Category names
      supabase
        .from('categories')
        .select('name')
        .ilike('name', `${query}%`)
        .limit(limit)
    ])

    const suggestions = [
      ...(mantrasResult.data?.map(m => ({ text: m.title, type: 'mantra' })) || []),
      ...(deitiesResult.data?.map(d => ({ text: d.name, type: 'deity' })) || []),
      ...(categoriesResult.data?.map(c => ({ text: c.name, type: 'category' })) || [])
    ].slice(0, limit)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Autocomplete error:', error)
    return NextResponse.json({ error: 'Autocomplete failed' }, { status: 500 })
  }
}
