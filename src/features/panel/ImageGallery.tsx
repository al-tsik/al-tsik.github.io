import { useState } from 'react'
import { Lightbox } from '../../components/Lightbox'
import type { Image } from '../../content/schema'

type ImageGalleryProps = {
  images: Image[]
}

/** Thumbnail grid of detail drawings and photos; click to enlarge. */
export function ImageGallery({ images }: ImageGalleryProps) {
  const [openImage, setOpenImage] = useState<Image | null>(null)

  return (
    <>
      <ul className="grid grid-cols-2 gap-2">
        {images.map((image) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setOpenImage(image)}
              className="group block w-full cursor-zoom-in text-left"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] w-full border border-line bg-surface object-cover transition-colors group-hover:border-accent"
              />
              {image.caption && (
                <span className="mt-1 block font-mono text-[10px] leading-tight text-ink-muted">
                  {image.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox image={openImage} onClose={() => setOpenImage(null)} />
    </>
  )
}
