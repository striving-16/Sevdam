# Besma Sevdam — Progress Report

## Project summary

**Besma Sevdam** is a luxury beauty/cosmetics ecommerce storefront (competing visually with Rhode Skin, Charlotte Tilbury, Fenty Beauty). Customers browse products/shades and check out via a **WhatsApp order flow** (no online payment) — orders are created in the DB and the customer finishes the order over WhatsApp. There's a full custom admin panel (products, variants/shades, categories, orders, customers, offers, testimonials, accounts, media).

**Stack**
- Next.js **16.2.9** (App Router) — note: this is a newer major version than typical training data; see `node_modules/next/dist/docs/` for current conventions (e.g. `proxy.ts` replaces `middleware.ts`, Turbopack is the default bundler).
- React 19.2, TypeScript, Tailwind CSS v4
- Prisma 7 + `@prisma/adapter-pg` (driver adapters) + `pg`, PostgreSQL (hosted on **Supabase**)
- NextAuth v5 (beta) — credentials login, JWT sessions, admin-only route protection
- Cloudinary (`next-cloudinary`) for image uploads
- Zustand (cart state), Sonner (toasts), Framer Motion, Radix UI primitives, `lucide-react`
- i18n: custom context-based implementation (`lib/i18n/`) supporting `en` / `fr` / `ar` (RTL for Arabic)

**Brand identity:** Cormorant Garamond italic display font + Inter/Tajawal body, gold `#D4AF37` / ivory `#FDF8F3` accents (see earlier memory notes — current layout uses a slightly different palette, `#F7F5F2` / `#111111` as base, gold accent `#C7A98B` in some components — worth reconciling, see Q1).

## How to run / build / test

```bash
npm install                 # postinstall runs `prisma generate`
npm run dev                 # starts dev server (Turbopack) — works fine
npm run build                # production build (Turbopack) — green
npm start                    # after a successful build
npx eslint .                 # lint — 0 errors, 14 warnings (cosmetic)
npx tsc --noEmit              # type check — clean
npm test                     # node --test — 18/18 passing
```

Test runner: Node's built-in `node --test` (zero new dependencies — a `vitest` install was attempted first but hit a real `@types/node` peer conflict against the project's pinned `^20`). Currently only covers `lib/color-extraction.ts` (hex validation, pixel-filtering math, manual-vs-suggested state transitions). No component/integration tests exist yet — UI flows are verified manually via `npm run dev` + Playwright-driven browser checks, not as committed automated tests.

Database: `.env.local` has a live Supabase `DATABASE_URL` + Cloudinary + NextAuth secrets already configured, so `npm run dev` connects to a real (shared/dev) database — be careful with destructive admin actions while testing.

## What's already done and working

