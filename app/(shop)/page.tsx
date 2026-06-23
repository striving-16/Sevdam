import { Hero }           from '@/components/home/hero'
import { BrandMarquee }   from '@/components/home/brand-marquee'
import { CategoryStrip }  from '@/components/home/category-strip'
import { BrandStatement } from '@/components/home/brand-statement'
import { BestSellers }    from '@/components/home/best-sellers'
import { NewArrivals }    from '@/components/home/new-arrivals'
import { FounderStory }   from '@/components/home/founder-story'
import { Testimonials }   from '@/components/home/testimonials'
import { getFeaturedProducts } from '@/actions/product-actions'
import type { Product } from '@/types'

export default async function HomePage() {
  let products: Product[] = []
  try {
    products = await getFeaturedProducts(4)
  } catch {
    /* DB not yet connected — demo products render as fallback */
  }

  return (
    <>
      <Hero />
      <BrandMarquee />
      <CategoryStrip />
      <BrandStatement />
      <BestSellers products={products} />
      <NewArrivals />
      <FounderStory />
      <Testimonials />
    </>
  )
}
