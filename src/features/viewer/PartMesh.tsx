import { Edges, useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Mesh, type BufferGeometry, type Matrix4, type Plane } from 'three'
import { useModelView } from './ModelViewContext'
import { viewerColors } from './viewerColors'

/** Pointer travel (px) above which a press counts as a drag, not a click. */
const CLICK_TOLERANCE = 4
const GHOST_OPACITY = 0.12
const GHOST_EDGE_OPACITY = 0.2

/** Raycast stub that never reports a hit. */
const ignoreRaycast = () => null

type PartMeshProps = {
  name: string
  geometry: BufferGeometry
  matrix: Matrix4
  /** The building part this mesh belongs to; null makes it non-interactive. */
  partId: string | null
  /** Section cut applied to this mesh, e.g. while a section drawing is shown. */
  clippingPlanes: Plane[]
}

export function PartMesh({ name, geometry, matrix, partId, clippingPlanes }: PartMeshProps) {
  const setHoveredPartId = useModelView((state) => state.setHoveredPartId)
  const onPartClick = useModelView((state) => state.onPartClick)
  const isHovered = useModelView((state) => partId !== null && state.hoveredPartId === partId)
  const isSelected = useModelView((state) => partId !== null && state.view.parts.includes(partId))
  // Everything except the highlighted parts fades back.
  const isGhosted = useModelView(
    (state) =>
      state.view.parts.length > 0 && (partId === null || !state.view.parts.includes(partId)),
  )

  // Ghosted meshes ignore the pointer so they never block the highlighted parts.
  const interactive = partId !== null && onPartClick !== undefined && !isGhosted
  const isActive = isSelected || (isHovered && interactive)
  useCursor(isHovered && interactive)

  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation() // only the nearest mesh under the pointer reacts
    setHoveredPartId(partId)
  }
  const onPointerOut = () => setHoveredPartId(null)
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    // Ignore the click that ends an orbit drag.
    if (partId && event.delta <= CLICK_TOLERANCE) onPartClick?.(partId)
  }

  return (
    <mesh
      name={name}
      geometry={geometry}
      matrix={matrix}
      matrixAutoUpdate={false}
      onPointerOver={interactive ? onPointerOver : undefined}
      onPointerOut={interactive ? onPointerOut : undefined}
      onClick={interactive ? onClick : undefined}
      raycast={interactive ? Mesh.prototype.raycast : ignoreRaycast}
    >
      <meshStandardMaterial
        color={isActive ? viewerColors.accentSoft : viewerColors.surface}
        roughness={1}
        transparent
        opacity={isGhosted ? GHOST_OPACITY : 1}
        depthWrite={!isGhosted}
        clippingPlanes={clippingPlanes}
      />
      <Edges
        color={isActive ? viewerColors.accent : viewerColors.edge}
        threshold={15}
        transparent
        opacity={isGhosted ? GHOST_EDGE_OPACITY : 1}
        raycast={ignoreRaycast}
        clippingPlanes={clippingPlanes}
      />
    </mesh>
  )
}
