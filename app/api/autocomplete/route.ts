import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite-server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const [mantrasResult, deitiesResult, categoriesResult] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRAS, [
        Query.search('title', query),
        Query.limit(limit),
      ]).catch(() => ({ documents: [] })),

      databases.listDocuments(DATABASE_ID, COLLECTIONS.DEITIES, [
        Query.search('name', query),
        Query.limit(limit),
      ]).catch(() => ({ documents: [] })),

      databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES, [
        Query.search('name', query),
        Query.limit(limit),
      ]).catch(() => ({ documents: [] })),
    ])

    const suggestions = [
      ...mantrasResult.documents.map((m: any) => ({ text: m.title, type: 'mantra' })),
      ...deitiesResult.documents.map((d: any) => ({ text: d.name, type: 'deity' })),
      ...categoriesResult.documents.map((c: any) => ({ text: c.name, type: 'category' })),
    ].slice(0, limit)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Autocomplete error:', error)
    return NextResponse.json({ error: 'Autocomplete failed' }, { status: 500 })
  }
}
