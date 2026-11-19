import { describe, expect, it } from 'vitest';
import { siteConfig } from '../data/siteConfig';
import {
  buildSearchCollections,
  classifyProductCollection,
  getCleanCategoryLabel,
  matchesSearchCollection,
} from '../lib/productCollections';

describe('productCollections', () => {
  const cosmeticsProducts = siteConfig.presets.cosmetics.products;

  it('classifies all cosmetics products into 3 mutually-exclusive collections totaling 100', () => {
    const collections = buildSearchCollections(cosmeticsProducts, 'cosmetics');
    expect(collections).toHaveLength(3);

    const byId = Object.fromEntries(collections.map((c) => [c.id, c.count]));
    const total = collections.reduce((sum, c) => sum + c.count, 0);

    expect(total).toBe(cosmeticsProducts.length);
    expect(byId.skin).toBeGreaterThan(0);
    expect(byId.box).toBeGreaterThan(0);
    expect(byId.hair).toBeGreaterThan(0);
    expect(cosmeticsProducts.every((p) => classifyProductCollection(p) !== 'other')).toBe(true);
  });

  it('matchesSearchCollection returns exact counts matching each collection card', () => {
    const collections = buildSearchCollections(cosmeticsProducts, 'cosmetics');
    for (const col of collections) {
      const matched = cosmeticsProducts.filter((p) => matchesSearchCollection(p, col));
      expect(matched.length).toBe(col.count);
    }
  });

  it('getCleanCategoryLabel returns pure single-language labels with no mixed parentheticals', () => {
    for (const product of cosmeticsProducts) {
      const arLabel = getCleanCategoryLabel(product, 'ar');
      const enLabel = getCleanCategoryLabel(product, 'en');

      expect(arLabel).not.toMatch(/\([A-Za-z]+\)/);
      expect(enLabel).not.toMatch(/[\u0600-\u06FF]/);
    }
  });
});
