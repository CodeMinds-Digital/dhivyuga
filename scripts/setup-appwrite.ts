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
    if (e?.code === 409) console.log('Database already exists, continuing...')
    else throw e
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
    throw e
  }
}

async function createIndex(collectionId: string, key: string, type: string, attributes: string[], orders?: string[]) {
  try {
    await databases.createIndex(DB_ID, collectionId, key, type as any, attributes, orders)
  } catch (e: any) {
    if (e?.code === 409) return
    throw e
  }
}

async function setupCollections() {
  // --- categories ---
  await createCollection('categories', 'Categories')
  await createStringAttr('categories', 'name', 255, true)
  await createStringAttr('categories', 'description', 5000)
  await createBoolAttr('categories', 'is_active', false, true)
  await sleep(2000) // wait for attributes to be available
  await createIndex('categories', 'idx_name', 'key', ['name'])
  await createIndex('categories', 'idx_active', 'key', ['is_active'])

  // --- deities ---
  await createCollection('deities', 'Deities')
  await createStringAttr('deities', 'name', 255, true)
  await createStringAttr('deities', 'description', 5000)
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
  await createStringAttr('recitation_counts', 'description', 5000)
  await sleep(2000)
  await createIndex('recitation_counts', 'idx_count', 'key', ['count_value'])

  // --- recitation_times ---
  await createCollection('recitation_times', 'Recitation Times')
  await createStringAttr('recitation_times', 'name', 255, true)
  await createStringAttr('recitation_times', 'description', 5000)
  await sleep(2000)
  await createIndex('recitation_times', 'idx_name', 'key', ['name'])

  // --- kalams ---
  await createCollection('kalams', 'Kalams')
  await createStringAttr('kalams', 'name', 255, true)
  await createStringAttr('kalams', 'planet', 100)
  await createStringAttr('kalams', 'description', 5000)
  await createBoolAttr('kalams', 'is_auspicious', false, true)
  await sleep(2000)
  await createIndex('kalams', 'idx_name', 'key', ['name'])

  // --- time_ranges ---
  await createCollection('time_ranges', 'Time Ranges')
  await createStringAttr('time_ranges', 'start_time', 10, true)
  await createStringAttr('time_ranges', 'end_time', 10, true)
  await createStringAttr('time_ranges', 'description', 5000)
  await sleep(2000)
  await createIndex('time_ranges', 'idx_start', 'key', ['start_time'])

  // --- mantras ---
  await createCollection('mantras', 'Mantras')
  await createStringAttr('mantras', 'title', 500, true)
  await createStringAttr('mantras', 'text', 10000, true)
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
  await createStringAttr('mantra_descriptions', 'meaning', 10000, true)
  await createStringAttr('mantra_descriptions', 'transliteration', 10000)
  await createStringAttr('mantra_descriptions', 'pronunciation_guide', 5000)
  await createStringAttr('mantra_descriptions', 'benefits', 10000) // JSON string array
  await createStringAttr('mantra_descriptions', 'historical_context', 10000)
  await createStringAttr('mantra_descriptions', 'spiritual_significance', 10000)
  await createStringAttr('mantra_descriptions', 'usage_instructions', 10000)
  await createStringAttr('mantra_descriptions', 'precautions', 5000)
  await createStringAttr('mantra_descriptions', 'related_scriptures', 5000) // JSON string array
  await sleep(2000)
  await createIndex('mantra_descriptions', 'idx_mantra', 'key', ['mantra_id'])

  // --- mantra_translations ---
  await createCollection('mantra_translations', 'Mantra Translations')
  await createStringAttr('mantra_translations', 'mantra_id', 36, true)
  await createStringAttr('mantra_translations', 'language_id', 36, true)
  await createStringAttr('mantra_translations', 'text', 10000, true)
  await createStringAttr('mantra_translations', 'transliteration', 10000)
  await createStringAttr('mantra_translations', 'pronunciation_guide', 5000)
  await createStringAttr('mantra_translations', 'meaning', 10000)
  await createStringAttr('mantra_translations', 'benefits', 10000) // JSON string array
  await createStringAttr('mantra_translations', 'usage_notes', 5000)
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

async function seedData() {
  console.log('\nSeeding data...')

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
  await databases.createDocument(DB_ID, 'site_settings', 'default', {
    show_category_chips: true,
    show_trending: false,
    show_deity_grid: false,
    show_category_grid: false,
  })
  console.log('Site settings seeded')

  console.log('\nAll data seeded successfully!')
}

async function main() {
  console.log('Setting up Appwrite project for Dhivyuga...\n')
  await createDatabase()
  await setupCollections()
  await seedData()
  console.log('\nSetup complete!')
}

main().catch(console.error)
