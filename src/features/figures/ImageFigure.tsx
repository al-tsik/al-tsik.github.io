import type { Region } from '../../lib/region'
import { ZoomRegion } from './ZoomRegion'

type ImageFigureProps = {
  src: string
  alt: string
  region?: Region
}

/** A single image, optionally zoomed to a region by the current view. */
export function ImageFigure({ src, alt, region }: ImageFigureProps) {
  return (
    <ZoomRegion region={region}>
      <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
    </ZoomRegion>
  )
}
