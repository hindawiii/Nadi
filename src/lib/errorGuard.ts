/**
 * Centralized Runtime Error Guard & Diagnostic Ring Buffer for NADI Store.
 * Provides universal try/catch wrappers (sync & async), structured runtime error recording,
 * and idempotent global window error / unhandledrejection handlers so unexpected failures
 * are pinpointed immediately without taking down the storefront.
 */

export interface RuntimeErrorEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  stack?: string;
  extra?: Record<string, unknown>;
}

const MAX_RECORDED_ERRORS = 30;
const errorLogBuffer: RuntimeErrorEntry[] = [];
let globalHandlersInstalled = false;

/**
 * Normalizes any thrown value (Error, string, object, null) into readable message + optional stack.
 */
export function normalizeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || error.name || 'Unknown Error',
      stack: error.stack,
    };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  try {
    return { message: JSON.stringify(error) || String(error) };
  } catch {
    return { message: String(error) };
  }
}

/**
 * Filters known harmless browser/preview noise (ResizeObserver loop notices, HMR WebSocket disconnect)
 * so diagnostics stay focused on genuine application defects.
 */
export function isHarmlessBrowserNoise(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('resizeobserver loop') ||
    lower.includes('websocket') ||
    lower.includes('script error.')
  );
}

/**
 * Records a structured diagnostic error in memory and logs a pinpoint console trace.
 */
export function recordRuntimeError(
  error: unknown,
  source: string,
  extra?: Record<string, unknown>
): RuntimeErrorEntry {
  const { message, stack } = normalizeError(error);
  const entry: RuntimeErrorEntry = {
    id: `err-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    source,
    message,
    stack,
    extra,
  };

  errorLogBuffer.unshift(entry);
  if (errorLogBuffer.length > MAX_RECORDED_ERRORS) {
    errorLogBuffer.length = MAX_RECORDED_ERRORS;
  }

  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(`[NADI ErrorGuard][${source}] ${message}`, extra ? { extra, stack } : stack || '');
  }

  return entry;
}

export function getRecordedRuntimeErrors(): readonly RuntimeErrorEntry[] {
  return [...errorLogBuffer];
}

export function clearRecordedRuntimeErrors(): void {
  errorLogBuffer.length = 0;
}

/**
 * Universal synchronous try/catch shield.
 * Prevents non-critical logic errors from crashing rendering while immediately logging the source.
 */
export function safeExecute<T>(fn: () => T, fallback: T, source: string): T {
  try {
    return fn();
  } catch (error) {
    recordRuntimeError(error, source);
    return fallback;
  }
}

/**
 * Universal asynchronous try/catch shield.
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  source: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    recordRuntimeError(error, source);
    return fallback;
  }
}

/**
 * Installs idempotent global browser error listeners once at app startup
 * so uncaught exceptions and unhandled Promise rejections are captured with clear source context.
 */
export function installGlobalErrorHandlers(): void {
  if (globalHandlersInstalled || typeof window === 'undefined') {
    return;
  }
  globalHandlersInstalled = true;

  window.addEventListener('error', (event: ErrorEvent) => {
    const rawMsg = event.error?.message || event.message || '';
    if (isHarmlessBrowserNoise(rawMsg)) return;

    recordRuntimeError(event.error || rawMsg, 'window.onerror', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const { message } = normalizeError(event.reason);
    if (isHarmlessBrowserNoise(message)) return;

    recordRuntimeError(event.reason, 'window.unhandledrejection');
  });
}
