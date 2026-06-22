'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Customer } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

export async function getCustomers(): Promise<Customer[]> {
  await requireAdmin()
  return db.customer.findMany({
    orderBy: { createdAt: 'desc' },
  }) as Promise<Customer[]>
}

export async function getCustomerCount(): Promise<number> {
  await requireAdmin()
  return db.customer.count()
}
