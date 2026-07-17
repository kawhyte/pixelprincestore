import { NextRequest, NextResponse } from "next/server";
import { recordSubscription, normalizeEmail } from "@/lib/subscriber-store";
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
    const { email: rawEmail, consent, source, website } = body as Record<string, unknown>;

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

    const email = normalizeEmail(rawEmail);
    const { isNewSubscriber } = await recordSubscription(email, typeof source === "string" ? source : "unknown");

    if (isNewSubscriber) {
      emailProvider.addToAudience(email).catch((e) => console.error("[SUBSCRIBE] audience add failed", e));
      emailProvider.sendWelcomeEmail(email).catch((e) => console.error("[SUBSCRIBE] welcome failed", e));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[SUBSCRIBE] Error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
