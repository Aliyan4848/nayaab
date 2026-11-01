# NAYAAB — Premium Pakistani Women's Unstitched Fashion

Full-stack ecommerce platform: Next.js (TypeScript, App Router) · Tailwind CSS · PostgreSQL/Supabase · Prisma · Resend · WhatsApp Cloud API.

## Build status (phased, per project plan)

| Phase | Scope | Status |
|---|---|---|
| 1 | Research + architecture + database design | ✅ `docs/01-ux-strategy.md`, `prisma/schema.prisma` |
| 2 | Design system + UX structure | ✅ Button, ProductCard, Layout primitives (`src/components/ui`), storefront chrome (`src/components/storefront`) |
| 3 | Database + auth + storage | 🟡 Prisma client singleton, seed script, storage/WhatsApp provider interfaces done; auth and real upload implementations not started |
| 4 | Customer storefront | 🟡 Homepage, Product Listing Page (`/products`, `/fabric/[slug]`, `/collections/[slug]`, `/new-arrivals`) and Product Detail Page all wired to real Prisma queries (`src/server/services/catalog.ts`) with filtering, sorting, product-confidence blocks, related products, and JSON-LD structured data. Search, wishlist, and account pages are still placeholders. |
| 5 | Cart + checkout + orders | ✅ Real cookie-based cart (guest, no login required), transactional order creation with atomic order numbers and inventory decrement, idempotency-key protection against duplicate submits, order confirmation page. Only Cash on Delivery is wired — bank transfer/JazzCash/Easypaisa/card are unimplemented placeholders in the schema for later, per the spec's "don't fake payment integration" rule. |
| 6 | Admin dashboard | ✅ Token-gated first-admin setup (no hard-coded credentials), bcrypt password hashing, signed-cookie sessions verified in Edge middleware protecting all of `/admin`, dashboard with live stats, full product CRUD, order list/detail with a validated status-transition state machine + tracking info, inventory adjustment with history, site settings editor. Audit log entries written for every mutating admin action. |
| 5 | Cart + checkout + orders | ⏳ not started |
| 6 | Admin dashboard | ⏳ not started |
| 7 | Email + WhatsApp notifications | ⏳ not started |
| 8 | Order tracking | ⏳ not started |
| 9 | Reviews + wishlist + coupons | ⏳ not started |
| 10 | SEO + performance + accessibility | ⏳ not started |
| 11 | Testing & bug fixing | ⏳ not started |
| 12 | Production deployment prep | ⏳ not started |

This is a large, multi-session build. Each phase will be delivered as working code you can review before moving to the next — not stubs claimed as "done."

## Why phase 1 looks like this

- `docs/01-ux-strategy.md` — the UX research/strategy that drives every later screen (homepage, PLP, PDP, checkout, tracking).
- `prisma/schema.prisma` — the full relational schema (30 models: catalog, cart, orders, inventory, notifications, reviews, returns, admin, site content) with the relationships and history/audit tables the spec requires (`OrderStatusHistory`, `InventoryHistory`, `ReturnStatusHistory`, `AuditLog`, `Notification` log).
- `tailwind.config.ts` — brand tokens (matte black/charcoal, warm ivory, restrained champagne gold, optional emerald) so Phase 2's design system has a real foundation instead of default Tailwind colors.
- `.env.example` — every credential the spec calls for, clearly split into client-safe (`NEXT_PUBLIC_*`) vs server-only, with no fake keys hard-coded anywhere.

## Local setup

1. `npm install` (runs `prisma generate` automatically via `postinstall`)
2. Create a Supabase project → copy `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` into `.env.local` (from `.env.example`)
3. `npx prisma migrate dev --name init` (this migration now includes the `OrderCounter` model added in Phase 5 — if you already ran `migrate dev` on the Phase 4 zip, this migration will add it without touching existing data)
4. `npx prisma db seed` (seed script ships in Phase 3, clearly marked demo data, easy to wipe)
5. `npm run dev` → http://localhost:3000

