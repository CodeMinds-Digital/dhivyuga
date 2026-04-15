import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query, ID, getRelatedDoc, validateAdminSecret } from '@/lib/appwrite-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: mantraId } = await params

  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, [
      Query.equal('mantra_id', mantraId),
      Query.limit(50),
    ])

    const translations = await Promise.all(
      result.documents.map(async (t) => {
        const lang = await getRelatedDoc(COLLECTIONS.LANGUAGES, t.language_id)
        return {
          id: t.$id,
          mantra_id: t.mantra_id,
          language_id: t.language_id,
          text: t.text,
          transliteration: t.transliteration,
          pronunciation_guide: t.pronunciation_guide,
          meaning: t.meaning,
          benefits: t.benefits,
          usage_notes: t.usage_notes,
          created_at: t.$createdAt,
          updated_at: t.$updatedAt,
          languages: lang ? {
            id: lang.$id,
            code: lang.code,
            name: lang.name,
            native_name: lang.native_name,
            direction: lang.direction,
          } : null,
        }
      })
    )

    // Sort by language sort_order
    translations.sort((a, b) => {
      const aOrder = a.languages ? (a.languages as any).sort_order || 0 : 0
      const bOrder = b.languages ? (b.languages as any).sort_order || 0 : 0
      return aOrder - bOrder
    })

    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Translations fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: mantraId } = await params

  try {
    const body = await request.json()
    const { language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes } = body

    if (!language_id || !text) {
      return NextResponse.json({ error: 'Language ID and text are required' }, { status: 400 })
    }

    const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, ID.unique(), {
      mantra_id: mantraId,
      language_id,
      text,
      transliteration: transliteration || '',
      pronunciation_guide: pronunciation_guide || '',
      meaning: meaning || '',
      benefits: benefits || '',
      usage_notes: usage_notes || '',
    })

    const lang = await getRelatedDoc(COLLECTIONS.LANGUAGES, doc.language_id)

    return NextResponse.json({
      translation: {
        id: doc.$id,
        mantra_id: doc.mantra_id,
        language_id: doc.language_id,
        text: doc.text,
        transliteration: doc.transliteration,
        pronunciation_guide: doc.pronunciation_guide,
        meaning: doc.meaning,
        benefits: doc.benefits,
        usage_notes: doc.usage_notes,
        languages: lang ? { id: lang.$id, code: lang.code, name: lang.name, native_name: lang.native_name, direction: lang.direction } : null,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Translation creation error:', error)
    return NextResponse.json({ error: 'Failed to create translation' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: mantraId } = await params

  try {
    const body = await request.json()
    const { translation_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes } = body

    if (!translation_id || !language_id || !text) {
      return NextResponse.json({ error: 'Translation ID, language ID and text are required' }, { status: 400 })
    }

    // Verify translation belongs to this mantra
    const existing = await databases.getDocument(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, translation_id)
    if (existing.mantra_id !== mantraId) {
      return NextResponse.json({ error: 'Translation not found for this mantra' }, { status: 404 })
    }

    const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, translation_id, {
      text,
      transliteration: transliteration || '',
      pronunciation_guide: pronunciation_guide || '',
      meaning: meaning || '',
      benefits: benefits || '',
      usage_notes: usage_notes || '',
    })

    const lang = await getRelatedDoc(COLLECTIONS.LANGUAGES, doc.language_id)

    return NextResponse.json({
      translation: {
        id: doc.$id,
        mantra_id: doc.mantra_id,
        language_id: doc.language_id,
        text: doc.text,
        transliteration: doc.transliteration,
        pronunciation_guide: doc.pronunciation_guide,
        meaning: doc.meaning,
        benefits: doc.benefits,
        usage_notes: doc.usage_notes,
        languages: lang ? { id: lang.$id, code: lang.code, name: lang.name, native_name: lang.native_name, direction: lang.direction } : null,
      }
    })
  } catch (error) {
    console.error('Translation update error:', error)
    return NextResponse.json({ error: 'Failed to update translation' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: mantraId } = await params
  const url = new URL(request.url)
  const translationId = url.searchParams.get('translation_id')

  if (!translationId) {
    return NextResponse.json({ error: 'Translation ID is required' }, { status: 400 })
  }

  try {
    // Verify translation belongs to this mantra
    const existing = await databases.getDocument(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, translationId)
    if (existing.mantra_id !== mantraId) {
      return NextResponse.json({ error: 'Translation not found for this mantra' }, { status: 404 })
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, translationId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Translation deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete translation' }, { status: 500 })
  }
}
