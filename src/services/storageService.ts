import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../lib/firebase';

export type MediaFolder = 'products' | 'gallery' | 'branding' | 'hero' | 'banners' | 'skin';

export interface MediaUploadResult {
  url: string;
  source: 'firebase-storage' | 'compressed-local';
  bytes: number;
}

interface OptimizeOptions {
  maxDimension?: number;
  quality?: number;
}

const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10MB raw file limit
const MAX_FALLBACK_DATA_URL_BYTES = 145 * 1024; // Keep local/Firestore fallback compact (<145KB)

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Failed to encode compressed image'));
    reader.readAsDataURL(blob);
  });
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Invalid or corrupted image file'));
    };
    img.src = objectUrl;
  });
}

/**
 * Downscales and compresses an image file via offscreen canvas to WebP (or JPEG fallback)
 * so uploaded assets stay lightweight across Firebase Storage, Firestore, and browser caches.
 */
export async function optimizeImageFile(
  file: File,
  options: OptimizeOptions = {}
): Promise<{ blob: Blob; mimeType: string; extension: string }> {
  const maxDimension = options.maxDimension ?? 1200;
  const quality = options.quality ?? 0.82;

  const img = await loadImageElement(file);
  const srcWidth = img.naturalWidth || img.width || maxDimension;
  const srcHeight = img.naturalHeight || img.height || maxDimension;

  const scale = Math.min(1, maxDimension / Math.max(srcWidth, srcHeight));
  const targetWidth = Math.max(1, Math.round(srcWidth * scale));
  const targetHeight = Math.max(1, Math.round(srcHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const tryEncode = (mime: string, q: number): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, q));

  let blob = await tryEncode('image/webp', quality);
  let mimeType = 'image/webp';
  let extension = 'webp';

  if (!blob || blob.size === 0) {
    blob = await tryEncode('image/jpeg', quality);
    mimeType = 'image/jpeg';
    extension = 'jpg';
  }

  if (!blob) {
    throw new Error('Failed to compress image');
  }

  // If fallback/storage needs tighter compression for a super dense image, step quality down once
  if (!auth.currentUser && blob.size > 105 * 1024) {
    const tighter = await tryEncode(mimeType, 0.65);
    if (tighter && tighter.size < blob.size) {
      blob = tighter;
    }
  }

  return { blob, mimeType, extension };
}

/**
 * Compresses and uploads a store media asset to Firebase Cloud Storage when authenticated,
 * with a strict size-capped compressed Data URL fallback only when cloud upload is unavailable.
 */
export async function uploadStoreMedia(
  file: File,
  folder: MediaFolder,
  lang: 'ar' | 'en' = 'ar',
  options: OptimizeOptions = {}
): Promise<MediaUploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error(
      lang === 'ar'
        ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)'
        : 'Please select a valid image file (PNG, JPG, WebP)'
    );
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      lang === 'ar'
        ? 'حجم الصورة يتجاوز الحد الأقصى (10 ميجابايت)'
        : 'Image size exceeds the 10MB maximum limit'
    );
  }

  const { blob, mimeType, extension } = await optimizeImageFile(file, options);
  const safeBaseName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 32) || 'asset';
  const fileName = `${Date.now()}-${safeBaseName}.${extension}`;

  // Upload to Firebase Storage whenever a Firebase user/admin session is active
  if (auth.currentUser) {
    try {
      const storageRef = ref(storage, `store-media/${folder}/${fileName}`);
      await uploadBytes(storageRef, blob, {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000',
      });
      const downloadUrl = await getDownloadURL(storageRef);
      return {
        url: downloadUrl,
        source: 'firebase-storage',
        bytes: blob.size,
      };
    } catch (storageError) {
      console.warn('Firebase Storage upload fell back to compact asset encoding:', storageError);
    }
  }

  // Compact compressed Data URL fallback only if comfortably below Firestore/localStorage caps
  const dataUrl = await blobToDataUrl(blob);
  if (dataUrl.length > MAX_FALLBACK_DATA_URL_BYTES) {
    throw new Error(
      lang === 'ar'
        ? 'تعذر رفع الصورة إلى Firebase Storage وحجمها المضغوط كبير للتخزين المحلي؛ يرجى توثيق جلسة المالك عبر Google أو اختيار صورة أصغر.'
        : 'Could not upload to Firebase Storage and compressed size is too large for inline fallback. Please sign in with Google Admin or use a smaller image.'
    );
  }

  return {
    url: dataUrl,
    source: 'compressed-local',
    bytes: blob.size,
  };
}
