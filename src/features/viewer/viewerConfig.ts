import { MathUtils } from 'three'

/**
 * Camera and control limits for the building viewer, kept in one place so
 * the "feel" of the viewer can be tuned without touching components.
 * Angles: polar is measured from straight up (0°) to the horizon (90°);
 * azimuth is the rotation around the vertical axis.
 */
export const viewerConfig = {
  /** True isometric view: 45° around, ≈35.26° above the horizon. */
  initialAzimuth: MathUtils.degToRad(45),
  initialPolar: Math.acos(1 / Math.sqrt(3)),

  /** Limited tilt: elevation between 15° and 60° above the horizon. */
  minPolarAngle: MathUtils.degToRad(30),
  maxPolarAngle: MathUtils.degToRad(75),

  /** Orthographic zoom limits (pixels per world unit). */
  minZoom: 4,
  maxZoom: 120,
}
