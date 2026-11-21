import { describe, expect, it } from 'vitest';
import {
  filterStoreFaqItems,
  STORE_FAQ_CATEGORIES,
  STORE_FAQ_ITEMS,
} from '../data/storeFaqData';

describe('storeFaqData', () => {
  it('provides complete non-empty Arabic and English FAQ entries across all categories', () => {
    expect(STORE_FAQ_ITEMS.length).toBeGreaterThanOrEqual(6);
    for (const item of STORE_FAQ_ITEMS) {
      expect(item.question.ar.trim().length).toBeGreaterThan(8);
      expect(item.question.en.trim().length).toBeGreaterThan(8);
      expect(item.answer.ar.trim().length).toBeGreaterThan(20);
      expect(item.answer.en.trim().length).toBeGreaterThan(20);
    }
  });

  it('filters FAQ items cleanly across the 3 balanced categories starting with Shipping & Payment', () => {
    expect(STORE_FAQ_CATEGORIES.map((c) => c.id)).toEqual(['shipping', 'warranty', 'care']);
    let totalFiltered = 0;
    for (const cat of STORE_FAQ_CATEGORIES) {
      const items = filterStoreFaqItems(cat.id);
      expect(items.length).toBe(2);
      expect(items.every((i) => i.category === cat.id)).toBe(true);
      totalFiltered += items.length;
    }
    expect(totalFiltered).toBe(STORE_FAQ_ITEMS.length);
  });
});
