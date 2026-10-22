export const SOCIAL_LINKS = {
  tiktok:    process.env.NEXT_PUBLIC_TIKTOK_URL    || 'https://www.tiktok.com/@besma.sevdam',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/sevdambeautybs?igsh=MWtiNG9wdjZmcWoyMw==',
  snapchat:  process.env.NEXT_PUBLIC_SNAPCHAT_URL  || 'https://www.snapchat.com/add/besme.sevdam',
  facebook:  process.env.NEXT_PUBLIC_FACEBOOK_URL  || '',
}

/**
 * Builds a wa.me link. `number` must be resolved by the caller via
 * getWhatsAppNumber() (actions/settings-actions.ts) — there is deliberately
 * no hardcoded fallback here. Returns null rather than a link to an unknown
 * number, so the UI can show a clear "not configured" state instead of a
 * silently-broken or silently-wrong order destination.
 */
export function whatsAppUrl(number: string | null, message?: string): string | null {
  if (!number) return null
  const base = `https://wa.me/${number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
