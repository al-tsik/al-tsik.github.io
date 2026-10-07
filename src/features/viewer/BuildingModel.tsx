import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Mesh, type BufferGeometry, type Matrix4, type Object3D, type Plane } from 'three'
import type { BuildingPart } from '../../content/schema'
import { createMeshPartIndex, resolvePartId, type MeshPartIndex } from '../../lib/partLookup'
import { useSelectionStore } from '../../state/selectionStore'
import { computeModelBounds } from './bounds'
import { sectionClipPlane } from './drawingPlacement'
import { PartLabels } from './PartLabels'
import { PartMesh } from './PartMesh'
import { useActiveDrawing } from './useActiveDrawing'
import { useCameraFraming } from './useCameraFraming'

type ModelMesh = {
  /** Unique per mesh; names can repeat in real exports. */
  id: string
  name: string
  geometry: BufferGeometry
  matrix: Matrix4
  partId: string | null
}

/** The object's name followed by its ancestors' names, nearest first. */
function nameChain(object: Object3D): string[] {
  const names: string[] = []
  for (let current: Object3D | null = object; current; current = current.parent) {
    names.push(current.name)
  }
  return names
}

/** Flattens the glTF scene graph into meshes with world transforms and part ids. */
function useModelMeshes(src: string, index: MeshPartIndex): ModelMesh[] {
  const { scene } = useGLTF(src)

  return useMemo(() => {
    scene.updateMatrixWorld(true)
    const meshes: ModelMesh[] = []
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        meshes.push({
          id: object.uuid,
          name: object.name,
          geometry: object.geometry,
          matrix: object.matrixWorld,
          partId: resolvePartId(nameChain(object), index),
        })
      }
    })
    return meshes
  }, [scene, index])
}

/** Shared empty list so unclipped meshes keep a stable prop. */
const NO_CLIPPING: Plane[] = []

type BuildingModelProps = {
  src: string
  parts: BuildingPart[]
  /** Pixels covered on the right while a part is selected (details panel). */
  selectionInsetPx?: number
}

/**
 * Renders the building model as a white card model with black edges,
 * ignoring the file's own materials so any export gets the same look.
 */
export function BuildingModel({ src, parts, selectionInsetPx = 0 }: BuildingModelProps) {
  const index = useMemo(() => createMeshPartIndex(parts), [parts])
  const meshes = useModelMeshes(src, index)
  const bounds = useMemo(() => computeModelBounds(meshes), [meshes])
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)
  useCameraFraming(bounds, selectedPartId, selectionInsetPx)

  // Drawings with `clip: true` cut away the model in front of them.
  const drawing = useActiveDrawing(parts)
  const clippingPlanes = useMemo(
    () => (drawing?.clip ? [sectionClipPlane(drawing.placement)] : NO_CLIPPING),
    [drawing],
  )

  return (
    <group>
      {meshes.map((mesh) => (
        <PartMesh
          key={mesh.id}
          name={mesh.name}
          geometry={mesh.geometry}
          matrix={mesh.matrix}
          partId={mesh.partId}
          clippingPlanes={clippingPlanes}
        />
      ))}
      <PartLabels parts={parts} bounds={bounds} />
    </group>
  )
}
