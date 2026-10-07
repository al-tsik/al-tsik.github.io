import { describe, expect, it } from 'vitest'
import { unsupportedViewFields } from './figureViews'

describe('unsupportedViewFields', () => {
  it('accepts fields that suit the figure type', () => {
    expect(unsupportedViewFields({ figure: 'm', part: 'roof', azimuth: 30 }, 'model')).toEqual([])
    expect(unsupportedViewFields({ figure: 'v', time: 12, until: 20 }, 'video')).toEqual([])
    expect(unsupportedViewFields({ figure: 'd', region: [0, 0, 50, 50] }, 'dynamo')).toEqual([])
  })

  it('reports fields meant for another type', () => {
    expect(unsupportedViewFields({ figure: 'g', image: 1, time: 4 }, 'gallery')).toEqual(['time'])
    expect(unsupportedViewFields({ figure: 'i', part: 'roof' }, 'image')).toEqual(['part'])
  })

  it('lets code figures highlight lines but not zoom', () => {
    expect(unsupportedViewFields({ figure: 'c', lines: [3, 9] }, 'code')).toEqual([])
    expect(unsupportedViewFields({ figure: 'c', region: [0, 0, 50, 50] }, 'code')).toEqual([
      'region',
    ])
  })

  it('accepts a view with only the figure id', () => {
    expect(unsupportedViewFields({ figure: 'x' }, 'animation')).toEqual([])
  })
})
