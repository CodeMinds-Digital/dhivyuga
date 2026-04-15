import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query, getRelatedDoc } from '@/lib/appwrite-server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const category = searchParams.get('category')
  const deity = searchParams.get('deity')
  const time = searchParams.get('time')
  const kalam = searchParams.get('kalam')
  const rawLimit = parseInt(searchParams.get('limit') || '20', 10)
  const limit = isNaN(rawLimit) || rawLimit < 1 ? 20 : Math.min(rawLimit, 50)

  try {
    const queries: string[] = []

    if (query) {
      queries.push(Query.search('title', query))
    }
    if (category) {
      queries.push(Query.equal('category_id', category))
    }
    if (deity) {
      queries.push(Query.equal('deity_id', deity))
    }
    if (time) {
      queries.push(Query.equal('time_id', time))
    }
    if (kalam) {
      queries.push(Query.equal('kalam_id', kalam))
    }

    queries.push(Query.orderDesc('view_count'))
    queries.push(Query.limit(limit))

    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRAS, queries)

    // If text search query provided and few title results, also search text field
    let allDocs = result.documents
    if (query && result.documents.length < 5) {
      try {
        const textResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRAS, [
          Query.search('text', query),
          Query.orderDesc('view_count'),
          Query.limit(limit),
        ])
        const existingIds = new Set(allDocs.map(d => d.$id))
        for (const doc of textResult.documents) {
          if (!existingIds.has(doc.$id)) {
            allDocs.push(doc)
          }
        }
      } catch {
        // text search may fail if no fulltext index, ignore
      }
    }

    // Fetch related deities and categories for all mantras
    const uniqueDeityIds = Array.from(new Set(allDocs.map(d => d.deity_id).filter(Boolean)))
    const uniqueCategoryIds = Array.from(new Set(allDocs.map(d => d.category_id).filter(Boolean)))
    const mantraIds = allDocs.slice(0, limit).map(d => d.$id)

    const [deitiesMap, categoriesMap, translationsMap] = await Promise.all([
      fetchDocMap(COLLECTIONS.DEITIES, uniqueDeityIds),
      fetchDocMap(COLLECTIONS.CATEGORIES, uniqueCategoryIds),
      fetchTranslationsForMantras(mantraIds),
    ])

    const mantras = allDocs.slice(0, limit).map(d => ({
      id: d.$id,
      title: d.title,
      text: d.text,
      category_id: d.category_id,
      deity_id: d.deity_id,
      count_id: d.count_id,
      time_id: d.time_id,
      kalam_id: d.kalam_id,
      range_id: d.range_id,
      view_count: d.view_count,
      created_at: d.$createdAt,
      deities: d.deity_id && deitiesMap[d.deity_id] ? { name: deitiesMap[d.deity_id].name } : null,
      categories: d.category_id && categoriesMap[d.category_id] ? { name: categoriesMap[d.category_id].name } : null,
      translations: translationsMap[d.$id] || [],
    }))

    return NextResponse.json({
      mantras,
      total: mantras.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

async function fetchDocMap(collectionId: string, ids: string[]): Promise<Record<string, any>> {
  if (ids.length === 0) return {}
  const map: Record<string, any> = {}
  const results = await Promise.all(ids.map(id => getRelatedDoc(collectionId, id)))
  ids.forEach((id, i) => {
    if (results[i]) map[id] = results[i]
  })
  return map
}

async function fetchTranslationsForMantras(mantraIds: string[]): Promise<Record<string, any[]>> {
  const map: Record<string, any[]> = {}
  if (mantraIds.length === 0) return map

  // Pre-fetch all languages once
  const langsResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LANGUAGES, [Query.limit(20)])
  const langMap: Record<string, string> = {}
  for (const lang of langsResult.documents) {
    langMap[lang.$id] = lang.code
  }

  // Fetch translations for all mantras in parallel
  const results = await Promise.all(
    mantraIds.map(async (id) => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRA_TRANSLATIONS, [
          Query.equal('mantra_id', id),
          Query.limit(10),
        ])
        const translations = res.documents.map(t => ({
          language_code: langMap[t.language_id] || '',
          text: t.text,
          meaning: t.meaning,
        }))
        return { id, translations }
      } catch {
        return { id, translations: [] }
      }
    })
  )

  for (const r of results) {
    map[r.id] = r.translations
  }
  return map
}
