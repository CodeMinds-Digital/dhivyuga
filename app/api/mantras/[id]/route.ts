import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query, getRelatedDoc } from '@/lib/appwrite-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: mantraId } = await params

  try {
    const mantra = await databases.getDocument(DATABASE_ID, COLLECTIONS.MANTRAS, mantraId)

    // Fetch all related entities in parallel
    const [deity, category, recitationCount, recitationTime, kalam, timeRange] = await Promise.all([
      getRelatedDoc(COLLECTIONS.DEITIES, mantra.deity_id),
      getRelatedDoc(COLLECTIONS.CATEGORIES, mantra.category_id),
      getRelatedDoc(COLLECTIONS.RECITATION_COUNTS, mantra.count_id),
      getRelatedDoc(COLLECTIONS.RECITATION_TIMES, mantra.time_id),
      getRelatedDoc(COLLECTIONS.KALAMS, mantra.kalam_id),
      getRelatedDoc(COLLECTIONS.TIME_RANGES, mantra.range_id),
    ])

    // Fetch translations
    const translationsResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, [
      Query.equal('mantra_id', mantraId),
      Query.limit(50),
    ])

    // Fetch language info for each translation
    const translationsWithLang = await Promise.all(
      translationsResult.documents.map(async (t) => {
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
            sort_order: lang.sort_order,
          } : null,
        }
      })
    )

    // Sort by language sort_order
    const sortedTranslations = translationsWithLang.sort(
      (a, b) => (a.languages?.sort_order || 0) - (b.languages?.sort_order || 0)
    )

    // Fetch related mantras (same deity or category)
    const relatedQueries: string[][] = []
    if (mantra.deity_id) {
      relatedQueries.push([Query.equal('deity_id', mantra.deity_id), Query.notEqual('$id', mantraId), Query.orderDesc('view_count'), Query.limit(4)])
    }
    if (mantra.category_id) {
      relatedQueries.push([Query.equal('category_id', mantra.category_id), Query.notEqual('$id', mantraId), Query.orderDesc('view_count'), Query.limit(4)])
    }

    let relatedMantras: any[] = []
    if (relatedQueries.length > 0) {
      const relatedResults = await Promise.all(
        relatedQueries.map(q => databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRAS, q).catch(() => ({ documents: [] })))
      )
      const seenIds = new Set<string>()
      for (const r of relatedResults) {
        for (const doc of r.documents) {
          if (!seenIds.has(doc.$id)) {
            seenIds.add(doc.$id)
            const [rDeity, rCategory] = await Promise.all([
              getRelatedDoc(COLLECTIONS.DEITIES, doc.deity_id),
              getRelatedDoc(COLLECTIONS.CATEGORIES, doc.category_id),
            ])
            relatedMantras.push({
              id: doc.$id,
              title: doc.title,
              view_count: doc.view_count,
              deities: rDeity ? { name: rDeity.name } : null,
              categories: rCategory ? { name: rCategory.name } : null,
            })
          }
        }
      }
      relatedMantras = relatedMantras.slice(0, 4)
    }

    const mantraResponse = {
      id: mantra.$id,
      title: mantra.title,
      text: mantra.text,
      category_id: mantra.category_id,
      deity_id: mantra.deity_id,
      count_id: mantra.count_id,
      time_id: mantra.time_id,
      kalam_id: mantra.kalam_id,
      range_id: mantra.range_id,
      view_count: mantra.view_count,
      created_at: mantra.$createdAt,
      deities: deity ? { id: deity.$id, name: deity.name, description: deity.description } : null,
      categories: category ? { id: category.$id, name: category.name, description: category.description } : null,
      recitation_counts: recitationCount ? { id: recitationCount.$id, count_value: recitationCount.count_value, description: recitationCount.description } : null,
      recitation_times: recitationTime ? { id: recitationTime.$id, name: recitationTime.name, description: recitationTime.description } : null,
      kalams: kalam ? { id: kalam.$id, name: kalam.name, description: kalam.description, is_auspicious: kalam.is_auspicious } : null,
      time_ranges: timeRange ? { id: timeRange.$id, start_time: timeRange.start_time, end_time: timeRange.end_time, description: timeRange.description } : null,
      translations: sortedTranslations,
    }

    return NextResponse.json({
      mantra: mantraResponse,
      related_mantras: relatedMantras,
    })
  } catch (error: any) {
    console.error('Mantra fetch error:', error)
    if (error?.code === 404) {
      return NextResponse.json({ error: 'Mantra not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to fetch mantra' }, { status: 500 })
  }
}
