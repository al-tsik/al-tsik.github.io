import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import type { DrawingPlacement } from '../../content/schema'
import { frontAzimuth, placementNormal, sectionClipPlane } from './drawingPlacement'

function placement(rotation: [number, number, number]): DrawingPlacement {
  return { position: [0, 5, 0], rotation, width: 10, height: 10 }
}

function expectVector(actual: Vector3, expected: [number, number, number]) {
  expect(actual.x).toBeCloseTo(expected[0])
  expect(actual.y).toBeCloseTo(expected[1])
  expect(actual.z).toBeCloseTo(expected[2])
}

describe('placementNormal', () => {
  it('faces +Z with no rotation (a vertical sheet)', () => {
    expectVector(placementNormal(placement([0, 0, 0])), [0, 0, 1])
  })

  it('faces up when rotated -90° about X (a plan)', () => {
    expectVector(placementNormal(placement([-90, 0, 0])), [0, 1, 0])
  })

  it('faces +X when rotated 90° about Y', () => {
    expectVector(placementNormal(placement([0, 90, 0])), [1, 0, 0])
  })
})

describe('frontAzimuth', () => {
  it('views vertical sheets from their front', () => {
    expect(frontAzimuth(placement([0, 0, 0]))).toBeCloseTo(0)
    expect(frontAzimuth(placement([0, 90, 0]))).toBeCloseTo(Math.PI / 2)
  })

  it('returns null for plans', () => {
    expect(frontAzimuth(placement([-90, 0, 0]))).toBeNull()
  })
})

describe('sectionClipPlane', () => {
  const plane = sectionClipPlane(placement([0, 0, 0]))

  it('keeps geometry behind the drawing', () => {
    expect(plane.distanceToPoint(new Vector3(0, 5, -3))).toBeGreaterThan(0)
  })

  it('cuts geometry in front of the drawing', () => {
    expect(plane.distanceToPoint(new Vector3(0, 5, 3))).toBeLessThan(0)
  })

  it('keeps the drawing itself', () => {
    expect(plane.distanceToPoint(new Vector3(0, 5, 0))).toBeGreaterThan(0)
  })

  it('cuts everything above a plan', () => {
    const planCut = sectionClipPlane(placement([-90, 0, 0]))
    expect(planCut.distanceToPoint(new Vector3(0, 9, 0))).toBeLessThan(0)
    expect(planCut.distanceToPoint(new Vector3(0, 1, 0))).toBeGreaterThan(0)
  })
})
