import { Edges, useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { BufferGeometry, Matrix4 } from 'three'
import { useSelectionStore } from '../../state/selectionStore'
import { viewerColors } from './viewerColors'

/** Pointer travel (px) above which a press counts as a drag, not a click. */
const CLICK_TOLERANCE = 4

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
  useCursor(isHovered)

  const interactive = partId !== null
  const isActive = isHovered || isSelected

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
    >
      <meshStandardMaterial
        color={isActive ? viewerColors.accentSoft : viewerColors.surface}
        roughness={1}
      />
      <Edges color={isActive ? viewerColors.accent : viewerColors.edge} threshold={15} />
    </mesh>
  )
}
