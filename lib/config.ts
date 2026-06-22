export const WHATSAPP_NUMBER = '22242631657'

export const SOCIAL_LINKS = {
  tiktok:   'https://www.tiktok.com/@dreamshop_shop?_r=1&_t=ZS-97LFTu4DGLc',
  facebook: 'https://www.facebook.com/share/1Gc5Z93G38/?mibextid=wwXIfr',
}

export function whatsAppUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
