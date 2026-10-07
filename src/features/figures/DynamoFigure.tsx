import type { DynamoScript } from '../../content/schema'
import type { Region } from '../../lib/region'
import { ZoomRegion } from './ZoomRegion'

type DynamoFigureProps = {
  script: DynamoScript
  /** Zoom the graph screenshot to a region. */
  region?: Region
}

/** A Dynamo graph screenshot with the script's title and description. */
export function DynamoFigure({ script, region }: DynamoFigureProps) {
  return (
    <div>
      <ZoomRegion region={region}>
        <img
          src={script.graphImage.src}
          alt={script.graphImage.alt}
          loading="lazy"
          className="block h-auto w-full"
        />
      </ZoomRegion>

      <div className="space-y-1 border-t border-line p-3">
        <p className="text-sm font-semibold tracking-tight">{script.title}</p>
        <p className="text-xs leading-relaxed text-ink-muted">{script.description}</p>
      </div>
    </div>
  )
}
