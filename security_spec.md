# Firestore Security Specification (Phase 0–6 Audit — Including Phase 4 Full Cloud Sync)

## Collections & Access Matrix
1. `/orders/{orderId}` (Private PII: customerName, phone, address, items, totalFormatted, trackingCode, ownerUid)
   - `get`: Bootstrapped/verified Admin OR authenticated `ownerUid == request.auth.uid`
   - `list`: Admin OR authenticated customer querying strictly `resource.data.ownerUid == request.auth.uid` (Pillar 8 Secure List Query — blocks cross-customer PII enumeration)
   - `create`: Valid schema (`isValidOrder`), `incoming().id == orderId`, guest/customer forced `status == 'received'`, optional `ownerUid` must equal `request.auth.uid`
   - `update`: Admin only, full `isValidOrder(incoming())` validation + immutable `id`
   - `delete`: Admin only

2. `/tracking/{trackingCode}` (Public non-PII status projection: trackingCode, orderId, status, date, totalFormatted)
   - `get`: Single-document lookup by exact `trackingCode` only
   - `list`: Admin only (blocks scraping/enumerating all tracking codes)
   - `create`: Valid schema (`isValidTracking`), non-PII whitelist enforced via `hasOnly`, forced `status == 'received'` unless Admin
   - `update`: Admin only, `trackingCode` and `orderId` immutable
   - `delete`: Admin only

3. `/reviews/{reviewId}` (Moderation-gated testimonials)
   - `get`, `list`: `resource.data.status == 'approved'` OR Admin (pending/rejected reviews hidden from public queries)
   - `create`: Valid schema (`isValidReview`), forced `status == 'pending'` unless Admin
   - `update`, `delete`: Admin only

4. `/admins/{uid}` (Role registry)
   - `get`: Owner or Admin
   - `list`: Admin
   - `write`: Disabled from client (`if false`)

5. `/storefront/{docId}` (Public Storefront Catalog, Currency Rates & Theme Sync)
   - `get`: Valid document ID (`^[a-zA-Z0-9_-]+$`, e.g. `public`) readable by storefront visitors for real-time catalog & price sync
   - `list`: Admin only (prevents full collection enumeration)
   - `create`, `update`: Admin only, strict `isValidStorefrontConfig(incoming())` key whitelist (`hasOnly`) ensuring zero secrets (`security`, PINs) ever enter public config
   - `delete`: Admin only

6. `/users/{userId}/private/{docId}` (Authenticated Customer Cart & Wishlist Sync — `docId == 'commerce'`)
   - `get`: Owner only (`isOwner(userId) && docId == 'commerce'`)
   - `list`: Denied (`if false`) — zero collection scanning of private sub-documents
   - `create`, `update`: Owner only (`isOwner(userId) && docId == 'commerce'`), strict `isValidUserCommerce(incoming())` enforcing `hasAll`/`hasOnly(['cart', 'wishlist', 'updatedAt'])`, volumetric caps (`cart.size() <= 50`, `wishlist.size() <= 100`), and array element type guards
   - `delete`: Owner only (`isOwner(userId) && docId == 'commerce'`)

7. `/inventory/{productId}` (Live Product Stock Levels & Atomic Checkout Deduction)
   - `get`, `list`: Publicly readable (strictly non-PII stock counts only; no customer info)
   - `create`: Admin only (`isAdmin() && isValidId(productId) && isValidInventoryItem(incoming()) && incoming().productId == productId`)
   - `update`: Full `isValidInventoryItem(incoming())` + immutable `productId`; allowed for Admin OR strict checkout atomic decrement (`affectedKeys().hasOnly(['stock', 'updatedAt'])`, integer `stock >= 0`, `incoming().stock < existing().stock`, and `existing().stock - incoming().stock <= 20`)
   - `delete`: Admin only

## Red Team Checks Verified
- Email Spoofing Test: `isBootstrappedAdmin()` checks `request.auth.token.email_verified == true`.
- PII Blanket Test: Non-admin `list` or `get` on foreign `/orders/{orderId}` denied; authenticated customer `list` requires `where('ownerUid', '==', uid)` matching `resource.data.ownerUid == request.auth.uid`; public tracking isolated in `/tracking/{trackingCode}` without PII.
- Private Commerce Isolation Test: User B cannot `get`, `list`, `create`, `update`, or `delete` `/users/{userA}/private/commerce`.
- State Shortcutting Test: Guests cannot create orders with `delivered` status or reviews with `approved` status.
- Identity Spoofing Test: `ownerUid` must match `request.auth.uid` on order creation unless Admin; `updatedBy` on `/storefront/{docId}` must match `request.auth.uid`.
- Inventory Tampering / Inflation Test: Non-admin shoppers cannot create arbitrary `/inventory/{productId}` docs, cannot inflate stock (`incoming().stock >= existing().stock` rejected), cannot set negative stock, cannot wipe huge stock (>20 per transaction), and cannot mutate `productId`.
- Secret Leak / Shadow Field Test: Passing `security` or arbitrary shadow fields into `/storefront/{docId}`, `/users/{uid}/private/commerce`, or `/inventory/{productId}` rejected by `hasOnly` whitelists.
