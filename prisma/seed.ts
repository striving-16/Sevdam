import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const db = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? 'admin@example.com'
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'ChangeMe123!'

  const existing = await db.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin already exists: ${email}`)
    return
  }

  const passwordHash = await hash(password, 12)
  await db.adminUser.create({
    data: { email, passwordHash, role: 'ADMIN' },
  })

  console.log('─────────────────────────────────')
  console.log('Admin user created:')
  console.log(`  Email:    ${email}`)
  console.log(`  Password: ${password}`)
  console.log('─────────────────────────────────')
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
