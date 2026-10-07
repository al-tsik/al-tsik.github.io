import type { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Sphere, type OrthographicCamera } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { ModelBounds } from './bounds'
import { viewerConfig } from './viewerConfig'

/**
 * Like CameraControls.fitToSphere for an orthographic camera, but fits the
 * sphere into the part of the canvas not covered by an overlay on the right
 * (e.g. the details panel), then shifts the view so it's centred there.
 */
function fitSphereBesideInset(
  controls: CameraControls,
  sphere: Sphere,
  rightInsetPx: number,
  animate: boolean,
) {
  const camera = controls.camera as OrthographicCamera
  // R3F sizes the orthographic frustum in CSS pixels.
  const width = camera.right - camera.left
  const height = camera.top - camera.bottom
  const availableWidth = Math.max(width - rightInsetPx, width / 3)
  const diameter = 2 * sphere.radius * viewerConfig.framingPadding
  const zoom = Math.min(availableWidth, height) / diameter

  const { x, y, z } = sphere.center
  void controls.moveTo(x, y, z, animate)
  void controls.zoomTo(zoom, animate)
  // Moving the camera right (in world units) shifts the scene left on screen.
  void controls.setFocalOffset(rightInsetPx / 2 / zoom, 0, 0, animate)
}

/**
 * Keeps the camera framed on the selected part, or on the whole model when
 * nothing is selected. The first framing snaps to the isometric angle;
 * later changes animate while keeping the visitor's current viewing angle.
 * Bounding spheres keep the target in view at any orbit angle.
 */
export function useCameraFraming(
  bounds: ModelBounds,
  selectedPartId: string | null,
  rightInsetPx = 0,
) {
  const controls = useThree((state) => state.controls) as CameraControls | null
  const reducedMotion = usePrefersReducedMotion()
  const hasFramed = useRef(false)

  useEffect(() => {
    if (!controls) return

    const partBox = selectedPartId ? bounds.parts.get(selectedPartId) : undefined
    const sphere = (partBox ?? bounds.model).getBoundingSphere(new Sphere())
    const inset = partBox ? rightInsetPx : 0

    if (!hasFramed.current) {
      hasFramed.current = true
      void controls.rotateTo(viewerConfig.initialAzimuth, viewerConfig.initialPolar, false)
      fitSphereBesideInset(controls, sphere, inset, false)
      return
    }

    fitSphereBesideInset(controls, sphere, inset, !reducedMotion)
  }, [controls, bounds, selectedPartId, rightInsetPx, reducedMotion])
}
