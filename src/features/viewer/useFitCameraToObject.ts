import type { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, type RefObject } from 'react'
import { Box3, Sphere, type Object3D } from 'three'
import { viewerConfig } from './viewerConfig'

/**
 * Frames the camera on an object at the isometric angle once it mounts.
 * Uses the bounding sphere so the object stays in view while orbiting,
 * and works for models at any scale or distance from the origin.
 */
export function useFitCameraToObject(ref: RefObject<Object3D | null>) {
  const controls = useThree((state) => state.controls) as CameraControls | null

  useEffect(() => {
    if (!controls || !ref.current) return

    const sphere = new Box3().setFromObject(ref.current).getBoundingSphere(new Sphere())
    void controls.rotateTo(viewerConfig.initialAzimuth, viewerConfig.initialPolar, false)
    void controls.fitToSphere(sphere, false)
  }, [controls, ref])
}
