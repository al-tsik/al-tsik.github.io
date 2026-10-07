import { useEffect, useRef } from 'react'
import { CvSection } from '../../components/CvSection'
import type { Experience } from '../../content/schema'
import { isBulletLinked, isExperienceLinked } from '../../lib/cvLinks'
import { formatDateRange, formatDuration } from '../../lib/dates'

/** Matches the `lg` breakpoint where the viewer and CV sit side by side. */
const SPLIT_LAYOUT_QUERY = '(min-width: 1024px)'

type ExperienceTimelineProps = {
  experience: Experience[]
  /** Building part whose related bullets should be highlighted, if any. */
  highlightPartId?: string | null
}

export function ExperienceTimeline({
  experience,
  highlightPartId = null,
}: ExperienceTimelineProps) {
  const listRef = useRef<HTMLOListElement>(null)

  // Bring the first related bullet into view when the selection changes.
  // Only in the split layout: on mobile the CV is below the model, and
  // jumping the page would hide the model the visitor just tapped.
  useEffect(() => {
    if (!highlightPartId || !window.matchMedia(SPLIT_LAYOUT_QUERY).matches) return

    const first = listRef.current?.querySelector('[data-linked="true"]')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    first?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }, [highlightPartId])

  const hasHighlight = highlightPartId !== null

  return (
    <CvSection id="experience" title="Experience">
      <ol ref={listRef} className="space-y-8 border-l border-line">
        {experience.map((job) => {
          const jobLinked = isExperienceLinked(job, highlightPartId)

          return (
            <li
              key={job.id}
              id={`experience-${job.id}`}
              className={`relative pl-6 transition-opacity duration-300 ${
                hasHighlight && !jobLinked ? 'opacity-40' : ''
              }`}
            >
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className={`absolute top-1.5 -left-[5px] size-[9px] border ${
                  jobLinked ? 'border-accent bg-accent' : 'border-ink bg-paper'
                }`}
              />

              <p className="font-mono text-xs text-ink-muted">
                {formatDateRange(job.start, job.end)}
                <span className="text-ink-faint"> · {formatDuration(job.start, job.end)}</span>
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">{job.role}</h3>
              <p className="text-sm text-ink-muted">
                {job.company} · {job.location}
              </p>
              <p
                className={`mt-3 border-l-2 pl-3 text-sm leading-relaxed transition-colors ${
                  jobLinked ? 'border-accent' : 'border-transparent'
                }`}
              >
                {job.descriptor}
              </p>

              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-muted">
                {job.bullets.map((bullet) => {
                  const linked = isBulletLinked(bullet, highlightPartId)

                  return (
                    <li key={bullet.text} data-linked={linked} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className={linked ? 'text-accent' : 'text-ink-faint'}
                      >
                        —
                      </span>
                      {linked ? (
                        <mark className="bg-accent-soft text-ink">{bullet.text}</mark>
                      ) : (
                        <span>{bullet.text}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>
    </CvSection>
  )
}
