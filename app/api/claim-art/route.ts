import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/sanity/lib/client";
import { verifyDownloadToken } from "@/lib/download-token";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * Secure API Route for Downloading Free Digital Art
 *
 * This route:
 * 1. Verifies the signed download token (issued via /api/request-download)
 * 2. Streams the file from Cloudinary or external URL (Google Drive/Dropbox)
 *
 * Query Parameters:
 * - token: signed download token (required in production)
 *
 * DEV MODE: Set DISABLE_DOWNLOAD_LIMIT=true in .env.local to bypass the token
 * requirement and use the old artId/sizeId/type query params directly.
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    // Dev bypass keeps the old query-param form working locally
    const downloadLimitDisabled = process.env.DISABLE_DOWNLOAD_LIMIT === "true";

    let artId: string | null;
    let sizeId: string | null;
    let isZip: boolean;

    if (token) {
      const claim = await verifyDownloadToken(token);
      if (!claim) {
        return NextResponse.json(
          { error: "This download link is invalid or has expired (links last 72 hours). Request the art again to get a fresh link." },
          { status: 403 }
        );
      }
      artId = claim.artId;
      isZip = claim.sizeId === "all";
      sizeId = isZip ? null : claim.sizeId;
    } else if (downloadLimitDisabled) {
      artId = searchParams.get("artId");
      sizeId = searchParams.get("sizeId");
      isZip = (searchParams.get("type") || "single") === "all";
    } else {
      return NextResponse.json(
        { error: "A download token is required. Enter your email on the artwork page to receive a download link." },
        { status: 401 }
      );
    }

    // Validate artId
    if (!artId) {
      return NextResponse.json(
        { error: "Missing artId parameter" },
        { status: 400 }
      );
    }

    // Find the art piece from Sanity
    const artPiece = await getProductBySlug(artId);

    if (!artPiece) {
      return NextResponse.json(
        { error: "Invalid artId - art piece not found" },
        { status: 404 }
      );
    }

    // For single downloads, validate sizeId
    if (!isZip && !sizeId) {
      return NextResponse.json(
        { error: "Missing sizeId parameter for single download" },
        { status: 400 }
      );
    }

    // For single downloads, find the size
    let size = null;
    if (!isZip) {
      size = artPiece.sizes.find((s) => s.id === sizeId);
      if (!size) {
        return NextResponse.json(
          { error: "Invalid sizeId - size not found" },
          { status: 404 }
        );
      }
    }

    // Increment download count in Sanity (fire-and-forget)
    // CRITICAL: This runs in the background and does NOT block the file download
    if (writeClient) {
      try {
        writeClient
          .patch(artPiece._id)
          .setIfMissing({ downloads: 0 }) // Initialize field if it doesn't exist
          .inc({ downloads: 1 })
          .commit()
          .catch((error) => {
            console.error('[CLAIM-ART] Failed to increment download count in Sanity:', error);
          });
      } catch (error) {
        console.error('[CLAIM-ART] Error setting up Sanity download increment:', error);
      }
    } else {
      console.warn('[CLAIM-ART] Write client not available - download count will not be incremented');
    }

    // Determine download URL and file details
    let downloadUrl: string | null = null;
    let contentType: string;
    let downloadName: string;

    if (isZip) {
      // Handle ZIP download from Cloudinary or external URL
      downloadUrl = artPiece.zipUrl || null;
      contentType = "application/zip";
      downloadName = `${artPiece.title.replace(/\s+/g, "-")}-all-sizes.zip`;

      if (!downloadUrl) {
        return NextResponse.json(
          {
            error: "ZIP file not available. Please contact support.",
            details: downloadLimitDisabled ? "Missing zipUrl in artwork data" : undefined
          },
          { status: 404 }
        );
      }
    } else {
      // Handle individual size download from Cloudinary or external URL
      if (!size) {
        return NextResponse.json(
          { error: "Size not found" },
          { status: 404 }
        );
      }

      const highResAsset = size.highResAsset;

      if (!highResAsset) {
        return NextResponse.json(
          {
            error: "This size is not available for download. Please contact support.",
            details: downloadLimitDisabled ? "Missing highResAsset in size data" : undefined
          },
          { status: 404 }
        );
      }

      downloadUrl = highResAsset.assetType === 'cloudinary'
        ? (highResAsset.cloudinaryUrl ?? null)
        : (highResAsset.externalUrl ?? null);

      contentType = "image/png";
      downloadName = `${artPiece.title.replace(/\s+/g, "-")}-${size.displayLabel.replace(/[^a-zA-Z0-9]/g, "")}.png`;

      if (!downloadUrl) {
        return NextResponse.json(
          {
            error: "File URL not configured. Please contact support.",
            details: downloadLimitDisabled ? "Missing URL in highResAsset" : undefined
          },
          { status: 404 }
        );
      }
    }

    // Fetch the file from the external URL
    let response: NextResponse;
    try {
      const fileResponse = await fetch(downloadUrl);

      if (!fileResponse.ok) {
        console.error(`[CLAIM-ART] Failed to fetch from URL: ${downloadUrl}`);
        return NextResponse.json(
          {
            error: "Unable to access file. Please try again later or contact support.",
            details: downloadLimitDisabled ? `URL returned status: ${fileResponse.status}` : undefined
          },
          { status: 500 }
        );
      }

      // Get the content as a stream
      const fileStream = fileResponse.body;

      if (!fileStream) {
        return NextResponse.json(
          { error: "Unable to stream file. Please try again." },
          { status: 500 }
        );
      }

      // Create response with the stream
      response = new NextResponse(fileStream, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${downloadName}"`,
          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      console.error(`[CLAIM-ART] Error fetching from URL:`, error);
      return NextResponse.json(
        { error: "Unable to download file. Please check your connection and try again." },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    console.error("[CLAIM-ART] Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
