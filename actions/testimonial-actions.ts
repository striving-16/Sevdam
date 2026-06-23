'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

const testimonialSchema = z.object({
  text:      z.string().min(1),
  name:      z.string().min(1),
  role:      z.string().min(1),
  stars:     z.coerce.number().int().min(1).max(5).default(5),
  sortOrder: z.coerce.number().int().default(0),
})

export type TestimonialInput = z.infer<typeof testimonialSchema>

export async function getTestimonials() {
  return db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function createTestimonial(input: TestimonialInput) {
  await requireAdmin()
  const data = testimonialSchema.parse(input)
  await db.testimonial.create({ data })
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>) {
  await requireAdmin()
  const data = testimonialSchema.partial().parse(input)
  await db.testimonial.update({ where: { id }, data })
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  await db.testimonial.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
}
