export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export const SOCIAL_LINKS = {
  tiktok:   process.env.NEXT_PUBLIC_TIKTOK_URL   ?? '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '',
}

export function whatsAppUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
