import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { freeArtCollection, DOWNLOAD_COOKIE_NAME, COOKIE_MAX_AGE } from "@/config/free-art";

/**
 * Secure API Route for Claiming Free Digital Art
 *
 * This route:
 * 1. Validates the artId parameter
 * 2. Checks if user has already claimed (via cookie)
 * 3. Streams the file from the private/ folder
 * 4. Sets a persistent cookie to track the claim
 */

export async function GET(request: NextRequest) {
  try {
    // Get artId from query params
    const searchParams = request.nextUrl.searchParams;
    const artId = searchParams.get("artId");

    // Validate artId
    if (!artId) {
      return NextResponse.json(
        { error: "Missing artId parameter" },
        { status: 400 }
      );
    }

    // Find the art piece in our collection
    const artPiece = freeArtCollection.find((art) => art.id === artId);

    if (!artPiece) {
      return NextResponse.json(
        { error: "Invalid artId - art piece not found" },
        { status: 404 }
      );
    }

    // Check if user has already claimed their free download
    const hasClaimed = request.cookies.get(DOWNLOAD_COOKIE_NAME);

    if (hasClaimed) {
      return NextResponse.json(
        {
          error: "You have already claimed your free gift!",
          message: "Each user can only claim one free art piece."
        },
        { status: 403 }
      );
    }

    // Resolve the file path (in private/ folder, not public/)
    const filePath = path.join(process.cwd(), "private", artPiece.privateFileName);

    // Security: Check if file exists
    if (!existsSync(filePath)) {
      console.error(`[CLAIM-ART] File not found: ${filePath}`);
      return NextResponse.json(
        { error: "File not available. Please contact support." },
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
        fileStream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });

        fileStream.on("end", () => {
          controller.close();
        });

        fileStream.on("error", (error: Error) => {
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
        "Content-Type": "image/png",
        "Content-Length": fileStats.size.toString(),
        "Content-Disposition": `attachment; filename="${artPiece.title.replace(/\s+/g, "-")}.png"`,
        "Cache-Control": "no-cache",
      },
    });

    // Set the cookie to mark this download as claimed
    response.cookies.set({
      name: DOWNLOAD_COOKIE_NAME,
      value: artId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[CLAIM-ART] Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
