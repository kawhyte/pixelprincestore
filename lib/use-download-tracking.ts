/**
 * Client-side React Hook for Download Tracking
 *
 * Provides access to download status and limits in client components
 */

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  parseDownloadCookie,
  getStatusMessage,
  getDownloadsRemaining,
  hasDownloadedSize,
  hasDownloadedAllSizes,
  type DownloadCookie,
} from "./download-tracking";
import { DOWNLOAD_COOKIE_NAME } from "@/config/free-art";

export function useDownloadTracking() {
  const [cookie, setCookie] = useState<DownloadCookie>({ downloads: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Load cookie on mount and set up listener
  useEffect(() => {
    const loadCookie = () => {
      const cookieValue = Cookies.get(DOWNLOAD_COOKIE_NAME);
      const parsed = parseDownloadCookie(cookieValue);
      setCookie(parsed);
      setIsLoading(false);
    };

    loadCookie();

    // Check for cookie changes every second (simple polling)
    const interval = setInterval(loadCookie, 1000);

    return () => clearInterval(interval);
  }, []);

  const status = getStatusMessage(cookie);
  const remaining = getDownloadsRemaining(cookie);

  return {
    cookie,
    isLoading,
    remaining,
    limit: status.limit,
    resetDate: status.resetDate,
    message: status.message,
    hasDownloadedSize: (artId: string, sizeId: string) =>
      hasDownloadedSize(cookie, artId, sizeId),
    hasDownloadedAllSizes: (artId: string) =>
      hasDownloadedAllSizes(cookie, artId),
    refresh: () => {
      const cookieValue = Cookies.get(DOWNLOAD_COOKIE_NAME);
      const parsed = parseDownloadCookie(cookieValue);
      setCookie(parsed);
    },
  };
}
