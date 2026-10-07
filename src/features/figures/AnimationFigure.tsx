import type { AnimationItem } from 'lottie-web'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { markerSegment, type LottieData } from '../../lib/lottieMarkers'

type AnimationFigureProps = {
  src: string
  alt: string
  /** Lottie marker to play (and loop) from the current view. */
  marker?: string
}

/**
 * A Lottie animation. The light player is imported only when a Lottie
 * figure mounts, keeping it out of the main bundle.
 */
function LottieAnimation({ src, alt, marker }: AnimationFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<{ anim: AnimationItem; data: LottieData } | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    let anim: AnimationItem | undefined
    let cancelled = false

    void Promise.all([
      import('lottie-web/build/player/lottie_light'),
      fetch(src).then((response) => response.json() as Promise<LottieData>),
    ]).then(([{ default: lottie }, data]) => {
      if (cancelled || !containerRef.current) return
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: data,
      })
      setPlayer({ anim, data })
    })

    return () => {
      cancelled = true
      anim?.destroy()
    }
  }, [src])

  // Play the view's marker segment on loop, or the whole animation.
  useEffect(() => {
    if (!player) return
    const { anim, data } = player
    const segment = marker ? markerSegment(data, marker) : null

    if (reducedMotion) {
      // No motion: show the end state of the segment (or the first frame).
      anim.goToAndStop(segment ? segment[1] - 1 : 0, true)
    } else if (segment) {
      anim.playSegments(segment, true)
    } else {
      anim.resetSegments(true)
      anim.play()
    }
  }, [player, marker, reducedMotion])

  return <div ref={containerRef} role="img" aria-label={alt} className="aspect-[4/3] w-full" />
}

/** Animated SVG (plays on its own) or a Lottie file (driven by view markers). */
export function AnimationFigure(props: AnimationFigureProps) {
  if (props.src.endsWith('.json')) return <LottieAnimation {...props} />
  return <img src={props.src} alt={props.alt} loading="lazy" className="block h-auto w-full" />
}
