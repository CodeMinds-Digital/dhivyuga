import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const mantraId = params.id

  try {
    const { data: translations, error } = await supabase
      .from('mantra_translations')
      .select(`
        *,
        languages(id, code, name, native_name, direction)
      `)
      .eq('mantra_id', mantraId)
      .order('languages(sort_order)')

    if (error) {
      console.error('Translations fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
    }

    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Translations fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const mantraId = params.id

  try {
    const body = await request.json()
    const { 
      language_id, 
      text, 
      transliteration, 
      pronunciation_guide, 
      meaning, 
      benefits, 
      usage_notes 
    } = body

    if (!language_id || !text) {
      return NextResponse.json({ error: 'Language ID and text are required' }, { status: 400 })
    }

    const { data: translation, error } = await supabase
      .from('mantra_translations')
      .insert({
        mantra_id: mantraId,
        language_id,
        text,
        transliteration,
        pronunciation_guide,
        meaning,
        benefits,
        usage_notes
      })
      .select(`
        *,
        languages(id, code, name, native_name, direction)
      `)
      .single()

    if (error) {
      console.error('Translation creation error:', error)
      return NextResponse.json({ error: 'Failed to create translation' }, { status: 500 })
    }

    return NextResponse.json({ translation }, { status: 201 })
  } catch (error) {
    console.error('Translation creation error:', error)
    return NextResponse.json({ error: 'Failed to create translation' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const mantraId = params.id

  try {
    const body = await request.json()
    const { 
      translation_id,
      language_id, 
      text, 
      transliteration, 
      pronunciation_guide, 
      meaning, 
      benefits, 
      usage_notes 
    } = body

    if (!translation_id || !language_id || !text) {
      return NextResponse.json({ error: 'Translation ID, language ID and text are required' }, { status: 400 })
    }

    const { data: translation, error } = await supabase
      .from('mantra_translations')
      .update({
        text,
        transliteration,
        pronunciation_guide,
        meaning,
        benefits,
        usage_notes
      })
      .eq('id', translation_id)
      .eq('mantra_id', mantraId)
      .select(`
        *,
        languages(id, code, name, native_name, direction)
      `)
      .single()

    if (error) {
      console.error('Translation update error:', error)
      return NextResponse.json({ error: 'Failed to update translation' }, { status: 500 })
    }

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Translation update error:', error)
    return NextResponse.json({ error: 'Failed to update translation' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const mantraId = params.id
  const url = new URL(request.url)
  const translationId = url.searchParams.get('translation_id')

  if (!translationId) {
    return NextResponse.json({ error: 'Translation ID is required' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('mantra_translations')
      .delete()
      .eq('id', translationId)
      .eq('mantra_id', mantraId)

    if (error) {
      console.error('Translation deletion error:', error)
      return NextResponse.json({ error: 'Failed to delete translation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Translation deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete translation' }, { status: 500 })
  }
}
