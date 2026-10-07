import { useEffect, useState } from 'react'
import type { Image } from '../../content/schema'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type GalleryFigureProps = {
  images: Image[]
  intervalMs: number
  /** Index chosen by the current view; stops the auto-advance. */
  image?: number
}

/** Cross-fading images: auto-advances, or shows the image a view asks for. */
export function GalleryFigure({ images, intervalMs, image }: GalleryFigureProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [autoIndex, setAutoIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // A new view resets a manual pick (adjusting state during render, not in an effect).
  const [lastViewImage, setLastViewImage] = useState(image)
  if (image !== lastViewImage) {
    setLastViewImage(image)
    setPicked(null)
  }

  const index = picked ?? image ?? autoIndex
  const autoAdvance = image === undefined && picked === null && !reducedMotion && !isHovered

  useEffect(() => {
    if (!autoAdvance || images.length < 2) return
    const timer = setInterval(() => setAutoIndex((i) => (i + 1) % images.length), intervalMs)
    return () => clearInterval(timer)
  }, [autoAdvance, images.length, intervalMs])

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative aspect-[4/3]">
        {images.map((item, i) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            aria-hidden={i !== index}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-contain motion-safe:transition-opacity motion-safe:duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2">
        <span aria-live="polite" className="truncate font-mono text-[10px] text-ink-muted">
          {images[index]?.caption ?? images[index]?.alt}
        </span>
        <div className="flex shrink-0 gap-1.5">
          {images.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setPicked(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index || undefined}
              className={`size-2 cursor-pointer rounded-full border ${
                i === index ? 'border-accent bg-accent' : 'border-ink-faint hover:border-ink'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
