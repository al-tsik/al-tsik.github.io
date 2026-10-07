import type { ReactNode } from 'react'

type SplitLayoutProps = {
  /** Left pane: stays pinned while the right pane scrolls (desktop only). */
  aside: ReactNode
  /** Right pane: the scrolling content column. */
  children: ReactNode
}

/**
 * Desktop: the aside is sticky below the header and fills the viewport height
 * while the page scrolls the content column. Mobile: panes stack vertically.
 */
export function SplitLayout({ aside, children }: SplitLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-[3fr_2fr]">
      <section
        id="building"
        aria-label="Building explorer"
        className="h-[60dvh] border-b border-line lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:border-r lg:border-b-0"
      >
        {aside}
      </section>
      <div className="px-4 lg:px-10">{children}</div>
    </div>
  )
}
