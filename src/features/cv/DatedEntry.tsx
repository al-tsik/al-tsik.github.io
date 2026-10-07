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
  children: ReactNode
}

/** One CV entry: a title line with the dates right-aligned, then the content. */
export function DatedEntry({
  id,
  start,
  end,
  heading,
  showDuration = false,
  children,
}: DatedEntryProps) {
  return (
    <li id={id} className="scroll-mt-20 pb-8">
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
    </li>
  )
}
