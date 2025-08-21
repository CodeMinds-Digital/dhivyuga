import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: languages, error } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Languages fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 })
    }

    return NextResponse.json({ languages })
  } catch (error) {
    console.error('Languages fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, native_name, direction = 'ltr', sort_order = 0 } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    const { data: language, error } = await supabase
      .from('languages')
      .insert({
        code,
        name,
        native_name,
        direction,
        sort_order,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Language creation error:', error)
      return NextResponse.json({ error: 'Failed to create language' }, { status: 500 })
    }

    return NextResponse.json({ language }, { status: 201 })
  } catch (error) {
    console.error('Language creation error:', error)
    return NextResponse.json({ error: 'Failed to create language' }, { status: 500 })
  }
}
