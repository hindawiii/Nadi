import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../data/siteConfig';
import { CartItem } from '../context/CommerceContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

export interface CloudCartEntry {
  productId: string;
  quantity: number;
  selectedVariant?: string;
}

export interface CloudUserCommerceDoc {
  cart: CloudCartEntry[];
  wishlist: string[];
  updatedAt: string;
}

const MAX_CLOUD_CART_ITEMS = 50;
const MAX_CLOUD_WISHLIST_ITEMS = 100;
const MAX_ITEM_QUANTITY = 99;

function sanitizeId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().slice(0, 64);
}

/**
 * Converts rich in-memory CartItem objects into a compact, schema-compliant
 * Firestore payload bounded to max 50 items and integer quantities [1..99].
 */
export function serializeCloudCart(cart: CartItem[]): CloudCartEntry[] {
  if (!Array.isArray(cart)) return [];
  const merged = new Map<string, CloudCartEntry>();

  for (const item of cart) {
    const productId = sanitizeId(item?.product?.id);
    if (!productId) continue;

    const variant =
      typeof item.selectedVariant === 'string' && item.selectedVariant.trim()
        ? item.selectedVariant.trim().slice(0, 120)
        : undefined;
    const qty =
      typeof item.quantity === 'number' && Number.isFinite(item.quantity)
        ? Math.max(1, Math.min(MAX_ITEM_QUANTITY, Math.floor(item.quantity)))
        : 1;

    const key = `${productId}::${variant || ''}`;
    const existing = merged.get(key);
    if (existing) {
      existing.quantity = Math.min(MAX_ITEM_QUANTITY, existing.quantity + qty);
    } else if (merged.size < MAX_CLOUD_CART_ITEMS) {
      merged.set(
        key,
        variant
          ? { productId, quantity: qty, selectedVariant: variant }
          : { productId, quantity: qty }
      );
    }
  }

  return Array.from(merged.values());
}

/**
 * Sanitizes and deduplicates wishlist product IDs within blueprint limits (max 100).
 */
export function sanitizeCloudWishlist(ids: string[]): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of ids) {
    const id = sanitizeId(raw);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
    if (result.length >= MAX_CLOUD_WISHLIST_ITEMS) break;
  }

  return result;
}

/**
 * Hydrates compact cloud cart entries back into full CartItem objects
 * using the live catalog pool, skipping deleted or unknown product IDs safely.
 */
