import { describe, it, expect } from 'vitest';
import {
  hashSecret,
  verifySecret,
  hashSecretSync,
  verifySecretSync,
  obfuscateKey,
  deobfuscateKey
} from '../lib/security';

describe('Security & Cryptographic Hashing Engine', () => {
  it('should generate consistent and identical SHA-256 hashes across sync and async implementations', async () => {
    const pin = '2026';
    const hashAsync1 = await hashSecret(pin);
    const hashAsync2 = await hashSecret(pin);
    const hashSync = hashSecretSync(pin);

    expect(hashAsync1).toBeTruthy();
    expect(typeof hashAsync1).toBe('string');
    expect(hashAsync1).toBe(hashAsync2);
    expect(hashSync).toBe(hashAsync1);
    expect(hashSync).not.toBe(pin);
  });

  it('should verify correct secrets and reject old or incorrect secrets synchronously & asynchronously', async () => {
    const updatedPin = '7391';
    const oldDefaultPin = '2026';
    const hashed = hashSecretSync(updatedPin);

    expect(verifySecretSync(updatedPin, hashed)).toBe(true);
    expect(verifySecretSync(oldDefaultPin, hashed)).toBe(false);
    expect(verifySecretSync('   ', hashed)).toBe(false);

    expect(await verifySecret(updatedPin, hashed)).toBe(true);
    expect(await verifySecret(oldDefaultPin, hashed)).toBe(false);
  });

  it('should maintain backward compatibility with legacy plain-text PINs', async () => {
    const legacyPin = '2026';
    expect(await verifySecret('2026', legacyPin)).toBe(true);
    expect(await verifySecret('9999', legacyPin)).toBe(false);
    expect(verifySecretSync('2026', legacyPin)).toBe(true);
    expect(verifySecretSync('9999', legacyPin)).toBe(false);
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
    expect(await hashSecret('')).toBe('');
    expect(hashSecretSync('   ')).toBe('');
    expect(await verifySecret('', '')).toBe(false);
    expect(verifySecretSync('', '')).toBe(false);
  });
});

