import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDocFromServer,
  enableNetwork,
  disableNetwork,
  type Firestore,
  type FirestoreSettings,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

/**
 * Resolves the named Firestore database ID from firebase-applet-config.json.
 * Returns undefined when using the default database so the SDK uses '(default)'.
 */
export function resolveFirestoreDatabaseId(rawId?: string | null): string | undefined {
  const trimmed = typeof rawId === 'string' ? rawId.trim() : '';
  return trimmed && trimmed !== '(default)' ? trimmed : undefined;
}

/**
 * Browser-safe Firestore transport settings.
 * Forced long-polling with a 20s timeout avoids 10-second WebChannel stalls
 * caused by buffering mobile proxies, VPNs, and sandboxed preview iframes.
 */
export function buildFirestoreBrowserSettings(): FirestoreSettings {
  return {
    experimentalForceLongPolling: true,
    experimentalLongPollingOptions: {
      timeoutSeconds: 20,
    },
    ignoreUndefinedProperties: true,
  };
}

function createFirestoreInstance(): Firestore {
  const databaseId = resolveFirestoreDatabaseId(firebaseConfig.firestoreDatabaseId);
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    try {
      const settings = buildFirestoreBrowserSettings();
      return databaseId
        ? initializeFirestore(app, settings, databaseId)
        : initializeFirestore(app, settings);
    } catch {
      // Fallback when Firestore was already initialized in this runtime
      return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    }
  }

  return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

// Initialize Firestore with resilient long-polling transport & specific database ID
export const db: Firestore = createFirestoreInstance();

// Synchronize Firestore network state with browser online/offline transitions
// so offline mobile sessions pause futile backend retries cleanly and auto-recover.
let networkListenersAttached = false;
if (typeof window !== 'undefined' && !networkListenersAttached) {
  networkListenersAttached = true;

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    disableNetwork(db).catch(() => {});
  }

  window.addEventListener('offline', () => {
    disableNetwork(db).catch(() => {});
  });

  window.addEventListener('online', () => {
    enableNetwork(db).catch(() => {});
  });
}

// Connectivity check as required by Firebase integration guidelines
export async function testConnection(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }

  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    if (
      message.includes('the client is offline') ||
      message.includes('failed to get document') ||
      message.includes('unavailable') ||
      message.includes('network')
    ) {
      return false;
    }
    // Document might not exist (404 / not-found), confirming backend is reachable
    return true;
  }
}
