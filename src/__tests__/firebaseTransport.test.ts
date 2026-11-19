import { describe, it, expect, vi, afterEach } from 'vitest';

const mockGetDocFromServer = vi.fn();

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({ name: '[DEFAULT]' })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ __mock: 'getFirestore' })),
  initializeFirestore: vi.fn(() => ({ __mock: 'initializeFirestore' })),
  doc: vi.fn((_db, col, id) => ({ col, id })),
  getDocFromServer: (...args: unknown[]) => mockGetDocFromServer(...args),
  enableNetwork: vi.fn(() => Promise.resolve()),
  disableNetwork: vi.fn(() => Promise.resolve()),
}));

import {
  buildFirestoreBrowserSettings,
  resolveFirestoreDatabaseId,
  testConnection,
} from '../lib/firebase';

describe('Firestore resilient transport & connectivity helpers', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('enables forced long-polling with proxy-safe 20s timeout and undefined-property safety', () => {
    const settings = buildFirestoreBrowserSettings();
    expect(settings.experimentalForceLongPolling).toBe(true);
    expect(settings.experimentalLongPollingOptions?.timeoutSeconds).toBe(20);
    expect(settings.ignoreUndefinedProperties).toBe(true);
  });

  it('resolves named Firestore database IDs cleanly and treats (default)/empty as undefined', () => {
    expect(resolveFirestoreDatabaseId('ai-studio-db-123')).toBe('ai-studio-db-123');
    expect(resolveFirestoreDatabaseId('  my-db  ')).toBe('my-db');
    expect(resolveFirestoreDatabaseId('(default)')).toBeUndefined();
    expect(resolveFirestoreDatabaseId('')).toBeUndefined();
    expect(resolveFirestoreDatabaseId(undefined)).toBeUndefined();
  });

  it('returns false immediately when browser is offline without hitting Firestore backend', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    const ok = await testConnection();
    expect(ok).toBe(false);
    expect(mockGetDocFromServer).not.toHaveBeenCalled();
  });

  it('returns false on offline/unavailable errors and true when backend responds', async () => {
    vi.stubGlobal('navigator', { onLine: true });

    mockGetDocFromServer.mockRejectedValueOnce(new Error('Failed to get document because the client is offline.'));
    expect(await testConnection()).toBe(false);

    mockGetDocFromServer.mockRejectedValueOnce(new Error('PERMISSION_DENIED: Missing permissions'));
    expect(await testConnection()).toBe(true);

    mockGetDocFromServer.mockResolvedValueOnce({ exists: () => false });
    expect(await testConnection()).toBe(true);
  });
});
