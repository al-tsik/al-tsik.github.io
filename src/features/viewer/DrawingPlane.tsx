import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import { DoubleSide, SRGBColorSpace } from 'three'
import type { Drawing } from '../../content/schema'
import { placementEuler } from './drawingPlacement'

type DrawingPlaneProps = {
  drawing: Drawing
}

/** A 2D drawing shown as a sheet in model space at its placement. */
export function DrawingPlane({ drawing }: DrawingPlaneProps) {
  const texture = useTexture(drawing.src, (loaded) => {
    loaded.colorSpace = SRGBColorSpace
    loaded.anisotropy = 8 // keeps linework crisp at oblique angles
  })
  const { position, width, height } = drawing.placement
  const rotation = useMemo(() => placementEuler(drawing.placement), [drawing.placement])

  return (
    <mesh position={position} rotation={rotation} renderOrder={1}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent side={DoubleSide} toneMapped={false} />
    </mesh>
  )
}
