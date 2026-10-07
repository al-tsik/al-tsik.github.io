import type { ReactNode } from 'react'

type CvSectionProps = {
  id: string
  title: string
  children: ReactNode
}

/** A titled CV section; the id doubles as an anchor link target. */
export function CvSection({ id, title, children }: CvSectionProps) {
  const headingId = `${id}-heading`

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20 border-b border-line py-8">
      <h2 id={headingId} className="font-mono text-xs tracking-widest text-ink-muted uppercase">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
