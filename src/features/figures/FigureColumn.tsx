import { useRef } from 'react'
import { endPreview, holdPreview } from '../../state/hoverIntent'
import type { Building, Figure } from '../../content/schema'
import type { LineFigure, LinkTarget } from '../../lib/figureVisibility'
import { FigureContent } from './FigureContent'
import { FigureFrame } from './FigureFrame'
import { useMarginTops } from './useMarginTops'

type FigureColumnProps = {
  /** The figures to show, each anchored to its line in the CV. */
  lines: LineFigure[]
  figureById: ReadonlyMap<string, Figure>
  numbers: ReadonlyMap<string, number>
  building: Building
  onOpen: (figureId: string) => void
  /** Follows a numbered marker (callout) to a bullet or figure. */
  onLink: (target: LinkTarget) => void
  /** Rendered inside the CV under a line (mobile) rather than in the margin. */
  inline?: boolean
}

/**
 * Figures in the margin, each level with its line in the CV like a sidenote
 * (or stacked inline on mobile). Keyed by figure id, so a figure that stays
 * on screen keeps its state (e.g. the model's camera) as it moves lines.
 */
export function FigureColumn({
  lines,
  figureById,
  numbers,
  building,
  onOpen,
  onLink,
  inline = false,
}: FigureColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef(new Map<string, HTMLElement>())
  const visible = lines.flatMap((line) => {
    const figure = figureById.get(line.figureId)
    return figure ? [{ line, figure }] : []
  })
  const layout = useMarginTops(
    visible.map(({ line }) => line.key),
    containerRef,
    itemRefs,
    visible.map(({ figure }) => figure.id),
  )

  const renderFigure = (line: LineFigure, figure: Figure) => (
    <FigureFrame
      number={numbers.get(figure.id) ?? 0}
      caption={figure.caption}
      onOpen={() => onOpen(figure.id)}
    >
      <FigureContent figure={figure} view={line.view} building={building} onCalloutClick={onLink} />
    </FigureFrame>
  )

  if (inline) {
    return (
      <div className="space-y-6 py-4">
        {visible.map(({ line, figure }) => (
          <div key={figure.id} className="motion-safe:animate-fade-in">
            {renderFigure(line, figure)}
          </div>
        ))}
      </div>
    )
  }

  return (
    // Figures are positioned absolutely beside their lines; the container grows
    // to fit the lowest one. Fixed width at the inner (right) edge, leaving
    // white space to the left.
    <div ref={containerRef} className="relative" style={{ minHeight: layout?.height ?? 0 }}>
      {visible.map(({ line, figure }, i) => (
        <div
          key={figure.id}
          ref={(element) => {
            if (element) itemRefs.current.set(figure.id, element)
            else itemRefs.current.delete(figure.id)
          }}
          // Keep a hover preview while the pointer is on the figure itself.
          onPointerEnter={holdPreview}
          onPointerLeave={() => endPreview()}
          className="absolute right-0 w-full max-w-[24rem] motion-safe:animate-fade-in motion-safe:transition-[top] motion-safe:duration-500"
          // Hidden until measured, so figures don't flash at the top first.
          style={{ top: layout?.tops[i] ?? 0, visibility: layout ? 'visible' : 'hidden' }}
        >
          {renderFigure(line, figure)}
        </div>
      ))}
    </div>
  )
}
