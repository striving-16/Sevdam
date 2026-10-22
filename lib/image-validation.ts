/**
 * Validates actual file content (magic bytes) rather than trusting the
 * browser-supplied MIME type, which is trivially spoofable — a file renamed
 * to "photo.jpg" with an .html/.svg payload would otherwise sail through a
 * check that only looks at `file.type` or the filename extension.
 */

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB — generous for a product photo, bounds memory/latency

export type DetectedImageType = 'jpeg' | 'png' | 'webp' | 'gif'

function matches(buffer: Buffer, offset: number, bytes: number[]): boolean {
  if (buffer.length < offset + bytes.length) return false
  return bytes.every((b, i) => buffer[offset + i] === b)
}

export function detectImageType(buffer: Buffer): DetectedImageType | null {
  if (matches(buffer, 0, [0xff, 0xd8, 0xff])) return 'jpeg'
  if (matches(buffer, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png'
  if (matches(buffer, 0, [0x47, 0x49, 0x46, 0x38])) return 'gif' // "GIF8" — covers GIF87a/GIF89a
  if (matches(buffer, 0, [0x52, 0x49, 0x46, 0x46]) && matches(buffer, 8, [0x57, 0x45, 0x42, 0x50])) return 'webp' // "RIFF"...."WEBP"
  return null
}

export function validateImageUpload(buffer: Buffer): { ok: true } | { ok: false; error: string } {
  if (buffer.length === 0) return { ok: false, error: 'No file provided' }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `Image is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024}MB)` }
  }
  const type = detectImageType(buffer)
  if (!type) {
    return { ok: false, error: 'File is not a recognized image format (JPEG, PNG, WEBP, or GIF only)' }
  }
  return { ok: true }
}
