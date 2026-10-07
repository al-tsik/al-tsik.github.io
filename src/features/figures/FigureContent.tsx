import type { Building, Callout, Figure } from '../../content/schema'
import type { ResolvedView } from '../../lib/figureVisibility'
import { BuildingViewer } from '../viewer/BuildingViewer'
import { toModelView } from '../viewer/modelView'
import { AnimationFigure } from './AnimationFigure'
import { DrawingFigure } from './DrawingFigure'
import { DynamoFigure } from './DynamoFigure'
import { GalleryFigure } from './GalleryFigure'
import { ImageFigure } from './ImageFigure'
import { VideoFigure } from './VideoFigure'

type FigureContentProps = {
  figure: Figure
  view: ResolvedView | undefined
  building: Building
  /** Makes drawing callouts clickable. */
  onCalloutClick?: (target: Callout['target']) => void
}

/** Renders a figure's media according to its type and current view. */
export function FigureContent({ figure, view, building, onCalloutClick }: FigureContentProps) {
  switch (figure.type) {
    case 'model':
      return (
        <div className="aspect-[4/3]">
          <BuildingViewer
            modelSrc={building.model.src}
            parts={building.parts}
            view={toModelView(view)}
          />
        </div>
      )
    case 'image':
      return <ImageFigure src={figure.src} alt={figure.alt} region={view?.region} />
    case 'drawing':
      return (
        <DrawingFigure
          src={figure.src}
          alt={figure.alt}
          callouts={figure.callouts}
          region={view?.region}
          onCalloutClick={onCalloutClick}
        />
      )
    case 'dynamo': {
      const script = building.parts
        .flatMap((part) => part.dynamoScripts)
        .find((candidate) => candidate.id === figure.scriptId)
      // Content tests guarantee the script exists; render nothing if it doesn't.
      return script ? (
        <DynamoFigure script={script} region={view?.region} lines={view?.lines} />
      ) : null
    }
    case 'gallery':
      return (
        <GalleryFigure images={figure.images} intervalMs={figure.intervalMs} image={view?.image} />
      )
    case 'video':
      return (
        <VideoFigure
          alt={figure.alt}
          src={figure.src}
          poster={figure.poster}
          embed={figure.embed}
          time={view?.time}
          until={view?.until}
        />
      )
    case 'animation':
      return <AnimationFigure src={figure.src} alt={figure.alt} marker={view?.marker} />
    default: {
      // Exhaustiveness check: adding a figure type to the schema without a
      // renderer here is a compile error.
      const unhandled: never = figure
      return unhandled
    }
  }
}
