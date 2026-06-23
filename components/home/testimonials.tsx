import { getTestimonials } from '@/actions/testimonial-actions'
import { TestimonialsList } from './testimonials-list'

export async function Testimonials() {
  const quotes = await getTestimonials().catch(() => [])
  if (quotes.length === 0) return null
  return <TestimonialsList quotes={quotes} />
}
