import { describe, expect, it } from 'vitest'
import { cvSections, sectionNumber } from './cvSections'

describe('sectionNumber', () => {
  it('numbers sections from 1 in reading order', () => {
    expect(sectionNumber('experience')).toBe(1)
    expect(sectionNumber('languages')).toBe(cvSections.length)
  })

  it('has unique section ids', () => {
    const ids = cvSections.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
