import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  query,
  where,
  limit,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { OrderRecord } from '../context/CommerceContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const ORDERS_COLLECTION = 'orders';
const TRACKING_COLLECTION = 'tracking';

export interface PublicTrackingRecord {
  trackingCode: string;
  orderId: string;
  status: OrderRecord['status'];
  date: string;
  totalFormatted: string;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * Validates and defensively sanitizes an order payload before persisting to Firestore.
 * Ensures strict conformity with firestore.rules and firebase-blueprint.json schema,
 * omitting undefined properties cleanly.
 */
export function sanitizeOrderPayload(order: OrderRecord): Record<string, unknown> {
  const safeStatus: OrderRecord['status'] = ['received', 'processing', 'dispatched', 'delivered'].includes(order.status)
    ? order.status
    : 'received';

  const payload: Record<string, unknown> = {
    id: (order.id || `ORD-${Date.now()}`).trim().slice(0, 64),
    date: (order.date || new Date().toISOString().replace('T', ' ').slice(0, 16)).slice(0, 64),
    customerName: (order.customerName || 'عميل المتجر').trim().slice(0, 120),
    phone: (order.phone || '').trim().slice(0, 40),
    address: (order.address || '').trim().slice(0, 300),
    items: Array.isArray(order.items) ? order.items.slice(0, 50) : [],
    totalFormatted: (order.totalFormatted || '0').slice(0, 60),
    totalUSD: typeof order.totalUSD === 'number' && !Number.isNaN(order.totalUSD) ? Math.max(0, Math.min(1000000, order.totalUSD)) : 0,
    discountAmountUSD: typeof order.discountAmountUSD === 'number' && !Number.isNaN(order.discountAmountUSD) ? Math.max(0, Math.min(1000000, order.discountAmountUSD)) : 0,
    shippingFeeUSD: typeof order.shippingFeeUSD === 'number' && !Number.isNaN(order.shippingFeeUSD) ? Math.max(0, Math.min(100000, order.shippingFeeUSD)) : 0,
    currency: (order.currency || 'USD').slice(0, 16),
    status: safeStatus,
    trackingCode: (order.trackingCode || `TRK-${Date.now().toString(36).toUpperCase()}`).trim().slice(0, 64),
    createdAt: new Date().toISOString().slice(0, 64),
  };

  if (order.promoCode && order.promoCode.trim()) {
    payload.promoCode = order.promoCode.trim().slice(0, 32);
  }

  const activeUid = order.ownerUid || auth.currentUser?.uid;
  if (activeUid) {
    payload.ownerUid = activeUid.slice(0, 128);
  }

  return payload;
}

function buildTrackingPayload(order: OrderRecord): PublicTrackingRecord {
  const safeStatus: OrderRecord['status'] = ['received', 'processing', 'dispatched', 'delivered'].includes(order.status)
    ? order.status
    : 'received';
  const nowIso = new Date().toISOString().slice(0, 64);

  return {
    trackingCode: order.trackingCode.trim().slice(0, 64),
    orderId: order.id.trim().slice(0, 64),
    status: safeStatus,
    date: (order.date || nowIso).slice(0, 64),
    totalFormatted: (order.totalFormatted || '0').slice(0, 60),
    updatedAt: nowIso,
    createdAt: nowIso,
  };
}

/**
 * Fetch all persistent orders from Firestore (verified Admin only per security rules).
 */
export async function getOrdersFromCloud(): Promise<OrderRecord[]> {
  const path = ORDERS_COLLECTION;
  try {
    const ordersRef = collection(db, path);
    const q = query(ordersRef, limit(100));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const cloudOrders: OrderRecord[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as OrderRecord;
      cloudOrders.push({
        ...data,
        id: docSnap.id,
      });
    });

    cloudOrders.sort((a, b) => (b.date > a.date ? 1 : -1));
    return cloudOrders;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    console.warn('Could not fetch orders from Firestore:', error);
    return [];
  }
}

/**
 * Fetch a single non-PII public tracking projection document by exact tracking code.
 * Never lists or scans orders/tracking collections.
 */
export async function getTrackingByCodeFromCloud(trackingCode: string): Promise<PublicTrackingRecord | null> {
  const cleanCode = trackingCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 64);
  if (!cleanCode) return null;

  const path = `${TRACKING_COLLECTION}/${cleanCode}`;
  try {
    const trackingDocRef = doc(db, TRACKING_COLLECTION, cleanCode);
    const snap = await getDoc(trackingDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as PublicTrackingRecord;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.warn('Could not fetch tracking projection from Firestore:', error);
    return null;
  }
}

/**
 * Subscribe to real-time order updates (must only be called when authenticated as Admin).
 */
