import { useEffect, useRef } from 'react'
import type { Experience } from '../../content/schema'
import { isBulletLinked, isExperienceLinked } from '../../lib/cvLinks'
import { BulletItem } from './BulletItem'
import { CvSection } from './CvSection'
import { DatedEntry } from './DatedEntry'

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
    <CvSection id="experience">
      <ol ref={listRef}>
        {experience.map((job) => {
          const jobLinked = isExperienceLinked(job, highlightPartId)

          return (
            <DatedEntry
              key={job.id}
              id={`experience-${job.id}`}
              start={job.start}
              end={job.end}
              showDuration
              isActive={jobLinked}
              isDimmed={hasHighlight && !jobLinked}
            >
              <h3 className="font-serif text-xl leading-snug">
                <span className="font-medium">{job.role}</span>
                <span className="text-ink-muted">, {job.company}</span>
              </h3>
              <p className="font-serif text-ink-muted italic">{job.location}</p>
              <p
                className={`mt-3 border-l-2 pl-3 font-serif text-body transition-colors ${
                  jobLinked ? 'border-accent' : 'border-transparent'
                }`}
              >
                {job.descriptor}
              </p>

              <ul className="mt-3 space-y-2 font-serif text-body text-ink-muted">
                {job.bullets.map((bullet) => (
                  <BulletItem
                    key={bullet.id ?? bullet.text}
                    bullet={bullet}
                    isLinked={isBulletLinked(bullet, highlightPartId)}
                  />
                ))}
              </ul>
            </DatedEntry>
          )
        })}
      </ol>
    </CvSection>
  )
}
