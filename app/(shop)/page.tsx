import { Hero }         from '@/components/home/hero'
import { BrandMarquee } from '@/components/home/brand-marquee'
import { BestSellers }  from '@/components/home/best-sellers'
import { FounderStory } from '@/components/home/founder-story'
import { Offers }       from '@/components/home/offers'
import { Testimonials } from '@/components/home/testimonials'
import { getFeaturedProducts, getOfferProducts } from '@/actions/product-actions'
import type { Product } from '@/types'

/*
  Homepage section rules:
  - Best Sellers  → isBestseller: true + in stock
  - Special Offers → isOffer: true
  - Collections (/products) → ALL products, always
  Each section hides itself when empty.
*/

export default async function HomePage() {
  let featured: Product[] = []
  let offers:   Product[] = []

  try {
    ;[featured, offers] = await Promise.all([
      getFeaturedProducts(4),
      getOfferProducts(4),
    ])
  } catch {
    // DB unavailable — sections hide themselves when empty
  }

  return (
    <>
      <Hero />
      <BrandMarquee />
      <BestSellers products={featured} />
      <FounderStory />
      <Offers products={offers} />
      <Testimonials />
    </>
  )
}
