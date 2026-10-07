import type { ReactNode } from 'react'

type FigureFrameProps = {
  number: number
  caption: string
  /** Opens the figure in the pop-out overlay. */
  onOpen?: () => void
  /** The figure itself (model, drawing, gallery…). */
  children: ReactNode
}

/** Shared figure chrome: the media, an expand button and a "Fig. N —" caption. */
export function FigureFrame({ number, caption, onOpen, children }: FigureFrameProps) {
  return (
    <figure className="group relative">
      <div className="relative overflow-hidden border border-line bg-surface">
        {children}
        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open Fig. ${number} larger`}
            title="Open larger"
            className="absolute top-2 right-2 z-[11] grid size-7 cursor-pointer place-items-center border border-line bg-paper/90 text-xs text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent focus-visible:opacity-100"
          >
            ⤢
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-sm leading-snug">
        <span className="text-xs text-ink-muted">Fig. {number} — </span>
        <span className="font-serif text-ink-muted italic">{caption}</span>
      </figcaption>
    </figure>
  )
}
