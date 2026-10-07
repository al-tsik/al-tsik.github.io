/** The shareable part of the page state. */
export type UrlState = {
  /** Focused bullet or sub-bullet key (`?b=`). */
  bullet: string | null
  /** Figure open in the overlay (`?fig=`). */
  figure: string | null
}

const BULLET = 'b'
const FIGURE = 'fig'

/**
 * Reads the state from a query string like "?b=roof-parapet&fig=section-a-a".
 * Unknown keys are ignored so stale or mistyped links open the overview.
 */
export function readUrlState(
  search: string,
  isBullet: (key: string) => boolean,
  isFigure: (id: string) => boolean,
): UrlState {
  const params = new URLSearchParams(search)
  const bullet = params.get(BULLET)
  const figure = params.get(FIGURE)
  return {
    bullet: bullet && isBullet(bullet) ? bullet : null,
    figure: figure && isFigure(figure) ? figure : null,
  }
}

/** Returns the query string for the state, keeping unrelated params. */
export function writeUrlState(search: string, state: UrlState): string {
  const params = new URLSearchParams(search)
  params.delete('part') // superseded by `b`; drop it from old links
  for (const [name, value] of [
    [BULLET, state.bullet],
    [FIGURE, state.figure],
  ] as const) {
    if (value) params.set(name, value)
    else params.delete(name)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}
