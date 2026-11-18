import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

export interface CloudReview {
  id: string;
  name: string;
  city: string;
  comment: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

const REVIEWS_COLLECTION = 'reviews';

/**
 * Fetch reviews from Firestore cloud collection.
 * Non-admin public reads strictly filter by status == 'approved' to satisfy Firestore rules.
 */
export async function getReviewsFromCloud(includeUnapproved: boolean = false): Promise<CloudReview[]> {
  const path = REVIEWS_COLLECTION;
  try {
    const reviewsRef = collection(db, path);
    const q = includeUnapproved
      ? query(reviewsRef, limit(50))
      : query(reviewsRef, where('status', '==', 'approved'), limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const reviews: CloudReview[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<CloudReview, 'id'>;
      reviews.push({
        ...data,
        status: data.status || 'pending',
        id: docSnap.id,
      });
    });

    return reviews;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    console.warn('Could not fetch reviews from Firestore:', error);
    return [];
  }
}

/**
 * Real-time subscription to cloud reviews.
 * Storefront only subscribes to approved reviews; verified Admin can observe all pending/approved/rejected.
 */
export function subscribeToCloudReviews(
  onUpdate: (reviews: CloudReview[]) => void,
  onError?: (err: unknown) => void,
  includeUnapproved: boolean = false
): Unsubscribe {
  const path = REVIEWS_COLLECTION;
  const reviewsRef = collection(db, path);
  const q = includeUnapproved
    ? query(reviewsRef, limit(50))
    : query(reviewsRef, where('status', '==', 'approved'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const reviews: CloudReview[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<CloudReview, 'id'>;
        reviews.push({
          ...data,
          status: data.status || 'pending',
          id: docSnap.id,
        });
      });
      onUpdate(reviews);
    },
    (error) => {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      console.warn('Live reviews subscription encountered an error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Persist a newly submitted customer review to Firestore with forced status = 'pending'.
 */
export async function persistReviewToCloud(review: {
  id?: string;
  name: string;
  city: string;
  comment: string;
  rating: number;
}): Promise<boolean> {
  const reviewId = review.id || `REV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const path = `${REVIEWS_COLLECTION}/${reviewId}`;

  try {
    const reviewDocRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await setDoc(reviewDocRef, {
      name: review.name.trim().slice(0, 80),
      city: (review.city || 'الخرطوم').trim().slice(0, 80),
      comment: review.comment.trim().slice(0, 1000),
      rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 64),
    });
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    console.error('Failed to persist review to Firestore:', error);
    return false;
  }
}

/**
 * Update moderation status of a cloud review (Admin only).
 */
export async function updateReviewStatusInCloud(
  reviewId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
  const path = `${REVIEWS_COLLECTION}/${reviewId}`;
  try {
    const reviewDocRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewDocRef, { status });
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
    console.warn(`Failed to update review ${reviewId} status in cloud:`, error);
    return false;
  }
}

/**
 * Delete a cloud review permanently (Admin only).
 */
export async function deleteReviewFromCloud(reviewId: string): Promise<boolean> {
  const path = `${REVIEWS_COLLECTION}/${reviewId}`;
  try {
    const reviewDocRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(reviewDocRef);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    console.warn(`Failed to delete review ${reviewId} from cloud:`, error);
    return false;
  }
}
