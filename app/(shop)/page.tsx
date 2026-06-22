import { Hero } from '@/components/home/hero'
import { TrustBar } from '@/components/home/trust-bar'
import { CategoryStrip } from '@/components/home/category-strip'
import { BestSellers } from '@/components/home/best-sellers'
import { Testimonials } from '@/components/home/testimonials'
import { getFeaturedProducts } from '@/actions/product-actions'

export default async function HomePage() {
  const products = await getFeaturedProducts(12)

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryStrip />
      <BestSellers products={products} />
      <Testimonials />
    </>
  )
}
