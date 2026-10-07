import type { Building, Callout, Figure } from '../../content/schema'
import type { ResolvedView } from '../../lib/figureVisibility'
import { BuildingViewer } from '../viewer/BuildingViewer'
import { toModelView } from '../viewer/modelView'
import { DrawingFigure } from './DrawingFigure'
import { ImageFigure } from './ImageFigure'

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
    default:
      // Placeholder until each figure type gets its renderer.
      return (
        <div
          role="img"
          aria-label={figure.alt}
          className="grid aspect-[4/3] place-items-center p-6 text-center font-mono text-xs text-ink-faint"
        >
          {figure.type}
          <br />
          {figure.alt}
        </div>
      )
  }
}
