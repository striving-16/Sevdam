import { getTestimonials } from '@/actions/testimonial-actions'
import { TestimonialsPanel } from './testimonials-panel'

export const metadata = { title: 'Testimonials — Admin' }

export default async function AdminTestimonialsPage() {
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = []
  let dbError = false

  try {
    testimonials = await getTestimonials()
  } catch (err) {
    console.error('[AdminTestimonials] DB error:', err)
    dbError = true
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-light tracking-[-0.01em] text-neutral-800">Testimonials</h1>
        <p className="mt-1 text-[13px] font-light text-neutral-400">
          Manage the customer reviews shown on the homepage.
        </p>
      </div>

      {dbError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
          <p className="text-[14px] font-light text-red-600">Could not load testimonials — database error.</p>
        </div>
      ) : (
        <TestimonialsPanel testimonials={testimonials} />
      )}
    </div>
  )
}
