import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { getProductBySlug } from "@/sanity/lib/client";
import { DOWNLOAD_COOKIE_NAME, COOKIE_MAX_AGE } from "@/config/free-art";
import {
  parseDownloadCookie,
  canDownload,
  addDownload,
  serializeDownloadCookie,
  getStatusMessage,
} from "@/lib/download-tracking";

/**
 * Secure API Route for Downloading Free Digital Art
 *
 * This route:
 * 1. Validates artId and sizeId (or type=all for ZIP)
 * 2. Checks weekly download limit (3 per week)
 * 3. Streams the file from private/free/ folder
 * 4. Updates cookie with download record
 *
 * Query Parameters:
 * - artId: ID of the art piece (required)
 * - sizeId: ID of the size (required for single downloads)
 * - type: "single" or "all" (default: "single")
 *
 * Examples:
 * - /api/claim-art?artId=art_1&sizeId=8x10
 * - /api/claim-art?artId=art_1&type=all
 *
 * DEV MODE: Set DISABLE_DOWNLOAD_LIMIT=true in .env.local to bypass limits
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artId = searchParams.get("artId");
    const sizeId = searchParams.get("sizeId");
    const type = searchParams.get("type") || "single";

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

    // Determine if this is a ZIP download
    const isZip = type === "all";

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

    // Check download limit (unless disabled for development)
    const downloadLimitDisabled = process.env.DISABLE_DOWNLOAD_LIMIT === "true";

    if (!downloadLimitDisabled) {
      // Parse existing cookie
      const cookieValue = request.cookies.get(DOWNLOAD_COOKIE_NAME)?.value;
      const cookie = parseDownloadCookie(cookieValue);

      // Validate download
      const validation = canDownload(
        cookie,
        artId,
        isZip ? "all" : sizeId!,
        isZip
      );

      if (!validation.allowed) {
        const status = getStatusMessage(cookie);
        return NextResponse.json(
          {
            error: validation.reason,
            remaining: status.remaining,
            limit: status.limit,
            resetDate: status.resetDate,
          },
          { status: 403 }
        );
      }
    }

    // Determine file path
    let fileName: string;
    let contentType: string;
    let downloadName: string;

    if (isZip) {
      fileName = artPiece.allSizesZip;
      contentType = "application/zip";
      downloadName = `${artPiece.title.replace(/\s+/g, "-")}-all-sizes.zip`;
    } else {
      fileName = size!.fileName;
      contentType = "image/png";
      downloadName = `${artPiece.title.replace(/\s+/g, "-")}-${size!.label.replace(/[^a-zA-Z0-9]/g, "")}.png`;
    }

    const filePath = path.join(process.cwd(), "private", "free", fileName);

    // Security: Check if file exists
    if (!existsSync(filePath)) {
      console.error(`[CLAIM-ART] File not found: ${filePath}`);
      return NextResponse.json(
        {
          error: "File not available. Please contact support.",
          details: downloadLimitDisabled ? `Path: ${filePath}` : undefined
        },
        { status: 500 }
      );
    }

    // Get file stats for Content-Length header
    const fileStats = await stat(filePath);

    // Create a readable stream
    const fileStream = createReadStream(filePath);

    // Convert Node.js stream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => {
          controller.enqueue(new Uint8Array(chunk as Buffer));
        });

        fileStream.on("end", () => {
          controller.close();
        });

        fileStream.on("error", (error) => {
          controller.error(error);
        });
      },
      cancel() {
        fileStream.destroy();
      },
    });

    // Create response with file stream
    const response = new NextResponse(readableStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStats.size.toString(),
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Cache-Control": "no-cache",
      },
    });

    // Update cookie with download record (unless disabled)
    if (!downloadLimitDisabled) {
      const cookieValue = request.cookies.get(DOWNLOAD_COOKIE_NAME)?.value;
      const cookie = parseDownloadCookie(cookieValue);
      const updatedCookie = addDownload(
        cookie,
        artId,
        isZip ? "all" : sizeId!,
        isZip
      );
      const serialized = serializeDownloadCookie(updatedCookie);

      response.cookies.set({
        name: DOWNLOAD_COOKIE_NAME,
        value: serialized,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
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
