export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '22234350808'

export const SOCIAL_LINKS = {
  tiktok:    process.env.NEXT_PUBLIC_TIKTOK_URL    ?? 'https://www.tiktok.com/@besma.sevdam',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/sevdambeautybs?igsh=MWtiNG9wdjZmcWoyMw==',
  snapchat:  process.env.NEXT_PUBLIC_SNAPCHAT_URL  ?? 'https://www.snapchat.com/add/besme.sevdam',
  facebook:  process.env.NEXT_PUBLIC_FACEBOOK_URL  ?? '',
}

export function whatsAppUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
