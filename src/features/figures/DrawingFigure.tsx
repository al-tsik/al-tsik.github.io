import type { Callout } from '../../content/schema'
import { regionScale, type Region } from '../../lib/region'
import { ZoomRegion } from './ZoomRegion'

type DrawingFigureProps = {
  src: string
  alt: string
  callouts: Callout[]
  region?: Region
  /** Makes callouts clickable; they link to bullets, figures or parts. */
  onCalloutClick?: (target: Callout['target']) => void
}

const markerClass =
  'absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink bg-paper text-[11px]'

/** A vector drawing with numbered callouts, optionally zoomed to a region. */
export function DrawingFigure({ src, alt, callouts, region, onCalloutClick }: DrawingFigureProps) {
  // Markers move with the zoom but keep their size on screen.
  const markerScale = 1 / regionScale(region)

  return (
    <ZoomRegion region={region}>
      <div className="relative">
        <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />

        {callouts.map((callout) => {
          const style = {
            left: `${callout.x}%`,
            top: `${callout.y}%`,
            scale: markerScale,
          }

          return onCalloutClick ? (
            <button
              key={callout.number}
              type="button"
              style={style}
              onClick={() => onCalloutClick(callout.target)}
              aria-label={`Callout ${callout.number}`}
              className={`${markerClass} cursor-pointer transition-colors hover:border-accent hover:bg-accent hover:text-white`}
            >
              {callout.number}
            </button>
          ) : (
            <span key={callout.number} style={style} aria-hidden="true" className={markerClass}>
              {callout.number}
            </span>
          )
        })}
      </div>
    </ZoomRegion>
  )
}
