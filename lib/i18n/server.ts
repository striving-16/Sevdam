import { cookies } from 'next/headers'
import { translations, type Locale } from './translations'

const VALID: Locale[] = ['en', 'fr', 'ar']

/**
 * Read the locale from the cookie set by I18nProvider.
 * Use this in server components/pages to get translated strings.
 */
export async function getServerT() {
  const store = await cookies()
  const raw = store.get('store-locale')?.value as Locale | undefined
  const locale: Locale = raw && VALID.includes(raw) ? raw : 'en'
  return {
    t: translations[locale],
    locale,
    dir: locale === 'ar' ? ('rtl' as const) : ('ltr' as const),
  }
}
