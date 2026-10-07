import type { ReactNode } from 'react'
import type { Experience } from '../../content/schema'
import { bulletKey } from '../../lib/figureVisibility'
import { BulletItem } from './BulletItem'
import { CvSection } from './CvSection'
import { DatedEntry } from './DatedEntry'
import { FigureRefText } from './FigureRefText'

type ExperienceTimelineProps = {
  experience: Experience[]
  /** Fig. numbers each main bullet shows, by bullet key. */
  bulletFigureNumbers: ReadonlyMap<string, number[]>
  /** Fig. numbers by figure id, for cross-references in the text. */
  figureNumbers: ReadonlyMap<string, number>
  /** Opens a figure from a cross-reference in a role descriptor. */
  onFigureOpen: (figureId: string) => void
  /** The focused bullet or sub-bullet key, if any. */
  focusedKey: string | null
  /** The main bullet of the focus (the parent when a sub-bullet is focused). */
  focusedMainKey: string | null
  onBulletFocus: (key: string) => void
  /** Figures rendered under the focused bullet (mobile layout). */
  inlineFigures?: ReactNode
}

export function ExperienceTimeline({
  experience,
  bulletFigureNumbers,
  figureNumbers,
  onFigureOpen,
  focusedKey,
  focusedMainKey,
  onBulletFocus,
  inlineFigures,
}: ExperienceTimelineProps) {
  return (
    <CvSection id="experience">
      <ol>
        {experience.map((job) => {
          const keys = job.bullets.map((bullet, i) => bulletKey(job.id, bullet, i))
          // The role is active when one of its bullets (or sub-bullets) is focused.
          const isActive = focusedMainKey !== null && keys.includes(focusedMainKey)

          return (
            <DatedEntry
              key={job.id}
              id={`experience-${job.id}`}
              start={job.start}
              end={job.end}
              showDuration
              heading={
                <h3 className="font-serif text-base leading-snug">
                  <span className="font-bold">{job.role}</span>
                  <span className="text-ink-muted">
                    {' | '}
                    {job.company}, {job.location}
                  </span>
                </h3>
              }
            >
              <p
                className={`mt-3 border-l-2 pl-3 font-serif text-body transition-colors ${
                  isActive ? 'border-accent' : 'border-transparent'
                }`}
              >
                <FigureRefText
                  text={job.descriptor}
                  numbers={figureNumbers}
                  onFigureClick={onFigureOpen}
                />
              </p>

              <ul className="mt-3 space-y-2 font-serif text-body text-ink-muted">
                {job.bullets.map((bullet, i) => (
                  <BulletItem
                    key={keys[i]}
                    bullet={bullet}
                    bulletKey={keys[i]}
                    focusedKey={focusedKey}
                    figureNumbers={bulletFigureNumbers.get(keys[i]) ?? []}
                    numbers={figureNumbers}
                    onFocus={onBulletFocus}
                    inlineFigures={keys[i] === focusedMainKey ? inlineFigures : undefined}
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
