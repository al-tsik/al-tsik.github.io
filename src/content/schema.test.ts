import { describe, expect, it } from 'vitest'
import { ContactSchema } from './schema'

describe('ContactSchema', () => {
  it('accepts plain-text items and mailto, tel and web links', () => {
    for (const item of [
      { label: '[City], UK' },
      { label: 'Email', href: 'mailto:name@example.com' },
      { label: 'Phone', href: 'tel:+440000000000' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/someone' },
    ]) {
      expect(ContactSchema.safeParse(item).success).toBe(true)
    }
  })

  it('rejects other link schemes, e.g. javascript:', () => {
    expect(ContactSchema.safeParse({ label: 'x', href: 'javascript:alert(1)' }).success).toBe(false)
    expect(ContactSchema.safeParse({ label: 'x', href: 'www.example.com' }).success).toBe(false)
  })
})
