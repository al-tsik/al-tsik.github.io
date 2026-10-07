import type { Education } from '../../content/schema'
import { CvSection } from './CvSection'
import { DatedEntry } from './DatedEntry'

type EducationListProps = {
  education: Education[]
}

export function EducationList({ education }: EducationListProps) {
  return (
    <CvSection id="education">
      <ol>
        {education.map((entry) => (
          <DatedEntry
            key={entry.id}
            id={`education-${entry.id}`}
            start={entry.start}
            end={entry.end}
          >
            <h3 className="font-serif text-xl leading-snug font-medium">{entry.degree}</h3>
            <p className="font-serif text-ink-muted italic">
              {entry.school}, {entry.location}
            </p>
            {entry.notes && <p className="mt-2 font-serif text-body">{entry.notes}</p>}
          </DatedEntry>
        ))}
      </ol>
    </CvSection>
  )
}
