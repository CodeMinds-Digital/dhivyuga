import { NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite-server'

export async function GET() {
  try {
    const [categoriesResult, deitiesResult, timesResult, kalamsResult] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES, [Query.orderAsc('name'), Query.limit(100)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.DEITIES, [Query.orderAsc('name'), Query.limit(100)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.RECITATION_TIMES, [Query.orderAsc('name'), Query.limit(100)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.KALAMS, [Query.orderAsc('name'), Query.limit(100)]),
    ])

    return NextResponse.json({
      categories: categoriesResult.documents.map(d => ({ id: d.$id, name: d.name, description: d.description })),
      deities: deitiesResult.documents.map(d => ({ id: d.$id, name: d.name, description: d.description })),
      recitation_times: timesResult.documents.map(d => ({ id: d.$id, name: d.name, description: d.description })),
      kalams: kalamsResult.documents.map(d => ({ id: d.$id, name: d.name, description: d.description, is_auspicious: d.is_auspicious })),
    })
  } catch (error) {
    console.error('Filters error:', error)
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
  }
}
