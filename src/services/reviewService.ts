import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
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
  createdAt?: string;
}

const REVIEWS_COLLECTION = 'reviews';

/**
 * Fetch reviews from Firestore cloud collection.
 */
export async function getReviewsFromCloud(): Promise<CloudReview[]> {
  const path = REVIEWS_COLLECTION;
  try {
    const reviewsRef = collection(db, path);
    const q = query(reviewsRef, limit(50));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const reviews: CloudReview[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<CloudReview, 'id'>;
      reviews.push({
        ...data,
        id: docSnap.id
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
 */
export function subscribeToCloudReviews(
  onUpdate: (reviews: CloudReview[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = REVIEWS_COLLECTION;
  const reviewsRef = collection(db, path);
  const q = query(reviewsRef, limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const reviews: CloudReview[] = [];
      snapshot.forEach((docSnap) => {
        reviews.push({
          ...(docSnap.data() as Omit<CloudReview, 'id'>),
          id: docSnap.id
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
 * Persist a newly submitted customer review to Firestore.
 */
export async function persistReviewToCloud(review: {
  name: string;
  city: string;
  comment: string;
  rating: number;
}): Promise<boolean> {
  const reviewId = `REV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const path = `${REVIEWS_COLLECTION}/${reviewId}`;
  
  try {
    const reviewDocRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await setDoc(reviewDocRef, {
      name: review.name.trim().slice(0, 80),
      city: (review.city || 'الخرطوم').trim().slice(0, 80),
      comment: review.comment.trim().slice(0, 1000),
      rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
      createdAt: new Date().toISOString()
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
