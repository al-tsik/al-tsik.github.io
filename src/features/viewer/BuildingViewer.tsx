import { CameraControls, Edges, OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { viewerConfig } from './viewerConfig'

function Controls() {
  const controlsRef = useRef<CameraControls>(null)

  // Aim at the building once on mount; later camera moves are animated.
  useEffect(() => {
    controlsRef.current?.setTarget(...viewerConfig.target, false)
  }, [])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={viewerConfig.minPolarAngle}
      maxPolarAngle={viewerConfig.maxPolarAngle}
      minZoom={viewerConfig.minZoom}
      maxZoom={viewerConfig.maxZoom}
    />
  )
}

/** Interactive 3D view of the building, shown in the left pane. */
export function BuildingViewer() {
  return (
    // `flat` disables tone mapping so white stays white, like paper.
    <Canvas flat dpr={[1, 2]} aria-label="3D model of the building">
      <OrthographicCamera
        makeDefault
        position={[...viewerConfig.initialPosition]}
        zoom={viewerConfig.initialZoom}
        near={-100}
        far={500}
      />
      <Controls />

      {/* Key light from above-left so each face reads as a different tone. */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[-6, 20, 10]} intensity={1.6} />
      <directionalLight position={[12, 4, -6]} intensity={0.3} />

      {/* Temporary test geometry until the building model is loaded. */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[8, 8, 8]} />
        <meshStandardMaterial color="white" />
        <Edges color="#141414" />
      </mesh>
    </Canvas>
  )
}
