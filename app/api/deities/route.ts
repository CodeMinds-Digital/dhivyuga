import { NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite-server'

export async function GET() {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DEITIES, [
      Query.equal('is_active', true),
      Query.orderAsc('name'),
      Query.limit(100),
    ])

    // Deduplicate by name (handles duplicate seeds)
    const seen = new Set<string>()
    const deities = result.documents
      .map(d => ({
        id: d.$id,
        name: d.name,
        description: d.description,
        is_active: d.is_active,
        created_at: d.$createdAt,
      }))
      .filter(deity => {
        if (seen.has(deity.name)) return false
        seen.add(deity.name)
        return true
      })

    return NextResponse.json({ deities })
  } catch (error) {
    console.error('Error fetching deities:', error)
    return NextResponse.json({ error: 'Failed to fetch deities' }, { status: 500 })
  }
}
