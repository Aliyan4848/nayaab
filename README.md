# NAYAAB — Premium Pakistani Women's Unstitched Fashion

Full-stack ecommerce platform: Next.js (TypeScript, App Router) · Tailwind CSS · PostgreSQL/Supabase · Prisma · Resend · WhatsApp Cloud API.

## Build status (phased, per project plan)

| Phase | Scope | Status |
|---|---|---|
| 1 | Research + architecture + database design | ✅ `docs/01-ux-strategy.md`, `prisma/schema.prisma` |
| 2 | Design system + UX structure | ✅ Button, ProductCard, Layout primitives (`src/components/ui`), storefront chrome (`src/components/storefront`) |
| 3 | Database + auth + storage | 🟡 Prisma client singleton + storage/WhatsApp provider interfaces done; auth and real upload implementations not started |
| 4 | Customer storefront | 🟡 homepage built with placeholder data; PLP/PDP/search/wishlist pages not started |
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
3. `npx prisma migrate dev --name init`
4. `npx prisma db seed` (seed script ships in Phase 3, clearly marked demo data, easy to wipe)
5. `npm run dev` → http://localhost:3000

**Verified in this build:** `npm install`, `npm run build` (TypeScript + webpack compile) all pass. The only things that don't run in the *sandbox this was built in* (no general internet access) are (a) fetching Google Fonts at build time and (b) downloading Prisma's query-engine binary — both are normal `npm install`/`npm run build` steps that work automatically on Vercel or your own machine, which have full internet access.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add every variable from `.env.example` in Vercel's Project Settings → Environment Variables (get real values from your Supabase project; leave Resend/WhatsApp/Cloudinary blank until you have them — the app degrades gracefully per the provider-interface design below).
4. Deploy. Vercel's build has normal internet access, so `next/font` and `prisma generate` will succeed there even though they couldn't be tested in the offline sandbox this was built in.

## Credentials I do not have and will not fake

Per the project spec, integrations without provided credentials are implemented behind clean interfaces (a `NotificationProvider`, `StorageProvider`, `WhatsAppProvider` abstraction) so manual fallback (e.g. manual WhatsApp message copy, Admin-entered tracking links) always works, and the real integration activates the moment you add:
- Supabase project keys
- Resend API key
- WhatsApp Cloud API phone number ID + access token
- Cloudinary keys (if you choose Cloudinary over Supabase Storage)

## Next step

Phase 3 finish (Supabase auth + real storage upload implementation) and Phase 4 (Product Listing Page + Product Detail Page wired to real Prisma queries instead of `src/lib/sample-data.ts`) are next. Let me know if you'd rather I prioritize the admin panel (Phase 6) or checkout (Phase 5) sooner — the storefront shell is now in a state where any of those can slot in.
