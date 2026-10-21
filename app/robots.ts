import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOW_INDEXING
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/login'] }]
      : [{ userAgent: '*', disallow: '/' }], // no domain yet — stay out of search engines
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
