import { Product } from '../data/siteConfig';

export const DELIVERY_PROFILE_STORAGE_KEY = 'nadi_delivery_profile_v1';

export interface SavedDeliveryProfile {
  customerName: string;
  phone: string;
  selectedCity: string;
  address: string;
}

/**
 * Picks the best single in-stock product not already in the cart to help
 * the customer unlock free shipping with one tap.
 * Prefers the most affordable product >= remainingUSD, falling back to
 * the closest affordable high-rated item.
 */
export function pickFreeShippingUpsellProduct(
  catalogPool: Product[],
  cartProductIds: Set<string>,
  remainingUSD: number
): Product | null {
  const candidates = catalogPool.filter(
    (p) => !cartProductIds.has(p.id) && p.stock > 0 && p.basePriceUSD > 0
  );
  if (candidates.length === 0) return null;

  const gapClosers = candidates
    .filter((p) => p.basePriceUSD >= remainingUSD)
    .sort((a, b) => a.basePriceUSD - b.basePriceUSD || b.rating - a.rating);

  if (gapClosers.length > 0) {
    return gapClosers[0];
  }

  // Fallback: highest-value item under the gap to get closest to free shipping
  return [...candidates].sort(
    (a, b) => b.basePriceUSD - a.basePriceUSD || b.rating - a.rating
  )[0];
}

export function loadSavedDeliveryProfile(): SavedDeliveryProfile | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(DELIVERY_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedDeliveryProfile>;
    if (!parsed || typeof parsed !== 'object') return null;

    const profile: SavedDeliveryProfile = {
      customerName: typeof parsed.customerName === 'string' ? parsed.customerName : '',
      phone: typeof parsed.phone === 'string' ? parsed.phone : '',
      selectedCity: typeof parsed.selectedCity === 'string' ? parsed.selectedCity : '',
      address: typeof parsed.address === 'string' ? parsed.address : '',
    };

    const hasAnyValue = Boolean(
      profile.customerName.trim() ||
        profile.phone.trim() ||
        profile.address.trim() ||
        profile.selectedCity.trim()
    );
    return hasAnyValue ? profile : null;
  } catch {
    return null;
  }
}

export function saveDeliveryProfile(profile: SavedDeliveryProfile): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const cleaned: SavedDeliveryProfile = {
      customerName: profile.customerName.trim(),
      phone: profile.phone.trim(),
      selectedCity: profile.selectedCity.trim(),
      address: profile.address.trim(),
    };
    if (!cleaned.customerName && !cleaned.phone && !cleaned.address) {
      return;
    }
    window.localStorage.setItem(DELIVERY_PROFILE_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function clearSavedDeliveryProfile(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(DELIVERY_PROFILE_STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}