**Verified in this build:** the full app — homepage, PLP (with fabric filters + sort), PDP (with structured data, product-confidence blocks, related products), all storefront chrome, and every placeholder page — was type-checked with `tsc --noEmit` and put through a real `next build` (webpack compile + static/dynamic route analysis), confirmed to compile cleanly and correctly mark data-dependent routes as dynamic (`ƒ`) rather than frozen at build time. This required substituting a local type-and-behavior stub for `@prisma/client`, because this sandbox's network allowlist blocks `binaries.prisma.sh` (Prisma's own CLI needs to download a schema-engine binary from there for *any* command, including `generate`), which is unrelated to your Vercel/local setup and won't be an issue there.

Two things still need a real environment to confirm, since they need genuine network access this sandbox doesn't have: (a) `next/font` fetching Google Fonts at build time, (b) `prisma generate` downloading the real query engine. Both are standard `npm install` / `npm run build` steps that succeed automatically on Vercel or your own machine.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add every variable from `.env.example` in Vercel's Project Settings → Environment Variables (get real values from your Supabase project; leave Resend/WhatsApp/Cloudinary blank until you have them — the app degrades gracefully per the provider-interface design below).
4. Deploy. Vercel's build has normal internet access, so `next/font` and `prisma generate` will succeed there even though they couldn't be tested in the offline sandbox this was built in.

## Setting up your first admin account

1. Set `ADMIN_SETUP_TOKEN` and `SESSION_SECRET` (32+ random characters — `openssl rand -base64 32` works) in your environment.
2. Visit `/admin/setup`, enter the token plus your name/email/password. This route silently refuses once any admin account exists, so it can't be reused as a backdoor.
3. Log in at `/admin/login`.
4. From there: **Products** to add/edit catalog items (image upload is manual URL-paste for now — see note below), **Orders** to confirm/process/dispatch and add courier tracking, **Inventory** to adjust stock with a logged reason, **Settings** for shipping fee, WhatsApp number, and policy text.

**Product images right now:** the admin product form takes pasted image URLs (one per line) rather than drag-and-drop upload — real Supabase Storage/Cloudinary upload wiring is the remaining piece of Phase 3 (the `StorageProvider` interface in `src/server/storage/provider.ts` is ready for it, just not implemented against real credentials yet). Upload images to Supabase Storage or Cloudinary directly for now and paste the resulting URLs.

## Next step

Email + WhatsApp order notifications (Phase 7) are next — order status changes currently update silently with no customer-facing email or WhatsApp message. The `Notification` model and `WhatsAppProvider`/storage provider interfaces are already shaped for this. After that: reviews, wishlist persistence, and coupons (Phase 9), which still have UI placeholders only.

## Known tradeoffs to revisit later

- **Nav reads the cart-session cookie on every request** (for the live cart count), which forces *every* page — including static legal/FAQ placeholders — into dynamic rendering (`ƒ` instead of `○` in the build output). Fine at this scale; worth isolating into a client-fetched island if traffic grows enough that static legal pages' cacheability starts to matter.
- **No real payment beyond COD yet.** `PaymentMethod` enum and `Payment` model already have `BANK_TRANSFER`/`JAZZCASH`/`EASYPAISA`/`CARD`, but per the spec's rule against faking integrations, only COD is wired end-to-end until real provider credentials exist.
- **Checkout has no CSRF-specific token beyond Next's built-in Server Action origin checks** and no rate limiting yet — both called out as required in the spec's Security section, planned for a dedicated security pass rather than bolted on ad hoc. This applies equally to the new admin login form — brute-force protection isn't in yet.
- **Admin roles aren't enforced yet.** `AdminRole` (`SUPER_ADMIN`/`ADMIN`/`STAFF`) exists on the model and the session token carries it, but every admin page currently treats any authenticated admin the same — no page yet checks role before allowing an action. Fine with one store owner, needs addressing before adding staff accounts with restricted permissions.

## Credentials I do not have and will not fake

Per the project spec, integrations without provided credentials are implemented behind clean interfaces (a `NotificationProvider`, `StorageProvider`, `WhatsAppProvider` abstraction) so manual fallback (e.g. manual WhatsApp message copy, Admin-entered tracking links) always works, and the real integration activates the moment you add:
- Supabase project keys
- Resend API key
- WhatsApp Cloud API phone number ID + access token
- Cloudinary keys (if you choose Cloudinary over Supabase Storage)


