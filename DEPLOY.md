# Deployment & Operations Guide — Besma Sevdam

This document covers setup, environment variables, migrations, deployment
verification, backups, recovery, and rollback. **It never contains actual
secret values** — only variable names and what they're for. Actual values
live in `.env.local` (local dev, gitignored) and the Vercel project's
Environment Variables dashboard (production).

## Stack

Next.js 16 (App Router, Turbopack) · Prisma 7 + `@prisma/adapter-pg` over a
raw `pg.Pool` · Supabase-hosted Postgres · NextAuth v5 (Credentials) ·
Cloudinary (server-side image uploads) · Vercel (hosting) · WhatsApp-based
checkout handoff (no payment gateway).

## 1. Setup

```bash
npm install
cp .env.local.example .env.local   # fill in real values, never commit this file
npx prisma generate                 # also runs automatically via postinstall
npm run dev
```

## 2. Environment variables

| Variable | Public/Secret | Purpose |
|---|---|---|
| `DATABASE_URL` | Secret | Postgres connection string (Supabase **transaction pooler**, port 6543) — used by the running app |
| `DIRECT_URL` | Secret | Postgres connection string (Supabase **session pooler**, port 5432) — used by Prisma CLI for migrations |
| `AUTH_SECRET` | Secret | NextAuth v5 session/JWT signing key — read implicitly by Auth.js, no code references it directly |
| `CLOUDINARY_CLOUD_NAME` | Secret | Cloudinary account identifier (kept server-only alongside the key/secret below) |
| `CLOUDINARY_API_KEY` | Secret | Cloudinary API authentication |
| `CLOUDINARY_API_SECRET` | Secret | Cloudinary API authentication — never expose client-side |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL — used for `metadataBase`, OG tags, sitemap, robots |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Public | `"true"`/`"false"` — gates whether `robots` meta/`robots.txt` allow search engine indexing |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | WhatsApp number used in checkout confirmation + contact links (customer-facing by design) |
| `NEXT_PUBLIC_TIKTOK_URL` / `NEXT_PUBLIC_FACEBOOK_URL` / `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_SNAPCHAT_URL` | Public | Optional social links shown in the footer |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | Sentry ingestion endpoint — DSNs are designed to be public (write-only), unlike API keys. Currently **unset** — see §6 |
| `SENTRY_DSN` | Public | Server-side fallback if you ever want a different DSN for server vs. client; optional, falls back to `NEXT_PUBLIC_SENTRY_DSN` if unset |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Secret | Only read by `prisma/seed.ts` to create the first admin account. Not needed by the running app — fine to omit from Vercel once the real admin account exists in the DB |

Set all of these in **Vercel → Project → Settings → Environment Variables**
for Production (and Preview, if you want preview deployments to hit a real
or separate DB). Never paste real values into chat, commit messages, or
code comments.

## 3. Database migrations

Pattern established and used safely throughout this project's history —
**do not use `prisma migrate dev` against the production database**; it
runs shadow-database drift detection that can suggest a destructive reset.

