/**
 * Downloads every product/shade image from Cloudinary into the matching
 * backups/<timestamp>/cloudinary/ folder, alongside the database JSON
 * backup from backup-database.ts. Read-only against Cloudinary — only
 * lists and downloads, never deletes or modifies anything.
 *
 * Usage: npx tsx scripts/backup-cloudinary.ts backups/<timestamp-folder>
 */
import { config } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

config({ path: '.env.local' })
config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function main() {
  const backupDir = process.argv[2]
  if (!backupDir) {
    console.error('Usage: npx tsx scripts/backup-cloudinary.ts backups/<timestamp-folder>')
    process.exit(1)
  }
  const outDir = join(backupDir, 'cloudinary')
  mkdirSync(outDir, { recursive: true })

  let nextCursor: string | undefined
  let total = 0
  const manifest: { public_id: string; secure_url: string; bytes: number }[] = []

  do {
    const page = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'store/products',
      max_results: 500,
      next_cursor: nextCursor,
    })

    for (const resource of page.resources) {
      const res = await fetch(resource.secure_url)
      const buffer = Buffer.from(await res.arrayBuffer())
      const filename = resource.public_id.replace(/\//g, '_') + '.' + resource.format
      writeFileSync(join(outDir, filename), buffer)
      manifest.push({ public_id: resource.public_id, secure_url: resource.secure_url, bytes: resource.bytes })
      total++
    }

    nextCursor = page.next_cursor
  } while (nextCursor)

  writeFileSync(join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`✓ Downloaded ${total} Cloudinary assets to ${outDir}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
