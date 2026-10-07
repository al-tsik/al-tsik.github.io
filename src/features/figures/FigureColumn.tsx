import type { Building, Figure } from '../../content/schema'
import type { FigureFocus, LinkTarget } from '../../lib/figureVisibility'
import { FigureContent } from './FigureContent'
import { FigureFrame } from './FigureFrame'

type FigureColumnProps = {
  focus: FigureFocus
  figureById: ReadonlyMap<string, Figure>
  numbers: ReadonlyMap<string, number>
  building: Building
  onOpen: (figureId: string) => void
  /** Follows a numbered marker (callout) to a bullet or figure. */
  onLink: (target: LinkTarget) => void
  /** Rendered inside the CV under a bullet (mobile) rather than as the side column. */
  inline?: boolean
}

/** The left column: the figures for the current focus, fading in as they change. */
export function FigureColumn({
  focus,
  figureById,
  numbers,
  building,
  onOpen,
  onLink,
  inline = false,
}: FigureColumnProps) {
  const visible = focus.figureIds.flatMap((id) => figureById.get(id) ?? [])

  return (
    // Fixed width at the inner (right) edge of the column, leaving white space
    // to the left; inline (mobile) figures take the full width.
    <div
      className={
        inline
          ? 'space-y-6 py-4'
          : 'flex flex-col items-end gap-8 p-4 lg:p-0 [&>*]:w-full [&>*]:max-w-[24rem]'
      }
    >
      {visible.map((figure) => (
        // Keyed by id, so a figure that stays visible keeps its state (e.g. the
        // model's camera) while its view changes.
        <div key={figure.id} className="motion-safe:animate-fade-in">
          <FigureFrame
            number={numbers.get(figure.id) ?? 0}
            caption={figure.caption}
            onOpen={() => onOpen(figure.id)}
          >
            <FigureContent
              figure={figure}
              view={focus.views[figure.id]}
              building={building}
              onCalloutClick={onLink}
            />
          </FigureFrame>
        </div>
      ))}
    </div>
  )
}
