import { describe, expect, it } from 'vitest'
import { markerSegment } from './lottieMarkers'

const data = {
  markers: [
    { tm: 0, cm: 'numbering', dr: 60 },
    { tm: 60, cm: 'schedule', dr: 45 },
  ],
}

describe('markerSegment', () => {
  it('returns the frame range of a named marker', () => {
    expect(markerSegment(data, 'schedule')).toEqual([60, 105])
  })

  it('returns null for unknown markers or files without markers', () => {
    expect(markerSegment(data, 'missing')).toBeNull()
    expect(markerSegment({}, 'numbering')).toBeNull()
  })
})
