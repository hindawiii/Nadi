import { describe, it, expect } from 'vitest';
import { siteConfig } from '../data/siteConfig';
import {
  computeAuthoritativeOrderSummary,
  resolvePromoDiscountRate,
  resolveShippingOption,
} from '../lib/checkoutIntegrity';

describe('Authoritative Checkout Pricing & Integrity Engine', () => {
  const catalog = siteConfig.presets.cosmetics.products;
  const sampleProduct = catalog[0];

  it('recomputes authoritative prices from live catalog even if cached cart price was tampered with', () => {
    const tamperedCart = [
      {
        product: {
          ...sampleProduct,
          basePriceUSD: 0.01, // Stale or tampered client price
        },
        quantity: 2,
      },
    ];

    const summary = computeAuthoritativeOrderSummary({
      cart: tamperedCart,
      catalogPool: catalog,
      selectedCity: 'الخرطوم',
    });

    const expectedSubtotal = Math.round(sampleProduct.basePriceUSD * 2 * 10000) / 10000;
    expect(summary.subtotalUSD).toBe(expectedSubtotal);
    expect(summary.verifiedItems[0].unitPriceUSD).toBe(sampleProduct.basePriceUSD);
    expect(summary.finalTotalUSD).toBe(
      expectedSubtotal >= 15 ? expectedSubtotal : expectedSubtotal + 1.5
    );
  });

  it('resolves tiered promo codes accurately and ignores unknown codes', () => {
    expect(resolvePromoDiscountRate('beauty10')).toBe(0.10);
    expect(resolvePromoDiscountRate('  NADI15 ')).toBe(0.15);
    expect(resolvePromoDiscountRate('FAKE99')).toBe(0);
  });

  it('matches Riyadh & Dubai international shipping tariffs accurately and waives shipping at $15+', () => {
    expect(resolveShippingOption('الرياض وجدة (شحن دولي)').feeUSD).toBe(4.5);
    expect(resolveShippingOption('دبي وأبوظبي').feeUSD).toBe(4.5);
    expect(resolveShippingOption('القاهرة').feeUSD).toBe(4.0);

    const lowSubtotalProduct = { ...sampleProduct, id: 'custom-low-p', basePriceUSD: 5 };
    const lowSummary = computeAuthoritativeOrderSummary({
      cart: [{ product: lowSubtotalProduct, quantity: 1 }],
      catalogPool: [lowSubtotalProduct],
      selectedCity: 'الرياض وجدة (شحن دولي)',
      promoCode: 'BEAUTY10',
    });
    expect(lowSummary.isFreeShipping).toBe(false);
    expect(lowSummary.shippingFeeUSD).toBe(4.5);
    expect(lowSummary.discountAmountUSD).toBe(0.5);
    expect(lowSummary.finalTotalUSD).toBe(9.0); // 5 - 0.5 + 4.5

    const freeSummary = computeAuthoritativeOrderSummary({
      cart: [{ product: lowSubtotalProduct, quantity: 3 }],
      catalogPool: [lowSubtotalProduct],
      selectedCity: 'الرياض وجدة (شحن دولي)',
    });
    expect(freeSummary.isFreeShipping).toBe(true);
    expect(freeSummary.shippingFeeUSD).toBe(0);
    expect(freeSummary.finalTotalUSD).toBe(15);
  });
});
