import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { normalizePhone, isValidPhone } from './phone.ts'

describe('normalizePhone', () => {
  test('passes through a plain 8-digit local number', () => {
    assert.equal(normalizePhone('36234567'), '36234567')
  })

  test('strips spaces, dashes, and parens', () => {
    assert.equal(normalizePhone('36 23 45 67'), '36234567')
    assert.equal(normalizePhone('36-23-45-67'), '36234567')
    assert.equal(normalizePhone('(36) 234567'), '36234567')
  })

  test('strips a +222 country code', () => {
    assert.equal(normalizePhone('+22236234567'), '36234567')
    assert.equal(normalizePhone('+222 36 23 45 67'), '36234567')
  })

  test('strips a 00222 international prefix', () => {
    assert.equal(normalizePhone('0022236234567'), '36234567')
  })

  test('two numbers that are genuinely different stay different after normalizing', () => {
    assert.notEqual(normalizePhone('36234567'), normalizePhone('36234568'))
    assert.notEqual(normalizePhone('22411234'), normalizePhone('36511234'))
  })

  test('does not strip "222" from the middle of a local number that is not actually a country code', () => {
    // An 8-digit number is already a complete local number — only strip the
    // prefix when the TOTAL length matches what we'd expect with it present.
    assert.equal(normalizePhone('22212345'), '22212345')
  })
})

describe('isValidPhone', () => {
  test('accepts a normalized 8-digit number', () => {
    assert.equal(isValidPhone('36234567'), true)
  })

  test('rejects short sequences — this is what used to enable the substring-search leak', () => {
    assert.equal(isValidPhone('1234'), false)
    assert.equal(isValidPhone('1'), false)
    assert.equal(isValidPhone(''), false)
  })

  test('rejects too-long sequences', () => {
    assert.equal(isValidPhone('123456789012'), false)
  })

  test('rejects non-digit content', () => {
    assert.equal(isValidPhone('abcdefgh'), false)
  })
})
