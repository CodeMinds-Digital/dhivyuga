import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all filter options for dropdowns
    const [categoriesResult, deitiesResult, timesResult, kalamsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, description')
        .order('name'),
      
      supabase
        .from('deities')
        .select('id, name, description')
        .order('name'),
      
      supabase
        .from('recitation_times')
        .select('id, name, description')
        .order('name'),
      
      supabase
        .from('kalams')
        .select('id, name, description, is_auspicious')
        .order('name')
    ])

    if (categoriesResult.error || deitiesResult.error || timesResult.error || kalamsResult.error) {
      console.error('Filters error:', {
        categories: categoriesResult.error,
        deities: deitiesResult.error,
        times: timesResult.error,
        kalams: kalamsResult.error
      })
      return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
    }

    return NextResponse.json({
      categories: categoriesResult.data || [],
      deities: deitiesResult.data || [],
      recitation_times: timesResult.data || [],
      kalams: kalamsResult.data || []
    })
  } catch (error) {
    console.error('Filters error:', error)
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
  }
}
