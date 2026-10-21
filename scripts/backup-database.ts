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
import { mkdirSync, writeFileSync, copyFileSync, cpSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

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

  // Snapshot the schema alongside the data — without this, restoring the
  // JSON later requires separately tracking down which git commit's
  // prisma/schema.prisma matches this backup. Self-contained is safer.
  const schemaDir = join(dir, 'schema')
  mkdirSync(schemaDir, { recursive: true })
  copyFileSync(join(process.cwd(), 'prisma', 'schema.prisma'), join(schemaDir, 'schema.prisma'))
  cpSync(join(process.cwd(), 'prisma', 'migrations'), join(schemaDir, 'migrations'), { recursive: true })

  let gitCommit: string | null = null
  try {
    gitCommit = execSync('git rev-parse HEAD', { cwd: process.cwd() }).toString().trim()
  } catch {
    // Not fatal — git may be unavailable in some environments.
  }

  writeFileSync(
    join(dir, '_manifest.json'),
    JSON.stringify({ createdAt: new Date().toISOString(), gitCommit, rowCounts: manifest }, null, 2)
  )
  console.log(`✓ schema: prisma/schema.prisma + migrations/ snapshotted${gitCommit ? ` (git ${gitCommit.slice(0, 8)})` : ''}`)
  console.log(`\nBackup written to: ${dir}`)
  console.log('Note: AdminUser.json contains password HASHES (not plaintext passwords) — still sensitive, keep this directory out of git (already gitignored) and store it securely.')

  await pool.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
