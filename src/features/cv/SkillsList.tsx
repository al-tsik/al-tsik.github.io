import type { SkillGroup } from '../../content/schema'
import { CvSection } from './CvSection'

type SkillsListProps = {
  skills: SkillGroup[]
}

export function SkillsList({ skills }: SkillsListProps) {
  return (
    <CvSection id="skills">
      <dl className="space-y-3 text-body">
        {skills.map((group) => (
          <div key={group.group} className="grid gap-x-6 sm:grid-cols-[11rem_1fr]">
            <dt className="text-ink-muted italic">{group.group}</dt>
            <dd>{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </CvSection>
  )
}
