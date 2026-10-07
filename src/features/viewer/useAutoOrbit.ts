import type { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { viewerConfig } from './viewerConfig'

/**
 * Slowly rotates the camera around the building while idle. Pauses while
 * the user drags or zooms and resumes after a short delay.
 */
export function useAutoOrbit(enabled: boolean) {
  const controls = useThree((state) => state.controls) as CameraControls | null
  const isInteracting = useRef(false)
  const lastInteraction = useRef(0)

  useEffect(() => {
    if (!controls) return

    const onStart = () => {
      isInteracting.current = true
    }
    const onEnd = () => {
      isInteracting.current = false
      lastInteraction.current = performance.now()
    }

    controls.addEventListener('controlstart', onStart)
    controls.addEventListener('controlend', onEnd)
    return () => {
      controls.removeEventListener('controlstart', onStart)
      controls.removeEventListener('controlend', onEnd)
    }
  }, [controls])

  useFrame((_, delta) => {
    if (!enabled || !controls || isInteracting.current) return
    if (performance.now() - lastInteraction.current < viewerConfig.autoOrbitResumeDelayMs) return

    const radiansPerSecond = (2 * Math.PI) / viewerConfig.autoOrbitSecondsPerTurn
    void controls.rotate(radiansPerSecond * delta, 0, false)
  })
}
