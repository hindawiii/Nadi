import { describe, it, expect } from 'vitest';
import {
  serializeCloudCart,
  sanitizeCloudWishlist,
  hydrateCloudCart,
  mergeCartItems,
  mergeWishlistIds,
  computeCommerceFingerprint,
} from '../services/userCommerceService';
import {
  computeNextStock,
  sanitizeInventoryItem,
} from '../services/inventoryService';
import { sanitizeOrderPayload } from '../services/orderService';
import { Product } from '../data/siteConfig';
import { CartItem, OrderRecord } from '../context/CommerceContext';

function makeProduct(id: string, stock = 10): Product {
  return {
    id,
    name: { ar: `منتج ${id}`, en: `Product ${id}` },
    category: { ar: 'العناية بالبشرة', en: 'Skincare' },
    basePriceUSD: 25,
    stock,
    rating: 4.9,
    reviewsCount: 10,
    images: ['https://example.com/p.jpg'],
    tabs: {
      description: { ar: 'وصف', en: 'Desc' },
      usage: { ar: 'استخدام', en: 'Use' },
      ingredientsOrSpecs: { ar: 'مكونات', en: 'Specs' },
      reviews: { ar: 'تقييم', en: 'Review' },
    },
  };
}

describe('Phase 4 Cloud Sync — Customer Cart & Wishlist', () => {
  const p1 = makeProduct('p-1', 12);
  const p2 = makeProduct('p-2', 5);
  const p3 = makeProduct('p-3', 8);
  const pool = [p1, p2, p3];

  it('serializes cart items compactly, deduplicates identical entries, and enforces volumetric caps', () => {
    const cart: CartItem[] = [
      { product: p1, quantity: 2, selectedVariant: '50ml' },
      { product: p1, quantity: 3, selectedVariant: '50ml' },
      { product: p2, quantity: 150 },
    ];

    const serialized = serializeCloudCart(cart);
    expect(serialized).toHaveLength(2);
    expect(serialized[0]).toEqual({ productId: 'p-1', quantity: 5, selectedVariant: '50ml' });
    expect(serialized[1]).toEqual({ productId: 'p-2', quantity: 99 });
  });

  it('caps serialized cart at 50 items and wishlist at 100 deduplicated IDs', () => {
    const hugeCart: CartItem[] = Array.from({ length: 70 }, (_, idx) => ({
      product: makeProduct(`prod-${idx}`),
      quantity: 1,
    }));
    expect(serializeCloudCart(hugeCart)).toHaveLength(50);

    const hugeWishlist = Array.from({ length: 140 }, (_, idx) => `w-${idx % 120}`);
    expect(sanitizeCloudWishlist(hugeWishlist)).toHaveLength(100);
  });

  it('merges guest cart with cloud cart without doubling quantities on re-login and preserves new guest items', () => {
    const localCart: CartItem[] = [
      { product: p1, quantity: 2 },
      { product: p3, quantity: 1 },
    ];
    const cloudEntries = [
      { productId: 'p-1', quantity: 2 },
      { productId: 'p-2', quantity: 3 },
      { productId: 'deleted-product', quantity: 1 },
    ];

    const merged = mergeCartItems(localCart, cloudEntries, pool);
    const byId = new Map(merged.map((i) => [i.product.id, i.quantity]));

    expect(byId.get('p-1')).toBe(2); // Does not erroneously double to 4
    expect(byId.get('p-2')).toBe(3); // Preserves cloud item
    expect(byId.get('p-3')).toBe(1); // Preserves newly added guest item
    expect(byId.has('deleted-product')).toBe(false); // Skips removed catalog product
  });

  it('hydrates cloud cart safely and unions wishlist IDs without duplicates', () => {
    const hydrated = hydrateCloudCart([{ productId: 'p-2', quantity: 4 }], pool);
    expect(hydrated).toHaveLength(1);
    expect(hydrated[0].product.id).toBe('p-2');
    expect(hydrated[0].quantity).toBe(4);

    const mergedWish = mergeWishlistIds(['p-3', 'p-1'], ['p-1', 'p-2']);
    expect(mergedWish).toEqual(['p-1', 'p-2', 'p-3']);
  });

  it('produces identical canonical fingerprints regardless of array ordering', () => {
    const fpA = computeCommerceFingerprint(
      [
        { product: p1, quantity: 1 },
        { product: p2, quantity: 2 },
      ],
      ['p-2', 'p-1']
    );
    const fpB = computeCommerceFingerprint(
      [
        { product: p2, quantity: 2 },
        { product: p1, quantity: 1 },
      ],
      ['p-1', 'p-2']
    );
    expect(fpA).toBe(fpB);
  });
});

describe('Phase 4 Cloud Sync — Atomic Inventory & Customer Order Ownership', () => {
  it('computes non-negative integer stock after checkout deduction', () => {
    expect(computeNextStock(10, 3)).toBe(7);
    expect(computeNextStock(2, 5)).toBe(0);
    expect(computeNextStock(0, 1)).toBe(0);
    expect(computeNextStock(8.9, 2.7)).toBe(6);
  });

  it('sanitizes inventory items and rejects invalid document IDs', () => {
    const valid = sanitizeInventoryItem('hd-01', 15);
    expect(valid).not.toBeNull();
    expect(valid?.productId).toBe('hd-01');
    expect(valid?.stock).toBe(15);

    expect(sanitizeInventoryItem('hd-01', -4)?.stock).toBe(0);
    expect(sanitizeInventoryItem('hd-01', 999999)?.stock).toBe(100000);
    expect(sanitizeInventoryItem('../bad/path', 5)).toBeNull();
  });

  it('preserves and bounds ownerUid inside sanitized order payloads for My Orders cloud queries', () => {
    const sampleOrder: OrderRecord = {
      id: 'ORD-2026-901',
      date: '2026-11-21 12:00',
      customerName: 'سارة أحمد',
      phone: '+249912345678',
      address: 'الخرطوم - الرياض',
      items: [{ productName: 'سيروم ندي', quantity: 1, price: '$25' }],
      totalFormatted: '$25',
      totalUSD: 25,
      currency: 'USD',
      status: 'received',
      trackingCode: 'TRK-90123',
      ownerUid: 'uid-customer-12345',
    };

    const sanitized = sanitizeOrderPayload(sampleOrder);
    expect(sanitized.ownerUid).toBe('uid-customer-12345');
    expect(sanitized.status).toBe('received');
    expect(sanitized.id).toBe('ORD-2026-901');
  });
});
