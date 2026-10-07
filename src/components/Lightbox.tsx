import { useEffect, useRef } from 'react'
import type { Image } from '../content/schema'

type LightboxProps = {
  /** The image to show; null keeps the lightbox closed. */
  image: Image | null
  onClose: () => void
}

/**
 * Full-screen image viewer built on the native <dialog> element, which
 * provides focus trapping, Escape to close and a backdrop for free.
 */
export function Lightbox({ image, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (image && !dialog.open) dialog.showModal()
    if (!image && dialog.open) dialog.close()
  }, [image])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a backdrop click.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-label={image?.alt}
      className="m-auto max-h-[90dvh] max-w-[90vw] bg-transparent p-0 backdrop:bg-ink/80"
    >
      {image && (
        <figure className="flex flex-col items-center gap-3">
          <img
            src={image.src}
            alt={image.alt}
            // Explicit width: SVGs without width/height would render tiny.
            className="max-h-[80dvh] w-[min(90vw,64rem)] border border-line bg-surface object-contain"
          />
          {image.caption && (
            <figcaption className="font-mono text-xs text-paper">{image.caption}</figcaption>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-mono text-xs text-paper uppercase hover:text-accent"
          >
            Close ×
          </button>
        </figure>
      )}
    </dialog>
  )
}
