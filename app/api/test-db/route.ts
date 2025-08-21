import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Check languages
    const { data: languages, error: langError } = await supabase
      .from('languages')
      .select('*')
      .limit(5)
    
    if (langError) {
      console.error('❌ Languages error:', langError)
      return NextResponse.json({ 
        error: 'Languages fetch failed', 
        details: langError 
      }, { status: 500 })
    }

    // Test 2: Check mantras
    const { data: mantras, error: mantraError } = await supabase
      .from('mantras')
      .select('id, title')
      .limit(5)
    
    if (mantraError) {
      console.error('❌ Mantras error:', mantraError)
      return NextResponse.json({ 
        error: 'Mantras fetch failed', 
        details: mantraError 
      }, { status: 500 })
    }

    // Test 3: Check translations
    const { data: translations, error: transError } = await supabase
      .from('mantra_translations')
      .select('*')
      .limit(5)
    
    if (transError) {
      console.error('❌ Translations error:', transError)
      return NextResponse.json({ 
        error: 'Translations fetch failed', 
        details: transError 
      }, { status: 500 })
    }

    // Test 4: Check if we can insert a test translation
    const testMantraId = mantras?.[0]?.id
    const testLanguageId = languages?.[0]?.id
    
    let insertTest = null
    if (testMantraId && testLanguageId) {
      const { data: insertData, error: insertError } = await supabase
        .from('mantra_translations')
        .insert({
          mantra_id: testMantraId,
          language_id: testLanguageId,
          text: 'Test translation - ' + new Date().toISOString(),
          transliteration: 'Test transliteration'
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Insert test error:', insertError)
        insertTest = { error: insertError.message }
      } else {
        console.log('✅ Insert test successful:', insertData)
        insertTest = { success: true, id: insertData.id }
        
        // Clean up test data
        await supabase
          .from('mantra_translations')
          .delete()
          .eq('id', insertData.id)
      }
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        languages: {
          count: languages?.length || 0,
          sample: languages?.slice(0, 2)
        },
        mantras: {
          count: mantras?.length || 0,
          sample: mantras?.slice(0, 2)
        },
        translations: {
          count: translations?.length || 0,
          sample: translations?.slice(0, 2)
        },
        insertTest
      }
    }

    console.log('✅ Database test results:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({ 
      error: 'Database test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
