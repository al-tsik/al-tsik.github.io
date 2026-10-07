import type { ReactNode } from 'react'
import { formatDuration, formatYearMonth } from '../../lib/dates'

type DatedEntryProps = {
  id: string
  start: string
  end: string
  /** The entry's title line (e.g. "Role | Company"); dates sit to its right. */
  heading: ReactNode
  /** Show the computed duration as a tooltip on the dates (e.g. for jobs). */
  showDuration?: boolean
  /** Accent the timeline node (e.g. when related to the current selection). */
  isActive?: boolean
  children: ReactNode
}

/**
 * One entry on a paper-style timeline: a hairline connector with a square
 * node, then a title line with the dates right-aligned, then the content.
 * Render inside an <ol> so the connector runs between consecutive entries.
 */
export function DatedEntry({
  id,
  start,
  end,
  heading,
  showDuration = false,
  isActive = false,
  children,
}: DatedEntryProps) {
  return (
    // minmax(0, 1fr): let wide content (figures, long words) shrink instead of
    // pushing the page sideways.
    <li
      id={id}
      className="grid scroll-mt-20 grid-cols-[minmax(0,1fr)] sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-6"
    >
      <span aria-hidden="true" />

      {/* Connector line with a square node, then the entry content. */}
      <div className="relative border-l border-line pb-10 pl-6">
        <span
          aria-hidden="true"
          className={`absolute top-2.5 -left-[5px] size-[9px] border ${
            isActive ? 'border-accent bg-accent' : 'border-ink bg-paper'
          }`}
        />
        <div className="flex items-baseline justify-between gap-4">
          {heading}
          <p
            title={showDuration ? formatDuration(start, end) : undefined}
            className="shrink-0 font-mono text-[11px] text-ink-muted"
          >
            {formatYearMonth(start)} – {formatYearMonth(end)}
          </p>
        </div>
        {children}
      </div>
    </li>
  )
}
