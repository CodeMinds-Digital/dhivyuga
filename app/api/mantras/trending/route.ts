import { NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query, getRelatedDoc } from '@/lib/appwrite-server'

export async function GET() {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MANTRAS, [
      Query.orderDesc('view_count'),
      Query.limit(6),
    ])

    // Fetch related deities and categories
    const mantras = await Promise.all(
      result.documents.map(async (d) => {
        const [deity, category] = await Promise.all([
          getRelatedDoc(COLLECTIONS.DEITIES, d.deity_id),
          getRelatedDoc(COLLECTIONS.CATEGORIES, d.category_id),
        ])
        return {
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
          deities: deity ? { name: deity.name } : null,
          categories: category ? { name: category.name } : null,
        }
      })
    )

    return NextResponse.json({ mantras })
  } catch (error) {
    console.error('Error fetching trending mantras:', error)
    return NextResponse.json({ error: 'Failed to fetch mantras' }, { status: 500 })
  }
}
