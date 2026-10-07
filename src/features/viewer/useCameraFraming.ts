import type { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Sphere } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { ModelBounds } from './bounds'
import { viewerConfig } from './viewerConfig'

/**
 * Keeps the camera framed on the selected part, or on the whole model when
 * nothing is selected. The first framing snaps to the isometric angle;
 * later changes animate while keeping the visitor's current viewing angle.
 * Bounding spheres keep the target in view at any orbit angle.
 */
export function useCameraFraming(bounds: ModelBounds, selectedPartId: string | null) {
  const controls = useThree((state) => state.controls) as CameraControls | null
  const reducedMotion = usePrefersReducedMotion()
  const hasFramed = useRef(false)

  useEffect(() => {
    if (!controls) return

    const box = (selectedPartId && bounds.parts.get(selectedPartId)) || bounds.model
    const sphere = box.getBoundingSphere(new Sphere())

    if (!hasFramed.current) {
      hasFramed.current = true
      void controls.rotateTo(viewerConfig.initialAzimuth, viewerConfig.initialPolar, false)
      void controls.fitToSphere(sphere, false)
      return
    }

    void controls.fitToSphere(sphere, !reducedMotion)
  }, [controls, bounds, selectedPartId, reducedMotion])
}
