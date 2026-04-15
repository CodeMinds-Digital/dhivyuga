/**
 * Appwrite Project Setup Script
 *
 * Creates the database, collections, attributes, indexes, and seeds initial data.
 *
 * Usage:
 *   npx tsx scripts/setup-appwrite.ts
 *
 * Requires APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID
 * in .env.local
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = new Client()
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '')

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'dhivyuga_db'

const PERMISSIONS = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
]

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function createDatabase() {
  try {
    await databases.create(DB_ID, 'Dhivyuga Database')
    console.log('Database created: dhivyuga_db')
  } catch (e: any) {
    if (e?.code === 409) {
      console.log('Database already exists, continuing...')
    } else if (e?.code === 403) {
      // Plan limit reached — database already exists, verify we can access it
      try {
        await databases.get(DB_ID)
        console.log('Using existing database: ' + DB_ID)
      } catch {
        console.error('Database limit reached and cannot access database ID "' + DB_ID + '". Check your NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env.local matches your existing database.')
        process.exit(1)
      }
    } else {
      throw e
    }
  }
}

async function createCollection(id: string, name: string) {
  try {
    await databases.createCollection(DB_ID, id, name, PERMISSIONS)
    console.log(`Collection created: ${name}`)
  } catch (e: any) {
    if (e?.code === 409) console.log(`Collection ${name} already exists, continuing...`)
    else throw e
  }
}

async function createStringAttr(collectionId: string, key: string, size: number, required = false, defaultVal?: string) {
  try {
    await databases.createStringAttribute(DB_ID, collectionId, key, size, required, defaultVal)
  } catch (e: any) {
    if (e?.code === 409) return
    if (e?.code === 400 && e?.type === 'attribute_limit_exceeded') {
      console.warn(`  ⚠ Attribute limit reached on '${collectionId}', skipping '${key}'`)
      return
    }
    throw e
  }
}

async function createIntAttr(collectionId: string, key: string, required = false, defaultVal?: number) {
  try {
    await databases.createIntegerAttribute(DB_ID, collectionId, key, required, undefined, undefined, defaultVal)
  } catch (e: any) {
    if (e?.code === 409) return
    throw e
  }
}

async function createBoolAttr(collectionId: string, key: string, required = false, defaultVal?: boolean) {
  try {
    await databases.createBooleanAttribute(DB_ID, collectionId, key, required, defaultVal)
  } catch (e: any) {
    if (e?.code === 409) return
    if (e?.code === 400 && e?.type === 'attribute_limit_exceeded') {
      console.warn(`  ⚠ Attribute limit reached on '${collectionId}', skipping '${key}'`)
      return
    }
    throw e
  }
}

async function createIndex(collectionId: string, key: string, type: string, attributes: string[], orders?: string[]) {
  try {
    await databases.createIndex(DB_ID, collectionId, key, type as any, attributes, orders as any)
  } catch (e: any) {
    if (e?.code === 409) return
    throw e
  }
}

async function setupCollections() {
  // --- categories ---
  await createCollection('categories', 'Categories')
  await createStringAttr('categories', 'name', 255, true)
  await createStringAttr('categories', 'description', 1000)
  await createBoolAttr('categories', 'is_active', false, true)
  await sleep(2000) // wait for attributes to be available
  await createIndex('categories', 'idx_name', 'key', ['name'])
  await createIndex('categories', 'idx_active', 'key', ['is_active'])

  // --- deities ---
  await createCollection('deities', 'Deities')
  await createStringAttr('deities', 'name', 255, true)
  await createStringAttr('deities', 'description', 1000)
  await createStringAttr('deities', 'sanskrit_name', 255)
  await createStringAttr('deities', 'day_of_week', 50)
  await createStringAttr('deities', 'color', 50)
  await createStringAttr('deities', 'gemstone', 100)
  await createStringAttr('deities', 'metal', 100)
  await createStringAttr('deities', 'element', 100)
  await createStringAttr('deities', 'direction', 50)
  await createBoolAttr('deities', 'is_active', false, true)
  await sleep(2000)
  await createIndex('deities', 'idx_name', 'key', ['name'])
  await createIndex('deities', 'idx_active', 'key', ['is_active'])
  await createIndex('deities', 'idx_name_ft', 'fulltext', ['name'])

  // --- recitation_counts ---
  await createCollection('recitation_counts', 'Recitation Counts')
  await createIntAttr('recitation_counts', 'count_value', true)
  await createStringAttr('recitation_counts', 'description', 1000)
  await sleep(2000)
  await createIndex('recitation_counts', 'idx_count', 'key', ['count_value'])

  // --- recitation_times ---
  await createCollection('recitation_times', 'Recitation Times')
  await createStringAttr('recitation_times', 'name', 255, true)
  await createStringAttr('recitation_times', 'description', 1000)
  await sleep(2000)
  await createIndex('recitation_times', 'idx_name', 'key', ['name'])

  // --- kalams ---
  await createCollection('kalams', 'Kalams')
  await createStringAttr('kalams', 'name', 255, true)
  await createStringAttr('kalams', 'planet', 100)
  await createStringAttr('kalams', 'description', 1000)
  await createBoolAttr('kalams', 'is_auspicious', false, true)
  await sleep(2000)
  await createIndex('kalams', 'idx_name', 'key', ['name'])

  // --- time_ranges ---
  await createCollection('time_ranges', 'Time Ranges')
  await createStringAttr('time_ranges', 'start_time', 10, true)
  await createStringAttr('time_ranges', 'end_time', 10, true)
  await createStringAttr('time_ranges', 'description', 1000)
  await sleep(2000)
  await createIndex('time_ranges', 'idx_start', 'key', ['start_time'])

  // --- mantras ---
  await createCollection('mantras', 'Mantras')
  await createStringAttr('mantras', 'title', 500, true)
  await createStringAttr('mantras', 'text', 2000, true)
  await createStringAttr('mantras', 'category_id', 36)
  await createStringAttr('mantras', 'deity_id', 36)
  await createStringAttr('mantras', 'count_id', 36)
  await createStringAttr('mantras', 'time_id', 36)
  await createStringAttr('mantras', 'kalam_id', 36)
  await createStringAttr('mantras', 'range_id', 36)
  await createIntAttr('mantras', 'view_count', false, 0)
  await sleep(3000)
  await createIndex('mantras', 'idx_title_ft', 'fulltext', ['title'])
  await createIndex('mantras', 'idx_text_ft', 'fulltext', ['text'])
  await createIndex('mantras', 'idx_view_count', 'key', ['view_count'], ['DESC'])
  await createIndex('mantras', 'idx_category', 'key', ['category_id'])
  await createIndex('mantras', 'idx_deity', 'key', ['deity_id'])

  // --- mantra_descriptions ---
  await createCollection('mantra_descriptions', 'Mantra Descriptions')
  await createStringAttr('mantra_descriptions', 'mantra_id', 36, true)
  await createStringAttr('mantra_descriptions', 'meaning', 2000, true)
  await createStringAttr('mantra_descriptions', 'transliteration', 1000)
  await createStringAttr('mantra_descriptions', 'pronunciation_guide', 1000)
  await createStringAttr('mantra_descriptions', 'benefits', 2000) // JSON string array
  await createStringAttr('mantra_descriptions', 'historical_context', 2000)
  await createStringAttr('mantra_descriptions', 'spiritual_significance', 2000)
  await createStringAttr('mantra_descriptions', 'usage_instructions', 2000)
  await createStringAttr('mantra_descriptions', 'precautions', 1000)
  await createStringAttr('mantra_descriptions', 'related_scriptures', 1000) // JSON string array
  await sleep(2000)
  await createIndex('mantra_descriptions', 'idx_mantra', 'key', ['mantra_id'])

  // --- mantra_translations ---
  await createCollection('mantra_translations', 'Mantra Translations')
  await createStringAttr('mantra_translations', 'mantra_id', 36, true)
  await createStringAttr('mantra_translations', 'language_id', 36, true)
  await createStringAttr('mantra_translations', 'text', 2000, true)
  await createStringAttr('mantra_translations', 'transliteration', 1000)
  await createStringAttr('mantra_translations', 'pronunciation_guide', 1000)
  await createStringAttr('mantra_translations', 'meaning', 2000)
  await createStringAttr('mantra_translations', 'benefits', 2000) // JSON string array
  await createStringAttr('mantra_translations', 'usage_notes', 1000)
  await sleep(2000)
  await createIndex('mantra_translations', 'idx_mantra', 'key', ['mantra_id'])
  await createIndex('mantra_translations', 'idx_language', 'key', ['language_id'])

  // --- languages ---
  await createCollection('languages', 'Languages')
  await createStringAttr('languages', 'code', 10, true)
  await createStringAttr('languages', 'name', 100, true)
  await createStringAttr('languages', 'native_name', 100)
  await createStringAttr('languages', 'direction', 3, false, 'ltr')
  await createIntAttr('languages', 'sort_order', false, 0)
  await createBoolAttr('languages', 'is_active', false, true)
  await sleep(2000)
  await createIndex('languages', 'idx_code', 'key', ['code'])
  await createIndex('languages', 'idx_active', 'key', ['is_active'])
  await createIndex('languages', 'idx_sort', 'key', ['sort_order'])

  // --- site_settings ---
  await createCollection('site_settings', 'Site Settings')
  await createBoolAttr('site_settings', 'show_category_chips', false, true)
  await createBoolAttr('site_settings', 'show_trending', false, false)
  await createBoolAttr('site_settings', 'show_deity_grid', false, false)
  await createBoolAttr('site_settings', 'show_category_grid', false, false)
  await sleep(2000)

  console.log('\nAll collections and indexes created!')
}

async function collectionHasData(collectionId: string): Promise<boolean> {
  try {
    const result = await databases.listDocuments(DB_ID, collectionId, [])
    return result.total > 0
  } catch {
    return false
  }
}

async function seedData() {
  console.log('\nSeeding data...')

  // Skip seeding if data already exists
  if (await collectionHasData('categories')) {
    console.log('Data already exists, skipping reference data seeding...')

    // Still try to seed mantras if they don't exist
    if (!(await collectionHasData('mantras'))) {
      await seedMantras()
    } else {
      console.log('Mantras already exist, skipping...')
    }
    return
  }

  // Categories
  const categories = [
    { name: 'Wealth', description: 'Mantras for prosperity and abundance' },
    { name: 'Protection', description: 'Mantras for safety and divine protection' },
    { name: 'Health', description: 'Mantras for physical and mental well-being' },
    { name: 'Wisdom', description: 'Mantras for knowledge and understanding' },
    { name: 'Love', description: 'Mantras for relationships and harmony' },
    { name: 'Success', description: 'Mantras for achievement and accomplishment' },
    { name: 'Peace', description: 'Mantras for inner calm and tranquility' },
    { name: 'Spiritual Growth', description: 'Mantras for spiritual development' },
    { name: 'Obstacle Removal', description: 'Mantras for removing barriers' },
    { name: 'Good Fortune', description: 'Mantras for positive energy and luck' },
  ]
  for (const cat of categories) {
    await databases.createDocument(DB_ID, 'categories', ID.unique(), { ...cat, is_active: true })
  }
  console.log('Categories seeded')

  // Deities
  const deities = [
    { name: 'Ganesha', description: 'Remover of obstacles, patron of arts and sciences' },
    { name: 'Lakshmi', description: 'Goddess of wealth, fortune, prosperity' },
    { name: 'Saraswati', description: 'Goddess of knowledge, music, arts, wisdom' },
    { name: 'Hanuman', description: 'Symbol of courage, strength, and devotion' },
    { name: 'Shiva', description: 'The transformer, destroyer of evil' },
    { name: 'Vishnu', description: 'The preserver and protector of the universe' },
    { name: 'Devi', description: 'The divine mother, supreme goddess' },
    { name: 'Krishna', description: 'God of love, compassion, and tenderness' },
    { name: 'Rama', description: 'Symbol of righteousness and virtue' },
    { name: 'Kali', description: 'Fierce form of the divine mother' },
  ]
  for (const deity of deities) {
    await databases.createDocument(DB_ID, 'deities', ID.unique(), { ...deity, is_active: true })
  }
  console.log('Deities seeded')

  // Recitation Counts
  const counts = [
    { count_value: 11, description: 'Quick daily practice' },
    { count_value: 27, description: 'Standard practice' },
    { count_value: 54, description: 'Moderate practice' },
    { count_value: 108, description: 'Full mala count' },
    { count_value: 1008, description: 'Special occasions' },
    { count_value: 10008, description: 'Major spiritual undertakings' },
  ]
  for (const c of counts) {
    await databases.createDocument(DB_ID, 'recitation_counts', ID.unique(), c)
  }
  console.log('Recitation counts seeded')

  // Recitation Times
  const times = [
    { name: 'Morning', description: 'Early morning hours' },
    { name: 'Noon', description: 'Midday period' },
    { name: 'Evening', description: 'Evening hours' },
    { name: 'Brahma Muhurta', description: 'Pre-dawn sacred time' },
  ]
  for (const t of times) {
    await databases.createDocument(DB_ID, 'recitation_times', ID.unique(), t)
  }
  console.log('Recitation times seeded')

  // Kalams
  const kalams = [
    { name: 'Rahu Kalam', planet: 'Rahu', description: 'Inauspicious period ruled by Rahu', is_auspicious: false },
    { name: 'Yama Kalam', planet: 'Yama', description: 'Period of death deity', is_auspicious: false },
    { name: 'Gulika Kalam', planet: 'Gulika', description: 'Inauspicious period', is_auspicious: false },
    { name: 'Surya Hora', planet: 'Surya', description: 'Sun period, auspicious', is_auspicious: true },
    { name: 'Chandra Hora', planet: 'Chandra', description: 'Moon period', is_auspicious: true },
    { name: 'Guru Hora', planet: 'Guru', description: 'Jupiter period, very auspicious', is_auspicious: true },
    { name: 'Shukra Hora', planet: 'Shukra', description: 'Venus period, auspicious', is_auspicious: true },
  ]
  for (const k of kalams) {
    await databases.createDocument(DB_ID, 'kalams', ID.unique(), k)
  }
  console.log('Kalams seeded')

  // Time Ranges
  const ranges = [
    { start_time: '03:30', end_time: '05:30', description: 'Brahma Muhurta - most sacred time' },
    { start_time: '06:00', end_time: '09:00', description: 'Morning hours' },
    { start_time: '11:30', end_time: '12:30', description: 'Midday period' },
    { start_time: '18:00', end_time: '20:00', description: 'Evening hours' },
  ]
  for (const r of ranges) {
    await databases.createDocument(DB_ID, 'time_ranges', ID.unique(), r)
  }
  console.log('Time ranges seeded')

  // Languages
  const languages = [
    { code: 'en', name: 'English', native_name: 'English', direction: 'ltr', sort_order: 1, is_active: true },
    { code: 'ta', name: 'Tamil', native_name: 'தமிழ்', direction: 'ltr', sort_order: 2, is_active: true },
    { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', direction: 'ltr', sort_order: 3, is_active: true },
    { code: 'sa', name: 'Sanskrit', native_name: 'संस्कृतम्', direction: 'ltr', sort_order: 4, is_active: true },
  ]
  for (const l of languages) {
    await databases.createDocument(DB_ID, 'languages', ID.unique(), l)
  }
  console.log('Languages seeded')

  // Site Settings (default document)
  try {
    await databases.createDocument(DB_ID, 'site_settings', 'default', {
      show_category_chips: true,
      show_trending: false,
      show_deity_grid: false,
      show_category_grid: false,
    })
    console.log('Site settings seeded')
  } catch (e: any) {
    if (e?.code === 409) console.log('Site settings already exists, skipping...')
    else throw e
  }

  await seedMantras()

  console.log('\nAll data seeded successfully!')
}

async function seedMantras() {
  console.log('\nSeeding sample mantras...')

  // Get reference IDs for linking
  const allDeities = await databases.listDocuments(DB_ID, 'deities', [])
  const allCategories = await databases.listDocuments(DB_ID, 'categories', [])
  const allCounts = await databases.listDocuments(DB_ID, 'recitation_counts', [])
  const allTimes = await databases.listDocuments(DB_ID, 'recitation_times', [])
  const allLangs = await databases.listDocuments(DB_ID, 'languages', [])

  const findId = (docs: any[], field: string, value: any) =>
    docs.find(d => d[field] === value)?.$id || null

  const langId = (code: string) => findId(allLangs.documents, 'code', code)

  // Mantra 1: Om Gam Ganapataye Namaha
  const mantra1 = await databases.createDocument(DB_ID, 'mantras', ID.unique(), {
    title: 'Om Gam Ganapataye Namaha',
    text: 'Om Gam Ganapataye Namaha - Salutations to Lord Ganesha',
    deity_id: findId(allDeities.documents, 'name', 'Ganesha'),
    category_id: findId(allCategories.documents, 'name', 'Obstacle Removal'),
    count_id: findId(allCounts.documents, 'count_value', 108),
    time_id: findId(allTimes.documents, 'name', 'Morning'),
    view_count: 150,
  })

  // Mantra 1 — Translations (all 4 languages)
  if (langId('ta')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra1.$id,
      language_id: langId('ta'),
      text: 'ஓம் கம் கணபதயே நமஹா',
      transliteration: 'Om Gam Ga-na-pa-ta-ye Na-ma-ha',
      meaning: 'தடைகளை நீக்கும் கணபதிக்கு வணக்கம். இந்த மந்திரம் புதிய தொடக்கங்களில் வெற்றியையும் வாழ்வில் தடைகளை நீக்குவதையும் அருளுகிறது.',
      benefits: '["வாழ்வில் தடைகளை நீக்குகிறது","புதிய முயற்சிகளில் வெற்றி தருகிறது","அறிவையும் புத்தியையும் வளர்க்கிறது","தெய்வீக பாதுகாப்பு அளிக்கிறது"]',
      usage_notes: 'காலையில் 108 முறை ஜபிக்கவும். கிழக்கு நோக்கி அமர்ந்து ருத்ராக்ஷ மாலை பயன்படுத்தவும்.',
    })
  }
  if (langId('en')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra1.$id,
      language_id: langId('en'),
      text: 'Om Gam Ganapataye Namaha',
      transliteration: 'Om Gam Ga-na-pa-ta-ye Na-ma-ha',
      meaning: 'Salutations to Lord Ganesha, the remover of obstacles. This mantra invokes blessings for success in new endeavors and removal of barriers in life.',
      benefits: '["Removes obstacles in life","Brings success in new ventures","Enhances wisdom and intelligence","Provides divine protection","Improves concentration and focus"]',
      usage_notes: 'Chant 108 times in the morning before starting any new work. Face east while chanting. Use a rudraksha mala for counting.',
    })
  }
  if (langId('hi')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra1.$id,
      language_id: langId('hi'),
      text: 'ॐ गं गणपतये नमः',
      transliteration: 'Om Gam Ga-na-pa-ta-ye Na-ma-ha',
      meaning: 'विघ्नहर्ता भगवान गणेश को नमस्कार। यह मंत्र नए कार्यों में सफलता और जीवन की बाधाओं को दूर करने का आशीर्वाद देता है।',
      benefits: '["जीवन की बाधाएं दूर करता है","नए कार्यों में सफलता देता है","बुद्धि और ज्ञान बढ़ाता है","दिव्य सुरक्षा प्रदान करता है"]',
      usage_notes: 'प्रातःकाल 108 बार जप करें। पूर्व दिशा की ओर मुख करके रुद्राक्ष माला से जप करें।',
    })
  }
  if (langId('sa')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra1.$id,
      language_id: langId('sa'),
      text: 'ॐ गं गणपतये नमः',
      transliteration: 'Om Gaṁ Gaṇapataye Namaḥ',
      meaning: 'विघ्ननाशकाय गणपतये नमस्कारः। एषः मन्त्रः नवप्रयासेषु सिद्धिं जीवने विघ्ननिवारणं च प्रददाति।',
      benefits: '["जीवने विघ्नान् निवारयति","नवकार्येषु सिद्धिं ददाति","प्रज्ञां बुद्धिं च वर्धयति","दैवीं रक्षां प्रयच्छति"]',
      usage_notes: 'प्रातःकाले अष्टोत्तरशतवारं जपेत्। पूर्वाभिमुखं रुद्राक्षमालया जपेत्।',
    })
  }
  console.log('Mantra 1 seeded: Om Gam Ganapataye Namaha (4 languages)')

  // Mantra 2: Om Shreem Mahalakshmiyei Namaha
  const mantra2 = await databases.createDocument(DB_ID, 'mantras', ID.unique(), {
    title: 'Om Shreem Mahalakshmiyei Namaha',
    text: 'Om Shreem Mahalakshmiyei Namaha - Salutations to Goddess Lakshmi',
    deity_id: findId(allDeities.documents, 'name', 'Lakshmi'),
    category_id: findId(allCategories.documents, 'name', 'Wealth'),
    count_id: findId(allCounts.documents, 'count_value', 108),
    time_id: findId(allTimes.documents, 'name', 'Morning'),
    view_count: 120,
  })

  if (langId('ta')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra2.$id,
      language_id: langId('ta'),
      text: 'ஓம் ஸ்ரீம் மஹாலக்ஷ்மியை நமஹா',
      transliteration: 'Om Shreem Ma-ha-lak-shmi-yei Na-ma-ha',
      meaning: 'செல்வத்தின் தேவி மஹாலக்ஷ்மிக்கு வணக்கம். இந்த மந்திரம் பொருளாதார நிலைத்தன்மை மற்றும் செழிப்பை அருளுகிறது.',
      benefits: '["செல்வம் மற்றும் செழிப்பை ஈர்க்கிறது","நிதி நிலைத்தன்மை தருகிறது","வணிக வெற்றியை மேம்படுத்துகிறது","குடும்ப நல்லிணக்கம் தருகிறது"]',
      usage_notes: 'வெள்ளிக்கிழமைகளில் 108 முறை ஜபிக்கவும். நெய் விளக்கு ஏற்றி தாமரை மலர் அர்ப்பணிக்கவும்.',
    })
  }
  if (langId('en')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra2.$id,
      language_id: langId('en'),
      text: 'Om Shreem Mahalakshmiyei Namaha',
      transliteration: 'Om Shreem Ma-ha-lak-shmi-yei Na-ma-ha',
      meaning: 'Salutations to Goddess Lakshmi, the divine mother of wealth and prosperity. This mantra invokes blessings for material and spiritual abundance.',
      benefits: '["Attracts wealth and prosperity","Brings financial stability","Enhances business success","Grants material abundance","Improves family harmony"]',
      usage_notes: 'Best chanted on Fridays during Lakshmi Puja. Chant 108 times facing north or east. Light a ghee lamp and offer lotus flowers.',
    })
  }
  if (langId('hi')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra2.$id,
      language_id: langId('hi'),
      text: 'ॐ श्रीं महालक्ष्म्यै नमः',
      transliteration: 'Om Shreem Ma-ha-lak-shmi-yei Na-ma-ha',
      meaning: 'धन की देवी महालक्ष्मी को नमस्कार। यह मंत्र भौतिक और आध्यात्मिक समृद्धि का आशीर्वाद देता है।',
      benefits: '["धन और समृद्धि आकर्षित करता है","आर्थिक स्थिरता देता है","व्यापार में सफलता बढ़ाता है","परिवार में सद्भाव लाता है"]',
      usage_notes: 'शुक्रवार को लक्ष्मी पूजा के समय 108 बार जप करें। उत्तर या पूर्व दिशा की ओर मुख करें। घी का दीपक जलाएं।',
    })
  }
  if (langId('sa')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra2.$id,
      language_id: langId('sa'),
      text: 'ॐ श्रीं महालक्ष्म्यै नमः',
      transliteration: 'Oṁ Śrīṁ Mahālakṣmyai Namaḥ',
      meaning: 'धनदेव्यै महालक्ष्म्यै नमस्कारः। एषः मन्त्रः भौतिकं आध्यात्मिकं च ऐश्वर्यं प्रददाति।',
      benefits: '["धनं समृद्धिं च आकर्षयति","आर्थिकं स्थैर्यं ददाति","वाणिज्ये सिद्धिं वर्धयति","कुटुम्बे सौहार्दं जनयति"]',
      usage_notes: 'शुक्रवासरे लक्ष्मीपूजायां अष्टोत्तरशतवारं जपेत्। उत्तराभिमुखं पूर्वाभिमुखं वा तिष्ठेत्। घृतदीपं प्रज्वालयेत्।',
    })
  }
  console.log('Mantra 2 seeded: Om Shreem Mahalakshmiyei Namaha (4 languages)')

  // Mantra 3: Maha Mrityunjaya Mantra
  const mantra3 = await databases.createDocument(DB_ID, 'mantras', ID.unique(), {
    title: 'Maha Mrityunjaya Mantra',
    text: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam',
    deity_id: findId(allDeities.documents, 'name', 'Shiva'),
    category_id: findId(allCategories.documents, 'name', 'Health'),
    count_id: findId(allCounts.documents, 'count_value', 108),
    time_id: findId(allTimes.documents, 'name', 'Brahma Muhurta'),
    view_count: 200,
  })

  if (langId('ta')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra3.$id,
      language_id: langId('ta'),
      text: 'ஓம் த்ர்யம்பகம் யஜாமஹே சுகந்திம் புஷ்டிவர்தனம்',
      transliteration: 'Om Tryam-ba-kam Ya-ja-ma-he Su-gan-dhim Push-ti-var-dha-nam',
      meaning: 'மூன்று கண்களை உடைய சிவபெருமானை வழிபடுகிறோம். நறுமணம் போல் பரவும் அவர் நம்மை மரணபயத்திலிருந்து விடுவிப்பார்.',
      benefits: '["நோய்களிலிருந்து குணமாக்குகிறது","ஆயுளை நீட்டிக்கிறது","எதிர்மறை சக்திகளிலிருந்து பாதுகாக்கிறது","மன அமைதி தருகிறது"]',
      usage_notes: 'பிரம்ம முகூர்த்தத்தில் 108 முறை ஜபிக்கவும். ருத்ராக்ஷ மாலை அணிந்து ஜபிக்கவும்.',
    })
  }
  if (langId('en')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra3.$id,
      language_id: langId('en'),
      text: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
      transliteration: 'Om Tryam-ba-kam Ya-ja-ma-he Su-gan-dhim Push-ti-var-dha-nam',
      meaning: 'We worship the three-eyed Lord Shiva who nourishes all beings. May He liberate us from the bondage of death, as a ripe cucumber is severed from its vine.',
      benefits: '["Heals diseases and ailments","Extends longevity","Protects from negative energies","Grants mental peace and courage","Overcomes fear of death"]',
      usage_notes: 'Chant 108 times during Brahma Muhurta (3:30-5:30 AM). Wear rudraksha mala. Especially powerful on Mondays and during Maha Shivaratri.',
    })
  }
  if (langId('hi')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra3.$id,
      language_id: langId('hi'),
      text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
      transliteration: 'Om Tryam-ba-kam Ya-ja-ma-he Su-gan-dhim Push-ti-var-dha-nam',
      meaning: 'हम तीन नेत्रों वाले भगवान शिव की पूजा करते हैं जो सभी प्राणियों का पोषण करते हैं। वे हमें मृत्यु के बंधन से मुक्त करें।',
      benefits: '["रोगों से मुक्ति देता है","आयु बढ़ाता है","नकारात्मक ऊर्जा से रक्षा करता है","मानसिक शांति देता है"]',
      usage_notes: 'ब्रह्म मुहूर्त में 108 बार जप करें। रुद्राक्ष माला पहनकर जप करें। सोमवार को विशेष फलदायी है।',
    })
  }
  if (langId('sa')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra3.$id,
      language_id: langId('sa'),
      text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
      transliteration: 'Oṁ Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭivardhanam Urvārukamiva Bandhanān Mṛtyormukṣīya Māmṛtāt',
      meaning: 'त्रिनेत्रं शिवं यजामहे यः सर्वप्राणिनां पोषकः। सः अस्मान् मृत्युबन्धनात् मोचयतु यथा पक्वं वृन्ताकं लतायाः विच्छिद्यते।',
      benefits: '["रोगान् अपनयति","आयुः वर्धयति","नकारात्मकशक्तिभ्यः रक्षति","मानसिकं शान्तिं ददाति"]',
      usage_notes: 'ब्रह्ममुहूर्ते अष्टोत्तरशतवारं जपेत्। रुद्राक्षमालां धारयेत्। सोमवासरे विशेषफलप्रदम्।',
    })
  }
  console.log('Mantra 3 seeded: Maha Mrityunjaya Mantra (4 languages)')

  // Mantra 4: Gayatri Mantra
  const mantra4 = await databases.createDocument(DB_ID, 'mantras', ID.unique(), {
    title: 'Gayatri Mantra',
    text: 'Om Bhur Bhuva Swaha Tat Savitur Varenyam',
    deity_id: findId(allDeities.documents, 'name', 'Saraswati'),
    category_id: findId(allCategories.documents, 'name', 'Wisdom'),
    count_id: findId(allCounts.documents, 'count_value', 108),
    time_id: findId(allTimes.documents, 'name', 'Brahma Muhurta'),
    view_count: 250,
  })

  if (langId('ta')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra4.$id,
      language_id: langId('ta'),
      text: 'ஓம் பூர் புவஸ் சுவஹ தத் சவிதுர் வரேண்யம் பர்கோ தேவஸ்ய தீமஹி தியோ யோ நஹ் ப்ரசோதயாத்',
      transliteration: 'Om Bhur Bhu-va Swa-ha Tat Sa-vi-tur Va-re-nyam',
      meaning: 'பிரகாசமான சூரிய தேவனை தியானிக்கிறோம். அவர் நமது புத்தியை ஒளிரச் செய்வாராக.',
      benefits: '["புத்தியை கூர்மையாக்குகிறது","ஆன்மீக ஞானம் தருகிறது","எதிர்மறை எண்ணங்களை நீக்குகிறது","மன தெளிவு தருகிறது"]',
      usage_notes: 'சூரிய உதயத்தின் போது 108 முறை ஜபிக்கவும். மூன்று சந்தியா காலங்களிலும் ஜபிக்கலாம்.',
    })
  }
  if (langId('en')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra4.$id,
      language_id: langId('en'),
      text: 'Om Bhur Bhuva Swaha Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat',
      transliteration: 'Om Bhur Bhu-va Swa-ha Tat Sa-vi-tur Va-re-nyam Bhar-go De-va-sya Dhi-ma-hi',
      meaning: 'We meditate upon the glorious splendor of the divine Sun. May He illuminate our intellect and guide our path toward truth.',
      benefits: '["Sharpens intellect and memory","Grants spiritual wisdom","Removes negativity","Brings mental clarity","Purifies mind and soul"]',
      usage_notes: 'Chant 108 times at sunrise. Can be chanted during all three sandhya times (dawn, noon, dusk). Face east during morning chanting.',
    })
  }
  if (langId('hi')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra4.$id,
      language_id: langId('hi'),
      text: 'ॐ भूर् भुवः स्वः तत् सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      transliteration: 'Om Bhur Bhu-va Swa-ha Tat Sa-vi-tur Va-re-nyam',
      meaning: 'हम उस दिव्य सूर्य देव के तेज का ध्यान करते हैं। वे हमारी बुद्धि को प्रेरित करें और सत्य की ओर मार्गदर्शन करें।',
      benefits: '["बुद्धि और स्मरण शक्ति बढ़ाता है","आध्यात्मिक ज्ञान देता है","नकारात्मकता दूर करता है","मानसिक स्पष्टता लाता है"]',
      usage_notes: 'सूर्योदय के समय 108 बार जप करें। तीनों संध्या काल में जप किया जा सकता है।',
    })
  }
  if (langId('sa')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra4.$id,
      language_id: langId('sa'),
      text: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      transliteration: 'Oṁ Bhūrbhuvaḥ Svaḥ Tatsaviturvareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt',
      meaning: 'तस्य दिव्यस्य सवितुः देवस्य वरेण्यं भर्गं धीमहि। सः नः धियः प्रचोदयात् सत्यमार्गं प्रति नयतु।',
      benefits: '["बुद्धिं स्मृतिं च तीक्ष्णयति","आध्यात्मिकं ज्ञानं ददाति","नकारात्मकतां निवारयति","मानसिकं वैशद्यं जनयति"]',
      usage_notes: 'सूर्योदयकाले अष्टोत्तरशतवारं जपेत्। त्रिसन्ध्यासु जपः कर्तुं शक्यते। प्रातःकाले पूर्वाभिमुखं तिष्ठेत्।',
    })
  }
  console.log('Mantra 4 seeded: Gayatri Mantra (4 languages)')

  // Mantra 5: Hanuman Chalisa (opening verse)
  const mantra5 = await databases.createDocument(DB_ID, 'mantras', ID.unique(), {
    title: 'Hanuman Mantra',
    text: 'Om Hanumate Namaha',
    deity_id: findId(allDeities.documents, 'name', 'Hanuman'),
    category_id: findId(allCategories.documents, 'name', 'Protection'),
    count_id: findId(allCounts.documents, 'count_value', 11),
    time_id: findId(allTimes.documents, 'name', 'Morning'),
    view_count: 95,
  })

  if (langId('ta')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra5.$id,
      language_id: langId('ta'),
      text: 'ஓம் ஹனுமதே நமஹா',
      transliteration: 'Om Ha-nu-ma-te Na-ma-ha',
      meaning: 'வீரம் மற்றும் பக்தியின் சின்னமான ஹனுமானுக்கு வணக்கம். இந்த மந்திரம் தைரியம், வலிமை மற்றும் பாதுகாப்பை அளிக்கிறது.',
      benefits: '["தைரியமும் வலிமையும் தருகிறது","எதிர்மறை சக்திகளிலிருந்து பாதுகாக்கிறது","பயத்தை நீக்குகிறது","உடல் நலம் மேம்படுத்துகிறது"]',
      usage_notes: 'செவ்வாய் மற்றும் சனிக்கிழமைகளில் 11 முறை ஜபிக்கவும்.',
    })
  }
  if (langId('en')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra5.$id,
      language_id: langId('en'),
      text: 'Om Hanumate Namaha',
      transliteration: 'Om Ha-nu-ma-te Na-ma-ha',
      meaning: 'Salutations to Lord Hanuman, the symbol of courage and devotion. This mantra grants courage, strength, and protection from negative forces.',
      benefits: '["Grants courage and physical strength","Protects from evil forces","Removes fear and anxiety","Improves physical health","Builds unwavering devotion"]',
      usage_notes: 'Chant 11 times on Tuesdays and Saturdays. Especially powerful during sunrise.',
    })
  }
  if (langId('hi')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra5.$id,
      language_id: langId('hi'),
      text: 'ॐ हनुमते नमः',
      transliteration: 'Om Ha-nu-ma-te Na-ma-ha',
      meaning: 'वीरता और भक्ति के प्रतीक भगवान हनुमान को नमस्कार। यह मंत्र साहस, शक्ति और सुरक्षा प्रदान करता है।',
      benefits: '["साहस और शारीरिक बल देता है","बुरी शक्तियों से रक्षा करता है","भय और चिंता दूर करता है","शारीरिक स्वास्थ्य सुधारता है"]',
      usage_notes: 'मंगलवार और शनिवार को 11 बार जप करें। सूर्योदय के समय विशेष रूप से प्रभावी।',
    })
  }
  if (langId('sa')) {
    await databases.createDocument(DB_ID, 'mantra_translations', ID.unique(), {
      mantra_id: mantra5.$id,
      language_id: langId('sa'),
      text: 'ॐ हनुमते नमः',
      transliteration: 'Oṁ Hanumate Namaḥ',
      meaning: 'शौर्यभक्त्योः प्रतीकाय हनुमते नमस्कारः। एषः मन्त्रः शौर्यं बलं रक्षां च प्रददाति।',
      benefits: '["शौर्यं शारीरिकबलं च ददाति","दुष्टशक्तिभ्यः रक्षति","भयं चिन्तां च निवारयति","शारीरिकं स्वास्थ्यं सुधारयति"]',
      usage_notes: 'मङ्गलवासरे शनिवासरे च एकादशवारं जपेत्। सूर्योदयकाले विशेषफलप्रदम्।',
    })
  }
  console.log('Mantra 5 seeded: Hanuman Mantra (4 languages)')
}

async function main() {
  console.log('Setting up Appwrite project for Dhivyuga...\n')
  await createDatabase()
  await setupCollections()
  await seedData()
  console.log('\nSetup complete!')
}

main().catch(console.error)
