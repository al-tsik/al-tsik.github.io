import type { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Box3, MathUtils, Sphere, type OrthographicCamera } from 'three'
import type { Drawing } from '../../content/schema'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { ModelBounds } from './bounds'
import { frontAzimuth, nearestEquivalentAngle } from './drawingPlacement'
import type { ModelView } from './modelView'
import { viewerConfig } from './viewerConfig'

/**
 * Like CameraControls.fitToSphere for an orthographic camera, but fits the
 * sphere into the part of the canvas not covered by an overlay on the right,
 * then shifts the view so it's centred there.
 */
function fitSphereBesideInset(
  controls: CameraControls,
  sphere: Sphere,
  rightInsetPx: number,
  zoomFactor: number,
  animate: boolean,
) {
  const camera = controls.camera as OrthographicCamera
  // R3F sizes the orthographic frustum in CSS pixels.
  const width = camera.right - camera.left
  const height = camera.top - camera.bottom
  const availableWidth = Math.max(width - rightInsetPx, width / 3)
  const diameter = 2 * sphere.radius * viewerConfig.framingPadding
  const zoom = (Math.min(availableWidth, height) / diameter) * zoomFactor

  const { x, y, z } = sphere.center
  void controls.moveTo(x, y, z, animate)
  void controls.zoomTo(zoom, animate)
  // Moving the camera right (in world units) shifts the scene left on screen.
  void controls.setFocalOffset(rightInsetPx / 2 / zoom, 0, 0, animate)
}

/**
 * Camera angles for a view, in CameraControls radians. Explicit angles win;
 * otherwise a shown drawing is viewed from its front (plans from above);
 * otherwise undefined keeps the visitor's current angle.
 */
function targetAngles(view: ModelView, drawing: Drawing | null) {
  let azimuth = view.azimuth === undefined ? undefined : MathUtils.degToRad(view.azimuth)
  let polar = view.elevation === undefined ? undefined : MathUtils.degToRad(90 - view.elevation)

  if (drawing && azimuth === undefined && polar === undefined) {
    const front = frontAzimuth(drawing.placement)
    if (front === null) polar = viewerConfig.minPolarAngle
    else azimuth = front + viewerConfig.drawingViewAngle
  }
  return { azimuth, polar }
}

/**
 * Keeps the camera framed on the highlighted parts, or on the whole model
 * in the overview, and turns it to the view's angles. The first framing
 * snaps to the isometric angle (unless the view sets one); later changes
 * animate. Bounding spheres keep the target in view at any orbit angle.
 */
export function useCameraFraming(
  bounds: ModelBounds,
  view: ModelView,
  drawing: Drawing | null,
  rightInsetPx = 0,
) {
  const controls = useThree((state) => state.controls) as CameraControls | null
  const reducedMotion = usePrefersReducedMotion()
  const hasFramed = useRef(false)

  // Depend on the view's content, not its object identity, so re-renders
  // with an equal view don't re-trigger the camera move.
  const viewKey = JSON.stringify(view)

  useEffect(() => {
    if (!controls) return
    const current: ModelView = JSON.parse(viewKey)

    const partBoxes = current.parts.flatMap((id) => bounds.parts.get(id) ?? [])
    const box = partBoxes.length
      ? partBoxes.reduce((union, partBox) => union.union(partBox), new Box3())
      : bounds.model
    const sphere = box.getBoundingSphere(new Sphere())
    const inset = partBoxes.length ? rightInsetPx : 0
    const animate = hasFramed.current && !reducedMotion

    let { azimuth, polar } = targetAngles(current, drawing)
    if (!hasFramed.current) {
      azimuth ??= viewerConfig.initialAzimuth
      polar ??= viewerConfig.initialPolar
    }
    hasFramed.current = true

    if (azimuth !== undefined) {
      void controls.rotateAzimuthTo(nearestEquivalentAngle(controls.azimuthAngle, azimuth), animate)
    }
    if (polar !== undefined) void controls.rotatePolarTo(polar, animate)
    fitSphereBesideInset(controls, sphere, inset, current.zoom ?? 1, animate)
  }, [controls, bounds, viewKey, drawing, rightInsetPx, reducedMotion])
}
