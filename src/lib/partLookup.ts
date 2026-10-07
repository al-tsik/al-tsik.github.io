import type { BuildingPart } from '../content/schema'

/** Maps each glTF node name listed in a part's meshNames to that part's id. */
export type MeshPartIndex = ReadonlyMap<string, string>

export function createMeshPartIndex(parts: readonly BuildingPart[]): MeshPartIndex {
  const index = new Map<string, string>()
  for (const part of parts) {
    for (const meshName of part.meshNames) {
      index.set(meshName, part.id)
    }
  }
  return index
}

/**
 * Finds the part a mesh belongs to. `nameChain` is the mesh's own name
 * followed by its ancestors' names (nearest first), because exporters
 * often nest the actual geometry under a named group node, e.g.
 * ["Mesh_0042", "roof", "Scene"]. Returns null for unassigned meshes.
 */
export function resolvePartId(nameChain: readonly string[], index: MeshPartIndex): string | null {
  for (const name of nameChain) {
    const partId = index.get(name)
    if (partId) return partId
  }
  return null
}
