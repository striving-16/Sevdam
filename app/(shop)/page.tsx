import { Hero }           from '@/components/home/hero'
import { BrandMarquee }   from '@/components/home/brand-marquee'
import { BestSellers }    from '@/components/home/best-sellers'
import { FounderStory }   from '@/components/home/founder-story'
import { CategoryStrip }  from '@/components/home/category-strip'
import { NewArrivals }    from '@/components/home/new-arrivals'
import { Testimonials }   from '@/components/home/testimonials'
import { Newsletter }     from '@/components/home/newsletter'
import { getFeaturedProducts } from '@/actions/product-actions'
import { DEMO_FEATURED }  from '@/lib/demo-products'
import type { Product } from '@/types'

export default async function HomePage() {
  let products: Product[] = []
  try {
    products = await getFeaturedProducts(4)
  } catch {
    /* DB not yet connected — demo products render as fallback */
    products = DEMO_FEATURED
  }

  return (
    <>
      {/* 1 — Hero: full-screen campaign with founder + BS monogram */}
      <Hero />

      {/* 2 — Brand Marquee: trust signals + values */}
      <BrandMarquee />

      {/* 3 — Best Sellers: featured editorial product grid */}
      <BestSellers products={products} />

      {/* 4 — Founder Story: emotional brand narrative */}
      <FounderStory />

      {/* 5 — Shop by Category: luxury category navigation */}
      <CategoryStrip />

      {/* 6 — New Arrivals: latest drops editorial grid */}
      <NewArrivals />

      {/* 7 — Testimonials: trust and social proof */}
      <Testimonials />

      {/* 8 — Newsletter: join the beauty circle */}
      <Newsletter />
    </>
  )
}
