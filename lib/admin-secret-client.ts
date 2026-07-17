"use client";

/**
 * Returns the admin secret for studio API calls, prompting once per
 * browser session. sessionStorage (not localStorage) so it does not
 * persist on shared machines.
 */
export function getAdminSecret(): string | null {
  if (typeof window === "undefined") return null;
  let secret = sessionStorage.getItem("pp_admin_secret");
  if (!secret) {
    secret = window.prompt("Enter admin secret to use this tool:");
    if (secret) sessionStorage.setItem("pp_admin_secret", secret);
  }
  return secret;
}
