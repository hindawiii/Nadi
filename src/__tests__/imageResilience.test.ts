import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  NADI_LOCAL_IMAGE_FALLBACK,
  handleImageLoadError,
  purgeLegacyImageCaches,
} from '../lib/imageResilience';

describe('Image resilience & legacy opaque cache purge', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('provides a self-contained local SVG data URI fallback with zero external URLs', () => {
    expect(NADI_LOCAL_IMAGE_FALLBACK.startsWith('data:image/svg+xml;charset=UTF-8,')).toBe(true);
    expect(NADI_LOCAL_IMAGE_FALLBACK).not.toContain('http://');
    expect(NADI_LOCAL_IMAGE_FALLBACK).not.toContain('https://');
  });

  it('applies the fallback exactly once and clears onerror to prevent infinite retry loops', () => {
    const fakeImg = {
      src: 'https://broken.example/photo.jpg',
      dataset: {} as Record<string, string>,
      onerror: vi.fn(),
    } as unknown as HTMLImageElement;

    handleImageLoadError(fakeImg);
    expect(fakeImg.src).toBe(NADI_LOCAL_IMAGE_FALLBACK);
    expect(fakeImg.dataset.fallbackApplied).toBe('true');
    expect(fakeImg.onerror).toBeNull();

    // Subsequent call should be a safe no-op
    fakeImg.src = 'custom-sentinel';
    handleImageLoadError(fakeImg);
    expect(fakeImg.src).toBe('custom-sentinel');
  });

  it('deletes poisoned unsplash image caches while preserving unrelated PWA caches', async () => {
    const deleteMock = vi.fn(async () => true);
    vi.stubGlobal('window', {
      caches: {
        keys: vi.fn(async () => [
          'workbox-precache-v2',
          'unsplash-images-cache',
          'google-fonts-webfonts',
        ]),
        delete: deleteMock,
      },
    });

    const deleted = await purgeLegacyImageCaches();
    expect(deleted).toEqual(['unsplash-images-cache']);
    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledWith('unsplash-images-cache');
  });
});
