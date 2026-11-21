import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  setLogLevel,
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
 * Builds resilient local cache configuration for browser sessions:
 * prefers multi-tab IndexedDB persistence for instant offline-first reads,
 * falling back cleanly to in-memory cache in restricted/private contexts.
 */
function buildResilientLocalCache() {
  try {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      return persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      });
    }
  } catch {
    // Fall back to memory cache when IndexedDB is unavailable or blocked
  }
  return memoryLocalCache();
}

/**
 * Browser-safe Firestore transport & offline-cache settings.
 * Uses adaptive long-polling auto-detection with the maximum 30s long-poll window
 * so healthy networks stay fast while high-latency mobile/VPN proxies auto-fallback
 * cleanly without premature [code=unavailable] stalls.
 */
export function buildFirestoreBrowserSettings(): FirestoreSettings {
  return {
    experimentalAutoDetectLongPolling: true,
    experimentalLongPollingOptions: {
      timeoutSeconds: 30,
    },
    localCache: buildResilientLocalCache(),
    ignoreUndefinedProperties: true,
  };
}

function createFirestoreInstance(): Firestore {
  const databaseId = resolveFirestoreDatabaseId(firebaseConfig.firestoreDatabaseId);
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    // Silence noisy internal SDK transport retry logs during transient mobile/VPN blips;
    // real permission/schema errors are explicitly surfaced via handleFirestoreError().
    try {
      setLogLevel('silent');
    } catch {
      // Non-critical
    }

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

// Initialize Firestore with adaptive transport, offline cache & specific database ID
export const db: Firestore = createFirestoreInstance();

// Synchronize Firestore network state with browser online/offline & mobile tab-resume events
// so suspended mobile sockets or offline sessions recover cleanly without stalling.
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

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && (typeof navigator === 'undefined' || navigator.onLine !== false)) {
        enableNetwork(db).catch(() => {});
      }
    });
  }
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
