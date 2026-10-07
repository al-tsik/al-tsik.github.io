import type { ReactNode } from 'react'
import type { CvSectionInfo } from './cvSections'

type CvSectionProps = {
  section: CvSectionInfo
  children: ReactNode
}

/**
 * A numbered paper section ("1 Experience"). Number and title come from
 * cvSections; the id doubles as the anchor for the outline.
 */
export function CvSection({ section, children }: CvSectionProps) {
  const headingId = `${section.id}-heading`

  return (
    <section id={section.id} aria-labelledby={headingId} className="scroll-mt-8 py-8">
      <h2 id={headingId} className="flex items-baseline gap-3 text-lg font-bold">
        <span className="text-sm text-ink-muted">{section.number}</span>
        {section.title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
