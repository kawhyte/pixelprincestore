/**
 * Cloudinary Utilities
 * Helper functions for working with Cloudinary URLs and deletion
 */

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
