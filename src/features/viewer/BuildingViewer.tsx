import { CameraControls, OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import type { BuildingPart } from '../../content/schema'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { BuildingModel } from './BuildingModel'
import { ModelLoader } from './ModelLoader'
import { OVERVIEW, isOverview, type ModelView } from './modelView'
import { ModelViewContext, createModelViewStore } from './ModelViewContext'
import { useAutoOrbit } from './useAutoOrbit'
import { viewerConfig } from './viewerConfig'

type BuildingViewerProps = {
  /** Path to the .glb model in public/. */
  modelSrc: string
  parts: BuildingPart[]
  /** What to show: highlighted parts, a drawing, camera angles. Defaults to the overview. */
  view?: ModelView
  /** Makes parts and labels clickable. */
  onPartClick?: (partId: string) => void
  /** Called on a click on empty space (not a drag). */
  onBackgroundClick?: () => void
  /** Show the numbered part labels (default true). */
  showLabels?: boolean
  /** Pixels covered on the right while parts are highlighted (e.g. by a panel). */
  selectionInsetPx?: number
  /**
   * Let visitors orbit and zoom (default true). Thumbnails turn this off so
   * the mouse wheel scrolls the page instead of zooming the model.
   */
  interactive?: boolean
}

/** Hooks that use the R3F context must render inside <Canvas>. */
function AutoOrbit({ enabled }: { enabled: boolean }) {
  useAutoOrbit(enabled)
  return null
}

/**
 * The 3D building as a controlled component: everything it shows comes from
 * the `view` prop, so several viewers (a thumbnail and a pop-out) can show
 * different views side by side. Idle-orbits in the overview.
 */
export function BuildingViewer({
  modelSrc,
  parts,
  view = OVERVIEW,
  onPartClick,
  onBackgroundClick,
  showLabels = true,
  selectionInsetPx,
  interactive = true,
}: BuildingViewerProps) {
  const reducedMotion = usePrefersReducedMotion()
  // Created once with the initial props, so the first framing already uses the view.
  const [store] = useState(() => createModelViewStore({ view, onPartClick, showLabels }))

  useEffect(() => {
    store.setState({ view, onPartClick, showLabels })
  }, [store, view, onPartClick, showLabels])

  return (
    // `flat` disables tone mapping so white stays white, like paper.
    <Canvas
      flat
      dpr={[1, 2]}
      // Needed for per-material clipping planes (section cuts).
      gl={{ localClippingEnabled: true }}
      aria-label="3D model of the building"
      onPointerMissed={onBackgroundClick}
    >
      <ModelViewContext value={store}>
        {/* Wide near/far range so large or off-origin models never clip. */}
        <OrthographicCamera makeDefault position={[20, 20, 20]} near={-1000} far={2000} />
        <CameraControls
          makeDefault
          // Disables user input only; views and idle orbit still move the camera.
          enabled={interactive}
          minPolarAngle={viewerConfig.minPolarAngle}
          maxPolarAngle={viewerConfig.maxPolarAngle}
          minZoom={viewerConfig.minZoom}
          maxZoom={viewerConfig.maxZoom}
        />
        <AutoOrbit enabled={!reducedMotion && isOverview(view)} />

        {/* Key light from above-left so each face reads as a different tone. */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[-6, 20, 10]} intensity={1.6} />
        <directionalLight position={[12, 4, -6]} intensity={0.3} />

        <Suspense fallback={<ModelLoader />}>
          <BuildingModel src={modelSrc} parts={parts} selectionInsetPx={selectionInsetPx} />
        </Suspense>
      </ModelViewContext>
    </Canvas>
  )
}
