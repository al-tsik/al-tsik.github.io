import { useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import { Mesh, type BufferGeometry, type Matrix4, type Object3D, type Plane } from 'three'
import type { BuildingPart } from '../../content/schema'
import { createMeshPartIndex, resolvePartId, type MeshPartIndex } from '../../lib/partLookup'
import { computeModelBounds } from './bounds'
import { DrawingPlane } from './DrawingPlane'
import { sectionClipPlane } from './drawingPlacement'
import { findDrawing } from './modelView'
import { useModelView } from './ModelViewContext'
import { PartLabels } from './PartLabels'
import { PartMesh } from './PartMesh'
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
  /** Pixels covered on the right while parts are highlighted (e.g. by a panel). */
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
  const view = useModelView((state) => state.view)
  const drawing = useMemo(() => findDrawing(parts, view.drawingId), [parts, view.drawingId])
  useCameraFraming(bounds, view, drawing, selectionInsetPx)

  // Drawings with `clip: true` cut away the model in front of them.
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
      {/* Own Suspense boundary so loading a drawing never hides the model. */}
      <Suspense fallback={null}>
        {drawing && <DrawingPlane key={drawing.id} drawing={drawing} />}
      </Suspense>
    </group>
  )
}
