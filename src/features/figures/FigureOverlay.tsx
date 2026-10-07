import { Modal } from '../../components/Modal'
import type { Building, Figure } from '../../content/schema'
import type { FigureFocus } from '../../lib/figureVisibility'
import { FigureContent } from './FigureContent'

type FigureOverlayProps = {
  /** The figure to pop out, or null when closed. */
  figure: Figure | null
  number: number
  /** The current focus, so the figure opens in the view the visitor was looking at. */
  focus: FigureFocus
  building: Building
  onClose: () => void
}

/** A figure popped out large, in its current view; the model becomes fully interactive. */
export function FigureOverlay({ figure, number, focus, building, onClose }: FigureOverlayProps) {
  return (
    <Modal open={figure !== null} onClose={onClose} label={figure ? `Fig. ${number}` : 'Figure'}>
      {figure && (
        <figure className="border border-line bg-paper motion-safe:animate-fade-in">
          <div className="max-h-[80dvh] overflow-auto bg-surface">
            <FigureContent
              figure={figure}
              view={focus.views[figure.id]}
              building={building}
              variant="overlay"
            />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
            <span>
              <span className="font-mono text-xs text-ink-muted">Fig. {number} — </span>
              <span className="font-serif text-ink-muted italic">{figure.caption}</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer font-mono text-xs text-ink-muted uppercase hover:text-accent"
            >
              Close ×
            </button>
          </figcaption>
        </figure>
      )}
    </Modal>
  )
}
