import type { SiteConfig } from './siteTypes';
import { cosmeticsPreset } from './presets/cosmeticsPreset';
import { fashionPreset } from './presets/fashionPreset';
import { eyewearPreset } from './presets/eyewearPreset';
import { electronicsPreset } from './presets/electronicsPreset';

export * from './siteTypes';
export { curatedPalettes, curatedTypographyPairs } from './themeCatalog';
export { curatedImportableTemplates } from './importableTemplates';

export const siteConfig: SiteConfig = {
  security: {
    adminPin: "2026",
    developerPin: "998877",
    isDeveloperModeLocked: false,
    developerRecoveryPhone: "+966 50 889 9772",
    developerRecoveryEmail: "mohsentiben@gmail.com",
  },

  currencies: {
    SAR: { symbol: { ar: "ر.س", en: "SAR" }, name: "SAR", rate: 3.75, country: "🇸🇦" },
    SDG: { symbol: { ar: "ج.س", en: "SDG" }, name: "SDG", rate: 600.0, country: "🇸🇩" },
    USD: { symbol: { ar: "$", en: "$" }, name: "USD", rate: 1.0, country: "🇺🇸" },
    EUR: { symbol: { ar: "€", en: "€" }, name: "EUR", rate: 0.92, country: "🇪🇺" },
    GBP: { symbol: { ar: "£", en: "£" }, name: "GBP", rate: 0.79, country: "🇬🇧" },
    AED: { symbol: { ar: "د.إ", en: "AED" }, name: "AED", rate: 3.67, country: "🇦🇪" },
    EGP: { symbol: { ar: "ج.م", en: "EGP" }, name: "EGP", rate: 48.20, country: "🇪🇬" },
    KWD: { symbol: { ar: "د.ك", en: "KWD" }, name: "KWD", rate: 0.31, country: "🇰🇼" },
    USDT: { symbol: { ar: "₮", en: "USDT" }, name: "USDT", rate: 1.0, country: "₮", isCrypto: true },
    BTC: { symbol: { ar: "₿", en: "BTC" }, name: "BTC", rate: 0.000015, country: "₿", isCrypto: true },
    ETH: { symbol: { ar: "Ξ", en: "ETH" }, name: "ETH", rate: 0.00029, country: "Ξ", isCrypto: true },
  },

  presets: {
    cosmetics: cosmeticsPreset,
    fashion: fashionPreset,
    eyewear: eyewearPreset,
    electronics: electronicsPreset,
  },
};
