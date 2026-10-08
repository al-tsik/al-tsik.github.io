import type { DynamoScript } from '../../content/schema'
import type { Region } from '../../lib/region'
import { ZoomRegion } from './ZoomRegion'

type DynamoFigureProps = {
  script: DynamoScript
  /** Zoom the graph screenshot to a region. */
  region?: Region
}

/** A Dynamo graph screenshot; the figure caption describes it. */
export function DynamoFigure({ script, region }: DynamoFigureProps) {
  return (
    <ZoomRegion region={region}>
      <img
        src={script.graphImage.src}
        alt={script.graphImage.alt}
        loading="lazy"
        className="block h-auto w-full"
      />
    </ZoomRegion>
  )
}
