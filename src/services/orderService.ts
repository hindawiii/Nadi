import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OrderRecord } from '../context/CommerceContext';

const ORDERS_COLLECTION = 'orders';

/**
 * Fetch all persistent orders from Firestore.
 * Falls back gracefully to empty array or local storage if offline.
 */
export async function getOrdersFromCloud(): Promise<OrderRecord[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
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
    console.warn('Could not fetch orders from Firestore:', error);
    return [];
  }
}

/**
 * Save a newly placed order directly to Firestore.
 */
export async function persistOrderToCloud(order: OrderRecord): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(orderDocRef, {
      ...order,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Failed to persist order to Firestore:', error);
    return false;
  }
}

/**
 * Update the status of an existing order in Firestore.
 */
export async function updateOrderStatusInCloud(orderId: string, status: OrderRecord['status']): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, { status });
    return true;
  } catch (error) {
    console.error(`Failed to update status for order ${orderId} in Firestore:`, error);
    return false;
  }
}

/**
 * Delete a specific order from Firestore.
 */
export async function deleteOrderFromCloud(orderId: string): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderDocRef);
    return true;
  } catch (error) {
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
