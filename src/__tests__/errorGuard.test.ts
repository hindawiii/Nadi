import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  clearRecordedRuntimeErrors,
  getRecordedRuntimeErrors,
  isHarmlessBrowserNoise,
  recordRuntimeError,
  safeExecute,
  safeExecuteAsync,
} from '../lib/errorGuard';

describe('Runtime Error Guard (try/catch shield & pinpoint diagnostics)', () => {
  beforeEach(() => {
    clearRecordedRuntimeErrors();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('catches synchronous exceptions via safeExecute, returns fallback, and records exact source', () => {
    const result = safeExecute(
      () => {
        throw new Error('Malformed product payload');
      },
      'fallback-value',
      'ProductCard.render'
    );

    expect(result).toBe('fallback-value');
    const logs = getRecordedRuntimeErrors();
    expect(logs).toHaveLength(1);
    expect(logs[0].source).toBe('ProductCard.render');
    expect(logs[0].message).toBe('Malformed product payload');
  });

  it('catches rejected promises via safeExecuteAsync and preserves app stability', async () => {
    const result = await safeExecuteAsync(
      async () => {
        throw new Error('Network stall during prefetch');
      },
      false,
      'App.prefetch'
    );

    expect(result).toBe(false);
    const logs = getRecordedRuntimeErrors();
    expect(logs).toHaveLength(1);
    expect(logs[0].source).toBe('App.prefetch');
    expect(logs[0].message).toContain('Network stall');
  });

  it('bounds the diagnostic ring buffer to 30 entries to prevent memory leaks', () => {
    for (let i = 0; i < 40; i++) {
      recordRuntimeError(new Error(`Error #${i}`), `source-${i}`);
    }
    const logs = getRecordedRuntimeErrors();
    expect(logs).toHaveLength(30);
    expect(logs[0].message).toBe('Error #39');
  });

  it('filters harmless browser preview noise without muting genuine app errors', () => {
    expect(isHarmlessBrowserNoise('ResizeObserver loop completed with undelivered notifications')).toBe(true);
    expect(isHarmlessBrowserNoise('WebSocket connection failed')).toBe(true);
    expect(isHarmlessBrowserNoise('Cannot read properties of undefined (reading price)')).toBe(false);
  });
});
