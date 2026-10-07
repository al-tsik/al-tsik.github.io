import type { SkillGroup } from '../../content/schema'
import { CvSection } from './CvSection'

type SkillsListProps = {
  skills: SkillGroup[]
}

export function SkillsList({ skills }: SkillsListProps) {
  return (
    <CvSection id="skills">
      <dl className="space-y-4">
        {skills.map((group) => (
          <div key={group.group} className="grid gap-2 sm:grid-cols-[9rem_1fr]">
            <dt className="text-sm font-medium">{group.group}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line bg-surface px-2 py-0.5 font-mono text-xs"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </CvSection>
  )
}
