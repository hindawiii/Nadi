import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  limit,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OrderRecord } from '../context/CommerceContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const ORDERS_COLLECTION = 'orders';

/**
 * Validates and defensively sanitizes an order payload before persisting to Firestore.
 * Ensures conformity with firestore.rules and firebase-blueprint.json schema.
 */
function sanitizeOrderPayload(order: OrderRecord): OrderRecord & { createdAt: string } {
  return {
    id: (order.id || `ORD-${Date.now()}`).slice(0, 64),
    date: order.date || new Date().toISOString(),
    customerName: (order.customerName || 'عميل المتجر').trim().slice(0, 120),
    phone: (order.phone || '').trim().slice(0, 40),
    address: (order.address || '').trim().slice(0, 300),
    items: Array.isArray(order.items) ? order.items : [],
    totalFormatted: (order.totalFormatted || '0').slice(0, 60),
    totalUSD: typeof order.totalUSD === 'number' ? order.totalUSD : 0,
    discountAmountUSD: typeof order.discountAmountUSD === 'number' ? order.discountAmountUSD : 0,
    shippingFeeUSD: typeof order.shippingFeeUSD === 'number' ? order.shippingFeeUSD : 0,
    promoCode: order.promoCode ? order.promoCode.slice(0, 32) : undefined,
    currency: (order.currency || 'USD').slice(0, 10),
    status: ['received', 'processing', 'dispatched', 'delivered'].includes(order.status) 
      ? order.status 
      : 'received',
    trackingCode: (order.trackingCode || `TRK-${Math.floor(10000 + Math.random() * 90000)}`).slice(0, 64),
    createdAt: new Date().toISOString()
  };
}

/**
 * Fetch all persistent orders from Firestore.
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

    // Sort descending by date
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
 * Subscribe to real-time order updates for instant admin notifications and live sync.
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
 * Save a newly placed order directly to Firestore.
 */
export async function persistOrderToCloud(order: OrderRecord): Promise<boolean> {
  const path = `${ORDERS_COLLECTION}/${order.id}`;
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
    const sanitized = sanitizeOrderPayload(order);
    await setDoc(orderDocRef, sanitized);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    console.error('Failed to persist order to Firestore:', error);
    return false;
  }
}

/**
 * Update the status of an existing order in Firestore.
 */
export async function updateOrderStatusInCloud(orderId: string, status: OrderRecord['status']): Promise<boolean> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, { status });
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
    console.error(`Failed to update status for order ${orderId} in Firestore:`, error);
    return false;
  }
}

/**
 * Delete a specific order from Firestore.
 */
export async function deleteOrderFromCloud(orderId: string): Promise<boolean> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderDocRef);
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
 * Batch delete multiple orders from Firestore.
 */
export async function clearAllOrdersFromCloud(orderIds: string[]): Promise<boolean> {
  try {
    await Promise.all(orderIds.map((id) => deleteOrderFromCloud(id)));
    return true;
  } catch (error) {
    console.error('Failed to clear orders from Firestore:', error);
    return false;
  }
}
