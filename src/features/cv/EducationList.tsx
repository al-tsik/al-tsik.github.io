import { CvSection } from '../../components/CvSection'
import type { Education } from '../../content/schema'
import { formatDateRange } from '../../lib/dates'

type EducationListProps = {
  education: Education[]
}

export function EducationList({ education }: EducationListProps) {
  return (
    <CvSection id="education" title="Education">
      <ul className="space-y-6">
        {education.map((entry) => (
          <li key={entry.id}>
            <p className="font-mono text-xs text-ink-muted">
              {formatDateRange(entry.start, entry.end)}
            </p>
            <h3 className="mt-1 font-semibold tracking-tight">{entry.degree}</h3>
            <p className="text-sm text-ink-muted">
              {entry.school} · {entry.location}
            </p>
            {entry.notes && <p className="mt-2 text-sm leading-relaxed">{entry.notes}</p>}
          </li>
        ))}
      </ul>
    </CvSection>
  )
}
