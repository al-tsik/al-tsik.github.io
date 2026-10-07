import type { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import type { BuildingPart, Drawing } from '../../content/schema'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { DrawingPlane } from './DrawingPlane'
import { frontAzimuth, nearestEquivalentAngle } from './drawingPlacement'
import { useActiveDrawing } from './useActiveDrawing'
import { viewerConfig } from './viewerConfig'

/**
 * Turns the camera so a newly shown drawing is seen from its front at an
 * oblique angle; plans are viewed from as high as the tilt limit allows.
 */
function useFaceDrawing(drawing: Drawing | null) {
  const controls = useThree((state) => state.controls) as CameraControls | null
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!controls || !drawing) return

    const azimuth = frontAzimuth(drawing.placement)
    if (azimuth === null) {
      void controls.rotatePolarTo(viewerConfig.minPolarAngle, !reducedMotion)
    } else {
      const target = azimuth + viewerConfig.drawingViewAngle
      const nearest = nearestEquivalentAngle(controls.azimuthAngle, target)
      void controls.rotateAzimuthTo(nearest, !reducedMotion)
    }
  }, [controls, drawing, reducedMotion])
}

type ActiveDrawingProps = {
  parts: BuildingPart[]
}

/** Shows the drawing the visitor toggled on in the details panel. */
export function ActiveDrawing({ parts }: ActiveDrawingProps) {
  const drawing = useActiveDrawing(parts)
  useFaceDrawing(drawing)

  if (!drawing) return null

  // Own Suspense boundary so loading a drawing never hides the model.
  return (
    <Suspense fallback={null}>
      <DrawingPlane key={drawing.id} drawing={drawing} />
    </Suspense>
  )
}
