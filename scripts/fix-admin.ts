import 'dotenv/config'
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
  const email = 'besmasevdam@gmail.com'
  const password = 'Besma2025!'
  const passwordHash = await hash(password, 12)

  const admin = await db.adminUser.upsert({
    where:  { email },
    create: { email, passwordHash, role: 'ADMIN' },
    update: { passwordHash, role: 'ADMIN' },
  })

  console.log('✓ Admin upserted:', admin.email)
}

main()
  .catch(console.error)
  .finally(async () => { await db.$disconnect(); await pool.end() })
