import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const mantraId = '550e8400-e29b-41d4-a716-446655440001'
    
    console.log('🧪 Testing translation insert for mantra:', mantraId)
    
    // 1. Check if mantra exists
    const { data: mantra, error: mantraError } = await supabase
      .from('mantras')
      .select('id, title')
      .eq('id', mantraId)
      .single()
    
    if (mantraError || !mantra) {
      return NextResponse.json({ 
        error: 'Mantra not found', 
        details: mantraError 
      }, { status: 404 })
    }
    
    console.log('✅ Mantra found:', mantra)
    
    // 2. Get English language ID
    const { data: language, error: langError } = await supabase
      .from('languages')
      .select('id, name, code')
      .eq('code', 'en')
      .single()
    
    if (langError || !language) {
      return NextResponse.json({ 
        error: 'English language not found', 
        details: langError 
      }, { status: 404 })
    }
    
    console.log('✅ Language found:', language)
    
    // 3. Check if translation already exists
    const { data: existing, error: existingError } = await supabase
      .from('mantra_translations')
      .select('*')
      .eq('mantra_id', mantraId)
      .eq('language_id', language.id)
      .single()
    
    if (existing) {
      console.log('ℹ️ Translation already exists:', existing.id)
      return NextResponse.json({ 
        message: 'Translation already exists',
        translation: existing
      })
    }
    
    // 4. Insert test translation
    const testTranslation = {
      mantra_id: mantraId,
      language_id: language.id,
      text: '<p><strong>Om Gam Ganapataye Namaha</strong></p><p>Test translation created at ' + new Date().toISOString() + '</p>',
      transliteration: 'Om Gam Ganapataye Namaha',
      pronunciation_guide: 'Om (AUM) - Gam (GAHM) - Ga-na-pa-ta-ye (Gah-nah-pah-tah-yeh) - Na-ma-ha (Nah-mah-hah)',
      meaning: '<p>Test meaning: Salutations to Lord Ganesha, the remover of obstacles.</p>',
      benefits: ['Test benefit 1', 'Test benefit 2', 'Test benefit 3'],
      usage_notes: '<p>Test usage notes</p>'
    }
    
    console.log('➕ Inserting test translation:', testTranslation)
    
    const { data: newTranslation, error: insertError } = await supabase
      .from('mantra_translations')
      .insert(testTranslation)
      .select(`
        *,
        languages(id, code, name, native_name, direction)
      `)
      .single()
    
    if (insertError) {
      console.error('❌ Insert error:', insertError)
      return NextResponse.json({ 
        error: 'Failed to insert translation', 
        details: insertError 
      }, { status: 500 })
    }
    
    console.log('✅ Translation inserted successfully:', newTranslation)
    
    // 5. Verify by fetching all translations for this mantra
    const { data: allTranslations, error: fetchError } = await supabase
      .from('mantra_translations')
      .select(`
        *,
        languages(id, code, name, native_name, direction)
      `)
      .eq('mantra_id', mantraId)
    
    console.log('📊 All translations for mantra:', allTranslations)
    
    return NextResponse.json({
      success: true,
      message: 'Test translation created successfully',
      newTranslation,
      allTranslations,
      mantra,
      language
    })
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
