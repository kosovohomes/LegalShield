/**
 * Browser-side cryptography (PRD §9, §8.6).
 * SHA-256 fingerprinting of evidence before upload; room to add future
 * client-side encryption (CSE-A) behind the same interface.
 */

export async function hashFile(file: Blob): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return hex(digest);
}

export async function hashBytes(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return hex(digest);
}

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Short human fingerprint like a4c1…9f02 (used for display only). */
export function shortHash(full: string): string {
  if (full.length <= 12) return full;
  return `${full.slice(0, 4)}…${full.slice(-4)}`;
}

export async function browserCryptoAvailable(): Promise<boolean> {
  return typeof crypto !== "undefined" && !!crypto.subtle;
}