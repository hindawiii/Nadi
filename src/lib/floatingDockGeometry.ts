export const FLOATING_DOCK_STORAGE_KEY = 'nadi_floating_dock_pos_v2';
export const LEGACY_WA_STORAGE_KEY = 'so_beauty_wa_pos';

export interface DockPosition {
  /** Horizontal offset in px from the left edge of the viewport */
  x: number;
  /** Vertical offset in px from the bottom edge of the viewport */
  bottom: number;
}

export interface DockMetrics {
  isMobile: boolean;
  buttonSize: number;
  edgePadding: number;
  gapSize: number;
  headerSafeTop: number;
}

export function getFloatingDockMetrics(viewportWidth: number): DockMetrics {
  const isMobile = viewportWidth < 640;
  return {
    isMobile,
    buttonSize: isMobile ? 44 : 48,
    edgePadding: isMobile ? 12 : 24,
    gapSize: isMobile ? 12 : 14,
    headerSafeTop: 76,
  };
}

/**
 * Computes the total vertical height of the unified floating dock
 * given the number of visible stacked buttons (1 or 2).
 */
export function getFloatingDockHeight(viewportWidth: number, visibleCount: number): number {
  const { buttonSize, gapSize } = getFloatingDockMetrics(viewportWidth);
  const safeCount = Math.max(1, visibleCount);
  return safeCount * buttonSize + Math.max(0, safeCount - 1) * gapSize;
}

/**
 * Clamps dock coordinates { x, bottom } strictly inside the viewport safe bounds
 * so neither the top WhatsApp FAB nor the bottom Scroll-to-Top button ever clips off-screen.
 */
export function clampDockToViewport(
  x: number,
  bottom: number,
  viewportWidth: number,
  viewportHeight: number,
  reservedDockHeight?: number
): DockPosition {
  const { buttonSize, edgePadding, headerSafeTop } = getFloatingDockMetrics(viewportWidth);
  const effectiveHeight = reservedDockHeight ?? getFloatingDockHeight(viewportWidth, 2);

  const minX = edgePadding;
  const maxX = Math.max(edgePadding, viewportWidth - buttonSize - edgePadding);

  const minBottom = edgePadding;
  const maxBottom = Math.max(edgePadding, viewportHeight - effectiveHeight - headerSafeTop);

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    bottom: Math.min(maxBottom, Math.max(minBottom, bottom)),
  };
}

/**
 * Magnetic edge-snapping: docks the entire unified vertical stack cleanly
 * to the nearest horizontal screen edge while preserving vertical resting height.
 */
export function snapDockToNearestEdge(
  x: number,
  bottom: number,
  viewportWidth: number,
  viewportHeight: number,
  reservedDockHeight?: number
): DockPosition {
  const clamped = clampDockToViewport(x, bottom, viewportWidth, viewportHeight, reservedDockHeight);
  const { buttonSize, edgePadding } = getFloatingDockMetrics(viewportWidth);
  const centerX = clamped.x + buttonSize / 2;
  const snappedX =
    centerX < viewportWidth / 2
      ? edgePadding
      : Math.max(edgePadding, viewportWidth - buttonSize - edgePadding);

  return {
    x: snappedX,
    bottom: clamped.bottom,
  };
}

/**
 * Determines whether the speed-dial menu above WhatsApp should open downward
 * because the dock is currently parked in the top region of the viewport.
 */
export function isDockNearTopEdge(
  bottom: number,
  viewportHeight: number,
  dockHeight: number
): boolean {
  const topEdgeY = viewportHeight - bottom - dockHeight;
  return topEdgeY < 220;
}
