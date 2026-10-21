/*
  Lightweight, dependency-free shade-color suggestion.

  Pure pixel math lives here so it's unit-testable without a DOM/canvas.
  The only browser-dependent piece is `extractDominantColor`, which loads
  the image and samples it — it never throws; it resolves `null` on any
  failure so callers can fall back to manual color entry.
*/

export const FALLBACK_HEX = '#C7A98B'

const HEX_RE = /^#[0-9A-Fa-f]{6}$/

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value)
}

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return isValidHex(withHash) ? withHash.toUpperCase() : null
}

function toHexByte(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`.toUpperCase()
}

/**
 * Average the pixels of a center-cropped region, discarding near-white,
 * near-black, and low-saturation (greyscale) pixels — these are almost
 * always background, packaging, or shadow, not the product's own color.
 * Returns null if every sampled pixel got filtered out.
 */
export function averageFilteredPixels(rgba: Uint8ClampedArray): { r: number; g: number; b: number } | null {
  let r = 0, g = 0, b = 0, count = 0

  for (let i = 0; i < rgba.length; i += 4) {
    const pr = rgba[i]
    const pg = rgba[i + 1]
    const pb = rgba[i + 2]
    const alpha = rgba[i + 3]
    if (alpha < 200) continue // skip transparent padding

    const max = Math.max(pr, pg, pb)
    const min = Math.min(pr, pg, pb)
    const lightness = (max + min) / 2 / 255
    const saturation = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255))

    const isNearWhite = lightness > 0.92
    const isNearBlack = lightness < 0.08
    const isGreyscale  = saturation < 0.08 && lightness > 0.15 && lightness < 0.85 // flat grey, not a near-black shadow

    if (isNearWhite || isNearBlack || isGreyscale) continue

    r += pr
    g += pg
    b += pb
    count++
  }

  if (count === 0) return null
  return { r: r / count, g: g / count, b: b / count }
}

export type ExtractResult = { hex: string } | null

/**
 * Loads `imageUrl`, samples its center 50% region, and returns a suggested
 * hex color. Never throws — resolves null on any failure (load error,
 * tainted canvas, every pixel filtered out) so the caller can fall back
 * to manual entry.
 */
export async function extractDominantColor(imageUrl: string): Promise<ExtractResult> {
  if (typeof document === 'undefined') return null

  try {
    const img = await loadImage(imageUrl)

    const canvas = document.createElement('canvas')
    const SAMPLE_SIZE = 120 // downscale — we only need averaged color, not detail
    canvas.width = SAMPLE_SIZE
    canvas.height = SAMPLE_SIZE
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    // Draw only the center 50% of the source image, scaled to fill the canvas.
    const cropFraction = 0.5
    const sx = img.naturalWidth  * (1 - cropFraction) / 2
    const sy = img.naturalHeight * (1 - cropFraction) / 2
    const sw = img.naturalWidth  * cropFraction
    const sh = img.naturalHeight * cropFraction
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)

    const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
    const avg = averageFilteredPixels(data)
    if (!avg) return null

    return { hex: rgbToHex(avg.r, avg.g, avg.b) }
  } catch {
    return null
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image failed to load'))
    img.src = src
  })
}
