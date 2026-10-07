import type { Experience } from '../../content/schema'
import { bulletKey } from '../../lib/figureVisibility'
import { BulletItem } from './BulletItem'
import { CvSection } from './CvSection'
import { DatedEntry } from './DatedEntry'

type ExperienceTimelineProps = {
  experience: Experience[]
  /** Fig. numbers each main bullet shows, by bullet key. */
  bulletFigureNumbers: ReadonlyMap<string, number[]>
  /** The focused bullet or sub-bullet key, if any. */
  focusedKey: string | null
  /** The main bullet of the focus (the parent when a sub-bullet is focused). */
  focusedMainKey: string | null
  onBulletFocus: (key: string) => void
}

export function ExperienceTimeline({
  experience,
  bulletFigureNumbers,
  focusedKey,
  focusedMainKey,
  onBulletFocus,
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
              isActive={isActive}
            >
              <h3 className="font-serif text-xl leading-snug">
                <span className="font-medium">{job.role}</span>
                <span className="text-ink-muted">, {job.company}</span>
              </h3>
              <p className="font-serif text-ink-muted italic">{job.location}</p>
              <p
                className={`mt-3 border-l-2 pl-3 font-serif text-body transition-colors ${
                  isActive ? 'border-accent' : 'border-transparent'
                }`}
              >
                {job.descriptor}
              </p>

              <ul className="mt-3 space-y-2 font-serif text-body text-ink-muted">
                {job.bullets.map((bullet, i) => (
                  <BulletItem
                    key={keys[i]}
                    bullet={bullet}
                    bulletKey={keys[i]}
                    focusedKey={focusedKey}
                    figureNumbers={bulletFigureNumbers.get(keys[i]) ?? []}
                    onFocus={onBulletFocus}
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
