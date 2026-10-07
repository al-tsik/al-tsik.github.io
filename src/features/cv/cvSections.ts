/**
 * The CV's sections in reading order. Single source of truth for section
 * numbers ("1 Experience") and the outline / table of contents.
 */
export const cvSections = [
  { id: 'experience', title: 'Experience' },
  { id: 'skills', title: 'Software & Skills' },
  { id: 'projects', title: 'Personal Projects' },
  { id: 'education', title: 'Education' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'languages', title: 'Languages' },
] as const

export type CvSectionId = (typeof cvSections)[number]['id']

/** 1-based section number, as printed in headings and the outline. */
export function sectionNumber(id: CvSectionId): number {
  return cvSections.findIndex((section) => section.id === id) + 1
}
