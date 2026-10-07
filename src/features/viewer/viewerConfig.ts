import { MathUtils } from 'three'

/**
 * Camera and control limits for the building viewer, kept in one place so
 * the "feel" of the viewer can be tuned without touching components.
 * Angles: polar is measured from straight up (0°) to the horizon (90°).
 */
export const viewerConfig = {
  /** Initial camera direction: true isometric (elevation ≈ 35.26°). */
  initialPosition: [20, 20, 20] as const,
  target: [0, 4, 0] as const,

  /** Limited tilt: elevation between 15° and 60° above the horizon. */
  minPolarAngle: MathUtils.degToRad(30),
  maxPolarAngle: MathUtils.degToRad(75),

  /** Orthographic zoom (pixels per world unit). */
  initialZoom: 28,
  minZoom: 12,
  maxZoom: 120,
}
