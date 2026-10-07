import { Edges, useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Mesh, type BufferGeometry, type Matrix4 } from 'three'
import { useSelectionStore } from '../../state/selectionStore'
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
}

export function PartMesh({ name, geometry, matrix, partId }: PartMeshProps) {
  const hover = useSelectionStore((state) => state.hover)
  const toggle = useSelectionStore((state) => state.toggle)
  const isHovered = useSelectionStore((state) => partId !== null && state.hoveredPartId === partId)
  const isSelected = useSelectionStore(
    (state) => partId !== null && state.selectedPartId === partId,
  )
  // Everything except the selection fades back while a part is selected.
  const isGhosted = useSelectionStore(
    (state) => state.selectedPartId !== null && state.selectedPartId !== partId,
  )
  useCursor(isHovered && !isGhosted)

  // Ghosted meshes ignore the pointer so they never block the selected part.
  const interactive = partId !== null && !isGhosted
  const isActive = isSelected || (isHovered && !isGhosted)

  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation() // only the nearest mesh under the pointer reacts
    hover(partId)
  }
  const onPointerOut = () => hover(null)
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    // Ignore the click that ends an orbit drag.
    if (partId && event.delta <= CLICK_TOLERANCE) toggle(partId)
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
      raycast={isGhosted ? ignoreRaycast : Mesh.prototype.raycast}
    >
      <meshStandardMaterial
        color={isActive ? viewerColors.accentSoft : viewerColors.surface}
        roughness={1}
        transparent
        opacity={isGhosted ? GHOST_OPACITY : 1}
        depthWrite={!isGhosted}
      />
      <Edges
        color={isActive ? viewerColors.accent : viewerColors.edge}
        threshold={15}
        transparent
        opacity={isGhosted ? GHOST_EDGE_OPACITY : 1}
        raycast={ignoreRaycast}
      />
    </mesh>
  )
}
