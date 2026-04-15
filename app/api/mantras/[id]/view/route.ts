import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: mantraId } = await params

  try {
    const currentMantra = await databases.getDocument(DATABASE_ID, COLLECTIONS.MANTRAS, mantraId)
    const newViewCount = (currentMantra.view_count || 0) + 1

    await databases.updateDocument(DATABASE_ID, COLLECTIONS.MANTRAS, mantraId, {
      view_count: newViewCount,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
