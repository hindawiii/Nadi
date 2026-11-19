import { describe, it, expect, vi, beforeEach } from 'vitest';
import { siteConfig, SiteConfig } from '../data/siteConfig';

const mockAuthState: { currentUser: { uid: string } | null } = {
  currentUser: null,
};

vi.mock('../lib/firebase', () => ({
  auth: {
    get currentUser() {
      return mockAuthState.currentUser;
    },
  },
  db: {},
}));

import { buildPublicStorefrontPayload } from '../services/storeConfigService';

// Must stay strictly synchronized with firestore.rules -> isValidStorefrontConfig()
const ALLOWED_PUBLIC_STOREFRONT_KEYS = new Set([
  'activePresetId',
  'presets',
  'currencies',
  'sectionsControl',
  'sectionsOrder',
  'paletteId',
  'customColors',
  'typographyId',
  'updatedAt',
  'updatedBy',
]);

describe('Storefront Cloud Payload Sanitization (storeConfigService)', () => {
  beforeEach(() => {
    mockAuthState.currentUser = null;
  });

  it('strictly omits security secrets (adminPin, developerPin, recovery contacts) from public payload', () => {
    const configWithSecrets: SiteConfig = JSON.parse(JSON.stringify(siteConfig));
    configWithSecrets.security = {
      adminPin: 'SUPER-SECRET-ADMIN-PIN-9182',
      developerPin: 'SUPER-SECRET-DEV-PIN-774411',
      isDeveloperModeLocked: false,
      developerRecoveryPhone: '+966500000000',
      developerRecoveryEmail: 'secret-owner@example.com',
    };

    const payload = buildPublicStorefrontPayload({
      dynamicConfig: configWithSecrets,
      activePresetId: 'cosmetics',
      sectionsControl: { hero: true, productsCatalog: true },
      sectionsOrder: ['hero', 'productsCatalog'],
      paletteId: 'imperial-orchid',
      customColors: null,
      typographyId: 'royal-luxury',
    });

    const serialized = JSON.stringify(payload);
    expect('security' in payload).toBe(false);
    expect(serialized).not.toContain('SUPER-SECRET-ADMIN-PIN-9182');
    expect(serialized).not.toContain('SUPER-SECRET-DEV-PIN-774411');
    expect(serialized).not.toContain('developerRecoveryPhone');
    expect(serialized).not.toContain('developerRecoveryEmail');
    expect(serialized).not.toContain('adminPin');
    expect(serialized).not.toContain('developerPin');
  });

  it('produces only keys permitted by firestore.rules isValidStorefrontConfig', () => {
    mockAuthState.currentUser = { uid: 'owner-uid-123' };

    const payload = buildPublicStorefrontPayload({
      dynamicConfig: siteConfig,
      activePresetId: 'cosmetics',
      sectionsControl: { hero: true },
      sectionsOrder: ['hero'],
      paletteId: 'imperial-orchid',
      customColors: { primary: '#5A3E7A', accent: '#D4AF37', surface: '#FAF8FC' },
      typographyId: 'royal-luxury',
    });

    for (const key of Object.keys(payload)) {
      expect(ALLOWED_PUBLIC_STOREFRONT_KEYS.has(key)).toBe(true);
    }
    expect(payload.updatedBy).toBe('owner-uid-123');
    expect(payload.customColors).toEqual({
      primary: '#5A3E7A',
      accent: '#D4AF37',
      surface: '#FAF8FC',
    });
  });

  it('omits updatedBy and customColors when not set', () => {
    mockAuthState.currentUser = null;

    const payload = buildPublicStorefrontPayload({
      dynamicConfig: siteConfig,
      activePresetId: 'fashion',
      sectionsControl: { hero: true },
      sectionsOrder: ['hero'],
      paletteId: 'imperial-orchid',
      customColors: null,
      typographyId: 'royal-luxury',
    });

    expect('updatedBy' in payload).toBe(false);
    expect('customColors' in payload).toBe(false);
  });

  it('strips undefined values deeply across presets and sectionsControl so Firestore never rejects writes', () => {
    const dirtyConfig: SiteConfig = JSON.parse(JSON.stringify(siteConfig));
    // Inject undefined values at nested levels
    (dirtyConfig.presets.cosmetics.products[0] as any).optionalUndefinedField = undefined;
    (dirtyConfig.presets.cosmetics as any).emptyMeta = { keep: 'ok', drop: undefined };

    const payload = buildPublicStorefrontPayload({
      dynamicConfig: dirtyConfig,
      activePresetId: 'cosmetics',
      sectionsControl: { hero: true, ghost: undefined as unknown as boolean },
      sectionsOrder: ['hero'],
      paletteId: 'imperial-orchid',
      customColors: null,
      typographyId: 'royal-luxury',
    });

    const firstProd = payload.presets.cosmetics.products[0] as unknown as Record<string, unknown>;
    expect('optionalUndefinedField' in firstProd).toBe(false);
    expect('drop' in ((payload.presets.cosmetics as any).emptyMeta || {})).toBe(false);
    expect((payload.presets.cosmetics as any).emptyMeta?.keep).toBe('ok');
    expect('ghost' in (payload.sectionsControl || {})).toBe(false);
  });

  it('enforces firestore.rules volumetric bounds on sectionsOrder and string fields', () => {
    mockAuthState.currentUser = { uid: 'u'.repeat(250) };

    const oversizedOrder = Array.from({ length: 55 }, (_, i) => `section-${i}`);
    const payload = buildPublicStorefrontPayload({
      dynamicConfig: siteConfig,
      activePresetId: 'cosmetics',
      sectionsControl: { hero: true },
      sectionsOrder: [...oversizedOrder, 123 as unknown as string],
      paletteId: 'p'.repeat(120),
      customColors: {
        primary: '#1'.repeat(40),
        accent: '#2'.repeat(40),
        surface: '#3'.repeat(40),
      },
      typographyId: 't'.repeat(120),
    });

    expect(payload.sectionsOrder?.length).toBeLessThanOrEqual(30);
    expect(payload.sectionsOrder?.every((item) => typeof item === 'string')).toBe(true);
    expect(payload.paletteId?.length).toBeLessThanOrEqual(64);
    expect(payload.typographyId?.length).toBeLessThanOrEqual(64);
    expect(payload.updatedAt.length).toBeLessThanOrEqual(64);
    expect(payload.updatedBy?.length).toBeLessThanOrEqual(128);
    expect(payload.customColors?.primary.length).toBeLessThanOrEqual(32);
    expect(payload.customColors?.accent.length).toBeLessThanOrEqual(32);
    expect(payload.customColors?.surface.length).toBeLessThanOrEqual(32);
  });
});
