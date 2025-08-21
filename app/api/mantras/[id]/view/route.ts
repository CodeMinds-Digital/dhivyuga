import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const mantraId = params.id

  try {
    // First get current view count
    const { data: currentMantra } = await supabase
      .from('mantras')
      .select('view_count')
      .eq('id', mantraId)
      .single()

    // Increment view count
    const newViewCount = (currentMantra?.view_count || 0) + 1
    const { error } = await supabase
      .from('mantras')
      .update({ view_count: newViewCount })
      .eq('id', mantraId)

    if (error) {
      console.error('View tracking error:', error)
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}