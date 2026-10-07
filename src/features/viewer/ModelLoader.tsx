import { Html, useProgress } from '@react-three/drei'

/** Suspense fallback shown inside the canvas while the model downloads. */
export function ModelLoader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <p
        role="status"
        className="font-mono text-xs tracking-widest whitespace-nowrap text-ink-muted uppercase"
      >
        Loading model {Math.round(progress)}%
      </p>
    </Html>
  )
}
