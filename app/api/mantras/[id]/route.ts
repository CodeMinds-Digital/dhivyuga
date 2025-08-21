import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const mantraId = params.id

  try {
    const { data: mantra, error } = await supabase
      .from('mantras')
      .select(`
        *,
        deities(id, name, description),
        categories(id, name, description),
        recitation_counts(id, count_value, description),
        recitation_times(id, name, description),
        kalams(id, name, description, is_auspicious),
        time_ranges(id, start_time, end_time, description)
      `)
      .eq('id', mantraId)
      .single()

    if (error) {
      console.error('Mantra fetch error:', error)
      return NextResponse.json({ error: 'Mantra not found' }, { status: 404 })
    }

    // Get related mantras (same deity or category)
    const { data: relatedMantras } = await supabase
      .from('mantras')
      .select(`
        id,
        title,
        view_count,
        deities(name),
        categories(name)
      `)
      .or(`deity_id.eq.${mantra.deity_id},category_id.eq.${mantra.category_id}`)
      .neq('id', mantraId)
      .order('view_count', { ascending: false })
      .limit(4)

    return NextResponse.json({
      mantra,
      related_mantras: relatedMantras || []
    })
  } catch (error) {
    console.error('Mantra fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch mantra' }, { status: 500 })
  }
}
