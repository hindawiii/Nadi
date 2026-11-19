import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { siteConfig } from '../data/siteConfig';
import {
  clearSavedDeliveryProfile,
  DELIVERY_PROFILE_STORAGE_KEY,
  loadSavedDeliveryProfile,
  pickFreeShippingUpsellProduct,
  saveDeliveryProfile,
} from '../lib/checkoutAssist';

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

describe('checkoutAssist', () => {
  beforeEach(() => {
    const localStorageMock = createMemoryStorage();
    vi.stubGlobal('window', { localStorage: localStorageMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('picks an in-stock product not in cart that closes the free shipping gap', () => {
    const products = siteConfig.presets.cosmetics.products;
    const inCart = new Set<string>([products[0].id]);
    const suggestion = pickFreeShippingUpsellProduct(products, inCart, 5);

    expect(suggestion).not.toBeNull();
    expect(inCart.has(suggestion!.id)).toBe(false);
    expect(suggestion!.stock).toBeGreaterThan(0);
    expect(suggestion!.basePriceUSD).toBeGreaterThanOrEqual(5);
  });

  it('returns null when every catalog item is already in cart or out of stock', () => {
    const sample = siteConfig.presets.cosmetics.products.slice(0, 2);
    const inCart = new Set(sample.map((p) => p.id));
    expect(pickFreeShippingUpsellProduct(sample, inCart, 5)).toBeNull();
  });

  it('saves, loads, and clears customer delivery profile cleanly', () => {
    expect(loadSavedDeliveryProfile()).toBeNull();

    saveDeliveryProfile({
      customerName: 'سارة أحمد',
      phone: '91 234 5678',
      selectedCity: 'الخرطوم',
      address: 'حي الرياض، شارع الستين',
    });

    const loaded = loadSavedDeliveryProfile();
    expect(loaded).toEqual({
      customerName: 'سارة أحمد',
      phone: '91 234 5678',
      selectedCity: 'الخرطوم',
      address: 'حي الرياض، شارع الستين',
    });

    clearSavedDeliveryProfile();
    expect(loadSavedDeliveryProfile()).toBeNull();
  });

  it('handles corrupted localStorage data gracefully without throwing', () => {
    window.localStorage.setItem(DELIVERY_PROFILE_STORAGE_KEY, '{broken-json');
    expect(loadSavedDeliveryProfile()).toBeNull();
  });
});
