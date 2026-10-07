import { isCvView, type CvView } from './cvView'

/** The shareable part of the page state. */
export type UrlState = {
  /** How the CV is read (`?cv=`); "both" is the default and left out. */
  view: CvView
  /** Focused bullet or sub-bullet key (`?b=`). */
  bullet: string | null
  /** Figure open in the overlay (`?fig=`). */
  figure: string | null
}

const VIEW = 'cv'
const BULLET = 'b'
const FIGURE = 'fig'

/**
 * Reads the state from a query string like "?cv=developer&b=roof-parapet".
 * Unknown values are ignored so stale or mistyped links open the overview;
 * a bullet counts only if it shows in the link's view.
 */
export function readUrlState(
  search: string,
  isBullet: (key: string, view: CvView) => boolean,
  isFigure: (id: string) => boolean,
): UrlState {
  const params = new URLSearchParams(search)
  const viewParam = params.get(VIEW)
  const view = viewParam && isCvView(viewParam) ? viewParam : 'both'
  const bullet = params.get(BULLET)
  const figure = params.get(FIGURE)
  return {
    view,
    bullet: bullet && isBullet(bullet, view) ? bullet : null,
    figure: figure && isFigure(figure) ? figure : null,
  }
}

/** Returns the query string for the state, keeping unrelated params. */
export function writeUrlState(search: string, state: UrlState): string {
  const params = new URLSearchParams(search)
  params.delete('part') // superseded by `b`; drop it from old links
  for (const [name, value] of [
    [VIEW, state.view === 'both' ? null : state.view],
    [BULLET, state.bullet],
    [FIGURE, state.figure],
  ] as const) {
    if (value) params.set(name, value)
    else params.delete(name)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}