export function subscribeToCloudOrders(
  onUpdate: (orders: OrderRecord[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = ORDERS_COLLECTION;
  const ordersRef = collection(db, path);
  const q = query(ordersRef, limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const liveOrders: OrderRecord[] = [];
      snapshot.forEach((docSnap) => {
        liveOrders.push({
          ...(docSnap.data() as OrderRecord),
          id: docSnap.id,
        });
      });
      liveOrders.sort((a, b) => (b.date > a.date ? 1 : -1));
      onUpdate(liveOrders);
    },
    (error) => {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      console.warn('Live orders subscription encountered an error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Fetch orders belonging to a specific authenticated customer (enforces where('ownerUid', '==', uid)).
 */
export async function getCustomerOrdersFromCloud(uid: string): Promise<OrderRecord[]> {
  const cleanUid = (uid || '').trim().slice(0, 128);
  if (!cleanUid) return [];

  const path = ORDERS_COLLECTION;
  try {
    const ordersRef = collection(db, path);
    const q = query(ordersRef, where('ownerUid', '==', cleanUid), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const mine: OrderRecord[] = [];
    snapshot.forEach((docSnap) => {
      mine.push({
        ...(docSnap.data() as OrderRecord),
        id: docSnap.id,
      });
    });

    mine.sort((a, b) => (b.date > a.date ? 1 : -1));
    return mine;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    console.warn('Could not fetch customer orders from Firestore:', error);
    return [];
  }
}

/**
 * Subscribe to real-time order status updates for the currently authenticated customer.
 * Uses a Secure List Query (where ownerUid == uid) matched strictly by firestore.rules.
 */
export function subscribeToCustomerOrders(
  uid: string,
  onUpdate: (orders: OrderRecord[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const cleanUid = (uid || '').trim().slice(0, 128);
  const path = ORDERS_COLLECTION;
  const ordersRef = collection(db, path);
  const q = query(ordersRef, where('ownerUid', '==', cleanUid), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const mine: OrderRecord[] = [];
      snapshot.forEach((docSnap) => {
        mine.push({
          ...(docSnap.data() as OrderRecord),
          id: docSnap.id,
        });
      });
      mine.sort((a, b) => (b.date > a.date ? 1 : -1));
      onUpdate(mine);
    },
    (error) => {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
      console.warn('Customer orders subscription encountered an error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Save a newly placed order to /orders/{orderId} AND its sanitized non-PII projection to /tracking/{trackingCode}
 * inside a single atomic Firestore writeBatch transaction so partial writes cannot occur.
 */
export async function persistOrderToCloud(order: OrderRecord): Promise<boolean> {
  const orderPath = `${ORDERS_COLLECTION}/${order.id}`;
  const trackingCodeClean = (order.trackingCode || '').trim().slice(0, 64);

  try {
    const batch = writeBatch(db);
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
    const sanitized = sanitizeOrderPayload(order);
    batch.set(orderDocRef, sanitized);

    if (trackingCodeClean) {
      const trackingDocRef = doc(db, TRACKING_COLLECTION, trackingCodeClean);
      const trackingPayload = buildTrackingPayload({
        ...order,
        trackingCode: trackingCodeClean,
      });
      batch.set(trackingDocRef, trackingPayload);
    }

    await batch.commit();
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.CREATE, orderPath);
    }
    console.error('Failed to persist atomic order batch to Firestore:', error);
    return false;
  }
}

/**
 * Atomically update the status of an existing order and its public tracking projection in Firestore (Admin only).
 * Self-heals legacy orders that were created before `/tracking/{code}` existed so batch updates never fail with NOT_FOUND.
 */
export async function updateOrderStatusInCloud(
  orderId: string,
  status: OrderRecord['status'],
  trackingCode?: string
): Promise<boolean> {
  const orderPath = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderDocRef);
    if (!orderSnap.exists()) {
      return false;
    }

    const batch = writeBatch(db);
    batch.update(orderDocRef, { status });

    const existingOrderData = orderSnap.data() as Partial<OrderRecord>;
    const resolvedTracking = (trackingCode || existingOrderData.trackingCode || '').trim().slice(0, 64);

    if (resolvedTracking) {
      const trackingDocRef = doc(db, TRACKING_COLLECTION, resolvedTracking);
      const trackingSnap = await getDoc(trackingDocRef);
      if (trackingSnap.exists()) {
        batch.update(trackingDocRef, {
          status,
          updatedAt: new Date().toISOString().slice(0, 64),
        });
      } else {
        // Backfill missing tracking projection atomically for legacy orders
        const backfillPayload = buildTrackingPayload({
          id: orderId,
          date: existingOrderData.date || new Date().toISOString().slice(0, 16).replace('T', ' '),
          customerName: existingOrderData.customerName || '',
          phone: existingOrderData.phone || '',
          address: existingOrderData.address || '',
          items: existingOrderData.items || [],
          totalFormatted: existingOrderData.totalFormatted || '0',
          currency: existingOrderData.currency || 'USD',
          status,
          trackingCode: resolvedTracking,
        });
        batch.set(trackingDocRef, backfillPayload);
      }
    }

    await batch.commit();
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.UPDATE, orderPath);
    }
    console.error(`Failed to update status for order ${orderId} in Firestore:`, error);
    return false;
  }
}

/**
 * Atomically delete a specific order and its tracking projection from Firestore (Admin only).
 */
export async function deleteOrderFromCloud(orderId: string, trackingCode?: string): Promise<boolean> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const batch = writeBatch(db);
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    batch.delete(orderDocRef);

    if (trackingCode && trackingCode.trim()) {
      const trackingDocRef = doc(db, TRACKING_COLLECTION, trackingCode.trim().slice(0, 64));
      batch.delete(trackingDocRef);
    }

    await batch.commit();
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    console.error(`Failed to delete order ${orderId} from Firestore:`, error);
    return false;
  }
}

/**
 * Batch delete multiple orders and their tracking projections from Firestore (Admin only).
 */
export async function clearAllOrdersFromCloud(
  ordersToClear: Array<string | { id: string; trackingCode?: string }>
): Promise<boolean> {
  try {
    await Promise.all(
      ordersToClear.map((entry) =>
        typeof entry === 'string'
          ? deleteOrderFromCloud(entry)
          : deleteOrderFromCloud(entry.id, entry.trackingCode)
      )
    );
    return true;
  } catch (error) {
    console.error('Failed to clear orders from Firestore:', error);
    return false;
  }
}
