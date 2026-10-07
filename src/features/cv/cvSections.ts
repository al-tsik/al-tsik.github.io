import type { Cv } from '../../content/schema'

/**
 * Every CV section in reading order. Each id is also the key of its entries
 * in cv.json, so a section with no entries can be left out.
 */
const allSections = [
  { id: 'experience', title: 'Experience' },
  { id: 'skills', title: 'Software & Skills' },
  { id: 'projects', title: 'Personal Projects' },
  { id: 'education', title: 'Education' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'languages', title: 'Languages' },
] as const satisfies readonly { id: keyof Cv; title: string }[]

export type CvSectionId = (typeof allSections)[number]['id']

export type CvSectionInfo = {
  id: CvSectionId
  title: string
  /** 1-based, as printed in headings and the outline. */
  number: number
}

/**
 * The sections that have content, numbered in reading order. Single source of
 * truth for section numbers ("1 Experience") and the outline.
 */
export function cvSections(cv: Cv): CvSectionInfo[] {
  return allSections
    .filter((section) => cv[section.id].length > 0)
    .map((section, index) => ({ ...section, number: index + 1 }))
}
