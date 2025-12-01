/**
 * Cloudinary Utilities
 * Helper functions for working with Cloudinary URLs and deletion
 */

import crypto from 'crypto';

/**
 * Extract the public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/high-res-assets/sample.jpg
 * Returns: high-res-assets/sample
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Cloudinary URLs follow this pattern:
    // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{version}/{public_id}.{format}
    const pathParts = urlObj.pathname.split('/');

    // Find the 'upload' segment
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // Everything after upload (skipping version if present) is the public_id + extension
    const afterUpload = pathParts.slice(uploadIndex + 1);

    // Skip version number (starts with 'v' followed by digits)
    const startIndex = afterUpload[0]?.match(/^v\d+$/) ? 1 : 0;

    // Join remaining parts and remove file extension
    const publicIdWithExt = afterUpload.slice(startIndex).join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Remove extension

    return publicId || null;
  } catch (error) {
    console.error('[Cloudinary] Failed to extract public_id:', error);
    return null;
  }
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}

/**
 * Result of a Cloudinary deletion operation
 */
export interface CloudinaryDeleteResult {
  success: boolean;
  publicId: string;
  result: 'ok' | 'not found' | 'error';
  message: string;
  error?: string;
}

/**
 * Delete a single asset from Cloudinary by public_id
 *
 * @param publicId - The Cloudinary public_id to delete
 * @returns Result object with success status and details
 *
 * @example
 * const result = await deleteCloudinaryAsset('high-res-assets/moon-8x10');
 * if (result.success) {
 *   console.log('Asset deleted:', result.publicId);
 * }
 */
export async function deleteCloudinaryAsset(
  publicId: string
): Promise<CloudinaryDeleteResult> {
  try {
    // Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        success: false,
        publicId,
        result: 'error',
        message: 'Cloudinary credentials not configured',
        error: 'Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET'
      };
    }

    // Generate timestamp for signature
    const timestamp = Math.floor(Date.now() / 1000);

    // Create signature: SHA1(params + api_secret)
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign)
      .digest('hex');

    // Prepare form data for Cloudinary API
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    // Call Cloudinary Admin API
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    // Handle different response scenarios
    if (result.result === 'ok') {
      return {
        success: true,
        publicId,
        result: 'ok',
        message: 'Asset deleted successfully'
      };
    }

    // Asset not found is still considered success (idempotent)
    if (result.result === 'not found') {
      return {
        success: true,
        publicId,
        result: 'not found',
        message: 'Asset already deleted or not found'
      };
    }

    // Other errors
    return {
      success: false,
      publicId,
      result: 'error',
      message: 'Failed to delete from Cloudinary',
      error: JSON.stringify(result)
    };
  } catch (error) {
    return {
      success: false,
      publicId,
      result: 'error',
      message: 'Cloudinary deletion failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Delete multiple assets from Cloudinary (batch operation)
 *
 * @param publicIds - Array of Cloudinary public_ids to delete
 * @returns Array of deletion results
 *
 * @example
 * const results = await deleteMultipleCloudinaryAssets([
 *   'high-res-assets/moon-8x10',
 *   'high-res-assets/moon-16x20'
 * ]);
 * const successCount = results.filter(r => r.success).length;
 */
export async function deleteMultipleCloudinaryAssets(
  publicIds: string[]
): Promise<CloudinaryDeleteResult[]> {
  // Execute deletions in parallel for efficiency
  const results = await Promise.all(
    publicIds.map(publicId => deleteCloudinaryAsset(publicId))
  );

  return results;
}
