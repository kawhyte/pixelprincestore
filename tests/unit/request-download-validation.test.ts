import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  weeklyDownloadCount,
  isOverWeeklyLimit,
  type SubscriberDoc,
} from "@/lib/subscriber-store";

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Kenny@Example.com  ")).toBe("kenny@example.com");
  });
});

describe("weeklyDownloadCount / isOverWeeklyLimit", () => {
  it("counts downloads inside the 7-day window as over limit at 3", () => {
    const now = Date.now();
    const sub: SubscriberDoc = {
      _id: "subscriber-x",
      email: "a@b.com",
      downloads: [
        { artId: "a", sizeId: "8x10", requestedAt: new Date(now - 1000).toISOString() },
        { artId: "b", sizeId: "8x10", requestedAt: new Date(now - 2000).toISOString() },
        { artId: "c", sizeId: "8x10", requestedAt: new Date(now - 3000).toISOString() },
      ],
    };
    expect(weeklyDownloadCount(sub)).toBe(3);
    expect(isOverWeeklyLimit(sub)).toBe(true);
  });

  it("ignores downloads older than 7 days", () => {
    const now = Date.now();
    const eightDaysAgo = now - 8 * 24 * 60 * 60 * 1000;
    const sub: SubscriberDoc = {
      _id: "subscriber-x",
      email: "a@b.com",
      downloads: [
        { artId: "a", sizeId: "8x10", requestedAt: new Date(eightDaysAgo).toISOString() },
        { artId: "b", sizeId: "8x10", requestedAt: new Date(eightDaysAgo).toISOString() },
        { artId: "c", sizeId: "8x10", requestedAt: new Date(eightDaysAgo).toISOString() },
      ],
    };
    expect(weeklyDownloadCount(sub)).toBe(0);
    expect(isOverWeeklyLimit(sub)).toBe(false);
  });

  it("treats null subscriber as zero downloads", () => {
    expect(weeklyDownloadCount(null)).toBe(0);
    expect(isOverWeeklyLimit(null)).toBe(false);
  });
});