Safe sequence for a schema change:
1. Write `prisma/migrations/<timestamp>_<name>/migration.sql` by hand.
2. Apply it directly with a small `pg.Pool` script (check
   `information_schema.columns`/`tables` first so it's idempotent).
3. Reconcile Prisma's bookkeeping: `npx prisma migrate resolve --applied <timestamp>_<name>`.
4. `npx prisma generate`.
5. Confirm: `npx prisma migrate status` → should say "Database schema is up to date!".

Verify no data was touched by comparing row counts before/after, same as
the backup drill in §5 does automatically.

## 4. Deploying

- `npm run build` must pass locally first (`next build`, Turbopack).
- Vercel auto-deploys on push to the connected branch. `postinstall` runs
  `prisma generate` automatically — no manual step needed on Vercel.
- After a deploy, verify:
  - Homepage, `/products`, a product detail page, `/checkout`, `/admin` (login-gated) all load.
  - `curl -I https://<your-domain>/admin/orders` (no cookie) returns a redirect to `/login`, not a 200 with data.
  - `/sitemap.xml` and `/robots.txt` resolve and reflect `NEXT_PUBLIC_ALLOW_INDEXING`.

## 5. Backups & recovery

### Database

**Confirmed in the Supabase dashboard (2026-10-21): this project is on the
Free plan, which includes NO project backups at all** — not daily, not
PITR. Supabase's own words: "Free Plan does not include project backups.
Upgrade to the Pro Plan for up to 7 days of scheduled backups." Pro adds
daily backups retained ~7 days; PITR is a further add-on above that.

**This means the scripts below are currently the only backup mechanism
this project has.** A manual script that only runs when someone remembers
to run it is a weak safety net — strongly consider either upgrading to
Supabase Pro, or scheduling `backup:db` + `backup:cloudinary` to run
automatically (e.g. a GitHub Action or Vercel Cron Job on a daily
schedule, uploading the output somewhere durable like S3/Backblaze —
not inside this repo).

Independent of that, this repo includes its own logical backup, since
`pg_dump`/`psql` aren't guaranteed to be installed everywhere this project
is operated from:

```bash
npm run backup:db
# → backups/<timestamp>/{Category,Product,Variant,Customer,Order,OrderItem,AdminUser,Testimonial}.json
```

This is read-only against the database. The output directory is gitignored
(`/backups/`) — it contains real customer data and `AdminUser` password
**hashes** (not plaintext, but still sensitive). Store exported backups
somewhere secure (encrypted drive, password manager's file storage, etc.),
never in git or chat.

**Restore drill** — proves a backup is actually restorable without ever
touching real data (restores into a throwaway Postgres schema, verifies
row counts, then drops the schema):

```bash
npm run restore:drill -- backups/<timestamp-folder>
```

This has been run successfully against the live database as part of this
audit — all 8 tables restored with exact matching row counts, then cleaned
up. It is **not** a "restore into production" tool. If a real disaster
ever requires restoring production data, that is a manual, supervised
action (recreate the tables from the JSON backup, or use Supabase's own
PITR/backup restore if your plan includes it) — deliberately not automated
into a one-command script that could be run unattended against live data.

### Cloudinary assets

Database rows store Cloudinary URLs, not the images themselves — a DB
backup alone does not back up product photos. Use:

```bash
npm run backup:cloudinary -- backups/<timestamp-folder>
# → backups/<timestamp>/cloudinary/*.{jpg,png,...} + _manifest.json
```

Downloads every asset under `store/products` to a local folder (read-only
against Cloudinary — never deletes or modifies). Verified against the live
account: free-tier plan, ~88 objects, ~179 MB, 0.18/25 monthly credits used
at time of writing — plenty of headroom, no action needed there yet.

### Suggested cadence

Run both backup scripts together before any risky change (migration,
bulk admin edit) and on a regular schedule (weekly is reasonable at this
data volume). They take seconds to run and cost nothing beyond Cloudinary
API credits (negligible per the usage above).

## 6. Monitoring

### Sentry

Already wired into the correct Next.js 16 instrumentation convention
(`instrumentation.ts` + `instrumentation-client.ts`), gated by
`enabled: !!dsn` — **fully inert with no DSN set**, which is the current
state (`NEXT_PUBLIC_SENTRY_DSN` is empty). To turn it on:

1. Create a Sentry project (sentry.io), get its DSN.
2. Set `NEXT_PUBLIC_SENTRY_DSN` in Vercel (and `.env.local` for dev).
3. **Controlled verification test** — after deploying with a real DSN, hit
   a route that deliberately throws (or temporarily add one), confirm the
   error appears in the Sentry dashboard, then remove the test route. Do
   not consider Sentry "working" without having seen a real event land —
   the gating logic being correct is not the same as proof it reports.
4. Source maps / release tracking (`withSentryConfig`) are not yet wired
   up — needs a Sentry org/project slug + auth token, deliberately deferred
   until the basic DSN path is confirmed working.

### Vercel Analytics

`<Analytics />` from `@vercel/analytics/next` is cookieless and only
auto-tracks pageviews (path, referrer, coarse location from IP). Confirmed
by code review: **no custom `track()` calls anywhere in the codebase** —
nothing sends customer name, phone, address, or order contents to
Analytics. No action needed.

## 7. Rollback

- **App code**: Vercel keeps every deployment — use "Promote to Production"
  on a previous deployment in the Vercel dashboard for an instant rollback.
  No rebuild needed.
- **Database migrations**: there is no automatic down-migration tooling
  here. Roll back by hand-writing the inverse `migration.sql` (e.g. `DROP
  COLUMN` for an `ADD COLUMN`), following the same safe-apply sequence in
  §3. Never run a destructive rollback against production without taking a
  backup first (§5) and explicit approval.

## 8. Known limitations on current free plans

- **Supabase (Free)**: confirmed **zero built-in backups** — no daily
  snapshots, no PITR. This project's own `backup:db`/`backup:cloudinary`
  scripts are the only safety net until you either upgrade to Pro or
  automate those scripts on a schedule (see §5).
- **Cloudinary (Free)**: 25 monthly credits, usage currently negligible
  (~0.18/25). No automatic versioning/trash — this project's own
  `deleteProductImage` calls are the only deletion path, and
  `scripts/backup-cloudinary.ts` is the only backup path.
- **Vercel**: confirm your plan's bandwidth/build-minute limits if traffic
  grows; not verified as part of this audit.
