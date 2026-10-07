import { describe, expect, it } from 'vitest'
import { regionTransform } from './region'

describe('regionTransform', () => {
  it('is the identity without a region', () => {
    expect(regionTransform(undefined)).toBe('none')
  })

  it('is a no-op for the full figure', () => {
    expect(regionTransform([0, 0, 100, 100])).toBe('scale(1) translate(0%, 0%)')
  })

  it('zooms into a quadrant and centres it', () => {
    // Top-left quarter: centre at (25%, 25%), twice as large.
    expect(regionTransform([0, 0, 50, 50])).toBe('scale(2) translate(25%, 25%)')
  })

  it('fits the larger side of a non-square region', () => {
    // A tall strip in the middle: height limits the zoom to 1.
    expect(regionTransform([35, 0, 30, 100])).toBe('scale(1) translate(0%, 0%)')
    // A wide strip at the bottom: width 50 → scale 2.
    expect(regionTransform([50, 70, 50, 20])).toBe('scale(2) translate(-25%, -30%)')
  })
})
