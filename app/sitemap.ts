import type { MetadataRoute } from 'next'
import { getProducts } from '@/actions/product-actions'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://besmasevdam.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => [])

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = [
    'skincare', 'haircare', 'perfumes', 'makeup',
    'bodycare', 'mencare', 'babycare', 'tools',
  ].map((slug) => ({
    url: `${BASE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  priority: 1.0, changeFrequency: 'daily'   },
    { url: `${BASE_URL}/products`,    priority: 0.9, changeFrequency: 'daily'   },
    { url: `${BASE_URL}/offers`,      priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${BASE_URL}/about`,       priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/contact`,     priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/returns`,     priority: 0.5, changeFrequency: 'monthly' },
  ]

  return [...staticUrls, ...categoryUrls, ...productUrls]
}
