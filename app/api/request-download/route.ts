import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/sanity/lib/client";
import { signDownloadToken } from "@/lib/download-token";
import { getSubscriber, isOverWeeklyLimit, recordDownloadRequest, normalizeEmail } from "@/lib/subscriber-store";
import { emailProvider } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort per-IP throttle (resets on cold start — acceptable soft limit)
const ipHits = new Map<string, { count: number; windowStart: number }>();
function ipThrottled(ip: string): boolean {
  const now = Date.now();
  const rec = ipHits.get(ip);
  if (!rec || now - rec.windowStart > 60_000) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  return rec.count > 5;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, artId, sizeId, consent, website } = body as Record<string, unknown>;

    // Honeypot: real users never fill "website". Pretend success.
    if (typeof website === "string" && website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (ipThrottled(ip)) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    if (typeof rawEmail !== "string" || !EMAIL_RE.test(rawEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (consent !== true) {
      return NextResponse.json({ error: "Please confirm the consent checkbox." }, { status: 400 });
    }
    if (typeof artId !== "string" || typeof sizeId !== "string") {
      return NextResponse.json({ error: "Missing artwork or size." }, { status: 400 });
    }

    const email = normalizeEmail(rawEmail);
    const art = await getProductBySlug(artId);
    if (!art) return NextResponse.json({ error: "Artwork not found." }, { status: 404 });

    const isZip = sizeId === "all";
    const size = isZip ? null : art.sizes.find((s) => s.id === sizeId);
    if (!isZip && !size) return NextResponse.json({ error: "Size not found." }, { status: 404 });
    if (isZip && !art.zipUrl) return NextResponse.json({ error: "ZIP not available." }, { status: 404 });

    const existing = await getSubscriber(email);
    if (isOverWeeklyLimit(existing)) {
      return NextResponse.json(
        { error: "You've claimed 3 free prints this week — your next one unlocks within 7 days. (A new featured print drops monthly!)" },
        { status: 429 }
      );
    }

    const { isNewSubscriber } = await recordDownloadRequest(email, artId, sizeId, `art/${artId}`);

    const token = await signDownloadToken({ email, artId, sizeId });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thepixelprince.com";
    const downloadUrl = `${siteUrl}/api/claim-art?token=${encodeURIComponent(token)}`;

    await emailProvider.sendDownloadEmail({
      to: email,
      artTitle: art.title,
      sizeLabel: isZip ? "All sizes (ZIP)" : (size!.displayLabel || size!.id),
      downloadUrl,
    });

    // Non-blocking: audience add + welcome
    if (isNewSubscriber) {
      emailProvider.addToAudience(email).catch((e) => console.error("[REQUEST-DL] audience add failed", e));
      emailProvider.sendWelcomeEmail(email).catch((e) => console.error("[REQUEST-DL] welcome failed", e));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[REQUEST-DL] Error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
