import { Product } from '../data/siteConfig';
import { CartItem } from '../context/CommerceContext';

export interface CityShippingOption {
  name: { ar: string; en: string };
  est: { ar: string; en: string };
  feeUSD: number;
}

export const FREE_SHIPPING_THRESHOLD_USD = 15;

export const CITY_SHIPPING_OPTIONS: CityShippingOption[] = [
  { name: { ar: 'الخرطوم', en: 'Khartoum' }, est: { ar: '24-48 ساعة', en: '24-48 hours' }, feeUSD: 1.5 },
  { name: { ar: 'أم درمان', en: 'Omdurman' }, est: { ar: '24-48 ساعة', en: '24-48 hours' }, feeUSD: 1.5 },
  { name: { ar: 'بحري', en: 'Bahri' }, est: { ar: '24-48 ساعة', en: '24-48 hours' }, feeUSD: 1.5 },
  { name: { ar: 'بورتسودان', en: 'Port Sudan' }, est: { ar: '2-3 أيام', en: '2-3 days' }, feeUSD: 2.5 },
  { name: { ar: 'ود مدني', en: 'Wad Madani' }, est: { ar: '2-3 أيام', en: '2-3 days' }, feeUSD: 2.0 },
  { name: { ar: 'كسلا والقضارف', en: 'Kassala & Gedaref' }, est: { ar: '3-4 أيام', en: '3-4 days' }, feeUSD: 3.0 },
  { name: { ar: 'الرياض وجدة (شحن دولي)', en: 'Riyadh & Jeddah (GCC)' }, est: { ar: '3-5 أيام عمل', en: '3-5 business days' }, feeUSD: 4.5 },
  { name: { ar: 'دبي وأبوظبي', en: 'Dubai & Abu Dhabi' }, est: { ar: '3-5 أيام عمل', en: '3-5 business days' }, feeUSD: 4.5 },
  { name: { ar: 'القاهرة', en: 'Cairo' }, est: { ar: '4-6 أيام', en: '4-6 days' }, feeUSD: 4.0 },
];

const PROMO_CODE_TIERS: Record<string, number> = {
  BEAUTY10: 0.10,
  NADI10: 0.10,
  SOBEAUTY10: 0.10,
  NADI15: 0.15,
  VIP20: 0.15,
  SOBEAUTY: 0.15,
};

export function resolvePromoDiscountRate(rawCode?: string): number {
  if (!rawCode) return 0;
  const cleanCode = rawCode.trim().toUpperCase();
  return PROMO_CODE_TIERS[cleanCode] || 0;
}

export function resolveShippingOption(selectedCity: string): CityShippingOption {
  return (
    CITY_SHIPPING_OPTIONS.find(
      (c) => c.name.ar === selectedCity || c.name.en === selectedCity
    ) || CITY_SHIPPING_OPTIONS[0]
  );
}

const roundUSD = (val: number): number => Math.round(val * 10000) / 10000;

export interface VerifiedCheckoutItem {
  product: Product;
  quantity: number;
  unitPriceUSD: number;
  lineTotalUSD: number;
}

export interface AuthoritativeOrderSummary {
  verifiedItems: VerifiedCheckoutItem[];
  subtotalUSD: number;
  discountRate: number;
  discountAmountUSD: number;
  shippingOption: CityShippingOption;
  shippingFeeUSD: number;
  isFreeShipping: boolean;
  finalTotalUSD: number;
  appliedPromoCode?: string;
}

/**
 * Recomputes cart line prices, promo discounts, and shipping fees directly from
 * the authoritative catalog pool rather than trusting stale cached cart prices.
 */
export function computeAuthoritativeOrderSummary(params: {
  cart: CartItem[];
  catalogPool: Product[];
  promoCode?: string;
  selectedCity: string;
}): AuthoritativeOrderSummary {
  const catalogById = new Map<string, Product>();
  params.catalogPool.forEach((p) => {
    catalogById.set(p.id, p);
  });

  const verifiedItems: VerifiedCheckoutItem[] = [];
  let subtotalUSD = 0;

  params.cart.forEach((item) => {
    const liveProduct = catalogById.get(item.product.id) || item.product;
    const safeQty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
    const safeUnitPriceUSD = Math.max(0.01, Number(liveProduct.basePriceUSD) || 0.01);
    const lineTotalUSD = roundUSD(safeUnitPriceUSD * safeQty);
    subtotalUSD = roundUSD(subtotalUSD + lineTotalUSD);

    verifiedItems.push({
      product: liveProduct,
      quantity: safeQty,
      unitPriceUSD: safeUnitPriceUSD,
      lineTotalUSD,
    });
  });

  const cleanPromo = params.promoCode?.trim().toUpperCase() || '';
  const discountRate = resolvePromoDiscountRate(cleanPromo);
  const discountAmountUSD = roundUSD(subtotalUSD * discountRate);

  const isFreeShipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD;
  const shippingOption = resolveShippingOption(params.selectedCity);
  const shippingFeeUSD = isFreeShipping ? 0 : shippingOption.feeUSD;
  const finalTotalUSD = roundUSD(Math.max(0, subtotalUSD - discountAmountUSD + shippingFeeUSD));

  return {
    verifiedItems,
    subtotalUSD,
    discountRate,
    discountAmountUSD,
    shippingOption,
    shippingFeeUSD,
    isFreeShipping,
    finalTotalUSD,
    ...(discountRate > 0 ? { appliedPromoCode: cleanPromo } : {}),
  };
}
