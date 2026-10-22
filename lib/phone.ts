/**
 * Mauritanian phone numbers are 8 digits locally (e.g. 36234567), optionally
 * entered with a +222 / 00222 country code or spaces/dashes. Normalizing to
 * a consistent 8-digit form lets us do an exact match instead of a substring
 * search, and means "36234567", "+222 36 23 45 67", and "00222-36234567"
 * are all recognized as the same number rather than silently different.
 */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.length === 13 && digits.startsWith('00222')) digits = digits.slice(5)
  else if (digits.length === 11 && digits.startsWith('222')) digits = digits.slice(3)
  return digits
}

export function isValidPhone(normalized: string): boolean {
  return /^\d{8}$/.test(normalized)
}

/**
 * The WhatsApp destination (wa.me/<number>) needs the FULL international
 * number — country code included, no "+", no spaces — unlike customer order
 * phone numbers above which are always local 8-digit Mauritanian numbers.
 * Deliberately permissive on length (8–15 digits) since this is a business
 * contact number, not necessarily Mauritanian.
 */
export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/\D/g, '')
}

export function isValidWhatsAppNumber(normalized: string): boolean {
  return /^\d{8,15}$/.test(normalized)
}
