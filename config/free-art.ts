/**
 * Free Art Download Configuration
 *
 * Constants for managing download tracking and limits.
 * All art content is now managed through Sanity CMS.
 */

// Download tracking configuration
export const DOWNLOAD_COOKIE_NAME = "pp_downloads";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
export const WEEKLY_DOWNLOAD_LIMIT = 3; // Maximum downloads per week
export const DOWNLOADS_PER_WEEK = 3; // User-facing constant
