export const CART_DOUBLE_TAP_COOLDOWN_MS = 450;

/**
 * Prevents accidental rapid double-taps on mobile product cards while
 * preserving intentional repeat clicks to add multiple units.
 */
export function canAcceptCartAddTap(
  lastTapTimestamp: number,
  now: number,
  cooldownMs: number = CART_DOUBLE_TAP_COOLDOWN_MS
): boolean {
  if (lastTapTimestamp <= 0) return true;
  return now - lastTapTimestamp >= cooldownMs;
}

/**
 * Checks whether the cart already holds the maximum available inventory
 * for a given product.
 */
export function isAtStockLimit(inCartQty: number, stock?: number): boolean {
  if (typeof stock !== 'number' || Number.isNaN(stock) || stock < 0) {
    return false;
  }
  return inCartQty >= stock;
}
