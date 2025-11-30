import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // Get Cloudinary credentials from environment
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[Cloudinary Delete] Missing credentials');
      return NextResponse.json(
        {
          error: 'Cloudinary credentials not configured',
          details: 'Server is missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET'
        },
        { status: 500 }
      );
    }

    // Generate timestamp for signature
    const timestamp = Math.floor(Date.now() / 1000);

    // Create signature for API request
    // Cloudinary requires: SHA1(params + api_secret)
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign)
      .digest('hex');

    // Make DELETE request to Cloudinary API
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.result !== 'ok') {
      console.error('[Cloudinary Delete] Deletion failed:', result);

      // Don't fail the request if asset not found (already deleted)
      if (result.result === 'not found') {
        return NextResponse.json({
          success: true,
          message: 'Asset already deleted or not found',
          result: result.result
        });
      }

      return NextResponse.json(
        {
          error: 'Failed to delete from Cloudinary',
          details: result
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully',
      publicId,
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
