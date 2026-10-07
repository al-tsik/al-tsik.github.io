import { cvSections } from '../features/cv/cvSections'
import { figureForLine, indexBullets, numberFigures } from '../lib/figureVisibility'
import { cv, figures } from './index'

/*
 * Lookups derived from content, computed once at startup. Kept separate from
 * index.ts so the raw content stays a plain, validated copy of the JSON.
 */

/** The CV sections that have content, numbered in reading order. */
export const sections = cvSections(cv)

/** Every bullet and sub-bullet by key (id, or position when it has none). */
export const bulletIndex = indexBullets(cv.experience)

/** Fig. numbers by first mention in the CV. */
export const figureNumbers = numberFigures(figures, cv.experience)

export const figureById = new Map(figures.map((figure) => [figure.id, figure]))

/** Figure type by id (e.g. to find model lines). */
export const figureTypes = new Map(figures.map((figure) => [figure.id, figure.type]))

/**
 * Fig. number of each line's own figure, for the "Fig. N" hint. Sub-bullets
 * without their own figure are left out (they show their parent's).
 */
export const lineFigureNumbers = new Map(
  [...bulletIndex.values()].flatMap((entry) => {
    const ownView = entry.sub ? entry.sub.figure : entry.bullet.figure
    const line = ownView ? figureForLine(entry) : null
    const number = line && figureNumbers.get(line.figureId)
    return number ? [[entry.key, number] as const] : []
  }),
)
