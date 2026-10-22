import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { detectImageType, validateImageUpload } from './image-validation.ts'

function bytes(...arr: number[]): Buffer {
  return Buffer.from(arr)
}

describe('detectImageType', () => {
  test('recognizes a JPEG signature', () => {
    assert.equal(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0)), 'jpeg')
  })

  test('recognizes a PNG signature', () => {
    assert.equal(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)), 'png')
  })

  test('recognizes a GIF signature', () => {
    assert.equal(detectImageType(Buffer.from('GIF89a', 'ascii')), 'gif')
    assert.equal(detectImageType(Buffer.from('GIF87a', 'ascii')), 'gif')
  })

  test('recognizes a WEBP signature (RIFF....WEBP)', () => {
    const buf = Buffer.concat([Buffer.from('RIFF', 'ascii'), bytes(0, 0, 0, 0), Buffer.from('WEBP', 'ascii')])
    assert.equal(detectImageType(buf), 'webp')
  })

  test('rejects an HTML file renamed to look like an image, regardless of claimed extension', () => {
    const html = Buffer.from('<html><script>alert(1)</script></html>', 'ascii')
    assert.equal(detectImageType(html), null)
  })

  test('rejects an SVG (XML-based, not a real raster signature)', () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>', 'ascii')
    assert.equal(detectImageType(svg), null)
  })

  test('rejects a RIFF container that is not actually WEBP (e.g. a WAV file)', () => {
    const wav = Buffer.concat([Buffer.from('RIFF', 'ascii'), bytes(0, 0, 0, 0), Buffer.from('WAVE', 'ascii')])
    assert.equal(detectImageType(wav), null)
  })

  test('rejects an empty buffer', () => {
    assert.equal(detectImageType(Buffer.alloc(0)), null)
  })
})

describe('validateImageUpload', () => {
  test('accepts a valid small JPEG', () => {
    const result = validateImageUpload(bytes(0xff, 0xd8, 0xff, 0, 0, 0))
    assert.equal(result.ok, true)
  })

  test('rejects an empty file', () => {
    const result = validateImageUpload(Buffer.alloc(0))
    assert.equal(result.ok, false)
  })

  test('rejects a file over the size limit', () => {
    const huge = Buffer.concat([bytes(0xff, 0xd8, 0xff), Buffer.alloc(11 * 1024 * 1024)])
    const result = validateImageUpload(huge)
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.error, /too large/i)
  })

  test('rejects a non-image file with a clear error, not a silent pass-through', () => {
    const result = validateImageUpload(Buffer.from('not an image', 'ascii'))
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.error, /not a recognized image format/i)
  })
})
