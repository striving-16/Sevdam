/**
 * One-time seed: creates a Category row for each of the 14 values already
 * in use by live products (previously a hardcoded MAKEUP_CATEGORIES array
 * in lib/validations.ts). Safe to re-run — uses upsert on the unique slug,
 * so it never duplicates or overwrites an admin's edits to an existing row.
 *
 * NOT applied automatically. Run only after the
 * 20261022010000_add_category_management_fields migration has been applied.
 *   npx tsx scripts/seed-categories.ts
 */
import { config } from 'dotenv'
import { db } from '../lib/db'

config({ path: '.env.local' })
config()

const LABELS: Record<string, string> = {
  FOUNDATION:    'Foundation',
  CONCEALER:     'Concealer',
  PRIMER:        'Primer',
  LIPSTICK:      'Lipstick',
  LIP_GLOSS:     'Lip Gloss',
  LIP_LINER:     'Lip Liner',
  BLUSH:         'Blush',
  EYESHADOW:     'Eyeshadow',
  MASCARA:       'Mascara',
  EYELINER:      'Eyeliner',
  SETTING_SPRAY: 'Setting Spray',
  HIGHLIGHTER:   'Highlighter',
  BRONZER:       'Bronzer',
  POWDER:        'Powder',
}

async function main() {
  let created = 0
  let skipped = 0
  for (const [slug, name] of Object.entries(LABELS)) {
    const existing = await db.category.findUnique({ where: { slug } })
    if (existing) { skipped++; continue }
    await db.category.create({ data: { slug, name, sortOrder: created } })
    created++
  }
  console.log(`Seed complete — created ${created}, skipped ${skipped} (already existed).`)
}

main()
  .catch((err) => { console.error(err); process.exit(1) })
  .finally(() => process.exit(0))
