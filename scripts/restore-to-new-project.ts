/**
 * Full restore drill against a genuinely SEPARATE Supabase project — unlike
 * restore-drill.ts (which restores into a throwaway schema inside the SAME
 * database as a quick sanity check), this rebuilds the schema from scratch
 * using the backup's own migration files and loads real data into the
 * target's public schema. This is the real test of "can I stand this store
 * back up from nothing but a backup folder."
 *
 * SAFETY: refuses to run if RESTORE_TARGET_URL resolves to the same host as
 * this project's own DATABASE_URL/DIRECT_URL — this script issues CREATE
 * TABLE + INSERT against the target's public schema, which would corrupt a
 * real database if pointed at production by mistake.
 *
 * Usage:
 *   1. Create a new, empty Supabase project (free tier) from your dashboard.
 *   2. Get ITS connection string (session pooler, port 5432).
 *   3. Run (in your own terminal — never paste that string into chat):
 *        RESTORE_TARGET_URL="postgres://..." npx tsx scripts/restore-to-new-project.ts backups/<timestamp-folder>
 */
import { config } from 'dotenv'
import { Pool } from 'pg'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

config({ path: '.env.local' })
config()

const TABLES = ['Category', 'Product', 'Variant', 'Customer', 'Order', 'OrderItem', 'AdminUser', 'Testimonial'] as const

function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

async function main() {
  const backupDir = process.argv[2]
  const targetUrl = process.env.RESTORE_TARGET_URL

  if (!backupDir || !targetUrl) {
    console.error('Usage: RESTORE_TARGET_URL="postgres://..." npx tsx scripts/restore-to-new-project.ts backups/<timestamp-folder>')
    process.exit(1)
  }

  const ownUrls = [process.env.DATABASE_URL, process.env.DIRECT_URL].filter(Boolean) as string[]
  const targetHost = hostOf(targetUrl)
  if (ownUrls.some((u) => hostOf(u) === targetHost)) {
    console.error(`REFUSING TO RUN: RESTORE_TARGET_URL's host (${targetHost}) matches this project's own database.`)
    console.error('This script writes directly to the target\'s public schema — it must only ever point at a separate, empty test project.')
    process.exit(1)
  }

  const manifest = JSON.parse(readFileSync(join(backupDir, '_manifest.json'), 'utf8'))
  const migrationsDir = join(backupDir, 'schema', 'migrations')
  const migrationFolders = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  const pool = new Pool({ connectionString: targetUrl, ssl: { rejectUnauthorized: false } })

  console.log(`Target: ${targetHost} (confirmed different from this project's own database)`)
  console.log(`Applying ${migrationFolders.length} migrations to rebuild schema from scratch...`)

  for (const folder of migrationFolders) {
    const sql = readFileSync(join(migrationsDir, folder, 'migration.sql'), 'utf8')
    await pool.query(sql)
    console.log(`  ✓ ${folder}`)
  }

  console.log('\nLoading data...')
  for (const table of TABLES) {
    const rows: Record<string, unknown>[] = JSON.parse(readFileSync(join(backupDir, `${table}.json`), 'utf8'))
    if (rows.length > 0) {
      const columns = Object.keys(rows[0])
      const colList = columns.map((c) => `"${c}"`).join(', ')
      for (const row of rows) {
        const values = columns.map((c) => row[c])
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
        await pool.query(`INSERT INTO "${table}" (${colList}) VALUES (${placeholders})`, values)
      }
    }
    const { rows: countRows } = await pool.query(`SELECT COUNT(*)::int AS count FROM "${table}"`)
    const restoredCount = countRows[0].count
    const expectedCount = manifest.rowCounts[table]
    const ok = restoredCount === expectedCount
    console.log(`  ${ok ? '✓' : '✗'} ${table}: restored ${restoredCount}, expected ${expectedCount}`)
    if (!ok) throw new Error(`Row count mismatch for ${table}`)
  }

  console.log('\nFull restore to separate project PASSED. This project is now a working copy of the backup.')
  console.log('Delete it from your Supabase dashboard once you\'re done verifying — it still contains real customer data.')
  await pool.end()
}

main().catch((err) => { console.error('Restore FAILED:', err); process.exit(1) })
