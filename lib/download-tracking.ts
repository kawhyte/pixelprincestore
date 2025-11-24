/**
 * Download Tracking Utility
 *
 * Manages download tracking via cookies:
 * - Users can download 3 sizes per week
 * - Tracks downloads by artId + sizeId + timestamp
 * - Auto-cleans records older than 7 days
 * - Uses user's local timezone for "week" calculation
 */

import { DOWNLOAD_COOKIE_NAME, WEEKLY_DOWNLOAD_LIMIT } from "@/config/free-art";

export interface Download {
  artId: string;
  sizeId: string;
  timestamp: number;
  isZip?: boolean; // True if this was a ZIP download
}

export interface DownloadCookie {
  downloads: Download[];
}

/**
 * Parse the download cookie from cookie string
 */
export function parseDownloadCookie(cookieValue: string | undefined): DownloadCookie {
  if (!cookieValue) {
    return { downloads: [] };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));
    return {
      downloads: Array.isArray(parsed.downloads) ? parsed.downloads : [],
    };
  } catch {
    return { downloads: [] };
  }
}

/**
 * Serialize download cookie for storage
 */
export function serializeDownloadCookie(cookie: DownloadCookie): string {
  return encodeURIComponent(JSON.stringify(cookie));
}

/**
 * Clean up downloads older than 7 days
 */
export function cleanupOldDownloads(cookie: DownloadCookie): DownloadCookie {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

  return {
    downloads: cookie.downloads.filter((d) => d.timestamp > sevenDaysAgo),
  };
}

/**
 * Get downloads from the current week (last 7 days)
 */
export function getWeeklyDownloads(cookie: DownloadCookie): Download[] {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  return cookie.downloads.filter((d) => d.timestamp > sevenDaysAgo);
}

/**
 * Check if user has reached weekly download limit
 */
export function hasReachedWeeklyLimit(cookie: DownloadCookie): boolean {
  const weeklyDownloads = getWeeklyDownloads(cookie);
  return weeklyDownloads.length >= WEEKLY_DOWNLOAD_LIMIT;
}

/**
 * Get number of downloads remaining this week
 */
export function getDownloadsRemaining(cookie: DownloadCookie): number {
  const weeklyDownloads = getWeeklyDownloads(cookie);
  return Math.max(0, WEEKLY_DOWNLOAD_LIMIT - weeklyDownloads.length);
}

/**
 * Check if a specific size has already been downloaded
 */
export function hasDownloadedSize(
  cookie: DownloadCookie,
  artId: string,
  sizeId: string
): boolean {
  const weeklyDownloads = getWeeklyDownloads(cookie);
  return weeklyDownloads.some(
    (d) => d.artId === artId && d.sizeId === sizeId && !d.isZip
  );
}

/**
 * Check if all sizes (ZIP) have been downloaded for an artwork
 */
export function hasDownloadedAllSizes(
  cookie: DownloadCookie,
  artId: string
): boolean {
  const weeklyDownloads = getWeeklyDownloads(cookie);
  return weeklyDownloads.some((d) => d.artId === artId && d.isZip);
}

/**
 * Add a download record to the cookie
 */
export function addDownload(
  cookie: DownloadCookie,
  artId: string,
  sizeId: string,
  isZip: boolean = false
): DownloadCookie {
  // Clean up old downloads first
  const cleaned = cleanupOldDownloads(cookie);

  // Add new download
  return {
    downloads: [
      ...cleaned.downloads,
      {
        artId,
        sizeId,
        timestamp: Date.now(),
        isZip,
      },
    ],
  };
}

/**
 * Get the date when downloads will reset (7 days from oldest download)
 */
export function getResetDate(cookie: DownloadCookie): Date | null {
  const weeklyDownloads = getWeeklyDownloads(cookie);

  if (weeklyDownloads.length === 0) {
    return null;
  }

  // Find oldest download in current week
  const oldestDownload = weeklyDownloads.reduce((oldest, current) => {
    return current.timestamp < oldest.timestamp ? current : oldest;
  });

  // Reset is 7 days after oldest download
  return new Date(oldestDownload.timestamp + (7 * 24 * 60 * 60 * 1000));
}

/**
 * Format reset date for display (e.g., "in 3 days", "tomorrow")
 */
export function formatResetDate(resetDate: Date | null): string {
  if (!resetDate) {
    return "now";
  }

  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays < 0) {
    return "now";
  } else if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "tomorrow";
  } else {
    return `in ${diffDays} days`;
  }
}

/**
 * Get user-friendly status message
 */
export function getStatusMessage(cookie: DownloadCookie): {
  remaining: number;
  limit: number;
  resetDate: Date | null;
  message: string;
} {
  const remaining = getDownloadsRemaining(cookie);
  const resetDate = getResetDate(cookie);
  const resetText = formatResetDate(resetDate);

  let message = "";

  if (remaining === WEEKLY_DOWNLOAD_LIMIT) {
    message = `You have ${remaining} free downloads available this week!`;
  } else if (remaining > 0) {
    message = `${remaining} download${remaining === 1 ? "" : "s"} remaining. Resets ${resetText}.`;
  } else {
    message = `Weekly limit reached. Downloads reset ${resetText}.`;
  }

  return {
    remaining,
    limit: WEEKLY_DOWNLOAD_LIMIT,
    resetDate,
    message,
  };
}

/**
 * Validate that a download is allowed
 */
export function canDownload(
  cookie: DownloadCookie,
  artId: string,
  sizeId: string,
  isZip: boolean = false
): {
  allowed: boolean;
  reason?: string;
} {
  // Check weekly limit
  if (hasReachedWeeklyLimit(cookie)) {
    const resetDate = getResetDate(cookie);
    const resetText = formatResetDate(resetDate);
    return {
      allowed: false,
      reason: `You've reached your weekly limit of ${WEEKLY_DOWNLOAD_LIMIT} downloads. Downloads reset ${resetText}.`,
    };
  }

  // Check if already downloaded this specific size
  if (!isZip && hasDownloadedSize(cookie, artId, sizeId)) {
    return {
      allowed: false,
      reason: "You've already downloaded this size this week.",
    };
  }

  // Check if already downloaded ZIP for this artwork
  if (isZip && hasDownloadedAllSizes(cookie, artId)) {
    return {
      allowed: false,
      reason: "You've already downloaded all sizes (ZIP) for this artwork this week.",
    };
  }

  return { allowed: true };
}
