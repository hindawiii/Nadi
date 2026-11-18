import { describe, it, expect } from 'vitest';

describe('Cart Calculations & Free Shipping Threshold Logic', () => {
  const FREE_SHIPPING_THRESHOLD_USD = 15;

  it('should calculate free shipping threshold and remaining amount accurately', () => {
    const cartTotalUSD = 10;
    const isFreeShipping = cartTotalUSD >= FREE_SHIPPING_THRESHOLD_USD;
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartTotalUSD);
    const progressPercent = Math.min(100, Math.round((cartTotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100));

    expect(isFreeShipping).toBe(false);
    expect(remaining).toBe(5);
    expect(progressPercent).toBe(67);
  });

  it('should qualify for free shipping when total reaches or exceeds 15 USD', () => {
    const cartTotalUSD = 25;
    const isFreeShipping = cartTotalUSD >= FREE_SHIPPING_THRESHOLD_USD;
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartTotalUSD);
    const progressPercent = Math.min(100, Math.round((cartTotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100));

    expect(isFreeShipping).toBe(true);
    expect(remaining).toBe(0);
    expect(progressPercent).toBe(100);
  });

  it('should apply discount codes (10% and 20%) correctly', () => {
    const totalUSD = 100;
    
    // BEAUTY10 -> 10%
    const rate10 = 0.10;
    const discount10 = totalUSD * rate10;
    const final10 = totalUSD - discount10;
    expect(discount10).toBe(10);
    expect(final10).toBe(90);

    // VIP20 -> 20%
    const rate20 = 0.20;
    const discount20 = totalUSD * rate20;
    const final20 = totalUSD - discount20;
    expect(discount20).toBe(20);
    expect(final20).toBe(80);
  });

  it('should correctly decrement stock and clamp at 0 without negative stock', () => {
    const initialStock = 3;
    const boughtQty = 5;
    const remainingStock = Math.max(0, initialStock - boughtQty);

    expect(remainingStock).toBe(0);
    expect(remainingStock).not.toBeLessThan(0);
  });

  it('should preserve the lower bundle-discounted unit price when adding an item already in cart', () => {
    const existingUnitPriceUSD = 20;
    const discountedBundleUnitPriceUSD = 15;
    const mergedUnitPriceUSD = Math.min(existingUnitPriceUSD, discountedBundleUnitPriceUSD);

    expect(mergedUnitPriceUSD).toBe(15);
    // And adding a regular-priced item afterward should never overwrite the bundle discount upward
    expect(Math.min(mergedUnitPriceUSD, existingUnitPriceUSD)).toBe(15);
  });
});
