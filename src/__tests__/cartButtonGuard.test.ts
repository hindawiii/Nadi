import { describe, expect, it } from 'vitest';
import {
  canAcceptCartAddTap,
  CART_DOUBLE_TAP_COOLDOWN_MS,
  isAtStockLimit,
} from '../lib/cartButtonGuard';

describe('cartButtonGuard', () => {
  it('accepts the first tap and rejects rapid accidental double-taps within cooldown', () => {
    const t0 = 10_000;
    expect(canAcceptCartAddTap(0, t0)).toBe(true);
    expect(canAcceptCartAddTap(t0, t0 + 120)).toBe(false);
    expect(canAcceptCartAddTap(t0, t0 + CART_DOUBLE_TAP_COOLDOWN_MS - 1)).toBe(false);
  });

  it('accepts intentional repeat taps once the cooldown window elapses', () => {
    const t0 = 10_000;
    expect(canAcceptCartAddTap(t0, t0 + CART_DOUBLE_TAP_COOLDOWN_MS)).toBe(true);
    expect(canAcceptCartAddTap(t0, t0 + 800)).toBe(true);
  });

  it('enforces stock ceiling without blocking when stock is unspecified', () => {
    expect(isAtStockLimit(0, 2)).toBe(false);
    expect(isAtStockLimit(1, 2)).toBe(false);
    expect(isAtStockLimit(2, 2)).toBe(true);
    expect(isAtStockLimit(3, 2)).toBe(true);
    expect(isAtStockLimit(5, undefined)).toBe(false);
  });
});
