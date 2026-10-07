import { parseFigureRefs } from '../../lib/figureRefs'

type FigureRefTextProps = {
  text: string
  /** Fig. numbers by figure id. */
  numbers: ReadonlyMap<string, number>
  /**
   * Makes references buttons that open the figure. Leave out when the text
   * is already inside a button (a bullet), where the reference is shown with
   * the bullet's figures instead.
   */
  onFigureClick?: (figureId: string) => void
}

const refClass = 'font-mono text-[0.8em] text-ink-muted'

/** Text with `{fig:id}` cross-references rendered as "Fig. N", like a paper. */
export function FigureRefText({ text, numbers, onFigureClick }: FigureRefTextProps) {
  return parseFigureRefs(text).map((segment, i) => {
    if (segment.type === 'text') return segment.value

    const label = `Fig. ${numbers.get(segment.id) ?? '?'}`
    return onFigureClick ? (
      <button
        key={i}
        type="button"
        onClick={() => onFigureClick(segment.id)}
        className={`${refClass} cursor-pointer underline decoration-line underline-offset-4 hover:text-accent`}
      >
        {label}
      </button>
    ) : (
      <span key={i} className={refClass}>
        {label}
      </span>
    )
  })
}
