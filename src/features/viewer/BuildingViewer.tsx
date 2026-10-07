import { CameraControls, OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { BuildingModel } from './BuildingModel'
import { ModelLoader } from './ModelLoader'
import { viewerConfig } from './viewerConfig'

type BuildingViewerProps = {
  /** Path to the .glb model in public/. */
  modelSrc: string
}

/** Interactive 3D view of the building, shown in the left pane. */
export function BuildingViewer({ modelSrc }: BuildingViewerProps) {
  return (
    // `flat` disables tone mapping so white stays white, like paper.
    <Canvas flat dpr={[1, 2]} aria-label="3D model of the building">
      {/* Wide near/far range so large or off-origin models never clip. */}
      <OrthographicCamera makeDefault position={[20, 20, 20]} near={-1000} far={2000} />
      <CameraControls
        makeDefault
        minPolarAngle={viewerConfig.minPolarAngle}
        maxPolarAngle={viewerConfig.maxPolarAngle}
        minZoom={viewerConfig.minZoom}
        maxZoom={viewerConfig.maxZoom}
      />

      {/* Key light from above-left so each face reads as a different tone. */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[-6, 20, 10]} intensity={1.6} />
      <directionalLight position={[12, 4, -6]} intensity={0.3} />

      <Suspense fallback={<ModelLoader />}>
        <BuildingModel src={modelSrc} />
      </Suspense>
    </Canvas>
  )
}
