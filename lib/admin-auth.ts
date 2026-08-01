import { createHash } from "crypto";

export const ADMIN_COOKIE_NAME = "aqx_admin";

/**
 * Lightweight, self-issued admin gate for the internal /admin/orders view.
 * ADMIN_ACCESS_KEY is a password the merchant picks themselves (not a new
 * third-party account) / this is intentionally simple, not enterprise auth.
 */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_ACCESS_KEY);
}

export function checkAdminPassword(password: string): boolean {
  const key = process.env.ADMIN_ACCESS_KEY;
  return Boolean(key) && password === key;
}

/** Cookie value on success / a hash, never the plaintext password. */
export function adminCookieToken(): string | null {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key) return null;
  return createHash("sha256").update(key).digest("hex");
}
