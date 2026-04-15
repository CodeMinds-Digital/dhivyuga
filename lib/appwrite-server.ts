/**
 * Server-side Appwrite client using node-appwrite with API key.
 * Use ONLY in API routes (app/api/), never in client components.
 */
import { Client, Databases, Users, ID, Query } from 'node-appwrite'

const client = new Client()
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '')

export const serverDatabases = new Databases(client)
export const serverUsers = new Users(client)

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
 * Helper to fetch a related document by ID server-side.
 */
export async function getRelatedDoc(collectionId: string, docId: string | null | undefined) {
  if (!docId) return null
  try {
    return await serverDatabases.getDocument(DATABASE_ID, collectionId, docId)
  } catch (e: any) {
    if (e?.code !== 404) {
      console.error(`getRelatedDoc error [${collectionId}/${docId}]:`, e?.message || e)
    }
    return null
  }
}

/**
 * Validate admin secret from request header.
 * Returns true if the request has a valid ADMIN_API_SECRET.
 */
export function validateAdminSecret(request: Request): boolean {
  const secret = request.headers.get('x-admin-secret') || ''
  const expected = process.env.ADMIN_API_SECRET || ''
  if (!expected) return false
  return secret === expected
}
