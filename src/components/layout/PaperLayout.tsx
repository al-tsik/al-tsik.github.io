import type { ReactNode } from 'react'

type PaperLayoutProps = {
  /** Left column: figures (model, drawings, scripts…). Sticky on desktop; omitted when empty. */
  figures?: ReactNode
  /** Right column: outline / table of contents. Sticky on desktop. */
  outline?: ReactNode
  /** Centre column: the paper itself. */
  children: ReactNode
}

/**
 * Research-paper layout: figures | centred paper | outline.
 * The paper keeps a comfortable reading measure (~40rem) with generous
 * margins; the side columns stay in view while the page scrolls.
 * Below `lg` the columns stack (figures first, outline hidden).
 */
export function PaperLayout({ figures, outline, children }: PaperLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(18rem,1fr)_minmax(0,40rem)_minmax(10rem,0.6fr)] lg:gap-12 lg:px-8 xl:gap-16">
      {figures && (
        <section
          id="figures"
          aria-label="Figures"
          className="border-b border-line lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:border-b-0 lg:py-8"
        >
          {figures}
        </section>
      )}

      <div className="px-4 lg:px-0">{children}</div>

      <aside
        aria-label="Outline"
        className="hidden lg:sticky lg:top-14 lg:block lg:h-[calc(100dvh-3.5rem)] lg:py-10"
      >
        {outline}
      </aside>
    </div>
  )
}
