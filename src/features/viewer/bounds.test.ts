import { BoxGeometry, Matrix4, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { computeModelBounds } from './bounds'

/** A 2×2×2 box centred at the given position. */
function cube(x: number, y: number, z: number, partId: string | null) {
  return {
    geometry: new BoxGeometry(2, 2, 2),
    matrix: new Matrix4().makeTranslation(x, y, z),
    partId,
  }
}

describe('computeModelBounds', () => {
  const bounds = computeModelBounds([
    cube(0, 0, 0, 'core'),
    cube(10, 0, 0, 'facade'),
    cube(10, 4, 0, 'facade'),
    cube(-10, 0, 0, null),
  ])

  it('covers every mesh, including unassigned ones', () => {
    expect(bounds.model.min).toEqual(new Vector3(-11, -1, -1))
    expect(bounds.model.max).toEqual(new Vector3(11, 5, 1))
  })

  it('merges all meshes of a part into one box', () => {
    const facade = bounds.parts.get('facade')!
    expect(facade.min).toEqual(new Vector3(9, -1, -1))
    expect(facade.max).toEqual(new Vector3(11, 5, 1))
  })

  it('only includes assigned parts', () => {
    expect([...bounds.parts.keys()]).toEqual(['core', 'facade'])
  })
})
