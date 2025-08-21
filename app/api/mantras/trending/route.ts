import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: mantras, error } = await supabase
      .from('mantras')
      .select(`
        *,
        deities(name),
        categories(name)
      `)
      .order('view_count', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching trending mantras:', error)
      return NextResponse.json({ error: 'Failed to fetch mantras' }, { status: 500 })
    }

    return NextResponse.json({ mantras })
  } catch (error) {
    console.error('Error fetching trending mantras:', error)
    return NextResponse.json({ error: 'Failed to fetch mantras' }, { status: 500 })
  }
}