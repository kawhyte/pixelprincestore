import { NextRequest, NextResponse } from 'next/server';
import { deleteCloudinaryAsset } from '@/lib/cloudinary-utils';

/**
 * DELETE /api/cloudinary/delete
 *
 * Deletes an asset from Cloudinary using the Admin API
 *
 * Body:
 * - publicId: The Cloudinary public_id to delete
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY (server-side only)
 * - CLOUDINARY_API_SECRET (server-side only)
 *
 * Note: This endpoint is used by the UI for manual deletions.
 * Automated garbage collection is handled by the Sanity webhook at /api/webhooks/sanity
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: 'Missing publicId parameter' },
        { status: 400 }
      );
    }

    console.log('[Cloudinary Delete] Deleting asset:', publicId);

    // Use shared deletion utility
    const result = await deleteCloudinaryAsset(publicId);

    if (!result.success) {
      console.error('[Cloudinary Delete] Deletion failed:', result.error);
      return NextResponse.json(
        {
          error: result.message,
          details: result.error
        },
        { status: 500 }
      );
    }

    console.log('[Cloudinary Delete] Success:', result.message);

    return NextResponse.json({
      success: true,
      message: result.message,
      publicId: result.publicId,
      result: result.result
    });

  } catch (error) {
    console.error('[Cloudinary Delete] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
