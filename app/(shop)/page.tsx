import { Hero }              from '@/components/home/hero'
import { BrandMarquee }      from '@/components/home/brand-marquee'
import { BestSellers }       from '@/components/home/best-sellers'
import { FounderStory }      from '@/components/home/founder-story'
import { Offers }            from '@/components/home/offers'
import { NewArrivals }       from '@/components/home/new-arrivals'
import { Testimonials }      from '@/components/home/testimonials'
import { getFeaturedProducts, getOfferProducts, getNewArrivals } from '@/actions/product-actions'
import type { Product } from '@/types'

/*
  Section visibility rules:
  - Best Sellers  → products with isBestseller: true (+ in stock)
  - Special Offers → products with isOffer: true
  - New Arrivals  → 4 most recently added products
  - Collections   → ALL products, always (no filter)
  Each section hides itself when it has no products.
*/

export default async function HomePage() {
  let featured:    Product[] = []
  let offers:      Product[] = []
  let newArrivals: Product[] = []

  try {
    ;[featured, offers, newArrivals] = await Promise.all([
      getFeaturedProducts(4),
      getOfferProducts(4),
      getNewArrivals(4),
    ])
  } catch {
    // DB unavailable — sections hide themselves when empty
  }

  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Brand Marquee */}
      <BrandMarquee />

      {/* 3 — Best Sellers: isBestseller: true products only */}
      <BestSellers products={featured} />

      {/* 4 — Founder Story */}
      <FounderStory />

      {/* 5 — Special Offers: isOffer: true products only */}
      <Offers products={offers} />

      {/* 6 — New Arrivals: 4 most recently created products */}
      <NewArrivals products={newArrivals} />

      {/* 7 — Testimonials */}
      <Testimonials />
    </>
  )
}
