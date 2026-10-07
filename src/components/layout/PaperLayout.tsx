import type { ReactNode } from 'react'

type PaperLayoutProps = {
  /** Left column: figures (model, drawings, scripts…), beside their lines; omitted when empty. */
  figures?: ReactNode
  /** Right column: outline / table of contents. Sticky on desktop. */
  outline?: ReactNode
  /** Centre column: the paper itself. */
  children: ReactNode
}

/**
 * Research-paper layout: figures | paper | outline. The paper is a fixed
 * 640px (40rem) column; the two side tracks are equal, so it sits exactly in
 * the middle of the page with the same gap on both sides.
 * Below `lg` the columns stack (figures first, outline hidden).
 */
export function PaperLayout({ figures, outline, children }: PaperLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_40rem_minmax(0,1fr)] lg:gap-x-12 lg:px-8 xl:gap-x-16">
      {figures && (
        <section
          id="figures"
          aria-label="Figures"
          className="border-b border-line lg:border-b-0 lg:py-10"
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
