import { Hero }              from '@/components/home/hero'
import { BrandMarquee }      from '@/components/home/brand-marquee'
import { BestSellers }       from '@/components/home/best-sellers'
import { FounderStory }      from '@/components/home/founder-story'
import { Offers }            from '@/components/home/offers'
import { NewArrivals }       from '@/components/home/new-arrivals'
import { Testimonials }      from '@/components/home/testimonials'
import { getFeaturedProducts, getOfferProducts } from '@/actions/product-actions'
import { DEMO_FEATURED, DEMO_NEW_ARRIVALS } from '@/lib/demo-products'
import type { Product } from '@/types'

export default async function HomePage() {
  let featured: Product[] = []
  let offers:   Product[] = []

  try {
    ;[featured, offers] = await Promise.all([
      getFeaturedProducts(4),
      getOfferProducts(4),
    ])
  } catch {
    featured = DEMO_FEATURED
    offers   = []
  }

  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Brand Marquee */}
      <BrandMarquee />

      {/* 3 — Best Sellers */}
      <BestSellers products={featured} />

      {/* 4 — Founder Story */}
      <FounderStory />

      {/* 5 — Offers (replaces category strip — hidden when no active offers) */}
      <Offers products={offers} />

      {/* 6 — New Arrivals */}
      <NewArrivals />

      {/* 7 — Testimonials */}
      <Testimonials />
    </>
  )
}
