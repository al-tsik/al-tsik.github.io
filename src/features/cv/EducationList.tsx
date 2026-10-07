import type { Education } from '../../content/schema'
import { DatedEntry } from './DatedEntry'

type EducationListProps = {
  education: Education[]
}

export function EducationList({ education }: EducationListProps) {
  return (
    <ol>
      {education.map((entry) => {
        const place = [entry.school, entry.location].filter(Boolean).join(', ')

        return (
          <DatedEntry
            key={entry.id}
            id={`education-${entry.id}`}
            start={entry.start}
            end={entry.end}
            heading={
              <h3 className="text-base leading-snug">
                <span className="font-bold">{entry.degree}</span>
                {place && <span className="text-ink-muted"> | {place}</span>}
              </h3>
            }
          >
            {entry.notes && <p className="mt-1 text-body italic">{entry.notes}</p>}
          </DatedEntry>
        )
      })}
    </ol>
  )
}
