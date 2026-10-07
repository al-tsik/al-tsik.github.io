import type { ReactNode } from 'react'
import { formatDuration, formatYearMonth } from '../../lib/dates'

type DatedEntryProps = {
  id: string
  start: string
  end: string
  /** Show the computed duration under the dates (e.g. for jobs). */
  showDuration?: boolean
  /** Accent the timeline node (e.g. when related to the current selection). */
  isActive?: boolean
  /** Fade the entry back (e.g. when unrelated to the current selection). */
  isDimmed?: boolean
  children: ReactNode
}

/**
 * One entry on a paper-style timeline: dates in a mono gutter on the left,
 * a hairline connector with a square node, and the content on the right.
 * Render inside an <ol> so the connector runs between consecutive entries.
 */
export function DatedEntry({
  id,
  start,
  end,
  showDuration = false,
  isActive = false,
  isDimmed = false,
  children,
}: DatedEntryProps) {
  return (
    <li
      id={id}
      className={`grid grid-cols-[5.5rem_1fr] gap-x-6 transition-opacity duration-300 ${
        isDimmed ? 'opacity-40' : ''
      }`}
    >
      <p className="pt-1.5 text-right font-mono text-[11px] leading-snug text-ink-muted">
        {formatYearMonth(start)} —
        <br />
        {formatYearMonth(end)}
        {showDuration && (
          <span className="mt-1 block text-ink-faint">{formatDuration(start, end)}</span>
        )}
      </p>

      {/* Connector line with a square node, then the entry content. */}
      <div className="relative border-l border-line pb-10 pl-6">
        <span
          aria-hidden="true"
          className={`absolute top-2.5 -left-[5px] size-[9px] border ${
            isActive ? 'border-accent bg-accent' : 'border-ink bg-paper'
          }`}
        />
        {children}
      </div>
    </li>
  )
}
