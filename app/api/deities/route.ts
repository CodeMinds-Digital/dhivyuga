import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: deities, error } = await supabase
      .from('deities')
      .select('*')
      .eq('is_active', true)  // Only return active deities
      .order('name')

    if (error) {
      console.error('Error fetching deities:', error)
      return NextResponse.json({ error: 'Failed to fetch deities' }, { status: 500 })
    }

    return NextResponse.json({ deities })
  } catch (error) {
    console.error('Error fetching deities:', error)
    return NextResponse.json({ error: 'Failed to fetch deities' }, { status: 500 })
  }
}