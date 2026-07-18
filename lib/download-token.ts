import { SignJWT, jwtVerify } from "jose";

export interface DownloadClaim {
  email: string;
  artId: string;
}

const TOKEN_TTL_HOURS = 72;

function secretKey(): Uint8Array {
  const secret = process.env.DOWNLOAD_LINK_SECRET;
  if (!secret) throw new Error("DOWNLOAD_LINK_SECRET not configured");
  return new TextEncoder().encode(secret);
}

export async function signDownloadToken(claim: DownloadClaim): Promise<string> {
  return new SignJWT({ ...claim })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_HOURS}h`)
    .sign(secretKey());
}

export async function verifyDownloadToken(token: string): Promise<DownloadClaim | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      typeof payload.email !== "string" ||
      typeof payload.artId !== "string"
    ) return null;
    return { email: payload.email, artId: payload.artId };
  } catch {
    return null;
  }
}
