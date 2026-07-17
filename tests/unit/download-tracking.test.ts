import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  parseDownloadCookie,
  serializeDownloadCookie,
  cleanupOldDownloads,
  getWeeklyDownloads,
  hasReachedWeeklyLimit,
  getDownloadsRemaining,
  hasDownloadedSize,
  hasDownloadedAllSizes,
  addDownload,
  getResetDate,
  formatResetDate,
  getStatusMessage,
  canDownload,
  type DownloadCookie,
} from "@/lib/download-tracking";

const NOW = new Date("2026-07-17T12:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => vi.useRealTimers());

describe("parseDownloadCookie", () => {
  it("returns empty on undefined", () => {
    expect(parseDownloadCookie(undefined)).toEqual({ downloads: [] });
  });
  it("returns empty on malformed JSON", () => {
    expect(parseDownloadCookie("not-json")).toEqual({ downloads: [] });
  });
  it("returns empty when downloads is not an array", () => {
    expect(
      parseDownloadCookie(encodeURIComponent('{"downloads":"x"}'))
    ).toEqual({ downloads: [] });
  });
  it("round-trips through serialize", () => {
    const c: DownloadCookie = {
      downloads: [{ artId: "a", sizeId: "8x10", timestamp: NOW }],
    };
    expect(parseDownloadCookie(serializeDownloadCookie(c))).toEqual(c);
  });
});

describe("weekly window", () => {
  const cookie: DownloadCookie = {
    downloads: [
      { artId: "old", sizeId: "s", timestamp: NOW - 8 * DAY },
      { artId: "new", sizeId: "s", timestamp: NOW - 1 * DAY },
    ],
  };
  it("cleanupOldDownloads drops >7d records", () => {
    expect(cleanupOldDownloads(cookie).downloads).toHaveLength(1);
  });
  it("getWeeklyDownloads counts only last 7 days", () => {
    expect(getWeeklyDownloads(cookie)).toHaveLength(1);
  });
  it("remaining = limit - weekly count", () => {
    expect(getDownloadsRemaining(cookie)).toBe(2);
  });
});

describe("canDownload", () => {
  it("blocks at 3 weekly downloads", () => {
    const full: DownloadCookie = {
      downloads: [1, 2, 3].map((i) => ({
        artId: `a${i}`, sizeId: "s", timestamp: NOW - i * 1000,
      })),
    };
    expect(hasReachedWeeklyLimit(full)).toBe(true);
    expect(canDownload(full, "a9", "s").allowed).toBe(false);
  });
  it("blocks duplicate size, allows new size", () => {
    const c = addDownload({ downloads: [] }, "art1", "8x10");
    expect(hasDownloadedSize(c, "art1", "8x10")).toBe(true);
    expect(canDownload(c, "art1", "8x10").allowed).toBe(false);
    expect(canDownload(c, "art1", "4x5").allowed).toBe(true);
  });
  it("blocks duplicate ZIP", () => {
    const c = addDownload({ downloads: [] }, "art1", "all", true);
    expect(hasDownloadedAllSizes(c, "art1")).toBe(true);
    expect(canDownload(c, "art1", "all", true).allowed).toBe(false);
  });
});

describe("reset date + messages", () => {
  it("getResetDate is null with no downloads", () => {
    expect(getResetDate({ downloads: [] })).toBeNull();
  });
  it("reset is 7 days after oldest weekly download", () => {
    const c: DownloadCookie = {
      downloads: [{ artId: "a", sizeId: "s", timestamp: NOW - 2 * DAY }],
    };
    expect(getResetDate(c)!.getTime()).toBe(NOW + 5 * DAY);
  });
  it("formatResetDate buckets", () => {
    expect(formatResetDate(null)).toBe("now");
    expect(formatResetDate(new Date(NOW + 5 * DAY))).toBe("in 5 days");
    expect(formatResetDate(new Date(NOW + 1 * DAY))).toBe("tomorrow");
  });
  it("getStatusMessage full/partial/empty", () => {
    expect(getStatusMessage({ downloads: [] }).message).toContain("3 free");
    const one = addDownload({ downloads: [] }, "a", "s");
    expect(getStatusMessage(one).remaining).toBe(2);
  });
});
