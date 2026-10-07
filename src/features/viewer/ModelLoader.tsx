import { useProgress } from '@react-three/drei'

/**
 * Loading text over the canvas while the model or a drawing downloads.
 * Plain DOM outside the canvas on purpose: drei's <Html> as a Suspense
 * fallback mounts a React root of its own, and unmounting that root while a
 * drawing texture starts loading crashed the page.
 */
export function ModelLoader() {
  const { active, progress } = useProgress()
  if (!active) return null

  return (
    <p
      role="status"
      className="pointer-events-none absolute inset-0 grid place-items-center text-xs tracking-widest whitespace-nowrap text-ink-muted uppercase"
    >
      Loading model {Math.round(progress)}%
    </p>
  )
}
