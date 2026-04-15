import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS, Query, ID, validateAdminSecret } from '@/lib/appwrite-server'

export async function GET() {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LANGUAGES, [
      Query.equal('is_active', true),
      Query.orderAsc('sort_order'),
      Query.limit(100),
    ])

    const languages = result.documents.map(d => ({
      id: d.$id,
      code: d.code,
      name: d.name,
      native_name: d.native_name,
      direction: d.direction,
      sort_order: d.sort_order,
      is_active: d.is_active,
      created_at: d.$createdAt,
      updated_at: d.$updatedAt,
    }))

    return NextResponse.json({ languages })
  } catch (error) {
    console.error('Languages fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, native_name, direction = 'ltr', sort_order = 0 } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.LANGUAGES, ID.unique(), {
      code, name, native_name: native_name || '', direction, sort_order, is_active: true,
    })

    return NextResponse.json({
      language: { id: doc.$id, code: doc.code, name: doc.name, native_name: doc.native_name, direction: doc.direction, sort_order: doc.sort_order, is_active: doc.is_active, created_at: doc.$createdAt, updated_at: doc.$updatedAt }
    }, { status: 201 })
  } catch (error) {
    console.error('Language creation error:', error)
    return NextResponse.json({ error: 'Failed to create language' }, { status: 500 })
  }
}
