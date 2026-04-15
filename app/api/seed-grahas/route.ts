import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, DATABASE_ID, COLLECTIONS, Query, ID, validateAdminSecret } from '@/lib/appwrite-server'

const grahasData = [
  { name: 'Surya (Sun)', sanskrit_name: 'सूर्य', description: 'The Sun god, source of light and life. Represents the soul, vitality, and leadership qualities.', day_of_week: 'Sunday', color: 'Golden Red', gemstone: 'Ruby', metal: 'Gold', element: 'Fire', direction: 'East' },
  { name: 'Chandra (Moon)', sanskrit_name: 'चन्द्र', description: 'The Moon god, ruler of emotions and mind. Represents intuition, creativity, and maternal energy.', day_of_week: 'Monday', color: 'White', gemstone: 'Pearl', metal: 'Silver', element: 'Water', direction: 'Northwest' },
  { name: 'Mangal (Mars)', sanskrit_name: 'मंगल', description: 'The Mars god, planet of energy and action. Represents courage, strength, and determination.', day_of_week: 'Tuesday', color: 'Red', gemstone: 'Red Coral', metal: 'Copper', element: 'Fire', direction: 'South' },
  { name: 'Budh (Mercury)', sanskrit_name: 'बुध', description: 'The Mercury god, planet of communication and intellect. Represents wisdom, learning, and business.', day_of_week: 'Wednesday', color: 'Green', gemstone: 'Emerald', metal: 'Bronze', element: 'Earth', direction: 'North' },
  { name: 'Guru (Jupiter)', sanskrit_name: 'गुरु', description: 'The Jupiter god, planet of wisdom and spirituality. Represents knowledge, teaching, and prosperity.', day_of_week: 'Thursday', color: 'Yellow', gemstone: 'Yellow Sapphire', metal: 'Gold', element: 'Space', direction: 'Northeast' },
  { name: 'Shukra (Venus)', sanskrit_name: 'शुक्र', description: 'The Venus god, planet of love and beauty. Represents relationships, art, and material pleasures.', day_of_week: 'Friday', color: 'White', gemstone: 'Diamond', metal: 'Silver', element: 'Water', direction: 'Southeast' },
  { name: 'Shani (Saturn)', sanskrit_name: 'शनि', description: 'The Saturn god, planet of discipline and karma. Represents hard work, patience, and life lessons.', day_of_week: 'Saturday', color: 'Black', gemstone: 'Blue Sapphire', metal: 'Iron', element: 'Air', direction: 'West' },
  { name: 'Rahu (North Node)', sanskrit_name: 'राहु', description: 'The shadow planet representing desires and illusions. Brings sudden changes and material gains.', day_of_week: 'Saturday', color: 'Smoky', gemstone: 'Hessonite', metal: 'Lead', element: 'Air', direction: 'Southwest' },
  { name: 'Ketu (South Node)', sanskrit_name: 'केतु', description: 'The shadow planet representing spirituality and detachment. Brings wisdom and liberation.', day_of_week: 'Tuesday', color: 'Brown', gemstone: "Cat's Eye", metal: 'Iron', element: 'Fire', direction: 'Northwest' },
]

export async function POST(request: NextRequest) {
  if (!validateAdminSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if grahas already exist
    const existing = await serverDatabases.listDocuments(DATABASE_ID, COLLECTIONS.DEITIES, [
      Query.search('name', 'Sun'),
      Query.limit(1),
    ]).catch(() => ({ documents: [] }))

    if (existing.documents.length > 0) {
      return NextResponse.json({
        message: 'Grahas already exist in database',
        count: existing.documents.length,
      })
    }

    // Insert graha data
    const inserted = []
    for (const graha of grahasData) {
      const doc = await serverDatabases.createDocument(DATABASE_ID, COLLECTIONS.DEITIES, ID.unique(), {
        ...graha,
        is_active: true,
      })
      inserted.push(doc)
    }

    return NextResponse.json({
      message: 'Grahas seeded successfully',
      count: inserted.length,
      grahas: inserted.map(d => ({ id: d.$id, name: d.name })),
    })
  } catch (error) {
    console.error('Error seeding grahas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
