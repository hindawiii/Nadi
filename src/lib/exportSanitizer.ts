import type { SiteConfig, PresetNiche } from '../data/siteConfig';

/**
 * Normalized lowercase keys that must never appear in exported templates,
 * downloadable backups, or browser-persisted golden snapshots.
 */
export const SENSITIVE_EXPORT_KEYS = new Set<string>([
  'security',
  'adminpin',
  'developerpin',
  'devpin',
  'pin',
  'pinhash',
  'developerrecoveryphone',
  'developerrecoveryemail',
  'recoveryphone',
  'recoveryemail',
  'isdevelopermodelocked',
  'apikey',
  'secret',
  'secretkey',
  'token',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'password',
  'privatekey',
  'oauthclientid',
  'recaptchasitekey',
]);

function isSensitiveKey(key: string): boolean {
  const normalized = key.trim().toLowerCase().replace(/[_-]/g, '');
  return SENSITIVE_EXPORT_KEYS.has(normalized);
}

/**
 * Deeply clones JSON-compatible data while removing any sensitive admin/security keys
 * and stripping `undefined` fields at every nesting level.
 */
export function stripSensitiveKeysDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripSensitiveKeysDeep(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val === undefined || isSensitiveKey(key)) {
        continue;
      }
      clean[key] = stripSensitiveKeysDeep(val);
    }
    return clean as T;
  }
  return value;
}

export interface SanitizedTemplateExport {
  version: string;
  exportedAt: string;
  paletteId: string;
  typographyId: string;
  customPalette: { primary: string; accent: string; surface: string } | null;
  presetData: PresetNiche;
}

/**
 * Builds a strictly sanitized JSON-safe template export payload guaranteed to exclude
 * security objects, PINs, recovery contacts, and secret keys at any nesting depth.
 */
export function buildSanitizedTemplateExport(params: {
  paletteId: string;
  typographyId: string;
  customPalette: { primary: string; accent: string; surface: string } | null;
  presetData: PresetNiche;
  version?: string;
  exportedAt?: string;
}): SanitizedTemplateExport {
  return {
    version: params.version || '2.0.0',
    exportedAt: params.exportedAt || new Date().toISOString(),
    paletteId: String(params.paletteId || 'imperial-orchid'),
    typographyId: String(params.typographyId || 'nadi-royal'),
    customPalette: params.customPalette
      ? {
          primary: String(params.customPalette.primary),
          accent: String(params.customPalette.accent),
          surface: String(params.customPalette.surface),
        }
      : null,
    presetData: stripSensitiveKeysDeep(params.presetData),
  };
}

/**
 * Deeply sanitizes a saved custom template object before storage or JSON file download.
 */
export function sanitizeSavedTemplateForExport<T extends Record<string, unknown>>(template: T): T {
  return stripSensitiveKeysDeep(template);
}

/**
 * Creates a sanitized SiteConfig snapshot for local backup without storing `security`
 * or any admin/developer PINs or recovery fields in browser storage.
 */
export function sanitizeConfigForGoldenSnapshot(config: SiteConfig): Omit<SiteConfig, 'security'> {
  const { security: _omittedSecurity, ...publicConfig } = config;
  return stripSensitiveKeysDeep(publicConfig);
}
