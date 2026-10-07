import { Box3, type BufferGeometry, type Matrix4 } from 'three'

type BoundedMesh = {
  geometry: BufferGeometry
  matrix: Matrix4
  partId: string | null
}

export type ModelBounds = {
  /** Bounds of the whole model. */
  model: Box3
  /** Bounds of each building part, keyed by part id. */
  parts: ReadonlyMap<string, Box3>
}

/** World-space bounds for the whole model and for each building part. */
export function computeModelBounds(meshes: readonly BoundedMesh[]): ModelBounds {
  const model = new Box3()
  const parts = new Map<string, Box3>()

  for (const mesh of meshes) {
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
    const box = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrix)

    model.union(box)
    if (mesh.partId) {
      const partBox = parts.get(mesh.partId) ?? new Box3()
      parts.set(mesh.partId, partBox.union(box))
    }
  }

  return { model, parts }
}
