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
npm run build                # production build (Turbopack) — green after clean reinstall, see Task 1
npm start                    # after a successful build
npx eslint .                 # lint — currently 10 errors / 15 warnings
```

There is **no test suite** in this repo (no `*.test.*`/`*.spec.*` files, no test runner configured). "Testing" = manual verification via `npm run dev` + browser, plus `npx eslint .` and `tsc` type-checking.

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
- `git status` is clean except one new untracked file: `scripts/create-testimonials-table.ts`.

## What's broken or incomplete

1. ~~`npm run build` fails under Turbopack~~ — **RESOLVED.** Root cause was a corrupted/stale `node_modules` and/or `.next` cache, not a real Next 16/Turbopack incompatibility: `Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'` while processing `next/font/google` in [app/layout.tsx](app/layout.tsx). A clean `rm -rf node_modules .next package-lock.json && npm install` fixed it — verified with two consecutive clean `npm run build` runs, both green with the default Turbopack bundler. No font/bundler code changes were needed. `package-lock.json` was regenerated (minor transitive bumps, e.g. Prisma 7.8.0 → 7.10.1 within the existing `^7.8.0` range; `package.json` itself is unchanged).

2. **Lint errors (10 errors, 15 warnings)** via `npx eslint .`, including real `react/no-unescaped-entities` and `react-hooks/set-state-in-effect` errors in:
   - [components/cart/cart-drawer.tsx:257](components/cart/cart-drawer.tsx#L257)
   - [components/checkout/checkout-form.tsx:242](components/checkout/checkout-form.tsx#L242)
   - [components/home/founder-story.tsx:105](components/home/founder-story.tsx#L105)
   - [components/layout/navbar.tsx:57](components/layout/navbar.tsx#L57)
   - [lib/i18n/context.tsx:40](lib/i18n/context.tsx#L40)
   - [components/admin/admin-sidebar.tsx:92](components/admin/admin-sidebar.tsx#L92) (warning-level `set-state-in-effect`)
   - Several `no-unused-vars` / `no-img-element` warnings in admin components.

3. **Untracked helper script duplicates a Prisma migration**: [scripts/create-testimonials-table.ts](scripts/create-testimonials-table.ts) manually runs the same `CREATE TABLE IF NOT EXISTS "Testimonial"` SQL that's already in [prisma/migrations/20260624000000_add_testimonials](prisma/migrations/20260624000000_add_testimonials). This looks like a manual fallback (probably because `prisma migrate deploy` isn't wired into the Vercel build command, so the migration never auto-applies in production). Needs a decision — see Q2.

4. **Dead/unused homepage components** — not imported anywhere in `app/` or `components/`:
   - `components/home/brand-statement.tsx`
   - `components/home/new-arrivals.tsx`
   - `components/home/routine-section.tsx`
   - `components/home/special-offers.tsx`
   - `components/home/category-filter.tsx`
   - `components/home/category-strip.tsx`
   - `components/home/featured-products.tsx`

5. **Empty leftover route folders** under `app/(shop)/products/` with no `page.tsx` inside (safe no-ops, but clutter): `cosmetics/`, `haircare/`, `korean-beauty/`, `skincare/`, `treatments/`, `(listing)/`, `[id]/`.

6. **Build-time DB connection pool exhaustion**: during `next build`, multiple admin pages (`AdminTestimonials`, `AdminProducts`) hit the DB concurrently during static optimization and log `(EMAXCONNSESSION) max clients reached in session mode — max clients are limited to pool_size: 15` against the Supabase pooler. Build still completes (pages are dynamic `ƒ`, not pre-rendered, so it's non-fatal), but it's a signal the Prisma client isn't using a pooled/pgbouncer-friendly connection string, or too many admin pages are forcing DB reads at build time.

## Task list (priority order)

1. [x] **Fix the production build** — fixed via clean reinstall (`node_modules`, `.next`, `package-lock.json` removed and reinstalled). `npm run build` now passes with the default Turbopack bundler. No font/bundler code changes needed.
2. [ ] **Decide on and resolve the duplicate testimonials-table script** (Task/Q2 below), then remove or formalize whichever approach isn't kept.
3. [ ] **Fix the 10 ESLint errors** (unescaped entities, `set-state-in-effect`) listed above — low-risk, mechanical fixes.
4. [ ] **Investigate the Supabase connection-pool exhaustion during build** — likely needs a build-time `DATABASE_URL` pointing at the pgbouncer/transaction-mode pooler port, or reducing concurrent DB calls during static generation.
5. [ ] Clean up the 7 dead/unused homepage components and the empty route folders (only after confirming with user — see "Don't delete without asking").
6. [ ] Clear the 15 remaining ESLint warnings (unused vars, `<img>` → `next/image`) as time allows.
7. [ ] Decide whether a test suite should be introduced at all, and if so, what to prioritize first (cart/checkout logic, server actions, or auth).

## Open questions

- **Q1 — Brand palette:** memory from an earlier session says the luxury redesign standardized on gold `#D4AF37` / ivory `#FDF8F3` / near-black `#1A1A18`, but the current homepage/testimonials code uses `#F7F5F2` / `#111111` / accent `#C7A98B`. Is this an intentional palette evolution, or should it be reconciled back to the original spec?
- **Q2 — `scripts/create-testimonials-table.ts`:** keep it as a permanent "run manually against prod if migrations didn't apply" utility, wire `prisma migrate deploy` into the actual build/deploy command instead, or just delete it since the migration file already covers the same SQL?
- **Q3 — Dead components:** confirm it's OK to delete the 7 unused `components/home/*` files and empty route folders listed above, or are any of them intended for upcoming work?
- **Q4 — Build fix approach:** for Task 1, is `next/font/local` (fully self-hosted, no network dependency) the preferred fix, or would you rather just pin `build`/`start` to `--webpack` and move on?
- **Q5 — Scope of "finish the project":** is there a specific feature list / checklist from you (beyond what's in the code) that defines "done," or should this task list above be treated as the full scope?

---
*Waiting for approval before making any code changes (Phase 2).*
