import 'server-only'
import { db } from '@/lib/db'
import * as Sentry from '@sentry/nextjs'

export type RateLimitResult = { allowed: boolean; retryAfterSeconds?: number }

/**
 * Serverless-safe rate limiting — backed by the shared Postgres database via
 * the RateLimitHit table, not in-memory counters. In-memory counters reset
 * per function instance on Vercel (every cold start, every separate
 * concurrent instance), so they don't actually limit anything in production;
 * this does, because every instance reads/writes the same table.
 *
 * Not perfectly race-proof under extreme concurrency (count-then-insert, not
 * a single atomic check-and-increment) — acceptable here because the
 * consequence of a rare extra hit slipping through is "slightly weaker rate
 * limiting," not a correctness/data-integrity failure like checkout's stock
 * check, which is why that one uses a real transaction and this doesn't.
 */
export async function checkRateLimit(
  key: string,
  opts: { max: number; windowMs: number }
): Promise<RateLimitResult> {
  try {
    const windowStart = new Date(Date.now() - opts.windowMs)

    const count = await db.rateLimitHit.count({
      where: { key, createdAt: { gte: windowStart } },
    })

    if (count >= opts.max) {
      const oldest = await db.rateLimitHit.findFirst({
        where: { key, createdAt: { gte: windowStart } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      })
      const retryAfterMs = oldest ? oldest.createdAt.getTime() + opts.windowMs - Date.now() : opts.windowMs
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) }
    }

    await db.rateLimitHit.create({ data: { key } })

    // Opportunistic cleanup — bounds table growth without needing a cron job.
    // Only runs occasionally so it doesn't add latency to every request.
    if (Math.random() < 0.02) {
      db.rateLimitHit
        .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - opts.windowMs * 10) } } })
        .catch(() => {})
    }

    return { allowed: true }
  } catch (err) {
    // Fail OPEN, not closed — a broken rate limiter (e.g. a migration that
    // hasn't been applied yet) must never take down the feature it's meant
    // to protect. Worst case without this: zero rate limiting temporarily.
    // Worst case without the fallback: the whole endpoint 500s instead.
    Sentry.captureException(err)
    return { allowed: true }
  }
}
