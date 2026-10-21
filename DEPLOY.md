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

### Why this exists

**Confirmed in the Supabase dashboard: this project is on the Free plan,
which includes NO project backups at all** — not daily, not PITR.
Supabase's own words: "Free Plan does not include project backups. Upgrade
to the Pro Plan for up to 7 days of scheduled backups." Until you upgrade
or this changes, **the scripts in this section are the only backup
mechanism this project has.**

### What gets backed up

The schema is 8 tables (see `prisma/schema.prisma` for the authoritative
definition): `Category`, `Product`, `Variant`, `Customer`, `Order`,
`OrderItem`, `AdminUser`, `Testimonial` — plus Cloudinary-hosted product/
shade images, which the database only stores URLs for (a DB backup alone
does **not** back up the actual photos).

We tried the "proper" route first — the Supabase CLI's `db dump`, which
wraps `pg_dump` — but it requires Docker or Podman, and setting either up
on this machine would mean installing WSL2 first (likely a restart). Given
that cost for a store this size, we used a logical (row-level JSON) backup
instead: equivalent for disaster recovery, zero new system dependencies.

```bash
npm run backup:db
# → backups/<timestamp>/{Category,...,Testimonial}.json
# → backups/<timestamp>/_manifest.json           (row counts + git commit)
# → backups/<timestamp>/schema/schema.prisma      (schema snapshot)
# → backups/<timestamp>/schema/migrations/        (full migration history snapshot)
```

Read-only against the database — issues `SELECT * FROM "<table>"` per
table, nothing else. The schema is snapshotted alongside the data so each
backup folder is self-contained: you don't need to separately track down
which git commit's `prisma/schema.prisma` matches a given backup.

```bash
npm run backup:cloudinary -- backups/<timestamp-folder>
# → backups/<timestamp>/cloudinary/*.{jpg,png,...} + _manifest.json
```

Downloads every asset under `store/products` (read-only against
Cloudinary — never deletes or modifies). Verified against the live
account: Free plan, ~88 objects, ~179 MB, 0.18/25 monthly credits used at
time of writing — plenty of headroom.

### Keeping backups safe

- The output directory is gitignored (`/backups/`) — **never commit it.**
- `AdminUser.json` contains password **hashes** (bcrypt, not plaintext) —
  still sensitive, since a hash is something to protect even though it
  isn't directly usable. `Customer.json`/`Order.json` contain real names,
  phone numbers, addresses.
- Treat any backup folder you keep around (locally or uploaded somewhere)
  as sensitive: store it encrypted at rest, don't email it, don't put it
  in a shared/public cloud folder without encryption.
- The scheduled workflow below (§5c) encrypts the backup with a passphrase
  before it ever leaves the GitHub Actions runner.

### Restore — two tiers

**1. Quick drill (same database, zero risk)** — proves a backup is
structurally restorable without ever touching real data: restores every
table into a throwaway Postgres schema (`restore_drill_<timestamp>`),
verifies row counts match, then drops the schema.

```bash
npm run restore:drill -- backups/<timestamp-folder>
```

Run successfully against the live database as part of this audit — all 8
tables restored with exact matching row counts, schema cleanly dropped
after. This is **not** a "restore into production" tool, and never touches
the real `public` schema.

**2. Full restore drill (separate Supabase project)** — the real test of
"can this store be stood back up from nothing but a backup folder." This
needs a project only you can create:

1. In your Supabase dashboard, create a **new, separate, free-tier
   project** — just for this test, delete it afterward.
2. Copy its connection string (Settings → Database → Connection string,
   **session pooler**, port 5432).
3. In your own terminal (never paste the connection string into chat):
   ```bash
   RESTORE_TARGET_URL="postgres://...your-new-test-project..." \
     npm run restore:new-project -- backups/<timestamp-folder>
   ```
4. This rebuilds the schema from scratch using the backup's own
   snapshotted migration files, then loads every row, then verifies row
   counts against the backup's manifest.

**Safety guard, already tested**: the script refuses to run if
`RESTORE_TARGET_URL` resolves to the same host as this project's own
`DATABASE_URL`/`DIRECT_URL` — confirmed by deliberately pointing it at
production, which it correctly rejected before making any connection to
the target at all. It is not possible to accidentally point this at your
live store.

If a real disaster ever requires restoring **production** itself (not a
drill), that's a manual, supervised action — recreate the tables from a
backup folder's migrations + JSON, or use Supabase's own PITR/backup
restore if you've upgraded to a plan that includes it — deliberately not
automated into a script that could run unattended against live data.

### Scheduling — keep this from depending on anyone remembering

A backup that only runs when someone remembers to run it is a weak safety
net. `.github/workflows/backup.yml` runs both backup scripts daily via
GitHub Actions (free for this usage level), encrypts the result, and
uploads it to Backblaze B2 (S3-compatible, 10GB free tier — genuinely
outside both Supabase and GitHub). To activate it, add these repo secrets
(Settings → Secrets and variables → Actions) — **none of these should ever
be pasted into chat or committed**:

| Secret | Where to get it |
|---|---|
| `DATABASE_URL` | Same value as your local `.env.local` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Same as `.env.local` |
| `BACKUP_ENCRYPTION_PASSPHRASE` | A new, long random passphrase — generate one, store it in a password manager. Losing this means losing the ability to decrypt backups, so keep it somewhere durable. |
| `B2_ACCOUNT_ID` / `B2_APPLICATION_KEY` / `B2_BUCKET_NAME` | Create a free Backblaze B2 account, create a bucket, create an "application key" scoped to just that bucket |

Without these secrets configured, the workflow will fail at the relevant
step — it won't silently skip or do something unexpected. The workflow
file is in the repo now but inert until you add the secrets.

### Suggested cadence outside the automated schedule

Run both backup scripts manually before any risky change (schema
migration, bulk admin edit) even with the daily schedule running — belt
and suspenders for anything deliberately risky.

## 6. Monitoring

### Sentry

Wired into the Next.js 16 instrumentation convention (`instrumentation.ts`
+ `instrumentation-client.ts`), gated by `enabled: !!dsn`.

**Status: DSN set in local `.env.local` and verified working in dev** —
a temporary route was added that deliberately threw, hit once, and the
Sentry debug logger confirmed `Captured error event` → `Flushing
events...` → `Done flushing events` with no transport errors, using the
real DSN. The test route was then deleted and the temporary debug flag
reverted (see git history for the exact before/after). **Still needed:**
check the Sentry dashboard for a "Sentry verification test — <timestamp>"
issue to get the final human confirmation that it was received, not just
sent — and set `NEXT_PUBLIC_SENTRY_DSN` in **Vercel's** Environment
Variables too, since `.env.local` only affects local dev.

Source maps / release tracking (`withSentryConfig`) are not yet wired up —
needs a Sentry org/project slug + auth token, deliberately deferred until
production use justifies the extra build complexity.

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
