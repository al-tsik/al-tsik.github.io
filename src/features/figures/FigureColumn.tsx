import type { Building, Figure } from '../../content/schema'
import type { FigureFocus } from '../../lib/figureVisibility'
import { FigureContent } from './FigureContent'
import { FigureFrame } from './FigureFrame'

type FigureColumnProps = {
  focus: FigureFocus
  figureById: ReadonlyMap<string, Figure>
  numbers: ReadonlyMap<string, number>
  building: Building
  onOpen: (figureId: string) => void
}

/** The left column: the figures for the current focus, fading in as they change. */
export function FigureColumn({ focus, figureById, numbers, building, onOpen }: FigureColumnProps) {
  const visible = focus.figureIds.flatMap((id) => figureById.get(id) ?? [])

  return (
    <div className="space-y-8 p-4 lg:p-0">
      {visible.map((figure) => (
        // Keyed by id, so a figure that stays visible keeps its state (e.g. the
        // model's camera) while its view changes.
        <div key={figure.id} className="motion-safe:animate-fade-in">
          <FigureFrame
            number={numbers.get(figure.id) ?? 0}
            caption={figure.caption}
            onOpen={() => onOpen(figure.id)}
          >
            <FigureContent figure={figure} view={focus.views[figure.id]} building={building} />
          </FigureFrame>
        </div>
      ))}
    </div>
  )
}
