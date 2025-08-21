import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const deity = searchParams.get('deity')
  const time = searchParams.get('time')
  const kalam = searchParams.get('kalam')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    if (query) {
      // Use PostgreSQL full-text search with ranking
      let searchQuery = supabase
        .from('mantras')
        .select(`
          *,
          deities(name),
          categories(name),
          recitation_counts(count_value),
          recitation_times(name),
          kalams(name, is_auspicious),
          time_ranges(start_time, end_time)
        `)
        .textSearch('search_vector', query)

      // Apply filters
      if (category) {
        searchQuery = searchQuery.eq('category_id', category)
      }
      if (deity) {
        searchQuery = searchQuery.eq('deity_id', deity)
      }
      if (time) {
        searchQuery = searchQuery.eq('time_id', time)
      }
      if (kalam) {
        searchQuery = searchQuery.eq('kalam_id', kalam)
      }

      const { data: mantras, error } = await searchQuery
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
      }

      return NextResponse.json({
        mantras: mantras || [],
        total: mantras?.length || 0
      })
    } else {
      // No query - return filtered results
      let supabaseQuery = supabase
        .from('mantras')
        .select(`
          *,
          deities(name),
          categories(name),
          recitation_counts(count_value),
          recitation_times(name),
          kalams(name, is_auspicious),
          time_ranges(start_time, end_time)
        `)

      // Apply filters
      if (category) {
        supabaseQuery = supabaseQuery.eq('category_id', category)
      }
      if (deity) {
        supabaseQuery = supabaseQuery.eq('deity_id', deity)
      }
      if (time) {
        supabaseQuery = supabaseQuery.eq('time_id', time)
      }
      if (kalam) {
        supabaseQuery = supabaseQuery.eq('kalam_id', kalam)
      }

      const { data: mantras, error } = await supabaseQuery
        .order('view_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
      }

      return NextResponse.json({
        mantras: mantras || [],
        total: mantras?.length || 0
      })
    }
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}