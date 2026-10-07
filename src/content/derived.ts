import { indexBullets, numberFigures } from '../lib/figureVisibility'
import { cv, figures } from './index'

/*
 * Lookups derived from content, computed once at startup. Kept separate from
 * index.ts so the raw content stays a plain, validated copy of the JSON.
 */

/** Every bullet and sub-bullet by key (id, or position when it has none). */
export const bulletIndex = indexBullets(cv.experience)

/** Fig. numbers by first mention in the CV. */
export const figureNumbers = numberFigures(figures, cv.experience)

export const figureById = new Map(figures.map((figure) => [figure.id, figure]))

/** The model figure, which bullets with `partIds` show automatically. */
export const modelFigureId = figures.find((figure) => figure.type === 'model')?.id ?? null
