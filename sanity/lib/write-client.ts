import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Secure Server-Side Sanity Client with Write Access
 *
 * CRITICAL: This client is for SERVER-SIDE ONLY operations that need write access.
 * Never use this client in client components or expose it to the browser.
 *
 * Used for:
 * - Incrementing download counts
 * - Server-side mutations
 * - API route operations
 */

const token = process.env.SANITY_API_WRITE_TOKEN

// Warn if token is missing (e.g., in local dev without env vars)
if (!token) {
  console.warn(
    '[SANITY WRITE CLIENT] Warning: SANITY_API_WRITE_TOKEN is not set. ' +
    'Write operations will fail. Add this token to your .env.local file.'
  )
}

// Export null if token is missing to prevent crashes
export const writeClient = token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // Critical for real-time updates
      token,
      perspective: 'published',
    })
  : null

// Type guard to check if writeClient is available
export function hasWriteAccess(): boolean {
  return writeClient !== null
}
