# Firestore Security Specification (Phase 0–5 Audit)

## Collections & Access Matrix
1. `/orders/{orderId}` (Private PII: customerName, phone, address, items, totalFormatted, trackingCode, ownerUid)
   - `get`: Bootstrapped/verified Admin OR authenticated `ownerUid == request.auth.uid`
   - `list`: Admin only (blocks anonymous/non-admin bulk PII enumeration)
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

## Red Team Checks Verified
- Email Spoofing Test: `isBootstrappedAdmin()` checks `request.auth.token.email_verified == true`.
- PII Blanket Test: Non-admin `list` or `get` on foreign `/orders/{orderId}` denied; public tracking isolated in `/tracking/{trackingCode}` without customerName/phone/address.
- State Shortcutting Test: Guests cannot create orders with `delivered` status or reviews with `approved` status.
- Identity Spoofing Test: `ownerUid` must match `request.auth.uid` on order creation unless Admin.
- Value Poisoning Test: `update` blocks invoke full `isValidOrder`/`isValidTracking`/`isValidReview` helpers and preserve immutable IDs.
