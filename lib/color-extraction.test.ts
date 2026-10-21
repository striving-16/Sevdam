import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  isValidHex,
  normalizeHex,
  rgbToHex,
  averageFilteredPixels,
  FALLBACK_HEX,
} from './color-extraction.ts'

describe('isValidHex', () => {
  test('accepts a well-formed 6-digit hex', () => {
    assert.equal(isValidHex('#C7A98B'), true)
    assert.equal(isValidHex('#000000'), true)
    assert.equal(isValidHex('#ffffff'), true)
  })

  test('rejects malformed values', () => {
    assert.equal(isValidHex('C7A98B'), false)      // missing #
    assert.equal(isValidHex('#C7A98'), false)       // too short
    assert.equal(isValidHex('#C7A98BAA'), false)    // too long
    assert.equal(isValidHex('#GGGGGG'), false)      // non-hex chars
    assert.equal(isValidHex(''), false)
    assert.equal(isValidHex('rgb(1,2,3)'), false)
  })
})

describe('normalizeHex', () => {
  test('adds a missing leading #', () => {
    assert.equal(normalizeHex('c7a98b'), '#C7A98B')
  })

  test('uppercases valid hex', () => {
    assert.equal(normalizeHex('#c7a98b'), '#C7A98B')
  })

  test('trims whitespace', () => {
    assert.equal(normalizeHex('  #C7A98B  '), '#C7A98B')
  })

  test('returns null for invalid input instead of guessing', () => {
    assert.equal(normalizeHex('not-a-color'), null)
    assert.equal(normalizeHex('#12'), null)
    assert.equal(normalizeHex(''), null)
  })
})

describe('rgbToHex', () => {
  test('converts exact channel values', () => {
    assert.equal(rgbToHex(0, 0, 0), '#000000')
    assert.equal(rgbToHex(255, 255, 255), '#FFFFFF')
    assert.equal(rgbToHex(199, 169, 139), '#C7A98B')
  })

  test('rounds and clamps out-of-range input', () => {
    assert.equal(rgbToHex(199.6, -5, 300), '#C800FF')
  })
})

describe('averageFilteredPixels', () => {
  function pixel(r: number, g: number, b: number, a = 255) {
    return [r, g, b, a]
  }

  test('averages a uniform block of in-range color', () => {
    const rgba = new Uint8ClampedArray([
      ...pixel(200, 50, 90),
      ...pixel(200, 50, 90),
      ...pixel(200, 50, 90),
    ])
    const result = averageFilteredPixels(rgba)
    assert.deepEqual(result, { r: 200, g: 50, b: 90 })
  })

  test('discards near-white pixels (background)', () => {
    const rgba = new Uint8ClampedArray([
      ...pixel(250, 250, 250), // near-white background
      ...pixel(250, 250, 248),
      ...pixel(180, 40, 60),   // the actual product color
    ])
    const result = averageFilteredPixels(rgba)
    assert.deepEqual(result, { r: 180, g: 40, b: 60 })
  })

  test('discards near-black pixels (shadow)', () => {
    const rgba = new Uint8ClampedArray([
      ...pixel(5, 5, 5),       // near-black shadow
      ...pixel(10, 8, 10),
      ...pixel(180, 40, 60),   // the actual product color
    ])
    const result = averageFilteredPixels(rgba)
    assert.deepEqual(result, { r: 180, g: 40, b: 60 })
  })

  test('discards flat greyscale pixels (packaging/metal)', () => {
    const rgba = new Uint8ClampedArray([
      ...pixel(128, 128, 128), // flat grey packaging
      ...pixel(140, 140, 141),
      ...pixel(180, 40, 60),   // the actual product color
    ])
    const result = averageFilteredPixels(rgba)
    assert.deepEqual(result, { r: 180, g: 40, b: 60 })
  })

  test('ignores transparent padding pixels', () => {
    const rgba = new Uint8ClampedArray([
      ...pixel(180, 40, 60, 0), // fully transparent, should not count
      ...pixel(180, 40, 60, 255),
    ])
    const result = averageFilteredPixels(rgba)
    assert.deepEqual(result, { r: 180, g: 40, b: 60 })
  })

  test('returns null when every pixel is filtered out (extraction failure)', () => {
    const rgba = new Uint8ClampedArray([
      ...pixel(255, 255, 255),
      ...pixel(0, 0, 0),
      ...pixel(128, 128, 128),
    ])
    const result = averageFilteredPixels(rgba)
    assert.equal(result, null)
  })
})

describe('fallback behavior (extraction failure -> manual entry)', () => {
  test('FALLBACK_HEX is itself a valid hex color', () => {
    assert.equal(isValidHex(FALLBACK_HEX), true)
  })

  test('an invalid stored hexColor normalizes to null, so callers fall back to FALLBACK_HEX', () => {
    const storedHexColor = 'garbage'
    const safeHex = normalizeHex(storedHexColor) ?? FALLBACK_HEX
    assert.equal(safeHex, FALLBACK_HEX)
  })
})

describe('"never overwritten by unrelated edits" state transitions', () => {
  type Shade = { hexColor: string; colorSource: 'manual' | 'suggested' }

  function applySuggestion(shade: Shade, suggestedHex: string): Shade {
    return { ...shade, hexColor: suggestedHex, colorSource: 'suggested' }
  }

  function applyManualEdit(shade: Shade, newHex: string): Shade {
    return { ...shade, hexColor: newHex, colorSource: 'manual' }
  }

  test('a manual correction flips colorSource to manual', () => {
    const suggested: Shade = { hexColor: '#AABBCC', colorSource: 'suggested' }
    const corrected = applyManualEdit(suggested, '#112233')
    assert.equal(corrected.colorSource, 'manual')
    assert.equal(corrected.hexColor, '#112233')
  })

  test('re-suggesting only ever flips colorSource to suggested, never silently on unrelated field edits', () => {
    const manual: Shade = { hexColor: '#112233', colorSource: 'manual' }
    // Simulates an unrelated edit (e.g. changing stock) which must NOT touch color fields at all.
    const afterUnrelatedEdit = { ...manual }
    assert.equal(afterUnrelatedEdit.colorSource, 'manual')
    assert.equal(afterUnrelatedEdit.hexColor, '#112233')

    // Only an explicit re-suggest call changes it.
    const resuggested = applySuggestion(afterUnrelatedEdit, '#AABBCC')
    assert.equal(resuggested.colorSource, 'suggested')
  })
})
