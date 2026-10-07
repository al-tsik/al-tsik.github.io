import { describe, expect, it } from 'vitest'
import { pickActiveSection } from './activeSection'

describe('pickActiveSection', () => {
  const at = (...tops: number[]) => tops.map((top, i) => ({ id: `s${i + 1}`, top }))

  it('is null before the first section reaches the line', () => {
    expect(pickActiveSection(at(400, 900), 200)).toBeNull()
  })

  it('picks the last section above the line', () => {
    expect(pickActiveSection(at(-800, -100, 150, 700), 200)).toBe('s3')
  })

  it('counts a section exactly on the line', () => {
    expect(pickActiveSection(at(-50, 200), 200)).toBe('s2')
  })

  it('picks the last section at the end of the page', () => {
    expect(pickActiveSection(at(-800, -100, 150, 700), 200, true)).toBe('s4')
  })
})
