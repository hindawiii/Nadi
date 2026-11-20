import { describe, expect, it } from 'vitest';
import { siteConfig } from '../data/siteConfig';
import {
  extractProductQuickSpecs,
  formatArabicQuantityLabel,
  getPdpContextCopy,
  parsePipeSpecs,
  resolvePdpProductKind,
} from '../lib/pdpProfile';

describe('pdpProfile context-aware PDP adaptation', () => {
  const cosmeticsProducts = siteConfig.presets.cosmetics.products;
  const hairDevice = cosmeticsProducts.find((p) => p.id === 'hd-01')!;
  const skincareSerum = cosmeticsProducts.find((p) => p.id === 'sb-02')!;
  const skincareCleanser = cosmeticsProducts.find((p) => p.id === 'sb-05')!;
  const giftBox = cosmeticsProducts.find((p) => p.id === 'bundle-01')!;

  it('classifies hair devices, skincare items, and gift boxes accurately', () => {
    expect(resolvePdpProductKind(hairDevice)).toBe('hair');
    expect(resolvePdpProductKind(skincareSerum)).toBe('skin');
    expect(resolvePdpProductKind(giftBox)).toBe('box');
  });

  it('parses pipe-separated specs cleanly for hair devices and boxes', () => {
    const parsed = parsePipeSpecs(hairDevice.tabs.ingredientsOrSpecs?.ar);
    expect(parsed.length).toBe(4);
    expect(parsed[0]).toContain('25مم');
    expect(parsed[1]).toContain('220°C');
    expect(parsed[3]).not.toMatch(/\.$/);
  });

  it('extracts real size and technical specs for hair devices without skincare leakage', () => {
    const specsAr = extractProductQuickSpecs(hairDevice, 'hair', 'ar');
    expect(specsAr.items.length).toBeGreaterThanOrEqual(3);
    expect(specsAr.items.some((i) => i.value.includes('25مم'))).toBe(true);
    expect(specsAr.items.some((i) => i.value.includes('220°C'))).toBe(true);

    const copyAr = getPdpContextCopy('hair', 'نَـدِي', 'ar');
    const serialized = JSON.stringify(copyAr);
    expect(serialized).not.toContain('نقاء نباتي');
    expect(serialized).not.toContain('حركات دائرية');
    expect(serialized).toContain('ضمان سنتين');
    expect(copyAr.specsHeader.title).toContain('المواصفات الفنية');
  });

  it('extracts realistic volume and texture specs for skincare products', () => {
    const serumSpecs = extractProductQuickSpecs(skincareSerum, 'skin', 'ar');
    expect(serumSpecs.items[0].value).toBe('30 مل');

    const cleanserSpecs = extractProductQuickSpecs(skincareCleanser, 'skin', 'ar');
    expect(cleanserSpecs.items[0].value).toBe('150 مل');
  });

  it('extracts set piece count and packaging specs for gift boxes', () => {
    const boxSpecs = extractProductQuickSpecs(giftBox, 'box', 'ar');
    expect(boxSpecs.items[0].value).toContain('5');
    expect(boxSpecs.items[1].value).toContain('بوكس');
  });

  it('formats Arabic and English singular, dual, and plural quantities cleanly', () => {
    expect(formatArabicQuantityLabel(1, 'piece', 'ar')).toBe('قطعة واحدة');
    expect(formatArabicQuantityLabel(2, 'piece', 'ar')).toBe('قطعتان');
    expect(formatArabicQuantityLabel(3, 'piece', 'ar')).toBe('3 قطع');
    expect(formatArabicQuantityLabel(12, 'piece', 'ar')).toBe('12 قطعة');

    expect(formatArabicQuantityLabel(1, 'bottle', 'ar')).toBe('عبوة واحدة');
    expect(formatArabicQuantityLabel(2, 'bottle', 'ar')).toBe('عبوتان');
    expect(formatArabicQuantityLabel(3, 'bottle', 'ar')).toBe('3 عبوات');

    expect(formatArabicQuantityLabel(1, 'box', 'ar')).toBe('بكج واحد');
    expect(formatArabicQuantityLabel(2, 'box', 'ar')).toBe('بكجان');

    expect(formatArabicQuantityLabel(1, 'piece', 'en')).toBe('1 Unit');
    expect(formatArabicQuantityLabel(3, 'piece', 'en')).toBe('3 Units');
  });

  it('produces valid bilingual quick specs for every single product in the 100-item catalog', () => {
    expect(cosmeticsProducts.length).toBeGreaterThanOrEqual(90);
    for (const product of cosmeticsProducts) {
      const kind = resolvePdpProductKind(product);
      const specsAr = extractProductQuickSpecs(product, kind, 'ar');
      const specsEn = extractProductQuickSpecs(product, kind, 'en');
      expect(specsAr.items.length).toBeGreaterThanOrEqual(2);
      expect(specsEn.items.length).toBeGreaterThanOrEqual(2);
      expect(specsAr.items.every((item) => item.label.length > 0 && item.value.length > 0)).toBe(true);
      expect(specsEn.items.every((item) => item.label.length > 0 && item.value.length > 0)).toBe(true);
    }
  });
});
