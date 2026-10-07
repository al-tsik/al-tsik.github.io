import type { ReactNode } from 'react'
import { cvSections, sectionNumber, type CvSectionId } from './cvSections'

type CvSectionProps = {
  id: CvSectionId
  children: ReactNode
}

/**
 * A numbered paper section ("1 Experience"). Number and title come from
 * cvSections; the id doubles as the anchor for the outline.
 */
export function CvSection({ id, children }: CvSectionProps) {
  const headingId = `${id}-heading`
  const title = cvSections.find((section) => section.id === id)?.title

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20 py-8">
      <h2 id={headingId} className="flex items-baseline gap-3 font-serif text-lg font-bold">
        <span className="font-mono text-sm text-ink-muted">{sectionNumber(id)}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
