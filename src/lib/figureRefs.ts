export type TextSegment = { type: 'text'; value: string } | { type: 'figure'; id: string }

/** Matches `{fig:some-id}` cross-references in CV text. */
const FIGURE_REF = /\{fig:([a-z0-9]+(?:-[a-z0-9]+)*)\}/g

/**
 * Splits text into plain text and figure references, e.g.
 * "see {fig:section-a-a}." → text "see ", figure "section-a-a", text ".".
 */
export function parseFigureRefs(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(FIGURE_REF)) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'figure', id: match[1] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return segments
}

/** The figure ids referenced in the text, in order of appearance. */
export function figureRefIds(text: string): string[] {
  return parseFigureRefs(text).flatMap((segment) => (segment.type === 'figure' ? [segment.id] : []))
}
