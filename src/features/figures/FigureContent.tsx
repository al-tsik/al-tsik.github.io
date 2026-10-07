import type { Building, Figure } from '../../content/schema'
import type { ResolvedView } from '../../lib/figureVisibility'
import { BuildingViewer } from '../viewer/BuildingViewer'
import { toModelView } from '../viewer/modelView'
import { ImageFigure } from './ImageFigure'

type FigureContentProps = {
  figure: Figure
  view: ResolvedView | undefined
  building: Building
}

/** Renders a figure's media according to its type and current view. */
export function FigureContent({ figure, view, building }: FigureContentProps) {
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
