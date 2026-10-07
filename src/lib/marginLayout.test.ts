import { describe, expect, it } from 'vitest'
import { layoutMargin } from './marginLayout'

describe('layoutMargin', () => {
  it('places items level with their lines when there is room', () => {
    const items = [
      { anchorTop: 0, height: 100 },
      { anchorTop: 300, height: 100 },
    ]
    expect(layoutMargin(items, 10)).toEqual([0, 300])
  })

  it('pushes an overlapping item below the one above', () => {
    const items = [
      { anchorTop: 100, height: 200 },
      { anchorTop: 150, height: 50 },
      { anchorTop: 200, height: 50 },
    ]
    expect(layoutMargin(items, 10)).toEqual([100, 310, 370])
  })

  it('keeps results in input order even when anchors are not sorted', () => {
    const items = [
      { anchorTop: 400, height: 50 },
      { anchorTop: 0, height: 450 },
    ]
    expect(layoutMargin(items, 10)).toEqual([460, 0])
  })

  it('never places items above the top of the margin', () => {
    expect(layoutMargin([{ anchorTop: -40, height: 10 }])).toEqual([0])
  })
})
