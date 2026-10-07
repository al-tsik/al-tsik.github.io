import { Edges, useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { BufferGeometry, Matrix4 } from 'three'
import { useSelectionStore } from '../../state/selectionStore'
import { viewerColors } from './viewerColors'

type PartMeshProps = {
  name: string
  geometry: BufferGeometry
  matrix: Matrix4
  /** The building part this mesh belongs to; null makes it non-interactive. */
  partId: string | null
}

export function PartMesh({ name, geometry, matrix, partId }: PartMeshProps) {
  const hover = useSelectionStore((state) => state.hover)
  const isHovered = useSelectionStore((state) => partId !== null && state.hoveredPartId === partId)
  useCursor(isHovered)

  const interactive = partId !== null
  const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation() // only the nearest mesh under the pointer reacts
    hover(partId)
  }
  const onPointerOut = () => hover(null)

  return (
    <mesh
      name={name}
      geometry={geometry}
      matrix={matrix}
      matrixAutoUpdate={false}
      onPointerOver={interactive ? onPointerOver : undefined}
      onPointerOut={interactive ? onPointerOut : undefined}
    >
      <meshStandardMaterial
        color={isHovered ? viewerColors.accentSoft : viewerColors.surface}
        roughness={1}
      />
      <Edges color={isHovered ? viewerColors.accent : viewerColors.edge} threshold={15} />
    </mesh>
  )
}
