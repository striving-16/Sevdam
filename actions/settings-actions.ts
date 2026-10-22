'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { normalizeWhatsAppNumber, isValidWhatsAppNumber } from '@/lib/phone'
import * as Sentry from '@sentry/nextjs'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/login')
}

const WHATSAPP_NUMBER_KEY = 'whatsapp_number'

/**
 * Resolves the WhatsApp destination number: an admin-set DB value takes
 * priority, falling back to NEXT_PUBLIC_WHATSAPP_NUMBER if that's a validly
 * formatted number. Returns null — never a guessed/hardcoded value — if
 * neither is configured, so callers can show a clear "not configured" state
 * instead of generating a link to nowhere.
 */
export async function getWhatsAppNumber(): Promise<string | null> {
  try {
    const setting = await db.storeSetting.findUnique({ where: { key: WHATSAPP_NUMBER_KEY } })
    if (setting && isValidWhatsAppNumber(setting.value)) return setting.value
  } catch (err) {
    // Table may not exist yet (migration pending approval) — fall through to
    // the env var rather than crash every page that needs a WhatsApp link.
    Sentry.captureException(err)
  }

  const envValue = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (envValue) {
    const normalized = normalizeWhatsAppNumber(envValue)
    if (isValidWhatsAppNumber(normalized)) return normalized
  }

  return null
}

export async function updateWhatsAppNumber(raw: string): Promise<{ error?: string }> {
  await requireAdmin()
  const normalized = normalizeWhatsAppNumber(raw)
  if (!isValidWhatsAppNumber(normalized)) {
    return { error: 'Enter a valid WhatsApp number with country code (8–15 digits, e.g. 22236234567)' }
  }

  try {
    await db.storeSetting.upsert({
      where: { key: WHATSAPP_NUMBER_KEY },
      create: { key: WHATSAPP_NUMBER_KEY, value: normalized },
      update: { value: normalized },
    })
  } catch (err) {
    Sentry.captureException(err)
    return { error: 'Settings storage is not ready yet — the database migration for store settings needs to be applied first.' }
  }

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout') // footer/cart/product WhatsApp links everywhere
  return {}
}
