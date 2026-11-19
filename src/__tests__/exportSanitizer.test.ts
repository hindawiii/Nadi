import { describe, it, expect, beforeEach } from 'vitest';
import { siteConfig, SiteConfig } from '../data/siteConfig';
import {
  buildSanitizedTemplateExport,
  sanitizeSavedTemplateForExport,
  sanitizeConfigForGoldenSnapshot,
  stripSensitiveKeysDeep,
} from '../lib/exportSanitizer';
import {
  createGoldenSnapshot,
  getGoldenSnapshot,
  restoreGoldenState,
  GOLDEN_STORAGE_KEY_SNAPSHOT,
} from '../data/goldenStoreConfig';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

describe('Template Export & Golden Backup Sanitization (exportSanitizer)', () => {
  beforeEach(() => {
    const memStorage = new MemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: memStorage,
      writable: true,
      configurable: true,
    });
  });

  it('strips security objects, admin/developer PINs, recovery contacts, and nested secret keys from exported templates', () => {
    const taintedPreset: any = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics));
    taintedPreset.security = {
      adminPin: 'SECRET-ADMIN-9911',
      developerPin: 'SECRET-DEV-8822',
      developerRecoveryPhone: '+966555000111',
      developerRecoveryEmail: 'owner-secret@example.com',
    };
    taintedPreset.apiKey = 'AIza-FAKE-LEAKED-KEY';
    taintedPreset.products[0].admin_pin = 'NESTED-PIN-7777';
    taintedPreset.products[0].accessToken = 'eyJhbGciOiJIUzI1NiJ9.leaked';
    taintedPreset.products[0].optionalUndefined = undefined;

    const exported = buildSanitizedTemplateExport({
      paletteId: 'imperial-orchid',
      typographyId: 'nadi-royal',
      customPalette: { primary: '#5A3E7A', accent: '#D4AF37', surface: '#FAF8FC' },
      presetData: taintedPreset,
    });

    const json = JSON.stringify(exported);
    expect(json).not.toContain('SECRET-ADMIN-9911');
    expect(json).not.toContain('SECRET-DEV-8822');
    expect(json).not.toContain('owner-secret@example.com');
    expect(json).not.toContain('+966555000111');
    expect(json).not.toContain('AIza-FAKE-LEAKED-KEY');
    expect(json).not.toContain('NESTED-PIN-7777');
    expect(json).not.toContain('eyJhbGciOiJIUzI1NiJ9.leaked');
    expect('security' in (exported.presetData as any)).toBe(false);
    expect('apiKey' in (exported.presetData as any)).toBe(false);
    expect('optionalUndefined' in (exported.presetData.products[0] as any)).toBe(false);
    // Legitimate storefront data remains intact
    expect(exported.presetData.storeName.en).toBe('NADI');
    expect(exported.presetData.products.length).toBeGreaterThan(0);
  });

  it('sanitizes saved custom templates before JSON download', () => {
    const savedTpl = {
      id: 'custom-tpl-1',
      name: { ar: 'قالب ندي', en: 'NADI Theme' },
      savedAt: '2026-11-19T00:00:00.000Z',
      paletteId: 'imperial-orchid',
      typographyId: 'nadi-royal',
      security: { adminPin: 'LEAK-1234', developerPin: 'LEAK-5678' },
      presetData: {
        storeName: { ar: 'نَـــــدِي', en: 'NADI' },
        pinHash: 'sha256:leakedhash',
        password: 'super-secret-password',
      },
    };

    const sanitized = sanitizeSavedTemplateForExport(savedTpl as Record<string, unknown>);
    const serialized = JSON.stringify(sanitized);

    expect('security' in sanitized).toBe(false);
    expect(serialized).not.toContain('LEAK-1234');
    expect(serialized).not.toContain('LEAK-5678');
    expect(serialized).not.toContain('sha256:leakedhash');
    expect(serialized).not.toContain('super-secret-password');
    expect((sanitized.name as { en: string }).en).toBe('NADI Theme');
  });

  it('never writes security credentials or PINs into Golden Snapshot localStorage backup and restores safely', () => {
    const configWithSecrets: SiteConfig = JSON.parse(JSON.stringify(siteConfig));
    configWithSecrets.security = {
      adminPin: 'LIVE-ADMIN-PIN-4040',
      developerPin: 'LIVE-DEV-PIN-9090',
      isDeveloperModeLocked: true,
      developerRecoveryPhone: '+249900000000',
      developerRecoveryEmail: 'private-recovery@example.com',
    };

    const snapshotMeta = createGoldenSnapshot(configWithSecrets);
    const rawStored = localStorage.getItem(GOLDEN_STORAGE_KEY_SNAPSHOT) || '';

    expect(rawStored.length).toBeGreaterThan(0);
    expect('security' in snapshotMeta.config).toBe(false);
    expect(rawStored).not.toContain('LIVE-ADMIN-PIN-4040');
    expect(rawStored).not.toContain('LIVE-DEV-PIN-9090');
    expect(rawStored).not.toContain('+249900000000');
    expect(rawStored).not.toContain('private-recovery@example.com');
    expect(rawStored).not.toContain('adminPin');
    expect(rawStored).not.toContain('developerPin');

    // Reading snapshot defensively strips any legacy security block if tampered in localStorage
    const tampered = JSON.parse(rawStored);
    tampered.config.security = { adminPin: 'TAMPERED-PIN' };
    localStorage.setItem(GOLDEN_STORAGE_KEY_SNAPSHOT, JSON.stringify(tampered));

    const loaded = getGoldenSnapshot();
    expect(loaded).not.toBeNull();
    expect('security' in (loaded!.config as any)).toBe(false);

    // Restoring keeps live in-memory security without reading from localStorage
    const restored = restoreGoldenState(configWithSecrets.security);
    expect(restored.success).toBe(true);
    expect(restored.config.security.adminPin).toBe('LIVE-ADMIN-PIN-4040');
    expect(restored.config.presets.cosmetics.storeName.en).toBe('NADI');
  });

  it('handles nested arrays and case-insensitive sensitive key variants', () => {
    const input = {
      items: [
        { id: '1', Refresh_Token: 'rt-secret', Private_Key: 'pk-secret', title: 'Serum' },
      ],
      OAuthClientId: 'client-id-secret',
      keepMe: true,
    };

    const clean = stripSensitiveKeysDeep(input) as any;
    expect(clean.keepMe).toBe(true);
    expect(clean.OAuthClientId).toBeUndefined();
    expect(clean.items[0].title).toBe('Serum');
    expect(clean.items[0].Refresh_Token).toBeUndefined();
    expect(clean.items[0].Private_Key).toBeUndefined();

    const sanitizedConfig = sanitizeConfigForGoldenSnapshot(siteConfig);
    expect('security' in sanitizedConfig).toBe(false);
  });
});
