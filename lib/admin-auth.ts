import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Admin-secret gate for studio-only API routes.
 * The secret is entered once by Kenny in the browser (stored in
 * sessionStorage by the calling components) and checked server-side
 * against ADMIN_API_SECRET. Constant-time compare to avoid timing leaks.
 */
export function requireAdminSecret(request: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Admin API not configured" },
      { status: 503 }
    );
  }
  const provided = request.headers.get("x-admin-secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  const equal = a.length === b.length && timingSafeEqual(a, b);
  if (!equal) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
