import { describe, expect, it } from 'vitest'
import type { BuildingPart } from '../../content/schema'
import { OVERVIEW, findDrawing, isOverview, toModelView } from './modelView'

describe('toModelView', () => {
  it('is the overview without a view', () => {
    expect(toModelView(undefined)).toEqual(OVERVIEW)
  })

  it('maps parts, drawing and camera settings', () => {
    expect(
      toModelView({ figure: 'm', parts: ['roof'], drawing: 'section-a-a', azimuth: 30, zoom: 2 }),
    ).toEqual({
      parts: ['roof'],
      drawingId: 'section-a-a',
      azimuth: 30,
      elevation: undefined,
      zoom: 2,
    })
  })
})

describe('isOverview', () => {
  it('is true only when nothing is requested', () => {
    expect(isOverview(OVERVIEW)).toBe(true)
    expect(isOverview({ ...OVERVIEW, parts: ['roof'] })).toBe(false)
    expect(isOverview({ ...OVERVIEW, azimuth: 0 })).toBe(false)
  })
})

describe('findDrawing', () => {
  const sheet = {
    id: 'plan',
    title: 'Plan',
    kind: 'plan' as const,
    src: '/plan.svg',
    placement: {
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      width: 1,
      height: 1,
    },
    clip: true,
  }
  const parts: BuildingPart[] = [
    {
      id: 'floors',
      number: 1,
      name: 'Floors',
      summary: '',
      meshNames: ['f'],
      dynamoScripts: [],
      drawings: [sheet],
    },
  ]

  it('finds drawings across parts', () => {
    expect(findDrawing(parts, 'plan')).toBe(sheet)
  })

  it('returns null for missing or empty ids', () => {
    expect(findDrawing(parts, 'nope')).toBeNull()
    expect(findDrawing(parts, null)).toBeNull()
  })
})
