import { describe, it, expect, vi, beforeEach } from 'vitest';

const { setPersistenceMock, LOCAL_MARKER, SESSION_MARKER } = vi.hoisted(() => ({
  setPersistenceMock: vi.fn(async (_auth: unknown, _persistence: unknown) => undefined),
  LOCAL_MARKER: { type: 'LOCAL' },
  SESSION_MARKER: { type: 'SESSION' },
}));

vi.mock('firebase/auth', () => ({
  browserLocalPersistence: LOCAL_MARKER,
  browserSessionPersistence: SESSION_MARKER,
  setPersistence: (auth: unknown, persistence: unknown) => setPersistenceMock(auth, persistence),
}));

import {
  applyFirebaseAuthPersistence,
  clearCustomerSessionCache,
  CUSTOMER_SESSION_STORAGE_KEY,
  getRememberMePreference,
  readCustomerSessionCache,
  REMEMBER_ME_SESSION_FLAG,
  resolveFirebasePersistence,
  saveCustomerSessionCache,
} from '../lib/authPersistence';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

describe('Firebase Auth Persistence & Remember Me Alignment (authPersistence)', () => {
  beforeEach(() => {
    setPersistenceMock.mockClear();
    Object.defineProperty(globalThis, 'localStorage', {
      value: new MemoryStorage(),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: new MemoryStorage(),
      writable: true,
      configurable: true,
    });
  });

  it('selects browserLocalPersistence when rememberMe is true and browserSessionPersistence when false', async () => {
    expect(resolveFirebasePersistence(true)).toBe(LOCAL_MARKER);
    expect(resolveFirebasePersistence(false)).toBe(SESSION_MARKER);

    const fakeAuth = { name: 'mock-auth' } as any;

    await applyFirebaseAuthPersistence(fakeAuth, false);
    expect(setPersistenceMock).toHaveBeenLastCalledWith(fakeAuth, SESSION_MARKER);
    expect(sessionStorage.getItem(REMEMBER_ME_SESSION_FLAG)).toBe('1');
    expect(getRememberMePreference()).toBe(false);

    await applyFirebaseAuthPersistence(fakeAuth, true);
    expect(setPersistenceMock).toHaveBeenLastCalledWith(fakeAuth, LOCAL_MARKER);
    expect(sessionStorage.getItem(REMEMBER_ME_SESSION_FLAG)).toBeNull();
    expect(getRememberMePreference()).toBe(true);
  });

  it('stores customer cache strictly in sessionStorage when rememberMe is false and clears localStorage', () => {
    const user = { uid: 'uid-1', name: 'Amina', email: 'amina@example.com', provider: 'google' };

    // First store persistently
    saveCustomerSessionCache(user, true);
    expect(localStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY)).not.toBeNull();
    expect(sessionStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY)).toBeNull();

    // Switching to session-only moves profile to sessionStorage and wipes localStorage
    saveCustomerSessionCache(user, false);
    expect(sessionStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY)).not.toBeNull();
    expect(localStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY)).toBeNull();
    expect(readCustomerSessionCache()?.uid).toBe('uid-1');

    // Clearing removes from both storages and resets session flag
    clearCustomerSessionCache();
    expect(localStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(CUSTOMER_SESSION_STORAGE_KEY)).toBeNull();
    expect(readCustomerSessionCache()).toBeNull();
  });
});
