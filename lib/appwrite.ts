import { Client, Account, Databases, ID, Query } from 'appwrite'

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''

const client = new Client()
client.setEndpoint(endpoint).setProject(projectId)

export const account = new Account(client)
export const databases = new Databases(client)

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ''

export const COLLECTIONS = {
  MANTRAS: 'mantras',
  MANTRA_DESCRIPTIONS: 'mantra_descriptions',
  MANTRA_TRANSLATIONS: 'mantra_translations',
  CATEGORIES: 'categories',
  DEITIES: 'deities',
  RECITATION_COUNTS: 'recitation_counts',
  RECITATION_TIMES: 'recitation_times',
  KALAMS: 'kalams',
  TIME_RANGES: 'time_ranges',
  LANGUAGES: 'languages',
  SITE_SETTINGS: 'site_settings',
} as const

export { ID, Query }

/**
 * Helper to fetch a related document by ID, returning null if the ID is missing.
 */
export async function getRelatedDoc(collectionId: string, docId: string | null | undefined) {
  if (!docId) return null
  try {
    return await databases.getDocument(DATABASE_ID, collectionId, docId)
  } catch {
    return null
  }
}

// Re-export Appwrite types used across the app
export type { Models } from 'appwrite'
