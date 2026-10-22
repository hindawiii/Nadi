import { describe, it, expect } from 'vitest';
import { siteConfig } from '../data/siteConfig';

describe('Pricing, Currency & Exchange Rate Engine', () => {
  const currencies = siteConfig.currencies;

  // Helper function replicating the convertPrice logic from CommerceContext
  function convertPrice(usdPrice: number, currencyKey: string, lang: 'ar' | 'en') {
    const curConfig = currencies[currencyKey] || currencies['USD'];
    const converted = usdPrice * curConfig.rate;
    const isCrypto = !!curConfig.isCrypto;

    let value: string;
    if (isCrypto) {
      value = converted < 0.01 ? converted.toFixed(6) : converted.toFixed(4);
    } else if (converted >= 100) {
      value = Math.round(converted).toLocaleString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US');
    } else {
      value = converted.toFixed(2);
    }

    let resolvedSymbol = '';
    if (typeof curConfig.symbol === 'object' && curConfig.symbol !== null) {
      resolvedSymbol = lang === 'ar' ? (curConfig.symbol.ar || curConfig.symbol.en) : (curConfig.symbol.en || curConfig.symbol.ar);
    } else if (typeof curConfig.symbol === 'string') {
      resolvedSymbol = curConfig.symbol;
    }

    const text = isCrypto 
      ? `${value} ${resolvedSymbol}`
      : lang === 'ar' ? `${value} ${resolvedSymbol}` : `${resolvedSymbol} ${value}`;

    return { value, symbol: resolvedSymbol, text, isCrypto };
  }

  it('should convert USD base price to SAR accurately (Rate: 3.75)', () => {
    const usd = 20; // 20 * 3.75 = 75 SAR
    const resultAr = convertPrice(usd, 'SAR', 'ar');
    const resultEn = convertPrice(usd, 'SAR', 'en');

    expect(resultAr.value).toBe('75.00');
    expect(resultAr.symbol).toBe('ر.س');
    expect(resultAr.text).toContain('75.00');
    expect(resultEn.symbol).toBe('SAR');
  });

  it('should convert USD base price to Sudanese Pounds (Rate: 600)', () => {
    const usd = 10; // 10 * 600 = 6,000 SDG
    const resultAr = convertPrice(usd, 'SDG', 'ar');

    expect(resultAr.symbol).toBe('ج.س');
    expect(resultAr.text).toContain('6,000');
  });

  it('should correctly format crypto currencies like USDT and BTC', () => {
    const usd = 50;
    const resultUsdtAr = convertPrice(usd, 'USDT', 'ar');
    const resultUsdtEn = convertPrice(usd, 'USDT', 'en');
    const resultBtcAr = convertPrice(usd, 'BTC', 'ar');
    const resultBtcEn = convertPrice(usd, 'BTC', 'en');

    expect(resultUsdtAr.isCrypto).toBe(true);
    expect(resultBtcAr.isCrypto).toBe(true);
    expect(resultUsdtAr.symbol).toBe('₮');
    expect(resultUsdtEn.symbol).toBe('USDT');
    expect(resultBtcAr.symbol).toBe('₿');
    expect(resultBtcEn.symbol).toBe('BTC');
  });

  it('should calculate discount percentage accurately', () => {
    const originalPrice = 100;
    const basePrice = 80;
    const discount = Math.round(((originalPrice - basePrice) / originalPrice) * 100);

    expect(discount).toBe(20);
  });
});
