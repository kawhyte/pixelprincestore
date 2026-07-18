import { describe, it, expect, beforeEach } from "vitest";
import { signDownloadToken, verifyDownloadToken } from "@/lib/download-token";

beforeEach(() => {
  process.env.DOWNLOAD_LINK_SECRET = "test-secret";
});

describe("download-token", () => {
  it("round-trips a claim through sign and verify", async () => {
    const claim = { email: "test@example.com", artId: "ethereal-dreams" };
    const token = await signDownloadToken(claim);
    const verified = await verifyDownloadToken(token);
    expect(verified).toEqual(claim);
  });

  it("rejects a tampered token", async () => {
    const token = await signDownloadToken({ email: "a@b.com", artId: "x" });
    const verified = await verifyDownloadToken(token + "x");
    expect(verified).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signDownloadToken({ email: "a@b.com", artId: "x" });
    process.env.DOWNLOAD_LINK_SECRET = "different-secret";
    const verified = await verifyDownloadToken(token);
    expect(verified).toBeNull();
  });

  it("rejects garbage input", async () => {
    const verified = await verifyDownloadToken("garbage");
    expect(verified).toBeNull();
  });
});
