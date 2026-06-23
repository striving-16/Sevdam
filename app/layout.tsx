import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond, Tajawal } from 'next/font/google'
import { cookies } from 'next/headers'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/translations'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  weight: ['200', '300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Besma Sevdam — Luxury Beauty & Cosmetics',
    template: '%s | Besma Sevdam',
  },
  description:
    'Besma Sevdam — A luxury beauty brand crafting premium makeup, skincare, and cosmetics for the confident modern woman.',
  keywords: ['luxury beauty', 'makeup', 'skincare', 'cosmetics', 'foundation', 'lipstick', 'Besma Sevdam'],
  openGraph: {
    type: 'website',
    siteName: 'Besma Sevdam',
    title: 'Besma Sevdam — Luxury Beauty & Cosmetics',
    description: 'Premium beauty crafted for confidence, elegance, and timeless luxury.',
  },
}

const VALID_LOCALES: Locale[] = ['en', 'fr', 'ar']

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies()
  const raw = store.get('store-locale')?.value as Locale | undefined
  const initialLocale: Locale = raw && VALID_LOCALES.includes(raw) ? raw : 'en'
  const dir = initialLocale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html
      lang={initialLocale}
      dir={dir}
      className={`${inter.variable} ${cormorant.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F7F5F2] text-[#111111]">
        <I18nProvider initialLocale={initialLocale}>
          {children}
        </I18nProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
