import { lazy, Suspense } from 'react'
import type { Building, Callout, Figure } from '../../content/schema'
import type { ResolvedView } from '../../lib/figureVisibility'
import { toModelView } from '../viewer/modelView'
import { AnimationFigure } from './AnimationFigure'
import { CodeFigure } from './CodeFigure'
import { DrawingFigure } from './DrawingFigure'
import { DynamoFigure } from './DynamoFigure'
import { GalleryFigure } from './GalleryFigure'
import { ImageFigure } from './ImageFigure'
import { VideoFigure } from './VideoFigure'

// three.js, React Three Fiber and drei load only when a model figure renders.
const BuildingViewer = lazy(() =>
  import('../viewer/BuildingViewer').then((module) => ({ default: module.BuildingViewer })),
)

const modelFallback = (
  <p className="grid h-full place-items-center font-mono text-[10px] tracking-widest text-ink-faint uppercase">
    Loading model…
  </p>
)

type FigureContentProps = {
  figure: Figure
  view: ResolvedView | undefined
  building: Building
  /** Compact in the figure column; full size and fully interactive in the pop-out. */
  variant?: 'column' | 'overlay'
  /** Makes model part labels clickable (overlay only). */
  onPartClick?: (partId: string) => void
  /** Makes drawing callouts clickable. */
  onCalloutClick?: (target: Callout['target']) => void
}

/** Renders a figure's media according to its type and current view. */
export function FigureContent({
  figure,
  view,
  building,
  variant = 'column',
  onPartClick,
  onCalloutClick,
}: FigureContentProps) {
  switch (figure.type) {
    case 'model': {
      const isOverlay = variant === 'overlay'
      // The column shows a compact turntable; the pop-out is fully interactive.
      return (
        <div className={isOverlay ? 'h-[80dvh]' : 'aspect-[4/3]'}>
          <Suspense fallback={modelFallback}>
            <BuildingViewer
              modelSrc={building.model.src}
              parts={building.parts}
              view={toModelView(view)}
              showLabels={isOverlay}
              interactive={isOverlay}
              onPartClick={isOverlay ? onPartClick : undefined}
            />
          </Suspense>
        </div>
      )
    }
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
    case 'code':
      return <CodeFigure src={figure.src} language={figure.language} lines={view?.lines} />
    default: {
      // Exhaustiveness check: adding a figure type to the schema without a
      // renderer here is a compile error.
      const unhandled: never = figure
      return unhandled
    }
  }
}
