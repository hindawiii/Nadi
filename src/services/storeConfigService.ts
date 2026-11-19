import { doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { SiteConfig } from '../data/siteConfig';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const STOREFRONT_COLLECTION = 'storefront';
const PUBLIC_DOC_ID = 'public';
const MAX_FIRESTORE_CONFIG_BYTES = 850 * 1024; // Safety margin below Firestore 1MB doc limit

export interface PublicStorefrontPayload {
  activePresetId: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';
  presets: SiteConfig['presets'];
  currencies: SiteConfig['currencies'];
  sectionsControl?: Record<string, boolean>;
  sectionsOrder?: string[];
  paletteId?: string;
  customColors?: {
    primary: string;
    accent: string;
    surface: string;
  };
  typographyId?: string;
  updatedAt: string;
  updatedBy?: string;
}

/**
 * Recursively clones an object while removing `undefined` fields (which Firestore rejects)
 * so payloads cleanly pass strict security rules validation.
 */
function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out as T;
  }
  return value;
}

/**
 * Builds a strictly sanitized public storefront configuration payload.
 * Never includes PINs, admin secrets, or undefined values.
 */
export function buildPublicStorefrontPayload(params: {
  dynamicConfig: SiteConfig;
  activePresetId: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';
  sectionsControl: Record<string, boolean>;
  sectionsOrder: string[];
  paletteId: string;
  customColors: { primary: string; accent: string; surface: string } | null;
  typographyId: string;
}): PublicStorefrontPayload {
  const safePresets = stripUndefinedDeep(params.dynamicConfig.presets);
  const safeCurrencies = stripUndefinedDeep(params.dynamicConfig.currencies);
  const safeSectionsControl = stripUndefinedDeep(params.sectionsControl);
  const safeSectionsOrder = Array.isArray(params.sectionsOrder)
    ? params.sectionsOrder.filter((id): id is string => typeof id === 'string').slice(0, 30)
    : [];

  const payload: PublicStorefrontPayload = {
    activePresetId: params.activePresetId,
    presets: safePresets,
    currencies: safeCurrencies,
    sectionsControl: safeSectionsControl,
    sectionsOrder: safeSectionsOrder,
    paletteId: String(params.paletteId || 'imperial-orchid').slice(0, 64),
    typographyId: String(params.typographyId || 'nadi-royal').slice(0, 64),
    updatedAt: new Date().toISOString().slice(0, 64),
  };

  if (params.customColors && typeof params.customColors === 'object') {
    payload.customColors = {
      primary: String(params.customColors.primary || '#5A3E7A').slice(0, 32),
      accent: String(params.customColors.accent || '#D4AF37').slice(0, 32),
      surface: String(params.customColors.surface || '#FAF8FC').slice(0, 32),
    };
  }

  if (auth.currentUser?.uid) {
    payload.updatedBy = auth.currentUser.uid.slice(0, 128);
  }

  return payload;
}

/**
 * Publishes sanitized public storefront configuration and product catalog to Firestore (/storefront/public).
 * Protected by firestore.rules: requires verified Admin authentication.
 */
export async function saveStorefrontConfigToCloud(
  payload: PublicStorefrontPayload
): Promise<{ success: boolean; reason?: 'too-large' | 'unauthenticated' | 'error' }> {
  if (!auth.currentUser) {
    return { success: false, reason: 'unauthenticated' };
  }

  const serializedSize = new Blob([JSON.stringify(payload)]).size;
  if (serializedSize > MAX_FIRESTORE_CONFIG_BYTES) {
    console.warn(`Storefront config size (${serializedSize} bytes) exceeds safe Firestore limit.`);
    return { success: false, reason: 'too-large' };
  }

  const path = `${STOREFRONT_COLLECTION}/${PUBLIC_DOC_ID}`;
  try {
    const docRef = doc(db, STOREFRONT_COLLECTION, PUBLIC_DOC_ID);
    await setDoc(docRef, payload);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Could not sync storefront config to Firestore:', error);
    return { success: false, reason: 'error' };
  }
}

/**
 * Subscribes all storefront visitors to real-time catalog, price, stock, and theme updates
 * from Firestore `/storefront/public` via single-document lookup (no collection scan).
 */
export function subscribeToStorefrontConfig(
  onUpdate: (payload: PublicStorefrontPayload) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = `${STOREFRONT_COLLECTION}/${PUBLIC_DOC_ID}`;
  const docRef = doc(db, STOREFRONT_COLLECTION, PUBLIC_DOC_ID);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data() as PublicStorefrontPayload;
      if (data && data.presets && data.currencies && data.activePresetId) {
        onUpdate(data);
      }
    },
    (error) => {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      console.warn('Storefront cloud sync subscription warning:', error);
      if (onError) onError(error);
    }
  );
}
