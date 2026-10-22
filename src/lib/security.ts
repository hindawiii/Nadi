/**
 * Security and Cryptographic Hashing Utilities
 * Employs standard Web Crypto SHA-256 with intentional salting to prevent
 * rainbow table lookups and protect administrative PINs from plain-text exposure.
 */

const PIN_SALT = 'nadi_luxe_store_security_salt_2026_';

/**
 * Computes a secure SHA-256 hexadecimal digest for a given secret/PIN.
 */
export async function hashSecret(secret: string): Promise<string> {
  const clean = secret.trim();
  if (!clean) return '';

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(PIN_SALT + clean);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (_) {
      // Fallback below
    }
  }

  // Defensive fallback hash
  let hash = 0x811c9dc5;
  const salted = PIN_SALT + clean;
  for (let i = 0; i < salted.length; i++) {
    hash ^= salted.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return 'fnv:' + hash.toString(16);
}

/**
 * Verifies an entered PIN against either a stored hash or a legacy plain-text PIN.
 * Provides backwards compatibility while upgrading security.
 */
export async function verifySecret(
  entered: string,
  storedValueOrHash: string
): Promise<boolean> {
  const cleanEntered = entered.trim();
  const cleanStored = storedValueOrHash.trim();
  if (!cleanEntered || !cleanStored) return false;

  // Direct plain match (legacy backwards compatibility)
  if (cleanEntered === cleanStored) {
    return true;
  }

  // Hash-based comparison
  const calculatedHash = await hashSecret(cleanEntered);
  return calculatedHash === cleanStored;
}

/**
 * Obfuscates stored session keys in localStorage to prevent casual plain-text inspection.
 */
export function obfuscateKey(key: string): string {
  try {
    return btoa('lx:' + encodeURIComponent(key));
  } catch {
    return key;
  }
}

/**
 * De-obfuscates stored session keys from localStorage.
 */
export function deobfuscateKey(obfuscated: string): string {
  try {
    const decoded = decodeURIComponent(atob(obfuscated));
    return decoded.startsWith('lx:') ? decoded.slice(3) : decoded;
  } catch {
    return obfuscated;
  }
}
