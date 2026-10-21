/**
 * Logical backup of every app table to timestamped JSON files under /backups.
 * Read-only — never modifies the database. Run with: npx tsx scripts/backup-database.ts
 *
 * Why JSON instead of pg_dump: pg_dump/psql aren't installed in every
 * environment this runs from, and this project already depends on `pg` +
 * Prisma for every other DB script this session, so a plain SELECT * per
 * table needs nothing new. For disaster recovery of this app's data (not a
 * byte-for-byte Postgres cluster backup), row-level JSON is sufficient and
 * is what restore-database.ts expects.
 */
import { config } from 'dotenv'
import { Pool } from 'pg'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

config({ path: '.env.local' })
config()

const TABLES = ['Category', 'Product', 'Variant', 'Customer', 'Order', 'OrderItem', 'AdminUser', 'Testimonial'] as const

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const dir = join(process.cwd(), 'backups', stamp)
  mkdirSync(dir, { recursive: true })

  const manifest: Record<string, number> = {}

  for (const table of TABLES) {
    const { rows } = await pool.query(`SELECT * FROM "${table}"`)
    writeFileSync(join(dir, `${table}.json`), JSON.stringify(rows, null, 2))
    manifest[table] = rows.length
    console.log(`✓ ${table}: ${rows.length} rows`)
  }

  writeFileSync(join(dir, '_manifest.json'), JSON.stringify({ createdAt: new Date().toISOString(), rowCounts: manifest }, null, 2))
  console.log(`\nBackup written to: ${dir}`)
  console.log('Note: AdminUser.json contains password HASHES (not plaintext passwords) — still sensitive, keep this directory out of git (already gitignored) and store it securely.')

  await pool.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
