import { describe, expect, it } from 'vitest'
import type { BuildingPart } from '../content/schema'
import { createMeshPartIndex, resolvePartId } from './partLookup'

function part(id: string, meshNames: string[]): BuildingPart {
  return {
    id,
    number: 1,
    name: id,
    summary: '',
    meshNames,
    dynamoScripts: [],
    drawings: [],
  }
}

const index = createMeshPartIndex([
  part('roof', ['roof']),
  part('facade', ['facade-n', 'facade-s']),
])

describe('createMeshPartIndex', () => {
  it('maps every mesh name to its part', () => {
    expect(Object.fromEntries(index)).toEqual({
      roof: 'roof',
      'facade-n': 'facade',
      'facade-s': 'facade',
    })
  })
})

describe('resolvePartId', () => {
  it('matches the mesh name directly', () => {
    expect(resolvePartId(['facade-s'], index)).toBe('facade')
  })

  it('falls back to the nearest named ancestor', () => {
    expect(resolvePartId(['Mesh_0042', 'roof', 'Scene'], index)).toBe('roof')
  })

  it('prefers the nearest match when several ancestors match', () => {
    expect(resolvePartId(['facade-n', 'roof'], index)).toBe('facade')
  })

  it('returns null for meshes not assigned to a part', () => {
    expect(resolvePartId(['Furniture_01', 'Scene'], index)).toBeNull()
  })
})
