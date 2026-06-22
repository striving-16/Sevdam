import type { Metadata } from 'next'
import { Geist, Cormorant_Garamond, Tajawal } from 'next/font/google'
import { cookies } from 'next/headers'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/translations'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
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
    default: 'Dreamshop — Beauty & Personal Care',
    template: '%s | Dreamshop',
  },
  description:
    'Authentic skincare, haircare, perfumes, makeup and more. Delivered across Mauritania. 100% genuine products at the best prices.',
  keywords: ['beauty', 'skincare', 'haircare', 'perfumes', 'makeup', 'mauritania', 'dreamshop'],
  openGraph: {
    type: 'website',
    siteName: 'Dreamshop',
    title: 'Dreamshop — Beauty & Personal Care',
    description: 'Authentic beauty products delivered across Mauritania.',
  },
}

const VALID_LOCALES: Locale[] = ['en', 'fr', 'ar']

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies()
  const raw = store.get('dreamshop-locale')?.value as Locale | undefined
  const initialLocale: Locale = raw && VALID_LOCALES.includes(raw) ? raw : 'en'
  const dir = initialLocale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html
      lang={initialLocale}
      dir={dir}
      className={`${geist.variable} ${cormorant.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAFAF8] text-[#1C1917]">
        <I18nProvider initialLocale={initialLocale}>
          {children}
        </I18nProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
