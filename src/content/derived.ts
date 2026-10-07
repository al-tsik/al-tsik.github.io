import { cvSections, type CvSectionInfo } from '../features/cv/cvSections'
import { filterCv, type CvView } from '../lib/cvView'
import {
  figureForLine,
  indexBullets,
  numberFigures,
  type BulletEntry,
} from '../lib/figureVisibility'
import { cv, figures } from './index'
import type { Cv } from './schema'

/*
 * Lookups derived from content, computed once at startup. Kept separate from
 * index.ts so the raw content stays a plain, validated copy of the JSON.
 */

export const figureById = new Map(figures.map((figure) => [figure.id, figure]))

/** Figure type by id (e.g. to find model lines). */
export const figureTypes = new Map(figures.map((figure) => [figure.id, figure.type]))

/** The CV as read in one view, with the lookups the page needs. */
export type CvContent = {
  cv: Cv
  /** The sections that have content, numbered in reading order. */
  sections: CvSectionInfo[]
  /** Every bullet and sub-bullet by key (id, or position when it has none). */
  bulletIndex: Map<string, BulletEntry>
  /** Fig. numbers by first mention in this view, so they run 1, 2, 3… */
  figureNumbers: Map<string, number>
  /**
   * Fig. number of each line's own figure, for the "Fig. N" hint. Sub-bullets
   * without their own figure are left out (they show their parent's).
   */
  lineFigureNumbers: Map<string, number>
}

function deriveContent(view: CvView): CvContent {
  const viewCv = filterCv(cv, view)
  const bulletIndex = indexBullets(viewCv.experience)
  const figureNumbers = numberFigures(figures, viewCv.experience)
  const lineFigureNumbers = new Map(
    [...bulletIndex.values()].flatMap((entry) => {
      const ownView = entry.sub ? entry.sub.figure : entry.bullet.figure
      const line = ownView ? figureForLine(entry) : null
      const number = line && figureNumbers.get(line.figureId)
      return number ? [[entry.key, number] as const] : []
    }),
  )

  return {
    cv: viewCv,
    sections: cvSections(viewCv),
    bulletIndex,
    figureNumbers,
    lineFigureNumbers,
  }
}

/** The content in each view. Stable objects, so switching views is cheap. */
export const contentByView: Record<CvView, CvContent> = {
  both: deriveContent('both'),
  developer: deriveContent('developer'),
  architect: deriveContent('architect'),
}
