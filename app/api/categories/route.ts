import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query, ID, validateAdminSecret } from '@/lib/appwrite-server'

export async function GET() {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES, [
      Query.equal('is_active', true),
      Query.orderAsc('name'),
      Query.limit(100),
    ])

    // Deduplicate by name (handles duplicate seeds)
    const seen = new Set<string>()
    const categories = result.documents
      .map(d => ({
        id: d.$id,
        name: d.name,
        description: d.description,
        is_active: d.is_active,
        created_at: d.$createdAt,
      }))
      .filter(cat => {
        if (seen.has(cat.name)) return false
        seen.add(cat.name)
        return true
      })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdminSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, ID.unique(), {
      name,
      description: description || '',
      is_active: true,
    })

    return NextResponse.json({
      category: { id: doc.$id, name: doc.name, description: doc.description, is_active: doc.is_active, created_at: doc.$createdAt }
    }, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
