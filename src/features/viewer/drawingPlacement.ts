import { Euler, MathUtils, Plane, Vector3 } from 'three'
import type { DrawingPlacement } from '../../content/schema'

/** Placement rotation (degrees in content) as a three.js Euler (radians). */
export function placementEuler({ rotation }: DrawingPlacement): Euler {
  const [x, y, z] = rotation.map(MathUtils.degToRad)
  return new Euler(x, y, z, 'XYZ')
}

/** The direction the drawing's front faces (a plane's local +Z). */
export function placementNormal(placement: DrawingPlacement): Vector3 {
  return new Vector3(0, 0, 1).applyEuler(placementEuler(placement)).normalize()
}

/**
 * Camera azimuth (radians, CameraControls convention: 0 = looking from +Z,
 * π/2 = from +X) that views the drawing from its front, or null for
 * drawings lying flat (plans), which are viewed from above instead.
 */
export function frontAzimuth(placement: DrawingPlacement): number | null {
  const normal = placementNormal(placement)
  if (Math.abs(normal.y) > 0.9) return null
  return Math.atan2(normal.x, normal.z)
}

/**
 * Clipping plane that cuts away the model in front of the drawing, offset
 * slightly forward so the drawing itself isn't clipped. three.js keeps
 * fragments on the plane's positive side.
 */
export function sectionClipPlane(placement: DrawingPlacement, offset = 0.02): Plane {
  const normal = placementNormal(placement)
  const point = new Vector3(...placement.position).addScaledVector(normal, offset)
  return new Plane().setFromNormalAndCoplanarPoint(normal.negate(), point)
}
