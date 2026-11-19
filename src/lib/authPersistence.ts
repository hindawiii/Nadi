import {
  Auth,
  Persistence,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';

export const CUSTOMER_SESSION_STORAGE_KEY = 'luxe_customer_user';
export const REMEMBER_ME_SESSION_FLAG = 'nadi_auth_session_only';

export interface CachedCustomerSession {
  uid: string;
  name: string;
  email?: string | null;
  photoURL?: string | null;
  provider?: string;
  authenticatedAt?: string;
}

/**
 * Resolves the Firebase Auth persistence strategy from the user's "Remember Me" choice.
 */
export function resolveFirebasePersistence(rememberMe: boolean): Persistence {
  return rememberMe ? browserLocalPersistence : browserSessionPersistence;
}

/**
 * Reads whether the active session opted into persistent storage (true) or tab-only session (false).
 */
export function getRememberMePreference(): boolean {
  try {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(REMEMBER_ME_SESSION_FLAG) !== '1';
    }
  } catch {
    // Ignore storage access errors in restricted browsing modes
  }
  return true;
}

/**
 * Applies the selected Firebase Auth persistence mode and records the preference for cache syncing.
 */
export async function applyFirebaseAuthPersistence(
  authInstance: Auth,
  rememberMe: boolean
): Promise<boolean> {
  try {
    if (typeof sessionStorage !== 'undefined') {
      if (rememberMe) {
        sessionStorage.removeItem(REMEMBER_ME_SESSION_FLAG);
      } else {
        sessionStorage.setItem(REMEMBER_ME_SESSION_FLAG, '1');
      }
    }
  } catch {
    // Ignore sessionStorage restrictions
  }

  try {
    await setPersistence(authInstance, resolveFirebasePersistence(rememberMe));
    return true;
  } catch {
    // Fallback safely if browser blocks IndexedDB/storage in strict private mode
    return false;
  }
}

/**
 * Stores customer profile cache strictly in localStorage (when rememberMe=true)
 * or sessionStorage (when rememberMe=false) while clearing the opposite store.
 */
export function saveCustomerSessionCache(
  user: CachedCustomerSession,
  rememberMe: boolean
): void {
  const serialized = JSON.stringify(user);
  try {
    if (rememberMe) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CUSTOMER_SESSION_STORAGE_KEY, serialized);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
      }
    } else {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CUSTOMER_SESSION_STORAGE_KEY, serialized);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
      }
    }
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

/**
 * Reads cached customer session profile, prioritizing active tab sessionStorage over localStorage.
 */
export function readCustomerSessionCache(): CachedCustomerSession | null {
  const parseRaw = (raw: string | null): CachedCustomerSession | null => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.uid === 'string' && parsed.uid.length > 0) {
        return parsed as CachedCustomerSession;
      }
    } catch {
      // Ignore malformed cache entries
    }
    return null;
  };

  try {
    if (typeof sessionStorage !== 'undefined') {
      const sessionUser = parseRaw(sessionStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY));
      if (sessionUser) return sessionUser;
    }
    if (typeof localStorage !== 'undefined') {
      return parseRaw(localStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY));
    }
  } catch {
    // Ignore storage access errors
  }
  return null;
}

/**
 * Removes customer session cache and session-only flag from both localStorage and sessionStorage.
 */
export function clearCustomerSessionCache(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(CUSTOMER_SESSION_STORAGE_KEY);
      sessionStorage.removeItem(REMEMBER_ME_SESSION_FLAG);
    }
  } catch {
    // Ignore storage errors
  }
}
