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
  const email = 'admin@dreamshop.com'
  const password = 'Dreamshop2024!'

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
