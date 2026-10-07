import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { embedUrl } from '../../lib/embedUrl'

type VideoFigureProps = {
  alt: string
  src?: string
  poster?: string
  embed?: string
  /** Start time from the current view, in seconds. */
  time?: number
  /** Pause at this time, in seconds. */
  until?: number
}

/** A short local clip that loops like a GIF, seeking to a view's time range. */
function LocalVideo({ src, poster, alt, time, until }: VideoFigureProps & { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // Seek and play whenever the view's time range changes.
  useEffect(() => {
    const video = videoRef.current
    if (!video || time === undefined) return
    video.currentTime = time
    if (!reducedMotion) void video.play().catch(() => {}) // autoplay may be blocked
  }, [time, until, reducedMotion])

  // Stop at `until` instead of looping.
  useEffect(() => {
    const video = videoRef.current
    if (!video || until === undefined) return
    const onTimeUpdate = () => {
      if (video.currentTime >= until) video.pause()
    }
    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [until])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      playsInline
      loop={until === undefined}
      autoPlay={!reducedMotion}
      // Without autoplay, visitors need controls to start it.
      controls={reducedMotion}
      preload="metadata"
      className="block aspect-video w-full bg-surface object-contain"
    />
  )
}

/**
 * Click-to-load embed: nothing is requested from YouTube/Vimeo until the
 * visitor presses play. A new view time reloads the player at that time.
 */
function EmbeddedVideo({ embed, poster, alt, time }: VideoFigureProps & { embed: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const url = embedUrl(embed, time)

  if (!url) {
    return (
      <a
        href={embed}
        target="_blank"
        rel="noreferrer"
        className="block p-6 text-center text-sm underline"
      >
        Watch video ↗
      </a>
    )
  }

  return isLoaded ? (
    <iframe
      key={url}
      src={url}
      title={alt}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="block aspect-video w-full"
    />
  ) : (
    <button
      type="button"
      onClick={() => setIsLoaded(true)}
      className="group relative grid aspect-video w-full cursor-pointer place-items-center bg-ink/5"
    >
      {poster && (
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className="relative inline-flex items-center gap-2 border border-ink bg-paper px-3 py-1.5 text-xs group-hover:border-accent group-hover:text-accent">
        ▶ Play video
      </span>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-ink-muted">
        Loads from {new URL(embed).hostname.replace(/^www\./, '')}
      </span>
    </button>
  )
}

/** A video figure: a local looping clip, or a click-to-load YouTube/Vimeo embed. */
export function VideoFigure(props: VideoFigureProps) {
  if (props.src) return <LocalVideo {...props} src={props.src} />
  if (props.embed) return <EmbeddedVideo {...props} embed={props.embed} />
  return null
}
