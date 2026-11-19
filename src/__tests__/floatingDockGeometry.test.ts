import { describe, it, expect } from 'vitest';
import {
  getFloatingDockMetrics,
  getFloatingDockHeight,
  clampDockToViewport,
  snapDockToNearestEdge,
  isDockNearTopEdge,
} from '../lib/floatingDockGeometry';

describe('Unified Floating Action Dock geometry & magnetic edge-snap', () => {
  it('computes mobile vs desktop button sizes and guaranteed vertical safe gap', () => {
    const mobile = getFloatingDockMetrics(390);
    expect(mobile.buttonSize).toBe(44);
    expect(mobile.edgePadding).toBe(12);
    expect(mobile.gapSize).toBe(12);
    expect(getFloatingDockHeight(390, 2)).toBe(44 * 2 + 12);

    const desktop = getFloatingDockMetrics(1280);
    expect(desktop.buttonSize).toBe(48);
    expect(desktop.edgePadding).toBe(24);
    expect(desktop.gapSize).toBe(14);
    expect(getFloatingDockHeight(1280, 2)).toBe(48 * 2 + 14);
  });

  it('snaps dragged coordinates magnetically to the nearest horizontal edge', () => {
    // Left half of 390px mobile screen snaps to x = 12
    const leftSnap = snapDockToNearestEdge(120, 140, 390, 844);
    expect(leftSnap.x).toBe(12);
    expect(leftSnap.bottom).toBe(140);

    // Right half of 390px mobile screen snaps to 390 - 44 - 12 = 334
    const rightSnap = snapDockToNearestEdge(240, 140, 390, 844);
    expect(rightSnap.x).toBe(334);
    expect(rightSnap.bottom).toBe(140);
  });

  it('clamps dock bottom offset so expanded 2-button stack never clips past header or bottom edge', () => {
    const clampedLow = clampDockToViewport(-50, -30, 390, 844);
    expect(clampedLow.x).toBe(12);
    expect(clampedLow.bottom).toBe(12);

    const twoBtnHeight = getFloatingDockHeight(390, 2); // 100px
    const clampedHigh = clampDockToViewport(999, 9999, 390, 844, twoBtnHeight);
    expect(clampedHigh.x).toBe(334);
    expect(clampedHigh.bottom).toBe(844 - twoBtnHeight - 76);
  });

  it('detects when the dock is near the top edge so WhatsApp speed-dial flips downward', () => {
    // Near bottom (bottom = 16): topEdgeY = 844 - 16 - 100 = 728 -> false
    expect(isDockNearTopEdge(16, 844, 100)).toBe(false);
    // Near top (bottom = 600): topEdgeY = 844 - 600 - 100 = 144 -> true
    expect(isDockNearTopEdge(600, 844, 100)).toBe(true);
  });
});