export function hydrateCloudCart(
  entries: unknown,
  catalogPool: Product[]
): CartItem[] {
  if (!Array.isArray(entries) || !Array.isArray(catalogPool)) return [];
  const byId = new Map<string, Product>();
  for (const p of catalogPool) {
    if (p?.id) byId.set(p.id, p);
  }

  const hydrated: CartItem[] = [];
  const seenKeys = new Set<string>();

  for (const raw of entries) {
    if (!raw || typeof raw !== 'object') continue;
    const rec = raw as Record<string, unknown>;
    const productId = sanitizeId(rec.productId);
    const product = byId.get(productId);
    if (!product) continue;

    const variant =
      typeof rec.selectedVariant === 'string' && rec.selectedVariant.trim()
        ? rec.selectedVariant.trim().slice(0, 120)
        : undefined;
    const key = `${productId}::${variant || ''}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    const quantity =
      typeof rec.quantity === 'number' && Number.isFinite(rec.quantity)
        ? Math.max(1, Math.min(MAX_ITEM_QUANTITY, Math.floor(rec.quantity)))
        : 1;

    hydrated.push(
      variant
        ? { product, quantity, selectedVariant: variant }
        : { product, quantity }
    );
    if (hydrated.length >= MAX_CLOUD_CART_ITEMS) break;
  }

  return hydrated;
}

/**
 * Merges guest local cart items with cloud cart entries on authentication.
 * Uses Math.max on matching product+variant pairs so re-signing on the same device
 * never erroneously doubles quantities while preserving newly added guest items.
 */
export function mergeCartItems(
  localCart: CartItem[],
  cloudEntries: CloudCartEntry[],
  catalogPool: Product[]
): CartItem[] {
  const cloudHydrated = hydrateCloudCart(cloudEntries, catalogPool);
  const combined = new Map<string, CartItem>();

  for (const item of cloudHydrated) {
    const key = `${item.product.id}::${item.selectedVariant || ''}`;
    combined.set(key, item);
  }

  for (const item of localCart) {
    if (!item?.product?.id) continue;
    const key = `${item.product.id}::${item.selectedVariant || ''}`;
    const existing = combined.get(key);
    const localQty = Math.max(1, Math.min(MAX_ITEM_QUANTITY, Math.floor(item.quantity || 1)));

    if (existing) {
      combined.set(key, {
        ...existing,
        quantity: Math.min(MAX_ITEM_QUANTITY, Math.max(existing.quantity, localQty)),
      });
    } else if (combined.size < MAX_CLOUD_CART_ITEMS) {
      combined.set(key, { ...item, quantity: localQty });
    }
  }

  return Array.from(combined.values());
}

/**
 * Unions local guest wishlist IDs with cloud wishlist IDs without duplicates.
 */
export function mergeWishlistIds(localIds: string[], cloudIds: string[]): string[] {
  return sanitizeCloudWishlist([...cloudIds, ...localIds]);
}

/**
 * Stable canonical fingerprint used to prevent feedback echo loops
 * between real-time onSnapshot listeners and debounced cloud writes.
 */
export function computeCommerceFingerprint(cart: CartItem[], wishlist: string[]): string {
  const compactCart = serializeCloudCart(cart).sort((a, b) =>
    `${a.productId}:${a.selectedVariant || ''}`.localeCompare(`${b.productId}:${b.selectedVariant || ''}`)
  );
  const compactWishlist = sanitizeCloudWishlist(wishlist).sort();
  return JSON.stringify({ cart: compactCart, wishlist: compactWishlist });
}

function getCommerceDocPath(uid: string): string {
  return `users/${uid}/private/commerce`;
}

/**
 * Fetches the authenticated customer's private commerce state (cart + wishlist).
 */
export async function fetchUserCommerceState(uid: string): Promise<CloudUserCommerceDoc | null> {
  const cleanUid = sanitizeId(uid);
  if (!cleanUid) return null;

  const path = getCommerceDocPath(cleanUid);
  try {
    const docRef = doc(db, 'users', cleanUid, 'private', 'commerce');
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data() as Partial<CloudUserCommerceDoc>;
    return {
      cart: Array.isArray(data.cart) ? (data.cart as CloudCartEntry[]).slice(0, MAX_CLOUD_CART_ITEMS) : [],
      wishlist: sanitizeCloudWishlist(Array.isArray(data.wishlist) ? data.wishlist : []),
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.warn('Could not fetch user commerce state from Firestore:', error);
    return null;
  }
}

/**
 * Persists the authenticated customer's cart & wishlist into /users/{uid}/private/commerce.
 */
export async function saveUserCommerceState(
  uid: string,
  cart: CartItem[],
  wishlist: string[]
): Promise<boolean> {
  const cleanUid = sanitizeId(uid);
  if (!cleanUid) return false;

  const path = getCommerceDocPath(cleanUid);
  const payload: CloudUserCommerceDoc = {
    cart: serializeCloudCart(cart),
    wishlist: sanitizeCloudWishlist(wishlist),
    updatedAt: new Date().toISOString().slice(0, 64),
  };

  try {
    const docRef = doc(db, 'users', cleanUid, 'private', 'commerce');
    await setDoc(docRef, payload);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Could not save user commerce state to Firestore:', error);
    return false;
  }
}

/**
 * Subscribes to live cross-device cart & wishlist updates for the authenticated customer.
 */
export function subscribeToUserCommerceState(
  uid: string,
  onUpdate: (docState: CloudUserCommerceDoc) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const cleanUid = sanitizeId(uid);
  const path = getCommerceDocPath(cleanUid);
  const docRef = doc(db, 'users', cleanUid, 'private', 'commerce');

  return onSnapshot(
    docRef,
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Partial<CloudUserCommerceDoc>;
      onUpdate({
        cart: Array.isArray(data.cart) ? (data.cart as CloudCartEntry[]).slice(0, MAX_CLOUD_CART_ITEMS) : [],
        wishlist: sanitizeCloudWishlist(Array.isArray(data.wishlist) ? data.wishlist : []),
        updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
      });
    },
    (error) => {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      console.warn('User commerce state subscription error:', error);
      if (onError) onError(error);
    }
  );
}
