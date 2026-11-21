import {
  collection,
  doc,
  query,
  limit,
  onSnapshot,
  runTransaction,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../data/siteConfig';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const INVENTORY_COLLECTION = 'inventory';
const VALID_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;
const MAX_STOCK = 100000;
const MAX_SINGLE_ORDER_DEDUCTION = 20;

export interface CloudInventoryItem {
  productId: string;
  stock: number;
  updatedAt: string;
}

/**
 * Pure non-negative stock calculation helper clamped to integer >= 0.
 */
export function computeNextStock(currentStock: number, orderedQty: number): number {
  const safeCurrent = Number.isFinite(currentStock) ? Math.max(0, Math.floor(currentStock)) : 0;
  const safeOrdered = Number.isFinite(orderedQty) ? Math.max(0, Math.floor(orderedQty)) : 0;
  return Math.max(0, safeCurrent - safeOrdered);
}

/**
 * Validates and builds a schema-compliant inventory record for Firestore.
 */
export function sanitizeInventoryItem(
  productId: string,
  stock: number
): CloudInventoryItem | null {
  const cleanId = (productId || '').trim();
  if (!VALID_ID_REGEX.test(cleanId)) return null;

  const safeStock =
    typeof stock === 'number' && Number.isFinite(stock)
      ? Math.max(0, Math.min(MAX_STOCK, Math.floor(stock)))
      : 0;

  return {
    productId: cleanId,
    stock: safeStock,
    updatedAt: new Date().toISOString().slice(0, 64),
  };
}

/**
 * Subscribes to live cross-device product stock levels in /inventory/{productId}.
 */
export function subscribeToCloudInventory(
  onUpdate: (stockMap: Record<string, number>) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = INVENTORY_COLLECTION;
  const invRef = collection(db, path);
  const q = query(invRef, limit(200));

  return onSnapshot(
    q,
    (snapshot) => {
      const stockMap: Record<string, number> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Partial<CloudInventoryItem>;
        if (typeof data.stock === 'number' && Number.isFinite(data.stock)) {
          stockMap[docSnap.id] = Math.max(0, Math.floor(data.stock));
        }
      });
      onUpdate(stockMap);
    },
    (error) => {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
      console.warn('Cloud inventory subscription error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Admin-only batch sync that publishes authoritative stock counts to /inventory/{productId}.
 */
export async function syncCatalogInventoryToCloud(products: Product[]): Promise<boolean> {
  if (!Array.isArray(products) || products.length === 0) return true;

  const uniqueById = new Map<string, CloudInventoryItem>();
  for (const p of products) {
    if (!p?.id || uniqueById.has(p.id)) continue;
    const item = sanitizeInventoryItem(p.id, typeof p.stock === 'number' ? p.stock : 10);
    if (item) {
      uniqueById.set(item.productId, item);
    }
  }

  const entries = Array.from(uniqueById.values());
  if (entries.length === 0) return true;

  const path = INVENTORY_COLLECTION;
  try {
    // Commit in chunks of 400 to stay safely below Firestore's 500-op writeBatch cap
    for (let i = 0; i < entries.length; i += 400) {
      const chunk = entries.slice(i, i + 400);
      const batch = writeBatch(db);
      for (const entry of chunk) {
        const docRef = doc(db, INVENTORY_COLLECTION, entry.productId);
        batch.set(docRef, entry);
      }
      await batch.commit();
    }
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Could not sync catalog inventory to Firestore:', error);
    return false;
  }
}

/**
 * Atomically decrements cloud stock for purchased items via Firestore transactions.
 * Enforces non-negative clamping and respects the per-order deduction ceiling.
 * Gracefully skips unseeded inventory docs so checkout never fails if Admin hasn't seeded yet.
 */
export async function deductInventoryAtomically(
  items: Array<{ productId: string; quantity: number }>
): Promise<boolean> {
  if (!Array.isArray(items) || items.length === 0) return true;

  // Aggregate quantities by valid productId
  const qtyMap = new Map<string, number>();
  for (const entry of items) {
    const cleanId = (entry.productId || '').trim();
    if (!VALID_ID_REGEX.test(cleanId)) continue;
    const qty = Math.max(0, Math.floor(entry.quantity || 0));
    if (qty <= 0) continue;
    qtyMap.set(cleanId, Math.min(MAX_SINGLE_ORDER_DEDUCTION, (qtyMap.get(cleanId) || 0) + qty));
  }

  if (qtyMap.size === 0) return true;

  try {
    await Promise.all(
      Array.from(qtyMap.entries()).map(async ([productId, orderedQty]) => {
        const docRef = doc(db, INVENTORY_COLLECTION, productId);
        const path = `${INVENTORY_COLLECTION}/${productId}`;

        try {
          await runTransaction(db, async (tx) => {
            const snap = await tx.get(docRef);
            if (!snap.exists()) {
              // Document has not been seeded by Admin yet; skip gracefully
              return;
            }
            const data = snap.data() as Partial<CloudInventoryItem>;
            const currentStock =
              typeof data.stock === 'number' && Number.isFinite(data.stock)
                ? Math.max(0, Math.floor(data.stock))
                : 0;

            if (currentStock <= 0) {
              return;
            }

            const cappedQty = Math.min(orderedQty, MAX_SINGLE_ORDER_DEDUCTION);
            const nextStock = computeNextStock(currentStock, cappedQty);
            if (nextStock < currentStock) {
              tx.update(docRef, {
                stock: nextStock,
                updatedAt: new Date().toISOString().slice(0, 64),
              });
            }
          });
        } catch (err) {
          if (err instanceof Error && (err.message.includes('permission') || err.message.includes('insufficient'))) {
            handleFirestoreError(err, OperationType.UPDATE, path);
          }
          console.warn(`Atomic stock deduction skipped for ${productId}:`, err);
        }
      })
    );
    return true;
  } catch (error) {
    console.warn('Atomic inventory deduction encountered an issue:', error);
    return false;
  }
}
