import { Modal } from '../../components/Modal'
import type { Building, Figure } from '../../content/schema'
import type { LinkTarget, ResolvedView } from '../../lib/figureVisibility'
import { FigureContent } from './FigureContent'

type FigureOverlayProps = {
  /** The figure to pop out, or null when closed. */
  figure: Figure | null
  number: number
  /** The view the figure had on the page, so it opens as the visitor saw it. */
  view: ResolvedView | undefined
  building: Building
  onClose: () => void
  /** Follows a numbered marker (callout or part label) to a bullet or figure. */
  onLink: (target: LinkTarget) => void
}

/** A figure popped out large, in its current view; the model becomes fully interactive. */
export function FigureOverlay({
  figure,
  number,
  view,
  building,
  onClose,
  onLink,
}: FigureOverlayProps) {
  return (
    <Modal open={figure !== null} onClose={onClose} label={figure ? `Fig. ${number}` : 'Figure'}>
      {figure && (
        <figure className="border border-line bg-paper motion-safe:animate-fade-in">
          <div className="max-h-[80dvh] overflow-auto bg-surface">
            <FigureContent
              figure={figure}
              view={view}
              building={building}
              variant="overlay"
              onCalloutClick={onLink}
              onPartClick={(part) => onLink({ part })}
            />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
            <span>
              <span className="text-xs text-ink-muted">Fig. {number} — </span>
              <span className="font-serif text-ink-muted italic">{figure.caption}</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer text-xs text-ink-muted uppercase hover:text-accent"
            >
              Close ×
            </button>
          </figcaption>
        </figure>
      )}
    </Modal>
  )
}
