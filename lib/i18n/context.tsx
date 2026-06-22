'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { translations, type Locale, type Translations } from './translations'

type I18nContextType = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
  dir: 'ltr' | 'rtl'
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
  dir: 'ltr',
})

const VALID: Locale[] = ['en', 'fr', 'ar']

interface I18nProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale = 'en' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  /* Sync from localStorage on mount (client only) */
  useEffect(() => {
    const saved = localStorage.getItem('dreamshop-locale') as Locale | null
    if (saved && VALID.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr'

  /* Keep <html> lang/dir attributes in sync */
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('dreamshop-locale', l)
    /* Cookie so server components can read it without a full reload */
    document.cookie = `dreamshop-locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale], dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}

/** Replace `{key}` placeholders — e.g. interpolate('Only {n} left', { n: 3 }) */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}
