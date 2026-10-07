import { CvSection } from '../../components/CvSection'
import type { Experience } from '../../content/schema'
import { formatDateRange, formatDuration } from '../../lib/dates'

type ExperienceTimelineProps = {
  experience: Experience[]
}

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  return (
    <CvSection id="experience" title="Experience">
      <ol className="space-y-8 border-l border-line">
        {experience.map((job) => (
          <li key={job.id} id={`experience-${job.id}`} className="relative pl-6">
            {/* Timeline node */}
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[5px] size-[9px] border border-ink bg-paper"
            />

            <p className="font-mono text-xs text-ink-muted">
              {formatDateRange(job.start, job.end)}
              <span className="text-ink-faint"> · {formatDuration(job.start, job.end)}</span>
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{job.role}</h3>
            <p className="text-sm text-ink-muted">
              {job.company} · {job.location}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{job.descriptor}</p>

            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-muted">
              {job.bullets.map((bullet) => (
                <li key={bullet.text} className="flex gap-3">
                  <span aria-hidden="true" className="text-ink-faint">
                    —
                  </span>
                  <span>{bullet.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </CvSection>
  )
}