- Full product catalog model: products, variants/shades (hex color + per-shade stock + image), categories, bestseller/offer flags, gallery images.
- Admin CRUD for products, variants, categories, orders, customers, offers, testimonials, accounts — all under `app/(admin)/admin/*` + `actions/*.ts` server actions.
- Auth: NextAuth v5 credentials provider (`lib/auth.ts`, `lib/auth-config.ts`), admin routes protected via `proxy.ts` (Next 16's replacement for `middleware.ts`), matcher `/admin/:path*`.
- Storefront: homepage (`app/(shop)/page.tsx`) composed of Hero → BrandMarquee → BestSellers → FounderStory → Offers → Testimonials, all with graceful empty/DB-unavailable fallbacks.
- Cart: Zustand store (`hooks/use-cart.ts`) + floating cart button + drawer, checkout form, WhatsApp hand-off (`lib/config.ts` → `whatsAppUrl()`).
- Dynamic testimonials (most recent commit `d319b89`): full CRUD wired end-to-end — `actions/testimonial-actions.ts` → `components/home/testimonials.tsx`/`testimonials-list.tsx` on the storefront, `app/(admin)/admin/testimonials/testimonials-panel.tsx` in admin. Looks functionally complete.
- Demo product fallback (`lib/demo-products.ts`) used across sitemap/category/product pages so the site still renders if the DB is briefly unreachable during build/deploy.
- i18n scaffolding for en/fr/ar with RTL support in the root layout.
- Mobile forms no longer trigger iOS Safari's auto-zoom (global 16px-on-mobile CSS rule).
- Product cards are consistently sized with aligned CTAs across all grids, with a fixed-height shade-swatch area and a fallback for missing images.
- Admin shade/variant editing is consolidated into one UI (`ShadeEditor` inside `ProductForm`) with SKU, a canvas-based color-suggestion feature (upload → suggested hex → manual correction → persists), and a "re-suggest" action. Storefront shade selection (image swap, cart, WhatsApp checkout) was already correct and is now fully covered end to end, including a fix for the cart-checkout WhatsApp message that previously dropped the selected shade.

## What's broken or incomplete

1. ~~`npm run build` fails under Turbopack~~ — **RESOLVED.** Root cause was a corrupted/stale `node_modules` and/or `.next` cache, not a real Next 16/Turbopack incompatibility: `Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'` while processing `next/font/google` in [app/layout.tsx](app/layout.tsx). A clean `rm -rf node_modules .next package-lock.json && npm install` fixed it — verified with two consecutive clean `npm run build` runs, both green with the default Turbopack bundler. No font/bundler code changes were needed. `package-lock.json` was regenerated (minor transitive bumps, e.g. Prisma 7.8.0 → 7.10.1 within the existing `^7.8.0` range; `package.json` itself is unchanged).

2. ~~Lint errors~~ — **RESOLVED.** All 10 ESLint errors fixed (0 errors, 15 warnings remain — see Task 6):
   - Unescaped entities in `cart-drawer.tsx`, `checkout-form.tsx`, `founder-story.tsx`, `app/(admin)/admin/offers/page.tsx`, `app/(shop)/about/page.tsx` → HTML entities (`&apos;`/`&quot;`/`&ldquo;`/`&rdquo;`).
   - `react-hooks/set-state-in-effect` in `navbar.tsx` and `admin-sidebar.tsx` (resetting a mobile-menu `open` state when the route changes) → replaced the effect with React's documented "adjust state during render" pattern (track `prevPathname` in state, compare and reset during render — no effect needed, no behavior change).
   - Same rule in `lib/i18n/context.tsx` (one-time localStorage hydration on mount) → deferred the `setState` into a `queueMicrotask` callback rather than restructuring; this is a one-time mount sync, not the cascading-render pattern the rule targets.

3. ~~Untracked helper script duplicates a Prisma migration~~ — **RESOLVED.** Diffed `scripts/create-testimonials-table.ts` against `prisma/migrations/20260624000000_add_testimonials/migration.sql` — SQL was byte-identical apart from indentation. Script deleted.

4. **Dead/unused homepage components** — not imported anywhere in `app/` or `components/`. Reviewed 2026-10-21; awaiting decision on which to wire in vs delete:
   - `components/home/brand-statement.tsx` — "Our Philosophy" 3-pillar editorial section. Finished, but hardcoded English (not i18n-wired).
   - `components/home/new-arrivals.tsx` — "New Drops" grid, i18n-aware, has its own demo-data fallback. Finished, drop-in ready.
   - `components/home/routine-section.tsx` — dark 3-step routine section, fully i18n-wired (en/fr/ar), RTL-aware. Finished, drop-in ready.
   - `components/home/special-offers.tsx` — 3-card offer grid. **Links to `/categories/skincare`, `/categories/haircare`, `/categories/perfumes` which don't match real category slugs** — needs real content before use.
   - `components/home/category-filter.tsx` — scrollable category pill nav, i18n-wired, RTL-aware. Finished, drop-in ready.
   - `components/home/category-strip.tsx` — 5-tile editorial category grid (Lips/Face/Eyes/Skincare/Accessories). Finished, hardcoded English.
   - `components/home/featured-products.tsx` — generic featured-products grid, i18n-wired. Finished but redundant with the already-wired `best-sellers.tsx`.

5. ~~Empty leftover route folders~~ — **RESOLVED.** Removed `cosmetics/`, `haircare/`, `korean-beauty/`, `skincare/`, `treatments/`, `(listing)/`, `[id]/` under `app/(shop)/products/` — all were empty (git never tracked them, so no commit needed for this).

6. ~~Build-time DB connection-pool exhaustion~~ — **FULLY RESOLVED (0 occurrences).**
   - Root cause #1: `app/(admin)/*` pages had no `dynamic` export, so Next.js speculatively tried to statically render them at build time — fixed with `export const dynamic = 'force-dynamic'` on [app/(admin)/layout.tsx](app/(admin)/layout.tsx). Dropped 16 → 1.
   - Root cause #2 (the remaining 1): `DATABASE_URL` was the Supabase **session-mode pooler** (port 5432, `pool_size: 15`) — wrong tool for a serverless app's many short-lived connections. Switched `DATABASE_URL` to the **transaction-mode pooler** (port 6543, `?pgbouncer=true`), which is what Supabase/Vercel actually recommend for this. Verified via Prisma + the driver adapter including array-typed columns, then a clean `npm run build` → **0** `EMAXCONNSESSION` occurrences.
   - `DIRECT_URL` (migrations only) is now the **session pooler** (IPv4) rather than the true direct host (`db.<ref>.supabase.co`, IPv6-only — unreachable from this sandbox and from Vercel, per the user). Exact connection strings and the manual `prisma migrate deploy` steps are in `DEPLOY.md` (Phase 9).

7. ~~Prisma migration-history drift~~ — **FULLY RESOLVED, and better news than first thought.** `prisma migrate diff` (read-only, DB vs. `schema.prisma`) showed **zero actual schema drift** — the live DB structurally matches the schema exactly. The real problem was narrower: `prisma migrate status` showed 6 of 7 migrations were never marked applied in the `_prisma_migrations` bookkeeping table (even though their SQL effects were clearly live) — meaning `prisma migrate deploy` would have tried to re-run `CREATE TABLE "Product"...` etc. against tables that already exist. Fixed by running `prisma migrate resolve --applied <name>` for each of the 6 (metadata-only, no SQL executed, no data touched — verified row counts identical before/after). `prisma migrate status` now reports "Database schema is up to date!" — safe to use `prisma migrate deploy` going forward.

## Production Readiness Plan (active, started 2026-10-21)

Full 9-phase plan agreed with the user. Status below; see git log for commit-by-commit detail.

- [x] **Emergency, out-of-order:** `actions/order-actions.ts` — `getOrders()`/`getOrderById()` had no admin check at all (anyone could list every order + customer PII). Fixed: both admin-gated; added a restricted `getOrderConfirmation()`/`getOrdersByPhone()` (no customer name/phone/address) for the public confirmation and `/track-order` pages. **False alarm, corrected:** `actions/admin-user-actions.ts` was NOT actually vulnerable — it uses a differently-named but equivalent guard (`getMyEmail()`), missed by an initial grep for the literal string `requireAdmin`. No change needed there.
- [x] **Phase 1 — Foundation.** Build/lint/types all green (done in the prior session). DB pooling corrected: `DATABASE_URL` → Supabase transaction pooler (6543, `pgbouncer=true`) — eliminated the last `EMAXCONNSESSION` occurrence entirely (1 → 0). `DIRECT_URL` → Supabase session pooler (IPv4), not the true direct host (IPv6-only, unreachable from Vercel per the user). Migration-history drift fully resolved: no actual schema drift existed (verified via `prisma migrate diff`); the real issue was 6 of 7 migrations never marked "applied" in Prisma's bookkeeping, which would have made `prisma migrate deploy` try to re-run already-applied `CREATE TABLE` statements. Fixed with `prisma migrate resolve --applied` per migration (metadata-only, verified no data change). `prisma migrate status` → "Database schema is up to date!".
- [x] **Phase 2 — Checkout creates real orders (critical). DONE.** `placeOrder` rewritten: server-side price/stock re-fetch (never trusts the client cart), variant-aware stock check/decrement, wrapped in `db.$transaction`, stores `variantId`/`variantName` per `OrderItem`. `updateOrderStatus` restores stock on cancel (variant or product, guarded against double-restore). `CheckoutForm` is now async with a disabled-while-pending button, a real error message on failure (stock/availability), and redirects to `/order-confirmation/[orderId]` on success instead of auto-opening WhatsApp. Confirmation page shows the order number and a manual "Send Order on WhatsApp" button (message includes order #, items+shades, delivery, total, and a `/track-order` link). Both `placeOrder` and `createAdminOrder` now upsert a `Customer` row (by phone) — **nothing in the codebase ever created Customer records before**, so `/admin/customers` was permanently empty regardless of real sales; fixed for both order-creation paths. Admin order-detail page was silently not displaying the shade name even though it was stored — fixed. Two unrelated pre-existing bugs found and fixed while testing this (neither caused by this session, both were simply never exercised before): `lib/config.ts` used `??` instead of `||`, so `NEXT_PUBLIC_WHATSAPP_NUMBER=` (empty string, not unset) silently defeated the fallback — every WhatsApp link sitewide pointed at `wa.me/` with no number; and `lib/i18n/context.tsx` exported `interpolate()` from a `'use client'` file, which crashes when called from a server component — moved to `lib/i18n/translations.ts`. Verified fully end-to-end with Playwright against the real dev DB: add a shaded product → checkout → stock decrements correctly → order appears in `/admin/orders` and `/admin/customers` → cancel in admin → stock restores to the exact original value → `/track-order` finds it without exposing name/phone/address. All test data cleaned up afterward.
- [ ] **Phase 3 — Security.** Order-actions gap already fixed above. Remaining: DB-backed login rate limiting (new migration: `AdminUser.failedAttempts`/`lockedUntil`), security headers in `next.config.ts`.
- [ ] **Phase 4a — Cover shade.** New: `Product.coverVariantId` migration + "Set as cover" UI + storefront default.
- [x] **Phase 4b — Shade color management.** Done in the prior session (canvas-based suggestion, manual correction, SKU, consolidated `ShadeEditor`, `colorSource` migration, tests).
- [x] **Phase 5 (partial) — mobile zoom fix and card uniformity** done in the prior session. Palette: user confirmed standardizing on the current live palette. Unused-component decision and loading/error-state audit still open.
- [ ] **Phase 6 — Domain/SEO.** Not started. Site URL answer pending (user to paste Vercel URL); indexing stays OFF until a real domain exists.
- [ ] **Phase 7 — Monitoring/analytics/legal.** Sentry (free tier, DSN via env var) + Vercel Analytics confirmed. Legal page content pending the user's country/business details.
- [ ] **Phase 8 — Quality.** 14 ESLint warnings remain. Testing stays on `node --test` (user confirmed, no new dependency) — needs expanding to cover `placeOrder` logic and admin-access checks once Phase 2/3 land.
- [ ] **Phase 9 — Launch checklist.** `DEPLOY.md` not yet written — needs the exact DB connection strings, manual `prisma migrate deploy` steps, env var list, and a documented manual Supabase backup method (pending the user's answer on what their Supabase dashboard currently shows under Backups).

## Session log

**2026-10-21 (session 2) — "3 improvements" task:** mobile input-zoom fix, consistent product-card sizing, and shade color management. See prior entry below for detail. All verified with Playwright, committed in order.

**2026-10-21 (session 3) — Production readiness plan kicked off.** Emergency order-actions.ts security fix (with one corrected false-positive on admin-user-actions.ts) committed first. Phase 1 completed: DB pooling corrected per user's exact answer (transaction pooler for runtime, session pooler for migrations) and the migration-history drift fully root-caused and resolved (bookkeeping-only fix, zero data touched, verified before/after). Phase 2 completed: checkout now creates real, variant-aware, server-priced orders in a transaction; cancel restores stock; Customer records now get created (previously never happened at all); confirmation page + WhatsApp message + admin order detail all fixed/completed; two unrelated pre-existing bugs (WhatsApp number env fallback, interpolate server/client crash) found and fixed along the way. Full flow verified end-to-end with Playwright, all test data cleaned up. Continuing to Phase 3 (security: rate limiting + headers) next.

---
*Next: Phase 3 — DB-backed login rate limiting (new migration) and security headers in `next.config.ts`.*
