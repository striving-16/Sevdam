/**
 * Proves a backup produced by backup-database.ts is actually restorable,
 * WITHOUT ever touching real data. Restores every table into a throwaway
 * Postgres schema (restore_drill_<timestamp>), verifies row counts match
 * the manifest, then drops the schema. Safe to run anytime, including
 * against the production database, because it never writes to `public`.
 *
 * This is deliberately NOT a "restore into production" tool — doing that
 * for real (after actual data loss) is a one-off, human-supervised DBA
 * action documented in DEPLOY.md, not something to automate into a script
 * someone could run unattended against live data.
 *
 * Usage: npx tsx scripts/restore-drill.ts backups/<timestamp-folder>
 */
import { config } from 'dotenv'
import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

config({ path: '.env.local' })
config()

const TABLES = ['Category', 'Product', 'Variant', 'Customer', 'Order', 'OrderItem', 'AdminUser', 'Testimonial'] as const

async function main() {
  const backupDir = process.argv[2]
  if (!backupDir) {
    console.error('Usage: npx tsx scripts/restore-drill.ts backups/<timestamp-folder>')
    process.exit(1)
  }

  const manifest = JSON.parse(readFileSync(join(backupDir, '_manifest.json'), 'utf8'))
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

  const schema = `restore_drill_${Date.now()}`
  console.log(`Creating throwaway schema: ${schema}`)
  await pool.query(`CREATE SCHEMA "${schema}"`)

  try {
    for (const table of TABLES) {
      const filePath = join(backupDir, `${table}.json`)
      const rows: Record<string, unknown>[] = JSON.parse(readFileSync(filePath, 'utf8'))

      // Clone the real table's structure (no data, no FKs) into the drill schema.
      await pool.query(`CREATE TABLE "${schema}"."${table}" AS TABLE "public"."${table}" WITH NO DATA`)

      if (rows.length > 0) {
        const columns = Object.keys(rows[0])
        const colList = columns.map((c) => `"${c}"`).join(', ')
        for (const row of rows) {
          const values = columns.map((c) => row[c])
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
          await pool.query(`INSERT INTO "${schema}"."${table}" (${colList}) VALUES (${placeholders})`, values)
        }
      }

      const { rows: countRows } = await pool.query(`SELECT COUNT(*)::int AS count FROM "${schema}"."${table}"`)
      const restoredCount = countRows[0].count
      const expectedCount = manifest.rowCounts[table]
      const ok = restoredCount === expectedCount
      console.log(`${ok ? '✓' : '✗'} ${table}: restored ${restoredCount}, expected ${expectedCount}`)
      if (!ok) throw new Error(`Row count mismatch for ${table}`)
    }
    console.log('\nRestore drill PASSED — backup is restorable.')
  } finally {
    console.log(`Dropping throwaway schema: ${schema}`)
    await pool.query(`DROP SCHEMA "${schema}" CASCADE`)
    await pool.end()
  }
}

main().catch((err) => { console.error('Restore drill FAILED:', err); process.exit(1) })
