import { describe, it, expect } from 'vitest';
import { hashSecret, verifySecret, obfuscateKey, deobfuscateKey } from '../lib/security';

describe('Security & Cryptographic Hashing Engine', () => {
  it('should generate consistent and non-empty SHA-256 hashes for a given PIN', async () => {
    const pin = '2026';
    const hash1 = await hashSecret(pin);
    const hash2 = await hashSecret(pin);

    expect(hash1).toBeTruthy();
    expect(typeof hash1).toBe('string');
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(pin);
  });

  it('should verify correct secrets and reject incorrect secrets', async () => {
    const correctPin = '2026';
    const wrongPin = '1234';
    const hashed = await hashSecret(correctPin);

    const isMatch = await verifySecret(correctPin, hashed);
    const isWrongMatch = await verifySecret(wrongPin, hashed);

    expect(isMatch).toBe(true);
    expect(isWrongMatch).toBe(false);
  });

  it('should maintain backward compatibility with legacy plain-text PINs', async () => {
    const legacyPin = '2026';
    const isDirectMatch = await verifySecret('2026', legacyPin);
    const isDifferent = await verifySecret('9999', legacyPin);

    expect(isDirectMatch).toBe(true);
    expect(isDifferent).toBe(false);
  });

  it('should correctly obfuscate and deobfuscate sensitive keys in storage', () => {
    const secret = '998877';
    const obfuscated = obfuscateKey(secret);

    expect(obfuscated).not.toBe(secret);
    expect(typeof obfuscated).toBe('string');

    const recovered = deobfuscateKey(obfuscated);
    expect(recovered).toBe(secret);
  });

  it('should gracefully handle empty or invalid inputs', async () => {
    const emptyHash = await hashSecret('');
    expect(emptyHash).toBe('');

    const emptyVerify = await verifySecret('', '');
    expect(emptyVerify).toBe(false);
  });
});
